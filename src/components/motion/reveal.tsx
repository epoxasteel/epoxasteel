import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * The site's scroll-reveal primitives.
 *
 * Everything that appears on scroll goes through these components so timing,
 * distance and easing are identical everywhere — the difference between a site
 * that feels designed and one that feels assembled.
 *
 * ## Why there is no JavaScript here
 *
 * These were originally Framer Motion components. They are used 220+ times
 * across the site, and every instance built a VisualElement, allocated motion
 * values and registered its own IntersectionObserver — on the homepage alone
 * that was around 200 observers and the single largest block of hydration work
 * on the main thread. The animation itself is a fade and a 26px translate;
 * paying a full animation runtime for it was indefensible.
 *
 * So the whole family is now markup plus CSS. Each element carries a
 * `data-reveal` attribute; the transition lives in `globals.css` and runs on the
 * compositor; a single shared IntersectionObserver — bootstrapped inline in the
 * document head, see `RevealEngineScript` below — flips `data-shown` when the
 * element arrives. No hooks, no effects, no client bundle.
 *
 * A pleasant side effect of having no hooks: these components compile into
 * either React graph, so a client component can still import them.
 *
 * `prefers-reduced-motion` is honoured in CSS rather than JavaScript, which
 * means it also responds if the user changes the setting mid-visit.
 */

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

/**
 * `duration`, `once` and `amount` are accepted for call-site compatibility.
 * Duration is applied; the other two describe the only behaviour the engine
 * implements — reveal once, as the element's leading edge enters — so they are
 * inert.
 */
type RevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'span';
  amount?: number;
};

/** Non-zero delays and durations only — every byte here ships 220 times over. */
function timing(delay: number, duration: number): React.CSSProperties | undefined {
  const style: Record<string, string> = {};
  if (delay) style['--reveal-delay'] = `${delay}s`;
  if (duration !== 0.75) style['--reveal-duration'] = `${duration}s`;
  return Object.keys(style).length ? (style as React.CSSProperties) : undefined;
}

export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.75,
  as: Component = 'div',
}: RevealProps) {
  return (
    <Component
      className={className}
      data-reveal={direction}
      style={timing(delay, duration)}
      // The engine adds `data-shown` before React hydrates, which React would
      // otherwise report as an unexpected server attribute.
      suppressHydrationWarning
    >
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/* Staggered group                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Wrap a list so its children reveal in sequence. Children must be
 * `RevealItem`.
 *
 * The per-child delay is applied by the engine when the group arrives rather
 * than at render time, because a group cannot see the index of children handed
 * to it as opaque nodes. It is one loop, once, per group.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as: Component = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  as?: 'div' | 'ul' | 'ol' | 'section';
  amount?: number;
}) {
  return (
    <Component
      className={className}
      data-reveal-group=""
      style={
        stagger !== 0.08
          ? ({ '--reveal-stagger': `${stagger}s` } as React.CSSProperties)
          : undefined
      }
      suppressHydrationWarning
    >
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as: Component = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  return (
    <Component className={className} data-reveal="up" data-reveal-item="" suppressHydrationWarning>
      {children}
    </Component>
  );
}

/* -------------------------------------------------------------------------- */
/* Masked line reveal                                                         */
/* -------------------------------------------------------------------------- */

/**
 * A line of text that rises from behind a mask. Reserved for headline-level
 * type — used on body copy it reads as fussy rather than considered.
 *
 * The scroll trigger deliberately lives on the outer wrapper rather than on the
 * lines themselves. Each line starts translated fully below its own
 * `overflow-hidden` parent, so its visible area is exactly zero — an
 * IntersectionObserver attached to it would report a ratio of 0 forever and the
 * reveal would never fire.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={cn('block', className)} data-reveal-lines="" suppressHydrationWarning>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden pb-[0.08em]">
          <span
            className={cn('block', lineClassName)}
            data-reveal-line=""
            style={{ '--reveal-delay': `${delay + index * stagger}s` } as React.CSSProperties}
          >
            {line}
            {/*
              A trailing space on every line but the last.

              These are block elements, so it renders as nothing, but without it
              `textContent` concatenates the lines into one word: the homepage's
              second heading read "Steel is a commodityuntil it is late." That is
              what a crawler indexes and what a copy-paste produces, on every
              heading this component renders.
            */}
            {index < lines.length - 1 ? ' ' : null}
          </span>
        </span>
      ))}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Engine                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The observer that drives every reveal on the site, injected inline into the
 * document head.
 *
 * Inline and in the head for two reasons. It sets `data-reveal-engine` on the
 * root element, and the hidden-until-revealed styles are scoped to that
 * attribute — so if this script never runs, or the browser has no
 * IntersectionObserver, or JavaScript is off entirely, nothing is ever hidden
 * and the page reads normally. It has to run before the body paints for that
 * guarantee to hold without a flash of visible-then-hidden content, and being a
 * few hundred bytes it is cheaper inline than as a request.
 *
 * It scans once when the document is parsed, then watches for added nodes to
 * cover client-side navigation. The mutation observer is attached only after
 * the initial parse so it does not fire for every node of the first page.
 */
