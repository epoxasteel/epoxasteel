import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Download, FileText } from 'lucide-react';
import { getProduct, getRelatedProducts, productSlugs } from '@/content/products';
import { getIndustry } from '@/content/industries';
import { buildMetadata, breadcrumbSchema, productSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow, ArrowLink } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { SteelProfileFigure } from '@/components/visual/steel-profile';
import { SpecTable, DefinitionGrid, TagList, Checklist, Badge, Alert } from '@/components/ui/misc';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/cards';
import { CallToAction } from '@/components/home/sections';
import { RecentlyViewed } from '@/components/products/recently-viewed';
import { AskAbout } from '@/components/assistant/ask-about';
import { assistantConfigured } from '@/lib/assistant/config';
import { fileSizeLabel } from '@/lib/downloads';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return productSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: 'Product not found', robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: product.name,
    description: product.summary,
    path: `/products/${product.slug}`,
    keywords: [
      product.name.toLowerCase(),
      `${product.name.toLowerCase()} supplier`,
      ...product.grades.map((grade) => grade.toLowerCase()),
    ],
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const assistantEnabled = assistantConfigured();
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) notFound();

  const related = getRelatedProducts(slug);
  const industries = product.industries
    .map((industrySlug) => getIndustry(industrySlug))
    .filter((industry) => Boolean(industry));

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: product.name, href: `/products/${product.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          productSchema({
            name: product.name,
            description: product.summary,
            path: `/products/${product.slug}`,
            category: product.category,
            grades: product.grades,
          }),
        ]}
      />

      <PageHero
        eyebrow={product.category}
        title={product.name}
        description={product.tagline}
        trail={trail}
        meta={
          <div className="flex flex-wrap gap-2">
            {product.standards.slice(0, 3).map((standard) => (
              <Badge key={standard} tone="metal">
                {standard}
              </Badge>
            ))}
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <Button href={`/quote?product=${encodeURIComponent(product.name)}`} size="lg" sheen>
            Request a Quote
            <ArrowRight aria-hidden />
          </Button>
          <Button href="/contact" size="lg" variant="outline">
            Ask a technical question
          </Button>
        </div>
      </PageHero>

      {/* Overview + profile */}
      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
            <div>
              <Reveal direction="none">
                <Eyebrow>Overview</Eyebrow>
              </Reveal>

              <div className="mt-8 space-y-6">
                {product.overview.map((paragraph, index) => (
                  <Reveal key={index} delay={index * 0.06}>
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

              <Reveal delay={0.2}>
                <DefinitionGrid items={[...product.keyFacts]} className="mt-12" />
              </Reveal>
            </div>

            <Reveal direction="left" className="lg:sticky lg:top-32 lg:self-start">
              <SteelProfileFigure profile={product.profile} label={product.name} />

              <div className="border-hairline bg-charcoal mt-6 rounded-md border p-6">
                <p className="text-eyebrow text-steel uppercase">Quick enquiry</p>
                <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">
                  Send sizes and quantities and we will come back with a line-by-line quotation
                  within 48 hours.
                </p>
                <Button
                  href={`/quote?product=${encodeURIComponent(product.name)}`}
                  full
                  className="mt-5"
                >
                  Quote {product.name}
                </Button>

                {/* A specification raises questions before it raises a purchase
                    order. This puts the answer next to the spec instead of
                    asking the buyer to go and find it. */}
                {assistantEnabled ? (
                  <div className="border-hairline mt-5 border-t pt-5">
                    <AskAbout
                      seed={`I am looking at ${product.name}. `}
                      label="Ask about grades and sizes"
                    />
                  </div>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Specifications */}
      <Section tone="graphite" className="border-hairline border-y">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
            <Reveal>
              <h2 className="font-display text-title text-bright font-semibold">Grades supplied</h2>
              <TagList items={product.grades} className="mt-5" />
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="font-display text-title text-bright font-semibold">Standards</h2>
              <TagList items={product.standards} className="mt-5" />
            </Reveal>

            <Reveal delay={0.12}>
              <h2 className="font-display text-title text-bright font-semibold">
                Finishes available
              </h2>
              <TagList items={product.finishes} className="mt-5" />
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-16">
              <h2 className="font-display text-headline text-bright font-semibold">
                {product.dimensions.title}
              </h2>
              <SpecTable
                columns={product.dimensions.columns}
                rows={product.dimensions.rows}
                caption={product.dimensions.caption}
                className="mt-8"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Applications + industries */}
      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal direction="none">
                <Eyebrow>Applications</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                  Where {product.name.toLowerCase()} does its work.
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <Checklist items={product.applications} className="mt-8" />
              </Reveal>
            </div>

            <div>
              <Reveal direction="none">
                <Eyebrow>Industries served</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                  Sectors we supply this into.
                </h2>
              </Reveal>

              <RevealGroup className="bg-hairline mt-8 grid gap-px overflow-hidden rounded-md sm:grid-cols-2">
                {industries.map((industry) =>
                  industry ? (
                    <RevealItem key={industry.slug}>
                      <Link
                        href={`/industries/${industry.slug}`}
                        className="group bg-charcoal hover:bg-slate flex h-full flex-col justify-between gap-3 p-5 transition-colors duration-400"
                      >
                        <span className="text-chalk group-hover:text-bright text-[0.9375rem] font-medium transition-colors">
                          {industry.name}
                        </span>
                        <span className="text-steel text-[0.8125rem] leading-relaxed">
                          {industry.tagline}
                        </span>
                      </Link>
                    </RevealItem>
                  ) : null,
                )}
              </RevealGroup>
            </div>
          </div>
        </div>
      </Section>

      {/* Downloads */}
      <Section tone="graphite" size="sm" className="border-hairline border-y">
        <div className="container-page">
          <Reveal direction="none">
            <Eyebrow>Downloads</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="font-display text-headline text-bright mt-6 font-semibold">
              Technical documentation
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <Alert tone="info" className="mt-8 max-w-3xl">
              Datasheets are added to <code>public/downloads/</code> as they are finalised. If a
              document you need is not yet listed, email{' '}
              <a
                href="mailto:info@epoxasteel.com"
                className="text-arc-glow underline underline-offset-2"
              >
                info@epoxasteel.com
              </a>{' '}
              and we will send it directly.
            </Alert>
          </Reveal>

          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2">
            {product.downloads.map((download) => (
              <RevealItem key={download.href}>
                <a
                  href={download.href}
                  download
                  className={cn(
                    'group border-hairline bg-charcoal flex h-full items-start gap-4 rounded-md border p-5',
                    'hover:border-hairline-strong hover:bg-slate transition-colors duration-400',
                  )}
                >
                  <span className="border-hairline bg-graphite text-arc-glow grid size-11 shrink-0 place-items-center rounded-sm border">
                    <FileText aria-hidden className="size-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-chalk group-hover:text-bright block text-[0.9375rem] font-medium transition-colors">
                      {download.label}
                    </span>
                    <span className="text-ash mt-1 block text-[0.8125rem] leading-relaxed">
                      {download.description}
                    </span>
                    {/* Measured on disk rather than declared by hand — the
                        hand-written hints had drifted by three orders of
                        magnitude. */}
                    <span className="text-steel mt-2 block text-[0.75rem] tracking-[0.1em] uppercase">
                      {download.format} · {fileSizeLabel(download.href) ?? download.size}
                    </span>
                  </span>
                  <Download
                    aria-hidden
                    className="text-steel size-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                </a>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Related products */}
      {related.length > 0 ? (
        <Section tone="void">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Related products</Eyebrow>
                <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                  Often specified alongside
                </h2>
              </div>
              <ArrowLink href="/products">All products</ArrowLink>
            </div>

            <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <RevealItem key={item.slug}>
                  <ProductCard product={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      <RecentlyViewed currentSlug={product.slug} />

      <CallToAction
        title={`Need ${product.name.toLowerCase()} on a schedule?`}
        description="Send sizes, quantities, grades and your delivery date. We will confirm availability, flag anything worth reconsidering, and quote line by line."
      />
    </>
  );
}

/** Every product is known at build time, so unknown slugs 404 immediately. */
export const dynamicParams = false;
