import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import {
  LinkedInIcon,
  InstagramIcon,
  FacebookIcon,
  YouTubeIcon,
  XIcon,
} from '@/components/visual/social-icons';
import { footerNav, legalNav, siteConfig } from '@/lib/site';
import { Wordmark } from '@/components/visual/wordmark';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { cn } from '@/lib/utils';

const socialLinks = [
  { label: 'LinkedIn', href: siteConfig.social.linkedin, icon: LinkedInIcon },
  { label: 'X', href: siteConfig.social.x, icon: XIcon },
  { label: 'Instagram', href: siteConfig.social.instagram, icon: InstagramIcon },
  { label: 'Facebook', href: siteConfig.social.facebook, icon: FacebookIcon },
  { label: 'YouTube', href: siteConfig.social.youtube, icon: YouTubeIcon },
];

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
            <Link href="/" aria-label={`${siteConfig.name} — home`} className="inline-block">
              <Wordmark size="lg" />
            </Link>
            <p className="text-ash mt-6 max-w-md text-[0.9375rem] leading-relaxed">
              {siteConfig.description}
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
              <li className="text-mist flex items-start gap-3">
                <MapPin aria-hidden className="text-steel mt-0.5 size-4 shrink-0" />
                <address className="not-italic">
                  {siteConfig.address.line1}
                  <br />
                  {siteConfig.address.line2}
                  <br />
                  {siteConfig.address.city}, {siteConfig.address.region}{' '}
                  {siteConfig.address.postalCode}
                </address>
              </li>
            </ul>

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
          </div>

          <div className="lg:pl-8">
            <p className="text-eyebrow text-arc-glow uppercase">The Epoxa Briefing</p>
            <h2 className="font-display text-title text-bright mt-4 font-semibold">
              Market conditions, technical guidance, project news.
            </h2>
            <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">
              Roughly once a month. Written by our engineers and supply chain team — no
              announcements dressed up as insight, and one-click unsubscribe on every issue.
            </p>
            <NewsletterForm className="mt-6" />

            {/* All of them. `slice(0, 2)` quietly dropped Sunday — and Sunday is
                the one that says emergency dispatch is available, which is
                exactly the line a site manager needs to see. */}
            <dl className="bg-hairline mt-10 grid gap-px overflow-hidden rounded-md sm:grid-cols-3">
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

        {/* Link columns.
            Two abreast from the narrowest width rather than one: stacked, the
            four lists ran the footer to 2,374px on a phone — longer than most of
            the pages it sits under. */}
        <div className="container-page border-hairline grid grid-cols-2 gap-x-6 gap-y-10 border-b py-12 lg:grid-cols-4 lg:gap-10">
          {footerNav.map((column) => (
            <nav key={column.title} aria-labelledby={`footer-${column.title}`}>
              <h2
                id={`footer-${column.title}`}
                className="text-eyebrow text-steel font-medium uppercase"
              >
                {column.title}
              </h2>
              <ul className="mt-5 space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group text-mist inline-flex items-center gap-2 text-[0.875rem]',
                        'hover:text-bright transition-colors duration-250',
                      )}
                    >
                      <span
                        aria-hidden
                        className="bg-arc-bright h-px w-0 transition-all duration-300 group-hover:w-3"
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Legal bar */}
        <div className="container-page text-steel flex flex-col gap-4 py-7 text-[0.8125rem] md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.legalName}. All rights reserved.
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalNav.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-mist transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/sitemap.xml" className="hover:text-mist transition-colors">
                Sitemap
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
