import * as React from 'react';
import Link from 'next/link';

/**
 * Renders the assistant's replies.
 *
 * The model is told to write plain text — no markdown headings, tables or link
 * syntax — so this deliberately is not a markdown parser. It handles exactly
 * three things, because those are the three the brief asks for:
 *
 *   - paragraphs and "-" bullet lists
 *   - **bold**
 *   - bare site paths like /products/steel-beams, which become real links
 *
 * Everything else is rendered as text. That is the point: a narrow renderer over
 * model output cannot be talked into emitting markup, so there is no path from a
 * reply to injected HTML. Nothing here ever sees `dangerouslySetInnerHTML`.
 */

/** Only paths that exist as routes — a made-up path renders as plain text. */
const ROUTE_PREFIXES = [
  'products',
  'industries',
  'services',
  'projects',
  'blog',
  'careers',
  'about',
  'contact',
  'quote',
  'faq',
  'search',
  'privacy',
  'terms',
];

const PATH = new RegExp(
  `(?:^|(?<=[\\s(“"']))/(?:${ROUTE_PREFIXES.join('|')})(?:/[a-z0-9-]+)*`,
  'g',
);

function withLinks(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(PATH)) {
    const start = match.index ?? 0;
    // Trailing punctuation belongs to the sentence, not the path.
    const href = match[0].replace(/[.,;:!?)]+$/, '');

    if (start > last) nodes.push(text.slice(last, start));
    nodes.push(
      <Link
        key={`${keyPrefix}-link-${start}`}
        href={href}
        prefetch={false}
        className="text-arc-glow hover:text-arc-bright decoration-arc-glow/40 hover:decoration-arc-glow underline underline-offset-2 transition-colors"
      >
        {href}
      </Link>,
    );
    last = start + href.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function withBold(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*/g;
  let last = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(...withLinks(text.slice(last, start), `${keyPrefix}-${start}a`));
    nodes.push(
      <strong key={`${keyPrefix}-b-${start}`} className="text-bright font-semibold">
        {withLinks(match[1], `${keyPrefix}-${start}b`)}
      </strong>,
    );
    last = start + match[0].length;
  }

  if (last < text.length) nodes.push(...withLinks(text.slice(last), `${keyPrefix}-${last}c`));
  return nodes;
}

export function AssistantRichText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.split('\n');

  let paragraph: string[] = [];
  let bullets: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const key = `p-${blocks.length}`;
    blocks.push(
      <p key={key} className="text-mist text-[0.9375rem] leading-relaxed">
        {withBold(paragraph.join(' '), key)}
      </p>,
    );
    paragraph = [];
  };

  const flushBullets = () => {
    if (!bullets.length) return;
    const key = `ul-${blocks.length}`;
    blocks.push(
      <ul key={key} className="space-y-1.5">
        {bullets.map((item, index) => (
          <li key={index} className="text-mist flex gap-2.5 text-[0.9375rem] leading-relaxed">
            <span
              aria-hidden
              className="bg-arc-bright/70 mt-[0.6em] size-1 shrink-0 rounded-full"
            />
            <span>{withBold(item, `${key}-${index}`)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) {
      flushParagraph();
      flushBullets();
      continue;
    }

    const bullet = /^\s*[-•*]\s+(.*)$/.exec(line);
    if (bullet) {
      flushParagraph();
      bullets.push(bullet[1]);
      continue;
    }

    flushBullets();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushBullets();

  return <div className="space-y-3">{blocks}</div>;
}
