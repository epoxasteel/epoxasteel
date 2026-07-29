import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { buildMetadata, breadcrumbSchema, localBusinessSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ContactForm } from '@/components/forms/contact-form';
import { whatsappHref } from '@/components/ui/misc';
import {
  LinkedInIcon,
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
  XIcon,
} from '@/components/visual/social-icons';
import { cn } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Contact',
  description:
    'Speak to EPOXA STEEL: office details, business hours, direct lines, WhatsApp and an enquiry form answered within one business day.',
  path: '/contact',
  keywords: ['contact steel supplier', 'steel company phone', 'steel enquiry'],
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
  {
    icon: Mail,
    label: 'Quotations',
    value: siteConfig.contact.quotesEmail,
    href: `mailto:${siteConfig.contact.quotesEmail}`,
    hint: 'Send drawings, schedules or a bill of quantities.',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Message us',
    href: whatsappHref(),
    hint: 'For site queries and anything urgent.',
    external: true,
  },
];

const socials = [
  { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: LinkedInIcon },
  { label: 'X', href: siteConfig.social.x, icon: XIcon },
  { label: 'Instagram', href: siteConfig.social.instagram, icon: InstagramIcon },
  { label: 'Facebook', href: siteConfig.social.facebook, icon: FacebookIcon },
  { label: 'YouTube', href: siteConfig.social.youtube, icon: YouTubeIcon },
];

export default function ContactPage() {
  const { address } = siteConfig;
  const mapQuery = encodeURIComponent(
    `${address.line1}, ${address.line2}, ${address.city}, ${address.region} ${address.postalCode}`,
  );

  return (
    <>
      <JsonLd data={[breadcrumbSchema(trail), localBusinessSchema()]} />

      <PageHero
        eyebrow="Contact"
        title="Talk to someone who knows steel."
        description="No routing menus, no ticket queue. Every enquiry reaches a person who can actually answer it, and we respond within one business day — usually much faster."
        trail={trail}
      />

      {/* Channels */}
      <Section tone="void" size="sm">
        <div className="container-page">
          <RevealGroup className="bg-hairline grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <RevealItem key={channel.label}>
                <a
                  href={channel.href}
                  {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
                  captures everything we need in one go. For anything else — a technical question, a
                  delivery in progress, a supplier application — this is the right place.
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <ContactForm className="mt-10" />
              </Reveal>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-32 lg:self-start">
              <Reveal direction="left">
                <div className="border-hairline bg-charcoal rounded-lg border p-7">
                  <p className="text-eyebrow text-steel uppercase">Head office</p>
                  <address className="text-mist mt-5 text-[0.9375rem] leading-relaxed not-italic">
                    <span className="text-bright block font-medium">{siteConfig.legalName}</span>
                    {address.line1}
                    <br />
                    {address.line2}
                    <br />
                    {address.city}, {address.region} {address.postalCode}
                    <br />
                    {address.country}
                  </address>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-arc-glow hover:text-arc-bright mt-5 inline-flex items-center gap-1.5 text-[0.875rem] transition-colors"
                  >
                    <MapPin aria-hidden className="size-3.5" />
                    Open in Google Maps
                  </a>
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

              <Reveal direction="left" delay={0.14}>
                <div className="border-hairline bg-charcoal rounded-lg border p-7">
                  <p className="text-eyebrow text-steel uppercase">Follow us</p>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {socials.map((social) => (
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
            </aside>
          </div>
        </div>
      </Section>

      {/* Map */}
      <Section tone="graphite" id="location" className="border-hairline border-t" size="sm">
        <div className="container-page">
          <Reveal direction="none">
            <Eyebrow>Find us</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display text-headline text-bright mt-6 font-semibold">
              {address.city}, {address.region}
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            {/*
              A static map placeholder rather than an embedded iframe: an embed
              would load third-party scripts and cookies on every page view, and
              the CSP here is deliberately strict. Swapping in a real embed is a
              one-line change — see docs/DEPLOYMENT.md.
            */}
            {/* The letterbox ratio only works once there is width to spend on
                it. At 390px a 21:9 box is 167px tall and the address card
                inside is 232px — it was being cut off at "Get directions". */}
            <div className="border-hairline bg-void relative mt-10 aspect-4/3 overflow-hidden rounded-lg border sm:aspect-16/9 lg:aspect-21/9">
              <MapArtwork />

              <div className="absolute inset-0 grid place-items-center p-4">
                <div className="border-hairline bg-graphite/90 rounded-lg border p-6 text-center backdrop-blur-md sm:p-7">
                  <MapPin aria-hidden className="text-arc-bright mx-auto size-6" />
                  <p className="font-display text-title text-bright mt-4 font-semibold">
                    {siteConfig.address.line1}
                  </p>
                  <p className="text-ash mt-1.5 text-[0.875rem]">
                    {address.line2}, {address.city}, {address.region} {address.postalCode}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-arc-glow hover:text-arc-bright mt-5 inline-flex items-center gap-1.5 text-[0.875rem] transition-colors"
                  >
                    Get directions
                    <ArrowUpRight aria-hidden className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

/** A drawn street grid — placeholder artwork, not a representation of a real map. */
function MapArtwork() {
  return (
    <svg
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      focusable="false"
      className="size-full"
    >
      <rect width="1200" height="500" fill="#080b10" />
      <g stroke="rgba(168,178,190,0.09)" strokeWidth="1">
        {Array.from({ length: 25 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="1200" y2={i * 50} />
        ))}
      </g>
      <g stroke="rgba(168,178,190,0.18)" strokeWidth="6">
        <line x1="0" y1="250" x2="1200" y2="250" />
        <line x1="600" y1="0" x2="600" y2="500" />
        <line x1="0" y1="120" x2="1200" y2="120" strokeWidth="3" />
        <line x1="250" y1="0" x2="250" y2="500" strokeWidth="3" />
        <line x1="950" y1="0" x2="950" y2="500" strokeWidth="3" />
      </g>
      <g fill="rgba(168,178,190,0.05)">
        {[
          [60, 160, 150, 60],
          [300, 160, 240, 60],
          [660, 160, 220, 60],
          [1000, 160, 150, 60],
          [60, 300, 150, 140],
          [300, 300, 240, 140],
          [660, 300, 220, 140],
          [1000, 300, 150, 140],
        ].map(([x, y, w, h], index) => (
          <rect key={index} x={x} y={y} width={w} height={h} />
        ))}
      </g>
      <circle cx="600" cy="250" r="70" fill="rgba(28,98,174,0.12)" />
      <circle cx="600" cy="250" r="30" fill="rgba(58,138,224,0.18)" />
    </svg>
  );
}
