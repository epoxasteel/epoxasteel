import { Wordmark } from '@/components/visual/wordmark';

/**
 * Route-level loading state.
 *
 * A single scanning hairline over the wordmark: enough to say "working" without
 * a spinner that implies something is wrong. Almost every route on this site is
 * statically rendered, so most visitors will never see it.
 */
export default function Loading() {
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
