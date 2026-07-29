'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { testimonials } from '@/content/testimonials';
import { Section, Eyebrow } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * Testimonial carousel.
 *
 * One quote at a time, at a size that says the company stands behind it.
 * Advances automatically but pauses on hover, on focus and whenever the tab is
 * hidden — an auto-advancing carousel that steals focus or runs in a background
 * tab is an accessibility problem, not a feature.
 */
export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [paused, setPaused] = React.useState(false);
  const reduce = useReducedMotion();

  const go = React.useCallback((next: number, dir: number) => {
    setDirection(dir);
    setIndex((next + testimonials.length) % testimonials.length);
  }, []);

  React.useEffect(() => {
    if (paused || reduce) return;

    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % testimonials.length);
    }, 8000);

    return () => window.clearInterval(timer);
  }, [paused, reduce]);

  // Pause while the tab is in the background.
  React.useEffect(() => {
    function onVisibility() {
      setPaused(document.hidden);
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const current = testimonials[index];

  const variants = {
    enter: (dir: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * 44 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: dir * -44 }),
  };

  return (
    <Section tone="graphite" className="border-hairline overflow-hidden border-y">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="container-page relative">
        <div
          className="mx-auto max-w-4xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <Reveal direction="none">
            <Eyebrow index={9} className="justify-center">
              What clients say
            </Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <Quote aria-hidden className="text-arc/45 mx-auto mt-10 size-9" strokeWidth={1.5} />
          </Reveal>

          <div className="relative mt-8 min-h-72 sm:min-h-64" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                className="absolute inset-0 flex flex-col items-center text-center"
              >
                <blockquote className="font-display text-bright text-[clamp(1.25rem,1rem+1.3vw,1.9rem)] leading-[1.45] font-medium text-balance">
                  “{current.quote}”
                </blockquote>

                <figcaption className="mt-8">
                  <p className="text-chalk text-[0.9375rem] font-medium">{current.name}</p>
                  <p className="text-ash mt-1 text-[0.875rem]">
                    {current.role}, {current.company}
                  </p>
                  {current.project ? (
                    <p className="text-steel mt-2 text-[0.75rem] tracking-[0.14em] uppercase">
                      {current.project}
                    </p>
                  ) : null}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => go(index - 1, -1)}
              aria-label="Previous testimonial"
              className={cn(
                'border-hairline text-mist grid size-10 place-items-center rounded-full border',
                'hover:border-hairline-strong hover:text-bright transition-colors duration-300',
              )}
            >
              <ArrowLeft aria-hidden className="size-4" />
            </button>

            <ol className="flex items-center gap-2">
              {testimonials.map((testimonial, position) => (
                <li key={testimonial.name}>
                  <button
                    type="button"
                    onClick={() => go(position, position > index ? 1 : -1)}
                    aria-label={`Show testimonial ${position + 1} of ${testimonials.length}`}
                    aria-current={position === index ? 'true' : undefined}
                    className={cn(
                      'h-1 rounded-full transition-all duration-500',
                      position === index
                        ? 'bg-arc-bright w-8'
                        : 'bg-hairline-strong hover:bg-steel w-2',
                    )}
                  />
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => go(index + 1, 1)}
              aria-label="Next testimonial"
              className={cn(
                'border-hairline text-mist grid size-10 place-items-center rounded-full border',
                'hover:border-hairline-strong hover:text-bright transition-colors duration-300',
              )}
            >
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
