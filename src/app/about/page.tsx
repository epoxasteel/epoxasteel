import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { Button } from '@/components/ui/button';
import { CallToAction } from '@/components/home/sections';

/**
 * About.
 *
 * Deliberately short. This page used to run to four hundred lines: a mission, a
 * vision, six values, an eight-entry history timeline, six named directors with
 * biographies, manufacturing standards, quality commitments, a safety statement,
 * an innovation section and a list of future goals. None of it had happened.
 *
 * A page that long is a claim about the size of the company making it, and a
 * visitor who checks any one line of it and finds nothing behind it stops
 * believing the rest. What is here now is what is true: what the business
 * supplies, how it works, and how to reach it. It can grow as there is something
 * real to add.
 */

export const metadata: Metadata = buildMetadata({
  title: 'About',
  description: `${siteConfig.legalName} supplies reinforcing steel, cut, bent and delivered to schedule for commercial, industrial and infrastructure projects.`,
  path: '/about',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
];

/** Three plain statements. No figures, because there are none to publish yet. */
const principles = [
  {
    title: 'Trust',
    body: 'You get the same answer from us twice. If a date is tight we say so before you order, not after. A schedule you can plan around is worth more than a promise that sounds better.',
  },
  {
    title: 'Quality',
    body: 'Reinforcing steel arrives cut and bent to your schedule, with mill certification traceable to the heat it came from. If we cannot document it, we do not claim it.',
  },
  {
    title: 'Service',
    body: 'One person who knows your job, reachable by phone. No routing menus, no ticket queue, and no waiting until Monday to find out where your steel is.',
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="About us"
        title="Reinforcing steel, supplied properly."
        description={`${siteConfig.legalName} supplies reinforcing steel to commercial, industrial and infrastructure projects, cut and bent to schedule, certified, and delivered in the order you need to place it.`}
        trail={trail}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/quote" size="lg" sheen>
            Request a Quote
          </Button>
          <Button href="/contact" size="lg" variant="outline">
            Contact
          </Button>
        </div>
      </PageHero>

      <Section tone="void">
        <div className="container-page">
          {/* Three columns at the top end, stacked below it. Short enough that it
              needs no heading above it, the page title already said what this is. */}
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} delay={index * 0.08}>
                <h2 className="font-display text-title text-bright font-semibold">
                  {principle.title}
                </h2>
                <p className="text-ash measure mt-4 text-[1.0625rem] leading-relaxed">
                  {principle.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
