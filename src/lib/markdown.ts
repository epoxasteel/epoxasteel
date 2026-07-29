/**
 * A deliberately tiny markdown parser for article bodies.
 *
 * It supports exactly what the content layer uses — headings, paragraphs,
 * unordered and ordered lists, blockquotes and inline bold — and produces a
 * typed block tree rather than an HTML string. Nothing is ever passed to
 * `dangerouslySetInnerHTML`, so a content author cannot introduce script into
 * a page even by accident.
 */

export type InlineToken =
  { type: 'text' | 'bold'; value: string } | { type: 'link'; value: string; href: string };

export type Block =
  | { type: 'heading'; level: 2 | 3; tokens: InlineToken[]; id: string }
  | { type: 'paragraph'; tokens: InlineToken[] }
  | { type: 'list'; ordered: boolean; items: InlineToken[][] }
  | { type: 'quote'; tokens: InlineToken[] }
  | { type: 'rule' };

/**
 * Split a line into plain, bold and link runs.
 *
 * Link targets are restricted to site-relative paths, `mailto:` and `https:`.
 * Anything else — `javascript:`, `data:`, a protocol-relative host — is
 * rendered as plain text rather than becoming a live link.
 */
function isSafeHref(href: string) {
  return /^(\/(?!\/)|https:\/\/|mailto:|tel:|#)/.test(href);
}

function parseInline(line: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  // Bold and links in one pass so their positions cannot overlap incorrectly.
  const pattern = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(line)) !== null) {
    if (match.index > cursor) {
      tokens.push({ type: 'text', value: line.slice(cursor, match.index) });
    }

    if (match[1] !== undefined) {
      tokens.push({ type: 'bold', value: match[1] });
    } else {
      const [, , label, href] = match;
      tokens.push(
        isSafeHref(href) ? { type: 'link', value: label, href } : { type: 'text', value: label },
      );
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < line.length) {
    tokens.push({ type: 'text', value: line.slice(cursor) });
  }

  return tokens.length > 0 ? tokens : [{ type: 'text', value: line }];
}

function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n/g, '\n').split('\n');

  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    // Blank line — nothing to emit.
    if (line.trim() === '') {
      index += 1;
      continue;
    }

    // Horizontal rule.
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'rule' });
      index += 1;
      continue;
    }

    // Headings (### before ## so the longer marker wins).
    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      blocks.push({ type: 'heading', level: 3, tokens: parseInline(h3[1]), id: headingId(h3[1]) });
      index += 1;
      continue;
    }

    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      blocks.push({ type: 'heading', level: 2, tokens: parseInline(h2[1]), id: headingId(h2[1]) });
      index += 1;
      continue;
    }

    // Blockquote — consecutive "> " lines join into one quote.
    if (line.startsWith('> ')) {
      const collected: string[] = [];
      while (index < lines.length && lines[index].startsWith('> ')) {
        collected.push(lines[index].slice(2).trim());
        index += 1;
      }
      blocks.push({ type: 'quote', tokens: parseInline(collected.join(' ')) });
      continue;
    }

    // Unordered list.
    if (/^[-*]\s+/.test(line)) {
      const items: InlineToken[][] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
        items.push(parseInline(lines[index].replace(/^[-*]\s+/, '')));
        index += 1;
      }
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }

    // Ordered list.
    if (/^\d+\.\s+/.test(line)) {
      const items: InlineToken[][] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
        items.push(parseInline(lines[index].replace(/^\d+\.\s+/, '')));
        index += 1;
      }
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }

    // Paragraph — consecutive non-empty, non-special lines.
    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() !== '' &&
      !/^(#{2,3}\s|[-*]\s|\d+\.\s|>\s|---+$)/.test(lines[index])
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: 'paragraph', tokens: parseInline(paragraph.join(' ')) });
  }

  return blocks;
}

/** Plain text extraction, used for reading time and the search index. */
export function markdownToText(source: string) {
  return parseMarkdown(source)
    .flatMap((block) => {
      switch (block.type) {
        case 'heading':
        case 'paragraph':
        case 'quote':
          return block.tokens.map((token) => token.value);
        case 'list':
          return block.items.flatMap((item) => item.map((token) => token.value));
        default:
          return [];
      }
    })
    .join(' ');
}

/** Extract `##` headings so an article can render a table of contents. */
export function extractHeadings(source: string) {
  return parseMarkdown(source)
    .filter((block): block is Extract<Block, { type: 'heading' }> => block.type === 'heading')
    .filter((block) => block.level === 2)
    .map((block) => ({
      id: block.id,
      text: block.tokens.map((token) => token.value).join(''),
    }));
}
