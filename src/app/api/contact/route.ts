import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { contactSchema, MIN_FORM_ELAPSED_MS } from '@/lib/validations';
import { rateLimit, clientIdentifier } from '@/lib/rate-limit';
import { sendEmail, internalRecipients, generateReference } from '@/lib/email';
import { contactInternalEmail, contactConfirmationEmail } from '@/lib/email/templates';
import { getPrisma } from '@/lib/db';

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
        errors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const { website, elapsedMs, ...data } = parsed.data;

  if (website || (typeof elapsedMs === 'number' && elapsedMs < MIN_FORM_ELAPSED_MS)) {
    // Accept silently — a bot that sees an error just tries again.
    return NextResponse.json({ message: 'Message received.', reference: 'received' });
  }

  const reference = generateReference('EPX-C');
  const emailData = { reference, ...data };

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

  const [internalResult] = await Promise.all([
    sendEmail({
      to: internalRecipients(),
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: data.email,
    }),
    sendEmail({
      to: data.email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    }),
  ]);

  if (!internalResult.ok && !prisma) {
    // Nothing captured the enquiry — tell the user rather than pretending.
    return NextResponse.json(
      {
        message:
          'We could not deliver your message. Please email us directly or call — we do not want to lose your enquiry.',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: 'Message received.', reference });
}
