'use client';

import * as React from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowDown, Play } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/motion/magnetic';
import { WordmarkStacked } from '@/components/visual/wordmark';
import {
  Atmosphere,
  SkylineFar,
  SkylineMid,
  SkylineNear,
  SteelFrameForeground,
} from '@/components/visual/city-scene';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * The hero.
 *
 * Two things are happening here. The **backdrop** is a parallaxed vector city
 * that ships with the site, with optional video fading in over it once the
 * browser confirms it can play — so the opening is cinematic on the very first
 * deploy and gets better when footage arrives, without a code change.
 *
 * The **overture** is the scripted opening: "Reinforce Your Dream." resolves
 * into the wordmark and then hands over to the hero content. It plays once per
 * browsing session, is skippable at any moment, and is bypassed entirely for
 * reduced-motion users — who go straight to the settled hero.
 */

const OVERTURE_KEY = 'epoxa:overture-played';

/**
 * Reads "has the overture already played this session?" from sessionStorage.
 *
 * `useSyncExternalStore` is the sanctioned way to read a browser-only value in
 * a server-rendered component: the server snapshot reports "already played", so
 * the HTML that ships (and that search engines and the LCP measurement see) is
 * the settled hero with its real heading. React then swaps to the client
 * snapshot after hydration, with no mismatch warning and no flash.
 */
