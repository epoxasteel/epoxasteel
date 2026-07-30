import type { EmailMessage, SendResult } from '@/lib/email/types';
import { fromAddress } from '@/lib/email/config';

/**
 * The SMTP transport.
 *
 * Kept alongside Resend rather than removed once Resend was configured, because a
 * mailbox at the domain's own host is the fallback that needs no third-party
 * account — useful for a self-hosted deployment, and useful the day a provider has
 * an outage and somebody wants mail flowing within the hour.
 *
 * Set `SMTP_HOST` and it takes over from the console fallback; set `RESEND_API_KEY`
 * as well and Resend wins, because it is the one with a verified domain.
 */
export async function sendWithSmtp(message: EmailMessage): Promise<SendResult> {
  const nodemailer = (await import('nodemailer')).default;

  const port = Number(process.env.SMTP_PORT || 587);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // Implicit TLS on 465, STARTTLS everywhere else.
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
  });

  try {
    const info = await transporter.sendMail({
      from: fromAddress(),
      to: Array.isArray(message.to) ? message.to.join(', ') : message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
      attachments: message.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    return { ok: true, provider: 'smtp', id: info.messageId };
  } finally {
    // Without this the pooled connection keeps the event loop alive, which on a
    // long-running server is a slow leak of idle sockets to the relay.
    transporter.close();
  }
}
