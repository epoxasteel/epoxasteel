'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { mainNav, siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Wordmark } from '@/components/visual/wordmark';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ScrollProgress } from '@/components/motion/parallax';

/**
 * The header sits over the hero as a transparent bar and condenses into a
 * solid, blurred surface once the page scrolls. Two states, one transition —
 * the point is that the navigation never competes with the hero.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
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
              aria-label={`${siteConfig.name}, home`}
            >
              <Wordmark size="md" />
            </Link>

            <DesktopNav pathname={pathname} />

            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/*
                Contact and Request a Quote, in that order.

                The search button lived here and is gone. Search is still on the
                site, ⌘K opens it and /search is indexed, but a magnifying
                glass was taking the most valuable space in the header from the
                second thing every visitor to a supplier's site wants, which is
                a way to reach a person.
              */}
              <Button href="/contact" size="sm" variant="outline" className="hidden sm:inline-flex">
                Contact
              </Button>

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
                <MegaPanel item={item} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>

      {/*
        The viewport is the animated container the panels render into.

        Opaque, not glass, and that is a decision, not an oversight. The panel
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
      {/*
        Pinned to the page container, not to the navigation.

        It used to be `left-1/2 -translate-x-1/2 max-w-6xl` measured from this
        `<nav>`, which sits between the wordmark and the buttons rather than in
        the middle of the header, so the panel hung off-centre and stopped short
        of both. `fixed` measures against the viewport instead, and
        `container-page` inside it reproduces the header's own content box, so
        the panel starts where the mark starts and ends where Request a Quote
        ends.
      */}
      <div className="fixed inset-x-0 top-(--header-h) flex justify-center pt-2">
        <div className="container-page flex justify-center">
          <NavigationMenu.Viewport
            className={cn(
              'relative h-(--radix-navigation-menu-viewport-height) w-full origin-top overflow-hidden',
              'border-hairline-strong bg-graphite shadow-raised rounded-2xl border',
              'transition-[width,height] duration-350 [transition-timing-function:var(--ease-out-quint)]',
              'data-[state=closed]:animate-[nav-scale-out_200ms_ease-in]',
              'data-[state=open]:animate-[nav-scale-in_260ms_var(--ease-out-quint)]',
            )}
          />
        </div>
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

function MegaPanel({ item }: { item: (typeof mainNav)[number] }) {
  const columns = item.columns ?? [];

  return (
    <div className="p-8">
      {/*
        One track now. The panel used to be `lg:grid-cols-[1fr_auto]` with a
        featured card in the second column, the card is gone, and leaving the
        track behind would have held a column of empty space open at every width.

        Five columns is the widest panel; three is the rest.
      */}
      <div
        className={cn(
          'grid gap-x-10 gap-y-8',
          columns.length >= 5
            ? 'sm:grid-cols-3 lg:grid-cols-5'
            : columns.length >= 3
              ? 'sm:grid-cols-3'
              : 'sm:grid-cols-2',
        )}
      >
        {columns.map((column) => (
          <div key={column.title}>
            <p className="text-eyebrow text-steel mb-4 uppercase">{column.title}</p>
            {/*
              Labels, not links.

              These were anchors into a product, service and industry catalogue
              describing capabilities the business cannot currently stand behind.
              A menu that lists what we can talk about is honest; one that
              promises a page per line and delivers invented detail is not. The
              panel is a contents page now, and the routes it used to point at
              are no longer reachable by clicking.
            */}
            <ul className="space-y-0.5">
              {column.items.map((link) => (
                <li key={link.href} className="text-mist -mx-2.5 px-2.5 py-2 text-[0.875rem]">
                  {link.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
