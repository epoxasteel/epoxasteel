import type { Metadata } from 'next';
import { siteConfig } from './site';

const BASE = siteConfig.url;

type SeoInput = {
  title: string;
  description: string;
  /** Path only, e.g. "/products/steel-beams". */
  path?: string;
  keywords?: string[];
  /** Overrides the generated OG image. */
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
};

/**
 * Builds a complete Metadata object: canonical URL, Open Graph, Twitter card
 * and robots directives. Every page in the app uses this so no page can
 * silently ship without a canonical or a social preview.
 */
export function buildMetadata({
  title,
  description,
  path = '/',
  keywords = [],
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: SeoInput): Metadata {
  const url = `${BASE}${path === '/' ? '' : path}`;
  const ogImage = image ?? `${BASE}/opengraph-image`;
  const fullTitle = path === '/' ? title : `${title} | ${siteConfig.name}`;

  /*
   * The root layout appends " | EPOXA STEEL" to every page title through its
   * template. That is right for a five-word page name and wrong for an article
   * headline: "Embodied carbon in structural steel: what the numbers actually
   * mean" plus the suffix comes to 82 characters, and search results show about
   * 60 — so the brand is the part that survives and the point of the article is
   * the part that gets cut.
   *
   * Past the budget the title is declared absolute, keeping the headline whole.
   * The brand is still on the card, the canonical and the schema.
   */
  const TITLE_BUDGET = 60;
  const suffixLength = ` | ${siteConfig.name}`.length;

  return {
    title: path !== '/' && title.length + suffixLength > TITLE_BUDGET ? { absolute: title } : title,
    description,
    keywords: [...defaultKeywords, ...keywords],
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
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
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${title} — ${siteConfig.name}` }],
      ...(type === 'article' ? { publishedTime, modifiedTime, authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@epoxasteel',
      site: '@epoxasteel',
    },
  };
}

export const defaultKeywords = [
  'structural steel supplier',
  'steel beams',
  'steel fabrication',
  'reinforcing steel',
  'steel plates',
  'construction steel',
  'Epoxa Steel',
];

/* --------------------------------------------------------------------------
   JSON-LD builders
   Rendered through <JsonLd /> so the payloads stay out of component bodies.
   -------------------------------------------------------------------------- */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: BASE,
    logo: `${BASE}/icon.svg`,
    image: `${BASE}/opengraph-image`,
    description: siteConfig.description,
    foundingDate: siteConfig.founded,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.countryCode,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.contact.phone,
        contactType: 'sales',
        email: siteConfig.contact.salesEmail,
        availableLanguage: ['English'],
        areaServed: 'Worldwide',
      },
    ],
    sameAs: Object.values(siteConfig.social),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: siteConfig.name,
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

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE}/#localbusiness`,
    name: siteConfig.name,
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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.address.latitude,
      longitude: siteConfig.address.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '08:00',
        closes: '14:00',
      },
    ],
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
    brand: { '@type': 'Brand', name: siteConfig.name },
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
