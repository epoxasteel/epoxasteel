import type { Metadata } from 'next';
import { buildMetadata, localBusinessSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { JsonLd } from '@/components/layout/section';
import { Hero } from '@/components/home/hero';
import { Lifecycle } from '@/components/home/lifecycle';
import { Testimonials } from '@/components/home/testimonials';
import {
  Introduction,
  WhyChooseUs,
  QualityCommitment,
  Certifications,
  CallToAction,
  ContactStrip,
} from '@/components/home/sections';
import {
  FeaturedProducts,
  IndustriesServed,
  ServicesOverview,
  ProjectShowcase,
  LatestNews,
} from '@/components/home/collections';

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — Premium Structural Steel Supply & Fabrication`,
  description: siteConfig.description,
  path: '/',
  keywords: [
    'structural steel supplier',
    'steel fabrication company',
    'steel beams supplier',
    'reinforcing steel supplier',
    'commercial construction steel',
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />

      <Hero />
      <Introduction />
      <Lifecycle />
      <FeaturedProducts />
      <IndustriesServed />
      <ServicesOverview />
      <ProjectShowcase />
      <WhyChooseUs />
      <QualityCommitment />
      <Testimonials />
      <Certifications />
      <LatestNews />
      <CallToAction />
      <ContactStrip />
    </>
  );
}
