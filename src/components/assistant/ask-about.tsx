'use client';

import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAssistant } from '@/components/assistant/assistant-context';

/**
 * Opens the enquiry desk with a question already framed.
 *
 * Placed where a buyer's questions actually occur — beside a product's
 * specification, not in a corner of the screen. The question lands in the
 * composer rather than being sent, so the visitor edits it, or replaces it, or
 * reads the suggestion and asks something else entirely. Sending on their behalf
 * would be presumptuous and would waste their first turn.
 */
export function AskAbout({
  seed,
  label = 'Ask about this product',
  className,
}: {
  seed: string;
  label?: string;
  className?: string;
}) {
  const { openAssistant } = useAssistant();

  return (
    <button
      type="button"
      onClick={() => openAssistant(seed)}
      className={cn(
        'group inline-flex items-center gap-2 text-[0.875rem] transition-colors duration-300',
        'text-ash hover:text-bright',
        className,
      )}
    >
      <MessageSquare
        aria-hidden
        className="text-arc-glow size-4 transition-transform duration-300 group-hover:-translate-y-px"
      />
      {label}
    </button>
  );
}
