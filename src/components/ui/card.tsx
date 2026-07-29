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

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-0 sm:p-7 sm:pb-0', className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 sm:p-7', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-hairline mt-auto border-t px-6 py-4 sm:px-7', className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  as: Component = 'h3',
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: 'h2' | 'h3' | 'h4' }) {
  return (
    <Component
      className={cn(
        'font-display text-title text-bright font-semibold',
        'transition-colors duration-300 group-hover/card:text-white',
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-ash text-[0.9375rem] leading-relaxed', className)} {...props} />;
}

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
