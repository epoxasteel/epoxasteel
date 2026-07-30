import type { Metadata } from 'next';
import Link from 'next/link';
import { getSortedPosts, postCategories } from '@/content/posts';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd } from '@/components/layout/section';
import { RevealGroup, RevealItem } from '@/components/motion/reveal';
import { PostCard } from '@/components/cards';
import { Pagination } from '@/components/ui/misc';
import { CallToAction } from '@/components/home/sections';
import { paginate, slugify, cn } from '@/lib/utils';
import { BlogSearch } from '@/components/blog/blog-search';

const PER_PAGE = 9;

export const metadata: Metadata = buildMetadata({
  title: 'Insights & Blog',
  description:
    'Technical guidance, market conditions and project stories from the engineers, buyers and fabricators at Epoxa Steel.',
  path: '/blog',
});

const trail = [
  { name: 'Home', href: '/' },
  { name: 'Blog', href: '/blog' },
];

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const all = getSortedPosts();
  const { items, page, totalPages } = paginate(all, Number(pageParam) || 1, PER_PAGE);

  return (
    <>
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        eyebrow="Insights"
        title="Written by the people who do the work."
        description="Grade selection, galvanizing detail, market conditions and the logistics decisions that actually move an erection programme. No announcements dressed up as insight."
        trail={trail}
      >
        <BlogSearch />
      </PageHero>

      {/* Category filter */}
      <div className="border-hairline bg-void/90 sticky top-(--header-h) z-30 border-b backdrop-blur-xl">
        <div className="container-page">
          <nav aria-label="Article categories" className="-mx-1 overflow-x-auto">
            <ul className="flex min-w-max gap-1 py-3">
              <li>
                <span
                  aria-current="page"
                  className="text-bright inline-block rounded-sm bg-white/[0.06] px-3.5 py-2 text-[0.8125rem]"
                >
                  All articles
                </span>
              </li>
              {postCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/blog/category/${slugify(category)}`}
                    className={cn(
                      'text-mist inline-block rounded-sm px-3.5 py-2 text-[0.8125rem]',
                      'hover:text-bright transition-colors duration-250 hover:bg-white/[0.04]',
                    )}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <Section tone="void">
        <div className="container-page">
          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((post, index) => (
              <RevealItem
                key={post.slug}
                className={page === 1 && index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
              >
                <PostCard post={post} featured={page === 1 && index === 0} className="h-full" />
              </RevealItem>
            ))}
          </RevealGroup>

          <Pagination page={page} totalPages={totalPages} basePath="/blog" className="mt-16" />
        </div>
      </Section>

      <CallToAction
        title="Have a technical question we have not covered?"
        description="Our technical team answers material and welding queries within one working day, with the standard or calculation it relies on cited rather than asserted."
        primary={{ label: 'Ask our engineers', href: '/contact' }}
        secondary={{ label: 'Request a Quote', href: '/quote' }}
      />
    </>
  );
}
