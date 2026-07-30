import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getService, serviceSlugs, services } from '@/content/services';
import { getProduct } from '@/content/products';
import { buildMetadata, breadcrumbSchema, serviceSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow, ArrowLink } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ServiceGlyph } from '@/components/visual/graphics';
import { ProductCard, RelatedLink } from '@/components/cards';
import { Checklist } from '@/components/ui/misc';
import { Button } from '@/components/ui/button';
import { CallToAction } from '@/components/home/sections';
import { cn, pad } from '@/lib/utils';

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return { title: 'Service not found', robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: service.name,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) notFound();

  const relatedProducts = service.relatedProducts
    .map((s) => getProduct(s))
    .filter((p) => Boolean(p));
  const otherServices = services.filter((item) => item.slug !== service.slug).slice(0, 6);

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: service.name, href: `/services/${service.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          serviceSchema({
            name: service.name,
            description: service.summary,
            path: `/services/${service.slug}`,
          }),
        ]}
      />

      <PageHero
        eyebrow="Service"
        title={service.name}
        description={service.tagline}
        trail={trail}
        meta={<ServiceGlyph name={service.icon} size="lg" />}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/quote" size="lg" sheen>
            Request a Quote
            <ArrowRight aria-hidden />
          </Button>
          <Button href="/contact" size="lg" variant="outline">
            Ask a question
          </Button>
        </div>
      </PageHero>

      {/* Overview */}
      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
            <div>
              <Reveal direction="none">
                <Eyebrow>Overview</Eyebrow>
              </Reveal>
              <div className="mt-8 space-y-6">
                {service.overview.map((paragraph, index) => (
                  <Reveal key={index} delay={index * 0.06}>
                    <p
                      className={cn(
                        'measure leading-relaxed',
                        index === 0 ? 'text-lead text-mist' : 'text-ash text-[1.0625rem]',
                      )}
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal direction="left" className="lg:sticky lg:top-32 lg:self-start">
              <div className="border-hairline bg-charcoal rounded-lg border p-7">
                {/* An h2 set at 11px in dim grey reads as decoration, not as a
                    heading — and it heads a real list of content. Sized like
                    every other card heading on the site. */}
                <h2 className="font-display text-title text-bright font-semibold">Capabilities</h2>
                <Checklist items={service.capabilities} className="mt-6" />
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Process */}
      <Section tone="graphite" className="border-hairline border-y">
        <div className="container-page">
          <Reveal direction="none">
            <Eyebrow>The process</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display text-headline text-bright mt-6 max-w-3xl font-semibold">
              How {service.name.toLowerCase()} actually runs.
            </h2>
          </Reveal>

          <ol className="relative mt-14 max-w-4xl">
            {/* The vertical rail the timeline hangs from. */}
            <span
              aria-hidden
              className="bg-hairline absolute top-2 bottom-2 left-[1.4375rem] w-px sm:left-[1.6875rem]"
            />

            {service.process.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.06} as="li">
                <div className="relative flex gap-6 pb-10 last:pb-0 sm:gap-8">
                  <span
                    className={cn(
                      'relative z-10 grid size-12 shrink-0 place-items-center rounded-full',
                      'border-hairline-strong bg-graphite text-arc-bright border font-mono text-[0.8125rem] tabular-nums',
                      'sm:size-14',
                    )}
                  >
                    {pad(index + 1)}
                  </span>
                  <div className="pt-2.5 sm:pt-3.5">
                    <h3 className="font-display text-title text-bright font-semibold">
                      {step.title}
                    </h3>
                    <p className="text-ash measure mt-2.5 text-[1.0625rem] leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Deliverables */}
      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal direction="none">
                <Eyebrow>What you receive</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                  Deliverables, not promises.
                </h2>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-lead text-ash mt-6">
                  Every engagement produces documents you can file, check and hand to an inspector.
                  Here is exactly what comes out of this service.
                </p>
              </Reveal>
            </div>

            <RevealGroup className="bg-hairline grid gap-px overflow-hidden rounded-lg">
              {service.deliverables.map((deliverable, index) => (
                <RevealItem key={deliverable} className="bg-charcoal flex items-center gap-5 p-5">
                  <span className="text-steel font-mono text-[0.8125rem] tabular-nums">
                    {pad(index + 1)}
                  </span>
                  <span className="text-chalk text-[0.9375rem]">{deliverable}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* Related products */}
      {relatedProducts.length > 0 ? (
        <Section tone="graphite" className="border-hairline border-y">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Related products</Eyebrow>
                <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                  Products this service applies to
                </h2>
              </div>
              <ArrowLink href="/products">All products</ArrowLink>
            </div>

            <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((product) =>
                product ? (
                  <RevealItem key={product.slug}>
                    <ProductCard product={product} />
                  </RevealItem>
                ) : null,
              )}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      <Section tone="void" size="sm">
        <div className="container-page">
          <Eyebrow>Other services</Eyebrow>
          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {otherServices.map((item) => (
              <RevealItem key={item.slug}>
                <RelatedLink
                  href={`/services/${item.slug}`}
                  title={item.name}
                  meta={item.tagline}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CallToAction
        title={`Need ${service.name.toLowerCase()}?`}
        description="Send us the scope. We will tell you what it takes, what it costs and when we can do it — and if we are not the right supplier for it, we will tell you that too."
      />
    </>
  );
}
