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
- [Configuration without code](#configuration-without-code)
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

Full documentation — every variable, with the reason it exists — lives in
[`.env.example`](./.env.example). The ones that matter most:

| Variable                                                                  | Required    | Purpose                                            |
| ------------------------------------------------------------------------- | ----------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                    | Production  | Canonical origin for URLs, OG images, sitemap      |
| `NEXT_PUBLIC_SITE_ENV`                                                    | Production  | `production` enables search indexing               |
| `RESEND_API_KEY`                                                          | —           | Send email via Resend                              |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_SECURE` | —           | Send email via SMTP                                |
| `FROM_EMAIL`                                                              | Production  | Envelope sender — must be a verified Resend domain |
| `OWNER_EMAIL`                                                             | Production  | Where enquiry notifications go (comma-separated)   |
| `REPLY_TO_EMAIL`                                                          | —           | Where a reply to a customer email lands            |
| `EMAIL_INCLUDE_IP`                                                        | —           | Put the submitter's IP in your notification        |
| `TRUSTED_PROXY_HOPS`                                                      | —           | Proxies in front of the app (default 1)            |
| `FORM_TOKEN_SECRET`                                                       | Recommended | Signs the token every form fetches before submit   |
| `IP_HASH_SALT`                                                            | Recommended | Salt for hashing submitter IPs                     |
| `EMAIL_SPOOL_DIR`                                                         | —           | Where undeliverable email waits for a retry        |
| `UPLOAD_MAX_MB`                                                           | —           | Per-file upload limit (default 10)                 |
| `TIMEZONE`                                                                | —           | IANA zone for timestamps in your notifications     |
| `DATABASE_URL`                                                            | —           | Postgres connection string (backup copy only)      |
| `AI_ENABLED` / `OPENAI_API_KEY`                                           | —           | Both required to bring the assistant live          |
| `NEXT_PUBLIC_HERO_VIDEO_URL`                                              | —           | CDN-hosted hero video                              |

Plus roughly thirty `NEXT_PUBLIC_*` variables covering every business fact —
company name, all four email addresses, phone, opening hours, the whole postal
address, the Google Maps link and five social URLs — and four analytics IDs, all
unset by default. See [Configuration without code](#configuration-without-code).

### The boot report

The server checks its configuration before it accepts the first request and
prints what it found. Nothing here is required to start, which is what makes a
first deploy succeed before email exists — and the failure mode that creates is
silence, so this is the antidote:

```
────────────────────────────────────────────────────────────────────────
  EPOXA STEEL — environment
────────────────────────────────────────────────────────────────────────
  · email: Resend
  · database: connected (enquiries backed up)
  · assistant: Coming Soon — set OPENAI_API_KEY and AI_ENABLED=true to go live
  · analytics: none — no cookies set, no consent banner
  ! IP_HASH_SALT is not set — stored submitter hashes use a default salt
────────────────────────────────────────────────────────────────────────
```

`·` is a note, `!` a warning, `✗` an error. **Errors abort the boot in
production**, because starting with a broken configuration is worse than not
starting — a malformed URL, a Resend key without its `re_` prefix, an
unrecognised timezone, `AI_ENABLED=true` with no key behind it.

You can also ask at any time:

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

## Configuration without code

Every business fact on the site reads from an environment variable, with the
current value as a fallback. Change one, redeploy, done — no code edit, no
rebuild of anything but the app.

| Group         | Covers                                                   |
| ------------- | -------------------------------------------------------- |
| Company       | Name, legal name, tagline, founding year, domain, locale |
| Contact       | Four email addresses, phone, opening hours               |
| Address       | Both lines, city, region, postcode, country, coordinates |
| Social        | Five URLs, all unset — set one and its icon appears      |
| Feature flags | `AI_ENABLED`, analytics IDs, upload limits, timezone     |

Two details worth knowing:

- The `tel:` link is **derived** from the display number, so there is only one
  value to keep correct. Two variables that had to agree would eventually not,
  and a corrected display number with a stale dial link is a bug nobody notices
  until a customer reaches the wrong company.
- Opening hours are one variable of `Days|Time` pairs separated by semicolons,
  because a business with different opening days should not need a code change to
  say so. Malformed entries are dropped; if nothing survives, the default stands.

These are `NEXT_PUBLIC_` because the footer, the dock and the assistant panel are
client components, and a variable without that prefix is simply undefined in the
browser — which would render an empty phone number rather than a wrong one. None
of it is secret; it is all printed on the page already.

### Analytics and the cookie notice

Four providers are wired and dormant: Google Analytics 4, Google Tag Manager,
Meta Pixel and LinkedIn Insight. **There are no measurement IDs anywhere in this
repository.** Set one and three things happen by the same switch:

1. The script loads — but only after a visitor accepts.
2. The Content Security Policy widens by exactly the hosts that provider needs.
3. The cookie notice starts appearing, and `/cookies` lists the provider by name.

With none set — the shipping default — the site sets no cookies at all, shows no
banner, and contacts no third party. There is nothing to consent to, and a banner
that exists to look compliant while that is true only teaches people to dismiss
the ones that matter.

When a provider _is_ configured, nothing loads until Accept. Not the common
"load and behave" consent mode: no script tag is inserted and no request is made.
Accept and decline are the same size in the same place, and a decision is
remembered permanently and never re-asked — changeable on `/cookies`.

The privacy policy's cookie paragraphs and the whole `/cookies` page are
generated from the same configuration the scripts read, so neither page can
describe tracking the site does not do, or omit tracking it does.

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

### How an enquiry actually reaches you

There is no admin dashboard and no login, by design. The whole workflow is a
mailbox:

1. A customer submits the form.
2. The server validates it against the same schema the browser used.
3. Attachments are checked — size, extension, declared type and file signature.
4. The customer gets a confirmation with a reference number and a realistic
   response time.
5. You get one email containing every field, the attachments themselves, the
   date and time in your own timezone, and which browser, operating system and
   device it came from.
6. You press Reply. It goes to the customer, because `Reply-To` is set to their
   address.

That is the entire system. Nothing to log into, nothing to check, nothing to
maintain.

### Every form

- Validates with a Zod schema shared between browser and server, so the server
  never trusts the client and the client never shows an error the server would
  not also produce
- Never shows a technical error. Every message is written for a customer, and
  `safeFieldErrors()` catches anything that slipped through with a library's own
  phrasing before it reaches a response body
- Fetches a signed, short-lived token before it can submit — the invisible
  CAPTCHA and the CSRF check in one mechanism (`src/lib/form-token.ts`). A
  missing or expired token is logged, never refused: losing a written-out
  enquiry because somebody left a tab open over lunch would be the worse bug
- Refuses a cross-origin POST outright
- Carries a honeypot field plus a minimum-elapsed-time check; both failures are
  accepted silently so a bot learns nothing
- Is rate limited per IP (`src/lib/rate-limit.ts`)
- Deduplicates: the same enquiry resubmitted within ten minutes returns the
  original reference instead of putting two of it on your desk
- Keeps a draft in session storage, so a stray click does not lose a
  half-written message
- Persists to Postgres when configured, as a disaster-recovery copy only

### Delivery that does not lose enquiries

`sendEmail` retries three times with growing gaps. If all three fail the message
is written to a JSONL spool on disk and retried on the back of the next
successful send — traffic is the clock, so there is no scheduler to keep alive.

The response to the customer distinguishes three outcomes: **delivered**, **held
for retry** (success, plus a note that the confirmation may be slow) and
**genuinely lost** (an honest error with the phone number). A transport hiccup no
longer tells somebody to call instead when their enquiry is safely queued.

Set `EMAIL_SPOOL_DIR` to a mounted volume if you want the spool to survive a
redeploy; Railway reclaims the container filesystem otherwise.

### Configuring email

**Resend** (the production path): verify `epoxasteel.com` at
[resend.com](https://resend.com), create an API key, and set three variables:

```
RESEND_API_KEY="re_..."
FROM_EMAIL="Epoxa Steel <noreply@epoxasteel.com>"
OWNER_EMAIL="info@epoxasteel.com"
```

Every form — contact, quote, newsletter, and the assistant's lead handoff — then
follows one workflow, enforced in `lib/email/workflow.ts` rather than repeated in
each route:

|              | Owner notification | Customer confirmation                         |
| ------------ | ------------------ | --------------------------------------------- |
| **To**       | `OWNER_EMAIL`      | the customer                                  |
| **From**     | `FROM_EMAIL`       | `FROM_EMAIL`                                  |
| **Reply-To** | **the customer**   | `REPLY_TO_EMAIL`, defaulting to `OWNER_EMAIL` |
| **Order**    | first              | second                                        |

The owner's Reply-To is the whole reply workflow: press Reply in any mail client
and you are writing to the customer. It is not configurable and should not be.

There are no email address literals in `src/` outside `lib/site.ts`, which is the
environment-fallback layer itself. The boot report prints the resolved addresses
so a deploy log records where mail actually goes.

Three things the integration handles that a naive one does not:

- **Resend allows two requests per second.** Every enquiry sends two emails, and a
  successful send also drains any spooled backlog — fired in parallel that is
  already at the ceiling. All calls go through a queue that spaces them 620ms
  apart, so the limit is never reached. Measured under three concurrent
  submissions: six emails, never more than two in any one-second window.
- **A request that times out has an unknown outcome.** Every message carries an
  idempotency key built from its reference and recipient, so a retry after an
  ambiguous failure is collapsed by Resend rather than delivered twice.
- **Some failures are permanent.** An invalid key, an unverified sending domain or
  a malformed payload will fail identically forever. Those skip the retries and
  the spool, and log the operator fix by name — retrying them cost the visitor six
  seconds and then filled the queue with mail that could never be sent.

`EMAIL_FROM` and `EMAIL_TO` still work as aliases for `FROM_EMAIL` and
`OWNER_EMAIL`.

**SMTP** (works with Namecheap Private Email, Google Workspace, Microsoft 365):
set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and `EMAIL_FROM`.

Add SPF, DKIM and DMARC records for the sending domain, or confirmation emails
will land in spam.

### Attachments

Up to five files per quote request, `UPLOAD_MAX_MB` each (default 10). PDF, DWG,
DXF, XLSX, XLS, DOC, DOCX, ZIP, PNG, JPG and WEBP.

They travel with the internal notification email and are **never written to
disk** — which is most of why an upload field on a public form is safe here.
There is no URL that returns them, no directory to escape into, and no path
derived from a name the sender chose.

Validation is an allowlist checked twice (extension and declared MIME type) plus
a magic-byte check on the formats that have a signature, so an executable renamed
`drawing.pdf` is refused. `src/lib/uploads.ts` also states plainly what this is
**not**: an antivirus. A malicious PDF is a well-formed PDF, and finding one needs
a scanning service — a paid dependency and a business decision, not a default.
What the design buys is that nothing can execute here; the file goes to a mailbox,
where the mail provider's own scanner is the layer that inspects its contents.

Upload progress is real, measured from `XMLHttpRequest` upload events, because
`fetch` cannot report it — and without a number moving, a minute-long upload on a
site connection reads as hung.

For higher volumes, move uploads to object storage; the swap is described in
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

Measured with Lighthouse against a production build, median of several runs:

| Profile                     | Performance | Accessibility | Best practices | SEO | CLS   |
| --------------------------- | ----------- | ------------- | -------------- | --- | ----- |
| Desktop                     | 99          | 100           | 100            | 100 | 0.000 |
| Mobile (Moto G, 4× CPU, 4G) | ~79         | 100           | 100            | 100 | 0.000 |

The mobile performance figure is the honest one and it is short of the 95 the
original brief named. The remaining cost is the homepage's own markup — a
fourteen-section page is roughly 96 KB of Tailwind class strings plus the
serialized React tree, not artwork or scripts. Getting past it means shipping
fewer sections, which is a content decision rather than an engineering one.
Everything cheaper than that has already been done:

- **84 pages pre-rendered** at build time; only form endpoints and search are
  dynamic
- **Zero JavaScript for scroll reveals** — 223 reveal instances are one shared
  `IntersectionObserver` bootstrapped by an inline script, not 223 components
- **Self-hosted fonts**, latin subset only, with size-adjusted fallbacks
- **No third-party scripts, fonts or trackers by default** — strict CSP, widened
  only for analytics providers actually configured
- **Vector artwork** instead of photography, so the hero costs kilobytes
- The assistant's transcript UI is a separate chunk, not downloaded until the
  panel opens and never at all while `AI_ENABLED` is off

**Accessibility is verified, not asserted.** axe-core reports zero violations
across seventeen routes at both 390px and 1440px, against WCAG 2.0 A/AA, 2.1
A/AA and 2.2 AA. Semantic HTML, one visible focus treatment site-wide,
keyboard-accessible menus and dialogs, 24px minimum target sizes, a skip link
that genuinely moves focus, and wide tables that scroll in a focusable region so
a keyboard user can reach the right-hand columns.

### Security

- Strict `Content-Security-Policy`, HSTS with preload, `X-Content-Type-Options`,
  `X-Frame-Options: DENY`, a restrictive `Permissions-Policy`
- Signed short-lived form tokens (invisible CAPTCHA + CSRF), origin checks, rate
  limiting, honeypots, timing checks, idempotency fingerprints
- Client IP resolved from `cf-connecting-ip`, then `x-real-ip`, then
  `X-Forwarded-For` **counted from the right**. The left-most XFF entry is
  whatever the client claimed before any proxy touched it; reading it — which this
  did until the Phase 5 audit — made every rate limit bypassable with a forged
  header. A global per-endpoint ceiling backs it up, because per-IP limiting
  assumes the identity is real
- Upload allowlist plus magic-byte verification; nothing written to disk
- Every value interpolated into an email is escaped, and anything reaching a mail
  header has control characters stripped at the transport — header injection was
  confirmed reachable from the contact form before that existed
- IP addresses are hashed before storage, never kept in the clear
- No secrets in the client bundle, no debug output in production, and a boot
  check that refuses to start on a broken configuration

---

## Build process

### Why build tooling lives in `dependencies`

`tsx`, `pdf-lib`, `typescript`, the `@types/*` packages, the Tailwind/PostCSS
chain and `prisma` are **`dependencies`, not `devDependencies`** — deliberately,
and it is not a mistake to "clean up".

`devDependencies` means _needed to develop_. Everything listed above is needed to
**build**, which is a different question with a different answer. A build host
that installs production-only — which Railway's Railpack builder does — gets no
`tsx`, so `prebuild` dies with `sh: 1: tsx: not found` before Next.js is ever
invoked, and the platform reports the useless message "Failed to build an image".

This cost a deployment. Reproduced with `npm ci --omit=dev && npm run build`,
which is worth running before changing anything here:

```bash
npm ci --omit=dev && npm run build   # must succeed
```

Only ESLint and Prettier remain in `devDependencies`, because they are the only
things genuinely not required to produce a build.

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

- [ ] **Contact details** — the phone number, address and coordinates are
      placeholders. The phone number uses the reserved `555-01xx` fictional range,
      so it is obviously not real, but it must be changed. Set the
      `NEXT_PUBLIC_CONTACT_*` and `NEXT_PUBLIC_ADDRESS_*` variables rather than
      editing `src/lib/site.ts`; see
      [Configuration without code](#configuration-without-code).
- [ ] **Social accounts** — the five handles in the footer are plausible guesses,
      not verified accounts. Set each `NEXT_PUBLIC_*_URL` to the real one, or to
      `""` to remove the icon. A link to somebody else's abandoned handle is worse
      than one fewer icon.
- [ ] **`FORM_TOKEN_SECRET`** — set it to a long random string
      (`openssl rand -hex 32`). Without one the site still rejects forged tokens,
      but they stop validating across a restart or a second replica.
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
      points, not legal advice, and the governing-law clause is a placeholder.
      Have a qualified adviser review both against your actual trading terms,
      jurisdictions and insurance. This warning used to be printed on the terms
      page itself, where visitors read it; it lives here now, because telling a
      prospective customer that your trading terms are provisional costs more
      than the warning was worth.
- [ ] **Downloads** — every product datasheet is generated from its own content
      at build time, so nothing 404s. Substitute a real document by committing it
      to `public/downloads/` under a new filename and pointing the product's
      `href` at it in `src/content/products.ts`. Five documents that have to come
      from the drawing office — a mill certificate, a bar-bending template, a DWG
      profiling file, a WPS index — had their links removed rather than pointed at
      an invention; add them back when the real files exist.
- [ ] **Hero video** — optional. See `public/media/README.md`.
- [ ] **Logo** — swap the placeholder wordmark. See [`docs/BRANDING.md`](./docs/BRANDING.md).

Optional, and genuinely optional:

- [ ] **The AI assistant** ships switched off and shows a Coming Soon panel. Set
      `OPENAI_API_KEY`, set `AI_ENABLED=true`, redeploy. Nothing else.
- [ ] **Analytics** ships switched off with no IDs anywhere. Set one and the
      cookie notice appears with it.
- [ ] **Virus scanning on uploads.** Files are allowlisted, signature-checked and
      never written to disk, so nothing can execute on the server — but a
      malicious PDF is a well-formed PDF, and only a scanning service finds one.
      Your mail provider scans attachments on delivery, which for this volume is
      the right layer. Add a service if the volume changes.
- [ ] **A volume at `EMAIL_SPOOL_DIR`** if you want undeliverable email to
      survive a redeploy as well as an outage.

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
