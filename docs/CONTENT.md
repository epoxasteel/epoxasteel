# Editing content

Almost everything on this site is data, not markup. This guide covers each
content type, what happens automatically when you add one, and how to replace
the generated artwork with real photography.

---

## The golden rule

Content lives in `src/content/` and company facts live in `src/lib/site.ts`.
You should rarely need to open a file in `src/app/` or `src/components/` to
change what the site says.

Everything is typed. If you miss a required field, TypeScript tells you before
the site builds — run `npm run typecheck` to check.

---

## Company details — `src/lib/site.ts`

**Edit this first.** It drives the header, footer, contact page, email
templates and schema.org payloads.

```ts
export const siteConfig = {
  contact: {
    email: 'info@epoxasteel.com',
    phone: '(212) 763-8921',
    phoneHref: '+12127638921',        // ← derived, never edited by hand
    hours: [ … ],                     // ← also generates the schema.org hours
  },
  address: {
    line1: '199 Lee Ave.',
    line2: 'Suite 810',
    city: 'Brooklyn',
    region: 'NY',
    postalCode: '11211',
    latitude: null,                   // ← unset; omitted from LocalBusiness
    longitude: null,
  },
  social: { linkedin: '', x: '', instagram: '', facebook: '', youtube: '' },
  stats: [ … ],                       // ← the animated homepage counters
};
```

> Every value above has a `NEXT_PUBLIC_*` variable behind it — see
> `.env.example`. Change one in the host and redeploy; nothing here needs
> editing.

> Social accounts are all empty on purpose. No icon renders anywhere and
> `sameAs` is left out of the schema until the business has real profiles. Set
> one variable and its icon returns on the next deploy.

> Map coordinates are unset. They are omitted from the LocalBusiness schema
> rather than guessed, because a latitude that is merely close puts the pin on
> the wrong building and structured data is believed. Set both to publish them.

### Navigation

`mainNav` in the same file drives the header and its mega-menus. Adding a
`columns` array turns a top-level item into a mega-menu; adding `featured`
gives it the highlighted panel.

`footerNav` and `legalNav` drive the footer.

---

## Products — `src/content/products.ts`

Adding an entry to the `products` array automatically creates:

- `/products/<slug>` with full specifications
- A card on `/products`, grouped under its category
- Entries in the search index and `sitemap.xml`
- Cross-links from every industry and service that references its slug

```ts
{
  slug: 'steel-beams',              // URL segment; also the cross-reference key
  name: 'Steel Beams',
  category: 'Structural',           // must be one of ProductCategory
  tagline: 'One line, used on cards and in the mega-menu.',
  summary: 'One or two sentences — also used as the meta description.',
  overview: ['Paragraph one.', 'Paragraph two.'],
  keyFacts: [{ label: 'Depth range', value: '100 mm – 1,100 mm' }],
  grades: ['ASTM A992'],
  standards: ['ASTM A6/A6M'],
  finishes: ['Mill finish'],
  applications: ['Primary floor framing'],
  industries: ['commercial', 'bridges'],   // industry slugs
  dimensions: {
    title: 'Wide-flange beam sizes',
    caption: 'Optional note below the table.',
    columns: ['Designation', 'Depth', 'Weight'],
    rows: [['W8×31', '203 mm', '46 kg/m']],
  },
  downloads: [{ label: '…', description: '…', size: '1.8 MB', format: 'PDF', href: '/downloads/x.pdf' }],
  related: ['structural-steel'],      // other product slugs
  profile: 'i-beam',                  // drives the drawn cross-section
  featured: true,                     // shows on the homepage
}
```

### `profile` values

`i-beam`, `channel`, `angle`, `plate`, `sheet`, `round-tube`, `square-tube`,
`pipe`, `round-bar`, `rebar`, `galvanized`, `stainless`, `fabrication`.

To add a new one, extend `ProfileShape` in `src/content/types.ts` and add the
drawing to `shapeFor()` in `src/components/visual/steel-profile.tsx`.

### Adding a new category

Add it to `ProductCategory` in `types.ts` and to `productCategories` in
`products.ts`, then add a blurb to `categoryBlurb` in
`src/app/products/page.tsx`.

---

## Industries — `src/content/industries.ts`

Creates `/industries/<slug>`, a card on `/industries`, and cross-links from
every product and project that references it.

`icon` accepts: `building`, `home`, `bridge`, `factory`, `warehouse`, `road`,
`energy`, `crane`, `tractor`, `landmark`, `train`, `gear`. Extend
`IndustryIcon` in `types.ts` and the map in
`src/components/visual/graphics.tsx` to add more.

---

## Services — `src/content/services.ts`

Creates `/services/<slug>` with the numbered process timeline, capabilities and
deliverables.

`icon` accepts: `supply`, `fabrication`, `cutting`, `custom`, `engineering`,
`consultation`, `logistics`, `delivery`, `support`.

---

## Projects — `src/content/projects.ts`

> **The shipped case studies are illustrative examples.** They demonstrate the
> layout and the level of detail expected. Replace every one before launch, and
> obtain written permission before naming a client, quoting a figure, or
> publishing a photograph of their building.

