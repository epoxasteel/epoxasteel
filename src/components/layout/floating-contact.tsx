'use client';

import * as React from 'react';
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { MessageCircle, Phone, ArrowUp, X, Plus } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { whatsappHref } from '@/components/ui/misc';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * A small floating cluster: WhatsApp, phone and back-to-top.
 *
 * It stays collapsed to a single button until the user asks for it, and only
 * appears once the page has scrolled past the hero — so it never competes with
 * the opening impression or covers content on a short page.
 */
export function FloatingContact() {
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > 700;
    setVisible(next);
    if (!next) setExpanded(false);
  });

  const actions = [
    {
      label: 'WhatsApp',
      href: whatsappHref(),
      icon: MessageCircle,
      external: true,
      tone: 'bg-success/12 border-success/35 text-success hover:bg-success/20',
    },
    {
      label: `Call ${siteConfig.contact.phone}`,
      href: `tel:${siteConfig.contact.phoneHref}`,
      icon: Phone,
      external: false,
      tone: 'bg-arc/12 border-arc/35 text-arc-glow hover:bg-arc/20',
    },
  ];

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-2.5 sm:right-6 sm:bottom-6"
        >
          <AnimatePresence>
            {expanded
              ? actions.map((action, index) => (
                  <motion.a
                    key={action.label}
                    href={action.href}
                    {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.9 }}
                    transition={{
                      duration: 0.28,
                      delay: index * 0.05,
                      ease: EASE_OUT_EXPO,
                    }}
                    aria-label={action.label}
                    className={cn(
                      'grid size-12 place-items-center rounded-full border backdrop-blur-md',
                      'shadow-lift transition-colors duration-300',
                      action.tone,
                    )}
                  >
                    <action.icon aria-hidden className="size-5" />
                  </motion.a>
                ))
              : null}
          </AnimatePresence>

          <AnimatePresence>
            {expanded ? (
              <motion.button
                key="top"
                type="button"
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.9 }}
                transition={{ duration: 0.28, delay: 0.1, ease: EASE_OUT_EXPO }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to top"
                className={cn(
                  'border-hairline-strong grid size-12 place-items-center rounded-full border',
                  'bg-charcoal/90 text-mist shadow-lift backdrop-blur-md',
                  'hover:text-bright transition-colors duration-300',
                )}
              >
                <ArrowUp aria-hidden className="size-5" />
              </motion.button>
            ) : null}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Close quick contact menu' : 'Open quick contact menu'}
            className={cn(
              'border-hairline-strong grid size-13 place-items-center rounded-full border',
              'bg-bright text-void shadow-raised transition-all duration-400',
              '[transition-timing-function:var(--ease-out-quint)] hover:scale-105',
            )}
          >
            <motion.span animate={{ rotate: expanded ? 135 : 0 }} transition={{ duration: 0.35 }}>
              {expanded ? (
                <X aria-hidden className="size-5" />
              ) : (
                <Plus aria-hidden className="size-5" />
              )}
            </motion.span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
