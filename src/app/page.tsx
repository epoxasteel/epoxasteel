import type { Metadata } from 'next';
import { buildMetadata, localBusinessSchema } from '@/lib/seo';
import { siteConfig } from '@/lib/site';
import { JsonLd } from '@/components/layout/section';
import { Hero } from '@/components/home/hero';
import {
  Atmosphere,
  SkylineFar,
  SkylineMid,
  SkylineNear,
  SteelFrameForeground,
} from '@/components/visual/city-scene';
import { resolveHeroVideo } from '@/lib/hero-video';
import { CallToAction, ContactStrip } from '@/components/home/sections';

export const metadata: Metadata = buildMetadata({
  title: siteConfig.legalName,
  description: siteConfig.description,
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessSchema()} />

      {/*
       * The homepage, cut back to what can be stood behind.
       *
       * Ten sections used to sit here — an introduction, six reasons, a product
       * grid, industries, services, the lifecycle sequence, case studies,
       * testimonials, a quality statement and a news feed. Every one of them
       * argued from figures, projects and quotes that were written to show the
       * shape of the page rather than to record anything that happened.
       *
       * The accreditation panel went the same way: six certificates, ISO 9001
       * through AISC, each with a description of what it covers. A badge is only
       * worth the certificate behind it, and a visitor who asks for one and
       * cannot be sent it has learned something worse than nothing.
       *
       * What is left is an invitation to ask and a way to reach a person. When
       * there are real certificates, projects and clients to name, they
       * belong back on this page — the sections still exist in
       * `components/home/` and each one is a single line to restore.
       */}
      {/* The hero backdrop is rendered here, on the server, and passed down as
          nodes. It is a large, static SVG scene; generating it inside the client
          component shipped the generator to the browser and ran it on the main
          thread before first paint. */}
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
      <CallToAction />
      <ContactStrip />
    </>
  );
}
