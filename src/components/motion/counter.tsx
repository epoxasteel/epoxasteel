'use client';

import * as React from 'react';
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Counts up to a target the first time it scrolls into view.
 *
 * ## The final value is always what renders
 *
 * The markup contains the real number from the very first render — server and
 * client, motion or not. The animation is then applied *to the DOM node* by an
 * effect, via a spring subscription rather than React state, so a four-second
 * count does not trigger two hundred re-renders.
 *
 * That ordering is deliberate and it used to be the other way round. The initial
 * render was `format(reduce ? value : 0)`, which looks reasonable and is a
 * hydration bug: `useReducedMotion` cannot know the media query on the server, so
 * a visitor with reduced motion enabled got `0` in the server HTML and `1.4M+`
 * from the client, and React threw a text-content mismatch on every page carrying
 * a statistic. It only appeared with reduced motion switched on, which is exactly
 * the configuration least likely to be tested.
 *
 * Rendering the true value first also means the number is correct for a screen
 * reader, correct before hydration, and correct if the JavaScript never arrives.
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

  /*
   * Drop to zero and start climbing in the same tick.
   *
   * Both halves have to be here rather than in the render: the markup must carry
   * the final value so the server and the hydrated client agree, and the reset is
   * only correct once we know motion is allowed — which is a client-only fact.
   */
  React.useEffect(() => {
    if (reduce || !inView) return;
    const node = ref.current;
    if (node) node.textContent = format(0);
    motionValue.set(value);
  }, [format, inView, motionValue, reduce, value]);

  React.useEffect(() => {
    if (reduce) return;
    return spring.on('change', (latest) => {
      const node = ref.current;
      if (node) node.textContent = format(latest);
    });
  }, [format, reduce, spring]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {format(value)}
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
