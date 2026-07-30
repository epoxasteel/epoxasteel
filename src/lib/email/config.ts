import { siteConfig } from '@/lib/site';

/**
 * Who email comes from, who it goes to, and who a reply reaches.
 *
 * Four addresses, each resolved from the environment with a sensible fallback, so
 * a deployment that sets nothing still sends coherent mail and a deployment that
 * sets everything needs no code change.
 *
 * ## Two generations of variable names, both supported
 *
 * `EMAIL_FROM` and `EMAIL_TO` came first and are already set on live deployments.
 * `FROM_EMAIL`, `OWNER_EMAIL` and `REPLY_TO_EMAIL` are the names asked for later.
 * Renaming would have silently broken a running site the moment it redeployed, so
 * both are read, with the newer name taking precedence. `lib/env.ts` reports which
 * one is in use at boot, and `.env.example` documents the pair — an alias nobody
 * knows about is worse than no alias.
 *
 * ## Why Reply-To matters more than it looks
 *
 * The owner notification's Reply-To is the *customer's* address. That single header
 * is the entire "reply to the enquiry" workflow: no dashboard, no copy-paste, no
 * looking up who sent what. Press Reply, type, send.
 *
 * The customer confirmation's Reply-To is the business address, not `no-reply@`.
 * Some people answer a confirmation email with the thing they forgot to mention,
 * and a reply that bounces off a no-reply mailbox is a lost enquiry that both sides
 * believe was delivered.
 */

/** Strips CRLF and trims — anything here ends up in a mail header. */
function headerValue(value: string | undefined) {
  return value?.replace(/[\r\n]+/g, ' ').trim() ?? '';
}

/**
 * The envelope sender, for every message the site sends.
 *
 * `FROM_EMAIL` is the variable to set, and it must be on a domain verified with
 * the provider or delivery is refused outright.
 *
 * The fallback is assembled from the configured company name and domain rather
 * than written out, so there is no email address literal in this codebase and a
 * deployment that changes `NEXT_PUBLIC_SITE_DOMAIN` does not silently keep sending
 * as somebody else. `legalName` rather than `name` because `name` is the wordmark
 * — "EPOXA STEEL" shouting from a From header reads like a mailing list, and the
 * display name is the one part of an address a person actually reads.
 *
 * Both the owner notification and the customer confirmation send from here. That
 * is deliberate: one verified sender, one reputation, one DKIM signature. What
 * differs between them is the Reply-To — see `replyToAddress` below and the
 * per-route calls.
 */
export function fromAddress() {
  return (
    headerValue(process.env.FROM_EMAIL) ||
    headerValue(process.env.EMAIL_FROM) ||
    `${siteConfig.legalName} <noreply@${siteConfig.domain}>`
  );
}

/**
 * Where enquiry notifications go. Comma-separated for several people.
 *
 * Falls back to the public contact address, which is always a real mailbox — the
 * one failure this must not have is silently sending enquiries nowhere.
 */
export function ownerRecipients() {
  const configured =
    headerValue(process.env.OWNER_EMAIL) ||
    headerValue(process.env.EMAIL_TO) ||
    siteConfig.contact.email;

  return configured
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
}

/**
 * Where a reply to a *customer-facing* email should land.
 *
 * Never `no-reply@`. Defaults to the first owner recipient, which is a mailbox
 * somebody reads by definition.
 */
export function replyToAddress() {
  return (
    headerValue(process.env.REPLY_TO_EMAIL) || ownerRecipients()[0] || siteConfig.contact.email
  );
}

/** True when a real transport is configured rather than the console fallback. */
export function emailProvider(): 'resend' | 'smtp' | 'console' {
  if (process.env.RESEND_API_KEY) return 'resend';
  if (process.env.SMTP_HOST) return 'smtp';
  return 'console';
}
