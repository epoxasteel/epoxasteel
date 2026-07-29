import {
  Building2,
  Home,
  Factory,
  Warehouse,
  TrainFront,
  Zap,
  ConstructionIcon,
  Tractor,
  Landmark,
  Route,
  Cog,
  Waypoints,
  PackageCheck,
  Hammer,
  Scissors,
  Settings2,
  Ruler,
  ClipboardList,
  Truck,
  MapPinned,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';
import type { IndustryIcon, ServiceIcon } from '@/content/types';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Icon maps                                                                  */
/* -------------------------------------------------------------------------- */

const industryIcons: Record<IndustryIcon, LucideIcon> = {
  building: Building2,
  home: Home,
  bridge: Waypoints,
  factory: Factory,
  warehouse: Warehouse,
  road: Route,
  energy: Zap,
  crane: ConstructionIcon,
  tractor: Tractor,
  landmark: Landmark,
  train: TrainFront,
  gear: Cog,
};

const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  supply: PackageCheck,
  fabrication: Hammer,
  cutting: Scissors,
  custom: Settings2,
  engineering: Ruler,
  consultation: ClipboardList,
  logistics: MapPinned,
  delivery: Truck,
  support: LifeBuoy,
};

/**
 * A consistent frame for every icon on the site: a hairline square with a
 * corner accent, so icons read as engineered marks rather than decoration.
 */
