import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostsByCategory, postCategories } from '@/content/posts';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd } from '@/components/layout/section';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { PostCard } from '@/components/cards';
import { Pagination } from '@/components/ui/misc';
import { CallToAction } from '@/components/home/sections';
import { paginate, slugify, cn } from '@/lib/utils';

const PER_PAGE = 9;

export function generateStaticParams() {
  return postCategories.map((category) => ({ category: slugify(category) }));
}

export const dynamicParams = false;

function resolveCategory(slug: string) {
  return postCategories.find((category) => slugify(category) === slug);
}

const descriptions: Record<string, string> = {
  Engineering:
    'Grade selection, connection detail, welding and corrosion protection — written by chartered engineers who work with steel every day.',
  'Market Insight':
    'Pricing, capacity, lead times and procurement strategy, read honestly rather than optimistically.',
  Sustainability:
    'Embodied carbon, production routes, recycled content and what the numbers actually mean when you compare them.',
  'Company News':
    'Investment, capacity, certification and the changes that affect what we can promise you.',
  'Project Story': 'What happened on real jobs — including the parts that were difficult.',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = resolveCategory(slug);

  if (!category) {
    return { title: 'Category not found', robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: `${category} Articles`,
    description: descriptions[category] ?? `Articles filed under ${category}.`,
    path: `/blog/category/${slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { category: slug } = await params;
  const { page: pageParam } = await searchParams;
  const category = resolveCategory(slug);

  if (!category) notFound();

  const all = getPostsByCategory(category);
  const { items, page, totalPages } = paginate(all, Number(pageParam) || 1, PER_PAGE);

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: category, href: `/blog/category/${slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Category"
        title={category}
        description={descriptions[category]}
        trail={trail}
      />

      <div className="border-hairline bg-void/90 sticky top-(--header-h) z-30 border-b backdrop-blur-xl">
        <div className="container-page">
          <nav aria-label="Article categories" className="-mx-1 overflow-x-auto">
            <ul className="flex min-w-max gap-1 py-3">
              <li>
                <Link
                  href="/blog"
                  className="text-mist hover:text-bright inline-block rounded-sm px-3.5 py-2 text-[0.8125rem] transition-colors duration-250 hover:bg-white/[0.04]"
                >
                  All articles
                </Link>
              </li>
              {postCategories.map((item) => {
                const active = item === category;
                return (
                  <li key={item}>
                    <Link
                      href={`/blog/category/${slugify(item)}`}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'inline-block rounded-sm px-3.5 py-2 text-[0.8125rem] transition-colors duration-250',
                        active
                          ? 'text-bright bg-white/[0.06]'
                          : 'text-mist hover:text-bright hover:bg-white/[0.04]',
                      )}
                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      <Section tone="void">
        <div className="container-page">
          {items.length > 0 ? (
            <>
              {/* Same missing level as /blog: the page title is an <h1> and the
                  cards are <h3>s, so the outline skipped a step for anyone
                  navigating by heading. Announced, not drawn. */}
              <h2 className="sr-only">Articles in this category</h2>
              <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((post) => (
                  <RevealItem key={post.slug}>
                    <PostCard post={post} className="h-full" />
                  </RevealItem>
                ))}
              </RevealGroup>

              <Pagination
                page={page}
                totalPages={totalPages}
                basePath={`/blog/category/${slug}`}
                className="mt-16"
              />
            </>
          ) : (
            <p className="text-lead text-ash">
              Nothing published in this category yet.{' '}
              <Link href="/blog" className="text-arc-glow underline underline-offset-4">
                Browse all articles
              </Link>
              .
            </p>
          )}
        </div>
      </Section>

      <CallToAction />
    </>
  );
}
