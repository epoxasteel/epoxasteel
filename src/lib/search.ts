import { products } from '@/content/products';
import { industries } from '@/content/industries';
import { services } from '@/content/services';
import { projects } from '@/content/projects';
import { posts } from '@/content/posts';
import { faqs } from '@/content/faqs';
import { jobs } from '@/content/careers';
import { markdownToText } from '@/lib/markdown';

export type SearchType =
  'Product' | 'Industry' | 'Service' | 'Project' | 'Article' | 'FAQ' | 'Career' | 'Page';

export type SearchDocument = {
  id: string;
  type: SearchType;
  title: string;
  description: string;
  href: string;
  /** Lower-cased haystack; never rendered. */
  haystack: string;
  /** Nudges more important document types up the ranking. */
  weight: number;
};

const staticPages: { title: string; description: string; href: string; keywords: string }[] = [
  {
    title: 'About EPOXA STEEL',
    description: 'Our mission, history, leadership, standards and the way we work.',
    href: '/about',
    keywords: 'company history mission vision values leadership team safety innovation quality',
  },
  {
    title: 'Request a Quote',
    description: 'Send a full enquiry and receive a line-by-line quotation within 48 hours.',
    href: '/quote',
    keywords: 'quotation rfq enquiry pricing estimate request tender',
  },
  {
    title: 'Contact',
    description: 'Office details, business hours, direct lines and our enquiry form.',
    href: '/contact',
    keywords: 'contact phone email address office hours location map whatsapp',
  },
  {
    title: 'Careers',
    description: 'Open roles across engineering, fabrication, quality and operations.',
    href: '/careers',
    keywords: 'jobs careers hiring vacancies employment apprenticeship',
  },
  {
    title: 'FAQ',
    description: 'Answers on ordering, delivery, certification, payment and technical support.',
    href: '/faq',
    keywords: 'questions answers help support ordering delivery certification payment',
  },
  {
    title: 'Privacy Policy',
    description: 'How we collect, use and protect personal information.',
    href: '/privacy',
    keywords: 'privacy data protection gdpr cookies personal information',
  },
  {
    title: 'Terms & Conditions',
    description: 'The terms governing use of this website and our supply of goods and services.',
    href: '/terms',
    keywords: 'terms conditions legal supply contract liability',
  },
];

/**
 * The index is built once at module load. The whole catalogue is a few hundred
 * kilobytes of text, so a linear scan is comfortably fast and avoids shipping a
 * search library — but the shape here maps cleanly onto Typesense or Algolia if
 * the catalogue grows an order of magnitude.
 */