function subscribeToOverture(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

function readOverturePlayed() {
  try {
    return window.sessionStorage.getItem(OVERTURE_KEY) === '1';
  } catch {
    // Private browsing or blocked storage — treat it as unplayed.
    return false;
  }
}

export function Hero() {
  const reduce = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);

  const alreadyPlayed = React.useSyncExternalStore(
    subscribeToOverture,
    readOverturePlayed,
    () => true,
  );

  const [finished, setFinished] = React.useState(false);

  // Reduced motion skips the overture entirely and goes straight to the hero.
  const phase: 'overture' | 'settled' =
    !reduce && !alreadyPlayed && !finished ? 'overture' : 'settled';

  const finishOverture = React.useCallback(() => {
    setFinished(true);
    try {
      window.sessionStorage.setItem(OVERTURE_KEY, '1');
    } catch {
      /* Storage unavailable — the overture simply plays again next time. */
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);

  return (
    <section
      ref={containerRef}
      aria-label="EPOXA STEEL — Reinforce Your Dream"
      className="bg-void relative h-dvh min-h-[38rem] w-full overflow-hidden"
    >
      <HeroBackdrop scrollYProgress={scrollYProgress} />

      {/* Legibility scrim — a single gradient rather than a flat overlay, so
          the sky stays clean while the text sits on enough contrast. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(6,7,9,0.9) 0%, rgba(6,7,9,0.62) 32%, rgba(6,7,9,0.08) 60%, rgba(6,7,9,0.3) 100%)',
        }}
      />
      <div
        aria-hidden
        className="from-void via-void/70 pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-linear-to-t to-transparent"
      />
      <div aria-hidden className="bg-grain pointer-events-none absolute inset-0" />

      <AnimatePresence mode="wait">
        {phase === 'overture' ? <Overture key="overture" onDone={finishOverture} /> : null}
      </AnimatePresence>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative flex h-full items-center"
      >
        <div className="container-page w-full pt-(--header-h)">
          <HeroContent active={phase === 'settled'} />
        </div>
      </motion.div>

      {phase === 'settled' ? <ScrollCue /> : null}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Backdrop                                                                   */
/* -------------------------------------------------------------------------- */

function HeroBackdrop({
  scrollYProgress,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const reduce = useReducedMotion();

  // Nearer layers move further — the whole illusion, in three numbers.
  const farY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const nearY = useTransform(scrollYProgress, [0, 1], ['0%', '34%']);
  const frontY = useTransform(scrollYProgress, [0, 1], ['0%', '52%']);
  const skyScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const style = (y: typeof farY) => (reduce ? undefined : { y });

  return (
    <div className="absolute inset-0" aria-hidden>
      <motion.div style={reduce ? undefined : { scale: skyScale }} className="absolute inset-0">
        <Atmosphere />
      </motion.div>

      <motion.div style={style(farY)} className="absolute inset-x-0 bottom-0 h-[62%] opacity-90">
        <SkylineFar />
      </motion.div>

      <motion.div style={style(midY)} className="absolute inset-x-0 bottom-0 h-[54%]">
        <SkylineMid />
      </motion.div>

      <motion.div style={style(nearY)} className="absolute inset-x-0 bottom-0 h-[44%]">
        <SkylineNear />
      </motion.div>

      {/* Haze between the skyline and the foreground frame gives the scene air. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[38%]"
        style={{
          background:
            'linear-gradient(to top, rgba(10,16,26,0.9) 0%, rgba(10,16,26,0.35) 55%, transparent 100%)',
        }}
      />

      <motion.div style={style(frontY)} className="absolute inset-x-0 -bottom-8 h-[34%] opacity-95">
        <SteelFrameForeground />
      </motion.div>

      <HeroVideo />
    </div>
  );
}

/**
 * Optional video layer.
 *
 * Rendered underneath nothing and above everything: it starts fully
 * transparent and only fades in once `canplaythrough` fires, so a missing file,
 * a slow connection or a codec the browser dislikes all degrade to the vector
 * scene with no flash of empty space.
 */
function HeroVideo() {
  const [ready, setReady] = React.useState(false);
  const reduce = useReducedMotion();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const externalSource = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || reduce) return;

    // Some browsers restore a paused state on back-navigation.
    const play = () => video.play().catch(() => undefined);
    if (video.readyState >= 3) {
      setReady(true);
      play();
    }
  }, [reduce]);

  if (reduce) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 1.6, ease: EASE_OUT_EXPO }}
      className="absolute inset-0"
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-hidden
        tabIndex={-1}
        onCanPlayThrough={() => setReady(true)}
        onError={() => setReady(false)}
        className="size-full object-cover"
      >
        {externalSource ? <source src={externalSource} /> : null}
        <source src="/media/hero.webm" type="video/webm" />
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
      {/* Grade the footage into the palette so any source material matches. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(6,10,18,0.5) 0%, rgba(8,14,24,0.3) 45%, rgba(6,7,9,0.72) 100%)',
        }}
      />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Overture                                                                   */
/* -------------------------------------------------------------------------- */

function Overture({ onDone }: { onDone: () => void }) {
  const [beat, setBeat] = React.useState<0 | 1>(0);

  React.useEffect(() => {
    const toWordmark = window.setTimeout(() => setBeat(1), 2400);
    const toHero = window.setTimeout(onDone, 5200);

    function skip(event: KeyboardEvent) {
      if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') onDone();
    }

    window.addEventListener('keydown', skip);

    return () => {
      window.clearTimeout(toWordmark);
      window.clearTimeout(toHero);
      window.removeEventListener('keydown', skip);
    };
  }, [onDone]);

  return (
    <motion.div
      // aria-hidden: the same words are in the hero heading underneath, so
      // screen readers get the content once, not twice.
      aria-hidden
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
      className="bg-void/55 absolute inset-0 z-30 flex items-center justify-center backdrop-blur-[2px]"
      onClick={onDone}
    >
      <AnimatePresence mode="wait">
        {beat === 0 ? (
          <motion.p
            key="line"
            className="font-display text-display-lg text-bright px-6 text-center font-semibold"
            initial={{ opacity: 0, filter: 'blur(14px)', scale: 1.04 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.985 }}
            transition={{ duration: 1.3, ease: EASE_OUT_EXPO }}
          >
            Reinforce Your Dream.
          </motion.p>
        ) : (
          <motion.div
            key="mark"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            className="px-6"
          >
            <WordmarkStacked />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.9 }}
              className="text-eyebrow text-steel mt-6 text-center uppercase"
            >
              Established {siteConfig.founded}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onDone();
        }}
        className={cn(
          'border-hairline bg-void/60 absolute right-6 bottom-8 rounded-sm border px-4 py-2',
          'text-steel text-[0.75rem] tracking-[0.16em] uppercase backdrop-blur-sm',
          'hover:border-hairline-strong hover:text-mist transition-colors duration-300',
        )}
      >
        Skip intro
      </button>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero content                                                               */
/* -------------------------------------------------------------------------- */

function HeroContent({ active }: { active: boolean }) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
  };

  const item = reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        hidden: { opacity: 0, y: 26 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE_OUT_EXPO } },
      };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={active ? 'visible' : 'hidden'}
      className="max-w-3xl"
    >
      <motion.p
        variants={item}
        className="text-eyebrow text-arc-glow flex items-center gap-3 uppercase"
      >
        <span aria-hidden className="bg-arc h-px w-10" />
        Structural steel · Since {siteConfig.founded}
      </motion.p>

      <motion.h1
        variants={item}
        className="font-display text-display-xl text-bright mt-7 font-extrabold"
      >
        Reinforce
        <br />
        <span className="text-metal">Your Dream.</span>
      </motion.h1>

      <motion.p variants={item} className="text-lead text-mist mt-8 max-w-xl">
        EPOXA STEEL supplies certified structural steel, plate, tube and reinforcement to
        commercial, residential and industrial construction — backed by in-house fabrication,
        mill-traceable documentation and delivery sequenced to your erection programme.
      </motion.p>

      <motion.div variants={item} className="mt-11 flex flex-wrap items-center gap-4">
        <Magnetic>
          <Button href="/quote" size="lg" sheen>
            Request a Quote
            <ArrowRight aria-hidden />
          </Button>
        </Magnetic>

        <Button href="/products" size="lg" variant="outline">
          <Play aria-hidden className="size-3.5" />
          Explore Products
        </Button>
      </motion.div>

      <motion.dl
        variants={item}
        className="border-hairline/70 mt-14 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 border-t pt-8 sm:grid-cols-4"
      >
        {[
          { value: '1.4M+', label: 'Tonnes supplied' },
          { value: '2,600+', label: 'Projects delivered' },
          { value: '99.4%', label: 'On-time delivery' },
          { value: '34', label: 'Countries served' },
        ].map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd>
              <span className="font-display text-bright block text-2xl font-semibold tabular-nums">
                {stat.value}
              </span>
              <span className="text-steel mt-1 block text-[0.75rem] tracking-[0.1em] uppercase">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </motion.dl>
    </motion.div>
  );
}

function ScrollCue() {
  return (
    <motion.a
      href="#introduction"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
      className={cn(
        'group absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2.5',
        'text-steel text-[0.6875rem] tracking-[0.2em] uppercase',
        'hover:text-mist transition-colors duration-300 lg:flex',
      )}
    >
      Scroll
      <span className="border-hairline-strong relative grid h-9 w-5 place-items-start overflow-hidden rounded-full border pt-1.5">
        <motion.span
          aria-hidden
          className="bg-arc-bright size-1 rounded-full"
          animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </span>
      <ArrowDown
        aria-hidden
        className="size-3 transition-transform duration-300 group-hover:translate-y-0.5"
      />
    </motion.a>
  );
}
