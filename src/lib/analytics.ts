/**
 * The analytics foundation. Nothing is enabled by default.
 *
 * The brief asks for the architecture to be prepared without switching anything
 * on, and that is exactly what this is: four providers, each dormant until its ID
 * is set in the environment. There are no IDs in this file and none anywhere in the
 * repository — a hardcoded measurement ID is somebody else's property tracking your
 * visitors, and it survives every attempt to remove it later because nobody
 * remembers it is there.
 *
 * ## Turning one on
 *
 *   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX              Google Analytics 4
 *   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX              Google Tag Manager
 *   NEXT_PUBLIC_META_PIXEL_ID=000000000000000   Meta Pixel
 *   NEXT_PUBLIC_LINKEDIN_PARTNER_ID=0000000     LinkedIn Insight Tag
 *
 * Set one, redeploy, done. The scripts are loaded, the CSP is widened to exactly
 * the hosts that provider needs, and the cookie notice starts appearing — all
 * driven by the same variable, so there is no way to end up tracking people
 * without telling them.
 *
 * ## The consent link
 *
 * `analyticsEnabled()` is what the cookie banner and the privacy policy both read.
 * With no provider configured the site sets no analytics cookies at all, so asking
 * for consent would be theatre — a banner that exists to look compliant while there
 * is nothing to consent to trains people to dismiss the ones that matter. The
 * moment a provider is configured, the banner appears and scripts wait for a
 * decision. See `components/layout/cookie-notice.tsx`.
 */

export type AnalyticsProvider = 'ga' | 'gtm' | 'meta' | 'linkedin';

export type AnalyticsConfig = {
  ga: string;
  gtm: string;
  meta: string;
  linkedin: string;
};

/**
 * Written out literally, one per provider. `process.env.NEXT_PUBLIC_*` is replaced
 * by textual substitution at build time, so a lookup through a variable key would
 * never be inlined and would read as undefined in the browser.
 */
export function analyticsConfig(): AnalyticsConfig {
  return {
    ga: process.env.NEXT_PUBLIC_GA_ID?.trim() ?? '',
    gtm: process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? '',
    meta: process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() ?? '',
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID?.trim() ?? '',
  };
}

/** True when at least one provider has an ID — the switch the whole feature hangs on. */
export function analyticsEnabled() {
  return Object.values(analyticsConfig()).some(Boolean);
}

/**
 * The hosts each provider needs, as CSP fragments.
 *
 * Kept beside the provider list rather than in `next.config.ts` so that adding a
 * fifth provider is one edit in one file. The config imports this and widens
 * `script-src`, `connect-src`, `img-src` and `frame-src` by exactly what the
 * configured providers require and nothing else — a policy that allows
 * `googletagmanager.com` on a deployment with no Google tag is a hole with no
 * corresponding feature.
 *
 * `frame-src` is in here because both Google Tag Manager and the Meta Pixel fall
 * back to an iframe when JavaScript is unavailable. The site's own policy is
 * `frame-src 'none'`, and it stays that way unless one of those is switched on.
 */
export const CSP_HOSTS: Record<AnalyticsProvider, Partial<Record<string, string[]>>> = {
  ga: {
    script: ['https://www.googletagmanager.com'],
    connect: [
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
    ],
    img: ['https://www.google-analytics.com', 'https://*.googletagmanager.com'],
  },
  gtm: {
    script: ['https://www.googletagmanager.com'],
    connect: ['https://www.googletagmanager.com', 'https://*.google-analytics.com'],
    img: ['https://www.googletagmanager.com'],
    frame: ['https://www.googletagmanager.com'],
  },
  meta: {
    script: ['https://connect.facebook.net'],
    connect: ['https://www.facebook.com'],
    img: ['https://www.facebook.com'],
    frame: ['https://www.facebook.com'],
  },
  linkedin: {
    script: ['https://snap.licdn.com'],
    connect: ['https://px.ads.linkedin.com'],
    img: ['https://px.ads.linkedin.com', 'https://p.adsymptotic.com'],
  },
};

/**
 * Collects the hosts to add to one CSP directive, given which providers are on.
 *
 * Reads the environment directly rather than taking a config argument, because
 * `next.config.ts` runs in its own process before any of the app's modules and has
 * no other way to ask.
 */
export function cspAdditions(directive: 'script' | 'connect' | 'img' | 'frame') {
  const config = analyticsConfig();
  const hosts = new Set<string>();

  for (const [provider, id] of Object.entries(config) as [AnalyticsProvider, string][]) {
    if (!id) continue;
    for (const host of CSP_HOSTS[provider][directive] ?? []) hosts.add(host);
  }

  return [...hosts];
}
