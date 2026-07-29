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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...buildMetadata({
    title: `${siteConfig.name} — Premium Structural Steel Supply & Fabrication`,
    description: siteConfig.description,
    path: '/',
  }),
  title: {
    default: `${siteConfig.name} — Premium Structural Steel Supply & Fabrication`,
    template: `%s | ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
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
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        {/* Site-wide structured data. Page-level schema is added per route. */}
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {/* Both must run before the body paints: one owns the
            hidden-until-revealed state for every scroll reveal, the other the
            hero's opening blackout. Each is a few hundred bytes and each
            degrades to "show everything" if it never runs. */}
        <RevealEngineScript />
        <OvertureScript />
      </head>
      <body className="bg-void min-h-dvh antialiased">
        <SearchProvider>
          <Header />
          <main id="main" className="relative">
            {children}
          </main>
          <Footer />
          <FloatingContact />
          <SearchDialog />
        </SearchProvider>
      </body>
    </html>
  );
}
