'use client';

import * as React from 'react';
import { ArrowUp, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The message box.
 *
 * Its own component so that a seeded question can replace its contents by
 * remounting it — the panel passes `key={seedKey}` — rather than by an effect
 * that pushes context state into local state on every render. One owner for the
 * text, no synchronisation.
 *
 * It grows with the content up to a ceiling, sends on Enter, and takes focus when
 * it appears so a visitor who opened the panel can just start typing.
 */
export function Composer({
  initialValue,
  busy,
  onSend,
  onStop,
}: {
  initialValue: string;
  busy: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}) {
  const [value, setValue] = React.useState(initialValue);
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    // A seeded question arrives with the caret at the end, ready to continue.
    const length = node.value.length;
    node.setSelectionRange(length, length);
    node.style.height = 'auto';
    node.style.height = `${Math.min(node.scrollHeight, 132)}px`;
    const timer = window.setTimeout(() => node.focus(), 220);
    return () => window.clearTimeout(timer);
  }, []);

  function submit() {
    if (busy) return;
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue('');
    const node = ref.current;
    if (node) node.style.height = 'auto';
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cn(
        'border-hairline bg-charcoal flex items-end gap-2 rounded-lg border p-2',
        'focus-within:border-arc-bright focus-within:shadow-[0_0_0_3px_rgba(58,138,224,0.14)]',
        'transition-[border-color,box-shadow] duration-200',
      )}
    >
      <label htmlFor="assistant-input" className="sr-only">
        Your question
      </label>
      <textarea
        id="assistant-input"
        ref={ref}
        rows={1}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          const node = event.target;
          node.style.height = 'auto';
          node.style.height = `${Math.min(node.scrollHeight, 132)}px`;
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            submit();
          }
        }}
        placeholder="Ask about sections, grades, fabrication…"
        maxLength={2000}
        className="text-bright placeholder:text-steel max-h-33 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-[0.9375rem] leading-relaxed outline-none"
      />

      {busy ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop generating"
          className="border-hairline-strong text-mist hover:text-bright hover:border-steel grid size-9 shrink-0 place-items-center rounded-sm border transition-colors duration-200"
        >
          <Square aria-hidden className="size-3" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Send"
          className={cn(
            'bg-bright text-void grid size-9 shrink-0 place-items-center rounded-sm',
            'transition-[background-color,opacity] duration-200 hover:bg-white',
            'disabled:pointer-events-none disabled:opacity-35',
          )}
        >
          <ArrowUp aria-hidden className="size-4" />
        </button>
      )}
    </form>
  );
}
