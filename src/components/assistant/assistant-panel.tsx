'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Phone, X, RotateCcw, FileText, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { whatsappHref } from '@/components/ui/misc';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { AssistantRichText } from '@/components/assistant/rich-text';
import { useAssistant } from '@/components/assistant/assistant-context';
import { Composer } from '@/components/assistant/composer';

/**
 * The enquiry desk.
 *
 * Built to read as part of the site rather than a widget bolted to the corner of
 * it: the same surfaces, hairlines, grain and arc accent as every other panel,
 * the same easing curve, and the wordmark's own typographic voice in the header.
 * There is no bubble avatar and no "Hi there! 👋".
 *
 * The transcript is kept in sessionStorage, so a visitor can carry a
 * conversation from the beams page to the fabrication page to the quote form
 * without losing it — and it is gone when the tab closes, which is the right
 * lifetime for something nobody was asked to consent to.
 */

const STORAGE_KEY = 'epoxa:assistant';
const MAX_TURNS = 24;

type Turn = { role: 'user' | 'assistant'; content: string };

const OPENERS = [
  'What sections do you hold in stock?',
  'Can you fabricate to our shop drawings?',
  'How do you handle mill certificates?',
  'What are your delivery lead times?',
];

function readTranscript(): Turn[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (turn): turn is Turn =>
          typeof turn === 'object' &&
          turn !== null &&
          'role' in turn &&
          'content' in turn &&
          (turn.role === 'user' || turn.role === 'assistant') &&
          typeof turn.content === 'string',
      )
      .slice(-MAX_TURNS);
  } catch {
    return [];
  }
}

function writeTranscript(turns: Turn[]) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(turns.slice(-MAX_TURNS)));
  } catch {
    /* Storage unavailable — the conversation simply does not survive navigation. */
  }
}

