import type { Metadata, Viewport } from 'next';
import './globals.css';
import { fontVariables } from '@/lib/fonts';
import { siteConfig } from '@/lib/site';
import { buildMetadata, organizationSchema, websiteSchema } from '@/lib/seo';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { JsonLd } from '@/components/layout/section';
import { SearchProvider } from '@/components/search/search-provider';
import { SearchDialog } from '@/components/search/search-dialog';
import { FloatingContact } from '@/components/layout/floating-contact';
import { RevealEngineScript } from '@/components/motion/reveal';
import { OvertureScript } from '@/components/home/overture-script';
import { AssistantProvider } from '@/components/assistant/assistant-context';
import { AssistantDock } from '@/components/assistant/assistant-dock';
import { assistantConfigured } from '@/lib/assistant/config';
import { Analytics } from '@/components/layout/analytics';
import { CookieNotice } from '@/components/layout/cookie-notice';
import { analyticsEnabled } from '@/lib/analytics';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({
    title: siteConfig.legalName,
    description: siteConfig.description,
    path: '/',
  }),
  /*
   * The brand name alone, with no tagline after it.
   *
   * A browser tab, a bookmark and a search result all show the front of this
   * string and truncate the rest, so the first words decide what the site is
   * called. "Epoxa Steel — Premium Structural Steel Supply & Fabrication" spent
   * that space on a phrase describing the whole industry, and left every tab
   * reading the same as every competitor's. What the business does is the meta
   * description's job, one line below.
   */
  title: {
    default: siteConfig.legalName,
    template: `%s | ${siteConfig.legalName}`,
  },
  applicationName: siteConfig.legalName,
  // The label under the icon when the site is saved to an iOS home screen.
  // Without it Safari falls back to the page title, which is per-page.
  appleWebApp: { title: siteConfig.legalName },
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: 'Construction & Engineering',
  formatDetection: { telephone: true, address: false, email: true },
  // `src/app/icon.svg` and `src/app/apple-icon.tsx` are picked up automatically
  // by Next's file-based metadata, so no explicit `icons` entry is needed here.
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#060709',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const assistantEnabled = assistantConfigured();
  const tracking = analyticsEnabled();

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Site-wide structured data. Page-level schema is added per route. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {/* Both must run before the body paints: one owns the
            hidden-until-revealed state for every scroll reveal, the other the
            hero's opening blackout. Each is a few hundred bytes and each
            degrades to "show everything" if it never runs. */}
        {/*
          iOS Safari draws its own large play button over any video it declines
          to autoplay, and it is not the `controls` attribute: it is a shadow-DOM
          part, so `controls={false}`, `disablePictureInPicture` and
          `pointer-events-none` all leave it on screen. Low Power Mode is the
          usual way to end up there and Safari cannot be talked out of it.

          Inline rather than in `globals.css` because Tailwind v4 compiles that
          through Lightning CSS, which drops `::-webkit-media-controls-*`
          selectors on the floor: the rule was in the source and absent from the
          built stylesheet, verified. A few hundred bytes in the head is the one
          place it survives.

          Scoped to `[data-hero-video]`, so a real video elsewhere keeps its
          controls.
        */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              '[data-hero-video]::-webkit-media-controls,' +
              '[data-hero-video]::-webkit-media-controls-enclosure,' +
              '[data-hero-video]::-webkit-media-controls-panel,' +
              '[data-hero-video]::-webkit-media-controls-start-playback-button,' +
              '[data-hero-video]::-webkit-media-controls-play-button,' +
              '[data-hero-video]::-webkit-media-controls-overlay-play-button' +
              '{display:none!important;-webkit-appearance:none;appearance:none;opacity:0}',
          }}
        />
        <RevealEngineScript />
        <OvertureScript />
      </head>
      <body className="bg-void min-h-dvh antialiased">
        <SearchProvider>
          <AssistantProvider>
            <Header />
            {/*
              `tabIndex={-1}` so the skip link actually moves focus here.
              Without it the browser scrolls to this element and leaves focus on
              the body, which means the next Tab press goes back to the top of the
              header navigation, the exact thing the visitor just skipped. The
              link looked like it worked, and for a sighted mouse user it did.
              Negative index: programmatically focusable, never a tab stop of its
              own, and `outline-none` because this is a landmark receiving focus
              rather than a control, so a ring around the whole page would be noise.
            */}
            <main id="main" tabIndex={-1} className="relative outline-none">
              {children}
            </main>
            <Footer />
            {/*
              The dock always offers the assistant. What it opens depends on the
              flag: the live desk when there is a model behind it, otherwise a
              panel that says the assistant is being prepared and hands over the
              quote form and the contact page.
              Earlier this hid the button entirely when there was no key, on the
              reasoning that offering to answer and then apologising is worse than
              not offering. That reasoning was right about the apology and wrong
              about the button, somebody who reaches for it has a question, and
              the routes that answer it exist today. See coming-soon-panel.tsx.
            */}
            <FloatingContact />
            <AssistantDock enabled={assistantEnabled} />
            <SearchDialog />
            {/*
              Both hang off whether any analytics provider has an ID in the
              environment. With none, the default. There is nothing to load and
              nothing to consent to, so neither renders anything and the site sets
              no analytics cookies at all. See lib/analytics.ts.
            */}
            <CookieNotice configured={tracking} />
            {tracking ? <Analytics /> : null}
          </AssistantProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
