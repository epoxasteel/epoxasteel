import type { NextConfig } from 'next';
import { cspAdditions } from './src/lib/analytics';

/**
 * Security headers applied to every response.
 *
 * The CSP is deliberately strict: the site ships zero third-party scripts by
 * default, self-hosts its fonts, and renders all imagery from local assets or
 * inline SVG.
 *
 * The only thing that widens it is analytics, and only for the providers actually
 * configured — `cspAdditions` returns the hosts for whichever of GA, GTM, Meta or
 * LinkedIn has an ID in the environment, and nothing for the rest. A policy that
 * permanently allows `googletagmanager.com` on a deployment with no Google tag is a
 * hole with no corresponding feature, so the allowance and the script arrive and
 * leave together. See `src/lib/analytics.ts`.
 */
function directive(name: string, base: string[], additions: string[] = []) {
  return [name, ...base, ...additions].join(' ');
}

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects a small amount of inline bootstrap script.
  directive(
    'script-src',
    [
      "'self'",
      "'unsafe-inline'",
      ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
    ],
    cspAdditions('script'),
  ),
  "style-src 'self' 'unsafe-inline'",
  directive('img-src', ["'self'", 'data:', 'blob:'], cspAdditions('img')),
  "media-src 'self' blob:",
  "font-src 'self' data:",
  directive(
    'connect-src',
    ["'self'", ...(process.env.NODE_ENV === 'development' ? ['ws:', 'wss:'] : [])],
    cspAdditions('connect'),
  ),
  // No iframes anywhere on the site — the contact map is drawn, not embedded — so
  // nothing needs framing. The Google Maps origins were allowed in anticipation of
  // an embed that was never added; an unused allowance is just a hole waiting for
  // an injected frame to find it. GTM and the Meta Pixel each fall back to an
  // iframe without JavaScript, so those hosts appear here only when switched on.
  directive('frame-src', cspAdditions('frame').length ? [] : ["'none'"], cspAdditions('frame')),
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
