'use client';

import * as React from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { mainNav, legalNav, siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Wordmark } from '@/components/visual/wordmark';
import { Button } from '@/components/ui/button';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * Full-height navigation drawer for tablet and phone.
 *
 * Radix Dialog supplies the focus trap, scroll lock, Escape handling and inert
 * background; the animation and layout are ours. Sections expand in place
 * rather than pushing the user through a second screen, which keeps the whole
 * navigation reachable with one thumb.
 */
export function MobileNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const reduce = useReducedMotion();

  /**
   * Close the drawer when the user follows a link.
   *
   * Delegated from the nav container rather than driven by a `pathname` effect:
   * it fires on the click itself (so the drawer closes immediately rather than
   * after the route resolves), it covers every link without wiring a handler to
   * each one, and it also closes on same-page anchors — which a pathname watcher
   * would miss entirely.
   */
  function onNavClick(event: React.MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a')) setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className={cn(
            'border-hairline grid size-10 place-items-center rounded-sm border',
            'text-chalk bg-white/[0.02] transition-colors duration-300',
            'hover:border-hairline-strong hover:text-bright xl:hidden',
          )}
        >
          <Menu aria-hidden className="size-4.5" />
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-void/80 fixed inset-0 z-90 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild forceMount>
              <motion.div
                initial={reduce ? { opacity: 0 } : { x: '100%' }}
                animate={reduce ? { opacity: 1 } : { x: 0 }}
                exit={reduce ? { opacity: 0 } : { x: '100%' }}
                transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                className={cn(
                  'fixed inset-y-0 right-0 z-95 flex w-full max-w-md flex-col',
                  'border-hairline bg-graphite border-l',
                )}
              >
                <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Browse products, industries, services and company pages.
                </Dialog.Description>

                <div className="border-hairline flex h-16 shrink-0 items-center justify-between border-b px-5">
                  <Wordmark size="sm" />
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close navigation menu"
                      className="text-mist hover:text-bright grid size-10 place-items-center rounded-sm transition-colors"
                    >
                      <X aria-hidden className="size-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav
                  onClick={onNavClick}
                  className="flex-1 overflow-y-auto overscroll-contain px-5 py-6"
                >
                  <ul className="space-y-1">
                    {mainNav.map((item) => {
                      const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                      const isExpanded = expanded === item.label;

                      return (
                        <li key={item.href} className="border-hairline/60 border-b last:border-b-0">
                          <div className="flex items-center">
                            <Link
                              href={item.href}
                              className={cn(
                                'font-display flex-1 py-4 text-lg font-medium transition-colors',
                                active ? 'text-bright' : 'text-chalk hover:text-bright',
                              )}
                            >
                              {item.label}
                            </Link>

                            {item.columns ? (
                              <button
                                type="button"
                                onClick={() => setExpanded(isExpanded ? null : item.label)}
                                aria-expanded={isExpanded}
                                aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label}`}
                                className={cn(
                                  'text-steel grid size-10 place-items-center rounded-sm',
                                  'hover:text-bright transition-colors',
                                )}
                              >
                                <ChevronDown
                                  aria-hidden
                                  className={cn(
                                    'size-4 transition-transform duration-300',
                                    isExpanded && 'rotate-180',
                                  )}
                                />
                              </button>
                            ) : null}
                          </div>

                          <AnimatePresence initial={false}>
                            {item.columns && isExpanded ? (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.34, ease: EASE_OUT_EXPO }}
                                className="overflow-hidden"
                              >
                                <div className="space-y-5 pb-5">
                                  {item.columns.map((column) => (
                                    <div key={column.title}>
                                      <p className="text-eyebrow text-steel mb-2 uppercase">
                                        {column.title}
                                      </p>
                                      <ul className="space-y-0.5">
                                        {column.items.map((link) => (
                                          <li key={link.href}>
                                            <Link
                                              href={link.href}
                                              className={cn(
                                                'block rounded-sm py-2 pl-3 text-[0.9375rem]',
                                                'border-hairline border-l transition-colors',
                                                pathname === link.href
                                                  ? 'border-arc-bright text-bright'
                                                  : 'text-mist hover:border-steel hover:text-bright',
                                              )}
                                            >
                                              {link.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-8 space-y-3">
                    <Button href="/quote" full size="lg" sheen>
                      Request a Quote
                    </Button>
                    <Button href="/contact" variant="outline" full size="lg">
                      Contact us
                    </Button>
                  </div>

                  <div className="border-hairline mt-8 space-y-3 border-t pt-6 text-sm">
                    <a
                      href={`tel:${siteConfig.contact.phoneHref}`}
                      className="text-mist hover:text-bright flex items-center gap-3 transition-colors"
                    >
                      <Phone aria-hidden className="text-steel size-4" />
                      {siteConfig.contact.phone}
                    </a>
                    <a
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-mist hover:text-bright flex items-center gap-3 transition-colors"
                    >
                      <Mail aria-hidden className="text-steel size-4" />
                      {siteConfig.contact.email}
                    </a>
                  </div>

                  <ul className="text-steel mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem]">
                    {legalNav.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="hover:text-mist transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
