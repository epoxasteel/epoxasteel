import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { Article, TableOfContents } from '@/components/article';
import { Alert } from '@/components/ui/misc';
import { extractHeadings } from '@/lib/markdown';
import { analyticsEnabled } from '@/lib/analytics';

const LAST_UPDATED = '2026-07-01';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy',
  description: `How ${siteConfig.legalName} collects, uses, stores and protects personal information submitted through this website.`,
  path: '/privacy',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Privacy Policy', href: '/privacy' },
];

/**
 * What we collect automatically, which depends on one variable.
 *
 * `EMAIL_INCLUDE_IP` decides whether a submitter's address is put in the owner's
 * notification email. That is a materially different disclosure from hashing it
 * for abuse detection, so the policy is generated rather than written once — the
 * page cannot describe a practice the deployment does not have, or omit one it does.
 */
function ipParagraph() {
  const shared =
    '- Your **browser, operating system and device type**, worked out from the user-agent string your browser sends, and the **page you submitted the form from**. This is included in the notification our team receives so we can respond usefully; it is not stored and not used to identify you.';

  return process.env.EMAIL_INCLUDE_IP === 'true'
    ? `- A **hashed form of your IP address** when you submit a form, used only to detect and limit automated abuse. We cannot recover the original address from the hash.
- Your **IP address**, included in the internal notification email our team receives about your enquiry. It is not stored in our systems and is not used to track you across the site; it exists so we can identify and block abuse of our forms. It stays in that mailbox for as long as the enquiry itself is retained.
${shared}`
    : `- A **hashed form of your IP address** when you submit a form. We hash it, so we cannot recover the original address; it exists only to detect and limit automated abuse of our forms. Your actual IP address is never stored and never included in the notifications our team receives.
${shared}`;
}

/**
 * The two paragraphs that must not lie.
 *
 * A privacy policy that says "no analytics run on this site" is true of the default
 * deployment and becomes false the moment somebody sets a measurement ID. Rather
 * than write the optimistic version and rely on whoever flips the switch also
 * remembering to edit prose, both paragraphs are generated from the same
 * configuration the scripts read. The page and the behaviour cannot disagree.
 */
function trackingParagraph() {
  return analyticsEnabled()
    ? 'This deployment has analytics configured. **Nothing loads until you accept the cookie notice**, no script is requested and no cookie is set before then, and declining leaves the site working exactly as it does now. Our [Cookie Notice](/cookies) lists each provider by name, and you can change your answer there at any time. We do not use retargeting cookies or behavioural profiling in any configuration.'
    : 'We do **not** use advertising cookies, tracking pixels, cross-site trackers or behavioural profiling on this website. There is no analytics script running on this deployment. If that ever changes, the [Cookie Notice](/cookies) will name every provider and you will be asked before any of it runs.';
}

function cookieParagraph() {
  return analyticsEnabled()
    ? 'This website sets no advertising cookies. Analytics cookies are configured but load only after you accept the cookie notice; your answer is remembered in your browser, not in a cookie sent to us.'
    : 'This website sets no cookies at all, not for advertising, not for analytics, and not for its own operation.';
}

