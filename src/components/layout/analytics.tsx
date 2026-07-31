'use client';

import Script from 'next/script';
import { analyticsConfig } from '@/lib/analytics';
import { useConsent } from '@/lib/consent';

/**
 * Loads whichever analytics providers are configured, once consent is given.
 *
 * Two gates, and both have to be open. The provider must have an ID in the
 * environment — there are no IDs in this repository — and the visitor must have
 * accepted the cookie notice. Until then this renders nothing at all: no script
 * tags, no preconnects, no beacons. Not "loaded but denied consent mode"; nothing.
 *
 * That is stricter than the common `consent mode` pattern, where the tag loads
 * immediately and is told to behave. It is also the only version that is simply
 * true when the privacy policy says no analytics cookies are set before consent.
 *
 * `strategy="afterInteractive"` throughout: none of this is needed to render the
 * page, and a marketing tag has no business competing with the content for the main
 * thread. The page is already interactive by the time any of it arrives.
 */
export function Analytics() {
  const consent = useConsent();
  const { ga, gtm, meta, linkedin } = analyticsConfig();

  if (consent !== 'granted') return null;

  return (
    <>
      {gtm ? (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      ) : null}

      {/* GA4 loaded directly only when there is no Tag Manager container. With one,
          GA belongs inside it, two loaders means duplicated pageviews and
          measurement nobody can reconcile. */}
      {ga && !gtm ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());gtag('config','${ga}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {meta ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,
'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${meta}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {linkedin ? (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`_linkedin_partner_id='${linkedin}';window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');
b.type='text/javascript';b.async=true;b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';
s.parentNode.insertBefore(b,s);})(window.lintrk);`}
        </Script>
      ) : null}
    </>
  );
}
