import * as React from 'react';
import Link from 'next/link';
import { parseMarkdown, type Block, type InlineToken } from '@/lib/markdown';
import { cn } from '@/lib/utils';

/**
 * Renders a parsed article body as React elements.
 *
 * Nothing here touches `dangerouslySetInnerHTML` — the parser produces a typed
 * block tree, and this component maps it to elements. A content author cannot
 * introduce markup into a page, intentionally or otherwise.
 */

function Inline({ tokens }: { tokens: InlineToken[] }) {
  return (
    <>
      {tokens.map((token, index) => {
        if (token.type === 'bold') return <strong key={index}>{token.value}</strong>;

        if (token.type === 'link') {
          const external = token.href.startsWith('https://');
          return external ? (
            <a key={index} href={token.href} target="_blank" rel="noopener noreferrer">
              {token.value}
            </a>
          ) : (
            <Link key={index} href={token.href}>
              {token.value}
            </Link>
          );
        }

        return <React.Fragment key={index}>{token.value}</React.Fragment>;
      })}
    </>
  );
}

function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 2 ? 'h2' : 'h3';
      return (
        <Tag key={index} id={block.id} className="scroll-mt-32">
          <Inline tokens={block.tokens} />
        </Tag>
      );
    }

    case 'paragraph':
      return (
        <p key={index}>
          <Inline tokens={block.tokens} />
        </p>
      );

    case 'quote':
      return (
        <blockquote key={index}>
          <Inline tokens={block.tokens} />
        </blockquote>
      );

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag key={index}>
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <Inline tokens={item} />
            </li>
          ))}
        </Tag>
      );
    }

    case 'rule':
      return <hr key={index} />;

    default:
      return null;
  }
}

export function Article({ body, className }: { body: string; className?: string }) {
  const blocks = React.useMemo(() => parseMarkdown(body), [body]);

  return <div className={cn('prose-steel', className)}>{blocks.map(renderBlock)}</div>;
}

/** Sticky in-page navigation generated from the article's `##` headings. */
export function TableOfContents({
  headings,
  className,
}: {
  headings: { id: string; text: string }[];
  className?: string;
}) {
  if (headings.length < 2) return null;

  return (
    <nav aria-labelledby="toc-heading" className={className}>
      <p id="toc-heading" className="text-eyebrow text-steel uppercase">
        On this page
      </p>
      <ul className="mt-5 space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                'group border-hairline text-ash flex gap-3 border-l py-1.5 pl-4 text-[0.875rem]',
                'hover:border-arc-bright hover:text-bright transition-colors duration-250',
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
