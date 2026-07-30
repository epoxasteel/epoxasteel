'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { setConsent, useConsent, useHydrated } from '@/lib/consent';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * The cookie notice.
 *
 * It appears only when an analytics provider is actually configured. On a
 * deployment with none — which is the default, and the state this ships in — the
 * site sets no analytics cookies, so there is nothing to ask about and no banner.
 * A notice that exists to look compliant while there is nothing to consent to is
 * how visitors learn to dismiss the ones that matter without reading them.
 *
 * Two things it deliberately does not do:
 *
 *   **No dark pattern.** Accept and decline are the same size, in the same place,
 *   with the same prominence. The one-sided banner where "reject" is a grey link
 *   in eight-point type is both distasteful and, in the EU, not valid consent.
 *
 *   **No nagging.** A decision is remembered permanently and never re-asked. A
 *   banner that returns every session is asking until it gets the answer it wants.
 *
 * It sits above the dock rather than beside it, and steps out of the way on a
 * phone, where a fixed bar at the bottom would sit on the dock and the safe area
 * at once.
 */
export function CookieNotice({ configured }: { configured: boolean }) {
  const consent = useConsent();
  const reduce = useReducedMotion();
  // Nothing paints until the client has read storage, so a returning visitor who
  // already answered never sees a flash of the bar.
  const hydrated = useHydrated();

  const show = configured && hydrated && consent === 'unknown';

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          role="region"
          aria-label="Cookie notice"
          /*
           * Held back for a couple of seconds.
           *
           * Without the delay it arrived over the top of the homepage's opening
           * animation, which is the one moment on the site that is asking for the
           * visitor's whole attention. There is no reason to rush it: nothing loads
           * before an answer either way, so the notice can wait for the hero to
           * land. The wait is on the entrance only — dismissing is instant.
           *
           * `pointerEvents` is animated with the opacity so the invisible bar does
           * not sit over the page swallowing clicks while it waits.
           */
          initial={
            reduce
              ? { opacity: 0, pointerEvents: 'none' }
              : { opacity: 0, y: 20, pointerEvents: 'none' }
          }
          animate={{ opacity: 1, y: 0, pointerEvents: 'auto' }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.44, delay: 2.2, ease: EASE_OUT_EXPO }}
          className={cn(
            'fixed z-40 print:hidden',
            'inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md',
          )}
        >
          <div className="border-hairline-strong bg-graphite shadow-raised relative overflow-hidden rounded-lg border p-5">
            <div
              className="bg-grid-fine pointer-events-none absolute inset-0 opacity-30"
              aria-hidden
            />

            <div className="relative">
              <p className="text-chalk flex items-center gap-2.5 text-[0.9375rem] font-medium">
                <Cookie aria-hidden className="text-arc-glow size-4 shrink-0" />
                Cookies
              </p>

              <p className="text-ash mt-2.5 text-[0.875rem] leading-relaxed">
                We would like to use analytics cookies to understand which pages are useful and
                where people get stuck. Nothing loads until you agree, and the site works exactly
                the same either way.{' '}
                <Link href="/cookies" className="text-arc-glow underline underline-offset-2">
                  What we would collect
                </Link>
                .
              </p>

              {/* Equal weight, equal size, side by side. */}
              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <Button
                  type="button"
                  size="md"
                  onClick={() => setConsent('granted')}
                  className="flex-1 justify-center"
                >
                  Accept
                </Button>
                <Button
                  type="button"
                  size="md"
                  variant="outline"
                  onClick={() => setConsent('denied')}
                  className="flex-1 justify-center"
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
