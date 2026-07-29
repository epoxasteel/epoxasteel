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

const NAME_MIN = 2;
const NAME_MAX = 80;

const email = z
  .string()
  .trim()
  .min(1, 'Email address is required')
  .max(254, 'Email address is too long')
  .email('Enter a valid email address')
  .refine((value) => !value.endsWith('.test') && !value.endsWith('.invalid'), {
    message: 'Enter a reachable email address',
  });

/** Permissive on formatting, strict on content — international numbers vary. */
const phone = z
  .string()
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
  website: z.literal('').optional(),
  // Plain number rather than `z.coerce.number()`: coercion would make the
  // schema's input type `unknown`, which breaks React Hook Form's resolver
  // typing. The server coerces string form values before parsing instead.
  elapsedMs: z.number().int().nonnegative().optional(),
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

export const quoteSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(NAME_MIN, 'Enter your full name')
    .max(NAME_MAX, 'Name is too long'),
  company: z.string().trim().min(2, 'Enter your company name').max(120, 'Company name is too long'),
  email,
  phone,
  country: z.string().trim().min(2, 'Select or enter your country').max(80),
  city: z.string().trim().min(2, 'Enter your city').max(80),
  projectType: z.enum(projectTypes, { message: 'Select a project type' }),
  product: z.string().trim().min(1, 'Select a steel product').max(120),
  quantity: z.string().trim().min(1, 'Enter an estimated quantity').max(60),
  quantityUnit: z.enum(quantityUnits, { message: 'Select a unit' }),
  budget: z.enum(budgetRanges, { message: 'Select a budget range' }),
  timeline: z.enum(timelines, { message: 'Select a timeline' }),
  description: z
    .string()
    .trim()
    .min(20, 'Please give us at least a sentence or two about the project')
    .max(5000, 'Description is too long — please attach a document instead'),
  /** File metadata only; the file itself travels as multipart form data. */
  attachmentName: z.string().max(255).optional(),
  attachmentSize: z.number().int().nonnegative().optional(),
  consent: z.literal(true, {
    message: 'Please accept the terms to submit your request',
  }),
  newsletter: z.boolean().optional(),
  ...antiSpam,
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(NAME_MIN, 'Enter your name').max(NAME_MAX, 'Name is too long'),
  email,
  phone: optionalPhone,
  company: z.string().trim().max(120).optional(),
  subject: z.string().trim().min(3, 'Enter a subject').max(160, 'Subject is too long'),
  message: z
    .string()
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

export const applicationSchema = z.object({
  name: z.string().trim().min(NAME_MIN, 'Enter your name').max(NAME_MAX),
  email,
  phone,
  role: z.string().trim().min(2, 'Which role are you applying for?').max(160),
  message: z
    .string()
    .trim()
    .min(20, 'Tell us briefly why you are a good fit')
    .max(5000, 'Message is too long'),
  consent: z.literal(true, { message: 'Please accept the terms to apply' }),
  ...antiSpam,
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

/** Upload constraints, enforced on the server and mirrored in the UI copy. */
export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const ATTACHMENT_ACCEPT = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
  'image/vnd.dwg',
  'application/acad',
];
export const ATTACHMENT_ACCEPT_LABEL = 'PDF, DWG, XLSX, DOCX, ZIP or images — up to 10 MB';

/** Minimum time a genuine user takes to complete a form, in milliseconds. */
export const MIN_FORM_ELAPSED_MS = 2500;
