import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { newsletterSchema, MIN_FORM_ELAPSED_MS, safeFieldErrors } from '@/lib/validations';
import { rateLimit, clientIdentifier, globalLimit } from '@/lib/rate-limit';
import { verifyFormToken, sameOrigin } from '@/lib/form-token';
import { deliverInquiry } from '@/lib/email/workflow';
import { newsletterConfirmationEmail, newsletterInternalEmail } from '@/lib/email/templates';
import { getPrisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ message: 'Request rejected.' }, { status: 403 });
  }

  /*
   * Two ceilings. Per-IP is the primary control and assumes the identity is
   * real; a distributed attempt has a different address per request by
   * definition. The global window is the backstop that bounds what any
   * campaign can spend of the Resend quota, set well above plausible traffic.
   */
  const flood = globalLimit('newsletter', { limit: 120 });
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
  const limited = rateLimit(`newsletter:${identifier}`, { limit: 4, windowMs: 60_000 });

  if (!limited.success) {
    return NextResponse.json(
      { message: 'Too many attempts. Please try again in a minute.' },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: 'Please enter a valid email address.',
        errors: safeFieldErrors(parsed.error, 'newsletter'),
      },
      { status: 422 },
    );
  }

  const { email, website, elapsedMs, formToken } = parsed.data;

  // Logged rather than refused — see the note in the contact route.
  const token = verifyFormToken(formToken, 'newsletter');
  if (!token.ok) console.warn(`[newsletter] form token ${token.reason}`);

  // Silent spam rejections: return success so a bot learns nothing.
  if (website || (typeof elapsedMs === 'number' && elapsedMs < MIN_FORM_ELAPSED_MS)) {
    return NextResponse.json({ message: 'You are subscribed.' });
  }

  const prisma = getPrisma();
  if (prisma) {
    try {
      await prisma.subscriber.upsert({
        where: { email },
        // Re-subscribing clears a previous unsubscribe.
        update: { unsubscribedAt: null, source: 'website' },
        create: { email, source: 'website' },
      });
    } catch (error) {
      console.error('[newsletter] persistence failed', error);
    }
  }

  const confirmation = newsletterConfirmationEmail(email);
  const internal = newsletterInternalEmail(email);

  /*
   * A reference even though a subscription has none to show the visitor.
   *
   * It is what the idempotency key is built from, so a retry after an ambiguous
   * timeout is collapsed by the provider rather than sending someone a second
   * welcome. Derived from the address so the same subscriber retried always keys
   * the same way.
   */
  const reference = `EPX-N-${createHash('sha256').update(email).digest('hex').slice(0, 10).toUpperCase()}`;

  await deliverInquiry({
    reference,
    customerEmail: email,
    owner: internal,
    customer: confirmation,
  });

  return NextResponse.json({ message: 'You are subscribed. Check your inbox for a welcome note.' });
}
