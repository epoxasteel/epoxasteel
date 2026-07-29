import type { Metadata } from 'next';
import { buildMetadata, localBusinessSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { JsonLd } from '@/components/layout/section';
import { Hero } from '@/components/home/hero';
import { Lifecycle } from '@/components/home/lifecycle';
import { lifecycleStages } from '@/components/home/lifecycle-art';
import {
  Atmosphere,
  SkylineFar,
  SkylineMid,
  SkylineNear,
  SteelFrameForeground,
} from '@/components/visual/city-scene';
import { resolveHeroVideo } from '@/lib/hero-video';
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
  // `shortDescription`, not `description`: the long one runs to 237 characters
  // and Google shows about 155. The full prose still sits in the footer and in
  // the organisation schema, where length is not penalised.
  description: siteConfig.shortDescription,
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

      {/*
       * The homepage narrative, in the order a visitor actually needs it:
       * arrive → understand → trust → browse → be persuaded → act.
       *
       * Trust comes before the catalogue on purpose. A contractor deciding
       * whether to send us a drawing needs a reason to believe we will hold a
       * date before they care which sections we stock.
       *
       * The lifecycle sequence sits after Services — by then the visitor knows
       * what we sell, so the story of how steel reaches their site reads as
       * proof of process rather than an obstacle between them and the products.
       */}
      {/* The hero backdrop and the lifecycle artwork are rendered here, on the
          server, and passed down as nodes. Both are large, static SVG scenes;
          generating them inside their client components shipped the generators
          to the browser and ran them on the main thread before first paint. */}
      <Hero
        video={resolveHeroVideo()}
        layers={{
          atmosphere: <Atmosphere />,
          far: <SkylineFar />,
          mid: <SkylineMid />,
          near: <SkylineNear />,
          frame: <SteelFrameForeground />,
        }}
      />
      <Introduction />
      <WhyChooseUs />
      <FeaturedProducts />
      <IndustriesServed />
      <ServicesOverview />
      <Lifecycle stages={lifecycleStages} />
      <ProjectShowcase />
      <Testimonials />
      <QualityCommitment />
      <Certifications />
      <LatestNews />
      <CallToAction />
      <ContactStrip />
    </>
  );
}
