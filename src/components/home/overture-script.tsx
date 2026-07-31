/**
 * The plate the hero opens from.
 *
 * The hero headline is the page's largest contentful paint, and it ships
 * visible: the opening is a genuinely opaque plate laid over the top of it, not
 * content held at `opacity: 0`. The browser counts the headline as painted the
 * moment the HTML lands; the visitor still sees the hero resolve out of black.
 *
 * Whether the plate is shown at all depends on sessionStorage and the motion
 * preference — neither of which the server can read. Hence this: a few hundred
 * bytes inline in the document head, setting the attribute the plate's CSS is
 * gated on before the body paints. The animation itself is CSS (see
 * `globals.css`), so nothing has to run afterwards to clear it.
 *
 * No script, no attribute, no plate — the hero simply reads as settled, which
 * is the correct fallback.
 */

/** Marks the opening as seen, so it plays once a session rather than on every
 *  navigation back to the home page. */
export const OVERTURE_KEY = 'epoxa:overture-played';

const BOOTSTRAP = `(function(){try{
if(sessionStorage.getItem('${OVERTURE_KEY}')==='1')return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
document.documentElement.setAttribute('data-overture','');
sessionStorage.setItem('${OVERTURE_KEY}','1');
}catch(e){}})();`;

export function OvertureScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />;
}
