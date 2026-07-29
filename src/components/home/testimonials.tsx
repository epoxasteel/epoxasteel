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
 * The quote and caption styling lives here rather than inline, because the
 * invisible height reservation below has to be byte-identical to the visible
 * quote. Two copies of a class list would drift, and the failure mode is a
 * caption covering the controls again.
 */
const QUOTE_CLASS =
  'font-display text-bright text-[clamp(1.25rem,1rem+1.3vw,1.9rem)] leading-[1.45] font-medium text-balance';
const CAPTION_CLASS = 'mt-9 flex flex-col items-center';

/** The tallest testimonial, used to reserve space for all of them. */
const longest = testimonials.reduce((a, b) => (b.quote.length > a.quote.length ? b : a));

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
            <Eyebrow index={8} className="justify-center">
              What clients say
            </Eyebrow>
          </Reveal>

          <Reveal delay={0.08}>
            <Quote aria-hidden className="text-arc/45 mx-auto mt-10 size-9" strokeWidth={1.5} />
          </Reveal>

          {/*
            The quotes cross-fade, so one has to be able to sit on top of
            another — which means the container cannot simply size to whichever
            is showing, or the page would jump every eight seconds.

            It used to be a hand-set `min-h-72`. That is a number that is wrong
            the moment the copy changes, and it was: the longest quote overflowed
            it and the caption ended up sitting on top of the carousel dots,
            swallowing their clicks entirely on a phone.

            So the height is reserved by the longest testimonial itself, rendered
            invisibly in the same grid cell with a caption of maximum depth.
            Always exactly tall enough, at every width, with no magic number and
            no layout shift.
          */}
          <div className="mt-8 grid" aria-live="polite" aria-atomic="true">
            <div aria-hidden className="invisible text-center [grid-area:1/1]">
              <p className={QUOTE_CLASS}>“{longest.quote}”</p>
              <div className={CAPTION_CLASS}>
                <span className="h-px w-14" />
                <p className="font-display mt-6 text-[1.0625rem] font-semibold">{longest.name}</p>
                <p className="mt-1.5 text-[0.875rem]">
                  {longest.role}, {longest.company}
                </p>
                <p className="mt-3 text-[0.6875rem] tracking-[0.18em] uppercase">
                  {longest.project ?? 'Project reference'}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                className="flex flex-col items-center text-center [grid-area:1/1]"
              >
                <blockquote className={QUOTE_CLASS}>“{current.quote}”</blockquote>

                {/* The name carried barely more weight than the role beneath it,
                    so the whole attribution read as one grey block. A hairline
                    plus a step up in size and brightness makes the person the
                    thing you read, and their title the footnote it should be. */}
                <figcaption className={CAPTION_CLASS}>
                  <span
                    aria-hidden
                    className="via-hairline-strong h-px w-14 bg-linear-to-r from-transparent to-transparent"
                  />
                  <p className="font-display text-bright mt-6 text-[1.0625rem] font-semibold">
                    {current.name}
                  </p>
                  <p className="text-ash mt-1.5 text-[0.875rem]">
                    {current.role}, {current.company}
                  </p>
                  {current.project ? (
                    <p className="text-steel mt-3 text-[0.6875rem] tracking-[0.18em] uppercase">
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
