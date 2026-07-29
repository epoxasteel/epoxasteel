'use client';

import * as React from 'react';

type SearchContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SearchContext = React.createContext<SearchContextValue | null>(null);

/**
 * Owns the open state of the site-wide search dialog and the ⌘K / Ctrl-K
 * shortcut, so the header button and the keyboard shortcut drive one source of
 * truth. Kept separate from the dialog itself so the dialog — and the fetch
 * logic inside it — is only mounted when it is actually needed.
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((current) => !current), []);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggle();
        return;
      }

      // "/" opens search, but not while the user is typing somewhere else.
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const typing =
          target?.tagName === 'INPUT' ||
          target?.tagName === 'TEXTAREA' ||
          target?.tagName === 'SELECT' ||
          target?.isContentEditable;
        if (!typing) {
          event.preventDefault();
          open();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, toggle]);

  const value = React.useMemo(
    () => ({ isOpen, open, close, toggle }),
    [isOpen, open, close, toggle],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearchDialog() {
  const context = React.useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchDialog must be used inside <SearchProvider>');
  }
  return context;
}
