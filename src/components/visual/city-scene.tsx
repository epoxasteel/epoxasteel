import { cn } from '@/lib/utils';

/**
 * A procedurally drawn city skyline used as the hero backdrop.
 *
 * This exists so the site ships with a genuine cinematic opening before any
 * footage is available: it is vector, weighs a few kilobytes, scales to any
 * viewport, needs no CDN, and never blocks Largest Contentful Paint. When real
 * video is dropped into `public/media/hero.mp4` the hero fades it in over this
 * scene — see components/home/hero.tsx.
 *
 * Everything is generated from a seeded PRNG so server and client render
 * byte-identical markup and hydration never mismatches.
 */

/** mulberry32 — small, fast, and identical on both sides of hydration. */
function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Tower = {
  x: number;
  width: number;
  height: number;
  /** Window grid density; 0 means an unlit silhouette. */
  litRatio: number;
  crown: 'flat' | 'stepped' | 'spire' | 'pitched';
};

function generateTowers(
  seed: number,
  count: number,
  options: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    litRatio: number;
  },
): Tower[] {
  const random = makeRandom(seed);
  const towers: Tower[] = [];
  let cursor = -40;

  for (let i = 0; i < count; i += 1) {
    const width = options.minWidth + random() * (options.maxWidth - options.minWidth);
    const height = options.minHeight + random() * (options.maxHeight - options.minHeight);
    const crowns = ['flat', 'flat', 'stepped', 'spire', 'pitched'] as const;
    const crown = crowns[Math.floor(random() * crowns.length)];

    towers.push({
      x: cursor,
      width,
      height,
      litRatio: options.litRatio * (0.55 + random() * 0.7),
      crown,
    });

    // Slight overlap keeps the skyline reading as a mass rather than a fence.
    cursor += width - random() * (width * 0.22);
  }

  return towers;
}

function TowerShape({ tower, baseline }: { tower: Tower; baseline: number }) {
  const { x, width, height, crown } = tower;
  const top = baseline - height;

  switch (crown) {
    case 'stepped': {
      const inset = width * 0.18;
      const step = height * 0.12;
      return (
        <path
          d={`M${x} ${baseline} V${top + step} H${x + inset} V${top} H${x + width - inset} V${top + step} H${x + width} V${baseline} Z`}
        />
      );
    }
    case 'spire': {
      const mid = x + width / 2;
      return (
        <path
          d={`M${x} ${baseline} V${top + height * 0.08} L${mid - width * 0.16} ${top} H${mid + width * 0.16} L${x + width} ${top + height * 0.08} V${baseline} Z M${mid - 0.9} ${top} V${top - height * 0.14} H${mid + 0.9} V${top} Z`}
        />
      );
    }
    case 'pitched': {
      const mid = x + width / 2;
      return (
        <path
          d={`M${x} ${baseline} V${top + height * 0.1} L${mid} ${top} L${x + width} ${top + height * 0.1} V${baseline} Z`}
        />
      );
    }
    default:
      return <rect x={x} y={top} width={width} height={height} />;
  }
}

function Windows({ tower, baseline, seed }: { tower: Tower; baseline: number; seed: number }) {
  if (tower.litRatio <= 0) return null;

  const random = makeRandom(seed);
  const cellW = 5;
  const cellH = 8;
  const padding = tower.width * 0.16;
  const usable = tower.width - padding * 2;
  const columns = Math.max(0, Math.floor(usable / cellW));
  const rows = Math.max(0, Math.floor((tower.height * 0.86) / cellH));

  if (columns === 0 || rows === 0) return null;

  /*
   * Windows are accumulated into two path strings — one cool, one warm —
   * rather than one <rect> per window.
   *
   * A lit tower can carry forty or more windows, and across three skyline
   * layers that ran to well over a thousand DOM nodes that exist purely to be
   * small bright squares. Two <path> elements per tower render identically and
   * cost the browser almost nothing to parse, style and lay out.
   */
  let cool = '';
  let warm = '';

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      if (random() > tower.litRatio) continue;

      const x = (tower.x + padding + column * cellW).toFixed(1);
      const y = (baseline - tower.height + tower.height * 0.12 + row * cellH).toFixed(1);
      const rect = `M${x} ${y}h2.4v3.4h-2.4z`;

      // A handful of windows glow warmer, which stops the grid looking printed.
      if (random() > 0.86) warm += rect;
      else cool += rect;
    }
  }

  if (!cool && !warm) return null;

  return (
    <g>
      {cool ? <path d={cool} fill="rgba(174,204,240,0.6)" /> : null}
      {warm ? <path d={warm} fill="rgba(255,214,164,0.85)" /> : null}
    </g>
  );
}

