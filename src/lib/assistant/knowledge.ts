import { products } from '@/content/products';
import { services } from '@/content/services';
import { industries } from '@/content/industries';
import { faqs } from '@/content/faqs';
import { certifications, mission } from '@/content/company';
import { siteConfig } from '@/lib/site';

/**
 * The knowledge the assistant is allowed to speak from.
 *
 * A steel supplier's assistant that invents a grade, a tolerance or a lead time
 * is worse than no assistant at all — a contractor could price work on it. So
 * the model is not asked to remember anything about EPOXA STEEL. Every fact it
 * can state is compiled here, from the same typed content modules the pages
 * render, and handed to it with each request.
 *
 * That has a second benefit: when someone edits `content/products.ts`, the
 * assistant's knowledge changes in the same commit. There is no second copy to
 * drift.
 *
 * Built once per process — the content is static, so there is no reason to
 * rebuild this string on every message.
 */

function productDigest() {
  return products
    .map((product) => {
      const lines = [
        `### ${product.name}  (/products/${product.slug})`,
        `Category: ${product.category}`,
        product.summary,
        `Grades: ${product.grades.join(', ')}`,
        `Standards: ${product.standards.join(', ')}`,
        `Finishes: ${product.finishes.join(', ')}`,
        `Typical applications: ${product.applications.join('; ')}`,
        `Serves industries: ${product.industries.join(', ')}`,
        ...product.keyFacts.map((fact) => `${fact.label}: ${fact.value}`),
      ];

      // The dimension table is the part buyers actually ask about, so include
      // the real rows rather than a summary of them.
      if (product.dimensions.rows.length) {
        lines.push(
          `${product.dimensions.title}, ${product.dimensions.columns.join(' | ')}`,
          ...product.dimensions.rows.map((row) => row.join(' | ')),
        );
      }

      if (product.downloads.length) {
        lines.push(
          `Downloads: ${product.downloads.map((d) => `${d.label} (${d.format}, ${d.href})`).join('; ')}`,
        );
      }

      return lines.join('\n');
    })
    .join('\n\n');
}

function serviceDigest() {
  return services
    .map((service) => `### ${service.name}  (/services/${service.slug})\n${service.summary}`)
    .join('\n\n');
}

function industryDigest() {
  return industries
    .map((industry) => `- ${industry.name} (/industries/${industry.slug}): ${industry.summary}`)
    .join('\n');
}

function faqDigest() {
  return faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
}

function companyDigest() {
  const { contact, address, founded, stats } = siteConfig;

  return [
    `${siteConfig.legalName}. Founded ${founded}.`,
    mission.statement,
    '',
    'Verified figures (use these exact numbers, do not estimate others):',
    ...stats.map(
      (stat) =>
        `- ${stat.label}: ${'display' in stat ? stat.display : `${stat.value.toLocaleString('en-US')}${stat.suffix}`} (${stat.hint})`,
    ),
    '',
    `Certifications: ${certifications.map((c) => `${c.code} (${c.name})`).join(', ')}`,
    '',
    'Contact:',
    `- Phone: ${contact.phone}`,
    `- Email: ${contact.email}`,
    `- Sales email: ${contact.salesEmail}`,
    `- Address: ${address.line1}, ${address.line2}, ${address.city}, ${address.region} ${address.postalCode}, ${address.country}`,
    `- Opening hours: ${contact.hours.map((h) => `${h.days} ${h.time}`).join('; ')}`,
    '',
    'Key pages: /products, /industries, /services, /projects, /about, /quote, /contact, /faq, /careers, /blog',
  ].join('\n');
}

let cached: string | null = null;

export function knowledgeBase() {
  if (cached) return cached;

  cached = [
    '## COMPANY',
    companyDigest(),
    '',
    '## PRODUCTS',
    productDigest(),
    '',
    '## SERVICES',
    serviceDigest(),
    '',
    '## INDUSTRIES SERVED',
    industryDigest(),
    '',
    '## FREQUENTLY ASKED QUESTIONS',
    faqDigest(),
  ].join('\n');

  return cached;
}
