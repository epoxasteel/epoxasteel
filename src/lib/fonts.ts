import localFont from 'next/font/local';

/**
 * Fonts are vendored into `src/fonts` rather than pulled from Google Fonts at
 * build time. That keeps builds hermetic (no network dependency in CI or on
 * Railway), removes a third-party connection at runtime, and lets the CSP stay
 * locked to `font-src 'self'`.
 *
 * Both families are variable fonts, so a single file covers every weight.
 */

export const fontSans = localFont({
  src: [
    {
      path: '../fonts/inter-latin-wght-normal.woff2',
      weight: '100 900',
      style: 'normal',
    },
    {
      path: '../fonts/inter-latin-ext-wght-normal.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  // Tuned so the fallback occupies close to the same space as Inter, which
  // keeps CLS at zero while the webfont loads.
  adjustFontFallback: 'Arial',
});

export const fontDisplay = localFont({
  src: [
    {
      path: '../fonts/manrope-latin-wght-normal.woff2',
      weight: '200 800',
      style: 'normal',
    },
    {
      path: '../fonts/manrope-latin-ext-wght-normal.woff2',
      weight: '200 800',
      style: 'normal',
    },
  ],
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

/** Applied to <html> so the families resolve everywhere, portals included. */
export const fontVariables = `${fontSans.variable} ${fontDisplay.variable}`;
