'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Pulls an element gently toward the pointer while hovering.
 *
 * Applied only to the primary hero call to action — used on every button it
 * would feel like the interface is squirming. Disabled entirely for coarse
 * pointers (where there is no hover to respond to) and reduced motion.
 */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 22, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 240, damping: 22, mass: 0.35 });

  React.useEffect(() => {
    if (reduce) return;
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [reduce]);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    const bounds = node.getBoundingClientRect();
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * strength);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
