'use client';

import * as React from 'react';
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowDown, Play } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/motion/magnetic';
import { WordmarkStacked } from '@/components/visual/wordmark';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { OVERTURE_KEY } from '@/components/home/overture-script';

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

/**
 * The parallax layers, rendered on the server and handed in as nodes.
 *
 * The city scene builds hundreds of SVG elements from a seeded PRNG. Doing that
 * inside this client component meant the whole generator shipped as JavaScript
 * and ran on the main thread before the hero could paint. Rendering it upstream
 * puts the finished markup in the initial HTML and keeps the generator out of
 * the browser bundle entirely — this component only animates what it is given.
 */
export type HeroVideoSource = { src: string; type: string };

export type HeroLayers = {
  atmosphere: React.ReactNode;
  far: React.ReactNode;
  mid: React.ReactNode;
  near: React.ReactNode;
  frame: React.ReactNode;
};

export function Hero({ layers, video = [] }: { layers: HeroLayers; video?: HeroVideoSource[] }) {
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

  /*
   * Is the overture part of *this* page view?
   *
   * False on the server and for anyone returning within the session, and that
   * is the point: when there is no intro to hand over from, the hero content is
   * rendered as plain, fully-visible markup rather than a Framer tree waiting at
   * `opacity: 0`. The headline is in the HTML, so it paints with the document.
   */
  const entrance = !reduce && !alreadyPlayed;

  const finishOverture = React.useCallback(() => {
    setFinished(true);
    document.documentElement.removeAttribute('data-overture');
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
      <HeroBackdrop scrollYProgress={scrollYProgress} layers={layers} video={video} />

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

      {/* The blackout the overture opens from. Server-rendered so it is already
          on screen at first paint; styled in `globals.css` and shown only while
          `data-overture` is set on the root element. */}
      <div
        data-overture-cover
        aria-hidden
        className="bg-void pointer-events-none absolute inset-0 z-30"
      />

      <AnimatePresence mode="wait">
        {phase === 'overture' ? <Overture key="overture" onDone={finishOverture} /> : null}
      </AnimatePresence>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative flex h-full items-center"
      >
        <div className="container-page w-full pt-(--header-h)">
          <HeroContent entrance={entrance} active={phase === 'settled'} />
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
  layers,
  video,
}: {
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  layers: HeroLayers;
  video: HeroVideoSource[];
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
        {layers.atmosphere}
      </motion.div>

      <motion.div style={style(farY)} className="absolute inset-x-0 bottom-0 h-[62%] opacity-90">
        {layers.far}
      </motion.div>

      <motion.div style={style(midY)} className="absolute inset-x-0 bottom-0 h-[54%]">
        {layers.mid}
      </motion.div>

      <motion.div style={style(nearY)} className="absolute inset-x-0 bottom-0 h-[44%]">
        {layers.near}
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
        {layers.frame}
      </motion.div>

      <HeroVideo sources={video} />
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
function HeroVideo({ sources }: { sources: HeroVideoSource[] }) {
  const [ready, setReady] = React.useState(false);
  const reduce = useReducedMotion();
  const videoRef = React.useRef<HTMLVideoElement>(null);

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

  // No footage available: render nothing rather than a <video> whose sources
  // 404 on every visit. The vector scene is the intended default, not a
  // fallback for a failed request.
  if (reduce || sources.length === 0) return null;

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
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
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
    const toWordmark = window.setTimeout(() => setBeat(1), 2000);
    const toHero = window.setTimeout(onDone, 4400);

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
      // Fully opaque, not a scrim: the settled hero is now painted underneath
      // from the very first frame, and the intro should read as a proper cut to
      // black rather than a blur over content the visitor has already glimpsed.
      className="bg-void absolute inset-0 z-40 flex items-center justify-center"
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
          'border-hairline-strong bg-void/75 absolute right-6 bottom-8 rounded-sm border px-4 py-2.5',
          'text-mist text-[0.75rem] tracking-[0.16em] uppercase backdrop-blur-md',
          'hover:border-arc-bright hover:text-bright transition-colors duration-300',
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

/**
 * `entrance` decides whether this is animated at all.
 *
 * When the overture is not part of this page view there is nothing to hand over
 * from, so the content renders as ordinary markup with no motion styles — which
 * is what lets the headline appear in the server HTML and be counted as the
 * largest contentful paint immediately. When the overture *is* running, the
 * same tree becomes a staggered entrance, played out of sight behind the plate
 * and revealed as it lifts.
 */
function HeroContent({ entrance, active }: { entrance: boolean; active: boolean }) {
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

  // `initial={false}` tells Framer to render the resting state and skip the
  // entrance outright, leaving the markup free of inline opacity.
  const group = entrance
    ? ({ variants: container, initial: 'hidden', animate: active ? 'visible' : 'hidden' } as const)
    : ({ initial: false } as const);
  const line = entrance ? { variants: item } : { initial: false as const };

  return (
    <motion.div {...group} className="max-w-3xl">
      <motion.p {...line} className="text-eyebrow text-arc-glow flex items-center gap-3 uppercase">
        <span aria-hidden className="bg-arc h-px w-10" />
        Structural steel · Since {siteConfig.founded}
      </motion.p>

      <motion.h1 {...line} className="font-display text-display-xl text-bright mt-7 font-extrabold">
        Reinforce
        <br />
        <span className="text-metal">Your Dream.</span>
      </motion.h1>

      <motion.p {...line} className="text-lead text-mist mt-8 max-w-xl">
        Premium structural steel for commercial, industrial and residential construction — supplied
        with mill-traceable certification, in-house fabrication, and delivery sequenced to your
        erection programme.
      </motion.p>

      <motion.div {...line} className="mt-11 flex flex-wrap items-center gap-4">
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
        {...line}
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
