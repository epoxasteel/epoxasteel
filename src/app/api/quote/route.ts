import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { quoteSchema, MIN_FORM_ELAPSED_MS, ATTACHMENT_MAX_BYTES } from '@/lib/validations';
import { rateLimit, clientIdentifier } from '@/lib/rate-limit';
import { sendEmail, internalRecipients, generateReference } from '@/lib/email';
import { quoteInternalEmail, quoteConfirmationEmail } from '@/lib/email/templates';
import { getPrisma } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function hashIdentifier(value: string) {
  return createHash('sha256')
    .update(`${value}:${process.env.IP_HASH_SALT ?? 'epoxa'}`)
    .digest('hex')
    .slice(0, 32);
}

export async function POST(request: Request) {
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

  const attachment = formData.get('attachment');
  const file = attachment instanceof File && attachment.size > 0 ? attachment : null;

  if (file && file.size > ATTACHMENT_MAX_BYTES) {
    return NextResponse.json(
      { message: 'That attachment exceeds the 10 MB limit.' },
      { status: 413 },
    );
  }

  const raw = Object.fromEntries(
    [...formData.entries()].filter(([key]) => key !== 'attachment'),
  ) as Record<string, string>;

  // FormData stringifies everything; restore the types the schema expects.
  const rawElapsed = Number(raw.elapsedMs);

  const parsed = quoteSchema.safeParse({
    ...raw,
    consent: raw.consent === 'true',
    newsletter: raw.newsletter === 'true',
    elapsedMs: Number.isFinite(rawElapsed) ? rawElapsed : undefined,
    attachmentName: file?.name,
    attachmentSize: file?.size,
  });

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
    return NextResponse.json({ message: 'Request received.', reference: 'received' });
  }

  const reference = generateReference('EPX-Q');
  const emailData = { reference, ...data };

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
          quantity: data.quantity,
          quantityUnit: data.quantityUnit,
          budget: data.budget,
          timeline: data.timeline,
          description: data.description,
          attachmentName: file?.name ?? null,
          attachmentSize: file?.size ?? null,
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

  // The attachment rides along with the internal notification. For higher
  // volumes, move uploads to object storage and send a link instead —
  // docs/DEPLOYMENT.md covers the swap.
  const attachments = file
    ? [
        {
          filename: file.name,
          content: Buffer.from(await file.arrayBuffer()),
          contentType: file.type || 'application/octet-stream',
        },
      ]
    : undefined;

  const internal = quoteInternalEmail(emailData);
  const confirmation = quoteConfirmationEmail(emailData);

  const [internalResult] = await Promise.all([
    sendEmail({
      to: internalRecipients(),
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      replyTo: data.email,
      attachments,
    }),
    sendEmail({
      to: data.email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    }),
  ]);

  if (!internalResult.ok && !prisma) {
    return NextResponse.json(
      {
        message:
          'We could not submit your request. Please email or call us directly — we do not want to lose your enquiry.',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ message: 'Request received.', reference });
}
