# Migrating to a headless CMS

The content layer was written to be replaced. This describes how, and what to
watch for.

---

## Why it is file-based today

Typed TypeScript modules give you things a CMS does not:

- **Type safety** — a missing or mistyped field fails `npm run typecheck`, not
  a production page
- **Zero runtime cost** — everything is pre-rendered at build time; there is no
  API call, no cache layer, no CMS outage
- **Version control** — content changes are reviewable in a pull request
  alongside the code that renders them
- **No vendor** — no account, no monthly fee, no migration risk

The trade-off is that a non-technical editor cannot change copy without a
developer. When that becomes the bottleneck, migrate.

---

## What makes the migration cheap

Pages never touch the data directly. Every one of them imports an **accessor
function**:

```ts
// src/content/products.ts
export function getProduct(slug: string) { … }
export function getFeaturedProducts() { … }
export function getRelatedProducts(slug: string) { … }
export const productSlugs = products.map((p) => p.slug);
```

```tsx
// src/app/products/[slug]/page.tsx
const product = getProduct(slug);
```

Point those functions at a CMS and **no page or component changes**. The types
in `src/content/types.ts` become the contract your CMS schema must satisfy.

---

## Recommended: Sanity

Best fit here — strong TypeScript support, a good editing experience for
structured content like specification tables, and generous free usage.

### 1. Install

```bash
npm install @sanity/client next-sanity
npx sanity@latest init --env
```

### 2. Model the schema

Mirror `src/content/types.ts`. The `Product` type maps to:

```ts
// sanity/schemas/product.ts
export default {
  name: 'product',
  type: 'document',
  fields: [
    { name: 'slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() },
    { name: 'name', type: 'string', validation: (r) => r.required() },
    {
      name: 'category',
      type: 'string',
      options: {
        list: [
          'Structural',
          'Flat Products',
          'Hollow Sections',
          'Bar & Reinforcement',
          'Coated & Stainless',
          'Fabrication',
        ],
      },
    },
    { name: 'tagline', type: 'string' },
    { name: 'summary', type: 'text', rows: 3 },
    { name: 'overview', type: 'array', of: [{ type: 'text' }] },
    {
      name: 'keyFacts',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'value', type: 'string' },
          ],
        },
      ],
    },
    { name: 'grades', type: 'array', of: [{ type: 'string' }] },
    { name: 'standards', type: 'array', of: [{ type: 'string' }] },
    { name: 'finishes', type: 'array', of: [{ type: 'string' }] },
    { name: 'applications', type: 'array', of: [{ type: 'string' }] },
    { name: 'industries', type: 'array', of: [{ type: 'reference', to: [{ type: 'industry' }] }] },
    { name: 'dimensions', type: 'specTable' },
    { name: 'downloads', type: 'array', of: [{ type: 'download' }] },
    { name: 'related', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] },
    {
      name: 'profile',
      type: 'string',
      options: {
        list: [
          'i-beam',
          'channel',
          'angle',
          'plate',
          'sheet',
          'round-tube',
          'square-tube',
          'pipe',
          'round-bar',
          'rebar',
          'galvanized',
          'stainless',
          'fabrication',
        ],
      },
    },
    { name: 'featured', type: 'boolean', initialValue: false },
  ],
};
```

### 3. Rewrite the accessors

Keep the file, the exported names and the return types. Only the bodies change:

```ts
// src/content/products.ts
import { client } from '@/lib/sanity';
import type { Product } from './types';

const PRODUCT_FIELDS = `
  "slug": slug.current, name, category, tagline, summary, overview,
  keyFacts, grades, standards, finishes, applications,
  "industries": industries[]->slug.current,
  dimensions, downloads,
  "related": related[]->slug.current,
  profile, featured
`;

export async function getProduct(slug: string): Promise<Product | undefined> {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{ ${PRODUCT_FIELDS} }`,
    { slug },
    { next: { revalidate: 3600, tags: [`product:${slug}`] } },
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return client.fetch(
    `*[_type == "product" && featured == true]{ ${PRODUCT_FIELDS} }`,
    {},
    { next: { revalidate: 3600, tags: ['product'] } },
  );
}

