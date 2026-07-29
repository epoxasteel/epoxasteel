'use client';

import * as React from 'react';
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Counts up to a target the first time it scrolls into view.
 *
 * The span is rendered with the final value in the DOM for screen readers and
 * for anyone with reduced motion enabled; only the visual text node is
 * animated, via a subscription rather than React state, so a four-second count
 * does not trigger two hundred re-renders.
 */
export function Counter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  duration = 2,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  const format = React.useCallback(
    (input: number) => {
      const rounded =
        decimals > 0 ? input.toFixed(decimals) : Math.round(input).toLocaleString('en-US');
      return `${prefix}${decimals > 0 ? Number(rounded).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : rounded}${suffix}`;
    },
    [decimals, prefix, suffix],
  );

  React.useEffect(() => {
    if (inView && !reduce) motionValue.set(value);
  }, [inView, motionValue, reduce, value]);

  React.useEffect(() => {
    if (reduce) return;
    return spring.on('change', (latest) => {
      const node = ref.current;
      if (node) node.textContent = format(latest);
    });
  }, [format, reduce, spring]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {format(reduce ? value : 0)}
    </span>
  );
}

/**
 * Parses display strings like "1,400,000+", "99.4%", "48h" or "AESS 4" and
 * animates the numeric part when there is one. Lets content authors write a
 * single readable string instead of five separate fields.
 */
export function SmartCounter({ display, className }: { display: string; className?: string }) {
  const match = display.match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return <span className={className}>{display}</span>;
  }

  const [, prefix, numeric, suffix] = match;
  const value = Number(numeric.replace(/,/g, ''));
  const decimals = numeric.includes('.') ? numeric.split('.')[1].length : 0;

  if (!Number.isFinite(value)) {
    return <span className={className}>{display}</span>;
  }

  return (
    <Counter
      className={className}
      value={value}
      decimals={decimals}
      prefix={prefix}
      suffix={suffix}
    />
  );
}
