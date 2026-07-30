import { siteConfig } from '@/lib/site';
import { spool, drainSpool } from '@/lib/email/queue';

/**
 * Transport-agnostic email sending.
 *
 * Three providers are supported and selected automatically:
 *   1. Resend      — set RESEND_API_KEY
 *   2. SMTP        — set SMTP_HOST (plus user/pass)
 *   3. Console log — neither configured (development default)
 *
 * The console transport means forms are fully testable locally with no
 * credentials, and a first Railway deploy succeeds before email is wired up.
 */

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
  /** The enquiry's reference, carried so a spooled failure can be traced to it. */
  reference?: string;
};

export type SendResult = {
  ok: boolean;
  provider: 'resend' | 'smtp' | 'console';
  id?: string;
  error?: string;
  /**
   * Delivery failed but the message is on disk and will be retried.
   *
   * The distinction matters to the caller: `ok: false` alone used to mean the
   * enquiry was gone, and a route seeing it told the customer to phone instead.
   * A held message has not been lost, so that would now be a lie in the
   * pessimistic direction — which costs a real enquiry just as surely.
   */
  held?: boolean;
};

function fromAddress() {
  return process.env.EMAIL_FROM || `${siteConfig.name} <no-reply@${siteConfig.domain}>`;
}

export function internalRecipients() {
  const configured = process.env.EMAIL_TO || siteConfig.contact.email;
  return configured
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
}

export function emailProvider(): SendResult['provider'] {
  if (process.env.RESEND_API_KEY) return 'resend';
  if (process.env.SMTP_HOST) return 'smtp';
  return 'console';
}

/** True when a real transport is configured — surfaced on the health endpoint. */
export const isEmailConfigured = emailProvider() !== 'console';

async function sendWithResend(message: EmailMessage): Promise<SendResult> {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to: Array.isArray(message.to) ? message.to : [message.to],
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: message.replyTo,
    attachments: message.attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
    })),
  });

  if (error) {
    return { ok: false, provider: 'resend', error: error.message };
  }

  return { ok: true, provider: 'resend', id: data?.id };
}

async function sendWithSmtp(message: EmailMessage): Promise<SendResult> {
  const nodemailer = (await import('nodemailer')).default;

  const port = Number(process.env.SMTP_PORT || 587);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Implicit TLS on 465, STARTTLS everywhere else.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
  });

  const info = await transporter.sendMail({
    from: fromAddress(),
    to: Array.isArray(message.to) ? message.to.join(', ') : message.to,
    subject: message.subject,
    html: message.html,
    text: message.text,
    replyTo: message.replyTo,
    attachments: message.attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType,
    })),
  });

  return { ok: true, provider: 'smtp', id: info.messageId };
}

function logToConsole(message: EmailMessage): SendResult {
  const banner = '─'.repeat(72);
  console.info(
    [
      '',
      banner,
      '  EMAIL (not sent — no transport configured)',
      banner,
      `  To:       ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`,
      `  From:     ${fromAddress()}`,
      `  Reply-To: ${message.replyTo ?? '—'}`,
      `  Subject:  ${message.subject}`,
      message.attachments?.length
        ? `  Files:    ${message.attachments.map((a) => a.filename).join(', ')}`
        : null,
      banner,
      message.text,
      banner,
      '  Set RESEND_API_KEY or SMTP_HOST to deliver this for real.',
      banner,
      '',
    ]
      .filter(Boolean)
      .join('\n'),
  );

  return { ok: true, provider: 'console', id: `console-${Date.now()}` };
}

/**
 * Strips control characters from anything that becomes an email header.
 *
 * A carriage return inside a header value is how header injection works:
 * everything after it is parsed as a new header, so a contact-form subject of
 * `"Enquiry\r\nBcc: attacker@example.com"` becomes a blind copy to an address
 * the sender chose. Confirmed reachable from the contact form before this
 * existed — the schema caps the subject's length but said nothing about newlines.
 *
 * Fixed here rather than in the schema because this is where headers are
 * actually constructed. Every route, and every route added later, goes through
 * this function; a rule in one schema protects one form and has to be remembered
 * again for the next.
 *
 * Nodemailer folds most subjects safely on its own. Relying on a library's
 * encoder to contain a hostile value is the wrong place to make that decision.
 */
const CONTROL_CHARS = /[\u0000-\u001f\u007f]+/g;

function headerSafe(value: string) {
  return value.replace(CONTROL_CHARS, ' ').trim();
}

/** Delivers once, without retry or spooling — the primitive the rest builds on. */
async function deliverOnce(message: EmailMessage, provider: SendResult['provider']) {
  switch (provider) {
    case 'resend':
      return sendWithResend(message);
    case 'smtp':
      return sendWithSmtp(message);
    default:
      return logToConsole(message);
  }
}

const RETRY_DELAYS_MS = [400, 1_600, 4_000];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sends an email, and does not lose it.
 *
 * Three attempts with growing gaps, because the overwhelming majority of
 * transport failures are a provider having a bad few seconds. If all three fail
 * the message is spooled to disk and retried on the back of later traffic — the
 * customer has already been told their enquiry arrived, and it has to be true.
 *
 * The call never throws and never blocks a form response on a slow relay: routes
 * fire it and move on. What it returns is for logging.
 */
export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  const provider = emailProvider();

  // Sanitise once, here, so no transport can be handed a hostile header.
  const safe: EmailMessage = {
    ...message,
    subject: headerSafe(message.subject),
    replyTo: message.replyTo ? headerSafe(message.replyTo) : undefined,
    attachments: message.attachments?.map((attachment) => ({
      ...attachment,
      // A filename crosses into a Content-Disposition header, and a path
      // separator in one is how an attachment escapes its own directory.
      filename: headerSafe(attachment.filename).replace(/[/\\]/g, '-'),
    })),
  };

  let lastError = 'Unknown email error';

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      const result = await deliverOnce(safe, provider);

      if (result.ok) {
        // A success is the cue to try anything still waiting. Traffic is the
        // clock; there is no scheduler to keep alive.
        void drainSpool((pending) => deliverOnce(pending, provider)).catch(() => undefined);
        return result;
      }

      lastError = result.error ?? lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }

    const delay = RETRY_DELAYS_MS[attempt];
    if (delay !== undefined) {
      console.warn(`[email] ${provider} attempt ${attempt + 1} failed (${lastError}) — retrying`);
      await wait(delay);
    }
  }

  console.error(`[email] ${provider} delivery failed after retries: ${lastError}`);
  const held = await spool(safe, safe.reference);

  return { ok: false, provider, error: lastError, held };
}

/** Human-readable reference, e.g. "EPX-7K3F9Q". */
export function generateReference(prefix = 'EPX') {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${suffix}`;
}
