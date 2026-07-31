import { z } from 'zod';

/**
 * Form schemas shared between the client (React Hook Form resolver) and the
 * server (API route). Validating with the same schema on both sides means the
 * server never trusts the client, and the client never shows an error message
 * the server would not also produce.
 */

/**
 * Zod compiles validators with `new Function` when it can, and works out
 * whether it can by calling `Function("")` inside a try/catch. Our CSP has no
 * `'unsafe-eval'`, so that probe threw on every form page: Zod caught it and
 * fell back correctly, but the browser had already logged a CSP violation, and
 * a security header quietly failing a check is exactly the kind of noise that
 * hides a real one later.
 *
 * Telling it up front that there is no JIT available skips the probe. The
 * interpreted path is what these schemas were running on anyway.
 */
z.config({ jitless: true });

/**
 * A required text field whose message is the same whether the value is empty,
 * whitespace or absent altogether.
 *
 * The reason this exists: Zod's message for a missing key is "Invalid input:
 * expected string, received undefined", and a `.min()` message never gets the
 * chance to replace it because the type check fails first. That string is written
 * for whoever wrote the schema. Reaching a customer with it — which it did, until
 * this helper — tells them nothing they can act on and quietly announces that
 * nobody looked. The brief's rule is that technical errors never surface, and this
 * is where the rule is actually kept.
 */
function requiredText(message: string, max: number, min = 1) {
  return z.string({ error: message }).trim().min(min, message).max(max, 'That is too long');
}

const NAME_MIN = 2;
const NAME_MAX = 80;

const email = z
  .string({ error: 'Email address is required' })
  .trim()
  .min(1, 'Email address is required')
  .max(254, 'Email address is too long')
  .email('Enter a valid email address')
  .refine((value) => !value.endsWith('.test') && !value.endsWith('.invalid'), {
    message: 'Enter a reachable email address',
  });

/** Permissive on formatting, strict on content — international numbers vary. */
const phone = z
  .string({ error: 'Enter a valid phone number' })
  .trim()
  .min(7, 'Enter a valid phone number')
  .max(32, 'Phone number is too long')
  .regex(/^[+()\-.\s\d]+$/, 'Phone number contains invalid characters');

const optionalPhone = z.union([phone, z.literal('')]).optional();

/**
 * Honeypot: a field hidden from real users. Anything typed into it is a bot.
 * Paired with `elapsedMs` — submissions faster than a human could type are
 * rejected server-side.
 */
const antiSpam = {
  /**
   * The honeypot. Hidden from people, irresistible to a form-filling bot.
   *
   * Deliberately permissive, and that is the whole point. It used to be
   * `z.literal('')`, which meant a filled honeypot failed *schema validation* —
   * so the request never reached the check that exists to handle it, and the
   * route answered 422 with `{"errors": {"website": [...]}}`. That response names
   * the trap. A scraper reads it, empties that one field, and walks straight in;
   * the silent-accept branch in every route was unreachable code the whole time.
   *
   * Anything at all parses now, and the routes decide — they answer 200 with a
   * plausible confirmation and quietly drop the submission, so a bot has nothing
   * to learn from. Nobody real ever sees this field, so there is nothing to
   * validate for their benefit. The cap is only there to bound what gets parsed.
   */
  website: z.string().max(200).optional(),
  // Plain number rather than `z.coerce.number()`: coercion would make the
  // schema's input type `unknown`, which breaks React Hook Form's resolver
  // typing. The server coerces string form values before parsing instead.
  elapsedMs: z.number().int().nonnegative().optional(),
  /**
   * The signed token the form fetched before submitting — the invisible CAPTCHA
   * and the CSRF check in one value. Optional in the schema on purpose: the
   * server decides what to do about a missing one, and a validation error would
   * show the visitor a message about a field they have never seen. See
   * `lib/form-token.ts`.
   */
  formToken: z.string().max(400).optional(),
  /**
   * Which page the form was submitted from, sent by the client.
   *
   * Optional and never validated into an error, because it is diagnostic context
   * for the owner rather than something the visitor typed — a malformed value
   * should be dropped, not turned into a message about a field nobody can see.
   * `describeRequest` sanitises it before it reaches an email.
   */
  sourcePage: z.string().max(200).optional(),
};

export const projectTypes = [
  'Commercial building',
  'Residential development',
  'Industrial facility',
  'Warehouse / distribution',
  'Infrastructure',
  'Bridge',
  'Energy project',
  'Agricultural building',
  'Fabrication only',
  'Other',
] as const;

export const budgetRanges = [
  'Under $50,000',
  '$50,000 – $250,000',
  '$250,000 – $1M',
  '$1M – $5M',
  'Over $5M',
  'Not yet determined',
] as const;

export const timelines = [
  'Immediate (within 2 weeks)',
  'Short term (1–3 months)',
  'Medium term (3–6 months)',
  'Long term (6+ months)',
  'Planning / budgeting stage',
] as const;

export const quantityUnits = [
  'Tonnes',
  'Kilograms',
  'Metres',
  'Pieces',
  'To be confirmed',
] as const;

/**
 * Surface treatments, in the order a buyer thinks about them: bare, prepared,
 * protected, coated. "To be advised" is first-class rather than an afterthought —
 * at enquiry stage the finish is frequently still with the engineer, and forcing a
 * guess produces a quotation against the wrong specification.
 */
