import { sendEmail, ownerRecipients, replyToAddress } from '@/lib/email';
import type { EmailAttachment, SendResult } from '@/lib/email/types';

/**
 * The inquiry workflow, in one place.
 *
 * Every form on this site does the same two things: tell the owner, and tell the
 * customer. Until now each route assembled that itself, which is how the
 * newsletter ended up shipping without a Reply-To on either message — its owner
 * notification replied to the unattended sending address instead of the
 * subscriber, and nobody noticed because the emails still arrived.
 *
 * That is the failure mode this function exists to remove. A route now describes
 * *what* to say; the routing, the reply addresses, the ordering and the
 * idempotency reference are decided here, once, for every form that exists and
 * every form added later.
 *
 * ## The four rules it enforces
 *
 * **One recipient list for the owner.** `OWNER_EMAIL`, comma-separated for
 * several people. A route never names a mailbox.
 *
 * **One sender.** `FROM_EMAIL`, for both messages — one verified domain, one
 * reputation, one DKIM signature.
 *
 * **Reply-To is what makes the whole thing work.** On the owner's notification it
 * is the *customer's* address, so pressing Reply in any mail client writes
 * straight back to them. On the customer's confirmation it is the business
 * address, never the unattended sender, because people do answer confirmations
 * with the thing they forgot to mention.
 *
 * **Owner first.** Resend sends are paced FIFO (see `resend.ts`), so whichever
 * message is queued first goes first. The notification has a person waiting on
 * it; the confirmation does not.
 */

export type InquiryContent = {
  subject: string;
  html: string;
  text: string;
};

export type InquiryDelivery = {
  /** Threaded into both messages' idempotency keys and the spool. */
  reference: string;
  /** Where the confirmation goes, and what the owner's Reply-To is set to. */
  customerEmail: string;
  owner: InquiryContent;
  /** Omit when a form has nothing to confirm — the owner is still notified. */
  customer?: InquiryContent;
  /** Drawings and documents, attached to the owner's copy only. */
  attachments?: EmailAttachment[];
};

export type InquiryResult = {
  /** The one that decides what the visitor is told. */
  owner: SendResult;
  customer?: SendResult;
};

export async function deliverInquiry({
  reference,
  customerEmail,
  owner,
  customer,
  attachments,
}: InquiryDelivery): Promise<InquiryResult> {
  const ownerSend = sendEmail({
    to: ownerRecipients(),
    reference,
    subject: owner.subject,
    html: owner.html,
    text: owner.text,
    // The entire "press Reply and answer the customer" workflow is this line.
    replyTo: customerEmail,
    attachments,
  });

  if (!customer) {
    return { owner: await ownerSend };
  }

  const customerSend = sendEmail({
    to: customerEmail,
    reference,
    subject: customer.subject,
    html: customer.html,
    text: customer.text,
    // A reply to a confirmation has to reach a person, so never the sender.
    replyTo: replyToAddress(),
  });

  const [ownerResult, customerResult] = await Promise.all([ownerSend, customerSend]);
  return { owner: ownerResult, customer: customerResult };
}
