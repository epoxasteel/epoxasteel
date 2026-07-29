/**
 * The plate the hero's overture opens from.
 *
 * The hero headline is the page's largest contentful paint, and it used to ship
 * at `opacity: 0` — the settled hero was hidden in the HTML and only faded up
 * once Framer Motion had hydrated and the intro had finished. That put LCP four
 * seconds behind first paint for a reason the visitor never saw.
 *
 * So the headline now ships visible, and the opening blackout is a separate,
 * genuinely opaque plate laid over the top of it. The browser counts the
 * headline as painted the moment the HTML lands; the visitor still sees black
 * resolving into type.
 *
 * Whether the plate is shown at all depends on sessionStorage and the motion
 * preference — neither of which the server can read. Hence this: a few hundred
 * bytes inline in the document head, setting the attribute the plate's CSS is
 * gated on before the body paints. React's `Overture` then takes over the same
 * plate at hydration and drops the attribute when the sequence ends.
 *
 * No script, no attribute, no plate — the hero simply reads as settled, which
 * is the correct fallback.
 */

/** Shared with `hero.tsx`, which writes the flag when the sequence completes. */
export const OVERTURE_KEY = 'epoxa:overture-played';

const BOOTSTRAP = `(function(){try{
if(sessionStorage.getItem('${OVERTURE_KEY}')==='1')return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
document.documentElement.setAttribute('data-overture','');
}catch(e){}})();`;

export function OvertureScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />;
}
