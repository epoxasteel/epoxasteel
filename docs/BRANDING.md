# Branding

How to swap the placeholder wordmark for the final logo, and how to adjust the
palette and typography without unpicking the design.

---

## The placeholder wordmark

Until the final logo exists, the site uses a typographic wordmark built from
type and one drawn glyph — an I-beam cross-section, drawn to the same stroke
weight as the letterforms.

It lives in **one file**: `src/components/visual/wordmark.tsx`. Every appearance
of the logo across the site — header, mobile drawer, footer, hero overture,
loading screen, email templates — renders one of its three exports. Replace the
internals and the whole site updates.

| Export                | Used by                                       |
| --------------------- | --------------------------------------------- |
| `<Wordmark />`        | Header, footer, mobile drawer, loading screen |
| `<WordmarkStacked />` | The hero overture reveal                      |
| `<BeamMark />`        | The mark on its own — favicons, tight spaces  |

### Sizes

`<Wordmark size="sm" \| "md" \| "lg" \| "xl" />`. `md` is the header default.

### Props worth knowing

- `showMark={false}` — type only, no glyph
- `metal` — fills the type with the brushed-metal gradient (used in the hero
  and the loading screen)

---

## Swapping in the final logo

### If the logo is an SVG (recommended)

1. Export it as an optimised SVG, with `fill="currentColor"` on the paths that
   should inherit colour
2. Replace the body of `Wordmark` in `src/components/visual/wordmark.tsx`:

```tsx
export function Wordmark({ className, size = 'md' }: WordmarkProps) {
  const heights = { sm: 'h-5', md: 'h-6', lg: 'h-8', xl: 'h-14' };

  return (
    <svg
      viewBox="0 0 240 40" // ← your artboard
      role="img"
      aria-label="EPOXA STEEL"
      className={cn(heights[size], 'w-auto', className)}
    >
      {/* your paths */}
    </svg>
  );
}
```

Keep the `aria-label` — the header link relies on it for its accessible name.

Constrain **height**, not width. The header reserves vertical space; a
width-constrained logo will overflow at some breakpoints.

### If the logo is a raster image

Only if there is genuinely no vector. Supply at 3× the largest rendered size,
and use `next/image` with an explicit `height`:

```tsx
import Image from 'next/image';
import logo from '@/assets/logo.png';

<Image src={logo} alt="EPOXA STEEL" height={24} className="w-auto" priority />;
```

Add `priority` — the header logo is above the fold on every page.

---

## Favicons and app icons

Three files, all drawing the same mark:

| File                          | Output                                           |
| ----------------------------- | ------------------------------------------------ |
| `src/app/icon.svg`            | Browser tab icon, and `/icon.svg` for the manifest and the schema.org logo |
| `src/app/apple-icon.tsx`      | 180×180 home-screen icon, rendered at build time |
| `src/app/opengraph-image.tsx` | 1200×630 social card, rendered at build time     |

Next.js picks up `icon.svg` and `apple-icon.tsx` automatically through
file-based metadata — there is no `icons` entry in `layout.tsx` to update.

There used to be a fourth, `public/icon.svg`, and this page told you to keep it
in step with `src/app/icon.svg` by hand. They drifted, as a pair of files kept in
sync by instruction always will: the copy in `public/` shadowed the app one at
`/icon.svg`, so the icon every browser actually fetched was the stale one — with
a white web where the site's mark is solid blue. It is deleted. Edit
`src/app/icon.svg` and there is nothing else to remember.

`apple-icon.tsx` and `opengraph-image.tsx` draw with layout primitives only (no
external fonts or images), so they never fail a build because an asset could not
be fetched. If you replace them with real artwork, keep that property.

### One mark, four surfaces

The header, the favicon, the home-screen icon, the social card and every email
render the same lockup: the beam entirely in `arc-bright`, EPOXA in `bright` at
extrabold, STEEL in `mist` at light. Emails cannot use SVG — Gmail strips it and
Outlook renders through Word — so `src/lib/email/templates.ts` rebuilds the beam
from coloured table cells at the same proportions. If the mark changes, those
five places change together.

---

## Colour

The palette lives in the `@theme` block at the top of `src/app/globals.css`.
Every colour on the site resolves to one of these tokens; there are no ad-hoc
hex values in components.

### Surfaces — darkest to lightest

| Token      | Value     | Used for                                    |
| ---------- | --------- | ------------------------------------------- |
| `void`     | `#060709` | Page background, primary sections           |
| `graphite` | `#0a0c0f` | Alternating sections, footer, form controls |
| `charcoal` | `#101317` | Cards, panels                               |
| `slate`    | `#161a20` | Card hover                                  |
| `iron`     | `#1d222a` | Raised elements                             |
| `anvil`    | `#252b34` | Scrollbar thumb, deepest raise              |

### Lines

