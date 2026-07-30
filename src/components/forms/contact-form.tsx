'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Check, Loader2, Send } from 'lucide-react';
import { contactSchema, enquiryTypes, type ContactInput } from '@/lib/validations';
import { Field, Input, Textarea, Select, Checkbox, Honeypot } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/misc';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { useElapsedSinceMount } from '@/lib/use-elapsed';
import { useFormDraft } from '@/lib/use-form-draft';
import { useFormToken } from '@/lib/use-form-token';

export function ContactForm({ className }: { className?: string }) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [reference, setReference] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const elapsedSinceMount = useElapsedSinceMount();

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
      consent: false as unknown as true,
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

  // Nobody should lose a half-written message to a stray click.
  const clearDraft = useFormDraft('epoxa:draft:contact', form);
  // Fetched on first focus; awaited at submit. See lib/use-form-token.ts.
  const { prime, token } = useFormToken('contact');

  const consent = watch('consent');

  async function onSubmit(values: ContactInput) {
    setServerError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          elapsedMs: elapsedSinceMount(),
          formToken: await token(),
          // Which page they were on. Sent from the client rather than read from
          // Referer, which privacy tooling strips and which on a client-side route
          // change still names whichever page loaded first.
          sourcePage: window.location.pathname,
        }),
      });

      const data = (await response.json()) as {
        message?: string;
        reference?: string;
        notice?: string;
      };

      if (!response.ok) {
        setServerError(data.message ?? 'We could not send your message. Please try again.');
        return;
      }

      clearDraft();
      setNotice(data.notice ?? null);
      setReference(data.reference ?? 'received');
    } catch {
      setServerError('Network error. Please check your connection and try again.');
    }
  }

  if (reference) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        className={cn(
          'border-hairline bg-charcoal flex flex-col items-start gap-5 rounded-md border p-8',
          className,
        )}
        role="status"
      >
        <span className="border-success/40 bg-success/10 text-success grid size-12 place-items-center rounded-full border">
          <Check aria-hidden className="size-5" strokeWidth={2.5} />
        </span>
        <div>
          <h3 className="font-display text-title text-bright font-semibold">Message sent</h3>
          <p className="text-ash mt-2 max-w-md text-[0.9375rem] leading-relaxed">
            {notice
              ? 'Thank you — your message is with the right team and we will respond within one business day.'
              : 'Thank you — your message is with the right team and we will respond within one business day. A confirmation has been sent to your email address.'}
          </p>
          {notice ? (
            <p className="text-ash mt-3 max-w-md text-[0.875rem] leading-relaxed">{notice}</p>
          ) : null}
          {reference !== 'received' ? (
            <p className="text-steel mt-4 font-mono text-[0.8125rem]">
              Reference <span className="text-chalk">{reference}</span>
            </p>
          ) : null}
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onFocus={prime}
      onSubmit={handleSubmit(onSubmit)}
      className={cn('space-y-6', className)}
      noValidate
    >
      <Honeypot {...register('website')} />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="contact-name" label="Full name" error={errors.name?.message} required>
          {(props) => (
            <Input
              autoComplete="name"
              placeholder="Jane Whitfield"
              {...props}
              {...register('name')}
            />
          )}
        </Field>

        <Field id="contact-company" label="Company" error={errors.company?.message}>
          {(props) => (
            <Input
              autoComplete="organization"
              placeholder="Whitfield Construction"
              {...props}
              {...register('company')}
            />
          )}
        </Field>

        <Field id="contact-email" label="Email address" error={errors.email?.message} required>
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

        <Field
          id="contact-phone"
          label="Phone"
          hint="Optional — helpful if your enquiry is urgent."
          error={errors.phone?.message}
        >
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
      </div>

      <Field
        id="contact-project-type"
        label="What is your enquiry about?"
        error={errors.projectType?.message}
        required
      >
        {(props) => (
          <Select placeholder="Select an option" {...props} {...register('projectType')}>
            {enquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field id="contact-subject" label="Subject" error={errors.subject?.message} required>
        {(props) => (
          <Input
            placeholder="Structural steel enquiry — Brooklyn project"
            {...props}
            {...register('subject')}
          />
        )}
      </Field>

      <Field
        id="contact-message"
        label="Message"
        hint="The more context you give us, the more useful our first reply will be."
        error={errors.message?.message}
        required
      >
        {(props) => (
          <Textarea
            rows={7}
            placeholder="Tell us about your project, the products you need, and your timeline."
            {...props}
            {...register('message')}
          />
        )}
      </Field>

      <div className="flex items-start gap-3">
        <Checkbox
          id="contact-consent"
          name="consent"
          checked={Boolean(consent)}
          onCheckedChange={(checked) =>
            setValue('consent', checked === true ? true : (false as unknown as true), {
              shouldValidate: true,
            })
          }
          invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? 'contact-consent-error' : undefined}
        />
        <div>
          <label htmlFor="contact-consent" className="text-mist text-[0.875rem] leading-relaxed">
            I agree to the{' '}
            <a href="/terms" className="text-arc-glow underline underline-offset-2">
              terms &amp; conditions
            </a>{' '}
            and consent to {siteConfig.legalName} processing my details in line with the{' '}
            <a href="/privacy" className="text-arc-glow underline underline-offset-2">
              privacy policy
            </a>
            .
          </label>
          {errors.consent ? (
            <p
              id="contact-consent-error"
              role="alert"
              className="text-danger mt-1.5 text-[0.8125rem]"
            >
              {errors.consent.message}
            </p>
          ) : null}
        </div>
      </div>

      {serverError ? (
        <Alert tone="error" title="Message not sent">
          {serverError}
        </Alert>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting} sheen>
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden className="animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send aria-hidden />
              Send message
            </>
          )}
        </Button>
        <p className="text-steel text-[0.8125rem]">We respond within one business day.</p>
      </div>
    </form>
  );
}
