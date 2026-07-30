'use client';

import * as React from 'react';

/**
 * Whether the visitor has agreed to analytics.
 *
 * Stored in `localStorage`, not a cookie. A cookie recording a refusal of cookies
 * is a joke that regulators have stopped finding funny, and `localStorage` is not
 * sent with every request, so it costs nothing on the wire.
 *
 * Three states, and the distinction matters:
 *
 *   `unknown`  — nobody has been asked yet. Nothing loads; the notice shows.
 *   `granted`  — the scripts may load.
 *   `denied`   — they may not, and we do not ask again.
 *
 * There is no expiry and no re-prompt. A visitor who said no once should not be
 * asked again on their next visit, which is the behaviour that makes people
 * distrust the banner in the first place.
 *
 * `useSyncExternalStore` rather than an effect: the value is read during render on
 * the client and reported as `unknown` on the server, so there is no flash of a
 * banner for somebody who already answered, and no hydration mismatch either.
 */

const KEY = 'epoxa:consent';

export type Consent = 'unknown' | 'granted' | 'denied';

function read(): Consent {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === 'granted' || value === 'denied' ? value : 'unknown';
  } catch {
    // Private browsing with storage blocked. Treated as never-asked, which means
    // nothing loads — the conservative direction.
    return 'unknown';
  }
}

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab answering the notice should settle it here too.
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function setConsent(value: Exclude<Consent, 'unknown'>) {
  try {
    window.localStorage.setItem(KEY, value);
  } catch {
    /* Storage blocked — the choice applies to this page view only. */
  }
  for (const listener of listeners) listener();
}

export function useConsent(): Consent {
  return React.useSyncExternalStore(
    subscribe,
    read,
    // Server snapshot: nothing is known before the client reads storage.
    () => 'unknown' as const,
  );
}

/*
 * `useHydrated` used to live here. It moved to `lib/use-hydrated.ts` when the
 * Phase 5 audit found two components with the same hydration problem for a
 * different reason — reduced motion rather than stored consent. Re-exported so
 * the consent components keep one import.
 */
export { useHydrated } from '@/lib/use-hydrated';