| Token             | Value     |
| ----------------- | --------- |
| `hairline`        | `#232a33` |
| `hairline-strong` | `#323a45` |

### Text — dimmest to brightest

| Token    | Value     | Used for                         |
| -------- | --------- | -------------------------------- |
| `steel`  | `#495260` | Captions, metadata, placeholders |
| `ash`    | `#78828f` | Body copy in cards               |
| `mist`   | `#a8b2be` | Default body copy                |
| `chalk`  | `#d7dde5` | Emphasised body, labels          |
| `bright` | `#f2f5f9` | Headings                         |

### Accent

| Token        | Value     | Used for                             |
| ------------ | --------- | ------------------------------------ |
| `arc-deep`   | `#0f3b6b` | Deep glows                           |
| `arc`        | `#1c62ae` | Accent fills, the `arc` button       |
| `arc-bright` | `#3a8ae0` | Focus rings, active states, the mark |
| `arc-glow`   | `#7ab6f5` | Eyebrows, links, icons               |

**One accent, used sparingly.** That restraint is what makes the palette read as
engineered rather than decorated. `success`, `warning` and `danger` exist only
for form state — do not use them as design colours.

### Changing the accent

Edit the four `--color-arc-*` values in `globals.css`. Keep the four-step
relationship (deep → mid → bright → glow) or focus states and eyebrows will lose
their contrast against the dark surfaces.

Check contrast after any change. `arc-glow` on `graphite` currently passes WCAG
AA for body text; a darker accent will not.

---

## Typography

- **Inter** — body, interface, tables, forms
- **Manrope** — display, headings, the wordmark, numerals

Both are variable fonts, vendored into `src/fonts/` as `.woff2` and loaded via
`next/font/local` in `src/lib/fonts.ts`. Licences (SIL OFL) are alongside them.

### Why they are vendored rather than fetched

Builds stay hermetic — no network dependency in CI or on Railway. There is no
third-party connection at runtime, so the CSP stays locked to `font-src 'self'`.
And the latin subsets total under 180 KB.

### Replacing a family

1. Put the `.woff2` (and its licence) in `src/fonts/`
2. Update the `src` path in `src/lib/fonts.ts`
3. Update the family name in the `--font-sans` or `--font-display` token in
   `globals.css`
4. Check `adjustFontFallback` — it size-matches the fallback so CLS stays at
   zero. `'Arial'` suits most grotesques; a very wide or narrow face may need
   `'Times New Roman'` or a manual `fallback` array

### The type scale

Fluid, defined as `clamp()` in `@theme`:

| Token             | Range       | Used for                           |
| ----------------- | ----------- | ---------------------------------- |
| `text-display-xl` | 48 → 136 px | The hero headline only             |
| `text-display-lg` | 40 → 88 px  | Overture, 404, major statements    |
| `text-display`    | 32 → 64 px  | Page `<h1>`                        |
| `text-headline`   | 26 → 44 px  | Section `<h2>`                     |
| `text-title`      | 20 → 26 px  | Card titles, `<h3>`                |
| `text-lead`       | 17 → 21 px  | Intro paragraphs                   |
| `text-eyebrow`    | 11 px       | The uppercase label above headings |

> ⚠️ **If you add a size, register it in `extendTailwindMerge` in
> `src/lib/utils.ts`.** Otherwise `tailwind-merge` parses `text-yourname` as a
> _colour_, decides it conflicts with `text-bright`, and silently drops it — so
> the heading renders at body size with no error anywhere.

---

## Motion

Easing curves are defined twice, deliberately: as CSS custom properties in
`globals.css` (for CSS transitions) and as typed tuples in `src/lib/motion.ts`
(for Framer Motion). They mirror each other, so a hover transition and a scroll
reveal on the same element move with the same character.

| Curve               | Value                 | Character                           |
| ------------------- | --------------------- | ----------------------------------- |
| `EASE_OUT_EXPO`     | `0.16, 1, 0.3, 1`     | The default — fast out, long settle |
| `EASE_OUT_QUINT`    | `0.22, 1, 0.36, 1`    | Hover and interface transitions     |
| `EASE_IN_OUT_QUART` | `0.76, 0, 0.24, 1`    | Symmetrical, for sweeps             |
| `EASE_SPRING`       | `0.34, 1.56, 0.64, 1` | Overshoot — success states only     |

**Change both definitions together**, or CSS and JS animations will drift apart.

---

## Dark only

The site commits to a single dark treatment. `color-scheme: dark` is set on
`:root` and there is no light-mode branch.

That is a design decision, not an omission: the palette, the metal gradients,
the vector city scene and the photographic grain are all built for a dark
surface. A light mode would need a genuinely separate design pass rather than
inverted tokens — half-doing it would weaken the brand.

If you do want one later, start with the surface and text scales; they are
already ordered darkest-to-lightest and would invert cleanly. The accent and the
artwork are the real work.
