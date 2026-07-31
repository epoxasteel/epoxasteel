import type { Metadata } from 'next';
import { Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { buildMetadata, breadcrumbSchema, localBusinessSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ContactForm } from '@/components/forms/contact-form';
import { socialLinks } from '@/components/visual/social-icons';
import { cn } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    'Office address, business hours, phone and email for Epoxa Steel, and an enquiry form answered within one business day.',
  path: '/contact',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Contact', href: '/contact' },
];

const channels = [
  {
    icon: Phone,
    label: 'Call the office',
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phoneHref}`,
    hint: 'Fastest route to a person who knows steel.',
  },
  {
    icon: Mail,
    label: 'General enquiries',
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    hint: 'Answered within one business day.',
  },
];

export default function ContactPage() {
  const { address } = siteConfig;

  return (
    <>
      <JsonLd data={[breadcrumbSchema(trail), localBusinessSchema()]} />

      <PageHero
        eyebrow="Contact"
        title="Talk to someone who knows steel."
        description="No routing menus, no ticket queue. Every enquiry reaches a person who can actually answer it, and we respond within one business day, usually much faster."
        trail={trail}
      />

      {/* Channels */}
      <Section tone="void" size="sm">
        <div className="container-page">
          {/* Two channels, two columns, the grid is a hairline panel, so any
              cell without a card in it shows as a lighter block. */}
          <RevealGroup className="bg-hairline grid gap-px overflow-hidden rounded-lg sm:grid-cols-2">
            {channels.map((channel) => (
              <RevealItem key={channel.label}>
                <a
                  href={channel.href}
                  className={cn(
                    'group bg-charcoal flex h-full flex-col gap-4 p-7',
                    'hover:bg-slate transition-colors duration-400',
                  )}
                >
                  <channel.icon
                    aria-hidden
                    className="text-steel group-hover:text-arc-glow size-5 transition-colors duration-400"
                  />
                  <span>
                    <span className="text-steel block text-[0.6875rem] tracking-[0.14em] uppercase">
                      {channel.label}
                    </span>
                    <span className="font-display text-bright mt-2 flex items-center gap-1.5 text-[1.0625rem] font-medium">
                      {channel.value}
                      <ArrowUpRight
                        aria-hidden
                        className="text-steel size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                    <span className="text-ash mt-1.5 block text-[0.8125rem] leading-relaxed">
                      {channel.hint}
                    </span>
                  </span>
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Form + details */}
      <Section tone="void" size="sm">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
            <div>
              <Reveal direction="none">
                <Eyebrow>Send a message</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                  What can we help with?
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-ash measure mt-5 text-[1.0625rem] leading-relaxed">
                  For a formal quotation, the{' '}
                  <a href="/quote" className="text-arc-glow underline underline-offset-4">
                    quote request form
                  </a>{' '}
                  captures everything we need in one go. For anything else, a technical question, a
                  delivery in progress, a supplier application. This is the right place.
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <ContactForm className="mt-10" />
              </Reveal>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              <Reveal direction="left">
                <div className="border-hairline bg-charcoal rounded-lg border p-7">
                  {/* No "Head office" label. There is one office, so naming it
                      the head one implies branches that do not exist, and the
                      company name below already says whose address this is. The
                      top margin moves onto the address now that nothing sits
                      above it. */}
                  <address className="text-mist text-[0.9375rem] leading-relaxed not-italic">
                    <span className="text-bright block font-medium">{siteConfig.legalName}</span>
                    {address.line1} <br />
                    {address.line2} <br />
                    {address.city}, {address.region} {address.postalCode} <br />
                    {address.country}
                  </address>
                </div>
              </Reveal>

              <Reveal direction="left" delay={0.08}>
                <div className="border-hairline bg-charcoal rounded-lg border p-7">
                  <p className="text-eyebrow text-steel flex items-center gap-2 uppercase">
                    <Clock aria-hidden className="size-3.5" />
                    Business hours
                  </p>
                  <dl className="mt-5 space-y-3">
                    {siteConfig.contact.hours.map((entry) => (
                      <div key={entry.days} className="flex flex-col gap-0.5">
                        <dt className="text-chalk text-[0.875rem] font-medium">{entry.days}</dt>
                        <dd className="text-ash text-[0.875rem]">{entry.time}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              {/* Not rendered at all until a social account is configured, see
                  the note on `siteConfig.social`. An empty "Follow us" card is
                  worse than no card. */}
              {socialLinks.length ? (
                <Reveal direction="left" delay={0.14}>
                  <div className="border-hairline bg-charcoal rounded-lg border p-7">
                    <p className="text-eyebrow text-steel uppercase">Follow us</p>
                    <ul className="mt-5 flex flex-wrap gap-2.5">
                      {socialLinks.map((social) => (
                        <li key={social.label}>
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${siteConfig.name} on ${social.label}`}
                            className={cn(
                              'border-hairline grid size-10 place-items-center rounded-sm border',
                              'text-steel bg-white/[0.02] transition-all duration-300',
                              'hover:border-arc/40 hover:text-arc-glow hover:-translate-y-0.5',
                            )}
                          >
                            <social.icon className="size-4" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ) : null}
            </aside>
          </div>
        </div>
      </Section>

      {/*
        No map section.

        A full-width panel of drawn streets with the address floated in the
        middle of it, under "Find us". The artwork was never a map of anywhere,
        the Google Maps link came out earlier, and the address it framed is
        already on the card above. It was a screen and a half of page spent
        repeating one line.
      */}
    </>
  );
}
