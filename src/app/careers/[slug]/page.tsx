import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, MapPin, Briefcase, Calendar } from 'lucide-react';
import { getJob, jobSlugs, jobs } from '@/content/careers';
import { siteConfig } from '@/lib/site';
import { buildMetadata, breadcrumbSchema, jobPostingSchema } from '@/lib/seo';
import { PageHero, Section, JsonLd, Eyebrow, ArrowLink } from '@/components/layout/section';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/reveal';
import { Checklist, Badge } from '@/components/ui/misc';
import { Button } from '@/components/ui/button';
import { JobCard } from '@/components/cards';
import { formatDate } from '@/lib/utils';

export function generateStaticParams() {
  return jobSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = getJob(slug);

  if (!job) {
    return { title: 'Role not found', robots: { index: false, follow: false } };
  }

  return buildMetadata({
    title: `${job.title} — ${job.location}`,
    description: job.summary,
    path: `/careers/${job.slug}`,
    keywords: [job.title.toLowerCase(), `${job.department.toLowerCase()} jobs`, 'steel careers'],
  });
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = getJob(slug);

  if (!job) notFound();

  const others = jobs.filter((item) => item.slug !== job.slug).slice(0, 3);

  const applyHref = `mailto:${siteConfig.contact.careersEmail}?subject=${encodeURIComponent(
    `Application: ${job.title}`,
  )}&body=${encodeURIComponent(
    `Hello,\n\nI would like to apply for the ${job.title} position in ${job.location}.\n\n(Please attach your CV and tell us briefly why you are a good fit.)\n\n`,
  )}`;

  const trail = [
    { name: 'Home', href: '/' },
    { name: 'Careers', href: '/careers' },
    { name: job.title, href: `/careers/${job.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(trail),
          jobPostingSchema({
            title: job.title,
            description: job.summary,
            path: `/careers/${job.slug}`,
            location: job.location,
            type: job.type,
            posted: job.posted,
          }),
        ]}
      />

      <PageHero
        eyebrow={job.department}
        title={job.title}
        description={job.summary}
        trail={trail}
        meta={
          <div className="text-steel flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.875rem]">
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden className="size-3.5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase aria-hidden className="size-3.5" />
              {job.type}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar aria-hidden className="size-3.5" />
              Posted {formatDate(job.posted)}
            </span>
          </div>
        }
      >
        <Button href={applyHref} size="lg" sheen>
          Apply for this role
        </Button>
      </PageHero>

      <Section tone="void">
        <div className="container-page">
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:gap-20">
            <div className="space-y-14">
              <div>
                <Reveal direction="none">
                  <Eyebrow>What you will do</Eyebrow>
                </Reveal>
                <Reveal delay={0.06}>
                  <Checklist items={job.responsibilities} className="mt-7" />
                </Reveal>
              </div>

              <div>
                <Reveal direction="none">
                  <Eyebrow>What we are looking for</Eyebrow>
                </Reveal>
                <Reveal delay={0.06}>
                  <Checklist items={job.requirements} className="mt-7" />
                </Reveal>
              </div>

              <div>
                <Reveal direction="none">
                  <Eyebrow>What we offer</Eyebrow>
                </Reveal>
                <Reveal delay={0.06}>
                  <Checklist items={job.benefits} className="mt-7" />
                </Reveal>
              </div>

              <Reveal>
                <Link
                  href="/careers"
                  className="group text-mist hover:text-bright inline-flex items-center gap-2.5 text-[0.875rem] transition-colors"
                >
                  <ArrowLeft
                    aria-hidden
                    className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5"
                  />
                  All open roles
                </Link>
              </Reveal>
            </div>

            <aside className="lg:sticky lg:top-32 lg:self-start">
              <Reveal direction="left">
                <div className="border-hairline bg-charcoal rounded-lg border p-7">
                  <p className="text-eyebrow text-steel uppercase">Apply</p>
                  <p className="text-ash mt-4 text-[0.9375rem] leading-relaxed">
                    Send your CV and a short note about why this role interests you. We read every
                    application and reply to all of them — including the unsuccessful ones.
                  </p>
                  <Button href={applyHref} full className="mt-6">
                    Email your application
                  </Button>
                  <p className="border-hairline text-steel mt-5 border-t pt-5 text-[0.8125rem] leading-relaxed">
                    Questions about the role? Call{' '}
                    <a
                      href={`tel:${siteConfig.contact.phoneHref}`}
                      className="text-mist hover:text-bright transition-colors"
                    >
                      {siteConfig.contact.phone}
                    </a>{' '}
                    and ask for the hiring manager.
                  </p>
                </div>
              </Reveal>

              <Reveal direction="left" delay={0.08}>
                <div className="border-hairline bg-graphite mt-6 rounded-lg border p-7">
                  <p className="text-eyebrow text-steel uppercase">At a glance</p>
                  <dl className="mt-5 space-y-4 text-[0.875rem]">
                    <div>
                      <dt className="text-steel">Department</dt>
                      <dd className="text-chalk mt-1">{job.department}</dd>
                    </div>
                    <div>
                      <dt className="text-steel">Location</dt>
                      <dd className="text-chalk mt-1">{job.location}</dd>
                    </div>
                    <div>
                      <dt className="text-steel">Contract</dt>
                      <dd className="mt-1">
                        <Badge tone="metal">{job.type}</Badge>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Reveal>
            </aside>
          </div>
        </div>
      </Section>

      {others.length > 0 ? (
        <Section tone="graphite" className="border-hairline border-t">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Other roles</Eyebrow>
                <h2 className="font-display text-headline text-bright mt-6 font-semibold">
                  Also hiring
                </h2>
              </div>
              <ArrowLink href="/careers">All roles</ArrowLink>
            </div>

            <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <RevealItem key={item.slug}>
                  <JobCard job={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      ) : null}
    </>
  );
}
