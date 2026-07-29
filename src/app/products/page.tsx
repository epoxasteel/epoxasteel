import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { products, productCategories } from '@/content/products';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, SectionHeading, JsonLd } from '@/components/layout/section';
import { RevealGroup, RevealItem, Reveal } from '@/components/motion/reveal';
import { ProductCard } from '@/components/cards';
import { CallToAction } from '@/components/home/sections';
import { Button } from '@/components/ui/button';
import { slugify } from '@/lib/utils';

export const metadata: Metadata = buildMetadata({
  title: 'Steel Products',
  description:
    'Structural sections, plate, sheet, hollow section, bar, reinforcement and stainless steel — supplied to ASTM and EN standards with full mill certification.',
  path: '/products',
  keywords: [
    'steel products catalogue',
    'structural sections',
    'steel plate supplier',
    'hollow sections',
    'rebar supplier',
  ],
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
];

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Products"
        title="Thirteen product families. One standard of documentation."
        description="Everything we supply arrives with mill certificates matched to heat numbers, cut to your lengths, and processed to your drawings. Browse by category, or send us a schedule and we will quote it line by line."
        trail={trail}
      >
        <div className="flex flex-wrap gap-3">
          <Button href="/quote" size="lg" sheen>
            Request a Quote
            <ArrowRight aria-hidden />
          </Button>
          <Button href="/contact" size="lg" variant="outline">
            Speak to a specialist
          </Button>
        </div>
      </PageHero>

      {/* Category jump bar */}
      <div className="border-hairline bg-void/90 sticky top-(--header-h) z-30 border-b backdrop-blur-xl">
        <div className="container-page">
          <nav aria-label="Product categories" className="-mx-1 overflow-x-auto">
            <ul className="flex min-w-max gap-1 py-3">
              {productCategories.map((category) => (
                <li key={category}>
                  <a
                    href={`#${slugify(category)}`}
                    className="text-mist hover:text-bright inline-block rounded-sm px-3.5 py-2 text-[0.8125rem] transition-colors duration-250 hover:bg-white/[0.04]"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {productCategories.map((category, index) => {
        const items = products.filter((product) => product.category === category);
        if (items.length === 0) return null;

        return (
          <Section
            key={category}
            id={slugify(category)}
            tone={index % 2 === 0 ? 'void' : 'graphite'}
            className={index % 2 === 1 ? 'border-hairline border-y' : ''}
            size="sm"
          >
            <div className="container-page">
              <SectionHeading
                eyebrow={`${items.length} product${items.length === 1 ? '' : 's'}`}
                title={category}
                description={categoryBlurb[category]}
              />

              <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <RevealItem key={product.slug}>
                    <ProductCard product={product} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          </Section>
        );
      })}

      <Section tone="void" size="sm">
        <div className="container-page">
          <Reveal>
            <div className="border-hairline bg-charcoal rounded-lg border p-8 sm:p-12">
              <h2 className="font-display text-headline text-bright font-semibold">
                Not finding the grade or size you need?
              </h2>
              <p className="text-lead text-ash mt-4 max-w-2xl">
                Non-standard grades, unusual sizes, special lengths and heritage profiles are
                sourced mill-direct as a managed process. We will tell you quickly whether an order
                is viable, what it costs and when it can roll — before you commit to anything.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/services/custom-orders" variant="outline">
                  Custom orders
                  <ArrowRight aria-hidden />
                </Button>
                <Button href="/quote" variant="ghost">
                  Send us a specification
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <CallToAction />
    </>
  );
}

const categoryBlurb: Record<string, string> = {
  Structural:
    'Wide-flange, channel, angle and tee sections in the grades specifications call for — held in depth so most orders ship from stock.',
  'Flat Products':
    'Plate and sheet from 0.5 mm to 200 mm, profiled to your DXF on laser, plasma or oxy-fuel, and levelled flat before it ships.',
  'Hollow Sections':
    'Square, rectangular and circular hollow sections in cold-formed and hot-finished condition, including matched-heat supply for exposed steelwork.',
  'Bar & Reinforcement':
    'Round, square, flat and hexagonal bar alongside deformed reinforcement, mesh and cut-and-bent schedules delivered tagged by pour.',
  'Coated & Stainless':
    'Hot-dip galvanizing to a fifty-year design life, and austenitic and duplex stainless processed in a dedicated, contamination-free area.',
  Fabrication:
    'Cutting, drilling, coping, welding, blasting and coating under one roof — and one release certificate covering all of it.',
};
