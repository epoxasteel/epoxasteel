/**
 * Renders the lifecycle artwork to standalone SVG files.
 *
 * The twelve scenes are a few hundred SVG elements each, and they were props on a
 * client component — which in the App Router means they are serialised into the
 * RSC payload inlined in the document. Measured: the homepage document was 675 KB
 * with a 381 KB payload, and 97% of that payload was vector artwork for a section
 * eight screens below the fold. Only three of the twelve are ever in the DOM at
 * once; all twelve were in the document on every single page load.
 *
 * As files they cost nothing until the section is near, the browser fetches only
 * the ones it shows, and they cache across pages and visits.
 *
 * The hero layers are deliberately *not* externalised. They are the first thing
 * painted, and an extra request before first paint is exactly the wrong trade
 * there — above the fold, inline is correct.
 *
 * Runs before `next build`. Output is git-ignored: it is derived from
 * `lifecycle-art.tsx`, which remains the only place the drawings are authored.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';

import { lifecycleScenes, SCENE_VIEWBOX } from '../src/components/home/lifecycle-art.tsx';

const OUT = path.join(process.cwd(), 'public', 'media', 'scenes');

await mkdir(OUT, { recursive: true });

let written = 0;
let bytes = 0;

for (const scene of lifecycleScenes) {
  /*
   * `xmlns` is required for a standalone file — inline in HTML the parser infers
   * it, but a file loaded through <img> is parsed as XML and will not render
   * without it. `preserveAspectRatio` moves onto the element here because the
   * <img> wrapper handles fitting with object-fit instead.
   */
  const body = renderToStaticMarkup(scene.art);
  const inner = body.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');

  const file = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SCENE_VIEWBOX}" role="presentation">`,
    inner,
    '</svg>',
  ].join('');

  await writeFile(path.join(OUT, `${scene.slug}.svg`), file, 'utf8');
  written += 1;
  bytes += file.length;
}

console.log(
  `scenes: wrote ${written} SVG${written === 1 ? '' : 's'} to public/media/scenes (${Math.round(bytes / 1024)} KB total)`,
);