export async function getProductSlugs(): Promise<string[]> {
  return client.fetch(`*[_type == "product"].slug.current`);
}
```

### 4. Await in the pages

The accessors become async, so the calls need `await`. This is the only change
in `src/app/`:

```diff
- const product = getProduct(slug);
+ const product = await getProduct(slug);
```

Page components are already `async` (they await `params`), so nothing else moves.

`productSlugs` changes from a constant to a function:

```diff
- export function generateStaticParams() {
-   return productSlugs.map((slug) => ({ slug }));
- }
+ export async function generateStaticParams() {
+   const slugs = await getProductSlugs();
+   return slugs.map((slug) => ({ slug }));
+ }
```

### 5. The search index

`src/lib/search.ts` builds its index at module load from the content modules.
Once content is fetched, make it async and cache it:

```ts
import { unstable_cache } from 'next/cache';

export const getSearchIndex = unstable_cache(
  async (): Promise<SearchDocument[]> => {
    const [products, industries, services, projects, posts] = await Promise.all([
      getAllProducts(),
      getAllIndustries(),
      getAllServices(),
      getAllProjects(),
      getAllPosts(),
    ]);
    return buildIndex({ products, industries, services, projects, posts });
  },
  ['search-index'],
  { revalidate: 3600, tags: ['content'] },
);
```

`/api/search` and `/app/search/page.tsx` then `await getSearchIndex()`.

Change `export const dynamic = 'force-static'` in `src/app/api/search/route.ts`
to `'force-dynamic'` at the same time, or the index will be frozen at build.

### 6. The sitemap

`src/app/sitemap.ts` becomes async and awaits the slug accessors. Everything
else about it is unchanged.

### 7. Revalidation

Add a webhook route so publishing invalidates only what changed:

```ts
// src/app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const secret = request.headers.get('x-webhook-secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Unauthorised' }, { status: 401 });
  }

  const { _type, slug } = await request.json();
  revalidateTag(_type);
  if (slug?.current) revalidateTag(`${_type}:${slug.current}`);
  revalidateTag('content'); // rebuilds the search index

  return NextResponse.json({ revalidated: true });
}
```

Point a Sanity webhook at it and set `REVALIDATE_SECRET` in Railway. Add the
route to the `disallow` list in `src/app/robots.ts`.

---

## Alternatives

**Payload CMS** — self-hosted, Postgres-backed. Attractive here because the
Prisma schema already needs a database, so the CMS and the enquiry data share
one. It also gives you an admin UI you can extend toward the order-tracking and
inventory features in the roadmap. Heavier to operate than Sanity.

**Contentful / Storyblok** — mature, good for large editorial teams, weaker fit
for structured technical data like specification tables.

**Keystatic / MDX** — content stays in the repository but gains a visual editor.
The smallest possible change from where you are now: no external service, no
runtime fetch, and pull-request review is preserved. Worth considering first if
the only real requirement is "let marketing edit the blog".

---

## What to migrate first

Not everything needs to move.

| Content              | Migrate?   | Why                                                                                  |
| -------------------- | ---------- | ------------------------------------------------------------------------------------ |
| Blog posts           | **First**  | Changes most often, least structural risk                                            |
| Projects             | **Second** | New case studies arrive regularly                                                    |
| Careers              | **Third**  | Roles open and close; time-sensitive                                                 |
| Products             | Later      | Rarely changes; the specification tables are fiddly to model                         |
| Industries, services | Later      | Effectively static                                                                   |
| FAQ, company story   | Optional   | Changes once or twice a year                                                         |
| `src/lib/site.ts`    | **Never**  | Navigation and contact details belong in code — a CMS edit here can break the header |

A partial migration works fine: async accessors and sync accessors coexist
without any structural change.

---

## Things that will bite you

**Illustrative content must not be migrated as-is.** The shipped projects,
testimonials and leadership entries are examples. Migrating them into a CMS
makes them look approved. Replace them first — see
[`CONTENT.md`](./CONTENT.md).

**Rich text is not markdown.** Sanity's Portable Text and Contentful's rich text
are structured documents, not strings. Either serialise them to the markdown
subset `src/lib/markdown.ts` understands, or replace `<Article>` with the
vendor's renderer. If you do the latter, keep the current guarantee that no
content path reaches `dangerouslySetInnerHTML`.

**Images need CSP and `next.config.ts` changes.** CMS-hosted images come from a
different origin. Add the host to `images.remotePatterns` **and** to `img-src`
in the CSP, or they will be blocked silently.

**Build times grow.** 84 pages currently build in about three seconds because
there is no network. Fetching per page will change that. Batch queries and lean
on `generateStaticParams` returning everything in one request.

**Preview mode.** Editors will want to see drafts. Next's draft mode plus the
vendor's preview API handles it, but plan for it — retrofitting is more work
than building it in.
