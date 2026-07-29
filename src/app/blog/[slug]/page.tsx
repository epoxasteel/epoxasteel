import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { getPost, getRelatedPosts, postSlugs } from '@/content/posts';
import { buildMetadata, breadcrumbSchema, articleSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow, ArrowLink } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { Article, TableOfContents } from '@/components/article';
import { PostCard } from '@/components/cards';
import { Badge, TagList } from '@/components/ui/misc';
import { CallToAction } from '@/components/home/sections';
import { markdownToText, extractHeadings } from '@/lib/markdown';
import { formatDate, readingTime, slugify, cn } from '@/lib/utils';

export function generateStaticParams() {
  return postSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return { title: 'Article not found', robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: 'article',
    keywords: post.tags,
    publishedTime: post.published,
    modifiedTime: post.updated ?? post.published,
    authors: [post.author.name],
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const related = getRelatedPosts(slug);
  const headings = extractHeadings(post.body);
  const minutes = readingTime(markdownToText(post.body));

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          articleSchema({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            published: post.published,
            updated: post.updated,
            author: post.author.name,
          }),
        ]}
      />

      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        trail={trail}
        meta={
          <div className="text-steel flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.875rem]">
            <span className="flex items-center gap-2">
              <span className="border-hairline bg-graphite text-mist grid size-9 place-items-center rounded-full border text-[0.6875rem] font-medium">
                {post.author.name
                  .split(' ')
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')}
              </span>
              <span>
                <span className="text-chalk block text-[0.875rem] font-medium">
                  {post.author.name}
                </span>
                <span className="text-steel block text-[0.8125rem]">{post.author.role}</span>
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar aria-hidden className="size-3.5" />
              <time dateTime={post.published}>{formatDate(post.published)}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" />
              {minutes} min read
            </span>
          </div>
        }
      />

      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] lg:gap-20">
            <div className="min-w-0">
              <Reveal direction="none">
                <Article body={post.body} />
              </Reveal>

              <Reveal delay={0.1}>
                <div className="border-hairline mt-14 border-t pt-8">
                  <p className="text-eyebrow text-steel uppercase">Topics</p>
                  <TagList items={post.tags} className="mt-4" />
                </div>
              </Reveal>

              <Reveal delay={0.14}>
                <div className="border-hairline bg-charcoal mt-10 rounded-lg border p-7">
                  <div className="flex flex-wrap items-start gap-5">
                    <span className="border-hairline-strong bg-graphite font-display text-metal grid size-14 shrink-0 place-items-center rounded-full border text-lg font-semibold">
                      {post.author.name
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-title text-bright font-semibold">
                        {post.author.name}
                      </p>
                      <p className="text-arc-glow/80 mt-1 text-[0.875rem]">{post.author.role}</p>
                      <p className="text-ash measure mt-4 text-[0.9375rem] leading-relaxed">
                        Part of the team that writes, checks and stands behind the technical
                        guidance we publish. Questions on this article reach the author directly.
                      </p>
                      <ArrowLink href="/contact" className="mt-5">
                        Ask a question
                      </ArrowLink>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="mt-10">
                <Link
                  href="/blog"
                  className="group text-mist hover:text-bright inline-flex items-center gap-2.5 text-[0.875rem] transition-colors"
                >
                  <ArrowLeft
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                  />
                  All articles
                </Link>
              </div>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <TableOfContents headings={headings} />

              <div className="border-hairline bg-charcoal mt-10 rounded-lg border p-6">
                <p className="text-eyebrow text-steel uppercase">Category</p>
                <Link
                  href={`/blog/category/${slugify(post.category)}`}
                  className="mt-4 inline-block"
                >
                  <Badge tone="arc">{post.category}</Badge>
                </Link>
                <p className="text-ash mt-5 text-[0.875rem] leading-relaxed">
                  Browse everything we have published in this category.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="graphite" className={cn('border-hairline border-t')}>
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Keep reading</Eyebrow>
                <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                  Related articles
                </h2>
              </div>
              <ArrowLink href="/blog">All articles</ArrowLink>
            </div>

            <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <RevealItem key={item.slug}>
                  <PostCard post={item} className="h-full" />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}

      <CallToAction
        title="Put this into practice on your next project."
        description="Send us the drawings or the question. Our engineers respond within one working day, with the reasoning attached."
        primary={{ label: 'Request a Quote', href: '/quote' }}
        secondary={{ label: 'Ask a question', href: '/contact' }}
      />
    </>
  );
}
