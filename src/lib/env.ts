/**
 * Checks the environment once, at boot, and says what is wrong.
 *
 * Every variable this project reads is optional — the site runs with none of them
 * set, which is what makes a first deploy succeed before email or a database is
 * wired up. The failure mode that creates is silence: a production deployment
 * that looks healthy while every enquiry is being written to a log nobody reads.
 *
 * So this runs on the server at startup and prints a single, plainly-worded
 * report. It distinguishes three things:
 *
 *   **Errors** — a value is present but unusable (a malformed URL, a secret too
 *   short to be one). These throw in production, because starting with a broken
 *   configuration is worse than not starting.
 *
 *   **Warnings** — a value is absent and the feature it powers is therefore off.
 *   Fine in development, worth knowing about in production.
 *
 *   **Notes** — what is switched on, so a deploy log records the configuration it
 *   actually ran with.
 */

import { fromAddress, ownerRecipients, replyToAddress } from '@/lib/email/config';

type Report = { errors: string[]; warnings: string[]; notes: string[] };

function siteDomain() {
  return (process.env.NEXT_PUBLIC_SITE_DOMAIN || 'epoxasteel.com').trim().toLowerCase();
}

function isUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function collect(): Report {
  const report: Report = { errors: [], warnings: [], notes: [] };
  const production = process.env.NODE_ENV === 'production';

  /* --- Email: the primary workflow, so absence is the loudest warning ----- */
  const resend = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;

  if (resend) {
    report.notes.push('email: Resend');
    if (!resend.startsWith('re_')) {
      report.errors.push(
        'RESEND_API_KEY does not look like a Resend key (expected a "re_" prefix)',
      );
    }
    /*
     * The sending domain has to be verified in Resend or every send is refused
     * with `invalid_from_address`. We cannot check verification from here, but we
     * can check the two things that are always wrong: no sender configured at all,
     * and a sender on a domain the site does not own.
     */
    const from = process.env.FROM_EMAIL || process.env.EMAIL_FROM;
    if (!from) {
      report.warnings.push(
        `FROM_EMAIL is not set, falling back to noreply@${siteDomain()}, which must be a verified Resend sender`,
      );
    } else {
      const domain = from.split('@').pop()?.replace(/>$/, '').trim().toLowerCase();
      if (domain && domain !== siteDomain()) {
        report.warnings.push(
          `FROM_EMAIL sends from @${domain} but the site is ${siteDomain()}, make sure @${domain} is verified in Resend`,
        );
      }
    }
  } else if (smtpHost) {
    report.notes.push(`email: SMTP via ${smtpHost}`);
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      report.warnings.push(
        'SMTP_HOST is set without SMTP_USER/SMTP_PASSWORD, most providers will refuse to relay',
      );
    }
    const port = process.env.SMTP_PORT;
    if (port && !Number.isFinite(Number(port))) {
      report.errors.push(`SMTP_PORT is not a number: ${port}`);
    }
  } else {
    report.warnings.push(
      'no email transport configured (RESEND_API_KEY or SMTP_HOST), enquiries will be written to this log and not delivered',
    );
  }

  for (const key of ['FROM_EMAIL', 'EMAIL_FROM', 'REPLY_TO_EMAIL'] as const) {
    const value = process.env[key];
    if (value && !value.includes('@')) report.errors.push(`${key} is not an email address`);
  }

  const to = process.env.OWNER_EMAIL || process.env.EMAIL_TO;
  if (process.env.OWNER_EMAIL && process.env.EMAIL_TO) {
    report.notes.push('OWNER_EMAIL and EMAIL_TO are both set, OWNER_EMAIL wins');
  }
  if (to) {
    const bad = to
      .split(',')
      .map((address) => address.trim())
      .filter((address) => address && !address.includes('@'));
    if (bad.length) report.errors.push(`OWNER_EMAIL contains invalid addresses: ${bad.join(', ')}`);
  } else {
    report.warnings.push(
      'OWNER_EMAIL is not set, notifications go to the public contact address in lib/site.ts',
    );
  }

  /*
   * Print where mail actually goes.
   *
   * Every address on this site is resolved from a variable through a chain of
   * fallbacks, which is flexible and completely opaque from the outside. One line
   * in the boot log turns "I think I set that correctly" into a fact, and it is
   * the single most useful thing here on the day somebody wonders why an enquiry
   * did not arrive.
   */
  if (production || resend || smtpHost) {
    report.notes.push(`mail from:  ${fromAddress()}`);
    report.notes.push(`mail to:    ${ownerRecipients().join(', ')}`);
    report.notes.push(`replies to: ${replyToAddress()} (customer confirmations)`);
    report.notes.push('replies to: the customer (owner notifications)');
  }

  /* --- Secrets ----------------------------------------------------------- */
  const formSecret = process.env.FORM_TOKEN_SECRET;
  if (!formSecret) {
    report.warnings.push(
      'FORM_TOKEN_SECRET is not set, form tokens are signed with a per-process key, so they stop validating across a restart or a second replica',
    );
  } else if (formSecret.length < 16) {
    report.errors.push('FORM_TOKEN_SECRET is shorter than 16 characters');
  }

  if (production && !process.env.IP_HASH_SALT) {
    report.warnings.push('IP_HASH_SALT is not set, stored submitter hashes use a default salt');
  }

  /* --- Database: optional backup ----------------------------------------- */
  if (process.env.DATABASE_URL) {
    report.notes.push('database: connected (enquiries backed up)');
  } else {
    report.warnings.push(
      'DATABASE_URL is not set, enquiries are emailed but not stored, so there is no disaster-recovery copy',
    );
  }

  /* --- Assistant --------------------------------------------------------- */
  const aiEnabled = process.env.AI_ENABLED === 'true';
  const openai = process.env.OPENAI_API_KEY;

  if (aiEnabled && !openai) {
    report.errors.push(
      'AI_ENABLED is true but OPENAI_API_KEY is not set, the assistant would be offered and then fail',
    );
  } else if (aiEnabled) {
    report.notes.push(`assistant: live (${process.env.OPENAI_MODEL || 'gpt-4.1-mini'})`);
  } else if (openai) {
    report.notes.push(
      'assistant: Coming Soon, key present, set AI_ENABLED=true and redeploy to go live',
    );
  } else {
    report.notes.push('assistant: Coming Soon, set OPENAI_API_KEY and AI_ENABLED=true to go live');
  }

  if (process.env.OPENAI_BASE_URL && !isUrl(process.env.OPENAI_BASE_URL)) {
    report.errors.push('OPENAI_BASE_URL is not a valid http(s) URL');
  }

  /* --- Site ------------------------------------------------------------- */
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl && !isUrl(siteUrl)) {
    report.errors.push('NEXT_PUBLIC_SITE_URL is not a valid http(s) URL');
  }
  if (production && !siteUrl) {
    report.warnings.push(
      'NEXT_PUBLIC_SITE_URL is not set, canonical URLs and sitemap entries fall back to the value in lib/site.ts',
    );
  }

  const maxUpload = process.env.UPLOAD_MAX_MB;
  if (maxUpload && (!Number.isFinite(Number(maxUpload)) || Number(maxUpload) <= 0)) {
    report.errors.push(`UPLOAD_MAX_MB is not a positive number: ${maxUpload}`);
  }

  if (process.env.EMAIL_INCLUDE_IP === 'true') {
    report.notes.push(
      'owner emails include the submitter IP, the privacy policy says so automatically',
    );
  }

  const timezone = process.env.TIMEZONE;
  if (timezone) {
    try {
      new Intl.DateTimeFormat('en-GB', { timeZone: timezone });
      report.notes.push(`timestamps: ${timezone}`);
    } catch {
      report.errors.push(
        `TIMEZONE is not a recognised IANA zone: ${timezone} (e.g. "America/New_York")`,
      );
    }
  }

  /* --- Contact details ---------------------------------------------------- */
  /*
   * Reachability is the one thing on this site that has to be right. A typo in a
   * public contact address does not break a build, does not throw, and does not
   * show up in testing — it just quietly sends every enquiry nowhere.
   */
  const publicEmails = [
    ['NEXT_PUBLIC_CONTACT_EMAIL', process.env.NEXT_PUBLIC_CONTACT_EMAIL],
    ['NEXT_PUBLIC_SALES_EMAIL', process.env.NEXT_PUBLIC_SALES_EMAIL],
    ['NEXT_PUBLIC_QUOTES_EMAIL', process.env.NEXT_PUBLIC_QUOTES_EMAIL],
    ['NEXT_PUBLIC_CAREERS_EMAIL', process.env.NEXT_PUBLIC_CAREERS_EMAIL],
  ] as const;

  for (const [key, value] of publicEmails) {
    if (value && !value.includes('@'))
      report.errors.push(`${key} is not an email address: ${value}`);
  }

  /*
   * Coordinates are optional and are published in the LocalBusiness schema only
   * when both are present and parse. A latitude on its own puts nothing on a map
   * and would be silently dropped, so say so at boot rather than let someone
   * believe they had set it.
   */
  const lat = process.env.NEXT_PUBLIC_ADDRESS_LATITUDE?.trim();
  const lon = process.env.NEXT_PUBLIC_ADDRESS_LONGITUDE?.trim();

  if (Boolean(lat) !== Boolean(lon)) {
    report.warnings.push(
      'NEXT_PUBLIC_ADDRESS_LATITUDE and NEXT_PUBLIC_ADDRESS_LONGITUDE must both be set, geo coordinates are omitted from the schema until they are',
    );
  }

  for (const [key, value, limit] of [
    ['NEXT_PUBLIC_ADDRESS_LATITUDE', lat, 90],
    ['NEXT_PUBLIC_ADDRESS_LONGITUDE', lon, 180],
  ] as const) {
    if (!value) continue;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || Math.abs(parsed) > limit) {
      report.errors.push(`${key} is not a valid coordinate: ${value}`);
    }
  }

  const socials = [
    ['NEXT_PUBLIC_LINKEDIN_URL', process.env.NEXT_PUBLIC_LINKEDIN_URL],
    ['NEXT_PUBLIC_INSTAGRAM_URL', process.env.NEXT_PUBLIC_INSTAGRAM_URL],
    ['NEXT_PUBLIC_FACEBOOK_URL', process.env.NEXT_PUBLIC_FACEBOOK_URL],
    ['NEXT_PUBLIC_X_URL', process.env.NEXT_PUBLIC_X_URL],
    ['NEXT_PUBLIC_YOUTUBE_URL', process.env.NEXT_PUBLIC_YOUTUBE_URL],
  ] as const;

  for (const [key, value] of socials) {
    // An empty string is the documented way to hide an icon, so only a non-empty
    // value that is not a URL is a mistake.
    if (value?.trim() && !isUrl(value)) {
      report.errors.push(`${key} is not a valid http(s) URL: ${value}`);
    }
  }

  /* --- Analytics -------------------------------------------------------- */
  const analytics = [
    ['NEXT_PUBLIC_GA_ID', 'Google Analytics', /^G-[A-Z0-9]+$/i],
    ['NEXT_PUBLIC_GTM_ID', 'Google Tag Manager', /^GTM-[A-Z0-9]+$/i],
    ['NEXT_PUBLIC_META_PIXEL_ID', 'Meta Pixel', /^\d+$/],
    ['NEXT_PUBLIC_LINKEDIN_PARTNER_ID', 'LinkedIn Insight', /^\d+$/],
  ] as const;

  const active: string[] = [];
  for (const [key, label, shape] of analytics) {
    const value = process.env[key]?.trim();
    if (!value) continue;
    active.push(label);
    // A warning, not an error: ID formats are the provider's to change, and
    // refusing to boot over one would be this file overreaching.
    if (!shape.test(value)) {
      report.warnings.push(`${key} does not look like a ${label} ID: ${value}`);
    }
  }

  if (active.length) {
    report.notes.push(`analytics: ${active.join(', ')}, loaded only after consent`);
    if (process.env.NEXT_PUBLIC_GTM_ID && process.env.NEXT_PUBLIC_GA_ID) {
      report.notes.push(
        'Google Analytics will be loaded inside the Tag Manager container, not separately',
      );
    }
  } else {
    report.notes.push('analytics: none, no cookies set, no consent banner');
  }

  return report;
}

let reported = false;

/**
 * Prints the report once per process, and throws in production if anything is
 * actually broken.
 *
 * Called from `instrumentation.ts`, which Next runs before the server begins
 * accepting requests — so a misconfigured deployment fails at boot with a
 * readable reason rather than on the first enquiry.
 */
export function validateEnv() {
  if (reported) return;
  reported = true;

  const { errors, warnings, notes } = collect();

  const line = '─'.repeat(72);
  console.log(`\n${line}\n  EPOXA STEEL, environment\n${line}`);
  for (const note of notes) console.log(`  · ${note}`);
  for (const warning of warnings) console.warn(`  ! ${warning}`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.log(`${line}\n`);

  if (errors.length && process.env.NODE_ENV === 'production') {
    throw new Error(
      `Refusing to start: ${errors.length} environment problem${errors.length === 1 ? '' : 's'} above. ` +
        'Fix the variables and redeploy, see .env.example.',
    );
  }
}
