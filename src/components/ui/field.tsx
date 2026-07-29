'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/* Label                                                                      */
/* -------------------------------------------------------------------------- */

export function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'text-chalk flex items-center gap-1.5 text-[0.8125rem] font-medium',
        'peer-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span className="text-arc-bright" aria-hidden>
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared control styling                                                     */
/* -------------------------------------------------------------------------- */

const controlBase = [
  'w-full rounded-sm border bg-graphite/80 px-3.5 text-[0.9375rem] text-bright',
  'transition-[border-color,box-shadow,background-color] duration-200',
  '[transition-timing-function:var(--ease-out-quint)]',
  'placeholder:text-steel',
  'hover:border-hairline-strong',
  'focus:border-arc-bright focus:bg-graphite focus:outline-none',
  'focus:shadow-[0_0_0_3px_rgba(58,138,224,0.16)]',
  'disabled:cursor-not-allowed disabled:opacity-50',
].join(' ');

/* -------------------------------------------------------------------------- */
/* Input                                                                      */
/* -------------------------------------------------------------------------- */

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        'h-11',
        invalid
          ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(200,80,63,0.16)]'
          : 'border-hairline',
        className,
      )}
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/* Textarea                                                                   */
/* -------------------------------------------------------------------------- */

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, rows = 6, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        'resize-y py-3 leading-relaxed',
        invalid
          ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(200,80,63,0.16)]'
          : 'border-hairline',
        className,
      )}
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/* Select                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A native <select> rather than a Radix listbox.
 *
 * On a form this long, the native control is the better choice: it is fully
 * keyboard accessible with zero JavaScript, renders as the platform picker on
 * mobile (which users navigate far faster than a custom popover), and works
 * before hydration. Only the chevron is ours.
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean; placeholder?: string }
>(function Select({ className, invalid, placeholder, children, defaultValue, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        defaultValue={defaultValue ?? ''}
        className={cn(
          controlBase,
          'h-11 cursor-pointer appearance-none pr-10',
          // The empty option acts as the placeholder; grey it out until chosen.
          'valid:text-bright [&:has(option[value=""]:checked)]:text-steel',
          invalid ? 'border-danger focus:border-danger' : 'border-hairline',
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="text-steel pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2"
      />
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* Checkbox                                                                   */
/* -------------------------------------------------------------------------- */

export function Checkbox({
  className,
  invalid,
  ...props
}: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { invalid?: boolean }) {
  return (
    <CheckboxPrimitive.Root
      aria-invalid={invalid || undefined}
      className={cn(
        'peer mt-0.5 grid size-5 shrink-0 place-items-center rounded-xs border',
        'bg-graphite transition-colors duration-200',
        'hover:border-steel',
        'focus-visible:outline-arc-bright focus-visible:outline-2 focus-visible:outline-offset-2',
        'data-[state=checked]:border-arc-bright data-[state=checked]:bg-arc',
        invalid ? 'border-danger' : 'border-hairline-strong',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="text-white">
        <Check className="size-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

/* -------------------------------------------------------------------------- */
/* Field wrapper                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Wires a label, control, hint and error message together with the right ARIA
 * relationships. Every form on the site uses this so no control can ship
 * without an accessible name and an announced error.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: (props: {
    id: string;
    'aria-describedby'?: string;
    invalid: boolean;
  }) => React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>

      {children({ id, 'aria-describedby': describedBy, invalid: Boolean(error) })}

      {hint && !error ? (
        // Capped: a full-width field's hint was running to nearly 150 characters
        // a line, which is unreadable at 13px.
        <p id={hintId} className="text-steel measure text-[0.8125rem] leading-relaxed">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-danger flex items-start gap-1.5 text-[0.8125rem] leading-relaxed"
        >
          <AlertCircle aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Honeypot                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Hidden from users and assistive technology, visible to naive bots.
 * Positioned off-screen rather than `display:none`, which some bots detect.
 */
export const Honeypot = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Honeypot(props, ref) {
  return (
    <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden opacity-0">
      <label htmlFor="website-url">Leave this field empty</label>
      <input ref={ref} id="website-url" type="text" tabIndex={-1} autoComplete="off" {...props} />
    </div>
  );
});
