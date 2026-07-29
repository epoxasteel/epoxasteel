'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Search, X, CornerDownLeft, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchDialog } from '@/components/search/search-provider';
import { EASE_OUT_EXPO } from '@/lib/motion';

type ApiResult = {
  id: string;
  type: string;
  title: string;
  description: string;
  href: string;
};

const TYPE_TONE: Record<string, string> = {
  Product: 'text-arc-glow border-arc/35 bg-arc/10',
  Service: 'text-chalk border-hairline-strong bg-white/[0.05]',
  Industry: 'text-mist border-hairline bg-white/[0.03]',
  Project: 'text-mist border-hairline bg-white/[0.03]',
  Article: 'text-mist border-hairline bg-white/[0.03]',
  FAQ: 'text-steel border-hairline bg-white/[0.02]',
  Career: 'text-steel border-hairline bg-white/[0.02]',
  Page: 'text-steel border-hairline bg-white/[0.02]',
};

const SUGGESTIONS = [
  { label: 'Steel beams', href: '/products/steel-beams' },
  { label: 'Reinforcing steel', href: '/products/reinforcing-steel' },
  { label: 'Fabrication', href: '/services/fabrication' },
  { label: 'Request a quote', href: '/quote' },
  { label: 'Projects', href: '/projects' },
];

/**
 * Site-wide search.
 *
 * Querying runs on the server (`/api/search`) rather than in the browser, so
 * the full-text index — which includes every article body — never ships to the
 * client. The result is a search bundle of a few kilobytes instead of a few
 * hundred.
 */
