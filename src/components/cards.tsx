import Link from 'next/link';
import { ArrowUpRight, Clock, MapPin, Calendar } from 'lucide-react';
import type { Product, Industry, Service, Project, Post, Job } from '@/content/types';
import { Card, LinkCard, CardEdgeGlow } from '@/components/ui/card';
import { SteelProfile } from '@/components/visual/steel-profile';
import {
  IndustryGlyph,
  ServiceGlyph,
  ProjectArt,
  artVariantFor,
} from '@/components/visual/graphics';
import { Badge } from '@/components/ui/misc';
import { cn, formatDateShort, readingTime } from '@/lib/utils';
import { markdownToText } from '@/lib/markdown';

/**
 * Shared listing cards.
 *
 * Every grid on the site — homepage, category pages, related sections — is
 * built from these, so a product looks identical wherever it appears.
 */

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  return (
    <LinkCard
      href={`/products/${product.slug}`}
      ariaLabel={`${product.name} — ${product.tagline}`}
      className={cn('flex h-full flex-col', className)}
    >
      <CardEdgeGlow />

      <div className="border-hairline bg-graphite relative aspect-16/10 overflow-hidden border-b">
        <div className="bg-grid-fine absolute inset-0 opacity-60" aria-hidden />
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover/card:opacity-100"
          style={{
            background:
              'radial-gradient(70% 60% at 50% 45%, rgba(28,98,174,0.2) 0%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 grid place-items-center p-8">
          <SteelProfile
            profile={product.profile}
            showGrid={false}
            className="max-h-full max-w-40 transition-transform duration-700 [transition-timing-function:var(--ease-out-quint)] group-hover/card:scale-105"
          />
        </div>
        <Badge tone="default" className="absolute top-4 left-4">
          {product.category}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-title text-bright font-semibold transition-colors duration-300 group-hover/card:text-white">
          {product.name}
        </h3>
        <p className="text-ash mt-2.5 flex-1 text-[0.9375rem] leading-relaxed">{product.summary}</p>

        <div className="border-hairline mt-6 flex items-center justify-between border-t pt-4">
          <span className="text-steel text-[0.75rem] tracking-[0.1em] uppercase">
            {product.grades.length} grades
          </span>
          <span
            aria-hidden
            className={cn(
              'border-hairline text-steel grid size-8 place-items-center rounded-full border',
              'transition-all duration-400 [transition-timing-function:var(--ease-out-quint)]',
              'group-hover/card:border-arc-bright group-hover/card:bg-arc/15 group-hover/card:text-arc-glow',
            )}
          >
            <ArrowUpRight className="size-3.5 transition-transform duration-400 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </LinkCard>
  );
}

export function IndustryCard({ industry, className }: { industry: Industry; className?: string }) {
  return (
    <LinkCard
      href={`/industries/${industry.slug}`}
      ariaLabel={`${industry.name} — ${industry.tagline}`}
      className={cn('flex h-full flex-col p-6 sm:p-7', className)}
    >
      <CardEdgeGlow />
      <IndustryGlyph name={industry.icon} />

      <h3 className="font-display text-title text-bright mt-6 font-semibold transition-colors duration-300 group-hover/card:text-white">
        {industry.name}
      </h3>
      <p className="text-arc-glow/80 mt-2 text-[0.875rem]">{industry.tagline}</p>
      <p className="text-ash measure-wide mt-4 flex-1 text-[0.9375rem] leading-relaxed">
        {industry.summary}
      </p>

      <dl className="border-hairline mt-6 flex flex-wrap gap-x-7 gap-y-3 border-t pt-5">
        {industry.stats.slice(0, 2).map((stat) => (
          <div key={stat.label}>
            <dt className="text-steel text-[0.6875rem] tracking-[0.12em] uppercase">
              {stat.label}
            </dt>
            <dd className="font-display text-chalk mt-1 text-lg font-semibold">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </LinkCard>
  );
}

export function ServiceCard({
  service,
  index,
  className,
}: {
  service: Service;
  index?: number;
  className?: string;
}) {
  return (
    <LinkCard
      href={`/services/${service.slug}`}
      ariaLabel={`${service.name} — ${service.tagline}`}
      className={cn('flex h-full flex-col p-6 sm:p-7', className)}
    >
      <CardEdgeGlow />

      <div className="flex items-start justify-between gap-4">
        <ServiceGlyph name={service.icon} />
        {typeof index === 'number' ? (
          <span className="text-steel font-mono text-[0.8125rem] tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>
        ) : null}
      </div>

      <h3 className="font-display text-title text-bright mt-6 font-semibold transition-colors duration-300 group-hover/card:text-white">
        {service.name}
      </h3>
      <p className="text-arc-glow/80 mt-2 text-[0.875rem]">{service.tagline}</p>
      <p className="text-ash measure-wide mt-4 flex-1 text-[0.9375rem] leading-relaxed">
        {service.summary}
      </p>

      <ul className="border-hairline mt-6 space-y-2 border-t pt-5">
        {service.capabilities.slice(0, 3).map((capability) => (
          <li key={capability} className="text-mist flex gap-2.5 text-[0.8125rem]">
            <span aria-hidden className="bg-arc-bright mt-[0.45rem] size-1 shrink-0 rotate-45" />
            {capability}
          </li>
        ))}
      </ul>
    </LinkCard>
  );
}

export function ProjectCard({
  project,
  className,
  featured = false,
}: {
  project: Project;
  className?: string;
  featured?: boolean;
}) {
  return (
    <LinkCard
      href={`/projects/${project.slug}`}
      ariaLabel={`${project.name} — ${project.summary}`}
      className={cn('flex h-full flex-col', className)}
    >
      <CardEdgeGlow />

      <div
        className={cn(
          'border-hairline relative overflow-hidden border-b',
          featured ? 'aspect-16/9' : 'aspect-4/3',
        )}
      >
        <div className="absolute inset-0 transition-transform duration-[1100ms] [transition-timing-function:var(--ease-out-quint)] group-hover/card:scale-105">
          <ProjectArt
            seed={project.slug.length * 31 + project.year.length}
            variant={artVariantFor(project.industry)}
          />
        </div>
        <div
          aria-hidden
          className="from-charcoal via-charcoal/20 absolute inset-0 bg-linear-to-t to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-5">
          <Badge tone="metal">{project.year}</Badge>
          <Badge tone="default">{project.scale}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3
          className={cn(
            'font-display text-bright font-semibold transition-colors duration-300 group-hover/card:text-white',
            featured ? 'text-headline' : 'text-title',
          )}
        >
          {project.name}
        </h3>

        <p className="text-steel mt-2.5 flex items-center gap-1.5 text-[0.8125rem]">
          <MapPin aria-hidden className="size-3.5" />
          {project.location}
        </p>

        <p className="text-ash measure-wide mt-4 flex-1 text-[0.9375rem] leading-relaxed">
          {project.summary}
        </p>

        <dl className="border-hairline mt-6 grid grid-cols-2 gap-4 border-t pt-5">
          {project.metrics.slice(0, 2).map((metric) => (
            <div key={metric.label}>
              <dt className="text-steel text-[0.6875rem] tracking-[0.12em] uppercase">
                {metric.label}
              </dt>
              <dd className="font-display text-chalk mt-1 text-lg font-semibold">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </LinkCard>
  );
}

export function PostCard({
  post,
  className,
  featured = false,
}: {
  post: Post;
  className?: string;
  featured?: boolean;
}) {
  const minutes = readingTime(markdownToText(post.body));

  return (
    <LinkCard
      href={`/blog/${post.slug}`}
      ariaLabel={post.title}
      className={cn('flex h-full flex-col', className)}
    >
      <CardEdgeGlow />

      {featured ? (
        <div className="border-hairline relative aspect-16/9 overflow-hidden border-b">
          <div className="absolute inset-0 transition-transform duration-[1100ms] group-hover/card:scale-105">
            <ProjectArt seed={post.slug.length * 17 + post.title.length} variant="tower" />
          </div>
          <div
            aria-hidden
            className="from-charcoal via-charcoal/25 absolute inset-0 bg-linear-to-t to-transparent"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="arc">{post.category}</Badge>
          <span className="text-steel flex items-center gap-1.5 text-[0.75rem]">
            <Calendar aria-hidden className="size-3" />
            {formatDateShort(post.published)}
          </span>
          <span className="text-steel flex items-center gap-1.5 text-[0.75rem]">
            <Clock aria-hidden className="size-3" />
            {minutes} min read
          </span>
        </div>

        <h3
          className={cn(
            'font-display text-bright mt-4 font-semibold transition-colors duration-300 group-hover/card:text-white',
            featured ? 'text-headline' : 'text-title',
          )}
        >
          {post.title}
        </h3>

        <p className="text-ash measure-wide mt-3 flex-1 text-[0.9375rem] leading-relaxed">
          {post.excerpt}
        </p>

        <div className="border-hairline mt-6 flex items-center gap-3 border-t pt-5">
          <span className="border-hairline bg-graphite text-mist grid size-9 shrink-0 place-items-center rounded-full border text-[0.6875rem] font-medium">
            {post.author.name
              .split(' ')
              .map((part) => part[0])
              .slice(0, 2)
              .join('')}
          </span>
          <span className="min-w-0">
            <span className="text-chalk block truncate text-[0.8125rem] font-medium">
              {post.author.name}
            </span>
            <span className="text-steel block truncate text-[0.75rem]">{post.author.role}</span>
          </span>
        </div>
      </div>
    </LinkCard>
  );
}

export function JobCard({ job, className }: { job: Job; className?: string }) {
  return (
    <LinkCard
      href={`/careers/${job.slug}`}
      ariaLabel={`${job.title} — ${job.location}`}
      className={cn('flex h-full flex-col p-6 sm:p-7', className)}
    >
      <CardEdgeGlow />

      <div className="flex flex-wrap items-center gap-2.5">
        <Badge tone="metal">{job.department}</Badge>
        <Badge tone="default">{job.type}</Badge>
      </div>

      <h3 className="font-display text-title text-bright mt-5 font-semibold transition-colors duration-300 group-hover/card:text-white">
        {job.title}
      </h3>

      <p className="text-steel mt-2 flex items-center gap-1.5 text-[0.8125rem]">
        <MapPin aria-hidden className="size-3.5" />
        {job.location}
      </p>

      <p className="text-ash measure-wide mt-4 flex-1 text-[0.9375rem] leading-relaxed">
        {job.summary}
      </p>

      <span className="border-hairline text-steel mt-6 flex items-center justify-between border-t pt-5 text-[0.8125rem]">
        Posted {formatDateShort(job.posted)}
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-400 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
        />
      </span>
    </LinkCard>
  );
}

/** Compact link row used in "related" rails and sidebars. */
export function RelatedLink({
  href,
  title,
  meta,
  className,
}: {
  href: string;
  title: string;
  meta?: string;
  className?: string;
}) {
  return (
    <Card interactive className={cn('group/card', className)}>
      <Link
        href={href}
        className="flex items-center justify-between gap-4 px-5 py-4 focus:outline-none"
      >
        <span className="min-w-0">
          <span className="text-chalk group-hover/card:text-bright block truncate text-[0.9375rem] font-medium transition-colors">
            {title}
          </span>
          {/* Two lines, not one with an ellipsis. At every width we tested,
              single-line truncation cut these taglines mid-word — so the copy
              was written, shipped and never once read to the end. */}
          {meta ? (
            <span className="text-steel mt-0.5 line-clamp-2 block text-[0.8125rem] leading-snug">
              {meta}
            </span>
          ) : null}
        </span>
        <ArrowUpRight
          aria-hidden
          className="text-steel size-4 shrink-0 transition-transform duration-400 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
        />
      </Link>
    </Card>
  );
}
