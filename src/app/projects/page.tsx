import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { projects } from '@/content/projects';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ProjectCard } from '@/components/cards';
import { SmartCounter } from '@/components/motion/counter';
import { CallToAction } from '@/components/home/sections';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/misc';

export const metadata: Metadata = buildMetadata({
  title: 'Projects',
  description:
    'Structural steel case studies: commercial towers, fracture-critical bridges, distribution centres, transit hubs, energy terminals and civic buildings.',
  path: '/projects',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Projects', href: '/projects' },
];

const headline = [
  { value: '2,600+', label: 'Projects delivered' },
  { value: '1.4M+', label: 'Tonnes supplied' },
  { value: '34', label: 'Countries' },
  { value: '99.4%', label: 'On-time delivery' },
];

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Projects"
        title="Work where the margin for error was zero."
        description="Fracture-critical bridge welds. A roof erected above live platforms serving 140,000 passengers a day. A grid connection that could not slip. These are the projects that tell you what a supplier is actually made of."
        trail={trail}
      >
        <Button href="/quote" size="lg" sheen>
          Start your project
          <ArrowRight aria-hidden />
        </Button>
      </PageHero>

      <Section tone="void" size="sm">
        <div className="container-page">
          <RevealGroup className="bg-hairline grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-4">
            {headline.map((stat) => (
              <RevealItem key={stat.label} className="bg-charcoal p-7">
                <p className="font-display text-metal text-3xl font-semibold">
                  <SmartCounter display={stat.value} />
                </p>
                <p className="text-steel mt-2 text-[0.8125rem] tracking-[0.1em] uppercase">
                  {stat.label}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section tone="void" size="sm">
        <div className="container-page">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <RevealItem key={project.slug}>
                <ProjectCard project={project} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <Section tone="graphite" size="sm" className="border-hairline border-t">
        <div className="container-page">
          <Reveal>
            <Eyebrow>A note on this page</Eyebrow>
            <Alert
              tone="info"
              title="Case studies pending client approval"
              className="mt-6 max-w-3xl"
            >
              The case studies above are illustrative examples showing the level of detail we
              publish. Real projects are added once the client has approved naming and figures in
              writing — we do not publish a client&rsquo;s project without their permission, and we
              would not want a supplier publishing yours.
            </Alert>
          </Reveal>
        </div>
      </Section>

      <CallToAction
        title="Your project could be the next one here."
        description="Send us the drawings and the programme. We will tell you what we can commit to — and if the schedule is not achievable, we will say so before you rely on it."
      />
    </>
  );
}
