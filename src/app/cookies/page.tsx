import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { Article, TableOfContents } from '@/components/article';
import { Alert } from '@/components/ui/misc';
import { extractHeadings } from '@/lib/markdown';
import { analyticsConfig, analyticsEnabled } from '@/lib/analytics';
import { ConsentControls } from '@/components/layout/consent-controls';

const LAST_UPDATED = '2026-07-01';

export const metadata: Metadata = buildMetadata({
  title: 'Cookie Notice',
  description: `Exactly which cookies and browser storage ${siteConfig.domain} uses, what each one is for, and how to change your choice.`,
  path: '/cookies',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Cookie Notice', href: '/cookies' },
];

/**
 * The cookie notice, written from what the deployment actually does.
 *
 * The analytics section is generated from the environment rather than written once
 * and hoped over. A cookie notice that lists trackers a site does not run is as
 * wrong as one that omits trackers it does — and the second kind starts as the
 * first kind the day somebody sets an ID. Here the page and the behaviour cannot
 * disagree, because they read the same variables.
 */
function analyticsSection() {
  const { ga, gtm, meta, linkedin } = analyticsConfig();

  if (!analyticsEnabled()) {
    return `## Analytics cookies

**This website currently sets none.**

No analytics provider is configured on this deployment, so there is no measurement script, no tracking pixel and no advertising cookie. Nothing about your visit is sent to a third party for analysis, and there is no cookie banner, because there is nothing to consent to.

The site is built so that analytics *can* be switched on later. If that happens, three things change at the same time and by the same switch: the scripts load, this page lists exactly which ones, and you are asked before any of them run. You will not find measurement quietly added without this page saying so.`;
  }

  const providers = [
    gtm && `- **Google Tag Manager** (container \`${gtm}\`) — loads and manages the tags below.`,
    ga &&
      `- **Google Analytics 4** (property \`${ga}\`) — which pages are visited, how people arrive, and where they leave. IP addresses are anonymised.`,
    meta &&
      `- **Meta Pixel** (ID \`${meta}\`) — measures whether visits from Facebook or Instagram lead to an enquiry.`,
    linkedin &&
      `- **LinkedIn Insight Tag** (partner ID \`${linkedin}\`) — measures whether visits from LinkedIn lead to an enquiry.`,
  ].filter(Boolean);

  return `## Analytics cookies

These are the providers configured on this deployment:

${providers.join('\n')}

**None of them load until you accept.** Not "load and behave" — nothing is requested, no script tag is inserted and no cookie is set until you press Accept on the notice. If you decline, or simply never answer, none of it ever runs and the site works exactly the same.

Your choice is remembered in your browser's local storage under \`epoxa:consent\`, which is not a cookie and is never sent to us with a request. We do not ask again, in either direction.`;
}

const body = `
## The short version

This website needs no cookies to work. Nothing you do here — browsing products, requesting a quotation, sending a message — depends on a cookie or on you agreeing to one.

What follows is the complete list of what we store in your browser and why.

## Strictly necessary

**None.** There is no session cookie, no login, no basket and no cookie-based security token. The forms are protected by a signed token that lives in the page for the few minutes it is being filled in, and never in a cookie.

## Browser storage we do use

Two things, neither of which is a cookie and neither of which is ever transmitted to us. Both are readable and clearable from your browser's developer tools or by clearing site data.

- **\`epoxa:overture-played\`** (session storage) — remembers that you have already seen the homepage opening animation, so it does not replay every time you return to the homepage in the same visit. Cleared when you close the tab.
- **\`epoxa:draft:contact\` / \`epoxa:draft:quote\`** (session storage) — keeps what you have typed into a form so a stray click, a back button or an accidental refresh does not lose a half-written enquiry. Cleared when the form is submitted, or when you close the tab.
- **\`epoxa:assistant\`** (session storage) — the transcript of a conversation with our assistant, so it survives moving between pages. Cleared when you close the tab.
- **\`epoxa:recently-viewed\`** (session storage) — the products you have looked at, so we can show them again at the foot of a product page. Cleared when you close the tab.

Session storage is deliberate in every case above. It lasts exactly as long as your visit, is scoped to this site alone, and is the right lifetime for something nobody was asked to agree to.

${analyticsSection()}

## Cookies we never use

To be explicit, because most notices are not:

- No advertising or retargeting cookies
- No cross-site or third-party tracking cookies
- No social media cookies — the icons in our footer are plain links, not embedded widgets
- No fingerprinting, and no behavioural profiling
- No embedded iframes from any third party; our Content Security Policy blocks them outright

## Changing your mind

If a notice was shown to you, you can change your answer at any time using the controls further down this page. If none was shown, there is nothing set and nothing to change.

You can also block or delete storage for this site entirely in your browser settings. Nothing on this website will break if you do.

## Questions

**${siteConfig.legalName}**

- ${siteConfig.address.line1}, ${siteConfig.address.line2}
- ${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.postalCode}, ${siteConfig.address.country}
- Email: **${siteConfig.contact.email}**
- Phone: **${siteConfig.contact.phone}**

See also our [Privacy Policy](/privacy), which covers what happens to the information you send us through a form.
`;

export default function CookiesPage() {
  const headings = extractHeadings(body);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Legal"
        title="Cookie Notice"
        description="Every piece of storage this site puts in your browser, what it is for, and how long it lasts. It is a short list."
        trail={trail}
        meta={
          <p className="text-steel text-[0.875rem]">
            Last updated{' '}
            <time dateTime={LAST_UPDATED}>
              {new Date(`${LAST_UPDATED}T00:00:00Z`).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          </p>
        }
      />

      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] lg:gap-20">
            <div className="min-w-0">
              <Reveal direction="none">
                <Alert
                  tone="info"
                  title="Written from the code, not from a template"
                  className="mb-10 max-w-3xl"
                >
                  The list below is generated from this deployment&rsquo;s actual configuration, so
                  it cannot describe tracking the site does not do — or omit tracking it does. It is
                  still not legal advice; have it reviewed against the jurisdictions you operate in.
                </Alert>
              </Reveal>

              <Reveal direction="none">
                <Article body={body} />
              </Reveal>

              <Reveal direction="none">
                <ConsentControls configured={analyticsEnabled()} />
              </Reveal>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <TableOfContents headings={headings} />
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}
