/**
 * In-memory fixed-window rate limiter, and the client identity it keys on.
 *
 * Deliberately simple: it protects the form endpoints from casual abuse and
 * accidental double submission without adding an infrastructure dependency.
 * State is per-instance, so a horizontally scaled deployment enforces the limit
 * per instance — swap the store for Redis (docs/DEPLOYMENT.md) if you scale
 * beyond a single Railway replica and need a global limit.
 */

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

/** Drop expired entries so the map cannot grow without bound. */
function sweep(now: number) {
  if (buckets.size < 512) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window resets — used for the Retry-After header. */
  retryAfter: number;
};

export function rateLimit(
  identifier: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(identifier);

  if (!existing || existing.resetAt <= now) {
    buckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, limit, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;

  const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

  if (existing.count > limit) {
    return { success: false, limit, remaining: 0, retryAfter };
  }

  return { success: true, limit, remaining: limit - existing.count, retryAfter };
}

/* -------------------------------------------------------------------------- */
/* Client identity                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Rough but strict IP shape check.
 *
 * Not full validation — the point is to reject anything that is not plausibly an
 * address, so a forged header cannot become an unbounded map key or land in an
 * owner's notification email as arbitrary attacker-chosen text.
 */
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const IPV6 = /^[0-9a-f:]{2,45}$/i;

function looksLikeIp(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 45) return false;
  if (IPV4.test(trimmed)) {
    return trimmed.split('.').every((part) => Number(part) <= 255);
  }
  return IPV6.test(trimmed) && trimmed.includes(':');
}

/**
 * How many proxies we trust in front of the app.
 *
 * `X-Forwarded-For` is *appended* to by each hop, so it reads
 * `client, proxy1, proxy2`. A client that sends its own `X-Forwarded-For: 1.2.3.4`
 * gets its real address appended after the lie — the header becomes
 * `1.2.3.4, <real client>`. The trustworthy entry is therefore counted from the
 * **right**, not the left.
 *
 * Default 1, which is correct for Railway alone. Put Cloudflare in front and there
 * are two hops — though with Cloudflare the `cf-connecting-ip` header below makes
 * this moot, because Cloudflare strips any client-supplied copy of it.
 */
function trustedHops() {
  const configured = Number(process.env.TRUSTED_PROXY_HOPS);
  return Number.isInteger(configured) && configured > 0 ? configured : 1;
}

/**
 * The client's address, as well as it can be known.
 *
 * ## Why this was wrong before, and why it mattered
 *
 * The previous implementation took the **left-most** entry of `X-Forwarded-For`.
 * That is the conventional-looking choice and it is exactly backwards: the
 * left-most entry is whatever the client claimed before any proxy appended
 * anything. So every rate limit on the site could be bypassed by sending a
 * different forged `X-Forwarded-For` on each request — unlimited form
 * submissions, unlimited emails, at somebody else's expense now that Resend is
 * metered.
 *
 * ## The order, and why
 *
 *   1. **`cf-connecting-ip`** — Cloudflare sets this to the real client and strips
 *      any version the client supplied, so it cannot be forged through Cloudflare.
 *   2. **`x-real-ip`** — set by many proxies, and *replaced* rather than appended,
 *      so it does not accumulate a forgeable prefix.
 *   3. **`x-forwarded-for`**, counted from the right by the number of hops we
 *      actually trust.
 *
 * Anything that does not look like an address is discarded rather than used, and a
 * request with no usable header at all returns `unknown` — which means every such
 * request shares one bucket. That is the safe direction: they are limited
 * together rather than each getting a fresh allowance.
 */
export function clientIdentifier(request: Request) {
  const cloudflare = request.headers.get('cf-connecting-ip');
  if (cloudflare && looksLikeIp(cloudflare)) return cloudflare.trim();

  const real = request.headers.get('x-real-ip');
  if (real && looksLikeIp(real)) return real.trim();

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const entries = forwarded
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    // Count from the right: the last entry was appended by the hop nearest us.
    const index = Math.max(0, entries.length - trustedHops());
    const candidate = entries[index];
    if (candidate && looksLikeIp(candidate)) return candidate;

    // The header is present but unusable — a forged single value, or garbage.
    // Falling through to `unknown` is correct: a bucket shared with every other
    // unidentifiable request is better than a fresh allowance per forgery.
  }

  return 'unknown';
}

/**
 * A ceiling on a whole endpoint, regardless of who is calling.
 *
 * Per-IP limiting is the right primary control, and it has one structural
 * weakness: it assumes the identity is real. Behind a proxy chain that cannot be
 * guaranteed, and a distributed attempt has a different address per request by
 * definition.
 *
 * Now that email is metered, that weakness has a bill attached. So each form
 * endpoint also has a global window — generous enough that a real business day
 * never touches it, tight enough that nothing can spend an unbounded amount of
 * somebody's Resend quota in an afternoon.
 *
 * Returning 429 to a genuine visitor who happens to arrive during an attack is a
 * real cost, which is why the limits are set well above plausible traffic and the
 * message tells them to call.
 */
export function globalLimit(
  form: string,
  { limit = 60, windowMs = 10 * 60_000 }: { limit?: number; windowMs?: number } = {},
) {
  return rateLimit(`global:${form}`, { limit, windowMs });
}
