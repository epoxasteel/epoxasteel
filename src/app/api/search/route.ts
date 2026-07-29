import { NextResponse } from 'next/server';
import { search } from '@/lib/search';

/**
 * Server-side search.
 *
 * Running the query here keeps the full-text index — which includes every
 * article body — on the server. The dialog ships a few kilobytes of fetch logic
 * instead of the whole catalogue.
 */
export const runtime = 'nodejs';
// Must stay dynamic: the response depends on `?q=`. `force-static` would bake a
// single empty response at build time and serve it for every query.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';
  const limitParam = Number(searchParams.get('limit'));
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 40) : 20;

  if (query.trim().length < 2) {
    return NextResponse.json({ query, results: [], total: 0 });
  }

  const matches = search(query, limit);

  return NextResponse.json(
    {
      query,
      total: matches.length,
      // `haystack` and `score` are internal — never send them to the client.
      results: matches.map(({ id, type, title, description, href }) => ({
        id,
        type,
        title,
        description,
        href,
      })),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    },
  );
}
