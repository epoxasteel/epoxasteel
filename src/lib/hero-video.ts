import { existsSync } from 'node:fs';
import path from 'node:path';
import type { HeroVideoSource } from '@/components/home/hero';

/**
 * Works out, at build time, which hero video sources actually exist.
 *
 * The hero is designed to ship without footage — the vector city scene is the
 * default, not a fallback. But rendering a `<video>` whose sources are missing
 * meant two 404s on every homepage load and two wasted connections. Checking the
 * filesystem here means the element only appears once there is something to
 * play.
 *
 * Server-only: this reads from disk and must never be imported into a client
 * component. Drop `hero.mp4` / `hero.webm` into `public/media/` (or set
 * NEXT_PUBLIC_HERO_VIDEO_URL) and the hero picks them up on the next build.
 */
export function resolveHeroVideo(): HeroVideoSource[] {
  const external = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
  if (external) {
    // Trust an explicitly configured URL; we cannot stat a remote file.
    const type = external.endsWith('.webm') ? 'video/webm' : 'video/mp4';
    return [{ src: external, type }];
  }

  const media = path.join(process.cwd(), 'public', 'media');

  // WebM first — browsers pick the first source they can play, and VP9 is
  // meaningfully smaller than H.264 at the same quality.
  const candidates: HeroVideoSource[] = [
    { src: '/media/hero.webm', type: 'video/webm' },
    { src: '/media/hero.mp4', type: 'video/mp4' },
  ];

  return candidates.filter((candidate) =>
    existsSync(path.join(media, path.basename(candidate.src))),
  );
}