const body = `
## Who we are

${siteConfig.legalName} ("EPOXA STEEL", "we", "us") supplies structural steel, fabrication and related services. This policy explains what personal information we collect through ${siteConfig.domain}, why we collect it, how long we keep it and what rights you have over it.

If you have any question about this policy, contact us at **${siteConfig.contact.email}** or write to us at the postal address at the end of this page.

## What we collect

We only collect information you choose to give us, plus a minimal amount of technical data needed to operate the site securely.

**Information you provide**

- **Quotation requests**, your name, company, email address, phone number, country, city, project type, product, quantity, budget range, timeline, project description and any file you attach.
- **Contact enquiries**, your name, email address, and optionally your phone number and company, plus your subject and message.
- **Newsletter subscriptions**, your email address.
- **Job applications**, the information you include in your application email, including any attached CV.

**Information collected automatically**

${ipParagraph()}

${trackingParagraph()}

## Why we use it

- **To respond to your enquiry.** This is the primary purpose. Without your contact details we cannot send you a quotation or answer your question.
- **To supply goods and services** you order from us, and to keep the records that supply requires.
- **To send the newsletter**, where you have asked us to.
- **To protect the site** from spam and automated abuse.
- **To meet legal and regulatory obligations**, including the record-keeping that certified supply requires.

Our lawful bases are: performance of a contract (or steps taken at your request before entering one), your consent (newsletter), our legitimate interests (protecting the site from abuse, responding to business enquiries), and compliance with legal obligations.

## Who we share it with

We do not sell personal information. We never have and we will not.

We share information only with service providers who help us operate, and only to the extent they need it:

- **Email delivery providers**, to deliver the confirmation and notification emails our forms send.
- **Hosting and infrastructure providers**, who process data on our behalf under contract.

Where a provider processes personal data outside your country, we ensure an appropriate transfer mechanism is in place.

We may also disclose information where we are legally required to do so, or where necessary to establish or defend a legal claim.

## How long we keep it

- **Quotation requests and enquiries**, retained for the duration of the commercial relationship and for **seven years** afterwards, to satisfy the record-keeping obligations attached to certified steel supply and any warranty period.
- **Newsletter subscriptions**, retained until you unsubscribe, then removed within 30 days.
- **Job applications**, retained for **12 months** from the date of application unless you ask us to remove them sooner.
- **Abuse-prevention data** (hashed IP, user-agent), retained for **90 days**.

## How we protect it

- All traffic to this site is encrypted in transit using TLS.
- Access to enquiry data is restricted to staff who need it to do their job.
- IP addresses are hashed before storage, never stored in the clear.
- The site enforces a strict Content Security Policy, and its allowance for third-party hosts is widened only for services actually configured, never in anticipation of one.
- File attachments you send with a quotation request are transmitted directly to our commercial team; they are not published or made publicly accessible.

## Your rights

Depending on where you live, you may have the right to:

- **Access** the personal information we hold about you
- **Correct** information that is inaccurate or incomplete
- **Delete** your information, where we have no overriding obligation to keep it
- **Restrict or object** to how we process it
- **Portability**, receive your information in a machine-readable format
- **Withdraw consent** at any time, where processing is based on consent

To exercise any of these, email **${siteConfig.contact.email}**. We respond within 30 days. If you are not satisfied with our response, you have the right to complain to your local data protection authority.

## Cookies

${cookieParagraph()}

We also use **session storage**, not a cookie, for a handful of small conveniences: remembering that you have already seen the homepage opening animation, keeping a half-written form from being lost to a stray click, and holding a conversation with our assistant across pages. All of it stays in your browser, is never transmitted to us, and clears when you close the tab.

Our [Cookie Notice](/cookies) lists every item individually, with what each one is for and how long it lasts.

## Children

This website is intended for business use. We do not knowingly collect personal information from anyone under 16. If you believe a child has provided us with personal information, contact us and we will remove it.

## Changes to this policy

If we make a material change to how we handle personal information, we will update this page and revise the date below. Where the change materially affects information already collected, we will contact affected individuals directly.

## Contact us

**${siteConfig.legalName}**

- ${siteConfig.address.line1}, ${siteConfig.address.line2}
- ${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.postalCode}, ${siteConfig.address.country}
- Email: **${siteConfig.contact.email}**
- Phone: **${siteConfig.contact.phone}**
`;

export default function PrivacyPage() {
  const headings = extractHeadings(body);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect, why we collect it, how long we keep it and what rights you have over it, written to be read rather than to be defensible."
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
                <Alert tone="info" title="This is a template" className="mb-10 max-w-3xl">
                  This policy describes how the website as built actually behaves, and is a solid
                  starting point, but it is not legal advice. Have it reviewed by a qualified
                  adviser against the jurisdictions you operate in before you rely on it.
                </Alert>
              </Reveal>

              <Reveal direction="none">
                <Article body={body} />
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
