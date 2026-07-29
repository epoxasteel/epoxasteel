'use client';

import * as React from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useElapsedSinceMount } from '@/lib/use-elapsed';

/**
 * Newsletter subscription.
 *
 * Deliberately does **not** use Zod or React Hook Form. This form lives in the
 * footer, so it renders on every page — and importing the shared schema module
 * pulled the whole Zod runtime, plus the quote and contact schemas, into the
 * bundle for the entire site. That was the single largest JavaScript chunk we
 * shipped, in service of validating one email field.
 *
 * The server still validates with `newsletterSchema`; that is where the security
 * boundary actually is. Here, a native `type="email"` field plus a shape check
 * is enough to catch a typo before a round trip.
 */

/** Deliberately permissive — the server owns the authoritative check. */
function looksLikeEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function NewsletterForm({ className }: { className?: string }) {
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const elapsedSinceMount = useElapsedSinceMount();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('idle');

    if (!looksLikeEmail(email)) {
      setFieldError('Enter a valid email address');
      return;
    }

    setFieldError(null);
    setIsSubmitting(true);
    const values = { email: email.trim(), website };

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, elapsedMs: elapsedSinceMount() }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus('error');
        setMessage(data.message ?? 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage(data.message ?? 'You are subscribed.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === 'success') {
    return (
      <div
        className={cn(
          'border-success/35 bg-success/[0.07] flex items-center gap-3 rounded-sm border px-4 py-3.5',
          className,
        )}
        role="status"
      >
        <Check aria-hidden className="text-success size-4 shrink-0" />
        <p className="text-mist text-[0.875rem]">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn('space-y-2.5', className)} noValidate>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (fieldError) setFieldError(null);
            }}
            aria-invalid={Boolean(fieldError)}
            aria-describedby={fieldError ? 'newsletter-email-error' : undefined}
            className={cn(
              'bg-graphite text-bright h-12 w-full rounded-sm border px-4 text-[0.9375rem]',
              'placeholder:text-steel transition-[border-color,box-shadow] duration-200',
              'focus:border-arc-bright focus:shadow-[0_0_0_3px_rgba(58,138,224,0.16)] focus:outline-none',
              fieldError ? 'border-danger' : 'border-hairline hover:border-hairline-strong',
            )}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-sm px-6',
            'bg-bright text-void text-[0.875rem] font-medium',
            'transition-colors duration-300 hover:bg-white',
            'disabled:pointer-events-none disabled:opacity-50',
          )}
        >
          {isSubmitting ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden opacity-0">
        <label htmlFor="newsletter-website">Leave this field empty</label>
        <input
          id="newsletter-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {fieldError ? (
        <p id="newsletter-email-error" role="alert" className="text-danger text-[0.8125rem]">
          {fieldError}
        </p>
      ) : null}

      {status === 'error' ? (
        <p role="alert" className="text-danger text-[0.8125rem]">
          {message}
        </p>
      ) : null}

      <p className="text-steel text-[0.75rem] leading-relaxed">
        By subscribing you agree to our{' '}
        <a href="/privacy" className="text-ash hover:text-mist underline underline-offset-2">
          privacy policy
        </a>
        . Unsubscribe at any time.
      </p>
    </form>
  );
}
