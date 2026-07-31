import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { EmailMessage } from '@/lib/email/types';

/**
 * The place an enquiry goes when email delivery fails.
 *
 * The brief's requirement is "never lose the inquiry", and until now a transport
 * failure meant exactly that: the customer saw success, the error was logged, and
 * the enquiry existed nowhere but in a log line. The database backup covers the
 * *content* of a submission, but not the fact that nobody was told about it.
 *
 * So a message that exhausts its retries is appended to a JSONL spool on disk and
 * retried later. Three things about that choice:
 *
 *   **JSONL, appended.** A crash mid-write corrupts one line, not the file, and
 *   recovery is a text editor. A database table would be tidier and would also
 *   fail in exactly the case this exists to survive — the moment the platform is
 *   having a bad day.
 *
 *   **On disk, and disk here is ephemeral.** Railway reclaims the container's
 *   filesystem on redeploy, so the spool survives a transport outage and a
 *   process restart, but not a deploy. That is the honest limit of a
 *   zero-infrastructure design; mount a volume at EMAIL_SPOOL_DIR to make it
 *   durable. Attachments are deliberately dropped from the spooled copy — a 10 MB
 *   drawing per failure would fill any volume — and the notification says so, so
 *   whoever picks it up knows to ask for the file.
 *
 *   **Drained opportunistically.** Every successful send tries the backlog. There
 *   is no scheduler to keep alive and no cron to configure; traffic is the clock.
 */

const DIR = process.env.EMAIL_SPOOL_DIR || path.join(process.cwd(), '.email-spool');
const FILE = path.join(DIR, 'pending.jsonl');

/** Beyond this the file is truncated rather than allowed to grow without bound. */
const MAX_ENTRIES = 500;

type Spooled = {
  at: string;
  attempts: number;
  reference?: string;
  message: Omit<EmailMessage, 'attachments'> & { attachmentNames?: string[] };
};

export async function spool(message: EmailMessage, reference?: string) {
  try {
    await mkdir(DIR, { recursive: true });

    const { attachments, ...rest } = message;
    const entry: Spooled = {
      at: new Date().toISOString(),
      attempts: 0,
      reference,
      message: {
        ...rest,
        attachmentNames: attachments?.map((attachment) => attachment.filename),
      },
    };

    await appendFile(FILE, `${JSON.stringify(entry)}\n`, 'utf8');
    console.warn(
      `[email] spooled for retry${reference ? ` (${reference})` : ''}, ${message.subject}`,
    );
    return true;
  } catch (error) {
    // The last line of defence has itself failed. Log the whole thing so the
    // enquiry is at least recoverable from the platform's log retention.
    console.error(
      '[email] SPOOL FAILED, enquiry recorded here only:',
      JSON.stringify({ reference, subject: message.subject, text: message.text }),
      error,
    );
    return false;
  }
}

async function readSpool(): Promise<Spooled[]> {
  try {
    const raw = await readFile(FILE, 'utf8');
    return raw
      .split('\n')
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as Spooled];
        } catch {
          return [];
        }
      });
  } catch {
    return [];
  }
}

async function writeSpool(entries: Spooled[]) {
  try {
    if (!entries.length) {
      await writeFile(FILE, '', 'utf8');
      return;
    }
    const kept = entries.slice(-MAX_ENTRIES);
    await writeFile(FILE, kept.map((entry) => `${JSON.stringify(entry)}\n`).join(''), 'utf8');
  } catch (error) {
    console.error('[email] could not rewrite the spool', error);
  }
}

let draining = false;

/**
 * Tries the backlog once.
 *
 * Guarded by a flag rather than a lock: two concurrent drains in one process
 * would send duplicates, and a flag is enough because Node is single-threaded
 * between awaits. Across replicas each holds its own spool, so there is nothing
 * to co-ordinate.
 *
 * An entry that has failed five times is given up on and logged in full — at that
 * point the problem is configuration, not weather, and retrying forever only
 * hides it.
 */
export async function drainSpool(send: (message: EmailMessage) => Promise<{ ok: boolean }>) {
  if (draining) return;
  draining = true;

  try {
    const entries = await readSpool();
    if (!entries.length) return;

    const remaining: Spooled[] = [];
    let delivered = 0;

    for (const entry of entries) {
      const note = entry.message.attachmentNames?.length
        ? `\n\n[Retried delivery. The original attachment${entry.message.attachmentNames.length === 1 ? '' : 's'} (${entry.message.attachmentNames.join(', ')}) could not be re-sent, ask the customer to resend if needed.]`
        : '';

      const result = await send({
        ...entry.message,
        text: entry.message.text + note,
      }).catch(() => ({ ok: false }));

      if (result.ok) {
        delivered += 1;
        continue;
      }

      const attempts = entry.attempts + 1;
      if (attempts >= 5) {
        console.error(
          `[email] giving up after ${attempts} attempts, enquiry recorded here only:`,
          JSON.stringify({
            reference: entry.reference,
            subject: entry.message.subject,
            text: entry.message.text,
          }),
        );
        continue;
      }

      remaining.push({ ...entry, attempts });
    }

    if (delivered) console.info(`[email] delivered ${delivered} spooled message(s) on retry`);
    if (delivered || remaining.length !== entries.length) await writeSpool(remaining);
  } finally {
    draining = false;
  }
}
