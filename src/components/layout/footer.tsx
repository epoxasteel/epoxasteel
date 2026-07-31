import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { socialLinks } from '@/components/visual/social-icons';
import { legalNav, siteConfig } from '@/lib/site';
import { Wordmark } from '@/components/visual/wordmark';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { cn } from '@/lib/utils';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    // `data-footer` is watched by the floating dock, which stands down when the
    // footer arrives rather than sitting on top of its links.
    <footer data-footer className="border-hairline bg-graphite relative border-t">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />
      <div
        className="via-arc/45 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
        aria-hidden
      />

      <div className="relative">
        {/* Brand + newsletter */}
        <div className="container-page border-hairline grid gap-12 border-b py-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20 lg:py-16">
          <div>
            <Link href="/" aria-label={`${siteConfig.name}, home`} className="inline-block">
              <Wordmark size="lg" />
            </Link>
            <p className="text-ash mt-6 max-w-md text-[0.9375rem] leading-relaxed">
              {siteConfig.overview}
            </p>

            <ul className="mt-8 space-y-3 text-[0.9375rem]">
              <li>
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  className="group text-mist hover:text-bright inline-flex min-h-6 items-center gap-3 transition-colors"
                >
                  <Phone
                    aria-hidden
                    className="text-steel group-hover:text-arc-bright size-4 transition-colors"
                  />
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group text-mist hover:text-bright inline-flex min-h-6 items-center gap-3 transition-colors"
                >
                  <Mail
                    aria-hidden
                    className="text-steel group-hover:text-arc-bright size-4 transition-colors"
                  />
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>

            {/*
              The postal address is deliberately not here. It is published on the
              contact page, where somebody looking for it will go; a footer that
              repeats every fact on the site is a footer nobody reads.

              Social icons render only once there is an account to point at, so
              this disappears entirely until one is configured rather than leaving
              a row of links to handles the business does not own. See
              `siteConfig.social`.
            */}
            {socialLinks.length ? (
              <ul className="mt-8 flex gap-2.5">
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
            ) : null}
          </div>

          <div className="lg:pl-8">
            <p className="text-eyebrow text-arc-glow uppercase">The Epoxa Briefing</p>
            <h2 className="font-display text-title text-bright mt-4 font-semibold">
              Market conditions, technical guidance, project news.
            </h2>
            <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">
              Roughly once a month. Written by our engineers and supply chain team, no announcements
              dressed up as insight, and one-click unsubscribe on every issue.
            </p>
            <NewsletterForm className="mt-6" />

            {/* All of them. `slice(0, 2)` quietly dropped the last row, and the
                last row is the one that says whether the yard opens at the
                weekend, exactly the line a site manager needs to see.

                Two columns, because the panel is a hairline grid: every cell
                without a child shows as a lighter block, so an odd number of rows
                against three columns leaves a visible hole. Four rows divide
                cleanly by two. */}
            <dl className="bg-hairline mt-10 grid gap-px overflow-hidden rounded-md sm:grid-cols-2">
              {siteConfig.contact.hours.map((entry) => (
                <div key={entry.days} className="bg-graphite p-4">
                  <dt className="text-steel text-[0.6875rem] tracking-[0.14em] uppercase">
                    {entry.days}
                  </dt>
                  <dd className="text-chalk mt-1.5 text-[0.875rem]">{entry.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/*
          No link columns.

          Four lists, products, industries, services, company, repeated the
          navigation a second time at the bottom of every page. With the header
          down to three entries there is not enough site left for a sitemap in
          the footer to be doing work; it was just the longest thing on the page.

          The pages themselves are all still reachable and still in
          `sitemap.xml`: the mega panel covers products, services and
          industries, and About and Contact are in the bar. `footerNav` is still
          in `lib/site.ts` if these ever come back.
        */}

        {/* Legal bar */}
        <div className="container-page text-steel flex flex-col gap-4 py-7 text-[0.8125rem] md:flex-row md:items-center md:justify-between">
          {/* The year is the current one, not a literal, a copyright notice that
              silently goes stale on 1 January is the classic version of this bug. */}
          <p>
            © {year} {siteConfig.legalEntity} All rights reserved.
          </p>

          {/*
            Legal links and the design credit share the right-hand side, but they
            are not the same kind of thing, so the gap between them is 64px
            against the 24px inside the list. Far enough apart that the credit
            reads as its own item rather than a fourth policy page, which is what
            it looked like sitting under the copyright at list weight.

            The credit takes the outer edge and pushes the list left, rather than
            the other way round: it is the quietest thing in the bar, and the
            outer edge is where the eye stops last.
          */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-16">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legalNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-mist transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/*
              Darker than anything else on the site, deliberately, and a literal
              rather than a token because nothing else should reach for it.
              #5a626e is 3.18:1 on the footer, so it is below the 4.5:1 AA
              threshold for a link this size — asked for and understood. It stops
              here rather than going further: 3:1 is the floor WCAG uses for
              large text and UI components, and past it the words start to
              disappear against the background rather than just recede.

              `self-start` because a flex child stretches by default, which gave
              the anchor a hit area far wider than its text.
            */}
            <a
              href="https://yiddiweller.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mist inline-flex min-h-6 items-center self-start text-[0.6875rem] text-[#5a626e] transition-colors"
            >
              Designed by yiddiweller.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
