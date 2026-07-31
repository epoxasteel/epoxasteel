import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Eyebrow } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Page not found',
  description: 'The page you are looking for does not exist or has been moved.',
  robots: { index: false, follow: true },
};

const suggestions = [
  { label: 'Products', href: '/products', hint: 'Sections, plate, tube and reinforcement' },
  { label: 'Services', href: '/services', hint: 'Supply, fabrication and logistics' },
  { label: 'Projects', href: '/projects', hint: 'Case studies and completed work' },
  { label: 'Request a Quote', href: '/quote', hint: 'Line-by-line quotation in 48 hours' },
];

export default function NotFound() {
  return (
    <div className="bg-void relative flex min-h-dvh items-center overflow-hidden pt-(--header-h)">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 50% at 50% 30%, rgba(28,98,174,0.16) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      {/* A structural frame with one member missing, the joke is load-bearing. */}
      <svg
        aria-hidden
        viewBox="0 0 1200 400"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full opacity-[0.14]"
        preserveAspectRatio="xMidYMax slice"
      >
        <g stroke="#a8b2be" strokeWidth="8" strokeLinecap="square">
          {[100, 340, 580, 820, 1060].map((x) => (
            <line key={x} x1={x} y1="400" x2={x} y2="80" />
          ))}
          <line x1="100" y1="240" x2="580" y2="240" />
          <line x1="820" y1="240" x2="1060" y2="240" />
          <line x1="100" y1="120" x2="1060" y2="120" />
        </g>
        <g stroke="#3a8ae0" strokeWidth="4" strokeDasharray="14 12">
          <line x1="580" y1="240" x2="820" y2="240" />
        </g>
      </svg>

      <div className="container-page relative py-24">
        <div className="max-w-2xl">
          <Reveal direction="none">
            <Eyebrow>Error 404</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="font-display text-display-lg text-bright mt-7 font-semibold">
              {/* See the hero: the space before the break keeps `textContent`
                  readable as words rather than one run-together string. */}
              This member is <br />
              <span className="text-metal">not in the frame.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-lead text-ash mt-7 max-w-lg">
              The page you asked for does not exist, or it has moved. Nothing structural has been
              lost, let us point you at what you were probably looking for.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/" size="lg" sheen>
                Back to home
                <ArrowRight aria-hidden />
              </Button>
              <Button href="/search" size="lg" variant="outline">
                <Search aria-hidden />
                Search the site
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <ul className="bg-hairline mt-14 grid gap-px overflow-hidden rounded-lg sm:grid-cols-2">
              {suggestions.map((suggestion) => (
                <li key={suggestion.href}>
                  <Link
                    href={suggestion.href}
                    className={cn(
                      'group bg-charcoal flex h-full items-center justify-between gap-4 p-5',
                      'hover:bg-slate transition-colors duration-400',
                    )}
                  >
                    <span>
                      <span className="text-chalk group-hover:text-bright block text-[0.9375rem] font-medium transition-colors">
                        {suggestion.label}
                      </span>
                      <span className="text-steel mt-0.5 block text-[0.8125rem]">
                        {suggestion.hint}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="text-steel size-4 shrink-0 transition-transform duration-400 group-hover:translate-x-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
