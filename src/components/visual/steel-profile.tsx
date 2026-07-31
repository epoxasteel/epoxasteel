import type { ProfileShape } from '@/content/types';
import { cn } from '@/lib/utils';

/**
 * Technical cross-sections drawn as SVG rather than shipped as photography.
 *
 * They render crisply at any size, weigh almost nothing, inherit color from
 * context and — unlike stock imagery — are actually accurate. Each profile is
 * drawn on a 120×120 grid so they sit consistently in a card.
 */

const STROKE = 'rgba(168,178,190,0.9)';
const ACCENT = 'rgba(58,138,224,0.85)';

function Hatch({ id }: { id: string }) {
  return (
    <pattern
      id={id}
      width="6"
      height="6"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(168,178,190,0.22)" strokeWidth="1" />
    </pattern>
  );
}

function shapeFor(profile: ProfileShape, hatchId: string) {
  const hatch = `url(#${hatchId})`;

  switch (profile) {
    case 'i-beam':
      return (
        <path
          d="M18 22h84v13H68v50h34v13H18V85h34V35H18V22Z"
          fill={hatch}
          stroke={STROKE}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );

    case 'channel':
      return (
        <path
          d="M22 22h80v13H35v50h67v13H22V22Z"
          fill={hatch}
          stroke={STROKE}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );

    case 'angle':
      return (
        <path
          d="M24 20h14v66h58v14H24V20Z"
          fill={hatch}
          stroke={STROKE}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );

    case 'plate':
      return (
        <>
          <rect x="14" y="46" width="92" height="28" fill={hatch} stroke={STROKE} strokeWidth="2" />
          <line x1="14" y1="46" x2="14" y2="74" stroke={ACCENT} strokeWidth="3" />
        </>
      );

    case 'sheet':
      return (
        <>
          <rect
            x="12"
            y="52"
            width="96"
            height="9"
            fill={hatch}
            stroke={STROKE}
            strokeWidth="1.8"
          />
          <rect
            x="12"
            y="65"
            width="96"
            height="9"
            fill={hatch}
            stroke={STROKE}
            strokeWidth="1.8"
            opacity="0.6"
          />
          <rect
            x="12"
            y="39"
            width="96"
            height="9"
            fill={hatch}
            stroke={STROKE}
            strokeWidth="1.8"
            opacity="0.35"
          />
        </>
      );

    case 'square-tube':
      return (
        <>
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            rx="8"
            fill={hatch}
            stroke={STROKE}
            strokeWidth="2"
          />
          <rect
            x="32"
            y="32"
            width="56"
            height="56"
            rx="4"
            fill="var(--color-charcoal)"
            stroke={STROKE}
            strokeWidth="1.6"
          />
        </>
      );

    case 'round-tube':
    case 'pipe':
      return (
        <>
          <circle cx="60" cy="60" r="42" fill={hatch} stroke={STROKE} strokeWidth="2" />
          <circle
            cx="60"
            cy="60"
            r="30"
            fill="var(--color-charcoal)"
            stroke={STROKE}
            strokeWidth="1.6"
          />
          <line
            x1="60"
            y1="18"
            x2="60"
            y2="30"
            stroke={ACCENT}
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        </>
      );

    case 'round-bar':
      return (
        <>
          <circle cx="60" cy="60" r="38" fill={hatch} stroke={STROKE} strokeWidth="2" />
          <line
            x1="22"
            y1="60"
            x2="98"
            y2="60"
            stroke={ACCENT}
            strokeWidth="1.4"
            strokeDasharray="4 4"
          />
        </>
      );

    case 'rebar':
      return (
        <>
          <circle cx="60" cy="60" r="34" fill={hatch} stroke={STROKE} strokeWidth="2" />
          {/* Deformation ribs */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="60"
              y1="26"
              x2="60"
              y2="34"
              stroke={STROKE}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${angle} 60 60)`}
            />
          ))}
        </>
      );

    case 'galvanized':
      return (
        <>
          <rect x="18" y="44" width="84" height="32" fill={hatch} stroke={STROKE} strokeWidth="2" />
          {/* Zinc coating layers */}
          <rect x="18" y="40" width="84" height="4" fill={ACCENT} opacity="0.55" />
          <rect x="18" y="76" width="84" height="4" fill={ACCENT} opacity="0.55" />
          <rect x="18" y="36" width="84" height="4" fill={ACCENT} opacity="0.25" />
          <rect x="18" y="80" width="84" height="4" fill={ACCENT} opacity="0.25" />
        </>
      );

    case 'stainless':
      return (
        <>
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            rx="3"
            fill={hatch}
            stroke={STROKE}
            strokeWidth="2"
          />
          {/* Brushed finish direction */}
          {[30, 40, 50, 60, 70, 80, 90].map((y) => (
            <line
              key={y}
              x1="26"
              y1={y}
              x2="94"
              y2={y}
              stroke="rgba(242,245,249,0.16)"
              strokeWidth="1"
            />
          ))}
        </>
      );

    case 'fabrication':
      return (
        <>
          <path
            d="M16 30h50v10H38v34h28v10H16V30Z"
            fill={hatch}
            stroke={STROKE}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="74"
            y="30"
            width="30"
            height="54"
            rx="2"
            fill={hatch}
            stroke={STROKE}
            strokeWidth="2"
          />
          {/* Bolt holes */}
          <circle
            cx="89"
            cy="44"
            r="4"
            fill="var(--color-charcoal)"
            stroke={ACCENT}
            strokeWidth="1.6"
          />
          <circle
            cx="89"
            cy="70"
            r="4"
            fill="var(--color-charcoal)"
            stroke={ACCENT}
            strokeWidth="1.6"
          />
          {/* Weld symbol */}
          <path
            d="M66 52h8l4 6"
            stroke={ACCENT}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      );

    default:
      return (
        <rect x="24" y="24" width="72" height="72" fill={hatch} stroke={STROKE} strokeWidth="2" />
      );
  }
}

export function SteelProfile({
  profile,
  className,
  showGrid = true,
}: {
  profile: ProfileShape;
  className?: string;
  showGrid?: boolean;
}) {
  // Stable per-profile ids keep SSR and client markup identical.
  const hatchId = `hatch-${profile}`;
  const gridId = `grid-${profile}`;

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden
      focusable="false"
      className={cn('h-auto w-full', className)}
    >
      <defs>
        <Hatch id={hatchId} />
        <pattern id={gridId} width="12" height="12" patternUnits="userSpaceOnUse">
          <path d="M12 0H0v12" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
      </defs>

      {showGrid ? <rect width="120" height="120" fill={`url(#${gridId})`} /> : null}
      <g>{shapeFor(profile, hatchId)}</g>
    </svg>
  );
}

/** Larger presentation used on product detail pages, with dimension callouts. */
export function SteelProfileFigure({
  profile,
  label,
  className,
}: {
  profile: ProfileShape;
  label: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        'border-hairline bg-graphite relative overflow-hidden rounded-md border',
        className,
      )}
    >
      <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(78% 62% at 50% 32%, rgba(28,98,174,0.14) 0%, transparent 70%)',
        }}
        aria-hidden
      />
      <div className="relative p-10 sm:p-14">
        <SteelProfile profile={profile} showGrid={false} className="mx-auto max-w-72" />
      </div>
      <figcaption className="border-hairline relative flex items-center justify-between border-t px-5 py-3">
        <span className="text-steel text-[0.6875rem] tracking-[0.18em] uppercase">
          Cross-section
        </span>
        <span className="text-mist text-[0.8125rem]">{label}</span>
      </figcaption>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="border-hairline-strong absolute top-4 left-4 size-3 border-t border-l" />
        <span className="border-hairline-strong absolute top-4 right-4 size-3 border-t border-r" />
        <span className="border-hairline-strong absolute bottom-14 left-4 size-3 border-b border-l" />
        <span className="border-hairline-strong absolute right-4 bottom-14 size-3 border-r border-b" />
      </div>
    </figure>
  );
}
