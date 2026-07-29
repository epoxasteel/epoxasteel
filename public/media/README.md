# Hero media

Drop the cinematic hero footage here and it is picked up automatically — no code change required.

| File | Purpose |
| --- | --- |
| `hero.mp4` | H.264/MP4, the primary source. Recommended 1920×1080, 8–14 s, silent, seamless loop. |
| `hero.webm` | VP9/WebM, served first to browsers that support it (smaller for the same quality). |
| `hero-poster.jpg` | First-frame still, shown while the video buffers. |

Until those files exist the hero renders the vector city scene in
`src/components/visual/city-scene.tsx`, which is the shipped default. The video
fades in over the scene only once the browser reports it can play, so a missing
or slow file never produces a blank hero.

## Encoding

```bash
# MP4 (H.264) — broad compatibility
ffmpeg -i source.mov -c:v libx264 -crf 23 -preset slow -an \
  -vf "scale=1920:-2" -movflags +faststart public/media/hero.mp4

# WebM (VP9) — smaller, served first where supported
ffmpeg -i source.mov -c:v libvpx-vp9 -crf 32 -b:v 0 -an \
  -vf "scale=1920:-2" public/media/hero.webm

# Poster frame
ffmpeg -i source.mov -vframes 1 -q:v 3 public/media/hero-poster.jpg
```

Keep the MP4 under about 6 MB. The hero never blocks rendering, but a large
file still competes for bandwidth with the fonts and the first screen of content.

Video files are git-ignored by default (see `.gitignore`) so the repository does
not accumulate large binaries. If you would rather commit them, remove the
`public/media/*.mp4` entries from `.gitignore` — or better, host them on a CDN
and point `NEXT_PUBLIC_HERO_VIDEO_URL` at the result.
