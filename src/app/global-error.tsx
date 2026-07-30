'use client';

import * as React from 'react';
import { siteConfig } from '@/lib/site';

/**
 * The last page the site can still render.
 *
 * `error.tsx` handles a failure inside a route, with the layout intact around it.
 * This one handles a failure *in* the root layout — which means there is no header,
 * no footer, no provider tree and no `<html>` element, because the thing that
 * normally supplies them is what broke. Next renders this in their place, which is
 * why it declares its own document.
 *
 * Everything here is inline. No Tailwind classes, no imported components, no font
 * variables, no design-system tokens — because the whole stylesheet is loaded from
 * the layout that just failed, and a recovery page that needs the broken thing to
 * work is not a recovery page. It will render on a blank slate.
 *
 * The colours are the brand's own hex values rather than CSS variables for the same
 * reason. They are duplicated from `globals.css` on purpose; if the palette changes
 * this page looking slightly dated is a much smaller problem than it not rendering.
 *
 * What it has to achieve, in order: say plainly that this is our fault, give a phone
 * number and an email address that work without any JavaScript, and offer a reload.
 * A visitor who reached this screen was trying to buy steel, and the only real
 * failure would be losing them.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  React.useEffect(() => {
    console.error('[app] root layout error', error);
  }, [error]);

  const link = { color: '#7db3f0', textDecoration: 'underline', textUnderlineOffset: '3px' };

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: '#08090b',
          color: '#a8b2be',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          lineHeight: 1.6,
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <main style={{ maxWidth: '34rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.6875rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#7db3f0',
            }}
          >
            EPOXA STEEL
          </p>

          <h1
            style={{
              margin: '1.5rem 0 0',
              fontSize: 'clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#f2f5f9',
              fontWeight: 600,
            }}
          >
            Something went wrong at our end.
          </h1>

          <p style={{ margin: '1.5rem 0 0', fontSize: '1.0625rem' }}>
            This is our fault, not yours. Reloading usually fixes it. If it does not, we would much
            rather take your enquiry by phone than lose it.
          </p>

          <p style={{ margin: '1.75rem 0 0', fontSize: '1.0625rem' }}>
            <a href={`tel:${siteConfig.contact.phoneHref}`} style={link}>
              {siteConfig.contact.phone}
            </a>
            <br />
            <a href={`mailto:${siteConfig.contact.email}`} style={link}>
              {siteConfig.contact.email}
            </a>
          </p>

          {error.digest ? (
            <p
              style={{
                margin: '2rem 0 0',
                fontSize: '0.8125rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                color: '#78828f',
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}

          {/* A plain <a>, not a button calling `reset()` and not next/link.
              Whatever broke happened above this component, so re-rendering the
              same tree — which is what both of those do — would most likely break
              again in the same place. A full document request is the point: it
              gets a fresh server render and a fresh client runtime. It also works
              with JavaScript disabled, which neither alternative does. */}
          <p style={{ margin: '2.25rem 0 0' }}>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                background: '#f2f5f9',
                color: '#08090b',
                fontSize: '0.9375rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Reload the site
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
