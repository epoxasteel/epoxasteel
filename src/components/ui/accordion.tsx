'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn('group border-hairline border-b last:border-b-0', className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'flex flex-1 items-start justify-between gap-6 py-5 text-left',
          'font-display text-chalk text-[1.0625rem] leading-snug font-medium',
          'hover:text-bright transition-colors duration-300',
          'data-[state=open]:text-bright',
          className,
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden
          className={cn(
            'border-hairline mt-0.5 grid size-6 shrink-0 place-items-center rounded-xs border',
            'text-steel transition-all duration-400 [transition-timing-function:var(--ease-out-quint)]',
            'group-hover:border-hairline-strong group-hover:text-mist',
            'group-data-[state=open]:border-arc-bright/50 group-data-[state=open]:text-arc-bright group-data-[state=open]:rotate-45',
          )}
        >
          <Plus className="size-3.5" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        'overflow-hidden',
        // Radix exposes the measured height as a CSS variable; animating to it
        // gives a real height transition without measuring in JavaScript.
        'data-[state=closed]:animate-[accordion-up_320ms_var(--ease-out-quint)]',
        'data-[state=open]:animate-[accordion-down_320ms_var(--ease-out-quint)]',
      )}
      {...props}
    >
      <div className={cn('text-ash pr-10 pb-6 text-[0.9375rem] leading-relaxed', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}
