import { cn } from '@/lib/utils';

/**
 * Typographic placeholder wordmark.
 *
 * Built from type and one drawn glyph rather than an image, so it stays sharp
 * at every size and inherits color from context. When the final logo arrives,
 * replace the internals of this component — every usage across the site points
 * here, so nothing else needs touching. See docs/BRANDING.md.
 */

/**
 * The mark: an I-beam cross-section, drawn to the same weight as the type.
 *
 * The viewBox is cropped to the beam itself — `4 5 24 22`, the exact bounds of
 * the three bars — rather than the 32×32 square it used to sit inside. That
 * square was five units of empty space above the top flange and five below, so
 * a `size-6` mark rendered a beam only 16.5px tall and the icon read as smaller
 * than the letters beside it at every size. With the padding gone the element's
 * height *is* the beam's height, which is what makes matching it to cap height
 * possible.
 */
export function BeamMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="4 5 24 22"
      fill="none"
      aria-hidden
      className={cn('h-[0.72em] w-auto', className)}
      focusable="false"
    >
      {/* Top flange */}
      <rect x="4" y="5" width="24" height="4.4" fill="currentColor" />
      {/* Web */}
      <rect x="13.8" y="9.4" width="4.4" height="13.2" fill="currentColor" />
      {/* Bottom flange */}
      <rect x="4" y="22.6" width="24" height="4.4" fill="currentColor" />
      {/* Fillets, the detail that makes it read as rolled steel, not a letter H */}
      <path d="M13.8 9.4h-1.6c0 .9.7 1.6 1.6 1.6V9.4Z" fill="currentColor" opacity="0.55" />
      <path d="M18.2 9.4h1.6c0 .9-.7 1.6-1.6 1.6V9.4Z" fill="currentColor" opacity="0.55" />
      <path d="M13.8 22.6h-1.6c0-.9.7-1.6 1.6-1.6v1.6Z" fill="currentColor" opacity="0.55" />
      <path d="M18.2 22.6h1.6c0-.9-.7-1.6-1.6-1.6v1.6Z" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function Wordmark({
  className,
  size = 'md',
  showMark = true,
  metal = false,
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showMark?: boolean;
  /** Fills the type with the brushed-metal gradient. */
  metal?: boolean;
}) {
  /*
    One step larger across the board, and the mark is no longer sized here.

    It carries `h-[0.72em]`, roughly the cap height of the display face, and
    `em` resolves against the font size on the container below, so the beam is
    the height of the letters beside it at every size by construction rather
    than by a table of pixel values that had to be kept in agreement.
  */
  const sizes = {
    sm: { text: 'text-[1.0625rem]', gap: 'gap-2.5' },
    md: { text: 'text-[1.1875rem]', gap: 'gap-3' },
    lg: { text: 'text-[1.75rem]', gap: 'gap-3.5' },
    xl: { text: 'text-display-lg', gap: 'gap-[0.42em]' },
  }[size];

  return (
    <span className={cn('inline-flex items-center', sizes.gap, sizes.text, className)}>
      {showMark ? <BeamMark className="text-arc-bright" /> : null}
      <span
        className={cn(
          'font-display leading-none font-extrabold tracking-[0.16em] whitespace-nowrap uppercase',
          metal ? 'text-metal' : 'text-bright',
        )}
      >
        Epoxa <span className={cn('font-light', metal ? '' : 'text-mist')}>Steel</span>
      </span>
    </span>
  );
}

/** Stacked lockup used in the hero reveal and the footer. */
export function WordmarkStacked({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex flex-col items-center', className)}>
      <span className="font-display text-display-lg text-metal leading-[0.9] font-extrabold tracking-[0.14em] uppercase">
        Epoxa
      </span>
      <span className="mt-2 flex w-full items-center gap-3">
        <span className="to-hairline-strong h-px flex-1 bg-linear-to-r from-transparent" />
        <span className="font-display text-mist text-[clamp(0.75rem,0.55rem+0.9vw,1.15rem)] font-light tracking-[0.52em] uppercase">
          Steel
        </span>
        <span className="to-hairline-strong h-px flex-1 bg-linear-to-l from-transparent" />
      </span>
    </span>
  );
}
