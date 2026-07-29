import { getFeaturedProducts } from '@/content/products';
import { getFeaturedIndustries, industries } from '@/content/industries';
import { services } from '@/content/services';
import { getFeaturedProjects } from '@/content/projects';
import { getSortedPosts } from '@/content/posts';
import { Section, SectionHeading } from '@/components/layout/section';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { ProductCard, IndustryCard, ServiceCard, ProjectCard, PostCard } from '@/components/cards';
import { IndustryGlyph } from '@/components/visual/graphics';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Featured products                                                          */
/* -------------------------------------------------------------------------- */

export function FeaturedProducts() {
  const featured = getFeaturedProducts();

  return (
    <Section tone="graphite" className="border-hairline border-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Products"
          index={3}
          title="A catalogue built around what specifications actually call for."
          description="Thirteen product families held in the grades and sizes engineers specify — most orders ship from stock rather than waiting on a mill rolling window."
          action={{ label: 'View all products', href: '/products' }}
        />

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <RevealItem key={product.slug}>
              <ProductCard product={product} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Industries                                                                 */
/* -------------------------------------------------------------------------- */

export function IndustriesServed() {
  const featured = getFeaturedIndustries();
  const remainder = industries.filter((industry) => !industry.featured);

  return (
    <Section tone="void">
      <div className="container-page">
        <SectionHeading
          eyebrow="Industries"
          index={4}
          title="Twelve sectors. One standard."
          description="Each sector asks something different of a steel supplier. We have learned what — usually the hard way, on somebody's critical path."
          action={{ label: 'All industries', href: '/industries' }}
        />

        <RevealGroup className="mt-16 grid gap-6 lg:grid-cols-3">
          {featured.map((industry) => (
            <RevealItem key={industry.slug}>
              <IndustryCard industry={industry} />
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup
          className="bg-hairline mt-6 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.05}
        >
          {remainder.map((industry) => (
            <RevealItem key={industry.slug}>
              <Link
                href={`/industries/${industry.slug}`}
                className={cn(
                  'group/card bg-charcoal flex h-full items-center gap-4 p-5',
                  'hover:bg-slate transition-colors duration-400',
                )}
              >
                <IndustryGlyph name={industry.icon} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="text-chalk group-hover/card:text-bright block truncate text-[0.9375rem] font-medium transition-colors">
                    {industry.name}
                  </span>
                  <span className="text-steel mt-0.5 block truncate text-[0.8125rem]">
                    {industry.tagline}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="text-steel size-4 shrink-0 transition-transform duration-400 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                />
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export function ServicesOverview() {
  return (
    <Section tone="graphite" className="border-hairline border-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Services"
          index={5}
          title="Everything between the mill and your crane hook."
          description="Supply is where we start. Fabrication, engineering support and sequenced logistics are what turn material into a package your erector can actually build with."
          action={{ label: 'All services', href: '/services' }}
        />

        <RevealGroup className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <RevealItem key={service.slug}>
              <ServiceCard service={service} index={index} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export function ProjectShowcase() {
  const featured = getFeaturedProjects();
  const [lead, ...rest] = featured;

  if (!lead) return null;

  return (
    <Section tone="void">
      <div className="container-page">
        <SectionHeading
          eyebrow="Projects"
          index={7}
          title="Work that had to be right the first time."
          description="Fracture-critical bridge welds. A frame erected above live platforms. A grid connection that could not slip. The projects where the margin for error was zero."
          action={{ label: 'All projects', href: '/projects' }}
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <RevealGroup className="contents">
            <RevealItem className="lg:row-span-2">
              <ProjectCard project={lead} featured className="h-full" />
            </RevealItem>

            {rest.map((project) => (
              <RevealItem key={project.slug}>
                <ProjectCard project={project} className="h-full" />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* Latest news                                                                */
/* -------------------------------------------------------------------------- */

export function LatestNews() {
  const [lead, ...rest] = getSortedPosts().slice(0, 4);

  if (!lead) return null;

  return (
    <Section tone="void">
      <div className="container-page">
        <SectionHeading
          eyebrow="Insights"
          index={10}
          title="Written by the people who do the work."
          description="Technical guidance, market conditions and project stories from our engineers, buyers and shop floor — not a marketing department."
          action={{ label: 'Read the blog', href: '/blog' }}
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <RevealGroup className="contents">
            <RevealItem>
              <PostCard post={lead} featured className="h-full" />
            </RevealItem>

            <div className="grid gap-6">
              {rest.map((post) => (
                <RevealItem key={post.slug}>
                  <PostCard post={post} />
                </RevealItem>
              ))}
            </div>
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