const REVEAL_ENGINE = `(function(){
if(!('IntersectionObserver' in window))return;
var d=document;
d.documentElement.setAttribute('data-reveal-engine','');
var SEL='[data-reveal]:not([data-reveal-item]),[data-reveal-group],[data-reveal-lines]';
var seen=new WeakSet(),owner=new WeakMap();
function show(g){
 if(g.hasAttribute('data-shown'))return;
 if(g.hasAttribute('data-reveal-group')){
  var k=g.querySelectorAll('[data-reveal-item]'),
      s=parseFloat(getComputedStyle(g).getPropertyValue('--reveal-stagger'))||0.08;
  for(var j=0;j<k.length;j++){
   k[j].style.setProperty('--reveal-delay',(0.05+j*s).toFixed(3)+'s');
   k[j].setAttribute('data-shown','');
  }
 }
 g.setAttribute('data-shown','');
}
/* Triggered on the leading edge rather than on a visible fraction. A ratio
   threshold cannot work here: a block taller than about five viewports never
   reaches one, and those are exactly the tall stacked sections that would then
   stay invisible forever. Pulling the root's bottom edge up 10% instead means
   an element reveals just after it starts to appear, whatever its height. */
var io=new IntersectionObserver(function(es){
 for(var i=0;i<es.length;i++){
  if(!es[i].isIntersecting)continue;
  var t=es[i].target;
  io.unobserve(t);
  show(owner.get(t)||t);
 }
},{rootMargin:'0px 0px -10% 0px'});
function watchEl(el){if(!seen.has(el)){seen.add(el);io.observe(el);}}
function scan(){
 var n=d.querySelectorAll(SEL);
 for(var i=0;i<n.length;i++){
  var el=n[i];
  /* A group laid out with \`display: contents\` — the usual way to let items
     participate in a parent grid, generates no box at all, so an observer
     watching it would wait forever. Watch its items instead and let whichever
     arrives first stand in for the group. */
  if(el.hasAttribute('data-reveal-group')){
   var r=el.getBoundingClientRect();
   if(!r.width&&!r.height){
    if(!seen.has(el)){
     seen.add(el);
     var k=el.querySelectorAll('[data-reveal-item]');
     for(var j=0;j<k.length;j++){owner.set(k[j],el);watchEl(k[j]);}
    }
    continue;
   }
  }
  watchEl(el);
 }
}
function watch(){
 scan();
 if(!('MutationObserver' in window))return;
 var queued=0;
 new MutationObserver(function(){
  if(queued)return;
  queued=requestAnimationFrame(function(){queued=0;scan();});
 }).observe(d.body,{childList:true,subtree:true});
}
if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',watch);else watch();
})();`;

export function RevealEngineScript() {
  return <script dangerouslySetInnerHTML={{ __html: REVEAL_ENGINE }} />;
}
