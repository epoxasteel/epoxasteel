'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, Search, Phone, ArrowUpRight } from 'lucide-react';
import { mainNav, siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Wordmark } from '@/components/visual/wordmark';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useSearchDialog } from '@/components/search/search-provider';
import { ScrollProgress } from '@/components/motion/parallax';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * The header sits over the hero as a transparent bar and condenses into a
 * solid, blurred surface once the page scrolls. Two states, one transition —
 * the point is that the navigation never competes with the hero.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const { open: openSearch } = useSearchDialog();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
  });

  const isHome = pathname === '/';
  // Anywhere but the homepage there is no hero behind the bar, so it starts solid.
  const solid = scrolled || !isHome;

  return (
    <>
      <a
        href="#main"
        className={cn(
          'sr-only-focusable border-arc-bright fixed top-4 left-4 z-100 rounded-sm border',
          'bg-graphite text-bright px-4 py-2.5 text-sm font-medium',
        )}
      >
        Skip to main content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50',
          'transition-[background-color,border-color,backdrop-filter] duration-500',
          '[transition-timing-function:var(--ease-out-quint)]',
          /*
           * Real glass, not a tinted panel. Three things do the work:
           * a translucent surface light enough to read the page through,
           * a saturation boost so colour passing underneath stays alive rather
           * than turning to grey mush, and the hairline highlight below that
           * gives the pane a lit top edge.
           */
          solid
            ? 'border-hairline bg-void/70 border-b backdrop-blur-2xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        {/* The lit edge of the glass. */}
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-px',
            'bg-linear-to-r from-transparent via-white/12 to-transparent',
            'transition-opacity duration-500',
            solid ? 'opacity-100' : 'opacity-0',
          )}
        />
        {/* Utility bar — collapses away as soon as the page scrolls. */}
        <motion.div
          initial={false}
          animate={{ height: scrolled ? 0 : 'auto', opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
          className="border-hairline/60 hidden overflow-hidden border-b lg:block"
        >
          <div className="container-page text-steel flex h-9 items-center justify-between text-[0.75rem]">
            <p className="tracking-[0.14em] uppercase">
              Certified structural steel · Supply · Fabrication · Delivery
            </p>
            <div className="flex items-center gap-5">
              <a
                href={`tel:${siteConfig.contact.phoneHref}`}
                className="hover:text-chalk inline-flex items-center gap-1.5 transition-colors"
              >
                <Phone aria-hidden className="size-3" />
                {siteConfig.contact.phone}
              </a>
              <span className="bg-hairline h-3 w-px" aria-hidden />
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="hover:text-chalk transition-colors"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </motion.div>

        <div className="container-page">
          <div
            className={cn(
              'flex items-center justify-between gap-6 transition-[height] duration-500',
              scrolled ? 'h-16 lg:h-18' : 'h-16 lg:h-20',
            )}
          >
            <Link
              href="/"
              className="shrink-0 rounded-sm transition-opacity duration-300 hover:opacity-85"
              aria-label={`${siteConfig.name} — home`}
            >
              <Wordmark size="md" />
            </Link>

            <DesktopNav pathname={pathname} />

            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <button
                type="button"
                onClick={openSearch}
                aria-label="Search the site"
                className={cn(
                  'group border-hairline hidden h-10 items-center gap-2.5 rounded-sm border',
                  'text-steel bg-white/[0.02] px-3 text-[0.8125rem]',
                  'hover:border-hairline-strong hover:text-mist transition-colors duration-300',
                  'md:flex',
                )}
              >
                <Search aria-hidden className="size-3.5" />
                <span className="hidden lg:inline">Search</span>
                <kbd
                  className={cn(
                    'border-hairline bg-graphite ml-1 hidden rounded-xs border px-1.5',
                    'text-steel font-sans text-[0.6875rem] lg:inline',
                  )}
                >
                  ⌘K
                </kbd>
              </button>

              <button
                type="button"
                onClick={openSearch}
                aria-label="Search the site"
                className="text-mist hover:text-bright grid size-10 place-items-center rounded-sm transition-colors md:hidden"
              >
                <Search aria-hidden className="size-4.5" />
              </button>

              <Button href="/quote" size="sm" sheen className="hidden sm:inline-flex">
                Request a Quote
              </Button>

              <MobileNav pathname={pathname} />
            </div>
          </div>
        </div>

        {solid ? <ScrollProgress /> : null}
      </header>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop navigation                                                         */
/* -------------------------------------------------------------------------- */

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <NavigationMenu.Root
      delayDuration={90}
      skipDelayDuration={280}
      className="relative hidden xl:block"
    >
      <NavigationMenu.List className="flex items-center gap-0.5">
        {mainNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          if (!item.columns) {
            return (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link asChild>
                  <Link href={item.href} className={navLinkClass(active)}>
                    {item.label}
                    <NavUnderline active={active} />
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Trigger className={cn(navLinkClass(active), 'group/trigger')}>
                {item.label}
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'text-steel size-3.5 transition-transform duration-300',
                    'group-data-[state=open]/trigger:rotate-180',
                  )}
                />
                <NavUnderline active={active} />
              </NavigationMenu.Trigger>

              <NavigationMenu.Content
                className={cn(
                  'absolute top-0 left-0 w-full',
                  'data-[motion=from-start]:animate-[nav-in-left_320ms_var(--ease-out-quint)]',
                  'data-[motion=from-end]:animate-[nav-in-right_320ms_var(--ease-out-quint)]',
                  'data-[motion=to-start]:animate-[nav-out-left_240ms_var(--ease-out-quint)]',
                  'data-[motion=to-end]:animate-[nav-out-right_240ms_var(--ease-out-quint)]',
                )}
              >
                <MegaPanel item={item} pathname={pathname} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      {/*
        The viewport is the animated container the panels render into.

        Opaque, not glass — and that is a decision, not an oversight. The panel
        used to be `bg-graphite/85` with a `backdrop-blur`, which rendered as a
        dimmed sheet with the page's display headings legible straight through
        the menu items. The blur never applied: an element carrying a
        `backdrop-filter` establishes a backdrop root for everything inside it,
        and this panel lives inside the header, which is itself glass. Its
        backdrop was empty, so there was nothing to blur.

        Rather than fight that, the hierarchy is the honest one: the bar is
        glass and belongs to the page, the panel sits above the page and is
        solid. A menu has to be readable before it is atmospheric.
      */}
      <div className="absolute top-full left-1/2 flex w-screen max-w-6xl -translate-x-1/2 justify-center pt-3">
        <NavigationMenu.Viewport
          className={cn(
            'relative h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden',
            'border-hairline-strong bg-graphite shadow-raised rounded-lg border',
            'transition-[width,height] duration-350 [transition-timing-function:var(--ease-out-quint)]',
            'data-[state=closed]:animate-[nav-scale-out_200ms_ease-in]',
            'data-[state=open]:animate-[nav-scale-in_260ms_var(--ease-out-quint)]',
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
}

function navLinkClass(active: boolean) {
  return cn(
    'group relative inline-flex h-10 items-center gap-1.5 rounded-sm px-3.5',
    'text-[0.875rem] font-medium transition-colors duration-300',
    active ? 'text-bright' : 'text-mist hover:text-bright',
  );
}

function NavUnderline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'bg-arc-bright absolute inset-x-3.5 bottom-1.5 h-px origin-left',
        'transition-transform duration-400 [transition-timing-function:var(--ease-out-quint)]',
        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
      )}
    />
  );
}

