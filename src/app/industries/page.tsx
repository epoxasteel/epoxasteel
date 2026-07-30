import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { industries } from '@/content/industries';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd } from '@/components/layout/section';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { IndustryCard } from '@/components/cards';
import { CallToAction } from '@/components/home/sections';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = buildMetadata({
  title: 'Industries We Serve',
  description:
    'Structural steel supply for commercial, residential, industrial and infrastructure work — bridges, warehousing, energy and government projects.',
  path: '/industries',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Industries', href: '/industries' },
];

export default function IndustriesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Industries"
        title="Twelve sectors, each with its own definition of 'on time'."
        description="A distribution centre measures success in weeks to operation. A bridge measures it in decades of service. We have learned what each sector actually needs from a steel supplier — usually while standing on somebody's critical path."
        trail={trail}
      >
        <Button href="/quote" size="lg" sheen>
          Discuss your sector
          <ArrowRight aria-hidden />
        </Button>
      </PageHero>

      <Section tone="void">
        <div className="container-page">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <RevealItem key={industry.slug}>
                <IndustryCard industry={industry} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CallToAction
        title="Whichever sector you build in, the standard is the same."
        description="Certified material, complete documentation, and delivery dates we hold. Tell us what you are building and we will tell you exactly what we can commit to."
      />
    </>
  );
}
