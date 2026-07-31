import { spool, drainSpool } from '@/lib/email/queue';
import { sendWithResend } from '@/lib/email/resend';
import { sendWithSmtp } from '@/lib/email/smtp';
import { emailProvider, fromAddress, ownerRecipients, replyToAddress } from '@/lib/email/config';
import type { EmailMessage, EmailProvider, SendResult } from '@/lib/email/types';

export type { EmailMessage, EmailAttachment, SendResult } from '@/lib/email/types';
export { emailProvider, fromAddress, ownerRecipients, replyToAddress };

/**
 * Sending email, and not losing it.
 *
 * Three transports, selected automatically:
 *
 *   1. **Resend** — `RESEND_API_KEY`. The production path. See `resend.ts` for the
 *      pacing, idempotency and error classification that live there.
 *   2. **SMTP** — `SMTP_HOST`. A mailbox at your own host, no third party.
 *   3. **Console** — neither configured. Prints what it would have sent.
 *
 * The console transport is why a first deploy succeeds before email exists: every
 * form works, every validation runs, and the inquiry is printed rather than
 * delivered. It is also how the whole pipeline is testable with no credentials.
 */

/**
 * Strips control characters from anything that becomes an email header.
 *
 * A carriage return inside a header value is how header injection works:
 * everything after it is parsed as a new header, so a contact-form subject of
 * `"Inquiry\r\nBcc: attacker@example.com"` becomes a blind copy to an address
 * the sender chose. Confirmed reachable from the contact form before this
 * existed — the schema caps the subject's length but said nothing about newlines.
 *
 * Fixed here rather than in the schema because this is where headers are actually
 * constructed. Every route, and every route added later, goes through this
 * function; a rule in one schema protects one form and has to be remembered again
 * for the next.
 *
 * Nodemailer folds most subjects safely on its own. Relying on a library's encoder
 * to contain a hostile value is the wrong place to make that decision.
 */
const CONTROL_CHARS = /[\u0000-\u001f\u007f]+/g;

function headerSafe(value: string) {
  return value.replace(CONTROL_CHARS, ' ').trim();
}

/**
 * A stable idempotency key for one message.
 *
 * The reference identifies the inquiry; the recipient distinguishes the owner
 * notification from the customer confirmation, which share it. Retries of the same
 * message reuse the key and are collapsed by the provider; two different messages
 * never collide.
 *
 * Returns undefined without a reference, which is correct — a message with no
 * reference has nothing stable to key on, and a guessed key is worse than none.
 */
export function messageKey(reference: string | undefined, to: string | string[]) {
  if (!reference) return undefined;
  const recipients = (Array.isArray(to) ? to : [to]).join(',');
  return `${reference}:${recipients}`.slice(0, 256);
}

function logToConsole(message: EmailMessage): SendResult {
  const banner = '─'.repeat(72);
  console.info(
    [
      '',
      banner,
      '  EMAIL (not sent, no transport configured)',
      banner,
      `  To:       ${Array.isArray(message.to) ? message.to.join(', ') : message.to}`,
      `  From:     ${fromAddress()}`,
      `  Reply-To: ${message.replyTo ?? ','}`,
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

/** Delivers once, without retry or spooling — the primitive the rest builds on. */
async function deliverOnce(message: EmailMessage, provider: EmailProvider): Promise<SendResult> {
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
 * Three attempts with growing gaps, because the overwhelming majority of transport
 * failures are a provider having a bad few seconds. If all three fail the message
 * is spooled to disk and retried on the back of later traffic — the customer has
 * already been told their inquiry arrived, and it has to be true.
 *
 * A failure the transport reports as *permanent* skips both the retries and the
 * spool. Trying an invalid API key three more times costs the visitor six seconds
 * and changes nothing, and spooling the result fills the queue with messages that
 * can never be delivered rather than ones that are merely delayed.
 *
 * The call never throws. What it returns is for the route to decide what to tell
 * the customer.
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
    idempotencyKey: message.idempotencyKey ?? messageKey(message.reference, message.to),
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

      if (result.permanent) {
        console.error(`[email] ${provider} failed permanently, not retrying: ${lastError}`);
        return { ...result, held: false };
      }
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
    }

    const delay = RETRY_DELAYS_MS[attempt];
    if (delay !== undefined) {
      console.warn(`[email] ${provider} attempt ${attempt + 1} failed (${lastError}), retrying`);
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
