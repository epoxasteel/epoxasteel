'use client';

import * as React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/motion/magnetic';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * The hero.
 *
 * Two things are happening here. The **backdrop** is a parallaxed vector city
 * that ships with the site, with optional video fading in over it once the
 * browser confirms it can play — so the opening is cinematic on the very first
 * deploy and gets better when footage arrives, without a code change.
 *
 * The **opening** is a plate of the page background laid over the top of it and
 * faded away in CSS on the first view of a session. There is no intro to sit
 * through and nothing to skip: the hero is fully rendered underneath from the
 * first frame, and the plate simply lifts off it.
 */

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
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '32%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);

  return (
    <section
      ref={containerRef}
      aria-label="EPOXA STEEL, Reinforce Your Dream"
      /*
       * `min-h-dvh`, not `h-dvh`. A fixed viewport height clipped the proof bar
       * on a 667px phone — the hero simply cut two of the four figures off,
       * silently, because it also carries `overflow-hidden` for the parallax.
       * A minimum lets the section grow on the rare screen too short to hold it
       * and behave identically everywhere else.
       */
      className="bg-void relative min-h-dvh w-full overflow-hidden"
    >
      <HeroBackdrop scrollYProgress={scrollYProgress} layers={layers} video={video} />

      {/* Legibility scrim, a single gradient rather than a flat overlay, so
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

      {/*
        The opening.

        A plate of the page's own background, laid over the hero and animated
        away in CSS, see `globals.css`. The site used to open on a scripted
        intro instead: "Reinforce Your Dream." resolving into the wordmark over
        two beats, with a Skip button. It was a title card in front of the door,
        and the visitor had to wait through it or dismiss it before the site
        would show them anything.

        This does the same work in one gesture and asks nothing: the footage
        lifts out of black over a second and a bit, and the page is already
        there underneath. It is CSS rather than JavaScript so it runs before
        hydration, cannot get stuck part-way if a script fails, and costs
        nothing on the main thread. The inline bootstrap in the head decides
        whether it is due at all, once per session, never under reduced motion.
      */}
      <div
        data-overture-cover
        aria-hidden
        className="bg-void pointer-events-none absolute inset-0 z-30"
      />

      {/*
        Anchored from the top, not centred.

        Centring the content, whether with `items-center` or auto margins ,
        makes its position a function of its own height. When the web font
        replaces the fallback and the lead paragraph relands on a different
        number of lines, the block re-centres and everything in the hero moves:
        0.187 of cumulative layout shift, measured, on the most important screen
        of the site.

        A fluid top offset puts it in the same place to the eye and makes the
        position independent of the content. Growth pushes downward into space
        that already exists rather than dragging the headline upward. The
        `min-h-dvh` floor still lets the section open up on a screen too short to
        hold it, which is what stopped the proof bar being clipped.
      */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative flex min-h-dvh w-full items-start"
      >
        <div className="container-page w-full pt-[calc(var(--header-h)+5vh)] pb-12 sm:pt-[calc(var(--header-h)+6vh)] sm:pb-8">
          <HeroContent />
        </div>
      </motion.div>
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
      {/*
        Grade the footage into the palette so any source material matches.

        Weighted towards the top of the frame rather than even across it. The
        band above the headline is where a generator watermark tends to sit, and
        it is also the emptiest part of the composition, darkening it costs the
        least and hides the most. The middle stays the lightest point so the
        footage still reads as footage behind the copy, and the foot of the
        gradient carries on into the statistics strip.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(6,10,18,0.82) 0%, rgba(7,11,20,0.66) 22%, rgba(8,14,24,0.54) 48%, rgba(6,7,9,0.8) 100%)',
        }}
      />
      {/* A second wash from the left, under the headline and the buttons. Text
          contrast should never depend on which frame happens to be on screen. */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(6,7,9,0.72) 0%, rgba(6,7,9,0.4) 42%, rgba(6,7,9,0.12) 72%, rgba(6,7,9,0) 100%)',
        }}
      />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hero content                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The hero content: eyebrow, headline, lead, actions.
 *
 * Plain, fully-visible markup with no entrance animation. It used to be a
 * Framer variant tree staggered in behind the intro plate, which meant the
 * headline — the page's largest contentful paint — waited on hydration before
 * it was allowed to appear. With the intro gone there is nothing to hand over
 * from, so it ships painted.
 */
function HeroContent() {
  return (
    <div className="max-w-3xl">
      {/*
        The tagline leads, quietly, and the promise carries the size.

        "Reinforce Your Dream." was set at display-xl and was the first and
        largest thing on the page. It is the brand line, not the proposition ,
        a contractor deciding whether to send us a drawing is looking for what
        they get, and that is the three words below it.

        The tagline stays above rather than being cut: it is on the social card,
        in the overture and in the email header, and dropping it here alone
        would be the one place the brand does not say its own line.
      */}
      <p className="text-eyebrow text-arc-glow flex items-center gap-3 uppercase">
        <span aria-hidden className="bg-arc h-px w-10" />
        Reinforce Your Dream
      </p>

      {/* A step down from `text-display-xl`, which topped out at 8.5rem and had
          "Service." running most of the way across a laptop. The clamp keeps the
          same fluid behaviour; `leading` and `tracking` are carried over by hand
          because an arbitrary size does not inherit the token's pair. */}
      <h1 className="font-display text-bright mt-5 text-[clamp(2.75rem,1.25rem+6.1vw,7rem)] leading-[0.94] font-extrabold tracking-[-0.04em] sm:mt-7">
        {/* The trailing spaces are load-bearing. Without them `textContent`
            reads "Trust,Quality,Service.", which is what a crawler indexes and
            what a copy-paste produces, even though it renders correctly. */}
        Trust, <br />
        Quality, <br />
        <span className="text-metal">Service.</span>
      </h1>

      <p className="text-lead text-mist mt-6 max-w-xl sm:mt-8">
        Premium reinforcing steel for commercial, industrial and residential construction, supplied
        with mill-traceable certification, cut and bent to schedule, and delivered sequenced to your
        pour programme.
      </p>

      {/* Full width on a phone. Side by side they are within three pixels of
          each other's width, which reads as a mistake rather than a rhythm ,
          and edge-to-edge targets are easier to hit anyway. */}
      <div className="mt-8 flex flex-col items-stretch gap-3 sm:mt-11 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <Magnetic className="max-sm:w-full">
          <Button href="/quote" size="lg" sheen className="max-sm:w-full">
            Request a Quote
            <ArrowRight aria-hidden />
          </Button>
        </Magnetic>

        <Button href="/contact" size="lg" variant="outline" className="max-sm:w-full">
          Contact
        </Button>
      </div>

      {/*
        No proof bar.

        Four figures sat here, tonnes supplied, projects delivered, on-time
        percentage, countries served, and not one of them could be stood
        behind. A supplier's homepage is the wrong place to publish a number
        nobody can produce a record for, and a claim a client cannot verify is
        worth less than no claim at all. When there are audited figures they
        belong here; until then the page says what it can prove.
      */}
    </div>
  );
}

/*
 * There is no scroll cue.
 *
 * There was: a centred "Scroll" label with a mouse graphic and a dot looping
 * forever. It sat at 50% of the hero, which is inside the proof bar's own
 * width, so on 1280x800 and 1440x900 — the two commonest laptops — the two
 * overlapped. Moving it right would have put it under the floating contact
 * button instead.
 *
 * Rather than find somewhere for it to hide, it is gone. The proof bar resting
 * on the fold already says there is more below, and removing it also retires an
 * animation that ran on every frame for as long as the hero was on screen.
 */
