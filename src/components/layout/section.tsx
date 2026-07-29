import * as React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn, pad } from '@/lib/utils';
import { Reveal } from '@/components/motion/reveal';
import { Breadcrumbs, type Crumb } from '@/components/ui/misc';

/**
 * Section shells and headings.
 *
 * Every section on the site is built from these, which is what keeps the
 * vertical rhythm, the eyebrow treatment and the heading scale identical from
 * the homepage through to the legal pages.
 */

export function Section({
  children,
  className,
  id,
  size = 'default',
  tone = 'void',
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  size?: 'default' | 'sm';
  tone?: 'void' | 'graphite' | 'charcoal';
}) {
  const tones = {
    void: 'bg-void',
    graphite: 'bg-graphite',
    charcoal: 'bg-charcoal',
  };

  return (
    <section
      id={id}
      className={cn(
        'relative',
        size === 'sm' ? 'section-y-sm' : 'section-y',
        tones[tone],
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  index,
  className,
}: {
  children: React.ReactNode;
  /** Renders a zero-padded section number, e.g. "03". */
  index?: number;
  className?: string;
}) {
  return (
    <p className={cn('text-eyebrow text-arc-glow flex items-center gap-3 uppercase', className)}>
      {typeof index === 'number' ? (
        <span className="text-steel font-mono tabular-nums">{pad(index)}</span>
      ) : null}
      <span aria-hidden className="bg-arc/60 h-px w-6" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  align = 'left',
  action,
  className,
  as = 'h2',
}: {
  eyebrow?: string;
  index?: number;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  action?: { label: string; href: string };
  className?: string;
  as?: 'h1' | 'h2';
}) {
  const Title = as;

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center'
          ? 'items-center text-center'
          : action
            ? 'md:flex-row md:items-end md:justify-between md:gap-12'
            : '',
        className,
      )}
    >
      <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <Reveal direction="none">
            <Eyebrow index={index} className={align === 'center' ? 'justify-center' : ''}>
              {eyebrow}
            </Eyebrow>
          </Reveal>
        ) : null}

        <Reveal delay={0.06}>
          <Title
            className={cn(
              'font-display text-headline text-bright font-semibold',
              eyebrow ? 'mt-5' : '',
            )}
          >
            {title}
          </Title>
        </Reveal>

        {description ? (
          <Reveal delay={0.12}>
            <div className="text-lead text-ash mt-5">{description}</div>
          </Reveal>
        ) : null}
      </div>

      {action ? (
        <Reveal delay={0.18} className="shrink-0">
          <ArrowLink href={action.href}>{action.label}</ArrowLink>
        </Reveal>
      ) : null}
    </div>
  );
}

/** The site's standard "read more" affordance. */
export function ArrowLink({
  href,
  children,
  className,
  tone = 'default',
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tone?: 'default' | 'accent';
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group/arrow inline-flex items-center gap-2.5 text-[0.875rem] font-medium',
        'transition-colors duration-300',
        tone === 'accent' ? 'text-arc-glow hover:text-arc-bright' : 'text-chalk hover:text-bright',
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          'border-hairline-strong grid size-7 place-items-center rounded-full border',
          'transition-all duration-400 [transition-timing-function:var(--ease-out-quint)]',
          'group-hover/arrow:border-arc-bright group-hover/arrow:bg-arc/15',
        )}
      >
        <ArrowRight className="size-3.5 transition-transform duration-400 group-hover/arrow:translate-x-0.5" />
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Page hero                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * The masthead used by every page except the homepage. Consistent height,
 * consistent breadcrumb placement, consistent atmospheric treatment — so the
 * site feels like one document rather than a set of pages.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  trail,
  children,
  align = 'left',
  meta,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  trail?: Crumb[];
  children?: React.ReactNode;
  align?: 'left' | 'center';
  meta?: React.ReactNode;
}) {
  return (
    <section className="border-hairline bg-graphite relative overflow-hidden border-b">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="bg-vignette pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="from-void pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-linear-to-t to-transparent"
        aria-hidden
      />

      <div
        className={cn(
          'container-page relative pt-(--header-h)',
          align === 'center' ? 'text-center' : '',
        )}
      >
        <div className="pt-12 pb-14 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
          {trail ? (
            <Reveal direction="none">
              <Breadcrumbs
                trail={trail}
                className={cn('mb-8', align === 'center' && 'flex justify-center')}
              />
            </Reveal>
          ) : null}

          <div className={cn('max-w-4xl', align === 'center' && 'mx-auto')}>
            {eyebrow ? (
              <Reveal direction="none">
                <Eyebrow className={align === 'center' ? 'justify-center' : ''}>{eyebrow}</Eyebrow>
              </Reveal>
            ) : null}

            <Reveal delay={0.05}>
              <h1
                className={cn(
                  'font-display text-display text-bright font-semibold',
                  eyebrow ? 'mt-5' : '',
                )}
              >
                {title}
              </h1>
            </Reveal>

            {description ? (
              <Reveal delay={0.11}>
                <div
                  className={cn(
                    'text-lead text-ash mt-6 max-w-2xl',
                    align === 'center' && 'mx-auto',
                  )}
                >
                  {description}
                </div>
              </Reveal>
            ) : null}

            {meta ? (
              <Reveal delay={0.16}>
                <div className="mt-8">{meta}</div>
              </Reveal>
            ) : null}

            {children ? (
              <Reveal delay={0.2}>
                <div className="mt-9">{children}</div>
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Structured data                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Renders a JSON-LD payload. The object is serialised here rather than
 * hand-written as a string, and `<` is escaped so a value containing markup
 * cannot close the script element early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
