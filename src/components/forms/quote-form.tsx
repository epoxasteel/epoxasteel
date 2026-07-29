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
  ATTACHMENT_MAX_BYTES,
  ATTACHMENT_ACCEPT,
  ATTACHMENT_ACCEPT_LABEL,
  type QuoteInput,
} from '@/lib/validations';
import { products } from '@/content/products';
import { countries } from '@/content/countries';
import { Field, Input, Textarea, Select, Checkbox, Honeypot, Label } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/misc';
import { cn, formatBytes } from '@/lib/utils';
import { EASE_OUT_EXPO, EASE_SPRING } from '@/lib/motion';
import { useElapsedSinceMount } from '@/lib/use-elapsed';
import { useFormDraft } from '@/lib/use-form-draft';

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
  const [file, setFile] = React.useState<File | null>(null);
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
      quantity: '',
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

  const consent = watch('consent');
  const newsletter = watch('newsletter');

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    const selected = event.target.files?.[0];

    if (!selected) {
      setFile(null);
      return;
    }

    if (selected.size > ATTACHMENT_MAX_BYTES) {
      setFileError(`That file is ${formatBytes(selected.size)}. The limit is 10 MB.`);
      event.target.value = '';
      return;
    }

    // Some browsers report an empty type for CAD files; fall back to extension.
    const extension = selected.name.split('.').pop()?.toLowerCase() ?? '';
    const allowedExtensions = [
      'pdf',
      'dwg',
      'dxf',
      'xlsx',
      'xls',
      'doc',
      'docx',
      'zip',
      'png',
      'jpg',
      'jpeg',
      'webp',
    ];

    if (
      selected.type &&
      !ATTACHMENT_ACCEPT.includes(selected.type) &&
      !allowedExtensions.includes(extension)
    ) {
      setFileError(
        'That file type is not supported. Please attach a PDF, drawing, spreadsheet or image.',
      );
      event.target.value = '';
      return;
    }

    setFile(selected);
  }

  function clearFile() {
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function onSubmit(values: QuoteInput) {
    setServerError(null);

    try {
      // Multipart, so the attachment travels with the enquiry in one request.
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, String(value));
      });
      formData.set('elapsedMs', String(elapsedSinceMount()));
      if (file) formData.append('attachment', file);

      const response = await fetch('/api/quote', { method: 'POST', body: formData });
      const data = (await response.json()) as { message?: string; reference?: string };

      if (!response.ok) {
        setServerError(data.message ?? 'We could not submit your request. Please try again.');
        return;
      }

      clearDraft();
      setReference(data.reference ?? 'received');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    }
  }

  if (reference) {
    return <QuoteSuccess reference={reference} className={className} />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-12', className)} noValidate>
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

          <Field id="quote-budget" label="Budget range" error={errors.budget?.message} required>
            {(props) => (
              <Select placeholder="Select a budget range" {...props} {...register('budget')}>
                {budgetRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </Select>
            )}
          </Field>

          <Field id="quote-timeline" label="Timeline" error={errors.timeline?.message} required>
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
        </div>

        <Field
          id="quote-description"
          label="Project description"
          hint="Grades, sizes, lengths, finish, delivery location and any processing you need. The more specific you are, the more accurate our quotation."
          error={errors.description?.message}
          required
          className="mt-6"
        >
          {(props) => (
            <Textarea
              rows={8}
              placeholder="We need wide-flange beams and base plates for a four-storey commercial frame in Newark. Erection starts mid-October and we would like delivery sequenced by bay…"
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
          Attachment
        </Label>

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="border-hairline bg-graphite flex items-center gap-4 rounded-sm border p-4"
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
                onClick={clearFile}
                aria-label={`Remove ${file.name}`}
                className="text-steel hover:text-danger grid size-8 shrink-0 place-items-center rounded-sm transition-colors"
              >
                <X aria-hidden className="size-4" />
              </button>
            </motion.div>
          ) : (
            <motion.label
              key="picker"
              htmlFor="quote-attachment"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-sm',
                'border-hairline-strong bg-graphite/60 border border-dashed px-6 py-10 text-center',
                'hover:border-arc/50 hover:bg-graphite transition-colors duration-300',
                'focus-within:border-arc-bright',
              )}
            >
              <span className="border-hairline text-steel grid size-11 place-items-center rounded-full border">
                <Paperclip aria-hidden className="size-4" />
              </span>
              <span className="text-chalk text-[0.9375rem]">
                Attach drawings, a bill of quantities or a specification
              </span>
              <span className="text-steel text-[0.8125rem]">{ATTACHMENT_ACCEPT_LABEL}</span>
            </motion.label>
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          id="quote-attachment"
          type="file"
          className="sr-only"
          onChange={onFileChange}
          accept=".pdf,.dwg,.dxf,.xlsx,.xls,.doc,.docx,.zip,.png,.jpg,.jpeg,.webp"
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
          <Button type="submit" size="lg" disabled={isSubmitting} sheen>
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden className="animate-spin" />
                Submitting…
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
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

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

function QuoteSuccess({ reference, className }: { reference: string; className?: string }) {
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
