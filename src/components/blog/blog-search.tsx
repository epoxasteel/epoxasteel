'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * A small search entry point in the blog masthead.
 *
 * Submitting hands off to the site-wide `/search` results page rather than
 * filtering in place — one search implementation, one set of ranking rules, one
 * place to improve.
 */
export function BlogSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className={cn('flex max-w-md gap-2.5', className)} role="search">
      <label htmlFor="blog-search" className="sr-only">
        Search articles
      </label>
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="text-steel pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
        />
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search articles and guidance…"
          className={cn(
            'border-hairline bg-graphite h-12 w-full rounded-sm border pr-4 pl-11',
            'text-bright placeholder:text-steel text-[0.9375rem]',
            'transition-[border-color,box-shadow] duration-200',
            'hover:border-hairline-strong',
            'focus:border-arc-bright focus:shadow-[0_0_0_3px_rgba(58,138,224,0.16)] focus:outline-none',
            '[&::-webkit-search-cancel-button]:hidden',
          )}
        />
      </div>
      <button
        type="submit"
        className={cn(
          'border-hairline-strong h-12 shrink-0 rounded-sm border bg-white/[0.02] px-5',
          'text-chalk text-[0.875rem] font-medium transition-colors duration-300',
          'hover:border-steel hover:text-bright',
        )}
      >
        Search
      </button>
    </form>
  );
}
