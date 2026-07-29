import { Wordmark } from '@/components/visual/wordmark';

/**
 * Route-level loading state.
 *
 * A single scanning hairline over the wordmark: enough to say "working" without
 * a spinner that implies something is wrong.
 *
 * Deliberately **not** exported as a root `app/loading.tsx`. Doing that wraps
 * every page in the app in a Suspense boundary, which changes what the server
 * sends: the fallback goes into `<main>` and the real page follows in a later
 * stream chunk that only React can swap in. Every route then painted this
 * screen first and could not show a word of actual content until the framework
 * had downloaded, parsed and hydrated — it cost roughly four seconds of largest
 * contentful paint on a page that is otherwise fully static.
 *
 * So it is opted into per route, and only where a route genuinely renders on
 * demand. Everything statically rendered ships its real markup instead.
 */
export function RouteLoading() {
  return (
    <div className="bg-void grid min-h-dvh place-items-center" role="status" aria-label="Loading">
      <div className="relative flex flex-col items-center gap-7">
        <Wordmark size="lg" metal />

        <div className="bg-hairline relative h-px w-44 overflow-hidden">
          <span
            aria-hidden
            className="via-arc-bright absolute inset-y-0 -left-1/3 w-1/3 bg-linear-to-r from-transparent to-transparent"
            style={{ animation: 'epoxa-sheen 1.4s var(--ease-in-out-quart) infinite' }}
          />
        </div>

        <span className="text-steel text-[0.6875rem] tracking-[0.24em] uppercase">Loading</span>
      </div>
    </div>
  );
}
