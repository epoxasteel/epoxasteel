'use client';

import * as React from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import { cn, pad } from '@/lib/utils';
import { Eyebrow } from '@/components/layout/section';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { LifecycleStage } from '@/components/home/lifecycle-art';
import { useSettledReducedMotion } from '@/lib/use-hydrated';

/**
 * The lifecycle sequence — the site's second signature moment.
 *
 * A tall scroll container with a pinned stage inside it. As the user scrolls,
 * the stage cross-fades through the twelve steps a beam takes from skyline to
 * skyline. The chapter artwork is drawn with SVG primitives rather than
 * photographed, so the sequence weighs almost nothing and stays sharp.
 *
 * With reduced motion the whole thing degrades to a plain vertical list — same
 * content, no pinning, no cross-fades. That swap happens after hydration; see the
 * note on `reduce` below for why it cannot happen during it.
 */

export function Lifecycle({ stages }: { stages: LifecycleStage[] }) {
  /*
   * Settled, not raw. This component returns two entirely different trees, and
   * the server cannot see a media query — so branching on the raw value rendered
   * the pinned version on the server and hydrated the static one over it for
   * every reduced-motion visitor, throwing away and rebuilding the whole
   * homepage below the hero. `useSettledReducedMotion` reports false until
   * hydration finishes, so the swap happens after React has matched the markup
   * rather than instead of it.
   */
  const reduce = useSettledReducedMotion(useReducedMotion());
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (reduce) return;
    return scrollYProgress.on('change', (value) => {
      const index = Math.min(stages.length - 1, Math.floor(value * stages.length));
      setActive(index);
    });
  }, [reduce, scrollYProgress, stages.length]);

  if (reduce) {
    return <LifecycleStatic stages={stages} />;
  }

  return (
    <section
      ref={containerRef}
      aria-label="The lifecycle of structural steel"
      className="bg-graphite relative"
      /*
       * Scroll budget per stage. At 78vh this section ran to 8,400px — a third
       * of the whole homepage, and a wall the visitor had to climb before
       * reaching a single product. 42vh still gives each stage a beat to land
       * while nearly halving the distance.
       */
      style={{ height: `${stages.length * 42}vh` }}
    >
      <div className="sticky top-0 flex h-dvh min-h-[34rem] items-center overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(72% 58% at 68% 44%, rgba(28,98,174,0.14) 0%, transparent 68%)',
          }}
          aria-hidden
        />
        <ProgressRail progress={scrollYProgress} />

        <div className="container-page relative grid w-full items-center gap-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
          {/* Copy column */}
          <div className="relative">
            <Eyebrow>From molten metal to standing structure</Eyebrow>

            <div className="relative mt-8 h-52 sm:h-48">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.title}
                  initial={false}
                  animate={{
                    opacity: index === active ? 1 : 0,
                    y: index === active ? 0 : index < active ? -22 : 22,
                  }}
                  transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
                  className={cn(
                    'absolute inset-0',
                    index === active ? 'pointer-events-auto' : 'pointer-events-none',
                  )}
                  aria-hidden={index !== active}
                >
                  <p className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">
                    {pad(index + 1)} / {pad(stages.length)}
                  </p>
                  <h2 className="font-display text-headline text-bright mt-4 font-semibold">
                    {stage.title}
                  </h2>
                  <p className="text-ash mt-4 max-w-md text-[1.0625rem] leading-relaxed">
                    {stage.caption}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Stage ticks */}
            <ol className="mt-4 flex flex-wrap gap-1.5" aria-hidden>
              {stages.map((stage, index) => (
                <li key={stage.title}>
                  <span
                    className={cn(
                      'block h-0.5 w-5 transition-colors duration-500',
                      index <= active ? 'bg-arc-bright' : 'bg-hairline',
                    )}
                  />
                </li>
              ))}
            </ol>
          </div>

          {/*
            Stage artwork, windowed.

            The scenes are files now, not markup (see `lifecycle-art.tsx`), and
            only the active stage and its neighbours are mounted: the cross-fade
            has both the outgoing and incoming drawing, and the other nine are
            never requested at all. `loading="lazy"` means a visitor who stops
            before this section downloads none of them.
          */}
          <div className="border-hairline bg-void relative aspect-4/3 w-full overflow-hidden rounded-lg border sm:aspect-16/10 lg:aspect-4/3">
            {stages.map((stage, index) =>
              Math.abs(index - active) <= 1 ? (
                <motion.div
                  key={stage.title}
                  initial={false}
                  animate={{
                    opacity: index === active ? 1 : 0,
                    scale: index === active ? 1 : 1.05,
                  }}
                  transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
                  className="absolute inset-0"
                  aria-hidden
                >
                  {/* Decorative: the heading and caption beside it carry the
                      meaning, so an alt text would say everything twice.

                      A plain <img> on purpose. These are SVG, so there is no
                      raster for next/image's optimizer to resize or re-encode —
                      it would proxy each file through a serverless route to hand
                      back the same bytes, and serving SVG through the optimizer
                      needs `dangerouslyAllowSVG`, which we will not turn on for
                      artwork we already ship ourselves. Width, height, lazy and
                      async below give us what next/image was going to: no layout
                      shift, no download before the section is near. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stage.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    className="size-full object-cover"
                  />
                </motion.div>
              ) : null,
            )}

            <div
              className="pointer-events-none absolute inset-0 ring-1 ring-white/[0.04] ring-inset"
              aria-hidden
            />
            <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Reduced-motion fallback: the same twelve stages, as an ordinary list. */
function LifecycleStatic({ stages }: { stages: LifecycleStage[] }) {
  return (
    <section className="section-y bg-graphite" aria-label="The lifecycle of structural steel">
      <div className="container-page">
        <Eyebrow>From molten metal to standing structure</Eyebrow>
        <ol className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <li key={stage.title} className="border-hairline border-t pt-5">
              <p className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">
                {pad(index + 1)}
              </p>
              <h3 className="font-display text-title text-bright mt-2 font-semibold">
                {stage.title}
              </h3>
              <p className="text-ash mt-2 text-[0.9375rem] leading-relaxed">{stage.caption}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ProgressRail({ progress }: { progress: MotionValue<number> }) {
  const height = useTransform(progress, [0, 1], ['0%', '100%']);

  return (
    <div
      aria-hidden
      className="bg-hairline absolute top-1/2 left-4 hidden h-56 w-px -translate-y-1/2 xl:block"
    >
      <motion.div style={{ height }} className="bg-arc-bright w-px origin-top" />
    </div>
  );
}
