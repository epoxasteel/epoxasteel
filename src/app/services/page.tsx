import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { services } from '@/content/services';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ServiceCard } from '@/components/cards';
import { CallToAction } from '@/components/home/sections';
import { Button } from '@/components/ui/button';
import { pad } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Services',
  description:
    'Steel supply, fabrication, cutting, engineering support, logistics and delivery — from one accountable supplier, under one certificate.',
  path: '/services',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
];

const process = [
  {
    title: 'Enquiry',
    body: 'Send drawings, a bill of quantities or a list. We check availability against real stock and flag anything worth reconsidering.',
  },
  {
    title: 'Quotation',
    body: 'Line by line within 48 hours for standard enquiries — grade, size, quantity, processing and delivery all priced separately.',
  },
  {
    title: 'Order',
    body: 'Written confirmation of every line, committed dates and a named account manager. Material is allocated to you at this point.',
  },
  {
    title: 'Production',
    body: 'Cutting, fabrication and finishing under one quality system, with progress visible and inspection at every release gate.',
  },
  {
    title: 'Delivery',
    body: 'Sequenced to your erection programme, timed to your window, evidenced with photographs and a signed delivery note.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Services"
        title="Everything between the mill and your crane hook."
        description="Splitting a steel package across several suppliers splits accountability with it. We do supply, processing, fabrication, finishing and delivery ourselves — so when something needs resolving, there is nobody to point at."
        trail={trail}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/quote" size="lg" sheen>
            Request a Quote
            <ArrowRight aria-hidden />
          </Button>
          <Button href="/contact" size="lg" variant="outline">
            Discuss a project
          </Button>
        </div>
      </PageHero>

      <Section tone="void">
        <div className="container-page">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <RevealItem key={service.slug}>
                <ServiceCard service={service} index={index} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* How we work */}
      <Section tone="graphite" className="border-hairline border-y">
        <div className="container-page">
          <Reveal direction="none">
            <Eyebrow>How we work</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display text-headline text-bright mt-6 max-w-3xl font-semibold">
              Five steps, and you know where your order is at every one of them.
            </h2>
          </Reveal>

          <ol className="bg-hairline mt-14 grid gap-px overflow-hidden rounded-lg lg:grid-cols-5">
            {process.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.07} as="li">
                <div className="bg-graphite h-full p-7">
                  <span className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">
                    {pad(index + 1)}
                  </span>
                  <h3 className="font-display text-bright mt-5 text-[1.0625rem] font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-ash mt-3 text-[0.875rem] leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      <CallToAction
        title="One supplier. One certificate. One phone call."
        description="Tell us the scope — material only, fabricated package, or something in between — and we will scope it honestly, including the parts we would not recommend."
      />
    </>
  );
}