export function AssistantPanel() {
  const { open, closeAssistant, seed, seedKey } = useAssistant();
  const reduce = useReducedMotion();

  /* Read straight out of storage on mount rather than from an effect. The panel
     renders nothing until it is opened, so there is no hydration mismatch to
     worry about and no cascading render to pay for. */
  const [turns, setTurns] = React.useState<Turn[]>(() =>
    typeof window === 'undefined' ? [] : readTranscript(),
  );
  /** The reply as it streams in, before it becomes a turn. */
  const [streaming, setStreaming] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const abortRef = React.useRef<AbortController | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const busy = streaming !== null;

  React.useEffect(() => {
    writeTranscript(turns);
  }, [turns]);

  /* Follow the answer as it arrives, but never fight a visitor who has scrolled
     up to re-read something. */
  React.useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    const nearBottom = node.scrollHeight - node.scrollTop - node.clientHeight < 140;
    if (nearBottom) node.scrollTop = node.scrollHeight;
  }, [turns, streaming]);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeAssistant();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeAssistant]);

  /* Abandon an in-flight answer when the panel closes or the page unmounts —
     nobody is reading it, and it is costing tokens. */
  React.useEffect(() => {
    if (!open) abortRef.current?.abort();
  }, [open]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  const send = React.useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || busy) return;

      const next = [...turns, { role: 'user' as const, content: question }].slice(-MAX_TURNS);
      setTurns(next);
      setError(null);
      setStreaming('');

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch('/api/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: next }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const data = (await response.json().catch(() => null)) as { message?: string } | null;
          setStreaming(null);
          setError(
            data?.message ??
              'The assistant is unavailable right now. Please send a quote request or call the office.',
          );
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let answer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          setStreaming(answer);
        }

        setStreaming(null);
        if (answer.trim()) {
          setTurns((current) =>
            [...current, { role: 'assistant' as const, content: answer.trim() }].slice(-MAX_TURNS),
          );
        }
      } catch (caught) {
        setStreaming(null);
        if ((caught as Error)?.name === 'AbortError') return;
        setError('Connection lost. Please check your network and try again.');
      }
    },
    [busy, turns],
  );

  const stop = () => {
    abortRef.current?.abort();
    // Keep whatever arrived — a half answer is usually still useful.
    if (streaming?.trim()) {
      setTurns((current) =>
        [...current, { role: 'assistant' as const, content: streaming.trim() }].slice(-MAX_TURNS),
      );
    }
    setStreaming(null);
  };

  const reset = () => {
    abortRef.current?.abort();
    setStreaming(null);
    setError(null);
    setTurns([]);
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* On a phone the panel is a sheet and needs the page behind it to
              recede; on a desktop it sits alongside the content it is about, so
              there is nothing to dim. */}
          <motion.button
            type="button"
            aria-label="Close the enquiry desk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeAssistant}
            className="bg-void/70 fixed inset-0 z-45 backdrop-blur-sm sm:hidden"
          />

          <motion.div
            role="dialog"
            aria-label="EPOXA STEEL enquiry desk"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
            className={cn(
              'fixed z-50 flex flex-col overflow-hidden',
              'border-hairline-strong bg-graphite shadow-raised border',
              'inset-x-0 bottom-0 max-h-[86dvh] rounded-t-xl',
              'sm:inset-auto sm:right-6 sm:bottom-6 sm:max-h-[min(38rem,calc(100dvh-4rem))] sm:w-[26.5rem] sm:rounded-xl',
            )}
          >
            <div
              className="bg-grid-fine pointer-events-none absolute inset-0 opacity-30"
              aria-hidden
            />
            <span
              aria-hidden
              className="via-arc-bright/50 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent"
            />

            {/* Header */}
            <div className="border-hairline relative flex items-start justify-between gap-4 border-b px-5 py-4">
              <div>
                <p className="text-eyebrow text-arc-glow flex items-center gap-2 uppercase">
                  <span aria-hidden className="bg-arc-bright size-1.5 rounded-full" />
                  Enquiry desk
                </p>
                <p className="font-display text-bright mt-2 text-[1.0625rem] leading-tight font-semibold">
                  Ask us about steel
                </p>
                <p className="text-steel mt-1 text-[0.75rem] leading-relaxed">
                  Answers from our product data. Pricing comes from the desk.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {turns.length ? (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Start a new conversation"
                    className="text-steel hover:text-bright grid size-9 place-items-center rounded-sm transition-colors duration-200 hover:bg-white/[0.05]"
                  >
                    <RotateCcw aria-hidden className="size-4" />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={closeAssistant}
                  aria-label="Close the enquiry desk"
                  className="text-steel hover:text-bright grid size-9 place-items-center rounded-sm transition-colors duration-200 hover:bg-white/[0.05]"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>
            </div>

            {/* Transcript */}
            <div
              ref={scrollRef}
              className="relative flex-1 overflow-y-auto overscroll-contain px-5 py-5"
            >
              {turns.length === 0 && !streaming ? (
                <div>
                  <p className="text-ash text-[0.9375rem] leading-relaxed">
                    Tell us what you are building and we will point you at the right sections,
                    grades and processing. If it turns into a real enquiry, we will get it to the
                    desk.
                  </p>

                  <p className="text-eyebrow text-steel mt-7 mb-3 uppercase">Common questions</p>
                  <ul className="space-y-2">
                    {OPENERS.map((opener) => (
                      <li key={opener}>
                        <button
                          type="button"
                          onClick={() => void send(opener)}
                          className={cn(
                            'group border-hairline bg-charcoal/70 w-full rounded-sm border px-3.5 py-2.5 text-left',
                            'text-mist hover:text-bright hover:border-hairline-strong hover:bg-charcoal text-[0.875rem]',
                            'transition-colors duration-250',
                          )}
                        >
                          {opener}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="space-y-5" aria-live="polite" aria-atomic="false">
                {turns.map((turn, index) =>
                  turn.role === 'user' ? (
                    <div key={index} className="flex justify-end">
                      <p className="bg-charcoal border-hairline text-chalk max-w-[86%] rounded-lg rounded-br-xs border px-3.5 py-2.5 text-[0.9375rem] leading-relaxed">
                        {turn.content}
                      </p>
                    </div>
                  ) : (
                    <div key={index} className="border-arc/40 border-l-2 pl-4">
                      <AssistantRichText text={turn.content} />
                    </div>
                  ),
                )}

                {streaming !== null ? (
                  <div className="border-arc/40 border-l-2 pl-4">
                    {streaming ? (
                      <AssistantRichText text={streaming} />
                    ) : (
                      <span className="text-steel inline-flex items-center gap-1.5 text-[0.875rem]">
                        <span
                          aria-hidden
                          className="bg-arc-bright size-1.5 animate-pulse rounded-full"
                        />
                        Thinking
                      </span>
                    )}
                  </div>
                ) : null}
              </div>

              {error ? (
                <p
                  role="alert"
                  className="border-danger/40 bg-danger/[0.07] text-mist mt-5 rounded-sm border px-3.5 py-3 text-[0.875rem] leading-relaxed"
                >
                  {error}
                </p>
              ) : null}
            </div>

            {/* Composer */}
            <div className="border-hairline relative border-t px-4 pt-3 pb-4">
              {/* Keyed on the seed so "Ask about this product" replaces the box
                  contents by remounting it, rather than by pushing context state
                  into local state from an effect. */}
              <Composer
                key={seedKey}
                initialValue={seed}
                busy={busy}
                onSend={(text) => void send(text)}
                onStop={stop}
              />

              {/* Always one click from a human. The assistant is deliberately not
                  the only route — a visitor who wants a person should never have
                  to negotiate with software to reach one. */}
              <div className="text-steel mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.75rem]">
                <Link
                  href="/quote"
                  prefetch={false}
                  onClick={closeAssistant}
                  className="hover:text-mist inline-flex items-center gap-1.5 transition-colors"
                >
                  <FileText aria-hidden className="size-3.5" />
                  Request a quote
                </Link>
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  className="hover:text-mist inline-flex items-center gap-1.5 transition-colors"
                >
                  <Phone aria-hidden className="size-3.5" />
                  {siteConfig.contact.phone}
                </a>
                <a
                  href={whatsappHref()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-mist inline-flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle aria-hidden className="size-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
