import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { contactSchema, MIN_FORM_ELAPSED_MS, safeFieldErrors } from '@/lib/validations';
import { rateLimit, clientIdentifier, globalLimit } from '@/lib/rate-limit';
import { generateReference } from '@/lib/email';
import { deliverEnquiry } from '@/lib/email/workflow';
import { contactInternalEmail, contactConfirmationEmail } from '@/lib/email/templates';
import { getPrisma } from '@/lib/db';
import { fingerprint, findDuplicate, remember } from '@/lib/idempotency';
import { verifyFormToken, sameOrigin } from '@/lib/form-token';
import { describeRequest } from '@/lib/request-context';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** IP addresses are hashed before storage — enough to spot abuse, not to track. */
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
  const flood = globalLimit('contact', { limit: 80 });
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
  const limited = rateLimit(`contact:${identifier}`, { limit: 5, windowMs: 10 * 60_000 });

  if (!limited.success) {
    return NextResponse.json(
      { message: 'Too many messages sent. Please try again shortly, or call us directly.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Please check the highlighted fields and try again.',
        errors: safeFieldErrors(parsed.error, 'contact'),
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
  const token = verifyFormToken(formToken, 'contact');
  if (!token.ok) {
    console.warn(`[contact] form token ${token.reason} from ${hashIdentifier(identifier)}`);
  }

  if (website || (typeof elapsedMs === 'number' && elapsedMs < MIN_FORM_ELAPSED_MS)) {
    // Accept silently — a bot that sees an error just tries again.
    return NextResponse.json({ message: 'Message received.', reference: 'received' });
  }

  // See the quote route: a reload on a slow connection should not become two
  // messages on the desk.
  const print = fingerprint(identifier, 'contact', [
    data.email,
    data.name,
    data.subject,
    data.message,
  ]);

  const already = findDuplicate(print);
  if (already) {
    return NextResponse.json({ message: 'Message received.', reference: already });
  }

  const reference = generateReference('EPX-C');
  remember(print, reference);
  // Browser, OS, device and the local time it arrived — read from the request we
  // already have, written into one email, never stored. See request-context.ts.
  const emailData = {
    reference,
    context: describeRequest(request, { sourcePage, ip: identifier }),
    ...data,
  };

  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.contactMessage.create({
        data: {
          reference,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          projectType: data.projectType,
          subject: data.subject,
          message: data.message,
          ipHash: hashIdentifier(identifier),
          userAgent: request.headers.get('user-agent')?.slice(0, 255) ?? null,
        },
      });
    } catch (error) {
      // Persistence must never lose an enquiry that email can still deliver.
      console.error('[contact] persistence failed', error);
    }
  }

  const internal = contactInternalEmail(emailData);
  const confirmation = contactConfirmationEmail(emailData);

  // Owner first with Reply-To set to the customer, then the confirmation. The
  // routing, reply addresses and ordering all live in one place — see
  // lib/email/workflow.ts.
  const { owner: internalResult } = await deliverEnquiry({
    reference,
    customerEmail: data.email,
    owner: internal,
    customer: confirmation,
  });

  /*
   * Three outcomes, and only the third is a failure the visitor needs to act on.
   *
   *   Delivered — the desk has it.
   *   Held      — the transport is having a bad few minutes; the message is on the
   *               spool and goes out on the back of the next successful send. The
   *               enquiry is not lost, so telling someone to phone instead would
   *               be wrong. We do say the confirmation may be slow, because it will.
   *   Lost      — nothing captured it: no delivery, no spool, no database. Say so.
   */
  const captured = internalResult.ok || internalResult.held || Boolean(prisma);

  if (!captured) {
    return NextResponse.json(
      {
        message:
          'We could not deliver your message. Please email us directly or call. We do not want to lose your enquiry.',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    message: 'Message received.',
    reference,
    ...(internalResult.ok
      ? {}
      : { notice: 'Your confirmation email may take a little longer than usual to arrive.' }),
  });
}
