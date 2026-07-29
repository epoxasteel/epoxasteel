'use client';

import * as React from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ArrowUp, Sparkle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { useAssistant } from '@/components/assistant/assistant-context';

/**
 * The dock.
 *
 * This was a white circular "+" that expanded into WhatsApp, phone and
 * back-to-top. Three problems with that: a bare plus sign asks the visitor to
 * guess, a solid white disc was the brightest thing on a very dark page and
 * pulled the eye away from whatever they were reading, and it took two taps to
 * reach anything.
 *
 * Now it is one labelled action — the enquiry desk — with the phone, WhatsApp
 * and quote routes living inside the panel it opens. Back to top sits beside it
 * and only appears once there is enough page behind you to want it.
 *
 * It stays out of the way until the hero is behind you, and hides entirely while
 * the panel is open so it never sits on top of its own content.
 */

const SHOW_DOCK_AFTER = 700;
const SHOW_TOP_AFTER = 2400;

export function FloatingContact({ assistant }: { assistant: boolean }) {
  const { open, openAssistant } = useAssistant();
  const [past, setPast] = React.useState(false);
  const [deep, setDeep] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setPast(latest > SHOW_DOCK_AFTER);
    setDeep(latest > SHOW_TOP_AFTER);
  });

  // With no model configured the dock still earns its place as back-to-top, so
  // it appears at the depth where that is the only thing it would offer.
  const visible = (assistant ? past : deep) && !open;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.38, ease: EASE_OUT_EXPO }}
          className="fixed right-4 bottom-4 z-40 flex items-center gap-2 sm:right-6 sm:bottom-6"
        >
          <AnimatePresence>
            {deep ? (
              <motion.button
                key="top"
                type="button"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.26, ease: EASE_OUT_EXPO }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                className={cn(
                  'border-hairline-strong bg-graphite/90 text-mist grid size-11 place-items-center rounded-full border',
                  'shadow-lift backdrop-blur-md backdrop-saturate-150',
                  'hover:text-bright hover:border-steel transition-colors duration-300',
                )}
              >
                <ArrowUp aria-hidden className="size-4" />
              </motion.button>
            ) : null}
          </AnimatePresence>

          {assistant ? (
            <button
              type="button"
              onClick={() => openAssistant()}
              className={cn(
                'group border-arc-bright/45 bg-graphite/92 relative inline-flex h-11 items-center gap-2.5 overflow-hidden rounded-full border pr-5 pl-4',
                'text-chalk shadow-raised text-[0.875rem] font-medium backdrop-blur-xl backdrop-saturate-150',
                'transition-[border-color,color,transform] duration-400 [transition-timing-function:var(--ease-out-quint)]',
                'hover:border-arc-bright hover:text-bright hover:-translate-y-px',
              )}
            >
              {/* A slow arc wash rather than a colour change — reads as lit metal. */}
              <span
                aria-hidden
                className="from-arc/0 via-arc/25 to-arc/0 absolute inset-0 -translate-x-full bg-linear-to-r transition-transform duration-[1100ms] ease-out group-hover:translate-x-full"
              />
              <Sparkle aria-hidden className="text-arc-glow relative size-4" />
              <span className="relative">Ask EPOXA</span>
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
