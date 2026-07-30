/**
 * The bits of context an owner wants on an enquiry notification.
 *
 * Browser, operating system, device type and the time it arrived — enough to read
 * the situation before picking up the phone. Someone filling in a quote request
 * on a phone at 7am is on a site; the same enquiry from a desktop at 2pm is
 * someone at a desk with the drawing open. That changes how you call them back.
 *
 * ## On parsing user agents
 *
 * Deliberately small and deliberately approximate. A full UA-parsing library is
 * hundreds of kilobytes of regular expressions maintained against a moving
 * target, for a line of text in an email. This recognises the engines that
 * actually reach a B2B construction site and says "Unknown" rather than guessing
 * when it does not.
 *
 * Order matters throughout: Edge and Opera both claim to be Chrome, Chrome claims
 * to be Safari, and every one of them claims to be Mozilla. Checking the most
 * specific claim first is the whole trick.
 *
 * Nothing here is stored or used to identify anyone — it is read from the request
 * that is already in hand, written into one email, and forgotten. The privacy
 * policy says so.
 */

export type RequestContext = {
  browser: string;
  os: string;
  device: 'Mobile' | 'Tablet' | 'Desktop';
  submittedAt: string;
  /** IANA zone the timestamp is rendered in, so a reader knows what they see. */
  timezone: string;
};

function browserFrom(ua: string) {
  // Most specific first: the impostors all name their host engine too.
  if (/\bEdg(?:e|A|iOS)?\//.test(ua)) return 'Edge';
  if (/\bOPR\/|\bOpera\b/.test(ua)) return 'Opera';
  if (/\bSamsungBrowser\//.test(ua)) return 'Samsung Internet';
  if (/\bFirefox\/|\bFxiOS\//.test(ua)) return 'Firefox';
  if (/\bCriOS\//.test(ua)) return 'Chrome (iOS)';
  if (/\bChrome\//.test(ua)) return 'Chrome';
  if (/\bSafari\//.test(ua) && /\bVersion\//.test(ua)) return 'Safari';
  return 'Unknown browser';
}

function osFrom(ua: string) {
  if (/\bWindows NT 10/.test(ua)) return 'Windows 10 or 11';
  if (/\bWindows NT/.test(ua)) return 'Windows';
  // iPadOS reports itself as Macintosh; the touch hint is what separates them.
  if (/\biPad\b/.test(ua)) return 'iPadOS';
  if (/\biPhone\b|\biPod\b/.test(ua)) return 'iOS';
  if (/\bAndroid\b/.test(ua)) {
    const version = /\bAndroid (\d+)/.exec(ua)?.[1];
    return version ? `Android ${version}` : 'Android';
  }
  if (/\bMac OS X\b|\bMacintosh\b/.test(ua)) return 'macOS';
  if (/\bCrOS\b/.test(ua)) return 'ChromeOS';
  if (/\bLinux\b/.test(ua)) return 'Linux';
  return 'Unknown OS';
}

function deviceFrom(ua: string): RequestContext['device'] {
  if (/\biPad\b|\bTablet\b|\bPlayBook\b/.test(ua)) return 'Tablet';
  // "Mobi" is the token the spec actually reserves for this; Android without it
  // is a tablet.
  if (/\bMobi/.test(ua)) return 'Mobile';
  if (/\bAndroid\b/.test(ua)) return 'Tablet';
  return 'Desktop';
}

/**
 * `TIMEZONE` sets the zone timestamps are rendered in — the owner's local time,
 * not the server's. Defaults to the server's own zone.
 */
export function describeRequest(request: Request): RequestContext {
  const ua = request.headers.get('user-agent') ?? '';
  const timezone = process.env.TIMEZONE || Intl.DateTimeFormat().resolvedOptions().timeZone;

  let submittedAt: string;
  try {
    submittedAt = new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(new Date());
  } catch {
    // A misconfigured TIMEZONE should degrade to a correct timestamp, not throw
    // in the middle of an enquiry.
    submittedAt = new Date().toUTCString();
  }

  return {
    browser: browserFrom(ua),
    os: osFrom(ua),
    device: deviceFrom(ua),
    submittedAt,
    timezone,
  };
}
