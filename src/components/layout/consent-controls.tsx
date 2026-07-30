'use client';

import { Check, X } from 'lucide-react';
import { setConsent, useConsent, useHydrated } from '@/lib/consent';
import { Button } from '@/components/ui/button';

/**
 * Change your answer, on the cookie page.
 *
 * A banner that can only ever be accepted or dismissed leaves somebody who clicked
 * the wrong button with no way back, which is a real problem dressed up as a minor
 * one. This states the current position plainly and offers the other one.
 *
 * When no analytics provider is configured there is nothing to decide, and saying so
 * is more useful than a pair of buttons that change nothing.
 */
export function ConsentControls({ configured }: { configured: boolean }) {
  const consent = useConsent();
  // The stored answer is only knowable on the client, so the panel says nothing
  // about it until it is. Rendering "not yet chosen" server-side and correcting it a
  // moment later would be worse than a beat of nothing.
  const mounted = useHydrated();

  if (!configured) {
    return (
      <div className="border-hairline bg-graphite/60 mt-12 rounded-md border p-6">
        <p className="text-chalk text-[0.9375rem] font-medium">Nothing to change</p>
        <p className="text-ash mt-2 text-[0.875rem] leading-relaxed">
          No analytics provider is configured on this deployment, so no consent has been asked for
          and none is stored. If that changes, this panel will let you set and revisit your choice.
        </p>
      </div>
    );
  }

  return (
    <div className="border-hairline bg-graphite/60 mt-12 rounded-md border p-6">
      <p className="text-chalk text-[0.9375rem] font-medium">Your current choice</p>

      <p className="text-ash mt-2 min-h-[1.5rem] text-[0.875rem] leading-relaxed">
        {!mounted
          ? ' '
          : consent === 'granted'
            ? 'Analytics cookies are allowed. You can withdraw that at any time.'
            : consent === 'denied'
              ? 'Analytics cookies are declined. Nothing is loading, and nothing is stored beyond this preference.'
              : 'You have not been asked yet, or your answer has been cleared.'}
      </p>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <Button
          type="button"
          size="md"
          variant={consent === 'granted' ? 'outline' : 'primary'}
          disabled={!mounted || consent === 'granted'}
          onClick={() => setConsent('granted')}
        >
          <Check aria-hidden />
          Allow analytics
        </Button>
        <Button
          type="button"
          size="md"
          variant="outline"
          disabled={!mounted || consent === 'denied'}
          onClick={() => setConsent('denied')}
        >
          <X aria-hidden />
          Decline analytics
        </Button>
      </div>

      <p className="text-steel mt-4 text-[0.8125rem] leading-relaxed">
        Declining takes effect immediately for anything not yet loaded. Reload the page to clear
        scripts already running in this tab.
      </p>
    </div>
  );
}