/** A tower crane — the detail that makes a skyline read as "under construction". */
function Crane({
  x,
  y,
  scale = 1,
  flip = false,
  className,
}: {
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  className?: string;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
      className={className}
      stroke="currentColor"
      strokeWidth={1.4}
      fill="none"
      strokeLinecap="round"
    >
      {/* Mast */}
      <path d="M0 0 V-96" />
      <path d="M-4 0 V-96 M4 0 V-96" strokeWidth={0.9} opacity={0.8} />
      {/* Mast lattice */}
      {Array.from({ length: 11 }).map((_, i) => (
        <path key={i} d={`M-4 ${-8 * i} L4 ${-8 * (i + 1)}`} strokeWidth={0.6} opacity={0.6} />
      ))}
      {/* Jib */}
      <path d="M-22 -96 H66" />
      <path d="M-22 -101 H66" strokeWidth={0.8} opacity={0.75} />
      {Array.from({ length: 11 }).map((_, i) => (
        <path
          key={i}
          d={`M${-22 + i * 8} -96 L${-14 + i * 8} -101`}
          strokeWidth={0.55}
          opacity={0.55}
        />
      ))}
      {/* Counter-jib tie and cab */}
      <path d="M-20 -101 L0 -114 L48 -101" strokeWidth={0.9} opacity={0.85} />
      <rect x="-9" y="-96" width="9" height="7" strokeWidth={0.9} />
      {/* Hoist line and hook block */}
      <path d="M40 -96 V-58" strokeWidth={0.7} opacity={0.9} />
      <rect x="37" y="-58" width="6" height="4" strokeWidth={0.8} />
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/* Layers                                                                     */
/* -------------------------------------------------------------------------- */

const BASELINE = 300;

export function SkylineFar({ className }: { className?: string }) {
  const towers = generateTowers(20260729, 26, {
    minWidth: 22,
    maxWidth: 54,
    minHeight: 60,
    maxHeight: 190,
    litRatio: 0.18,
  });

  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      focusable="false"
      className={cn('h-full w-full', className)}
    >
      <g fill="#151b24">
        {towers.map((tower, index) => (
          <TowerShape key={index} tower={tower} baseline={BASELINE} />
        ))}
      </g>
      <g>
        {towers.map((tower, index) => (
          <Windows key={index} tower={tower} baseline={BASELINE} seed={index * 977 + 13} />
        ))}
      </g>
    </svg>
  );
}

export function SkylineMid({ className }: { className?: string }) {
  const towers = generateTowers(19771103, 16, {
    minWidth: 40,
    maxWidth: 92,
    minHeight: 110,
    maxHeight: 250,
    litRatio: 0.3,
  });

  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      focusable="false"
      className={cn('h-full w-full', className)}
    >
      <g fill="#1c2531">
        {towers.map((tower, index) => (
          <TowerShape key={index} tower={tower} baseline={BASELINE} />
        ))}
      </g>
      <g>
        {towers.map((tower, index) => (
          <Windows key={index} tower={tower} baseline={BASELINE} seed={index * 613 + 401} />
        ))}
      </g>
      <g className="text-steel">
        <Crane x={210} y={BASELINE - 132} scale={0.72} />
        <Crane x={905} y={BASELINE - 168} scale={0.62} flip />
      </g>
    </svg>
  );
}

export function SkylineNear({ className }: { className?: string }) {
  const towers = generateTowers(20090615, 9, {
    minWidth: 96,
    maxWidth: 170,
    minHeight: 150,
    maxHeight: 285,
    litRatio: 0.22,
  });

  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      focusable="false"
      className={cn('h-full w-full', className)}
    >
      <g fill="#243040">
        {towers.map((tower, index) => (
          <TowerShape key={index} tower={tower} baseline={BASELINE} />
        ))}
      </g>
      <g>
        {towers.map((tower, index) => (
          <Windows key={index} tower={tower} baseline={BASELINE} seed={index * 331 + 89} />
        ))}
      </g>
      <g className="text-ash">
        <Crane x={520} y={BASELINE - 214} scale={0.95} />
      </g>
    </svg>
  );
}

/**
 * Foreground structural frame — an in-progress steel skeleton, silhouetted
 * almost to black. It gives the hero its depth and its subject in one shape.
 */
export function SteelFrameForeground({ className }: { className?: string }) {
  const columns = [40, 250, 460, 670, 880, 1090];
  const floors = [300, 236, 172, 108, 44];

  return (
    <svg
      viewBox="0 0 1200 340"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden
      focusable="false"
      className={cn('h-full w-full', className)}
    >
      <g stroke="#0b0e13" fill="#0b0e13">
        {/* Columns, drawn as I-sections seen edge-on */}
        {columns.map((x) => (
          <g key={x}>
            <rect x={x - 9} y={20} width={18} height={320} />
            <rect x={x - 17} y={20} width={34} height={5} opacity={0.9} />
          </g>
        ))}

        {/* Floor beams */}
        {floors.map((y) => (
          <rect key={y} x={0} y={y} width={1200} height={11} />
        ))}

        {/* Cross bracing in alternating bays */}
        {columns.slice(0, -1).map((x, index) => {
          if (index % 2 === 1) return null;
          const next = columns[index + 1];
          return (
            <g key={x} strokeWidth={7} strokeLinecap="round">
              <line x1={x} y1={236} x2={next} y2={172} />
              <line x1={next} y1={236} x2={x} y2={172} />
            </g>
          );
        })}

        {/* Decking on the top completed floor */}
        <rect x={0} y={100} width={1200} height={5} opacity={0.85} />
      </g>

      {/* A single warm edge light catching the top flange — the one point of
          warmth in the whole composition. */}
      <g opacity={0.5}>
        {floors.map((y) => (
          <rect key={y} x={0} y={y} width={1200} height={1} fill="rgba(255,205,150,0.5)" />
        ))}
      </g>
    </svg>
  );
}

/** Atmospheric wash: dawn glow, haze bands and the deep blue of altitude. */
export function Atmosphere({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0', className)} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #06080d 0%, #0a111c 24%, #122034 46%, #1a2c44 64%, #101a28 84%, #080b11 100%)',
        }}
      />
      {/* Low sun behind the skyline */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(62% 46% at 62% 74%, rgba(66,138,214,0.42) 0%, rgba(30,74,126,0.22) 40%, transparent 74%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 28% at 66% 78%, rgba(216,180,132,0.28) 0%, transparent 70%)',
        }}
      />
      {/* Haze sitting in the street canyons */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5"
        style={{
          background:
            'linear-gradient(to top, rgba(14,24,38,0.7) 0%, rgba(16,28,44,0.22) 52%, transparent 100%)',
        }}
      />
    </div>
  );
}
