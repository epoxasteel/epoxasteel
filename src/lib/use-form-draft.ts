'use client';

import * as React from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

/**
 * Keeps what someone has typed.
 *
 * A quote request asks for a project description, tonnages and a delivery
 * program. People write that over several minutes, in another tab, with a
 * drawing open beside them — and then follow a link, or reload, and lose the lot.
 * There is no reason for a form to be that fragile.
 *
 * Values are mirrored into `sessionStorage` as they change and restored on mount.
 * Session, not local: the draft belongs to this visit. It is cleared the moment
 * the form submits successfully, so a returning visitor never finds a stale
 * inquiry waiting for them.
 *
 * Two fields never persist, whatever is passed in:
 *
 *   - **consent** — a legal affirmation has to be given deliberately, in front of
 *     the wording, on the occasion it is being relied on. Restoring a ticked box
 *     from storage would mean the visitor never actually agreed to anything.
 *   - **website** — the honeypot. Persisting it would be pointless and could
 *     resurrect a value a bot left behind.
 */

const NEVER_PERSIST = new Set(['consent', 'newsletter', 'website']);

function read(key: string): Record<string, unknown> | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function useFormDraft<T extends FieldValues>(
  key: string,
  form: Pick<UseFormReturn<T>, 'watch' | 'reset' | 'getValues'>,
) {
  const { watch, reset, getValues } = form;

  /* Restore once. `keepDefaultValues` means a later reset() still returns the
     form to empty rather than to the restored draft. */
  React.useEffect(() => {
    const saved = read(key);
    if (!saved) return;

    const defaults = getValues();
    const restored: Record<string, unknown> = { ...defaults };
    let any = false;

    for (const [field, value] of Object.entries(saved)) {
      if (NEVER_PERSIST.has(field)) continue;
      if (!(field in defaults)) continue;
      if (typeof value !== 'string' || !value) continue;
      restored[field] = value;
      any = true;
    }

    if (any) reset(restored as T, { keepDefaultValues: true });
  }, [key, reset, getValues]);

  /* Mirror changes. Writing on every keystroke would serialise the whole form a
     few hundred times while someone types a paragraph, so it is coalesced.

     The flush deliberately reads `getValues()` rather than the values handed to
     the subscription. Persisting the notified snapshot looks equivalent and is
     not: the first change in a burst schedules the write and every change after
     it is swallowed by the guard, so the form was saved as it looked 400ms ago.
     In practice that meant a name was kept and the message someone had just
     typed was not. */
  React.useEffect(() => {
    let queued = 0;

    const subscription = watch(() => {
      if (queued) return;
      queued = window.setTimeout(() => {
        queued = 0;
        try {
          const draft: Record<string, unknown> = {};
          for (const [field, value] of Object.entries(getValues() as Record<string, unknown>)) {
            if (NEVER_PERSIST.has(field)) continue;
            if (typeof value === 'string' && value.trim()) draft[field] = value;
          }
          if (Object.keys(draft).length) {
            window.sessionStorage.setItem(key, JSON.stringify(draft));
          } else {
            window.sessionStorage.removeItem(key);
          }
        } catch {
          /* Storage full or blocked — the draft is a convenience, not a feature. */
        }
      }, 400);
    });

    return () => {
      if (queued) window.clearTimeout(queued);
      subscription.unsubscribe();
    };
  }, [key, watch, getValues]);

  return React.useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      /* Nothing to clean up if storage was never available. */
    }
  }, [key]);
}
