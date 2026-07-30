import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { quoteSchema, MIN_FORM_ELAPSED_MS, safeFieldErrors } from '@/lib/validations';
import { checkUpload, uploadMaxBytes, MAX_FILES } from '@/lib/uploads';
import { rateLimit, clientIdentifier, globalLimit } from '@/lib/rate-limit';
import { generateReference } from '@/lib/email';
import { deliverEnquiry } from '@/lib/email/workflow';
import { quoteInternalEmail, quoteConfirmationEmail } from '@/lib/email/templates';
import { getPrisma } from '@/lib/db';
import { fingerprint, findDuplicate, remember } from '@/lib/idempotency';
import { verifyFormToken, sameOrigin } from '@/lib/form-token';
import { describeRequest } from '@/lib/request-context';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function hashIdentifier(value: string) {
  return createHash('sha256')
    .update(`${value}:${process.env.IP_HASH_SALT ?? 'epoxa'}`)
    .digest('hex')
    .slice(0, 32);
}

export async function POST(request: Request) {
  /*
   * A same-site form always sends an Origin (or at least a Referer) matching the
   * host it was served from. Anything that positively identifies itself as coming
   * from somewhere else is not one of ours, whatever it is carrying.
   */
  if (!sameOrigin(request)) {
    return NextResponse.json({ message: 'Request rejected.' }, { status: 403 });
  }

  /*
   * Two ceilings. Per-IP is the primary control and assumes the identity is
   * real; a distributed attempt has a different address per request by
   * definition. The global window is the backstop that bounds what any
   * campaign can spend of the Resend quota, set well above plausible traffic.
   */
  const flood = globalLimit('quote', { limit: 60 });
  if (!flood.success) {
    return NextResponse.json(
      {
        message:
          'We are receiving an unusual number of requests right now. Please call us and we will take the details over the phone.',
      },
      { status: 429, headers: { 'Retry-After': String(flood.retryAfter) } },
    );
  }

  const identifier = clientIdentifier(request);
  const limited = rateLimit(`quote:${identifier}`, { limit: 4, windowMs: 15 * 60_000 });

  if (!limited.success) {
    return NextResponse.json(
      { message: 'Too many requests submitted. Please try again shortly, or call us directly.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  /*
   * Attachments, validated before anything else is done with the request.
   *
   * `attachments` is the current field name; `attachment` is accepted too so a page
   * cached in somebody's browser from before this change still submits successfully
   * rather than silently dropping their drawing.
   *
   * Every check that matters happens here, on the server. The client mirrors the
   * cheap ones to save a wasted upload, but this is the pass that decides — see
   * `lib/uploads.ts` for what is checked and, more importantly, what is not.
   */
  const files = [...formData.getAll('attachments'), ...formData.getAll('attachment')].filter(
    (entry): entry is File => entry instanceof File && entry.size > 0,
  );

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { message: `Please attach no more than ${MAX_FILES} files, or send the rest as a ZIP.` },
      { status: 413 },
    );
  }

  const maxBytes = uploadMaxBytes();
  for (const file of files) {
    const check = await checkUpload(file, maxBytes);
    if (!check.ok) {
      return NextResponse.json(
        { message: check.message },
        { status: file.size > maxBytes ? 413 : 415 },
      );
    }
  }

  const raw = Object.fromEntries(
    [...formData.entries()].filter(([key]) => key !== 'attachments' && key !== 'attachment'),
  ) as Record<string, string>;

  // FormData stringifies everything; restore the types the schema expects.
  const rawElapsed = Number(raw.elapsedMs);

  const parsed = quoteSchema.safeParse({
    ...raw,
    consent: raw.consent === 'true',
    newsletter: raw.newsletter === 'true',
    elapsedMs: Number.isFinite(rawElapsed) ? rawElapsed : undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Please check the highlighted fields and try again.',
        errors: safeFieldErrors(parsed.error, 'quote'),
      },
      { status: 422 },
    );
  }

  const { website, elapsedMs, formToken, sourcePage, ...data } = parsed.data;

  /*
   * The invisible CAPTCHA. To get here a client had to fetch a signed token from
   * a separate endpoint first — trivial for a browser rendering the page, a real
   * cost for a script POSTing blind.
   *
   * A bad or expired token is accepted silently rather than refused. Refusing
   * would mean a visitor who left the tab open over lunch loses a written-out
   * enquiry to a message about a field they cannot see, and the rate limit,
   * honeypot, timing check and duplicate fingerprint all still apply. What it
   * does is log the reason, so a spike is visible.
   */
  const token = verifyFormToken(formToken, 'quote');
  if (!token.ok) {
    console.warn(`[quote] form token ${token.reason} from ${hashIdentifier(identifier)}`);
  }

  if (website || (typeof elapsedMs === 'number' && elapsedMs < MIN_FORM_ELAPSED_MS)) {
    return NextResponse.json({ message: 'Request received.', reference: 'received' });
  }

  /* A repeat of the same enquiry inside ten minutes is answered with the
     original reference and not sent again — the visitor sees success either way,
     and the desk sees one project rather than two. */
  const print = fingerprint(identifier, 'quote', [
    data.email,
    data.fullName,
    data.product,
    data.quantity,
    data.description,
  ]);

  const already = findDuplicate(print);
  if (already) {
    return NextResponse.json({ message: 'Request received.', reference: already });
  }

  const reference = generateReference('EPX-Q');
  remember(print, reference);
  // Browser, OS, device and the local time it arrived — read from the request we
  // already have, written into one email, never stored. See request-context.ts.
  const emailData = {
    reference,
    context: describeRequest(request, { sourcePage, ip: identifier }),
    attachmentNames: files.map((file) => file.name),
    ...data,
  };

  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.quoteRequest.create({
        data: {
          reference,
          fullName: data.fullName,
          company: data.company,
          email: data.email,
          phone: data.phone,
          country: data.country,
          city: data.city,
          projectType: data.projectType,
          product: data.product,
          dimensions: data.dimensions,
          quantity: data.quantity,
          quantityUnit: data.quantityUnit,
          finish: data.finish,
          fulfilment: data.fulfilment,
          budget: data.budget || null,
          timeline: data.timeline,
          description: data.description,
          attachmentName: files.length ? files.map((file) => file.name).join(', ') : null,
          attachmentSize: files.length ? files.reduce((total, file) => total + file.size, 0) : null,
          newsletterOptIn: Boolean(data.newsletter),
          ipHash: hashIdentifier(identifier),
          userAgent: request.headers.get('user-agent')?.slice(0, 255) ?? null,
          referrer: request.headers.get('referer')?.slice(0, 255) ?? null,
        },
      });
    } catch (error) {
      console.error('[quote] persistence failed', error);
    }
  }

  if (data.newsletter && prisma) {
    try {
      await prisma.subscriber.upsert({
        where: { email: data.email },
        update: { unsubscribedAt: null },
        create: { email: data.email, source: 'quote-form' },
      });
    } catch (error) {
      console.error('[quote] newsletter opt-in failed', error);
    }
  }

  // The attachments ride along with the internal notification, so the owner opens
  // one email and has everything. For higher volumes, move uploads to object
  // storage and send links instead — docs/DEPLOYMENT.md covers the swap.
  const attachments = files.length
    ? await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type || 'application/octet-stream',
        })),
      )
    : undefined;

  const internal = quoteInternalEmail(emailData);
  const confirmation = quoteConfirmationEmail(emailData);

  // Same workflow as every other form; the drawings ride with the owner's copy.
  const { owner: internalResult } = await deliverEnquiry({
    reference,
    customerEmail: data.email,
    owner: internal,
    customer: confirmation,
    attachments,
  });

  // See the contact route: delivered, held for retry, or genuinely lost. Only the
  // last of the three is the visitor's problem to solve.
  const captured = internalResult.ok || internalResult.held || Boolean(prisma);

  if (!captured) {
    return NextResponse.json(
      {
        message:
          'We could not submit your request. Please email or call us directly — we do not want to lose your enquiry.',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message: 'Request received.',
    reference,
    ...(internalResult.ok
      ? {}
      : { notice: 'Your confirmation email may take a little longer than usual to arrive.' }),
  });
}