export function SearchDialog() {
  const { isOpen, close } = useSearchDialog();
  const router = useRouter();
  const reduce = useReducedMotion();

  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<ApiResult[]>([]);
  /** The query the current `results` belong to — drives the loading state. */
  const [resultsFor, setResultsFor] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);

  const listRef = React.useRef<HTMLUListElement>(null);

  // Reset whenever the dialog closes so it always opens clean.
  React.useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => {
        setQuery('');
        setResults([]);
        setResultsFor('');
        setActiveIndex(0);
      }, 200);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  // Everything the UI needs is derived rather than stored, which keeps the
  // fetch effect free of synchronous state updates (and therefore free of the
  // cascading re-renders those cause).
  const trimmedQuery = query.trim();
  const isSearchable = trimmedQuery.length >= 2;
  const isLoading = isSearchable && resultsFor !== trimmedQuery;
  const visibleResults = isSearchable && resultsFor === trimmedQuery ? results : [];

  // Debounced fetch, with in-flight requests aborted when the query moves on.
  React.useEffect(() => {
    if (trimmedQuery.length < 2) return;

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}&limit=12`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Search request failed');
        const data = (await response.json()) as { results: ApiResult[] };
        setResults(data.results);
        setResultsFor(trimmedQuery);
        setActiveIndex(0);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // Mark the query as resolved so the spinner stops and the empty
          // state shows, rather than spinning forever on a failed request.
          setResults([]);
          setResultsFor(trimmedQuery);
        }
      }
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [trimmedQuery]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (visibleResults.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % visibleResults.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + visibleResults.length) % visibleResults.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = visibleResults[activeIndex];
      if (target) {
        close();
        router.push(target.href);
      }
    }
  }

  // Keep the highlighted row in view during keyboard navigation.
  React.useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const showEmpty = isSearchable && !isLoading && visibleResults.length === 0;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(next) => (next ? undefined : close())}>
      <AnimatePresence>
        {isOpen ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-void/85 fixed inset-0 z-100 backdrop-blur-md"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                className={cn(
                  'fixed inset-x-4 top-[8vh] z-101 mx-auto max-w-2xl overflow-hidden',
                  'border-hairline-strong bg-graphite shadow-raised rounded-lg border',
                )}
                onKeyDown={onKeyDown}
              >
                <Dialog.Title className="sr-only">Search EPOXA STEEL</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Search products, services, industries, projects and articles.
                </Dialog.Description>

                <div className="border-hairline flex items-center gap-3 border-b px-5">
                  {isLoading ? (
                    <Loader2
                      aria-hidden
                      className="text-arc-bright size-4.5 shrink-0 animate-spin"
                    />
                  ) : (
                    <Search aria-hidden className="text-steel size-4.5 shrink-0" />
                  )}
                  <input
                    autoFocus
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search products, services, projects…"
                    aria-label="Search query"
                    className={cn(
                      'text-bright h-14 flex-1 bg-transparent text-[0.9375rem]',
                      'placeholder:text-steel focus:outline-none',
                      '[&::-webkit-search-cancel-button]:hidden',
                    )}
                  />
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close search"
                      className="text-steel hover:text-bright grid size-8 shrink-0 place-items-center rounded-sm transition-colors"
                    >
                      <X aria-hidden className="size-4" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="max-h-[min(28rem,60vh)] overflow-y-auto overscroll-contain">
                  {visibleResults.length > 0 ? (
                    <ul ref={listRef} className="p-2">
                      {visibleResults.map((result, index) => (
                        <li key={result.id}>
                          <Link
                            href={result.href}
                            data-index={index}
                            onClick={close}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={cn(
                              'flex items-start gap-3 rounded-sm px-3 py-3 transition-colors duration-150',
                              index === activeIndex ? 'bg-white/[0.055]' : 'hover:bg-white/[0.03]',
                            )}
                          >
                            <span
                              className={cn(
                                'mt-0.5 shrink-0 rounded-xs border px-2 py-0.5 text-[0.625rem] tracking-[0.1em] uppercase',
                                TYPE_TONE[result.type] ?? TYPE_TONE.Page,
                              )}
                            >
                              {result.type}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="text-bright block truncate text-[0.9375rem] font-medium">
                                {result.title}
                              </span>
                              <span className="text-ash mt-0.5 block truncate text-[0.8125rem]">
                                {result.description}
                              </span>
                            </span>
                            {index === activeIndex ? (
                              <CornerDownLeft
                                aria-hidden
                                className="text-steel mt-1 size-3.5 shrink-0"
                              />
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {showEmpty ? (
                    <div className="px-6 py-12 text-center">
                      <p className="text-mist text-[0.9375rem]">
                        No results for <span className="text-bright">“{query}”</span>
                      </p>
                      <p className="text-steel mt-2 text-[0.8125rem]">
                        Try a product name, a grade, or a service.
                      </p>
                      <Link
                        href="/contact"
                        onClick={close}
                        className="text-arc-glow mt-5 inline-flex items-center gap-1.5 text-[0.8125rem] hover:underline"
                      >
                        Ask our team directly
                        <ArrowRight aria-hidden className="size-3.5" />
                      </Link>
                    </div>
                  ) : null}

                  {!isSearchable ? (
                    <div className="p-5">
                      <p className="text-eyebrow text-steel mb-3 uppercase">Popular</p>
                      <ul className="flex flex-wrap gap-2">
                        {SUGGESTIONS.map((suggestion) => (
                          <li key={suggestion.href}>
                            <Link
                              href={suggestion.href}
                              onClick={close}
                              className={cn(
                                'border-hairline inline-block rounded-sm border bg-white/[0.02] px-3 py-1.5',
                                'text-mist text-[0.8125rem] transition-colors',
                                'hover:border-hairline-strong hover:text-bright',
                              )}
                            >
                              {suggestion.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>

                <div className="border-hairline text-steel flex items-center justify-between border-t px-5 py-3 text-[0.75rem]">
                  <span className="flex items-center gap-3">
                    <Shortcut keys="↑↓" label="Navigate" />
                    <Shortcut keys="↵" label="Open" />
                    <Shortcut keys="Esc" label="Close" />
                  </span>
                  {isSearchable ? (
                    <Link
                      href={`/search?q=${encodeURIComponent(trimmedQuery)}`}
                      onClick={close}
                      className="text-arc-glow hover:text-arc-bright transition-colors"
                    >
                      View all results
                    </Link>
                  ) : null}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function Shortcut({ keys, label }: { keys: string; label: string }) {
  return (
    <span className="hidden items-center gap-1.5 sm:inline-flex">
      <kbd className="border-hairline bg-charcoal rounded-xs border px-1.5 py-0.5 font-sans text-[0.6875rem]">
        {keys}
      </kbd>
      {label}
    </span>
  );
}
