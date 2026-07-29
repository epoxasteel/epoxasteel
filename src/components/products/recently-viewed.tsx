'use client';

import * as React from 'react';
import { products, getProduct } from '@/content/products';
import { Eyebrow, ArrowLink } from '@/components/layout/section';
import { RelatedLink } from '@/components/cards';
import { cn } from '@/lib/utils';

/**
 * Recently viewed products.
 *
 * Buyers rarely compare steel in one sitting — they open a beam, then a plate,
 * then come back two tabs later trying to remember which grade they liked. This
 * keeps a short trail so they can get back without re-navigating.
 *
 * Everything is local: a list of slugs in `localStorage`, never sent anywhere,
 * which is why the privacy policy does not need to mention it. Storage can fail
 * (private browsing, blocked cookies, quota) and every path here tolerates that
 * by simply rendering nothing.
 */

const STORAGE_KEY = 'epoxa:recently-viewed';
const MAX_TRACKED = 6;
const MAX_SHOWN = 4;

function readTrail(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Only keep slugs that still exist in the catalogue — a product can be
    // renamed or removed between visits.
    const known = new Set(products.map((product) => product.slug));
    return parsed.filter((slug): slug is string => typeof slug === 'string' && known.has(slug));
  } catch {
    return [];
  }
}

function writeTrail(slugs: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs.slice(0, MAX_TRACKED)));
  } catch {
    /* Storage unavailable — the trail is a convenience, not a requirement. */
  }
}

/**
 * `useSyncExternalStore` needs a stable snapshot — returning a freshly parsed
 * array on every render would loop forever. The last parse is cached against the
 * raw string it came from, so repeat reads are both cheap and identical.
 */
const EMPTY: string[] = [];
let cache: { raw: string | null; value: string[] } = { raw: null, value: EMPTY };

function subscribeToTrail(onChange: () => void) {
  // Fires for writes from *other* tabs only, which is exactly right: this tab's
  // own write must not fold the current product into its own trail.
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

function trailSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cache.raw) cache = { raw, value: readTrail() };
  return cache.value;
}

/**
 * Records a visit and renders the trail from *before* this visit.
 *
 * The snapshot is read through `useSyncExternalStore` rather than pushed into
 * state from an effect: the server renders nothing, the client reads storage as
 * it hydrates, and the write-back below never disturbs it. The product you are
 * currently reading therefore never appears in its own "recently viewed" list,
 * which would be both useless and slightly absurd.
 */
export function RecentlyViewed({ currentSlug }: { currentSlug: string }) {
  const trail = React.useSyncExternalStore(subscribeToTrail, trailSnapshot, () => EMPTY);

  React.useEffect(() => {
    writeTrail([currentSlug, ...readTrail().filter((slug) => slug !== currentSlug)]);
  }, [currentSlug]);

  const items = trail
    .filter((slug) => slug !== currentSlug)
    .slice(0, MAX_SHOWN)
    .map((slug) => getProduct(slug))
    .filter((product) => Boolean(product));

  // Renders nothing on the server and on a first-ever visit, so there is no
  // empty heading and no layout shift.
  if (items.length === 0) return null;

  return (
    <section className="section-y-sm bg-void border-hairline border-t">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Recently viewed</Eyebrow>
            <h2 className="font-display text-headline text-bright mt-6 font-semibold">
              Pick up where you left off
            </h2>
          </div>
          <ArrowLink href="/products">All products</ArrowLink>
        </div>

        <ul
          className={cn(
            'mt-10 grid gap-4 sm:grid-cols-2',
            items.length > 2 ? 'lg:grid-cols-4' : 'lg:grid-cols-2',
          )}
        >
          {items.map((product) =>
            product ? (
              <li key={product.slug}>
                <RelatedLink
                  href={`/products/${product.slug}`}
                  title={product.name}
                  meta={product.tagline}
                />
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </section>
  );
}
