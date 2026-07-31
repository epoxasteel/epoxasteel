import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Clock, FileCheck, ShieldCheck, UserCheck } from 'lucide-react';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageHero, Section, JsonLd, Eyebrow } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { QuoteFormShell } from '@/components/forms/quote-form-shell';

export const metadata: Metadata = buildMetadata({
  title: 'Request a Quote',
  description:
    'Request a quotation for structural steel, plate, tube, bar, reinforcement or fabrication. Line-by-line pricing within 48 hours for standard enquiries.',
  path: '/quote',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Request a Quote', href: '/quote' },
];

const assurances = [
  {
    icon: Clock,
    title: '48-hour turnaround',
    body: 'Standard enquiries quoted within two business days. Complex packages get a confirmed turnaround within four business hours.',
  },
  {
    icon: FileCheck,
    title: 'Line-by-line pricing',
    body: 'Material, processing and delivery priced separately, with exclusions listed in plain language at the front.',
  },
  {
    icon: UserCheck,
    title: 'A named contact',
    body: 'One account manager owns your enquiry from first email to proof of delivery. No call centre, ever.',
  },
  {
    icon: ShieldCheck,
    title: 'No obligation',
    body: 'A quotation is information, not a commitment. We would rather you compared it properly than felt rushed.',
  },
];

export default function QuotePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Request a Quote"
        title="Tell us what you are building."
        description="The more detail you give us, the more useful our first response will be. If you would rather send drawings than fill in a form, attach them below or email them directly, either works."
        trail={trail}
      />

      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
            <div>
              <Suspense fallback={<FormSkeleton />}>
                <QuoteFormShell />
              </Suspense>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <Reveal direction="left">
                <div className="border-hairline bg-charcoal rounded-lg border p-7">
                  <Eyebrow>What happens next</Eyebrow>
                  <ul className="mt-7 space-y-7">
                    {assurances.map((item) => (
                      <li key={item.title} className="flex gap-4">
                        <span className="border-hairline bg-graphite text-arc-glow grid size-9 shrink-0 place-items-center rounded-sm border">
                          <item.icon aria-hidden className="size-4" strokeWidth={1.6} />
                        </span>
                        <span>
                          <span className="text-bright block text-[0.9375rem] font-medium">
                            {item.title}
                          </span>
                          <span className="text-ash mt-1.5 block text-[0.875rem] leading-relaxed">
                            {item.body}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal direction="left" delay={0.1}>
                <div className="border-hairline bg-graphite mt-6 rounded-lg border p-7">
                  <p className="text-eyebrow text-steel uppercase">Prefer to talk?</p>
                  <p className="text-ash mt-4 text-[0.9375rem] leading-relaxed">
                    Some enquiries are faster explained than typed. Call us and you will be speaking
                    to someone who knows steel within a minute.
                  </p>
                  <div className="mt-6 space-y-3 text-[0.9375rem]">
                    <a
                      href={`tel:${siteConfig.contact.phoneHref}`}
                      className="text-bright hover:text-arc-glow flex min-h-6 items-center transition-colors"
                    >
                      {siteConfig.contact.phone}
                    </a>
                    <a
                      href={`mailto:${siteConfig.contact.quotesEmail}`}
                      className="text-mist hover:text-bright flex min-h-6 items-center transition-colors"
                    >
                      {siteConfig.contact.quotesEmail}
                    </a>
                  </div>
                  {/*
                    Every configured row, not the first two.

                    This read `hours[0]` and `hours[1]` directly, which broke the
                    moment opening hours became configurable: a business that sets
                    a single row in NEXT_PUBLIC_BUSINESS_HOURS crashed the whole
                    build with "Cannot read properties of undefined", because this
                    page is prerendered. A third row was silently dropped.

                    A list also gives each line its own element, so `textContent`
                    reads them as separate lines rather than running the last time
                    into the next day.
                  */}
                  <ul className="border-hairline text-steel measure mt-6 space-y-0.5 border-t pt-5 text-[0.8125rem] leading-relaxed">
                    {siteConfig.contact.hours.map((entry) => (
                      <li key={entry.days}>
                        {entry.days}: {entry.time}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}

/** Matches the form's layout so the page does not jump when it hydrates. */
function FormSkeleton() {
  return (
    <div className="space-y-12" aria-hidden>
      {[6, 6, 1].map((fields, section) => (
        <div key={section}>
          <div className="bg-charcoal h-6 w-48 rounded-sm" />
          <div className="bg-charcoal/60 mt-2 h-4 w-72 rounded-sm" />
          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            {Array.from({ length: fields }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="bg-charcoal/70 h-3.5 w-24 rounded-sm" />
                <div className="bg-charcoal h-11 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
