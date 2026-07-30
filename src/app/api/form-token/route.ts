import { NextResponse } from 'next/server';
import { z } from 'zod';
import { issueFormToken, type FormKind } from '@/lib/form-token';
import { rateLimit, clientIdentifier } from '@/lib/rate-limit';
import { uploadMaxBytes, acceptLabel, MAX_FILES } from '@/lib/uploads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Issues the token a form needs before it can be submitted, and tells it the
 * current upload limits.
 *
 * The token is fetched when a visitor first touches a field rather than on page
 * load, for two reasons: most visitors never start a form, and a token issued at
 * page load has already spent part of its thirty minutes by the time anyone types.
 *
 * The upload policy rides along on the same response because the alternative is
 * worse. `UPLOAD_MAX_MB` is read on the server, and the quote page is prerendered —
 * so passing the limit down as a prop would bake in whatever the value was at build
 * time, and a `NEXT_PUBLIC_` twin would be a second variable that can silently
 * disagree with the one actually enforced. This way there is one variable, read at
 * request time, and the number the visitor is shown is the number that will be
 * applied. No extra round trip either: the form already makes this call.
 *
 * Rate limited on its own budget. Handing out signatures is cheap but not free,
 * and an endpoint that mints credentials should never be the unguarded one.
 */

const query = z.enum(['contact', 'quote', 'newsletter']);

export async function GET(request: Request) {
  const identifier = clientIdentifier(request);
  const limited = rateLimit(`token:${identifier}`, { limit: 40, windowMs: 10 * 60_000 });

  if (!limited.success) {
    return NextResponse.json(
      { message: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
    );
  }

  const parsed = query.safeParse(new URL(request.url).searchParams.get('form'));
  if (!parsed.success) {
    return NextResponse.json({ message: 'Unknown form.' }, { status: 400 });
  }

  const maxBytes = uploadMaxBytes();

  return NextResponse.json(
    {
      token: issueFormToken(parsed.data as FormKind),
      upload: { maxBytes, maxFiles: MAX_FILES, label: acceptLabel(maxBytes) },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