export const searchIndex: SearchDocument[] = [
  ...products.map((product) => ({
    id: `product-${product.slug}`,
    type: 'Product' as const,
    title: product.name,
    description: product.summary,
    href: `/products/${product.slug}`,
    weight: 3,
    haystack: [
      product.name,
      product.category,
      product.tagline,
      product.summary,
      product.overview.join(' '),
      product.grades.join(' '),
      product.standards.join(' '),
      product.finishes.join(' '),
      product.applications.join(' '),
      product.keyFacts.map((fact) => `${fact.label} ${fact.value}`).join(' '),
    ]
      .join(' ')
      .toLowerCase(),
  })),

  ...industries.map((industry) => ({
    id: `industry-${industry.slug}`,
    type: 'Industry' as const,
    title: industry.name,
    description: industry.summary,
    href: `/industries/${industry.slug}`,
    weight: 2,
    haystack: [
      industry.name,
      industry.tagline,
      industry.summary,
      industry.overview.join(' '),
      industry.challenges.map((c) => `${c.title} ${c.body}`).join(' '),
    ]
      .join(' ')
      .toLowerCase(),
  })),

  ...services.map((service) => ({
    id: `service-${service.slug}`,
    type: 'Service' as const,
    title: service.name,
    description: service.summary,
    href: `/services/${service.slug}`,
    weight: 2.5,
    haystack: [
      service.name,
      service.tagline,
      service.summary,
      service.overview.join(' '),
      service.capabilities.join(' '),
      service.deliverables.join(' '),
      service.process.map((step) => `${step.title} ${step.body}`).join(' '),
    ]
      .join(' ')
      .toLowerCase(),
  })),

  ...projects.map((project) => ({
    id: `project-${project.slug}`,
    type: 'Project' as const,
    title: project.name,
    description: project.summary,
    href: `/projects/${project.slug}`,
    weight: 2,
    haystack: [
      project.name,
      project.client,
      project.location,
      project.country,
      project.industry,
      project.summary,
      project.overview.join(' '),
      project.challenge,
      project.solution,
      project.outcome,
    ]
      .join(' ')
      .toLowerCase(),
  })),

  ...posts.map((post) => ({
    id: `post-${post.slug}`,
    type: 'Article' as const,
    title: post.title,
    description: post.excerpt,
    href: `/blog/${post.slug}`,
    weight: 1.5,
    haystack: [
      post.title,
      post.category,
      post.excerpt,
      post.tags.join(' '),
      post.author.name,
      markdownToText(post.body),
    ]
      .join(' ')
      .toLowerCase(),
  })),

  ...faqs.map((faq, index) => ({
    id: `faq-${index}`,
    type: 'FAQ' as const,
    title: faq.question,
    description: faq.answer,
    href: `/faq#${faq.category.toLowerCase()}`,
    weight: 1,
    haystack: `${faq.question} ${faq.answer} ${faq.category}`.toLowerCase(),
  })),

  ...jobs.map((job) => ({
    id: `job-${job.slug}`,
    type: 'Career' as const,
    title: job.title,
    description: job.summary,
    href: `/careers/${job.slug}`,
    weight: 1,
    haystack: [
      job.title,
      job.department,
      job.location,
      job.type,
      job.summary,
      job.responsibilities.join(' '),
      job.requirements.join(' '),
    ]
      .join(' ')
      .toLowerCase(),
  })),

  ...staticPages.map((page) => ({
    id: `page-${page.href}`,
    type: 'Page' as const,
    title: page.title,
    description: page.description,
    href: page.href,
    weight: 1.2,
    haystack: `${page.title} ${page.description} ${page.keywords}`.toLowerCase(),
  })),
];

export type SearchResult = SearchDocument & { score: number };

/**
 * Scores documents on term coverage rather than raw frequency, so a page that
 * mentions every word of the query once outranks one that repeats a single word
 * a dozen times. Title and description matches are weighted heavily.
 */
export function search(query: string, limit = 20): SearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];

  const terms = normalized.split(/\s+/).filter((term) => term.length > 1);
  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const doc of searchIndex) {
    const title = doc.title.toLowerCase();
    const description = doc.description.toLowerCase();

    let score = 0;
    let matchedTerms = 0;

    for (const term of terms) {
      let termScore = 0;

      if (title === normalized) termScore += 200;
      if (title.startsWith(term)) termScore += 60;
      if (title.includes(term)) termScore += 40;
      if (description.includes(term)) termScore += 14;

      if (doc.haystack.includes(term)) {
        termScore += 6;
        // Diminishing returns on repetition — cap the frequency contribution.
        const occurrences = doc.haystack.split(term).length - 1;
        termScore += Math.min(occurrences, 8) * 0.75;
      }

      if (termScore > 0) matchedTerms += 1;
      score += termScore;
    }

    // Require every term to appear somewhere for multi-word queries.
    if (matchedTerms < terms.length) continue;
    if (score === 0) continue;

    // Exact phrase match is a strong signal.
    if (terms.length > 1 && doc.haystack.includes(normalized)) score += 50;

    results.push({ ...doc, score: score * doc.weight });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** Groups results by type for the results page and the command dialog. */
export function groupResults(results: SearchResult[]) {
  const order: SearchType[] = [
    'Product',
    'Service',
    'Industry',
    'Project',
    'Article',
    'Page',
    'FAQ',
    'Career',
  ];

  const groups = new Map<SearchType, SearchResult[]>();
  for (const result of results) {
    const bucket = groups.get(result.type) ?? [];
    bucket.push(result);
    groups.set(result.type, bucket);
  }

  return order
    .filter((type) => groups.has(type))
    .map((type) => ({ type, results: groups.get(type)! }));
}
