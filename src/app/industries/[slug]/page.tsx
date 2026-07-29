import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getIndustry, industrySlugs, industries } from '@/content/industries';
import { getProduct } from '@/content/products';
import { getService } from '@/content/services';
import { getProjectsByIndustry } from '@/content/projects';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow, ArrowLink } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { IndustryGlyph } from '@/components/visual/graphics';
import { ProductCard, ServiceCard, ProjectCard, RelatedLink } from '@/components/cards';
import { SmartCounter } from '@/components/motion/counter';
import { Button } from '@/components/ui/button';
import { CallToAction } from '@/components/home/sections';
import { cn, pad } from '@/lib/utils';

export function generateStaticParams() {
  return industrySlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);

  if (!industry) {
    return { title: 'Industry not found', robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: `${industry.name} Steel Supply`,
    description: industry.summary,
    path: `/industries/${industry.slug}`,
    keywords: [
      `${industry.name.toLowerCase()} steel`,
      `steel supplier ${industry.name.toLowerCase()}`,
    ],
  });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);

  if (!industry) notFound();

  const products = industry.products.map((s) => getProduct(s)).filter((p) => Boolean(p));
  const services = industry.services.map((s) => getService(s)).filter((s) => Boolean(s));
  const projects = getProjectsByIndustry(industry.slug);
  const otherIndustries = industries.filter((item) => item.slug !== industry.slug).slice(0, 6);

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Industries', href: '/industries' },
    { name: industry.name, href: `/industries/${industry.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Industry"
        title={industry.name}
        description={industry.tagline}
        trail={trail}
        meta={<IndustryGlyph name={industry.icon} size="lg" />}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/quote" size="lg" sheen>
            Request a Quote
            <ArrowRight aria-hidden />
          </Button>
          <Button href="/contact" size="lg" variant="outline">
            Talk to a specialist
          </Button>
        </div>
      </PageHero>

      {/* Overview + stats */}
      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
            <div>
              <Reveal direction="none">
                <Eyebrow>Overview</Eyebrow>
              </Reveal>
              <div className="mt-8 space-y-6">
                {industry.overview.map((paragraph, index) => (
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

            <Reveal direction="left">
              <dl className="bg-hairline grid gap-px overflow-hidden rounded-lg">
                {industry.stats.map((stat) => (
                  <div key={stat.label} className="bg-charcoal p-7">
                    <dd className="font-display text-metal text-3xl font-semibold">
                      <SmartCounter display={stat.value} />
                    </dd>
                    <dt className="text-steel mt-2 text-[0.8125rem] tracking-[0.1em] uppercase">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Challenges */}
      <Section tone="graphite" className="border-hairline border-y">
        <div className="container-page">
          <Reveal direction="none">
            <Eyebrow>What this sector demands</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display text-headline text-bright mt-6 max-w-3xl font-semibold">
              The three problems that decide whether a {industry.name.toLowerCase()} steel package
              succeeds.
            </h2>
          </Reveal>

          <RevealGroup className="bg-hairline mt-14 grid gap-px overflow-hidden rounded-lg lg:grid-cols-3">
            {industry.challenges.map((challenge, index) => (
              <RevealItem key={challenge.title} className="bg-graphite p-7 sm:p-9">
                <span className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">
                  {pad(index + 1)}
                </span>
                <h3 className="font-display text-title text-bright mt-5 font-semibold">
                  {challenge.title}
                </h3>
                <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">{challenge.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Products */}
      <Section tone="void">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Products</Eyebrow>
              <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                What we typically supply
              </h2>
            </div>
            <ArrowLink href="/products">All products</ArrowLink>
          </div>

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) =>
              product ? (
                <RevealItem key={product.slug}>
                  <ProductCard product={product} />
                </RevealItem>
              ) : null,
            )}
          </RevealGroup>

          {products.length > 3 ? (
            <RevealGroup className="mt-6 grid gap-4 sm:grid-cols-2" stagger={0.05}>
              {products.slice(3).map((product) =>
                product ? (
                  <RevealItem key={product.slug}>
                    <RelatedLink
                      href={`/products/${product.slug}`}
                      title={product.name}
                      meta={product.tagline}
                    />
                  </RevealItem>
                ) : null,
              )}
            </RevealGroup>
          ) : null}
        </div>
      </Section>

      {/* Services */}
      <Section tone="graphite" className="border-hairline border-y">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>Services</Eyebrow>
              <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                How we support {industry.name.toLowerCase()} work
              </h2>
            </div>
            <ArrowLink href="/services">All services</ArrowLink>
          </div>

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) =>
              service ? (
                <RevealItem key={service.slug}>
                  <ServiceCard service={service} index={index} />
                </RevealItem>
              ) : null,
            )}
          </RevealGroup>
        </div>
      </Section>

      {/* Projects */}
      {projects.length > 0 ? (
        <Section tone="void">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Case studies</Eyebrow>
                <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                  {industry.name} projects
                </h2>
              </div>
              <ArrowLink href="/projects">All projects</ArrowLink>
            </div>

            <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <RevealItem key={project.slug}>
                  <ProjectCard project={project} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      {/* Other industries */}
      <Section tone="graphite" size="sm" className="border-hairline border-t">
        <div className="container-page">
          <Eyebrow>Other sectors</Eyebrow>
          <RevealGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
            {otherIndustries.map((item) => (
              <RevealItem key={item.slug}>
                <RelatedLink
                  href={`/industries/${item.slug}`}
                  title={item.name}
                  meta={item.tagline}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CallToAction
        title={`Building in ${industry.name.toLowerCase()}?`}
        description="Send us the drawings, the schedule or just the question you are stuck on. We will come back with something useful within one business day."
      />
    </>
  );
}
