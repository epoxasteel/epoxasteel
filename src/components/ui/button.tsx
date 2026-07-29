'use client';

import * as React from 'react';
import Link from 'next/link';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden',
    'font-medium whitespace-nowrap select-none',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-300',
    '[transition-timing-function:var(--ease-out-quint)]',
    'disabled:pointer-events-none disabled:opacity-45',
    'active:translate-y-px',
    '[&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300',
  ].join(' '),
  {
    variants: {
      variant: {
        /** The single strongest call to action on any given screen. */
        primary: [
          'bg-bright text-void border border-transparent',
          'shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-12px_rgba(0,0,0,0.8)]',
          'hover:bg-white hover:shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_14px_38px_-14px_rgba(0,0,0,0.9)]',
        ].join(' '),
        /** Deep industrial blue — used for in-context conversions. */
        arc: [
          'bg-arc text-white border border-arc-bright/40',
          'shadow-[0_1px_0_rgba(255,255,255,0.16)_inset,0_12px_34px_-16px_rgba(28,98,174,0.9)]',
          'hover:bg-arc-bright hover:border-arc-glow/50',
        ].join(' '),
        /** Hairline outline on dark — the default secondary action. */
        outline: [
          'border border-hairline-strong bg-white/[0.015] text-chalk backdrop-blur-sm',
          'hover:border-steel hover:bg-white/[0.04] hover:text-bright',
        ].join(' '),
        ghost: 'border border-transparent text-mist hover:bg-white/[0.04] hover:text-bright',
        link: 'h-auto! p-0! text-arc-glow underline underline-offset-4 decoration-arc-glow/40 hover:decoration-arc-glow',
      },
      size: {
        sm: 'h-9 rounded-sm px-4 text-[0.8125rem] [&_svg]:size-3.5',
        md: 'h-11 rounded-sm px-6 text-sm [&_svg]:size-4',
        lg: 'h-13 rounded-sm px-8 text-[0.9375rem] [&_svg]:size-4',
        icon: 'size-10 rounded-sm [&_svg]:size-4',
      },
      full: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md', full: false },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Renders a Next.js Link instead of a button. */
    href?: string;
    /** Adds the moving highlight used on hero and CTA buttons. */
    sheen?: boolean;
  };

/**
 * The sheen is a single absolutely positioned gradient that sweeps across on
 * hover. It is decorative, sits behind the label, and is hidden from assistive
 * technology.
 */
function Sheen() {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 -translate-x-full',
        'bg-linear-[105deg,transparent_35%,rgba(255,255,255,0.28)_50%,transparent_65%]',
        'transition-transform duration-[900ms] ease-out',
        'group-hover/btn:translate-x-full',
      )}
    />
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, full, asChild = false, href, sheen = false, children, ...props },
  ref,
) {
  const classes = cn(buttonVariants({ variant, size, full }), className);
  const content = (
    <>
      {sheen ? <Sheen /> : null}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);

    if (isExternal) {
      return (
        <a
          className={classes}
          href={href}
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {content}
        </a>
      );
    }

    /*
     * `prefetch={false}` turns off *viewport* prefetching only — App Router
     * still prefetches on hover and touch, so a deliberate click still lands on
     * a warm route.
     *
     * It matters because the two biggest buttons on the site point at /quote,
     * and that route's chunk is the largest we build: the form, its resolver
     * and its schema come to 326 KB. Prefetching it in the viewport meant every
     * visitor downloaded the quote form during the homepage's initial load,
     * competing for bandwidth with the page they were actually looking at.
     */
    return (
      <Link className={classes} href={href} prefetch={false}>
        {content}
      </Link>
    );
  }

  const Component = asChild ? Slot : 'button';

  return (
    <Component ref={ref} className={classes} {...props}>
      {content}
    </Component>
  );
});

export { buttonVariants };
