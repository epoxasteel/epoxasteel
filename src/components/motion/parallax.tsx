'use client';

import * as React from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSettledReducedMotion } from '@/lib/use-hydrated';

/**
 * Scroll-linked vertical drift.
 *
 * The movement is deliberately small — around 40–90px across a full viewport
 * of scrolling. Parallax that announces itself reads as a gimmick; parallax
 * you only notice when it is removed reads as depth.
 */
export function Parallax({
  children,
  className,
  /** Positive drifts up as you scroll down; negative drifts down. */
  strength = 60,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: 'div' | 'span' | 'section';
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useSettledReducedMotion(useReducedMotion());

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [strength, -strength]);
  // Smoothing removes the micro-jitter of trackpad and momentum scrolling.
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  const Component = motion[as];

  if (reduce) {
    const Static = as;
    return (
      <Static ref={ref as never} className={className}>
        {children}
      </Static>
    );
  }

  return (
    <Component ref={ref} className={className} style={{ y }}>
      {children}
    </Component>
  );
}

/**
 * A thin progress bar bound to page scroll, fixed under the header.
 * Purely decorative and hidden from assistive technology.
 */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left',
        'from-arc via-arc-bright to-arc-glow bg-linear-to-r',
        className,
      )}
    />
  );
}