export function IconFrame({
  icon: Icon,
  className,
  size = 'md',
}: {
  icon: LucideIcon;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims = {
    sm: { box: 'size-10', icon: 'size-4' },
    md: { box: 'size-12', icon: 'size-5' },
    lg: { box: 'size-16', icon: 'size-6' },
  }[size];

  return (
    <span
      className={cn(
        'border-hairline relative grid shrink-0 place-items-center rounded-sm border',
        'text-arc-glow bg-linear-to-b from-white/[0.05] to-transparent',
        'group-hover/card:border-arc/40 group-hover/card:text-arc-bright transition-colors duration-500',
        dims.box,
        className,
      )}
    >
      <Icon aria-hidden className={dims.icon} strokeWidth={1.5} />
      <span
        aria-hidden
        className="bg-arc-bright/60 absolute top-1 right-1 size-1 transition-opacity duration-500 group-hover/card:opacity-100"
      />
    </span>
  );
}

export function IndustryGlyph({
  name,
  className,
  size,
}: {
  name: IndustryIcon;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return <IconFrame icon={industryIcons[name]} className={className} size={size} />;
}

export function ServiceGlyph({
  name,
  className,
  size,
}: {
  name: ServiceIcon;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  return <IconFrame icon={serviceIcons[name]} className={className} size={size} />;
}

/* -------------------------------------------------------------------------- */
/* Generative project artwork                                                 */
/* -------------------------------------------------------------------------- */

function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Abstract architectural artwork generated from a seed.
 *
 * These stand in for project photography that does not exist yet. They are
 * deliberately abstract — structural masses, bracing lines and a horizon rather
 * than a fake photograph — so nothing on the site pretends to be a real
 * building. Replace with <Image> once photography is available; the aspect
 * ratios here match what the layouts expect. See docs/CONTENT.md.
 */
export function ProjectArt({
  seed,
  className,
  variant = 'tower',
}: {
  seed: number;
  className?: string;
  variant?: 'tower' | 'span' | 'shed' | 'plant';
}) {
  const random = makeRandom(seed * 7919 + 104729);

  const masses = Array.from({ length: variant === 'span' ? 4 : 7 }, (_, index) => {
    const width = 40 + random() * 130;
    return {
      x: index * (860 / (variant === 'span' ? 4 : 7)) - 20 + random() * 30,
      width,
      height: 90 + random() * (variant === 'shed' ? 90 : 300),
      tone: 0.06 + random() * 0.12,
    };
  });

  const gradientId = `art-sky-${seed}`;
  const gridId = `art-grid-${seed}`;

  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
      className={cn('h-full w-full', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f16" />
          <stop offset="46%" stopColor="#0d1622" />
          <stop offset="78%" stopColor="#101a28" />
          <stop offset="100%" stopColor="#080b10" />
        </linearGradient>
        <pattern id={gridId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0v40" fill="none" stroke="rgba(255,255,255,0.028)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="800" height="500" fill={`url(#${gradientId})`} />
      <rect width="800" height="500" fill={`url(#${gridId})`} />

      {/* Ambient light source, positioned by the seed */}
      <ellipse
        cx={180 + random() * 440}
        cy={330 + random() * 90}
        rx={280}
        ry={150}
        fill="rgba(40,102,170,0.16)"
      />

      {/* Structural masses */}
      <g>
        {masses.map((mass, index) => (
          <rect
            key={index}
            x={mass.x}
            y={430 - mass.height}
            width={mass.width}
            height={mass.height}
            fill={`rgba(190,206,224,${mass.tone})`}
            stroke="rgba(190,206,224,0.1)"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Subject-specific structure */}
      {variant === 'span' ? (
        <g stroke="rgba(200,214,230,0.3)" strokeWidth="2.5" fill="none">
          <path d="M-20 356 H820" />
          <path d="M-20 372 H820" strokeWidth="6" stroke="rgba(200,214,230,0.16)" />
          {Array.from({ length: 9 }).map((_, index) => {
            const x = index * 100;
            return (
              <path key={index} d={`M${x} 356 L${x + 50} 300 L${x + 100} 356`} strokeWidth="1.6" />
            );
          })}
          {[100, 300, 500, 700].map((x) => (
            <path key={x} d={`M${x} 372 V470`} strokeWidth="7" stroke="rgba(200,214,230,0.14)" />
          ))}
        </g>
      ) : null}

      {variant === 'shed' ? (
        <g stroke="rgba(200,214,230,0.26)" strokeWidth="2" fill="none">
          {Array.from({ length: 7 }).map((_, index) => {
            const x = 40 + index * 120;
            return (
              <g key={index}>
                <path d={`M${x} 430 V300`} />
                <path d={`M${x + 90} 430 V300`} />
                <path d={`M${x} 300 L${x + 45} 262 L${x + 90} 300`} />
              </g>
            );
          })}
          <path d="M-20 430 H820" strokeWidth="3" />
        </g>
      ) : null}

      {variant === 'plant' ? (
        <g stroke="rgba(200,214,230,0.26)" strokeWidth="2" fill="none">
          {[120, 300, 480, 660].map((x) => (
            <g key={x}>
              <path d={`M${x} 430 V250`} strokeWidth="4" />
              <path d={`M${x - 26} 430 V300 M${x + 26} 430 V300`} strokeWidth="1.4" />
            </g>
          ))}
          <path d="M60 300 H740" strokeWidth="5" stroke="rgba(200,214,230,0.18)" />
          <path d="M60 268 H740" strokeWidth="3" stroke="rgba(200,214,230,0.12)" />
          <circle cx="600" cy="200" r="46" strokeWidth="2.5" />
        </g>
      ) : null}

      {variant === 'tower' ? (
        <g stroke="rgba(200,214,230,0.26)" fill="none" strokeWidth="2">
          {(() => {
            const left = 250 + random() * 60;
            const width = 200 + random() * 90;
            const top = 60 + random() * 60;
            const floors = 9;
            const gap = (430 - top) / floors;
            return (
              <>
                <rect x={left} y={top} width={width} height={430 - top} strokeWidth="2.5" />
                {Array.from({ length: floors }).map((_, index) => (
                  <path
                    key={index}
                    d={`M${left} ${top + gap * (index + 1)} H${left + width}`}
                    strokeWidth="1.2"
                  />
                ))}
                <path d={`M${left + width / 2} ${top} V430`} strokeWidth="1.2" />
                {Array.from({ length: floors }).map((_, index) =>
                  index % 2 === 0 ? (
                    <g key={`brace-${index}`} strokeWidth="1.1" opacity="0.7">
                      <path
                        d={`M${left} ${top + gap * index} L${left + width / 2} ${top + gap * (index + 1)}`}
                      />
                      <path
                        d={`M${left + width} ${top + gap * index} L${left + width / 2} ${top + gap * (index + 1)}`}
                      />
                    </g>
                  ) : null,
                )}
              </>
            );
          })()}
        </g>
      ) : null}

      {/* Ground plane and haze */}
      <rect y="430" width="800" height="70" fill="rgba(6,8,11,0.9)" />
      <rect y="300" width="800" height="130" fill="url(#none)" />
      <rect y="330" width="800" height="100" fill="rgba(12,20,32,0.35)" />
    </svg>
  );
}

/** Picks a drawing style that suits the project's sector. */
export function artVariantFor(industry: string): 'tower' | 'span' | 'shed' | 'plant' {
  switch (industry) {
    case 'bridges':
    case 'transportation':
      return 'span';
    case 'warehousing':
    case 'agriculture':
      return 'shed';
    case 'energy':
    case 'industrial':
    case 'manufacturing':
      return 'plant';
    default:
      return 'tower';
  }
}
