'use client';

import * as React from 'react';

/**
 * Open state for the assistant, lifted so anything on the site can start a
 * conversation — a product page can offer "Ask about this product" and drop the
 * visitor into the panel with the question already framed.
 *
 * Kept separate from the panel so pages that only want the trigger do not pull
 * the whole transcript UI into their bundle.
 *
 * `seedKey` increments on every open. The panel uses it as a React `key` on the
 * composer, which is how a new seeded question replaces whatever was in the box
 * without an effect that writes state during render — remounting a small
 * component with a new default is both cheaper and easier to reason about than
 * synchronising two sources of truth for one text field.
 */

type AssistantContextValue = {
  open: boolean;
  /** `seed` pre-fills the composer without sending, so the visitor stays in control. */
  openAssistant: (seed?: string) => void;
  closeAssistant: () => void;
  seed: string;
  seedKey: number;
};

const AssistantContext = React.createContext<AssistantContextValue | null>(null);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState({ open: false, seed: '', seedKey: 0 });

  const openAssistant = React.useCallback((seed?: string) => {
    setState((current) => ({
      open: true,
      seed: seed ?? '',
      // Only remount the composer when a seed is actually supplied; re-opening
      // the panel from the dock should leave a half-typed question alone.
      seedKey: seed ? current.seedKey + 1 : current.seedKey,
    }));
  }, []);

  const closeAssistant = React.useCallback(() => {
    setState((current) => ({ ...current, open: false }));
  }, []);

  const value = React.useMemo(
    () => ({ ...state, openAssistant, closeAssistant }),
    [state, openAssistant, closeAssistant],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant() {
  const context = React.useContext(AssistantContext);
  if (!context) throw new Error('useAssistant must be used inside <AssistantProvider>');
  return context;
}