Each project needs a `challenge`, a `solution` and an `outcome` — the three
panels on the detail page. `metrics` feed the animated counters, and `gallery`
seeds the generated artwork.

`industry` must match an industry slug; it selects the artwork style and links
the project into that industry's page.

---

## Blog — `src/content/posts.ts`

Adding a post creates `/blog/<slug>`, a card on `/blog` and on its category
page, a search entry and a sitemap entry. Reading time and the table of contents
are derived from the body.

### Markdown subset

Deliberately small — the parser is 150 lines and no third-party markdown library
ships to the browser.

| Syntax                    | Renders as                                                |
| ------------------------- | --------------------------------------------------------- |
| `## Heading`              | `<h2>` with an anchor, appears in the table of contents   |
| `### Heading`             | `<h3>`                                                    |
| Blank-line-separated text | `<p>`                                                     |
| `- item`                  | Bulleted list with the diamond marker                     |
| `1. item`                 | Numbered list                                             |
| `> quote`                 | Pull quote with the accent rule                           |
| `**bold**`                | `<strong>`                                                |
| `[label](/path)`          | Link — site-relative, `https:`, `mailto:` and `tel:` only |
| `---`                     | Horizontal rule                                           |

Anything else renders as literal text. Unsafe link targets (`javascript:`,
`data:`, protocol-relative) render as plain text rather than becoming links.

### Categories

`Engineering`, `Market Insight`, `Sustainability`, `Company News`,
`Project Story`. To add one, extend `PostCategory` in `types.ts`, add it to
`postCategories`, and add a description to `descriptions` in
`src/app/blog/category/[category]/page.tsx`.

---

## FAQ — `src/content/faqs.ts`

Rendered as accordions grouped by category, and emitted as `FAQPage` structured
data so answers can appear directly in search results. Keep answers specific —
generic answers do not get featured.

---

## Careers — `src/content/careers.ts`

Creates `/careers/<slug>` with `JobPosting` structured data, so roles are
eligible for Google Jobs. Applications go to
`siteConfig.contact.careersEmail` via a prefilled `mailto:` link.

---

## Company story — `src/content/company.ts`

Drives `/about`: mission, vision, values, history timeline, leadership,
certifications, quality commitments, safety, innovation and future goals.

> **Leadership names and biographies are placeholders.** Replace them, and use
> real initials — the avatar is generated from them.

---

## Testimonials — `src/content/testimonials.ts`

> **Illustrative examples.** Do not publish as-is. Replace with real,
> attributable quotes and get written permission before naming a person or a
> company.

---

## Replacing the generated artwork with photography

The site ships with drawn artwork rather than stock photography — vector, a few
kilobytes, sharp at any size, and honest about not being a real photograph.
Replace it as real imagery becomes available.

### 1. Project imagery

`src/components/cards.tsx` and `src/app/projects/[slug]/page.tsx` render
`<ProjectArt seed={…} variant={…} />`. Swap for `next/image`:

```tsx
import Image from 'next/image';

<Image
  src={project.image}
  alt={`${project.name} — ${project.location}`}
  fill
  sizes="(min-width: 1024px) 33vw, 100vw"
  className="object-cover"
/>;
```

Add `image` (and per-gallery-item `src`) to the `Project` type in `types.ts`.
Keep the existing aspect ratios: `16/9` for featured cards and the detail hero,
`4/3` for grid cards.

### 2. Product imagery

Product cards render `<SteelProfile />` — a technical cross-section, which is
arguably _more_ useful to an engineer than a photograph. If you want both, add
`photo` to the `Product` type and render the photo on the card while keeping the
cross-section in `SteelProfileFigure` on the detail page.

### 3. Hero video

Drop `hero.mp4`, `hero.webm` and `hero-poster.jpg` into `public/media/`. The
hero picks them up automatically and fades them in over the vector scene once
the browser reports it can play. Encoding commands are in
`public/media/README.md`.

Video files are git-ignored by default so the repository does not accumulate
large binaries. Either remove those `.gitignore` entries or host the file on a
CDN and set `NEXT_PUBLIC_HERO_VIDEO_URL`.

### 4. Image guidance

- Supply source images at 2× the largest rendered size
- Let Next.js handle format conversion — `next.config.ts` already requests AVIF
  and WebP
- Every image needs a meaningful `alt`. Decorative images take `alt=""`
- Colour-grade toward the palette: cool shadows, restrained saturation. A warm,
  heavily saturated stock photo will look pasted on

---

## Downloads

Product datasheets live in `public/downloads/`. The filenames referenced by
`products.ts` are listed in `public/downloads/README.md`.

Until a file exists its link 404s. The product page shows a notice explaining
that datasheets are added as they are finalised, rather than pretending they are
all available — but add the files or remove the entries before launch.

---

## After editing

```bash
npm run typecheck   # catches missing or mistyped fields
npm run dev         # check it looks right
```

Content changes are picked up by the build automatically — sitemap, search
index, navigation cross-links and all.
