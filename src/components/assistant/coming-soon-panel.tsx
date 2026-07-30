'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Phone, X, FileText, Mail, Sparkle } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { useAssistant } from '@/components/assistant/assistant-context';

/**
 * What the dock opens while the assistant is dark.
 *
 * The temptation with a Coming Soon state is to hide the entrance until the thing
 * exists. That is the wrong trade here. Somebody who taps a floating button in the
 * corner of a steel supplier's website has a question they want answered now, and
 * the two things that will actually answer it — a quotation request and a person on
 * the phone — exist today. So the panel is honest about the assistant and useful
 * anyway: it says what is being built, and then hands over the routes that work.
 *
 * It is the same panel geometry, easing and surface treatment as the live desk, so
 * the transition when the flag flips is a change of contents rather than a change
 * of furniture.
 */
export function AssistantComingSoonPanel() {
  const { open, closeAssistant } = useAssistant();
  const reduce = useReducedMotion();

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

  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* On a phone the panel is a sheet and needs the page behind it to
              recede; on a desktop it sits alongside the content, so there is
              nothing to dim. */}
          <motion.button
            type="button"
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeAssistant}
            className="bg-void/70 fixed inset-0 z-45 backdrop-blur-sm sm:hidden"
          />

          <motion.div
            role="dialog"
            aria-label="Epoxa Steel AI Assistant"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
            className={cn(
              'fixed z-50 flex flex-col overflow-hidden',
              'border-hairline-strong bg-graphite shadow-raised border',
              'inset-x-0 bottom-0 rounded-t-xl',
              'sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[26.5rem] sm:rounded-xl',
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
            {/* A single soft arc bloom behind the mark. Static, not animated —
                a permanently moving glow in a fixed corner panel is the kind of
                thing that reads as expensive once and as restless thereafter. */}
            <div
              aria-hidden
              className="bg-arc/12 pointer-events-none absolute -top-20 -right-16 size-56 rounded-full blur-3xl"
            />

            <div className="border-hairline relative flex items-start justify-between gap-4 border-b px-5 py-4">
              <p className="text-eyebrow text-arc-glow flex items-center gap-2 uppercase">
                <span aria-hidden className="bg-arc-bright size-1.5 rounded-full" />
                Epoxa Steel AI
              </p>
              <button
                type="button"
                onClick={closeAssistant}
                aria-label="Close"
                className="text-steel hover:text-bright -my-1.5 -mr-1.5 grid size-11 shrink-0 place-items-center rounded-sm transition-colors duration-200 hover:bg-white/[0.05]"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            <div className="relative px-5 py-6">
              <motion.span
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5, ease: EASE_OUT_EXPO }}
                className="border-arc-bright/40 bg-charcoal text-arc-glow grid size-12 place-items-center rounded-full border"
              >
                <Sparkle aria-hidden className="size-5" />
              </motion.span>

              <h2 className="font-display text-title text-bright mt-5 font-semibold">
                Epoxa Steel AI Assistant
              </h2>

              <p className="text-ash mt-3 text-[0.9375rem] leading-relaxed">
                Our intelligent assistant is currently being prepared to provide instant answers
                regarding products, fabrication services, custom steel solutions, and project
                guidance.
              </p>

              <p className="text-eyebrow text-arc-glow border-arc-bright/30 bg-arc/8 mt-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 uppercase">
                <span aria-hidden className="bg-arc-bright size-1.5 rounded-full" />
                Coming soon
              </p>

              <div className="border-hairline mt-7 space-y-2.5 border-t pt-6">
                <Link
                  href="/quote"
                  prefetch={false}
                  onClick={closeAssistant}
                  className={cn(
                    'group border-arc-bright/45 bg-charcoal flex items-center gap-3 rounded-sm border px-4 py-3.5',
                    'text-chalk hover:text-bright hover:border-arc-bright text-[0.9375rem] font-medium',
                    'transition-colors duration-300',
                  )}
                >
                  <FileText aria-hidden className="text-arc-glow size-4 shrink-0" />
                  Request a Quote
                </Link>

                <Link
                  href="/contact"
                  prefetch={false}
                  onClick={closeAssistant}
                  className={cn(
                    'group border-hairline bg-charcoal/70 flex items-center gap-3 rounded-sm border px-4 py-3.5',
                    'text-mist hover:text-bright hover:border-hairline-strong text-[0.9375rem] font-medium',
                    'transition-colors duration-300',
                  )}
                >
                  <Mail aria-hidden className="text-steel size-4 shrink-0" />
                  Contact Us
                </Link>
              </div>

              {/* One tap to a person. The point of this panel is that nobody who
                  opened it leaves without a way to get an answer. */}
              <a
                href={`tel:${siteConfig.contact.phoneHref}`}
                className="text-steel hover:text-mist mt-5 inline-flex items-center gap-2 py-1.5 text-[0.8125rem] transition-colors"
              >
                <Phone aria-hidden className="size-3.5" />
                Or call {siteConfig.contact.phone}
              </a>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
