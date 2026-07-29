/**
 * In-memory fixed-window rate limiter.
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

/**
 * Best-effort client identity. Railway sits behind a proxy, so the left-most
 * entry of X-Forwarded-For is the closest thing to a real client address.
 */
export function clientIdentifier(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}
