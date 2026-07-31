import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Layers, Building2 } from 'lucide-react';
import { getProject, projectSlugs, projects } from '@/content/projects';
import { getProduct } from '@/content/products';
import { getService } from '@/content/services';
import { getIndustry } from '@/content/industries';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow, ArrowLink } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ProjectArt, artVariantFor } from '@/components/visual/graphics';
import { ProjectCard, RelatedLink } from '@/components/cards';
import { SmartCounter } from '@/components/motion/counter';
import { Badge } from '@/components/ui/misc';
import { CallToAction } from '@/components/home/sections';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: 'Project not found', robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: project.name,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const industry = getIndustry(project.industry);
  const productsUsed = project.productsUsed.map((s) => getProduct(s)).filter((p) => Boolean(p));
  const servicesUsed = project.servicesUsed.map((s) => getService(s)).filter((s) => Boolean(s));
  const others = projects.filter((item) => item.slug !== project.slug).slice(0, 3);

  const variant = artVariantFor(project.industry);

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: project.name, href: `/projects/${project.slug}` },
  ];

  const facts = [
    { icon: MapPin, label: 'Location', value: `${project.location}, ${project.country}` },
    { icon: Building2, label: 'Industry', value: industry?.name ?? project.industry },
    { icon: Calendar, label: 'Completed', value: `${project.year} · ${project.timeline}` },
    { icon: Layers, label: 'Scale', value: project.scale },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Case study"
        title={project.name}
        description={project.summary}
        trail={trail}
        meta={
          <div className="flex flex-wrap gap-2">
            <Badge tone="metal">{project.year}</Badge>
            <Badge tone="arc">{industry?.name ?? project.industry}</Badge>
            <Badge tone="default">{project.scale}</Badge>
          </div>
        }
      />

      {/* Hero artwork */}
      <div className="border-hairline relative aspect-16/9 max-h-[32rem] w-full overflow-hidden border-b sm:aspect-21/9">
        <ProjectArt seed={project.slug.length * 31 + project.year.length} variant={variant} />
        <div
          aria-hidden
          className="from-void absolute inset-0 bg-linear-to-t via-transparent to-transparent"
        />
        <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden />
      </div>

      {/* Facts */}
      <Section tone="void" size="sm">
        <div className="container-page">
          <RevealGroup className="bg-hairline grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <RevealItem key={fact.label} className="bg-charcoal p-6">
                <fact.icon aria-hidden className="text-steel size-4" />
                <p className="text-steel mt-4 text-[0.6875rem] tracking-[0.14em] uppercase">
                  {fact.label}
                </p>
                <p className="text-bright mt-2 text-[0.9375rem] font-medium">{fact.value}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Overview */}
      <Section tone="void" size="sm">
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
            <div>
              <Reveal direction="none">
                <Eyebrow>Overview</Eyebrow>
              </Reveal>
              <div className="mt-8 space-y-6">
                {project.overview.map((paragraph, index) => (
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
              <dl className="bg-hairline grid gap-px overflow-hidden rounded-lg">
                {project.metrics.map((metric) => (
                  <div key={metric.label} className="bg-charcoal p-6">
                    <dd className="font-display text-metal text-2xl font-semibold">
                      <SmartCounter display={metric.value} />
                    </dd>
                    <dt className="text-steel mt-1.5 text-[0.8125rem]">{metric.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="border-hairline bg-charcoal mt-6 rounded-lg border p-6">
                <p className="text-eyebrow text-steel uppercase">Client</p>
                <p className="text-chalk mt-3 text-[0.9375rem]">{project.client}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Challenge / solution / outcome */}
      <Section tone="graphite" className="border-hairline border-y">
        <div className="container-page">
          <RevealGroup className="bg-hairline grid gap-px overflow-hidden rounded-lg lg:grid-cols-3">
            {[
              { title: 'The challenge', body: project.challenge },
              { title: 'What we did', body: project.solution },
              { title: 'The outcome', body: project.outcome },
            ].map((block, index) => (
              <RevealItem key={block.title} className="bg-graphite p-7 sm:p-9">
                <span className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">
                  0{index + 1}
                </span>
                <h2 className="font-display text-title text-bright mt-5 font-semibold">
                  {block.title}
                </h2>
                <p className="text-ash mt-4 text-[0.9375rem] leading-relaxed">{block.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Gallery */}
      <Section tone="void">
        <div className="container-page">
          <Reveal direction="none">
            <Eyebrow>Gallery</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display text-headline text-bright mt-6 font-semibold">
              From the project
            </h2>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
            {project.gallery.map((item, index) => (
              <RevealItem key={item.caption}>
                <figure
                  className={cn(
                    'group border-hairline bg-graphite overflow-hidden rounded-md border',
                    index === 0 ? 'sm:col-span-2' : '',
                  )}
                >
                  <div
                    className={cn(
                      'relative overflow-hidden',
                      index === 0 ? 'aspect-21/9' : 'aspect-4/3',
                    )}
                  >
                    <div className="absolute inset-0 transition-transform duration-[1200ms] [transition-timing-function:var(--ease-out-quint)] group-hover:scale-105">
                      <ProjectArt seed={item.seed} variant={variant} />
                    </div>
                    <div className="bg-grain pointer-events-none absolute inset-0" aria-hidden />
                  </div>
                  <figcaption className="border-hairline text-ash border-t px-5 py-3.5 text-[0.8125rem]">
                    {item.caption}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* Products & services used */}
      <Section tone="graphite" className="border-hairline border-y">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow>Products used</Eyebrow>
              <RevealGroup className="mt-8 grid gap-4" stagger={0.05}>
                {productsUsed.map((product) =>
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
            </div>

            <div>
              <Eyebrow>Services delivered</Eyebrow>
              <RevealGroup className="mt-8 grid gap-4" stagger={0.05}>
                {servicesUsed.map((service) =>
                  service ? (
                    <RevealItem key={service.slug}>
                      <RelatedLink
                        href={`/services/${service.slug}`}
                        title={service.name}
                        meta={service.tagline}
                      />
                    </RevealItem>
                  ) : null,
                )}
              </RevealGroup>
            </div>
          </div>
        </div>
      </Section>

      {/* More projects */}
      <Section tone="void">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>More work</Eyebrow>
              <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                Other projects
              </h2>
            </div>
            <ArrowLink href="/projects">All projects</ArrowLink>
          </div>

          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <RevealItem key={item.slug}>
                <ProjectCard project={item} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      <CallToAction
        title="Have a project like this?"
        description="Send us the drawings and the programme. We will tell you honestly what is achievable, including the parts that are not."
        primary={{ label: 'Request a Quote', href: '/quote' }}
        secondary={{ label: 'Speak to an engineer', href: '/contact' }}
      />
    </>
  );
}
