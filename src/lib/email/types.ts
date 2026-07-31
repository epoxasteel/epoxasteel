/**
 * The shapes the mail layer passes around.
 *
 * Extracted into their own module so the transports (`resend.ts`, `smtp.ts`) and
 * the spool can import them without importing the sender that imports the
 * transports — a cycle that TypeScript tolerates and that makes the dependency
 * direction impossible to reason about.
 */

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
  /** The inquiry's reference, carried so a spooled failure can be traced to it. */
  reference?: string;
  /**
   * Stable per message, so a retry after an ambiguous timeout is recognized by the
   * provider and collapsed instead of delivered twice. Built from the reference
   * plus which email this is — see `messageKey()` in `index.ts`.
   */
  idempotencyKey?: string;
};

export type EmailProvider = 'resend' | 'smtp' | 'console';

export type SendResult = {
  ok: boolean;
  provider: EmailProvider;
  id?: string;
  error?: string;
  /**
   * Delivery failed but the message is on disk and will be retried.
   *
   * The distinction matters to the caller: `ok: false` alone used to mean the
   * inquiry was gone, and a route seeing it told the customer to phone instead.
   * A held message has not been lost, so that would now be a lie in the
   * pessimistic direction — which costs a real inquiry just as surely.
   */
  held?: boolean;
  /**
   * This will fail identically however many times it is tried — a bad API key, an
   * unverified sender domain, a malformed payload. Retrying wastes the visitor's
   * time and then fills the spool with messages that can never be delivered, so
   * the sender skips both.
   */
  permanent?: boolean;
};
