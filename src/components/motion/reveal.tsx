'use client';

import * as React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * The site's single scroll-reveal primitive.
 *
 * Everything that appears on scroll goes through this component so timing,
 * distance and easing are identical everywhere — the difference between a site
 * that feels designed and one that feels assembled.
 *
 * `useReducedMotion` collapses the transform and shortens the fade rather than
 * removing the animation entirely, so the page still feels alive to users who
 * ask for less motion without anything sliding around.
 */

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const DISTANCE = 26;

function offset(direction: Direction) {
  switch (direction) {
    case 'up':
      return { y: DISTANCE };
    case 'down':
      return { y: -DISTANCE };
    case 'left':
      return { x: DISTANCE };
    case 'right':
      return { x: -DISTANCE };
    default:
      return {};
  }
}

export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  once = true,
  as = 'div',
  amount = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'span';
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...(reduce ? {} : offset(direction)) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      transition={{
        duration: reduce ? 0.3 : duration,
        delay: reduce ? 0 : delay,
        ease: EASE_OUT_EXPO,
      }}
    >
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/* Staggered group                                                            */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.05 },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

const reducedItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * Wrap a list and its children reveal in sequence. Children must be
 * `RevealItem` (or any motion element declaring the same variant names).
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = 'div',
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: 'div' | 'ul' | 'ol' | 'section';
  amount?: number;
}) {
  const Component = motion[as];

  return (
    <Component
      className={className}
      variants={containerVariants}
      custom={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: '0px 0px -6% 0px' }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component className={className} variants={reduce ? reducedItemVariants : itemVariants}>
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/* Masked line reveal                                                         */
/* -------------------------------------------------------------------------- */

const maskedLineVariants: Variants = {
  // Both keyframes are percentages: animating '110%' -> 0 mixes units and
  // leaves the line stranded below its mask.
  hidden: { y: '110%' },
  visible: (timing: { delay: number }) => ({
    y: '0%',
    transition: { duration: 1, delay: timing.delay, ease: EASE_OUT_EXPO },
  }),
};

const reducedMaskedLineVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/**
 * A line of text that rises from behind a mask. Reserved for headline-level
 * type — used on body copy it reads as fussy rather than considered.
 *
 * The scroll trigger deliberately lives on the outer wrapper rather than on the
 * animated line. Each line starts translated fully below its own
 * `overflow-hidden` parent, so its clipped area is exactly zero — an
 * IntersectionObserver attached to it would report a ratio of 0 forever and the
 * reveal would never fire. Observing the unclipped wrapper and propagating
 * through variants avoids that entirely.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className={cn('block', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={cn('block', lineClassName)}
            variants={reduce ? reducedMaskedLineVariants : maskedLineVariants}
            custom={{ delay: delay + index * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
