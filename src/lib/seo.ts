import type { Metadata } from 'next';
import { siteConfig, openingHours } from './site';

const BASE = siteConfig.url;

/** Every configured social profile. Empty until the business has real accounts. */
const profiles = Object.values(siteConfig.social).filter(Boolean);

/** `https://x.com/epoxasteel` → `@epoxasteel`. Empty when no account is configured. */
const xHandle = (() => {
  const url = siteConfig.social.x;
  if (!url) return '';
  const name = url.replace(/\/+$/, '').split('/').pop() ?? '';
  return name ? `@${name.replace(/^@/, '')}` : '';
})();

type SeoInput = {
  title: string;
  description: string;
  /** Path only, e.g. "/products/steel-beams". */
  path?: string;
  /** Overrides the generated OG image. */
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
};

/**
 * Sections held back from search until their copy is rewritten.
 *
 * These pages were written for a structural steel supplier. The business sells
 * reinforcing steel, and the rest of the site now says so — which left roughly
 * three dozen pages describing work Epoxa Steel does not do, reachable by
 * search even though nothing on the site links to them any more. A visitor who
 * arrives on one from Google never sees the homepage; they see the wrong
 * company. Worse, a crawler weighing thirty-five structural pages against three
 * reinforcing ones draws the obvious conclusion about what this business is.
 *
 * Held back rather than deleted. The pages still resolve, still render and
 * still work from a direct link, so nothing breaks for anyone holding a URL —
 * they are simply not offered to strangers. Emptying this array puts every one
 * of them back in the index, which is the whole point of it being one list:
 * the rewrite is a content job, and this is the switch it flips.
 *
 * Consumed here and by `app/sitemap.ts`, so the two can never disagree about
 * which pages are public.
 */
export const deferredSections = [
  '/products',
  '/services',
  '/industries',
  '/projects',
  '/blog',
  '/careers',
  '/faq',
] as const;

/** True for a deferred section's landing page and everything beneath it. */
export function isDeferred(path: string): boolean {
  return deferredSections.some((section) => path === section || path.startsWith(`${section}/`));
}

/**
 * Builds a complete Metadata object: canonical URL, Open Graph, Twitter card
 * and robots directives. Every page in the app uses this so no page can
 * silently ship without a canonical or a social preview.
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: SeoInput): Metadata {
  const url = `${BASE}${path === '/' ? '' : path}`;
  const ogImage = image ?? `${BASE}/opengraph-image`;
  const fullTitle = path === '/' ? title : `${title} | ${siteConfig.legalName}`;

  /*
   * The root layout appends " | Epoxa Steel" to every page title through its
   * template. That is right for a five-word page name and wrong for an article
   * headline: "Embodied carbon in structural steel: what the numbers actually
   * mean" plus the suffix comes to 82 characters, and search results show about
   * 60 — so the brand is the part that survives and the point of the article is
   * the part that gets cut.
   *
   * Past the budget the title is declared absolute, keeping the headline whole.
   * The brand is still on the card, the canonical and the schema.
   *
   * The home page is always absolute. Its title is the brand name on its own, and
   * a template would turn that into "Epoxa Steel | Epoxa Steel" the moment this
   * page stopped being a sibling of the layout that defines the template.
   */
  const TITLE_BUDGET = 60;
  const suffixLength = ` | ${siteConfig.legalName}`.length;
  const keepWhole = path === '/' || title.length + suffixLength > TITLE_BUDGET;

  return {
    title: keepWhole ? { absolute: title } : title,
    description,
    /*
     * No `keywords`. Google has ignored the tag since 2009, Bing treats it as a
     * spam signal, and what this site was publishing — twelve terms per page,
     * with "structural steel supplier" appearing twice because the page list and
     * the site-wide list overlapped — is the exact pattern it is a signal for.
     * What a page is about is stated by its title, its description, its headings
     * and its schema, all of which are read.
     */
    alternates: { canonical: url },
    /*
     * Two ways a page stays out of the index, and they ask different things of
     * the crawler.
     *
     * `noIndex` from the caller means the page is not a destination — search
     * results, in practice. Nothing on it is worth following either.
     *
     * A deferred section is not that. The page is real and its links are real;
     * it just describes the wrong business today. `follow: true` so a crawler
     * that lands on one still reaches /quote and /contact through it, and so
     * whatever internal weight these pages carry survives until they are
     * rewritten rather than being thrown away now and rebuilt later.
     */
    robots: noIndex
      ? { index: false, follow: false }
      : isDeferred(path)
        ? { index: false, follow: true }
        : {
            index: true,
            follow: true,
            googleBot: {
              index: true,
              follow: true,
              'max-video-preview': -1,
              'max-image-preview': 'large',
              'max-snippet': -1,
            },
          },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.legalName,
      locale: siteConfig.locale,
      images: [
        { url: ogImage, width: 1200, height: 630, alt: `${title}, ${siteConfig.legalName}` },
      ],
      ...(type === 'article' ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      // Derived from the configured profile rather than written out, so the handle
      // cannot drift from the one the footer links to. Omitted entirely when there
      // is no X account — a card citing a handle nobody owns is worse than a card
      // that cites none.
      ...(xHandle ? { creator: xHandle, site: xHandle } : {}),
    },
  };
}

