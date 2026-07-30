import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Badge                                                                      */
/* -------------------------------------------------------------------------- */

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-xs border px-2.5 py-1 text-[0.6875rem] font-medium tracking-[0.12em] uppercase',
  {
    variants: {
      tone: {
        default: 'border-hairline bg-white/[0.03] text-mist',
        arc: 'border-arc/40 bg-arc/10 text-arc-glow',
        metal: 'border-hairline-strong bg-linear-to-b from-white/[0.07] to-transparent text-chalk',
        success: 'border-success/40 bg-success/10 text-success',
        warning: 'border-warning/40 bg-warning/10 text-warning',
      },
    },
    defaultVariants: { tone: 'default' },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Alert                                                                      */
/* -------------------------------------------------------------------------- */

const alertIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
} as const;

const alertTones = {
  info: 'border-arc/35 bg-arc/[0.07] text-arc-glow',
  success: 'border-success/35 bg-success/[0.07] text-success',
  warning: 'border-warning/35 bg-warning/[0.07] text-warning',
  error: 'border-danger/35 bg-danger/[0.07] text-danger',
} as const;

export function Alert({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: keyof typeof alertIcons;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const Icon = alertIcons[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-sm border p-4', alertTones[tone], className)}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <div className="flex-1 text-[0.875rem] leading-relaxed">
        {title ? <p className="text-bright mb-1 font-medium">{title}</p> : null}
        <div className="text-mist">{children}</div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Breadcrumbs                                                                */
/* -------------------------------------------------------------------------- */

export type Crumb = { name: string; href: string };

export function Breadcrumbs({ trail, className }: { trail: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('text-[0.8125rem]', className)}>
      <ol className="text-steel flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight aria-hidden className="text-hairline-strong size-3.5" />
              ) : null}
              {isLast ? (
                <span aria-current="page" className="text-mist">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-chalk transition-colors duration-200">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

/** Windowed page list with ellipses, e.g. 1 … 4 5 6 … 12 */
function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'gap')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('gap');
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push('gap');

  pages.push(total);
  return pages;
}

export function Pagination({
  page,
  totalPages,
  basePath,
  className,
}: {
  page: number;
  totalPages: number;
  /** Page 1 links here; later pages append `?page=n`. */
  basePath: string;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => (target === 1 ? basePath : `${basePath}?page=${target}`);

  const linkClass =
    'grid h-10 min-w-10 place-items-center rounded-sm border border-hairline px-3 text-sm text-mist transition-colors duration-200 hover:border-hairline-strong hover:text-bright';

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-2', className)}
    >
      {page > 1 ? (
        <Link href={href(page - 1)} rel="prev" className={linkClass} aria-label="Previous page">
          <ChevronRight aria-hidden className="size-4 rotate-180" />
        </Link>
      ) : (
        <span className={cn(linkClass, 'cursor-not-allowed opacity-35')} aria-hidden>
          <ChevronRight className="size-4 rotate-180" />
        </span>
      )}

      {pageWindow(page, totalPages).map((entry, index) =>
        entry === 'gap' ? (
          <span key={`gap-${index}`} className="text-steel px-1" aria-hidden>
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={href(entry)}
            aria-label={`Page ${entry}`}
            aria-current={entry === page ? 'page' : undefined}
            className={cn(
              linkClass,
              entry === page && 'border-arc-bright/50 bg-arc/12 text-bright',
            )}
          >
            {entry}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link href={href(page + 1)} rel="next" className={linkClass} aria-label="Next page">
          <ChevronRight aria-hidden className="size-4" />
        </Link>
      ) : (
        <span className={cn(linkClass, 'cursor-not-allowed opacity-35')} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Spec table                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Wide technical tables scroll inside their own container so the page body
 * never scrolls horizontally on a phone.
 *
 * The scroll container is focusable, which is the part that is easy to miss. At
 * 390px a section table is wider than the screen and the only way to read the
 * right-hand columns is to scroll this box — and a box that can only be scrolled
 * by dragging it is unreachable for anyone navigating by keyboard. `tabIndex={0}`
 * plus a labelled region makes it a tab stop that responds to arrow keys. axe
 * caught this at the mobile breakpoint only, because that is the only width where
 * the overflow actually exists.
 */
export function SpecTable({
  columns,
  rows,
  caption,
  className,
}: {
  columns: string[];
  rows: string[][];
  caption?: string;
  className?: string;
}) {
  return (
    <div className={cn('border-hairline overflow-hidden rounded-md border', className)}>
      <div
        role="region"
        aria-label={caption ?? 'Specifications table'}
        tabIndex={0}
        className="focus-visible:ring-arc-bright/60 overflow-x-auto focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
      >
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-hairline border-b bg-white/[0.02]">
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="text-ash px-5 py-3.5 text-[0.6875rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-hairline/60 border-b transition-colors duration-200 last:border-b-0 hover:bg-white/[0.018]"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      'px-5 py-3.5 whitespace-nowrap',
                      cellIndex === 0 ? 'text-chalk font-medium' : 'text-ash',
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? (
        <p className="border-hairline text-steel border-t bg-white/[0.012] px-5 py-3 text-[0.8125rem]">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Definition grid                                                            */
/* -------------------------------------------------------------------------- */

export function DefinitionGrid({
  items,
  className,
}: {
  items: { label: string; value: string }[];
  className?: string;
}) {
  return (
    <dl
      className={cn('bg-hairline grid gap-px overflow-hidden rounded-md sm:grid-cols-2', className)}
    >
      {items.map((item) => (
        <div key={item.label} className="bg-charcoal p-5">
          <dt className="text-steel text-[0.6875rem] tracking-[0.16em] uppercase">{item.label}</dt>
          <dd className="text-bright mt-2 text-[0.9375rem] leading-snug font-medium">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------------------------- */
/* Tag list                                                                   */
/* -------------------------------------------------------------------------- */

export function TagList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {items.map((item) => (
        <li key={item}>
          <span className="border-hairline text-mist inline-block rounded-xs border bg-white/[0.02] px-3 py-1.5 text-[0.8125rem]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/* Checklist                                                                  */
/* -------------------------------------------------------------------------- */

export function Checklist({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item) => (
        <li key={item} className="text-mist flex gap-3 text-[0.9375rem] leading-relaxed">
          <span aria-hidden className="bg-arc-bright mt-[0.55rem] size-1.5 shrink-0 rotate-45" />
          {item}
        </li>
      ))}
    </ul>
  );
}
