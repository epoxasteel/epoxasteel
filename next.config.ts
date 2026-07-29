import type { NextConfig } from 'next';

/**
 * Security headers applied to every response.
 * The CSP is deliberately strict: the site ships zero third-party scripts by
 * default, self-hosts its fonts, and renders all imagery from local assets or
 * inline SVG. If you later add analytics or a map embed, extend the relevant
 * directive rather than loosening the whole policy.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects a small amount of inline bootstrap script.
  "script-src 'self' 'unsafe-inline'" +
    (process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "media-src 'self' blob:",
  "font-src 'self' data:",
  "connect-src 'self'" + (process.env.NODE_ENV === 'development' ? ' ws: wss:' : ''),
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Railway builds run in a container; a standalone bundle keeps the image small.
  output: 'standalone',

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Note: build output under /_next/static is content-hashed and already
      // served immutable by Next.js — adding our own Cache-Control there breaks
      // dev-server behaviour, so it is deliberately left alone.
    ];
  },

  async redirects() {
    return [
      { source: '/request-a-quote', destination: '/quote', permanent: true },
      { source: '/get-a-quote', destination: '/quote', permanent: true },
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/news', destination: '/blog', permanent: true },
    ];
  },
};

export default nextConfig;
