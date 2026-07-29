# EPOXA STEEL

The official website for **EPOXA STEEL** — structural steel supply, fabrication and delivery.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion and Prisma.
Designed to be deployed on Railway and served from **epoxasteel.com**.

---

## Contents

- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Local installation](#local-installation)
- [Development workflow](#development-workflow)
- [Environment variables](#environment-variables)
- [Project architecture](#project-architecture)
- [Editing content](#editing-content)
- [Design system](#design-system)
- [Forms and email](#forms-and-email)
- [Database](#database)
- [SEO](#seo)
- [Performance and accessibility](#performance-and-accessibility)
- [Build process](#build-process)
- [Version control](#version-control)
- [Deploying to Railway](#deploying-to-railway)
- [Connecting the Namecheap domain](#connecting-the-namecheap-domain)
- [Before you go live](#before-you-go-live)
- [Future CMS integration](#future-cms-integration)
- [Further documentation](#further-documentation)

---

## Quick start

```bash
git clone https://github.com/epoxasteel/epoxasteel.git
cd epoxasteel
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

**Nothing needs configuring to get started.** With no environment variables the
site builds, every page renders, every form validates, and submitted enquiries
are printed to the terminal instead of being emailed. Connect email and a
database when you are ready.

---

## Requirements

| Tool       | Version                                  |
| ---------- | ---------------------------------------- |
| Node.js    | 20.9 or newer (22 LTS recommended)       |
| npm        | 10 or newer                              |
| PostgreSQL | Optional — only for persisting enquiries |

---

## Local installation

```bash
npm install
```

`postinstall` runs `prisma generate` to build the database client. It is safe to
run without a database configured.

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in whatever you have. Every variable is optional and
documented inline.

---

## Development workflow

| Command                | What it does                                         |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Development server with hot reload on port 3000      |
| `npm run build`        | Production build                                     |
| `npm start`            | Serve the production build (honours `$PORT`)         |
| `npm run lint`         | ESLint across the project                            |
| `npm run lint:fix`     | ESLint with autofix                                  |
| `npm run typecheck`    | TypeScript with no emit                              |
| `npm run format`       | Prettier write                                       |
| `npm run format:check` | Prettier check (use in CI)                           |
| `npm run db:generate`  | Regenerate the Prisma client                         |
| `npm run db:push`      | Push the schema to the database (no migration files) |
| `npm run db:migrate`   | Apply migrations (production)                        |
| `npm run db:studio`    | Prisma Studio — browse the database                  |

Before pushing, run:

```bash
npm run typecheck && npm run lint && npm run build
```

---

## Environment variables

Full documentation lives in [`.env.example`](./.env.example). Summary:

| Variable                                                                  | Required    | Purpose                                          |
| ------------------------------------------------------------------------- | ----------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                                                    | Production  | Canonical origin for URLs, OG images, sitemap    |
| `NEXT_PUBLIC_SITE_ENV`                                                    | Production  | `production` enables search indexing             |
| `RESEND_API_KEY`                                                          | —           | Send email via Resend                            |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_SECURE` | —           | Send email via SMTP                              |
| `EMAIL_FROM`                                                              | —           | Envelope sender address                          |
| `EMAIL_TO`                                                                | —           | Where enquiry notifications go (comma-separated) |
| `DATABASE_URL`                                                            | —           | Postgres connection string                       |
| `IP_HASH_SALT`                                                            | Recommended | Salt for hashing submitter IPs                   |
| `NEXT_PUBLIC_HERO_VIDEO_URL`                                              | —           | CDN-hosted hero video                            |

Check what is actually configured at any time:

```bash
curl https://epoxasteel.com/api/health
```

```json
{
  "status": "ok",
  "services": { "database": "configured", "email": "resend" }
}
```

---

## Project architecture

```
epoxasteel/
├── prisma/
│   └── schema.prisma          Postgres data model (optional at runtime)
├── public/
│   ├── downloads/             Product datasheets and catalogues
│   ├── media/                 Hero video (git-ignored — see media/README.md)
│   └── icon.svg
├── src/
│   ├── app/                   Routes (App Router)
│   │   ├── api/               quote · contact · newsletter · search · health
│   │   ├── layout.tsx         Root shell, fonts, site-wide JSON-LD
│   │   ├── page.tsx           Homepage
│   │   ├── sitemap.ts         Generated from the content layer
│   │   ├── robots.ts          Blocks indexing on non-production builds
│   │   ├── opengraph-image.tsx  Social card, generated at build time
│   │   └── …                  about, products, industries, services,
│   │                          projects, quote, contact, blog, careers,
│   │                          faq, search, privacy, terms, 404
│   ├── components/
│   │   ├── ui/                Button, Card, Field, Accordion, Badge, Alert,
│   │   │                      Breadcrumbs, Pagination, SpecTable, …
│   │   ├── layout/            Header, mega-menu, mobile drawer, Footer,
│   │   │                      Section/PageHero primitives, JsonLd
│   │   ├── motion/            Reveal, MaskedLines, Counter, Parallax, Magnetic
│   │   ├── visual/            Wordmark, steel cross-sections, city scene,
│   │   │                      generated project artwork, social icons
│   │   ├── home/              Hero, lifecycle sequence, homepage sections
│   │   ├── forms/             Quote, contact and newsletter forms
│   │   ├── search/            ⌘K dialog and its provider
│   │   ├── cards.tsx          Shared listing cards
│   │   └── article.tsx        Markdown block renderer
│   ├── content/               The whole catalogue, typed
│   │   ├── products.ts        13 product families
│   │   ├── industries.ts      12 sectors
│   │   ├── services.ts        9 services
│   │   ├── projects.ts        Case studies
│   │   ├── posts.ts           Blog articles
│   │   ├── careers.ts         Open roles
│   │   ├── faqs.ts            21 questions
│   │   ├── company.ts         Mission, values, history, leadership
│   │   ├── testimonials.ts    Client quotes
│   │   └── types.ts           Shared shapes
│   ├── lib/
│   │   ├── site.ts            Company facts and navigation — edit this first
│   │   ├── seo.ts             Metadata builders and schema.org payloads
│   │   ├── email/             Transport abstraction and HTML templates
│   │   ├── validations.ts     Zod schemas shared by client and server
│   │   ├── search.ts          Full-text index and ranking
│   │   ├── markdown.ts        Small, safe markdown parser
│   │   ├── db.ts              Optional Prisma client
│   │   ├── rate-limit.ts      In-memory form rate limiting
│   │   ├── motion.ts          Shared easing curves
│   │   ├── fonts.ts           Self-hosted variable fonts
│   │   └── utils.ts           `cn()` and formatting helpers
│   └── fonts/                 Vendored Inter and Manrope (.woff2 + licences)
├── docs/                      Deployment, content, branding, CMS guides
├── next.config.ts             Security headers, CSP, redirects
├── railway.json               Railway build and health check config
└── .env.example
```

### Architectural decisions worth knowing

**The content layer is typed TypeScript, not a CMS.** Every product, service and
article is a typed object, so the whole catalogue is statically analysable and
pre-rendered at build time. Pages only touch the accessor functions in each
module, so swapping in a CMS later does not touch the UI —
see [`docs/CMS.md`](./docs/CMS.md).

**The database is optional.** `src/lib/db.ts` returns `null` when `DATABASE_URL`
is unset, and every route handles that. The first Railway deploy works before
Postgres is attached, and adding it later needs no code change.

**Email has three transports**, chosen automatically: Resend, SMTP, or a console
logger. Forms are fully testable locally with no credentials.

**Search runs on the server.** The full-text index includes every article body;
querying through `/api/search` keeps it off the client and the search bundle at a
few kilobytes.

**Nothing is rendered with `dangerouslySetInnerHTML`** except JSON-LD, which is
`JSON.stringify` output with `<` escaped. Article bodies go through a small
parser that produces a typed block tree, so content cannot introduce markup.

**Imagery is drawn, not photographed.** Steel cross-sections, the hero city
scene and project artwork are SVG generated from seeded PRNGs — a few kilobytes,
sharp at any size, and honest about not being real photographs. Swap points are
documented in [`docs/CONTENT.md`](./docs/CONTENT.md).

---

## Editing content

Most changes need no code.

| To change                                  | Edit                          |
| ------------------------------------------ | ----------------------------- |
| Phone, email, address, hours, social links | `src/lib/site.ts`             |
| Navigation and mega-menu                   | `src/lib/site.ts`             |
| Products and specifications                | `src/content/products.ts`     |
| Industries                                 | `src/content/industries.ts`   |
| Services                                   | `src/content/services.ts`     |
| Case studies                               | `src/content/projects.ts`     |
| Blog articles                              | `src/content/posts.ts`        |
| FAQ                                        | `src/content/faqs.ts`         |
| Open roles                                 | `src/content/careers.ts`      |
| Mission, values, history, leadership       | `src/content/company.ts`      |
| Testimonials                               | `src/content/testimonials.ts` |

Adding an entry automatically creates its page, adds it to listings, the search
index, the sitemap and the navigation where relevant. TypeScript will tell you
if a required field is missing.

Blog articles use a deliberately small markdown subset: `##` and `###` headings,
paragraphs, `-` and `1.` lists, `>` quotes, `**bold**` and `[links](/path)`.

---

## Design system

The visual language is defined once, in `src/app/globals.css`, as Tailwind v4
theme tokens.

**Palette** — mill-finished steel. Surfaces run `void → graphite → charcoal →
slate → iron → anvil`; text runs `steel → ash → mist → chalk → bright`; the
single accent is a deep industrial blue (`arc-deep → arc → arc-bright →
arc-glow`). Signal colours exist only for form state.

**Type** — Inter for body and interface, Manrope for display. Both are variable
fonts, vendored into `src/fonts/` and loaded through `next/font/local`. Builds
are hermetic (no Google Fonts request at build time), the CSP stays locked to
`font-src 'self'`, and there is no third-party connection at runtime.

**Motion** — every scroll reveal goes through `<Reveal>` / `<RevealGroup>` and
every easing curve comes from `src/lib/motion.ts`, which mirrors the CSS
custom properties. `prefers-reduced-motion` is honoured throughout: the hero
overture is skipped entirely and the pinned lifecycle sequence degrades to a
plain list.

**The site is dark-only.** That is a deliberate design decision for this brand
rather than an omission — a half-committed light mode would weaken it.

> ⚠️ If you add a new font size to `@theme`, also register it in the
> `extendTailwindMerge` call in `src/lib/utils.ts`. Otherwise `tailwind-merge`
> reads `text-yourname` as a _colour_, decides it conflicts with `text-bright`,
> and silently drops it.

---

## Forms and email

Three forms ship: **quote request** (with attachment upload), **contact** and
**newsletter**.

Every one of them:

- Validates with a Zod schema shared between browser and server, so the server
  never trusts the client and the client never shows an error the server would
  not also produce
- Carries a honeypot field plus a minimum-elapsed-time check; both failures are
  accepted silently so a bot learns nothing
- Is rate limited per IP (`src/lib/rate-limit.ts`)
- Emails EPOXA STEEL **and** sends the customer a confirmation with a reference
- Persists to Postgres when configured, and still works when it is not
- Reports an honest error if neither persistence nor delivery succeeded, rather
  than showing a success screen for an enquiry that went nowhere

### Configuring email

**Resend** (simplest): verify `epoxasteel.com` at [resend.com](https://resend.com),
create an API key, set `RESEND_API_KEY`, `EMAIL_FROM` and `EMAIL_TO`.

**SMTP** (works with Namecheap Private Email, Google Workspace, Microsoft 365):
set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and `EMAIL_FROM`.

Add SPF, DKIM and DMARC records for the sending domain, or confirmation emails
will land in spam.

### Attachments

Quote attachments (10 MB limit) travel with the internal notification email.
Nothing is written to disk — Railway's filesystem is ephemeral. For higher
volumes, move uploads to object storage; the swap is described in
[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

---

## Database

Prisma with PostgreSQL. Four models: `QuoteRequest`, `ContactMessage`,
`Subscriber`, `JobApplication`.

```bash
# Add Postgres in Railway — DATABASE_URL is injected automatically.
npm run db:push      # create tables (development / first deploy)
npm run db:studio    # browse the data
```

For production use migrations:

```bash
npx prisma migrate dev --name init   # locally, commits a migration file
npm run db:migrate                   # on the server
```

---

## SEO

Every page ships:

- A unique meta title and description
- A canonical URL
- Open Graph and Twitter Card tags, with a generated 1200×630 social image
- schema.org JSON-LD — `Organization`, `WebSite`, `LocalBusiness`,
  `BreadcrumbList`, and `Product` / `Service` / `BlogPosting` / `FAQPage` /
  `JobPosting` as applicable
- Breadcrumbs, in the markup and in structured data

`sitemap.xml` and `robots.txt` are generated from the content layer, so a new
product appears in both the moment it is added.

**Non-production deployments serve `Disallow: /`.** Set
`NEXT_PUBLIC_SITE_ENV=production` on the live service only — otherwise a preview
URL can outrank the real site.

After launch: verify the domain in Google Search Console and submit
`https://epoxasteel.com/sitemap.xml`.

---

## Performance and accessibility

- **84 pages pre-rendered** at build time; only form endpoints and search are
  dynamic
- **Self-hosted fonts** with size-adjusted fallbacks, so CLS stays at zero
- **No third-party scripts, fonts or trackers** — a strict CSP is enforced in
  `next.config.ts`
- **Vector artwork** instead of photography, so the hero costs kilobytes
- Semantic HTML, one visible focus treatment site-wide, ARIA-labelled controls,
  keyboard-accessible menus and dialogs (via Radix), and a skip link
- Every wide table scrolls inside its own container — the page body never
  scrolls horizontally

Security headers include a strict `Content-Security-Policy`, HSTS,
`X-Content-Type-Options`, `X-Frame-Options: DENY` and a restrictive
`Permissions-Policy`.

---

## Build process

```bash
npm run build
```

1. `prisma generate` (via `postinstall`)
2. Next compiles with Turbopack
3. TypeScript type-checks the project
4. Static pages are generated from the content layer
5. `sitemap.xml`, `robots.txt`, the manifest, the OG image and the icons are
   emitted

Output is `output: 'standalone'`, so a minimal server bundle is produced
alongside the normal build. `npm start` works either way.

---

## Version control

```bash
git checkout -b feature/your-change
# … work …
npm run typecheck && npm run lint && npm run build
git add -A
git commit -m "Describe the change"
git push -u origin feature/your-change
```

Open a pull request against `main`. Railway deploys `main` automatically and
builds a preview for every pull request.

---

## Deploying to Railway

### 1. Create the service

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select `epoxasteel/epoxasteel`
3. Railway detects Next.js and reads `railway.json` for the build and start
   commands and the `/api/health` health check

### 2. Set environment variables

Service → **Variables**:

```
NEXT_PUBLIC_SITE_URL=https://epoxasteel.com
NEXT_PUBLIC_SITE_ENV=production
EMAIL_FROM=EPOXA STEEL <no-reply@epoxasteel.com>
EMAIL_TO=info@epoxasteel.com
RESEND_API_KEY=re_…
IP_HASH_SALT=<a long random string>
```

Do **not** set `PORT` — Railway injects it, and `npm start` reads it.

### 3. Add Postgres (optional)

**New** → **Database** → **PostgreSQL**. Railway injects `DATABASE_URL` into the
web service automatically. Then run `npm run db:push` once against it.

### 4. Deploy

Push to `main`. Watch the build log, then check:

```bash
curl https://<your-service>.up.railway.app/api/health
```

Full walkthrough, including troubleshooting: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md).

---

## Connecting the Namecheap domain

### 1. Add the domain in Railway

Service → **Settings** → **Networking** → **Custom Domain** → enter
`epoxasteel.com`. Railway shows the DNS target — a hostname like
`abc123.up.railway.app`. Repeat for `www.epoxasteel.com`.

### 2. Configure DNS at Namecheap

Namecheap dashboard → **Domain List** → **Manage** → **Advanced DNS**.

| Type    | Host  | Value                     | TTL       |
| ------- | ----- | ------------------------- | --------- |
| `ALIAS` | `@`   | `<target>.up.railway.app` | Automatic |
| `CNAME` | `www` | `<target>.up.railway.app` | Automatic |

Namecheap's BasicDNS supports `ALIAS` at the apex — use it rather than an `A`
record, because Railway's IP addresses are not static.

Delete any parking-page records Namecheap added (usually a `CNAME` on `@` or
`www` pointing at `parkingpage.namecheap.com`), or they will conflict.

### 3. Wait for DNS and TLS

Propagation is usually 15–60 minutes. Railway provisions a Let's Encrypt
certificate automatically once DNS resolves. Check with:

```bash
dig epoxasteel.com
curl -I https://epoxasteel.com
```

### 4. Email DNS

If you use Resend or Namecheap Private Email, add their SPF, DKIM and DMARC
records in the same Advanced DNS panel. Without them, confirmation emails go to
spam.

### 5. Update the canonical URL

Confirm `NEXT_PUBLIC_SITE_URL=https://epoxasteel.com` in Railway and redeploy so
canonical URLs, the sitemap and OG images all point at the real domain.

---

## Before you go live

Content marked as illustrative must be replaced. In priority order:

- [ ] **Contact details** in `src/lib/site.ts` — the phone number, address and
      coordinates are placeholders. The phone number uses the reserved `555-01xx`
      fictional range, so it is obviously not real, but it must be changed.
- [ ] **Case studies** in `src/content/projects.ts` — illustrative examples.
      Replace with real projects, and get written permission before naming a
      client.
- [ ] **Testimonials** in `src/content/testimonials.ts` — illustrative examples.
      Do not publish them as-is.
- [ ] **Leadership** in `src/content/company.ts` — names and biographies are
      placeholders.
- [ ] **Statistics** — tonnage, project counts, on-time delivery and certification
      claims appear throughout. Verify every figure you intend to publish.
- [ ] **Legal pages** — `/privacy` and `/terms` are well-structured starting
      points, not legal advice. Have them reviewed. The governing-law clause is a
      placeholder.
- [ ] **Downloads** — add the PDFs listed in `public/downloads/README.md`, or
      remove the entries from `src/content/products.ts`.
- [ ] **Hero video** — optional. See `public/media/README.md`.
- [ ] **Logo** — swap the placeholder wordmark. See [`docs/BRANDING.md`](./docs/BRANDING.md).

---

## Future CMS integration

The content layer was written to be replaced. Every page imports accessor
functions (`getProduct`, `getSortedPosts`, …) rather than reaching into the data,
so pointing those functions at Sanity, Payload, Contentful or a database changes
no UI code.

[`docs/CMS.md`](./docs/CMS.md) walks through the migration, including keeping
static generation and incremental revalidation.

The same architecture supports the roadmap in the brief — customer accounts, an
admin dashboard, inventory, order tracking, an RFQ portal, invoices, analytics,
multilingual routing and multiple locations. The Prisma schema and the
`(marketing)` / `api` route split are already shaped for it.

---

## Further documentation

| Document                                     | Covers                                                 |
| -------------------------------------------- | ------------------------------------------------------ |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Railway in depth, scaling, monitoring, troubleshooting |
| [`docs/CONTENT.md`](./docs/CONTENT.md)       | Editing every content type, adding photography         |
| [`docs/BRANDING.md`](./docs/BRANDING.md)     | Swapping the logo, palette and typography              |
| [`docs/CMS.md`](./docs/CMS.md)               | Migrating to a headless CMS                            |
| `public/media/README.md`                     | Hero video encoding and placement                      |
| `public/downloads/README.md`                 | Product datasheets                                     |

---

© Epoxa Steel. All rights reserved.
