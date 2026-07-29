import { siteConfig } from '@/lib/site';

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
};

export type SendResult = {
  ok: boolean;
  provider: 'resend' | 'smtp' | 'console';
  id?: string;
  error?: string;
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

export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  const provider = emailProvider();

  try {
    switch (provider) {
      case 'resend':
        return await sendWithResend(message);
      case 'smtp':
        return await sendWithSmtp(message);
      default:
        return logToConsole(message);
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown email error';
    // Never let a transport failure take down a form submission — the enquiry
    // is already persisted (or logged) and the customer should still see
    // success. The failure is logged for operators to pick up.
    console.error(`[email] ${provider} delivery failed: ${reason}`);
    return { ok: false, provider, error: reason };
  }
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
