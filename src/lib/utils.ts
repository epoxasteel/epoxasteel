import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge has to be told about our custom scales.
 *
 * Without this it parses `text-display` as a *colour* (`text-{color}`), decides
 * it conflicts with `text-bright`, and silently drops the font size — so every
 * heading built through `cn()` renders at body size. Registering the custom
 * font sizes and text shadows as literals makes them win over the colour
 * validator. The same applies to the shadow and radius scales.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: ['display-xl', 'display-lg', 'display', 'headline', 'title', 'lead', 'eyebrow'],
        },
      ],
      'font-family': [{ font: ['sans', 'display', 'mono'] }],
      shadow: [{ shadow: ['lift', 'raised', 'arc'] }],
      rounded: [{ rounded: ['xs', 'sm', 'md', 'lg', 'xl'] }],
    },
  },
});

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "Structural Steel Beams" -> "structural-steel-beams" */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Format an ISO date as "14 March 2026" without pulling in a date library. */
export function formatDate(iso: string, locale = 'en-US') {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Short form used in compact cards: "14 Mar 2026". */
export function formatDateShort(iso: string, locale = 'en-US') {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Rough reading time for an article body. */
export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

/** Split an array into chunks — used for paginated listings. */
export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: current,
    totalPages,
    total: items.length,
    hasPrev: current > 1,
    hasNext: current < totalPages,
  };
}

/** Truncate on a word boundary, appending an ellipsis. */
export function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** Zero-pad a section index, e.g. 3 -> "03". */
export function pad(n: number, width = 2) {
  return String(n).padStart(width, '0');
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Human-readable byte size, e.g. 2411724 -> "2.3 MB". */
export function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
