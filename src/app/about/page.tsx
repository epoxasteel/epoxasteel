import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import {
  mission,
  vision,
  values,
  history,
  leadership,
  certifications,
  manufacturingStandards,
  qualityCommitments,
  safetyCommitment,
  innovation,
  futureGoals,
} from '@/content/company';
import { siteConfig } from '@/lib/site';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow, SectionHeading } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem, MaskedLines } from '@/components/motion/reveal';
import { SmartCounter } from '@/components/motion/counter';
import { Card, CardEdgeGlow } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CallToAction } from '@/components/home/sections';
import { cn, pad } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'About EPOXA STEEL',
  description:
    'Our mission, values, history, leadership and the manufacturing, quality and safety standards behind every tonne of steel we supply.',
  path: '/about',
  keywords: [
    'about epoxa steel',
    'steel company history',
    'steel quality standards',
    'steel leadership team',
  ],
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="About us"
        title="Built by people who have been on the wrong end of a late delivery."
        description={`EPOXA STEEL has supplied structural steel since ${siteConfig.founded}. We started because we had spent years watching good projects lose weeks to suppliers who treated a delivery date as an aspiration.`}
        trail={trail}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/projects" size="lg" sheen>
            See our work
            <ArrowRight aria-hidden />
          </Button>
          <Button href="/careers" size="lg" variant="outline">
            Work with us
          </Button>
        </div>
      </PageHero>

      {/* Mission & vision */}
      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal direction="none">
                <Eyebrow index={1}>Mission</Eyebrow>
              </Reveal>
              <h2 className="font-display text-headline text-bright mt-7 font-semibold">
                <MaskedLines lines={['Turn ambitious drawings', 'into standing buildings.']} />
              </h2>
              <Reveal delay={0.16}>
                <p className="text-lead text-mist mt-7">{mission.statement}</p>
              </Reveal>
              <Reveal delay={0.22}>
                <p className="text-ash mt-5 text-[1.0625rem] leading-relaxed">{mission.body}</p>
              </Reveal>
            </div>

            <div>
              <Reveal direction="none">
                <Eyebrow index={2}>Vision</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-headline text-bright mt-7 font-semibold">
                  The supplier named first when the schedule cannot slip.
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="text-lead text-mist mt-7">{vision.statement}</p>
              </Reveal>
              <Reveal delay={0.22}>
                <p className="text-ash mt-5 text-[1.0625rem] leading-relaxed">{vision.body}</p>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section tone="graphite" className="border-hairline border-y">
        <div className="container-page">
          <SectionHeading
            eyebrow="Values"
            index={3}
            title="Six things we will not trade away."
            description="Every company publishes values. These are the ones we have actually turned down work over."
          />

          <RevealGroup className="bg-hairline mt-16 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => (
              <RevealItem key={value.title} className="group/card bg-graphite relative p-7 sm:p-9">
                <CardEdgeGlow />
                <span className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">
                  {pad(index + 1)}
                </span>
                <h3 className="font-display text-title text-bright mt-5 font-semibold">
                  {value.title}
                </h3>
                <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">{value.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* History timeline */}
      <Section tone="void" id="history">
        <div className="container-page">
          <SectionHeading
            eyebrow="History"
            index={4}
            title="From a leased yard to 34 countries."
            description="Eight moments that changed what we were able to promise clients."
          />

          <ol className="relative mt-16 max-w-4xl">
            <span
              aria-hidden
              className="bg-hairline absolute top-3 bottom-3 left-[4.5rem] hidden w-px sm:block"
            />

            {history.map((entry, index) => (
              <Reveal key={entry.year} delay={index * 0.05} as="li">
                <div className="relative flex flex-col gap-4 pb-10 last:pb-0 sm:flex-row sm:gap-10">
                  <span className="font-display text-metal text-2xl font-semibold sm:w-16 sm:shrink-0 sm:text-right">
                    {entry.year}
                  </span>

                  <span
                    aria-hidden
                    className="bg-arc-bright ring-void relative z-10 mt-2.5 hidden size-2.5 shrink-0 rotate-45 ring-4 sm:block"
                  />

                  <div className="sm:pt-0.5">
                    <h3 className="font-display text-title text-bright font-semibold">
                      {entry.title}
                    </h3>
                    <p className="text-ash mt-2.5 max-w-2xl text-[1.0625rem] leading-relaxed">
                      {entry.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Leadership */}
      <Section tone="graphite" className="border-hairline border-y" id="leadership">
        <div className="container-page">
          <SectionHeading
            eyebrow="Leadership"
            index={5}
            title="The people accountable for what we promise."
            description="Six directors, each with a phone number our clients actually have."
          />

          <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((person) => (
              <RevealItem key={person.name}>
                <Card className="group/card h-full p-7">
                  <CardEdgeGlow />
                  <span
                    aria-hidden
                    className={cn(
                      'border-hairline-strong grid size-14 place-items-center rounded-full border',
                      'bg-linear-to-b from-white/[0.07] to-transparent',
                      'font-display text-metal text-lg font-semibold',
                    )}
                  >
                    {person.initials}
                  </span>
                  <h3 className="font-display text-title text-bright mt-6 font-semibold">
                    {person.name}
                  </h3>
                  <p className="text-arc-glow/80 mt-1.5 text-[0.875rem]">{person.role}</p>
                  <p className="text-ash mt-4 text-[0.9375rem] leading-relaxed">{person.bio}</p>
                  <p className="border-hairline text-steel mt-5 border-t pt-4 text-[0.75rem] tracking-[0.1em] uppercase">
                    {person.focus}
                  </p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Manufacturing standards */}
      <Section tone="void" id="standards">
        <div className="container-page">
          <SectionHeading
            eyebrow="Manufacturing standards"
            index={6}
            title="Six control points between the mill and your site."
            description="Quality is not an inspection at the end. It is six gates, each of which can stop a job."
          />

          <RevealGroup className="bg-hairline mt-16 grid gap-px overflow-hidden rounded-lg lg:grid-cols-2">
            {manufacturingStandards.map((standard, index) => (
              <RevealItem key={standard.title} className="bg-charcoal p-7 sm:p-9">
                <span className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">
                  {pad(index + 1)}
                </span>
                <h3 className="font-display text-title text-bright mt-5 font-semibold">
                  {standard.title}
                </h3>
                <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">{standard.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Quality control */}
      <Section tone="graphite" className="border-hairline border-y" id="quality">
        <div className="container-page">
          <SectionHeading
            eyebrow="Quality control"
            index={7}
            title="If we cannot prove it, we do not claim it."
          />

          <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {qualityCommitments.map((item) => (
              <RevealItem key={item.title}>
                <Card className="group/card h-full p-7">
                  <CardEdgeGlow />
                  <p className="font-display text-metal text-2xl font-semibold">{item.metric}</p>
                  <p className="text-steel mt-1 text-[0.6875rem] tracking-[0.14em] uppercase">
                    {item.metricLabel}
                  </p>
                  <h3 className="font-display text-bright mt-6 text-[1.0625rem] font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-ash mt-2.5 text-[0.9375rem] leading-relaxed">{item.body}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>

          <RevealGroup className="bg-hairline mt-6 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((certification) => (
              <RevealItem key={certification.code} className="bg-graphite p-6">
                <p className="font-display text-bright text-[1.0625rem] font-semibold">
                  {certification.code}
                </p>
                <p className="text-arc-glow/80 mt-1 text-[0.8125rem]">{certification.name}</p>
                <p className="text-steel mt-3 text-[0.8125rem] leading-relaxed">
                  {certification.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Safety */}
      <Section tone="void" id="safety">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
            <div>
              <Reveal direction="none">
                <Eyebrow index={8}>Safety</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-headline text-bright mt-7 font-semibold">
                  {safetyCommitment.title}
                </h2>
              </Reveal>
              <div className="mt-8 space-y-6">
                {safetyCommitment.body.map((paragraph, index) => (
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

            <Reveal direction="left">
              <dl className="bg-hairline grid gap-px overflow-hidden rounded-lg">
                {safetyCommitment.metrics.map((metric) => (
                  <div key={metric.label} className="bg-charcoal p-7">
                    <dd className="font-display text-metal text-3xl font-semibold">
                      <SmartCounter display={metric.value} />
                    </dd>
                    <dt className="text-chalk mt-2 text-[0.9375rem]">{metric.label}</dt>
                    <p className="text-steel mt-1 text-[0.8125rem]">{metric.hint}</p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Innovation */}
      <Section tone="graphite" className="border-hairline border-y" id="innovation">
        <div className="container-page">
          <SectionHeading
            eyebrow="Innovation"
            index={9}
            title={innovation.title}
            description={innovation.body.join(' ')}
          />

          <RevealGroup className="bg-hairline mt-16 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2">
            {innovation.initiatives.map((initiative, index) => (
              <RevealItem key={initiative.title} className="bg-graphite p-7 sm:p-9">
                <span className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">
                  {pad(index + 1)}
                </span>
                <h3 className="font-display text-title text-bright mt-5 font-semibold">
                  {initiative.title}
                </h3>
                <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">{initiative.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Future goals */}
      <Section tone="void" id="future">
        <div className="container-page">
          <SectionHeading
            eyebrow="Where we are going"
            index={10}
            title="Four commitments for the next five years."
            description="Published so you can hold us to them."
          />

          <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2">
            {futureGoals.map((goal) => (
              <RevealItem key={goal.title}>
                <Card className="group/card h-full p-7 sm:p-9">
                  <CardEdgeGlow />
                  <h3 className="font-display text-title text-bright font-semibold">
                    {goal.title}
                  </h3>
                  <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">{goal.body}</p>
                </Card>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CallToAction
        title="Come and audit us."
        description="Client audits are welcome by arrangement, and we will make quality records, welding qualifications and traceability systems available for inspection. Several framework clients audit us annually."
        primary={{ label: 'Arrange a visit', href: '/contact' }}
        secondary={{ label: 'Request a Quote', href: '/quote' }}
      />
    </>
  );
}
