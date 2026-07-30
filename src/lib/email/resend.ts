import type { EmailMessage, SendResult } from '@/lib/email/types';
import { fromAddress } from '@/lib/email/config';

/**
 * The Resend transport.
 *
 * Its own module because three production concerns live here that have nothing to
 * do with the rest of the mail layer, and putting them in the generic sender would
 * make it Resend-shaped.
 *
 * ## 1. Pacing, because two emails per enquiry is already the rate limit
 *
 * Resend allows two requests per second by default. Every enquiry sends two emails
 * — the owner notification and the customer confirmation — and a successful send
 * also triggers a drain of any spooled backlog. Fired in parallel that is two to
 * five requests inside the same tick, and the surplus comes back `429`.
 *
 * This was not a theoretical risk. `Promise.all([owner, customer])` in the routes
 * put both calls in flight simultaneously, which sits exactly on the ceiling with
 * no headroom for a retry or a drain.
 *
 * So every call goes through a promise chain that spaces requests. The queue is
 * FIFO, and the routes construct the owner notification first, so the email that
 * matters most is always the one that goes first. It costs about half a second on a
 * form submission, which is a fair price for the notification actually arriving.
 *
 * ## 2. Idempotency, so a retry cannot duplicate
 *
 * A request that times out has an unknown outcome: the API may have accepted the
 * message before the connection dropped. Retrying it blind is how a customer gets
 * two confirmations and an owner gets two copies of the same enquiry.
 *
 * Resend accepts an idempotency key. Ours is the enquiry's reference plus which of
 * the two emails this is, so a retry of the same message is recognised and
 * collapsed server-side while a genuinely different message is unaffected.
 *
 * ## 3. Error classification, because retrying a bad API key is pointless
 *
 * A `429` or a `500` is weather: wait and try again. An invalid API key, an
 * unverified sender domain or a malformed payload will fail identically forever.
 * Retrying those wastes six seconds of the visitor's time before failing anyway,
 * and then writes something to the spool that can never be delivered — a queue
 * slowly filling with messages that are broken rather than delayed.
 *
 * Permanent failures are reported as permanent and logged with the operator fix.
 */

/**
 * Minimum gap between requests. Resend's default ceiling is 2/second.
 *
 * 620ms rather than the arithmetic minimum of 500ms. At exactly 500 the second
 * request lands on the boundary of every one-second window, so any jitter in
 * either direction puts three in a window; measured spacing came out at 553ms with
 * a 560ms target, which is the wrong side of comfortable. The extra tenth of a
 * second is invisible on a form submission and removes the whole class of problem.
 */
const MIN_GAP_MS = 620;

let chain: Promise<unknown> = Promise.resolve();
let lastSentAt = 0;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs `task` after enough time has passed since the previous Resend request.
 *
 * The chain is a module-level promise rather than a queue object because ordering
 * and mutual exclusion are the whole requirement, and a promise chain gives both in
 * three lines. `chain` is deliberately reassigned before awaiting, so concurrent
 * callers link up behind each other instead of all seeing the same predecessor.
 */
function paced<T>(task: () => Promise<T>): Promise<T> {
  const run = chain.then(async () => {
    const since = Date.now() - lastSentAt;
    if (since < MIN_GAP_MS) await wait(MIN_GAP_MS - since);
    lastSentAt = Date.now();
    return task();
  });

  // Swallow rejections on the chain itself; the caller still sees them via `run`.
  chain = run.catch(() => undefined);
  return run;
}

/**
 * Errors that will fail the same way however many times we try.
 *
 * Each of these is an operator problem — a key, a domain, a payload — and the
 * message logged beside it says which, because "email failed" in a deploy log at
 * 2am is not an actionable sentence.
 */
const PERMANENT: Partial<Record<string, string>> = {
  missing_api_key: 'RESEND_API_KEY is not set',
  invalid_api_key: 'RESEND_API_KEY is not valid — regenerate it in the Resend dashboard',
  restricted_api_key: 'RESEND_API_KEY lacks send permission — it may be a read-only key',
  invalid_from_address:
    'the FROM_EMAIL domain is not verified in Resend — verify it before sending',
  validation_error: 'Resend rejected the payload as malformed',
  missing_required_field: 'Resend reported a required field missing',
  invalid_parameter: 'Resend rejected one of the parameters',
  invalid_attachment: 'Resend rejected an attachment',
  invalid_access: 'this Resend key cannot send from that address',
  security_error: 'Resend flagged the request as a security problem',
  monthly_quota_exceeded: 'the Resend monthly quota is exhausted — upgrade the plan',
  daily_quota_exceeded: 'the Resend daily quota is exhausted — it resets tomorrow',
};

export async function sendWithResend(message: EmailMessage): Promise<SendResult> {
  const { Resend } = await import('resend');

  // `RESEND_BASE_URL` points the SDK somewhere else — an enterprise egress proxy,
  // or a local stand-in during testing. Unset in production, which is the default.
  const baseUrl = process.env.RESEND_BASE_URL?.trim();
  const resend = new Resend(process.env.RESEND_API_KEY, baseUrl ? { baseUrl } : undefined);

  const recipients = Array.isArray(message.to) ? message.to : [message.to];

  const { data, error } = await paced(() =>
    resend.emails.send(
      {
        from: fromAddress(),
        to: recipients,
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
        attachments: message.attachments?.map((attachment) => ({
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType,
        })),
      },
      // Same enquiry, same email, same key — so a retry after an ambiguous
      // timeout is collapsed rather than delivered twice.
      message.idempotencyKey ? { idempotencyKey: message.idempotencyKey } : undefined,
    ),
  );

  if (error) {
    const explanation = PERMANENT[error.name];
    if (explanation) {
      console.error(`[email] Resend rejected this permanently: ${explanation} (${error.name})`);
      return { ok: false, provider: 'resend', error: error.message, permanent: true };
    }

    // Transient: rate limit, internal error, anything unrecognised. Unrecognised
    // counts as transient on purpose — a new error code we have never seen is more
    // likely a hiccup than a permanent misconfiguration, and treating it as
    // retryable errs towards delivering the enquiry.
    return { ok: false, provider: 'resend', error: `${error.name}: ${error.message}` };
  }

  return { ok: true, provider: 'resend', id: data?.id };
}
