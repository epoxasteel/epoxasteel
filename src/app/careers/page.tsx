import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { jobs, benefits, cultureStatement } from '@/content/careers';
import { siteConfig } from '@/lib/site';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow, SectionHeading } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { JobCard } from '@/components/cards';
import { Card, CardEdgeGlow } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Careers',
  description:
    'Open roles at Epoxa Steel across engineering, fabrication, quality, processing and operations — with certification paid in full and genuine stop-work authority.',
  path: '/careers',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Careers', href: '/careers' },
];

export default function CareersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Careers"
        title="Build something that stays built."
        description="A bridge girder welded this year will still be carrying traffic when the welder's grandchildren drive over it. That perspective changes how a workplace feels."
        trail={trail}
      >
        <Button href="#openings" size="lg" sheen>
          See open roles
          <ArrowRight aria-hidden />
        </Button>
      </PageHero>

      {/* Culture */}
      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal direction="none">
                <Eyebrow>Working here</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-headline text-bright mt-7 font-semibold">
                  {cultureStatement.title}
                </h2>
              </Reveal>
              <div className="mt-8 space-y-6">
                {cultureStatement.body.map((paragraph, index) => (
                  <Reveal key={index} delay={0.12 + index * 0.05}>
                    <p
                      className={cn(
                        'leading-relaxed',
                        index === 0 ? 'text-lead text-mist' : 'text-ash text-[1.0625rem]',
                      )}
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <RevealGroup className="bg-hairline grid gap-px overflow-hidden rounded-lg sm:grid-cols-2">
              {benefits.map((benefit) => (
                <RevealItem key={benefit.title} className="bg-charcoal p-6">
                  <h3 className="font-display text-bright text-[1.0625rem] font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="text-ash mt-2.5 text-[0.875rem] leading-relaxed">{benefit.body}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* Openings */}
      <Section tone="graphite" id="openings" className="border-hairline border-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Open roles"
            title={`${jobs.length} positions open right now.`}
            description="We hire for judgement and train for everything else. If none of these fit but you think you should be here, tell us why."
          />

          <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <RevealItem key={job.slug}>
                <JobCard job={job} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Speculative */}
      <Section tone="void">
        <div className="container-page">
          <Reveal>
            <Card className="group/card p-8 sm:p-12">
              <CardEdgeGlow />
              <div className="max-w-2xl">
                <h2 className="font-display text-headline text-bright font-semibold">
                  Nothing here fits, but you still want in?
                </h2>
                <p className="text-lead text-ash mt-5">
                  We keep speculative applications on file and we do read them. Tell us what you do,
                  what you have built, and what you would want to be doing in three years. Send it
                  to{' '}
                  <a
                    href={`mailto:${siteConfig.contact.careersEmail}`}
                    className="text-arc-glow underline underline-offset-4"
                  >
                    {siteConfig.contact.careersEmail}
                  </a>
                  .
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Button href={`mailto:${siteConfig.contact.careersEmail}`} size="lg" sheen>
                    Send an application
                  </Button>
                  <Button href="/about" size="lg" variant="outline">
                    Learn about us
                  </Button>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
