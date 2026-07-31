import type { Metadata } from 'next';
import { faqs, faqCategories, getFaqsByCategory } from '@/content/faqs';
import { buildMetadata, breadcrumbSchema, faqSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { FaqAccordion } from '@/components/faq-accordion';
import { CallToAction } from '@/components/home/sections';
import { cn } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Frequently Asked Questions',
  description:
    'Answers on ordering, products, delivery, certification, payment terms and technical support from EPOXA STEEL.',
  path: '/faq',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'FAQ', href: '/faq' },
];

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          faqSchema(faqs.map(({ question, answer }) => ({ question, answer }))),
        ]}
      />

      <PageHero
        eyebrow="FAQ"
        title="The questions we are asked most."
        description="Ordering, delivery, certification, payment and technical support. If your question is not here, our team answers enquiries within one business day, and we would rather you asked than guessed."
        trail={trail}
      />

      {/* Category jump bar */}
      <div className="border-hairline bg-void/90 sticky top-(--header-h) z-30 border-b backdrop-blur-xl">
        <div className="container-page">
          <nav aria-label="FAQ categories" className="-mx-1 overflow-x-auto">
            <ul className="flex min-w-max gap-1 py-3">
              {faqCategories.map((category) => (
                <li key={category}>
                  <a
                    href={`#${category.toLowerCase()}`}
                    className={cn(
                      'text-mist inline-block rounded-sm px-3.5 py-2 text-[0.8125rem]',
                      'hover:text-bright transition-colors duration-250 hover:bg-white/[0.04]',
                    )}
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {faqCategories.map((category, index) => {
        const items = getFaqsByCategory(category);
        if (items.length === 0) return null;

        return (
          <Section
            key={category}
            id={category.toLowerCase()}
            tone={index % 2 === 0 ? 'void' : 'graphite'}
            className={index % 2 === 1 ? 'border-hairline border-y' : ''}
            size="sm"
          >
            <div className="container-page">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
                <div className="lg:sticky lg:top-32 lg:self-start">
                  <Reveal direction="none">
                    <Eyebrow as="h2">{category}</Eyebrow>
                  </Reveal>
                  <Reveal delay={0.06}>
                    <p className="text-ash mt-5 text-[0.9375rem] leading-relaxed">
                      {items.length} question{items.length === 1 ? '' : 's'}
                    </p>
                  </Reveal>
                </div>

                <Reveal delay={0.08}>
                  <FaqAccordion items={items} />
                </Reveal>
              </div>
            </div>
          </Section>
        );
      })}

      <CallToAction
        title="Still have a question?"
        description="Technical or commercial, we answer within one business day, and if a query needs eyes on it rather than an email thread, an engineer attends site, usually within 48 hours."
        primary={{ label: 'Ask our team', href: '/contact' }}
        secondary={{ label: 'Request a Quote', href: '/quote' }}
      />
    </>
  );
}
