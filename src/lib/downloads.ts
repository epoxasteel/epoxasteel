import { statSync } from 'node:fs';
import path from 'node:path';

/**
 * The real size of a downloadable file, measured at build time.
 *
 * The content modules carry a `size` hint that was written by hand — "4.2 MB"
 * for a sheet that is actually five kilobytes. It is a small dishonesty and an
 * unnecessary one: the file is on disk when the page is rendered, so we can just
 * look.
 *
 * Server-only. Returns null for anything it cannot stat — an external URL, or a
 * document that has not been committed yet — and the caller falls back to the
 * declared hint.
 */
export function fileSizeLabel(href: string): string | null {
  if (!href.startsWith('/')) return null;

  try {
    const bytes = statSync(path.join(process.cwd(), 'public', href.replace(/^\/+/, ''))).size;

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } catch {
    return null;
  }
}
