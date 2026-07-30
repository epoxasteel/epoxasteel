import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    // Both the same, and both the plain brand name. `name` is what an install
    // prompt shows, `short_name` the label under the icon — and the manifest is
    // one of the candidates Google weighs when deciding which site name to print
    // in a search result, so it agrees with the title and the schema exactly.
    name: siteConfig.legalName,
    short_name: siteConfig.legalName,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#060709',
    theme_color: '#060709',
    orientation: 'portrait-primary',
    categories: ['business', 'industrial', 'construction'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
