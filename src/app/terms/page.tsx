import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { Article, TableOfContents } from '@/components/article';
import { extractHeadings } from '@/lib/markdown';

const LAST_UPDATED = '2026-07-01';

export const metadata: Metadata = buildMetadata({
  title: 'Terms & Conditions',
  description: `The terms governing use of ${siteConfig.domain} and the supply of goods and services by ${siteConfig.legalName}.`,
  path: '/terms',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Terms & Conditions', href: '/terms' },
];

const body = `
## 1. About these terms

These terms govern your use of ${siteConfig.domain} and, where stated, the supply of goods and services by ${siteConfig.legalName} ("EPOXA STEEL", "we", "us").

By using this website you accept these terms. If you do not accept them, please do not use the site.

Where we enter into a separate written supply agreement or accept a purchase order under our conditions of sale, that document governs the supply and prevails over anything on this page in the event of conflict.

## 2. Using this website

You may use this website for legitimate business purposes: researching products, requesting quotations, contacting us and reading published material.

You must not:

- Use the site in any way that breaches applicable law
- Attempt to gain unauthorised access to the site, its server or any connected system
- Introduce malicious code, or attempt to interfere with the site's availability
- Systematically extract content to build a competing database
- Submit false, misleading or fraudulent information through our forms
- Use automated systems to submit forms or scrape content at a rate that degrades service for others

We may suspend or withdraw access without notice where we reasonably believe these terms have been breached.

## 3. Quotations and orders

**Quotations are invitations to treat, not offers.** A quotation does not create a binding contract. A contract is formed only when we issue a written order acknowledgement.

**Quotations are valid for the period stated on them**, typically 14 days. Steel prices move with the market, and a quotation that has expired must be re-issued rather than assumed to stand.

**Quantities and specifications** stated in a quotation reflect the information you gave us. If that information is incomplete or inaccurate, the quotation may not be valid, and we will re-quote rather than proceed on a wrong basis.

**Stock availability is not reserved by a quotation.** Material is allocated to your order at order acknowledgement, not at quotation.

## 4. Prices and payment

Prices are exclusive of value added tax and any other applicable duties or taxes, which are payable in addition at the prevailing rate.

Unless we have agreed otherwise in writing:

- Approved account customers are invoiced on **30-day terms** from invoice date
- New accounts are supplied on **pro forma terms** for initial orders while credit checks complete
- Title in the goods passes on **payment in full**; risk passes on delivery
- We may charge statutory interest on overdue amounts

Where a delivery date is deferred at your request beyond the agreed period, we reserve the right to invoice on the originally agreed date and to charge reasonable storage.

## 5. Delivery

**Delivery dates are given in good faith** and, once confirmed at order acknowledgement, we treat them as commitments. We report on time delivery performance honestly, including when we miss.

However, we are not liable for delay caused by circumstances outside our reasonable control, including mill delays, transport disruption, extreme weather, industrial action, or your own failure to provide information, approvals or site access when required.

You are responsible for:

- Providing safe, adequate access for delivery vehicles
- Providing offloading facilities where the agreed delivery method requires them
- Having an authorised person available to receive and sign for the delivery
- Inspecting goods on delivery and noting any visible damage on the delivery note

## 6. Inspection, shortages and damage

Report shortages, damage or incorrect material **within 48 hours of delivery**, with photographs. Where a claim is upheld we replace the material at our cost with priority dispatch.

Claims notified after 48 hours may be difficult to substantiate once material has been handled, moved or partially installed, and we may be unable to accept them.

Goods must not be processed, cut or installed if you believe they are non-conforming, doing so is taken as acceptance.

## 7. Specifications and certification

Where a specification, grade or standard is stated on the order acknowledgement, we supply to that specification and provide certification accordingly.

We do not accept responsibility for the suitability of a specified product for your application. Specification is a design decision, and we supply what is specified. Where our engineering team offers an opinion on suitability, it is offered in good faith and does not transfer design responsibility to us unless we have separately agreed to take it in writing.

## 8. Returns

Standard stock items in original, unprocessed condition may be returned within 14 days of delivery by prior arrangement, subject to a restocking charge and return carriage at your cost.

**We cannot accept returns of** material that has been cut, processed, fabricated, coated or otherwise altered; non-standard material sourced specifically for your order; or any item made to your drawings or specification.

## 9. Website content

Content on this site, including technical data, dimension tables, grade information and guidance articles, is provided for general information. It is prepared carefully but:

- Standards and specifications are revised; always verify against the current published standard
- Stock ranges, lead times and capabilities change
- Guidance articles are general and are not a substitute for project-specific engineering advice
- Illustrative case studies, figures and testimonials on this site are marked as such where they are examples rather than records of a specific engagement

Do not rely on website content for a design decision without confirming it with us in writing for your specific project.

## 10. Intellectual property

All content on this website, text, design, artwork, code, layout and marks, is owned by ${siteConfig.legalName} or licensed to us, and is protected by intellectual property law.

You may view, download and print pages for your own internal business use. You may not republish, redistribute, or use our content commercially without our written permission.

Drawings, models and specifications **you** send us remain yours. We use them only to quote and fulfil your inquiry, and we do not share them outside our supply chain for that order.

## 11. Liability

Nothing in these terms excludes or limits our liability for death or personal injury caused by our negligence, for fraud or fraudulent misrepresentation, or for any liability that cannot lawfully be excluded.

Subject to that:

- We are not liable for indirect or consequential loss, loss of profit, loss of contract, loss of production, or loss of anticipated savings
- Our total liability in connection with any order is limited to the price paid for the goods or services giving rise to the claim
- We are not liable for loss arising from your use of, or reliance on, general website content

Nothing here affects your statutory rights where you deal with us as a consumer.

## 12. Data protection

We handle personal information in accordance with our [Privacy Policy](/privacy), which forms part of these terms.

## 13. Force majeure

Neither party is liable for failure to perform caused by events beyond reasonable control, including natural disasters, war, civil unrest, epidemic, government action, industrial action, failure of utilities or transport networks, and material shortages affecting the wider market.

## 14. Governing law

These terms and any dispute arising from them are governed by the laws of the State of New Jersey, United States, and the courts of that jurisdiction have exclusive jurisdiction.

## 15. Changes

We may update these terms. The version published on this page at the time you place an order is the version that applies to that order.

## 16. Contact

**${siteConfig.legalName}**

- ${siteConfig.address.line1}, ${siteConfig.address.line2}
- ${siteConfig.address.city}, ${siteConfig.address.region} ${siteConfig.address.postalCode}, ${siteConfig.address.country}
- Email: **${siteConfig.contact.email}**
- Phone: **${siteConfig.contact.phone}**
`;

export default function TermsPage() {
  const headings = extractHeadings(body);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        description="The terms governing use of this website and our supply of goods and services."
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
              {/*
                  There was a warning here, visible to visitors, saying these
                  terms were "a starting point" and "not legal advice". That is
                  true, and telling a prospective customer that the company's own
                  trading terms are provisional does more damage than the warning
                  prevents. It is the one page where a buyer's lawyer looks.

                  The warning belongs where the site's owner will see it, so it
                  now lives in README.md's pre-launch checklist and in
                  docs/CONTENT.md. Have a qualified adviser review this page and
                  /privacy against your actual trading terms, jurisdictions and
                  insurance before launch.
                */}

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