/* --------------------------------------------------------------------------
   JSON-LD builders
   Rendered through <JsonLd /> so the payloads stay out of component bodies.
   -------------------------------------------------------------------------- */

/**
 * The brand identity node, on every page.
 *
 * Deliberately narrow: who this is, where it lives on the web, what it looks
 * like, and which profiles are the same entity. The postal address, telephone and
 * sales mailbox used to be repeated here as well as in `localBusinessSchema`,
 * which gave a crawler two nodes stating the same facts and no way to tell whether
 * they were one business or two. The physical facts now live in exactly one place.
 *
 * `name` is the prose-case brand, and no `alternateName` is offered. Google picks
 * the site name it displays from the candidates a site supplies — this one, the
 * WebSite node, `og:site_name`, the manifest and the home page title — so every
 * candidate here spells it the same way, and the all-caps wordmark is never
 * among them.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: siteConfig.legalName,
    url: BASE,
    logo: `${BASE}/icon.svg`,
    image: `${BASE}/opengraph-image`,
    description: siteConfig.description,
    foundingDate: siteConfig.founded,
    /*
     * Omitted entirely while there are no social accounts, rather than published
     * as `[]`. An empty array is not "no profiles" to a validator, it is a
     * malformed property — and the whole point of sameAs is to assert that two
     * identities are the same entity, which an empty list cannot do.
     */
    ...(profiles.length ? { sameAs: profiles } : {}),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: siteConfig.legalName,
    description: siteConfig.description,
    publisher: { '@id': `${BASE}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * The physical business: where it is, when it is open, how to reach it.
 *
 * Home page only, and the single place the address and telephone are published as
 * structured data. `organizationSchema` carries the identity; this carries the
 * premises. Same spelling of the name in both, so the two nodes read as one
 * business rather than two with similar details.
 */
export function localBusinessSchema() {
  const { latitude, longitude } = siteConfig.address;

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE}/#localbusiness`,
    name: siteConfig.legalName,
    description: siteConfig.description,
    image: `${BASE}/opengraph-image`,
    url: BASE,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.countryCode,
    },
    /*
     * Only when both coordinates are configured. Publishing a guess would put the
     * pin on a neighbouring building and be believed; without it, a search engine
     * geocodes the postal address above, which is correct by construction.
     */
    ...(latitude !== null && longitude !== null
      ? { geo: { '@type': 'GeoCoordinates', latitude, longitude } }
      : {}),
    // Derived from the same rows the contact page shows — see `openingHours`.
    openingHoursSpecification: openingHours().map(({ days, opens, closes }) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: days,
      opens,
      closes,
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${BASE}${crumb.href === '/' ? '' : crumb.href}`,
    })),
  };
}

export function productSchema(input: {
  name: string;
  description: string;
  path: string;
  category: string;
  grades: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    url: `${BASE}${input.path}`,
    category: input.category,
    brand: { '@type': 'Brand', name: siteConfig.legalName },
    material: input.grades.join(', '),
    manufacturer: { '@id': `${BASE}/#organization` },
    offers: {
      '@type': 'AggregateOffer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'USD',
      seller: { '@id': `${BASE}/#organization` },
      // Steel is quoted per project; the RFQ page is the offer entry point.
      url: `${BASE}/quote`,
    },
  };
}

export function serviceSchema(input: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: input.name,
    description: input.description,
    url: `${BASE}${input.path}`,
    provider: { '@id': `${BASE}/#organization` },
    areaServed: 'Worldwide',
    serviceType: input.name,
  };
}

export function articleSchema(input: {
  title: string;
  description: string;
  path: string;
  published: string;
  updated?: string;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    description: input.description,
    url: `${BASE}${input.path}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}${input.path}` },
    datePublished: input.published,
    dateModified: input.updated ?? input.published,
    author: { '@type': 'Person', name: input.author },
    publisher: { '@id': `${BASE}/#organization` },
    image: input.image ?? `${BASE}/opengraph-image`,
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function jobPostingSchema(input: {
  title: string;
  description: string;
  path: string;
  location: string;
  type: string;
  posted: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: input.title,
    description: input.description,
    url: `${BASE}${input.path}`,
    datePosted: input.posted,
    employmentType: input.type.toUpperCase().replace(/[^A-Z]/g, '_'),
    hiringOrganization: { '@id': `${BASE}/#organization` },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: input.location },
    },
  };
}
