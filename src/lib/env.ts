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

type Report = { errors: string[]; warnings: string[]; notes: string[] };

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
  } else if (smtpHost) {
    report.notes.push(`email: SMTP via ${smtpHost}`);
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      report.warnings.push(
        'SMTP_HOST is set without SMTP_USER/SMTP_PASSWORD — most providers will refuse to relay',
      );
    }
    const port = process.env.SMTP_PORT;
    if (port && !Number.isFinite(Number(port))) {
      report.errors.push(`SMTP_PORT is not a number: ${port}`);
    }
  } else {
    report.warnings.push(
      'no email transport configured (RESEND_API_KEY or SMTP_HOST) — enquiries will be written to this log and not delivered',
    );
  }

  if (process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes('@')) {
    report.errors.push('EMAIL_FROM is not an email address');
  }

  const to = process.env.EMAIL_TO;
  if (to) {
    const bad = to
      .split(',')
      .map((address) => address.trim())
      .filter((address) => address && !address.includes('@'));
    if (bad.length) report.errors.push(`EMAIL_TO contains invalid addresses: ${bad.join(', ')}`);
  } else {
    report.warnings.push('EMAIL_TO is not set — notifications go to the address in lib/site.ts');
  }

  /* --- Secrets ----------------------------------------------------------- */
  const formSecret = process.env.FORM_TOKEN_SECRET;
  if (!formSecret) {
    report.warnings.push(
      'FORM_TOKEN_SECRET is not set — form tokens are signed with a per-process key, so they stop validating across a restart or a second replica',
    );
  } else if (formSecret.length < 16) {
    report.errors.push('FORM_TOKEN_SECRET is shorter than 16 characters');
  }

  if (production && !process.env.IP_HASH_SALT) {
    report.warnings.push('IP_HASH_SALT is not set — stored submitter hashes use a default salt');
  }

  /* --- Database: optional backup ----------------------------------------- */
  if (process.env.DATABASE_URL) {
    report.notes.push('database: connected (enquiries backed up)');
  } else {
    report.warnings.push(
      'DATABASE_URL is not set — enquiries are emailed but not stored, so there is no disaster-recovery copy',
    );
  }

  /* --- Assistant --------------------------------------------------------- */
  const aiEnabled = process.env.AI_ENABLED === 'true';
  const openai = process.env.OPENAI_API_KEY;

  if (aiEnabled && !openai) {
    report.errors.push(
      'AI_ENABLED is true but OPENAI_API_KEY is not set — the assistant would be offered and then fail',
    );
  } else if (aiEnabled) {
    report.notes.push(`assistant: enabled (${process.env.OPENAI_MODEL || 'gpt-4.1-mini'})`);
  } else if (openai) {
    report.notes.push('assistant: key present but AI_ENABLED is not true — showing Coming Soon');
  } else {
    report.notes.push('assistant: Coming Soon');
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
      'NEXT_PUBLIC_SITE_URL is not set — canonical URLs and sitemap entries fall back to the value in lib/site.ts',
    );
  }

  const maxUpload = process.env.UPLOAD_MAX_MB;
  if (maxUpload && (!Number.isFinite(Number(maxUpload)) || Number(maxUpload) <= 0)) {
    report.errors.push(`UPLOAD_MAX_MB is not a positive number: ${maxUpload}`);
  }

  /* --- Analytics -------------------------------------------------------- */
  const analytics = [
    ['NEXT_PUBLIC_GA_ID', 'Google Analytics'],
    ['NEXT_PUBLIC_GTM_ID', 'Google Tag Manager'],
    ['NEXT_PUBLIC_META_PIXEL_ID', 'Meta Pixel'],
    ['NEXT_PUBLIC_LINKEDIN_PARTNER_ID', 'LinkedIn Insight'],
  ] as const;

  const active = analytics.filter(([key]) => process.env[key]).map(([, label]) => label);
  if (active.length) report.notes.push(`analytics: ${active.join(', ')}`);

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
  console.log(`\n${line}\n  EPOXA STEEL — environment\n${line}`);
  for (const note of notes) console.log(`  · ${note}`);
  for (const warning of warnings) console.warn(`  ! ${warning}`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  console.log(`${line}\n`);

  if (errors.length && process.env.NODE_ENV === 'production') {
    throw new Error(
      `Refusing to start: ${errors.length} environment problem${errors.length === 1 ? '' : 's'} above. ` +
        'Fix the variables and redeploy — see .env.example.',
    );
  }
}
