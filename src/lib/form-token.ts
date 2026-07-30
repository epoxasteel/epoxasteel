import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';

/**
 * A signed, short-lived token issued to a form before it can be submitted.
 *
 * This is one mechanism doing two jobs the brief asks for separately, because
 * they turn out to be the same job:
 *
 * **Invisible CAPTCHA.** To submit, a client must first fetch a token from the
 * server and send it back. That is trivial for a browser rendering the page and
 * a real cost for a script blindly POSTing at the endpoint — it now needs two
 * round trips, in order, and cannot replay the second without a fresh first. No
 * puzzle, no third-party script, no tracking, nothing for a visitor to solve.
 *
 * **CSRF.** The token is bound to the form it was issued for and expires in
 * thirty minutes. A page on another origin cannot obtain one, because the fetch
 * that issues it is same-origin only and the value never lands anywhere a
 * cross-site request can read it.
 *
 * Deliberately stateless: HMAC over a nonce, an expiry and the form's kind. No
 * store to keep, nothing to synchronise across replicas, and no memory to grow.
 * The trade is that a token cannot be revoked once issued — which is fine for a
 * thirty-minute window, and is what the rate limiter and the duplicate
 * fingerprint are for.
 *
 * The secret comes from `FORM_TOKEN_SECRET`. Without one it falls back to a
 * per-process random value, which still works — tokens simply stop validating
 * across a restart or a second replica. `lib/env.ts` warns about that at boot.
 */

const TTL_MS = 30 * 60_000;

/** Tolerance for the clock drift between replicas issuing and verifying. */
const SKEW_MS = 60_000;

function secret() {
  const configured = process.env.FORM_TOKEN_SECRET;
  if (configured && configured.length >= 16) return configured;
  return processSecret;
}

/**
 * Generated once per process. Means a deployment with no configured secret still
 * rejects forged tokens; it just cannot verify one issued by a different process.
 */
const processSecret = randomBytes(32).toString('hex');

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

export type FormKind = 'contact' | 'quote' | 'newsletter';

/** Issues a token for one form. Server-side only. */
export function issueFormToken(kind: FormKind) {
  const nonce = randomBytes(12).toString('base64url');
  const expires = Date.now() + TTL_MS;
  const payload = `${kind}.${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

export type TokenCheck =
  { ok: true } | { ok: false; reason: 'missing' | 'malformed' | 'expired' | 'kind' | 'signature' };

/**
 * Verifies a token against the form it arrived on.
 *
 * Returns a reason rather than a boolean so the caller can log *why* something
 * was rejected — an expired token is a visitor who left a tab open, a bad
 * signature is somebody probing. Those deserve different attention, and neither
 * reason is ever shown to the visitor.
 */
export function verifyFormToken(token: unknown, kind: FormKind): TokenCheck {
  if (typeof token !== 'string' || !token) return { ok: false, reason: 'missing' };

  const parts = token.split('.');
  if (parts.length !== 4) return { ok: false, reason: 'malformed' };

  const [tokenKind, expiresRaw, nonce, signature] = parts;
  const payload = `${tokenKind}.${expiresRaw}.${nonce}`;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false, reason: 'signature' };
  }

  // Only after the signature checks out is the payload trustworthy enough to read.
  if (tokenKind !== kind) return { ok: false, reason: 'kind' };

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires)) return { ok: false, reason: 'malformed' };
  if (Date.now() > expires + SKEW_MS) return { ok: false, reason: 'expired' };

  return { ok: true };
}

/**
 * Rejects a cross-site POST outright.
 *
 * Defence in depth beside the token: a same-site form always sends an Origin (or
 * at least a Referer) matching the host it was served from. Anything else is not
 * one of our forms, whatever it is carrying.
 *
 * Absent headers are allowed through rather than blocked — some privacy tooling
 * strips them, and the token is the real control. This only turns away a request
 * that positively identifies itself as coming from somewhere else.
 */
export function sameOrigin(request: Request) {
  const host = request.headers.get('host');
  if (!host) return true;

  const claimed = request.headers.get('origin') ?? request.headers.get('referer');
  if (!claimed) return true;

  try {
    return new URL(claimed).host === host;
  } catch {
    return false;
  }
}
