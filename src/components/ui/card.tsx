import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * The surface every listing on the site is built from.
 *
 * `interactive` adds the hover treatment used on linked cards: a hairline that
 * brightens, a one-pixel lift, and a soft arc-coloured glow. It stays subtle on
 * purpose — twelve cards all lifting at once would look like a toy.
 */
export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'border-hairline bg-charcoal/70 relative overflow-hidden rounded-md border',
        'transition-[border-color,box-shadow,transform,background-color] duration-500',
        '[transition-timing-function:var(--ease-out-quint)]',
        interactive && [
          'group/card cursor-pointer',
          'hover:border-hairline-strong hover:bg-charcoal hover:-translate-y-1',
          'hover:shadow-raised',
        ],
        className,
      )}
      {...props}
    />
  );
}

/** A card whose entire surface is a link, with a single accessible name. */
export function LinkCard({
  href,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Card interactive className={cn('focus-within:border-arc-bright', className)}>
      <Link
        href={href}
        aria-label={ariaLabel}
        className="absolute inset-0 z-20 rounded-md focus:outline-none focus-visible:outline-none"
      >
        <span className="sr-only">{ariaLabel ?? 'View details'}</span>
      </Link>
      {children}
    </Card>
  );
}

/*
 * There were CardHeader / CardBody / CardFooter / CardTitle / CardDescription
 * here — a full compound-component API that nothing in the site ever used.
 * Every card in this codebase composes its own contents, which for a design this
 * specific turned out to be the right shape: the padding and type were different
 * enough each time that the "shared" primitives were always overridden. Kept as
 * a note rather than resurrected, so nobody adds them back on the assumption
 * they were missed.
 */

/**
 * A hairline that sweeps across the top edge of a card on hover — the detail
 * that makes a grid of cards feel engineered rather than generic.
 */
export function CardEdgeGlow() {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 h-px',
        'via-arc-bright bg-linear-to-r from-transparent to-transparent',
        'scale-x-0 opacity-0 transition-all duration-700 [transition-timing-function:var(--ease-out-quint)]',
        'group-hover/card:scale-x-100 group-hover/card:opacity-100',
      )}
    />
  );
}
