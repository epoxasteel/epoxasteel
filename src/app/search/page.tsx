import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { search, groupResults } from '@/lib/search';
import { buildMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { PageHero, Section, Eyebrow } from '@/components/layout/section';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { BlogSearch } from '@/components/blog/blog-search';
import { CallToAction } from '@/components/home/sections';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  ...buildMetadata({
    title: 'Search',
    description: `Search products, services, industries, projects and articles across ${siteConfig.legalName}.`,
    path: '/search',
    noIndex: true,
  }),
};

const suggestions = [
  { label: 'Steel beams', href: '/products/steel-beams' },
  { label: 'Reinforcing steel', href: '/products/reinforcing-steel' },
  { label: 'Galvanized steel', href: '/products/galvanized-steel' },
  { label: 'Custom fabrication', href: '/products/custom-fabrication' },
  { label: 'Engineering support', href: '/services/engineering-support' },
  { label: 'Logistics', href: '/services/logistics' },
  { label: 'Bridges', href: '/industries/bridges' },
  { label: 'Projects', href: '/projects' },
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? '').trim();
  const results = query.length >= 2 ? search(query, 60) : [];
  const groups = groupResults(results);

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={query ? `Results for “${query}”` : 'Search EPOXA STEEL'}
        description={
          query
            ? `${results.length} result${results.length === 1 ? '' : 's'} across products, services, industries, projects and articles.`
            : 'Search the full catalogue, products, grades, services, industries, case studies and technical articles.'
        }
        trail={[
          { name: 'Home', href: '/' },
          { name: 'Search', href: '/search' },
        ]}
      >
        <BlogSearch />
      </PageHero>

      <Section tone="void">
        <div className="container-page">
          {query.length >= 2 && results.length === 0 ? (
            <div className="max-w-2xl">
              <h2 className="font-display text-headline text-bright font-semibold">
                Nothing matched that.
              </h2>
              <p className="text-lead text-ash mt-5">
                Try a product name, a grade designation, or the sector you are building in. If it is
                something we should stock and do not, tell us ,{' '}
                <Link href="/contact" className="text-arc-glow underline underline-offset-4">
                  we source non-standard material mill-direct
                </Link>
                .
              </p>
            </div>
          ) : null}

          {query.length > 0 && query.length < 2 ? (
            <p className="text-lead text-ash">Enter at least two characters to search.</p>
          ) : null}

          {groups.length > 0 ? (
            <div className="space-y-16">
              {groups.map((group) => (
                <div key={group.type}>
                  <Eyebrow>
                    {group.type} · {group.results.length}
                  </Eyebrow>

                  <RevealGroup
                    className="bg-hairline mt-7 grid gap-px overflow-hidden rounded-lg"
                    stagger={0.04}
                  >
                    {group.results.map((result) => (
                      <RevealItem key={result.id}>
                        <Link
                          href={result.href}
                          className={cn(
                            'group bg-charcoal flex items-start justify-between gap-6 p-6',
                            'hover:bg-slate transition-colors duration-400',
                          )}
                        >
                          <span className="min-w-0">
                            <span className="text-bright block text-[1.0625rem] font-medium">
                              {result.title}
                            </span>
                            <span className="text-ash mt-1.5 block text-[0.9375rem] leading-relaxed">
                              {result.description}
                            </span>
                            <span className="text-steel mt-2.5 block font-mono text-[0.75rem]">
                              {result.href}
                            </span>
                          </span>
                          <ArrowUpRight
                            aria-hidden
                            className="text-steel mt-1 size-4 shrink-0 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </Link>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </div>
              ))}
            </div>
          ) : null}

          {!query ? (
            <div>
              <Eyebrow>Popular destinations</Eyebrow>
              <RevealGroup className="mt-7 flex flex-wrap gap-3" stagger={0.04}>
                {suggestions.map((suggestion) => (
                  <RevealItem key={suggestion.href}>
                    <Link
                      href={suggestion.href}
                      className={cn(
                        'border-hairline bg-charcoal inline-block rounded-sm border px-4 py-2.5',
                        'text-mist text-[0.875rem] transition-colors duration-300',
                        'hover:border-hairline-strong hover:text-bright',
                      )}
                    >
                      {suggestion.label}
                    </Link>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ) : null}
        </div>
      </Section>

      <CallToAction
        title="Cannot find what you need?"
        description="If it is steel, we can usually source it, including non-standard grades, unusual sizes and obsolete profiles for heritage work."
        primary={{ label: 'Ask our team', href: '/contact' }}
        secondary={{ label: 'Request a Quote', href: '/quote' }}
      />
    </>
  );
}
