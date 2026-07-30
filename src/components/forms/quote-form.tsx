'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Paperclip, Send, X, FileText } from 'lucide-react';
import {
  quoteSchema,
  projectTypes,
  budgetRanges,
  timelines,
  quantityUnits,
  finishes,
  fulfilment,
  type QuoteInput,
} from '@/lib/validations';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME, ACCEPT_ATTRIBUTE, extensionOf } from '@/lib/uploads';
import { products } from '@/content/products';
import { countries } from '@/content/countries';
import { Field, Input, Textarea, Select, Checkbox, Honeypot, Label } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/misc';
import { cn, formatBytes } from '@/lib/utils';
import { EASE_OUT_EXPO, EASE_SPRING } from '@/lib/motion';
import { useElapsedSinceMount } from '@/lib/use-elapsed';
import { useFormDraft } from '@/lib/use-form-draft';
import { useFormToken } from '@/lib/use-form-token';
import { useUpload } from '@/lib/use-upload';

/**
 * The enterprise RFQ form.
 *
 * Grouped into three fieldsets rather than presented as one wall of inputs —
 * the same information, but it reads as a short form three times instead of a
 * long form once, which measurably improves completion on forms this size.
 */
export function QuoteForm({
  defaultProduct,
  className,
}: {
  /** Pre-selects a product when arriving from a product page. */
  defaultProduct?: string;
  className?: string;
}) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [reference, setReference] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<File[]>([]);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const elapsedSinceMount = useElapsedSinceMount();

  const form = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      company: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      product: defaultProduct ?? '',
      dimensions: '',
      quantity: '',
      budget: '',
      description: '',
      consent: false as unknown as true,
      newsletter: false,
      website: '',
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  /* A quote request asks for a project description, tonnages and a programme.
     People write that over several minutes with a drawing open beside them. */
  const clearDraft = useFormDraft('epoxa:draft:quote', form);
  const { prime, token, upload } = useFormToken('quote');
  // XMLHttpRequest rather than fetch, because only one of the two can tell a
  // visitor how far a 9 MB drawing set has actually got. See lib/use-upload.ts.
  const { phase, percent, send } = useUpload<{
    message?: string;
    reference?: string;
    notice?: string;
  }>();

  const consent = watch('consent');
  const newsletter = watch('newsletter');

  /**
   * Checks a selection before it costs anyone a round trip.
   *
   * A mirror of the server's rules, never a replacement for them — the server
   * re-checks everything, including the file signature, which cannot be read here
   * without loading the file into memory to no purpose. The limit itself comes from
   * the server (see `useFormToken`), so this cannot drift out of step with it.
   */
  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const selected = Array.from(event.target.files ?? []);
    // Reset immediately: the same file picked twice should re-fire change, and the
    // chosen files live in React state from here on.
    event.target.value = '';

    if (!selected.length) return;

    const accepted: File[] = [];

    for (const file of selected) {
      if (files.length + accepted.length >= upload.maxFiles) {
        setFileError(
          `You can attach up to ${upload.maxFiles} files. Please put the rest in a ZIP.`,
        );
        break;
      }

      if (file.size === 0) {
        setFileError(`“${file.name}” is empty. Please check the file and try again.`);
        continue;
      }

      if (file.size > upload.maxBytes) {
        setFileError(
          `“${file.name}” is ${formatBytes(file.size)} — the limit is ${formatBytes(upload.maxBytes)} per file.`,
        );
        continue;
      }

      // Some systems report an empty or generic type for CAD files, so the
      // extension is what decides and the MIME type is only consulted when the
      // browser was specific about it.
      const extension = extensionOf(file.name);
      const knownExtension = (ALLOWED_EXTENSIONS as readonly string[]).includes(extension);
      const knownMime = !file.type || (ALLOWED_MIME as readonly string[]).includes(file.type);

      if (!knownExtension || !knownMime) {
        setFileError(
          `We cannot accept “${file.name}”. Please attach a PDF, drawing, spreadsheet or image.`,
        );
        continue;
      }

      if (files.some((existing) => existing.name === file.name && existing.size === file.size)) {
        setFileError(`“${file.name}” is already attached.`);
        continue;
      }

      accepted.push(file);
    }

    if (accepted.length) setFiles((current) => [...current, ...accepted]);
  }

  function removeFile(target: File) {
    setFiles((current) => current.filter((file) => file !== target));
    setFileError(null);
  }

  async function onSubmit(values: QuoteInput) {
    setServerError(null);

    // Multipart, so the drawings travel with the enquiry in one request.
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      formData.append(key, String(value));
    });
    formData.set('elapsedMs', String(elapsedSinceMount()));
    const issued = await token();
    if (issued) formData.set('formToken', issued);
    for (const file of files) formData.append('attachments', file);

    const result = await send('/api/quote', formData);

    if (!result.ok) {
      setServerError(
        result.data?.message ??
          (result.status === 0
            ? 'The upload did not complete. Please check your connection and try again.'
            : 'We could not submit your request. Please try again, or call us directly.'),
      );
      return;
    }

    clearDraft();
    setNotice(result.data?.notice ?? null);
    setReference(result.data?.reference ?? 'received');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (reference) {
    return (
      <QuoteSuccess
        reference={reference}
        notice={notice}
        files={files.map((file) => file.name)}
        className={className}
      />
    );
  }

  const busy = isSubmitting || phase !== 'idle';

  return (
    <form
      onFocus={prime}
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-12', className)}
      noValidate
    >
      <Honeypot {...register('website')} />

      {/* ---------------------------------------------------------------- */}
      <FormSection index={1} title="Your details" description="Who we should be talking to.">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field id="quote-name" label="Full name" error={errors.fullName?.message} required>
            {(props) => (
              <Input
                autoComplete="name"
                placeholder="Jane Whitfield"
                {...props}
                {...register('fullName')}
              />
            )}
          </Field>

          <Field id="quote-company" label="Company" error={errors.company?.message} required>
            {(props) => (
              <Input
                autoComplete="organization"
                placeholder="Whitfield Construction"
                {...props}
                {...register('company')}
              />
            )}
          </Field>

          <Field id="quote-email" label="Email address" error={errors.email?.message} required>
            {(props) => (
              <Input
                type="email"
                autoComplete="email"
                placeholder="jane@company.com"
                {...props}
                {...register('email')}
              />
            )}
          </Field>

          <Field id="quote-phone" label="Phone" error={errors.phone?.message} required>
            {(props) => (
              <Input
                type="tel"
                autoComplete="tel"
                placeholder="+1 212 555 0180"
                {...props}
                {...register('phone')}
              />
            )}
          </Field>

          <Field id="quote-country" label="Country" error={errors.country?.message} required>
            {(props) => (
              <Select
                placeholder="Select a country"
                autoComplete="country-name"
                {...props}
                {...register('country')}
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field id="quote-city" label="City" error={errors.city?.message} required>
            {(props) => (
              <Input
                autoComplete="address-level2"
                placeholder="Newark"
                {...props}
                {...register('city')}
              />
            )}
          </Field>
        </div>
      </FormSection>

      {/* ---------------------------------------------------------------- */}
      <FormSection
        index={2}
        title="Your requirement"
        description="Enough for us to price it accurately."
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            id="quote-project-type"
            label="Project type"
            error={errors.projectType?.message}
            required
          >
            {(props) => (
              <Select placeholder="Select a project type" {...props} {...register('projectType')}>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field id="quote-product" label="Steel product" error={errors.product?.message} required>
            {(props) => (
              <Select placeholder="Select a product" {...props} {...register('product')}>
                {products.map((product) => (
                  <option key={product.slug} value={product.name}>
                    {product.name}
                  </option>
                ))}
                <option value="Multiple products">Multiple products</option>
                <option value="Not sure — please advise">Not sure — please advise</option>
              </Select>
            )}
          </Field>

          <Field
            id="quote-quantity"
            label="Estimated quantity"
            error={errors.quantity?.message}
            hint="An approximate figure is fine at this stage."
            required
          >
            {(props) => <Input placeholder="e.g. 240" {...props} {...register('quantity')} />}
          </Field>

          <Field
            id="quote-quantity-unit"
            label="Unit"
            error={errors.quantityUnit?.message}
            required
          >
            {(props) => (
              <Select placeholder="Select a unit" {...props} {...register('quantityUnit')}>
                {quantityUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            id="quote-finish"
            label="Required finish"
            error={errors.finish?.message}
            hint="If the coating specification is still open, say so."
            required
          >
            {(props) => (
              <Select placeholder="Select a finish" {...props} {...register('finish')}>
                {finishes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            id="quote-fulfilment"
            label="Delivery or collection"
            error={errors.fulfilment?.message}
            required
          >
            {(props) => (
              <Select placeholder="Select an option" {...props} {...register('fulfilment')}>
                {fulfilment.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            id="quote-timeline"
            label="Estimated deadline"
            error={errors.timeline?.message}
            required
          >
            {(props) => (
              <Select placeholder="Select a timeline" {...props} {...register('timeline')}>
                {timelines.map((timeline) => (
                  <option key={timeline} value={timeline}>
                    {timeline}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field
            id="quote-budget"
            label="Budget range"
            hint="Optional. It helps us propose the right specification, not raise the price."
            error={errors.budget?.message}
          >
            {(props) => (
              <Select placeholder="Prefer not to say" {...props} {...register('budget')}>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <Field
          id="quote-dimensions"
          label="Sections, grades & dimensions"
          hint="Section sizes, steel grades and lengths — as much as you have. A rough list beats an empty box."
          error={errors.dimensions?.message}
          required
          className="mt-6"
        >
          {(props) => (
            <Textarea
              rows={3}
              placeholder="UB 305×165×40 S355JR — 8no. at 6.2 m, 4no. at 4.8 m. Base plates 300×300×20."
              {...props}
              {...register('dimensions')}
            />
          )}
        </Field>

        <Field
          id="quote-description"
          label="Additional notes"
          hint="Delivery location, access constraints, sequencing, any processing you need, and anything else that shapes the price."
          error={errors.description?.message}
          required
          className="mt-6"
        >
          {(props) => (
            <Textarea
              rows={7}
              placeholder="A four-storey commercial frame in Newark. Erection starts mid-October and we would like delivery sequenced by bay. Site access is via a single crane bay before 07:00…"
              {...props}
              {...register('description')}
            />
          )}
        </Field>
      </FormSection>

      {/* ---------------------------------------------------------------- */}
      <FormSection
        index={3}
        title="Drawings & documents"
        description="Optional, but it usually speeds things up considerably."
      >
        <Label htmlFor="quote-attachment" className="mb-2">
          Attachments
        </Label>

        {files.length ? (
          <ul className="mb-4 space-y-2.5">
            <AnimatePresence initial={false}>
              {files.map((file) => (
                <motion.li
                  key={`${file.name}:${file.size}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                  className="border-hairline bg-graphite flex items-center gap-4 overflow-hidden rounded-sm border p-4"
                >
                  <span className="border-hairline bg-charcoal text-arc-glow grid size-10 shrink-0 place-items-center rounded-sm border">
                    <FileText aria-hidden className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-bright truncate text-[0.875rem] font-medium">{file.name}</p>
                    <p className="text-steel text-[0.8125rem]">{formatBytes(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file)}
                    disabled={busy}
                    aria-label={`Remove ${file.name}`}
                    className="text-steel hover:text-danger grid size-11 shrink-0 place-items-center rounded-sm transition-colors disabled:opacity-40"
                  >
                    <X aria-hidden className="size-4" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        ) : null}

        {files.length < upload.maxFiles ? (
          <label
            htmlFor="quote-attachment"
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-sm',
              'border-hairline-strong bg-graphite/60 border border-dashed px-6 text-center',
              'hover:border-arc/50 hover:bg-graphite transition-colors duration-300',
              'focus-within:border-arc-bright',
              files.length ? 'py-6' : 'py-10',
            )}
          >
            <span className="border-hairline text-steel grid size-11 place-items-center rounded-full border">
              <Paperclip aria-hidden className="size-4" />
            </span>
            <span className="text-chalk text-[0.9375rem]">
              {files.length
                ? 'Add another drawing or document'
                : 'Attach drawings, a bill of quantities or a specification'}
            </span>
            <span className="text-steel text-[0.8125rem]">{upload.label}</span>
          </label>
        ) : (
          <p className="text-steel border-hairline bg-graphite/60 rounded-sm border border-dashed px-6 py-5 text-center text-[0.8125rem]">
            That is the maximum of {upload.maxFiles} files. Remove one to attach a different
            document, or send the rest as a ZIP.
          </p>
        )}

        <input
          ref={fileInputRef}
          id="quote-attachment"
          type="file"
          multiple
          className="sr-only"
          onChange={onFileChange}
          disabled={busy}
          accept={ACCEPT_ATTRIBUTE}
          aria-describedby={fileError ? 'quote-attachment-error' : undefined}
        />

        {fileError ? (
          <p id="quote-attachment-error" role="alert" className="text-danger mt-2 text-[0.8125rem]">
            {fileError}
          </p>
        ) : null}
      </FormSection>

      {/* ---------------------------------------------------------------- */}
      <div className="border-hairline space-y-5 border-t pt-8">
        <div className="flex items-start gap-3">
          <Checkbox
            id="quote-consent"
            name="consent"
            checked={Boolean(consent)}
            onCheckedChange={(checked) =>
              setValue('consent', checked === true ? true : (false as unknown as true), {
                shouldValidate: true,
              })
            }
            invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'quote-consent-error' : undefined}
          />
          <div>
            <label htmlFor="quote-consent" className="text-mist text-[0.875rem] leading-relaxed">
              I agree to the{' '}
              <Link href="/terms" className="text-arc-glow underline underline-offset-2">
                terms &amp; conditions
              </Link>{' '}
              and consent to EPOXA STEEL processing my details in line with the{' '}
              <Link href="/privacy" className="text-arc-glow underline underline-offset-2">
                privacy policy
              </Link>
              . <span className="text-arc-bright">*</span>
            </label>
            {errors.consent ? (
              <p
                id="quote-consent-error"
                role="alert"
                className="text-danger mt-1.5 text-[0.8125rem]"
              >
                {errors.consent.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="quote-newsletter"
            name="newsletter"
            checked={Boolean(newsletter)}
            onCheckedChange={(checked) => setValue('newsletter', checked === true)}
          />
          <label htmlFor="quote-newsletter" className="text-mist text-[0.875rem] leading-relaxed">
            Send me the monthly Epoxa Briefing — market conditions and technical guidance.
          </label>
        </div>

        {serverError ? (
          <Alert tone="error" title="Request not submitted">
            {serverError}
          </Alert>
        ) : null}

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
          <Button type="submit" size="lg" disabled={busy} sheen>
            {busy ? (
              <>
                <Loader2 aria-hidden className="animate-spin" />
                {phase === 'uploading' ? `Uploading ${percent}%` : 'Submitting…'}
              </>
            ) : (
              <>
                <Send aria-hidden />
                Submit request
              </>
            )}
          </Button>
          <p className="text-steel text-[0.8125rem] leading-relaxed">
            Standard enquiries are quoted within 48 hours. You will receive a confirmation email
            with your reference immediately.
          </p>
        </div>

        <UploadProgress phase={phase} percent={percent} fileCount={files.length} />
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The progress bar, and the reason it is worth the code.
 *
 * Two states, because the wait has two halves that feel different. While bytes are
 * moving there is a real number to show, and it is announced politely so a screen
 * reader user is not left guessing either. Once the last byte lands there is nothing
 * left to measure — the server is validating signatures, writing the record and
 * sending two emails — so the bar stops pretending to know and animates instead. A
 * bar parked at 100% for eight seconds reads as broken.
 *
 * `aria-live="polite"` on the caption rather than the bar: announcing every
 * percentage would be unusable, so the bar carries `aria-valuenow` for anyone who
 * asks and the caption speaks only when the phase changes.
 */
function UploadProgress({
  phase,
  percent,
  fileCount,
}: {
  phase: 'idle' | 'uploading' | 'processing';
  percent: number;
  fileCount: number;
}) {
  return (
    <AnimatePresence>
      {phase !== 'idle' ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          className="overflow-hidden"
        >
          <div className="border-hairline bg-graphite mt-1 rounded-sm border p-4">
            <div className="mb-2.5 flex items-baseline justify-between gap-4">
              <p aria-live="polite" className="text-chalk text-[0.875rem]">
                {phase === 'uploading'
                  ? `Uploading ${fileCount === 1 ? 'your file' : `${fileCount} files`}…`
                  : 'Upload complete — submitting your request…'}
              </p>
              {phase === 'uploading' ? (
                <span className="text-steel font-mono text-[0.8125rem] tabular-nums">
                  {percent}%
                </span>
              ) : null}
            </div>

            <div
              className="bg-void h-1.5 overflow-hidden rounded-full"
              role="progressbar"
              aria-label="Upload progress"
              {...(phase === 'uploading'
                ? { 'aria-valuenow': percent, 'aria-valuemin': 0, 'aria-valuemax': 100 }
                : {})}
            >
              {phase === 'uploading' ? (
                <motion.div
                  className="bg-arc-bright h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              ) : (
                // Indeterminate: a sweep, because there is genuinely nothing to
                // measure and a static full bar would be a lie about being stuck.
                <motion.div
                  className="via-arc-bright h-full w-1/3 rounded-full bg-gradient-to-r from-transparent to-transparent"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function FormSection({
  index,
  title,
  description,
  children,
}: {
  index: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-7 w-full">
        <span className="flex items-baseline gap-4">
          <span className="text-arc-bright font-mono text-[0.8125rem] tabular-nums">0{index}</span>
          <span className="font-display text-title text-bright font-semibold">{title}</span>
        </span>
        <span className="text-ash mt-2 block pl-9 text-[0.9375rem]">{description}</span>
      </legend>
      {children}
    </fieldset>
  );
}

function QuoteSuccess({
  reference,
  notice,
  files,
  className,
}: {
  reference: string;
  /** Set when the transport is degraded and the confirmation email may be slow. */
  notice?: string | null;
  /** Named back so somebody can see the drawings arrived, not just assume it. */
  files: string[];
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className={cn(
        'border-hairline bg-charcoal relative overflow-hidden rounded-lg border p-8 sm:p-12',
        className,
      )}
      role="status"
    >
      <div className="bg-grid-fine pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div
        className="bg-arc/12 pointer-events-none absolute -top-24 -right-24 size-72 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="relative">
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE_SPRING }}
          className="border-success/40 bg-success/10 text-success grid size-14 place-items-center rounded-full border"
        >
          <Check aria-hidden className="size-6" strokeWidth={2.5} />
        </motion.span>

        <h2 className="font-display text-headline text-bright mt-7 font-semibold">
          Request received.
        </h2>

        <p className="text-lead text-ash mt-4 max-w-xl">
          Thank you. Your enquiry is with our commercial team and a confirmation has been sent to
          your email address.
        </p>

        <div className="border-hairline bg-graphite mt-8 inline-flex items-center gap-4 rounded-md border px-5 py-4">
          <span className="text-steel text-[0.6875rem] tracking-[0.16em] uppercase">Reference</span>
          <span className="text-bright font-mono text-lg font-medium">{reference}</span>
        </div>

        {notice ? (
          <p className="text-ash mt-6 max-w-xl text-[0.875rem] leading-relaxed">{notice}</p>
        ) : null}

        {/* Upload confirmation: naming the files back is the only way somebody knows
            the attachment actually made it, rather than hoping it did. */}
        {files.length ? (
          <div className="border-hairline bg-graphite/60 mt-6 max-w-xl rounded-md border p-5">
            <p className="text-chalk flex items-center gap-2 text-[0.875rem] font-medium">
              <Check aria-hidden className="text-success size-4" strokeWidth={2.5} />
              {files.length === 1 ? '1 file received' : `${files.length} files received`}
            </p>
            <ul className="mt-3 space-y-1.5">
              {files.map((name) => (
                <li key={name} className="text-ash flex items-baseline gap-2 text-[0.8125rem]">
                  <FileText aria-hidden className="text-steel size-3.5 shrink-0 translate-y-0.5" />
                  <span className="truncate">{name}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="border-hairline mt-10 grid gap-6 border-t pt-8 sm:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Review',
              body: 'We check availability, lead times and any technical points worth raising.',
            },
            {
              step: '02',
              title: 'Quotation',
              body: 'A line-by-line quotation within 48 hours for standard enquiries.',
            },
            {
              step: '03',
              title: 'Confirmation',
              body: 'Agreed dates, allocated material and a named account manager.',
            },
          ].map((item) => (
            <div key={item.step}>
              <p className="text-arc-bright font-mono text-[0.8125rem]">{item.step}</p>
              <p className="font-display text-bright mt-2 text-[1.0625rem] font-medium">
                {item.title}
              </p>
              <p className="text-ash mt-1.5 text-[0.875rem] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/products" variant="outline">
            Explore products
          </Button>
          <Button href="/projects" variant="ghost">
            View our projects
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