export const finishes = [
  'Mill finish / untreated',
  'Shot blasted (SA 2.5)',
  'Primed',
  'Hot-dip galvanised',
  'Painted to specification',
  'Powder coated',
  'Weathering steel (no coating)',
  'To be advised',
] as const;

export const fulfilment = ['Delivery to site', 'Collection from works'] as const;

/**
 * The contact form's version of project type.
 *
 * The general enquiry option comes first and exists because most people who use a
 * contact form rather than the quote form do not have a project — they have a
 * question. A required dropdown with no honest answer for them is how a form
 * teaches visitors to pick something untrue.
 */
export const enquiryTypes = ['General enquiry, no specific project', ...projectTypes] as const;

export const quoteSchema = z.object({
  fullName: requiredText('Enter your full name', NAME_MAX, NAME_MIN),
  company: requiredText('Enter your company name', 120, 2),
  email,
  phone,
  country: requiredText('Select or enter your country', 80, 2),
  city: requiredText('Enter your city', 80, 2),
  projectType: z.enum(projectTypes, { message: 'Select a project type' }),
  product: requiredText('Select a steel product', 120),
  /**
   * Sections, grades and lengths, as free text. Deliberately not a set of numeric
   * fields: a real enquiry is "UB 305x165x40, 8no. at 6.2m and 4no. at 4.8m",
   * which no dimension form survives, and forcing one produces a note in the
   * description saying "see attached" — which is where we started.
   */
  dimensions: z
    .string({ error: 'Give us the sections, grades or lengths you need' })
    .trim()
    .min(2, 'Give us the sections, grades or lengths you need')
    .max(1000, 'Please put the detail in the notes below or attach a schedule'),
  quantity: requiredText('Enter an estimated quantity', 60),
  quantityUnit: z.enum(quantityUnits, { message: 'Select a unit' }),
  finish: z.enum(finishes, { message: 'Select a required finish' }),
  fulfilment: z.enum(fulfilment, { message: 'Tell us whether you need delivery or collection' }),
  /** Optional by design — many enquiries arrive before a budget exists. */
  budget: z.union([z.enum(budgetRanges), z.literal('')]).optional(),
  timeline: z.enum(timelines, { message: 'Select a timeline' }),
  description: z
    .string({ error: 'Please give us at least a sentence or two about the project' })
    .trim()
    .min(20, 'Please give us at least a sentence or two about the project')
    .max(5000, 'Description is too long, please attach a document instead'),
  consent: z.literal(true, {
    message: 'Please accept the terms to submit your request',
  }),
  newsletter: z.boolean().optional(),
  ...antiSpam,
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: requiredText('Enter your name', NAME_MAX, NAME_MIN),
  email,
  phone: optionalPhone,
  company: z.string().trim().max(120).optional(),
  projectType: z.enum(enquiryTypes, { message: 'Select what your enquiry is about' }),
  subject: requiredText('Enter a subject', 160, 3),
  message: z
    .string({ error: 'Please tell us a little more so we can route your message correctly' })
    .trim()
    .min(20, 'Please tell us a little more so we can route your message correctly')
    .max(5000, 'Message is too long'),
  consent: z.literal(true, { message: 'Please accept the terms to send your message' }),
  ...antiSpam,
});

export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email,
  ...antiSpam,
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

/* There is no application schema. Job applications go straight to the careers
   inbox from a prefilled mailto link on each role page, a candidate attaches a CV
   from their own mail client, where they already have it. A schema nothing
   validates against is a promise the codebase does not keep. */

/* Upload constraints live in `lib/uploads.ts` — size, formats and signature
   checks are one policy, and the schema has no business restating it. */

/** Minimum time a genuine user takes to complete a form, in milliseconds. */
export const MIN_FORM_ELAPSED_MS = 2500;

/**
 * Turns a parse failure into field errors safe to put in a response body.
 *
 * The schemas above give every field a message written for a customer, so in the
 * ordinary case this just passes them through. It exists for the case that is not
 * ordinary: a field added later without a message, a nested refinement, a Zod
 * upgrade that changes a default string. Any of those would put "Invalid input:
 * expected string, received undefined" in front of somebody trying to buy steel.
 *
 * So anything still carrying Zod's own phrasing is replaced with a sentence that
 * says what to do, and the original is logged for whoever has to fix the schema.
 * The check is a shape match on Zod's message format rather than a list of known
 * strings — a list would need updating in step with a library we do not control,
 * which is the same mistake as a denylist of file extensions.
 */
const ZOD_INTERNAL =
  /^(Invalid input|Invalid option|Too big|Too small|Unrecognized|Invalid literal)/i;

export function safeFieldErrors(error: z.ZodError, form: string): Record<string, string[]> {
  const flattened: Record<string, string[] | undefined> = error.flatten().fieldErrors;
  const cleaned: Record<string, string[]> = {};

  for (const [field, messages] of Object.entries(flattened)) {
    if (!messages?.length) continue;

    cleaned[field] = messages.map((message) => {
      if (!ZOD_INTERNAL.test(message)) return message;
      console.warn(`[${form}] schema is missing a human message for "${field}": ${message}`);
      return 'Please check this field and try again.';
    });
  }

  return cleaned;
}
