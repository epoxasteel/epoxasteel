'use client';

import type { Faq } from '@/content/types';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { slugify } from '@/lib/utils';

/**
 * Multiple items can be open at once — on a reference page, collapsing the
 * answer someone is reading because they opened a second one is unhelpful.
 */
export function FaqAccordion({ items }: { items: Faq[] }) {
  return (
    <Accordion type="multiple" className="border-hairline border-t">
      {items.map((faq) => (
        <AccordionItem key={faq.question} value={slugify(faq.question)}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