function MegaPanel({ item, pathname }: { item: (typeof mainNav)[number]; pathname: string }) {
  const columns = item.columns ?? [];

  return (
    <div className="grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:gap-12">
      <div
        className={cn(
          'grid gap-x-10 gap-y-8',
          columns.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
        )}
      >
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-eyebrow text-steel mb-4 uppercase">{column.title}</p>
            <ul className="space-y-0.5">
              {column.items.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <NavigationMenu.Link asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          'group/link -mx-2.5 flex items-center justify-between gap-3 rounded-sm px-2.5 py-2',
                          'text-[0.875rem] transition-colors duration-250',
                          active
                            ? 'text-bright bg-white/[0.04]'
                            : 'text-mist hover:text-bright hover:bg-white/[0.03]',
                        )}
                      >
                        {link.label}
                        <ArrowUpRight
                          aria-hidden
                          className={cn(
                            'text-steel size-3.5 opacity-0 transition-all duration-250',
                            'group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:opacity-100',
                          )}
                        />
                      </Link>
                    </NavigationMenu.Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {item.featured ? (
        <NavigationMenu.Link asChild>
          <Link
            href={item.featured.href}
            className={cn(
              'group/feature relative flex w-full flex-col justify-between gap-6 overflow-hidden',
              'border-hairline bg-charcoal rounded-md border p-6 lg:w-72',
              'hover:border-arc/40 transition-colors duration-400',
            )}
          >
            <div
              aria-hidden
              className="bg-grid-fine pointer-events-none absolute inset-0 opacity-50"
            />
            <div
              aria-hidden
              className="bg-arc/10 pointer-events-none absolute -top-16 -right-16 size-48 rounded-full blur-3xl"
            />
            <div className="relative">
              <p className="text-eyebrow text-arc-glow uppercase">Featured</p>
              <p className="font-display text-bright mt-3 text-lg font-semibold">
                {item.featured.title}
              </p>
              <p className="text-ash mt-2 text-[0.8125rem] leading-relaxed">{item.featured.body}</p>
            </div>
            <span className="text-arc-glow relative inline-flex items-center gap-1.5 text-[0.8125rem] font-medium">
              {item.featured.cta}
              <ArrowUpRight
                aria-hidden
                className="size-3.5 transition-transform duration-300 group-hover/feature:translate-x-0.5 group-hover/feature:-translate-y-0.5"
              />
            </span>
          </Link>
        </NavigationMenu.Link>
      ) : (
        <div className="hidden lg:block lg:w-0" />
      )}
    </div>
  );
}
