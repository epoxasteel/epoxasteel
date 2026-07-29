import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

/**
 * Preview and staging deployments are excluded from indexing entirely, so a
 * Railway preview URL can never outrank the production site.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction =
    process.env.NEXT_PUBLIC_SITE_ENV === 'production' ||
    (!process.env.NEXT_PUBLIC_SITE_ENV && process.env.NODE_ENV === 'production');

  if (!isProduction) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/search?'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
