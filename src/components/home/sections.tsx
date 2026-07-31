import Link from 'next/link';
import { ArrowRight, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { certifications, qualityCommitments, whyChooseUs, mission } from '@/content/company';
import { Section, SectionHeading, Eyebrow, ArrowLink } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem, MaskedLines } from '@/components/motion/reveal';
import { SmartCounter } from '@/components/motion/counter';
import { Button } from '@/components/ui/button';
import { Card, CardEdgeGlow } from '@/components/ui/card';
import { Parallax } from '@/components/motion/parallax';
import { cn, pad } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Company introduction                                                       */
/* -------------------------------------------------------------------------- */

export function Introduction() {
  return (
    <Section id="introduction" tone="void" className="overflow-hidden">
      <div className="container-page">
        <Reveal direction="none">
          <Eyebrow>Who we are</Eyebrow>
        </Reveal>

        {/*
          The thesis runs the full measure rather than sitting in a half-width
          column. At display scale "Steel is a commodity" needs roughly 660px and
          the column gave it 560, so it broke after "a", the site's own argument,
          in three ragged lines. Full width it sets as the two lines it was
          written as, and what follows reads in a cleaner order: label, claim,
          then the evidence for it.
        */}
        <h2 className="font-display text-display text-bright mt-7 max-w-4xl font-semibold">
          <MaskedLines lines={['Steel is a commodity', 'until it is late.']} />
        </h2>

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-start lg:gap-24">
          <div>
            <Reveal delay={0.18}>
              <p className="text-lead text-mist">{mission.body}</p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="text-ash mt-6 text-[1.0625rem] leading-relaxed">
                We have supplied {siteConfig.stats[0].value.toLocaleString('en-US')} tonnes across
                34 countries since {siteConfig.founded}, from single lengths delivered the same
                afternoon to multi-year framework packages for public infrastructure. The difference
                between those two jobs is scale. The standard is the same.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button href="/about" variant="outline">
                  Our story
                  <ArrowRight aria-hidden />
                </Button>
                <Button href="/projects" variant="ghost">
                  See our work
                </Button>
              </div>
            </Reveal>
          </div>

          <Parallax strength={34} className="relative">
            <RevealGroup
              className="bg-hairline grid grid-cols-2 gap-px overflow-hidden rounded-lg"
              stagger={0.09}
            >
              {siteConfig.stats.map((stat) => (
                <RevealItem key={stat.label} className="bg-charcoal relative p-7 sm:p-9">
                  <div className="bg-grid-fine absolute inset-0 opacity-40" aria-hidden />
                  <div className="relative">
                    <p className="font-display text-metal text-[clamp(1.9rem,1.2rem+2.2vw,3rem)] leading-none font-semibold">
                      <SmartCounter
                        display={
                          'display' in stat
                            ? stat.display
                            : `${stat.value.toLocaleString('en-US')}${stat.suffix}`
                        }
                      />
                    </p>
                    <p className="text-chalk mt-4 text-[0.9375rem] font-medium">{stat.label}</p>
                    <p className="text-steel mt-1 text-[0.8125rem]">{stat.hint}</p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.3}>
              <div className="border-hairline bg-graphite mt-px flex flex-wrap items-center gap-x-6 gap-y-3 rounded-b-lg border-x border-b px-7 py-5">
                <ShieldCheck aria-hidden className="text-arc-glow size-4" />
                <p className="text-ash text-[0.8125rem]">
                  ISO 9001 · ISO 14001 · ISO 45001 · EN 1090 · EN ISO 3834-2 · AISC Certified
                </p>
              </div>
            </Reveal>
          </Parallax>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Why choose us                                                              */
/* -------------------------------------------------------------------------- */

export function WhyChooseUs() {
  return (
    <Section tone="graphite" className="border-hairline border-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why EPOXA STEEL"
          title="Six reasons contractors keep coming back."
          description="Repeat business has not fallen below 78% of revenue in eleven years. These are the reasons clients give when we ask them why."
        />

        <RevealGroup className="bg-hairline mt-16 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.map((reason, index) => (
            <RevealItem key={reason.title} className="group/card bg-graphite relative p-7 sm:p-9">
              <CardEdgeGlow />
              <span className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">
                {pad(index + 1)}
              </span>
              {/* Two lines of headroom so a title that wraps does not push its
                  own body copy out of line with its neighbours', three cards
                  sit side by side and the ragged baselines were the first thing
                  the eye caught. */}
              <h3 className="font-display text-title text-bright mt-5 font-semibold lg:min-h-[2.48em]">
                {reason.title}
              </h3>
              <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">{reason.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Quality commitment                                                         */
/* -------------------------------------------------------------------------- */

export function QualityCommitment() {
  return (
    <Section tone="void">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal direction="none">
              <Eyebrow>Quality commitment</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="font-display text-headline text-bright mt-7 font-semibold">
                If we cannot prove it, we do not claim it.
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-lead text-ash mt-6">
                Quality in steel is not a promise made at tender. It is a chain of records, heat
                number to piece mark, procedure to welder, blast profile to film thickness. That
                either exists or does not when an inspector asks for it.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9">
                <ArrowLink href="/about#quality">How we control quality</ArrowLink>
              </div>
            </Reveal>
          </div>

          <RevealGroup className="grid gap-5 sm:grid-cols-2">
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
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Certifications                                                             */
/* -------------------------------------------------------------------------- */

export function Certifications() {
  return (
    <Section tone="graphite" size="sm" className="border-hairline border-y">
      <div className="container-page">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          <Reveal className="shrink-0 lg:max-w-xs">
            <Eyebrow>Accreditation</Eyebrow>
            <h2 className="font-display text-title text-bright mt-5 font-semibold">
              Independently audited, continuously.
            </h2>
            <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">
              Certificates and audit reports are available to clients on request, including the
              findings, not just the badge.
            </p>
          </Reveal>

          <RevealGroup
            className="bg-hairline grid flex-1 gap-px overflow-hidden rounded-md sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.06}
          >
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
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Call to action                                                             */
/* -------------------------------------------------------------------------- */

export function CallToAction({
  title = 'Tell us what you are building.',
  description = 'Send drawings, a bill of quantities or a simple list of sizes. We will come back with a line-by-line quotation, real lead times and anything worth flagging before you commit.',
  primary = { label: 'Request a Quote', href: '/quote' },
  secondary = { label: 'Talk to our team', href: '/contact' },
}: {
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="border-hairline bg-graphite relative overflow-hidden border-y">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(62% 70% at 50% 110%, rgba(28,98,174,0.22) 0%, transparent 68%)',
        }}
        aria-hidden
      />
      <div
        className="via-arc/50 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
        aria-hidden
      />

      <div className="container-page relative py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal direction="none">
            <Eyebrow className="justify-center">Next step</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="font-display text-display text-bright mt-7 font-semibold">{title}</h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-lead text-ash mx-auto mt-6 max-w-2xl">{description}</p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
              <Button href={primary.href} size="lg" sheen>
                {primary.label}
                <ArrowRight aria-hidden />
              </Button>
              <Button href={secondary.href} size="lg" variant="outline">
                {secondary.label}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="text-steel mt-8 text-[0.8125rem]">
              Standard enquiries quoted within 48 hours · No obligation · Named account manager on
              every order
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Contact strip                                                              */
/* -------------------------------------------------------------------------- */

export function ContactStrip() {
  // The first row of the configured opening hours, not a written-out repeat of
  // it. This card used to read "Mon–Fri, 07:00–18:00" as a literal, which is how
  // it went on advertising the old hours after they changed everywhere else.
  const [firstHours] = siteConfig.contact.hours;

  const items = [
    {
      icon: Phone,
      label: 'Call us',
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phoneHref}`,
      hint: firstHours ? `${firstHours.days}, ${firstHours.time}` : 'During business hours',
    },
    {
      icon: Mail,
      label: 'Email us',
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      hint: 'Replies within one business day',
    },
    {
      icon: MapPin,
      label: 'Visit us',
      value: `${siteConfig.address.city}, ${siteConfig.address.region}`,
      href: '/contact',
      hint: `${siteConfig.address.line1} ${siteConfig.address.line2}`,
    },
  ];

  return (
    <Section tone="void" size="sm">
      <div className="container-page">
        {/* Three cards on a hairline grid: any cell without a card in it shows as
            a lighter block, so the last one spans the full width at `sm` where
            two columns would otherwise leave a hole. */}
        <RevealGroup className="bg-hairline grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <RevealItem
              key={item.label}
              className={cn(index === items.length - 1 && 'sm:col-span-2 lg:col-span-1')}
            >
              <Link
                href={item.href}
                className={cn(
                  'group bg-charcoal flex h-full flex-col gap-4 p-7',
                  'hover:bg-slate transition-colors duration-400',
                )}
              >
                <item.icon
                  aria-hidden
                  className="text-steel group-hover:text-arc-glow size-5 transition-colors duration-400"
                />
                <div>
                  <p className="text-steel text-[0.6875rem] tracking-[0.14em] uppercase">
                    {item.label}
                  </p>
                  <p className="font-display text-bright mt-2 text-[1.0625rem] font-medium">
                    {item.value}
                  </p>
                  <p className="text-ash mt-1 text-[0.8125rem]">{item.hint}</p>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}
