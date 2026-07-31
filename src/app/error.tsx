'use client';

import * as React from 'react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/layout/section';
import { siteConfig } from '@/lib/site';

/**
 * Catches a render error inside any route, with the header, footer and nav still
 * around it. For a failure in the root layout itself — where none of that exists —
 * see `global-error.tsx`.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Surface the failure for whatever monitoring is wired up in production.
    console.error('[app] unhandled error', error);
  }, [error]);

  return (
    <div className="bg-void relative flex min-h-dvh items-center overflow-hidden pt-(--header-h)">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="container-page relative py-24">
        <div className="max-w-2xl">
          <Eyebrow>Unexpected error</Eyebrow>

          <h1 className="font-display text-display text-bright mt-7 font-semibold">
            Something went wrong at our end.
          </h1>

          <p className="text-lead text-ash mt-7 max-w-lg">
            This is our fault, not yours. Try again, and if it keeps happening, call us on{' '}
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="text-arc-glow underline underline-offset-4"
            >
              {siteConfig.contact.phone}
            </a>{' '}
            or email{' '}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-arc-glow underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>
            . We would rather take your enquiry by phone than lose it.
          </p>

          {error.digest ? (
            <p className="text-steel mt-6 font-mono text-[0.8125rem]">
              Reference: <span className="text-mist">{error.digest}</span>
            </p>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-4">
            <Button onClick={reset} size="lg" sheen>
              <RefreshCw aria-hidden />
              Try again
            </Button>
            <Button href="/" size="lg" variant="outline">
              Back to home
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
