import { z } from 'zod';
import { LEAD_SENTINEL } from '@/lib/assistant/prompt';

/**
 * Pulls the lead record out of a streamed reply without ever showing it.
 *
 * The model appends `[[LEAD]]{...}` to its final message when it has gathered a
 * name and an email. Two things make that awkward to handle: the reply is
 * streamed a token at a time, so the sentinel can straddle a chunk boundary, and
 * the visitor must never see a character of it — not even for one frame.
 *
 * So the extractor holds back the last few characters of every chunk (enough to
 * complete a sentinel if one is beginning) and stops emitting entirely the
 * moment it sees the marker. Anything after that is the record, not the message.
 */
export const assistantLeadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  product: z.string().trim().max(160).optional(),
  quantity: z.string().trim().max(120).optional(),
  timeline: z.string().trim().max(120).optional(),
  location: z.string().trim().max(160).optional(),
  summary: z.string().trim().max(800).optional(),
  callback: z.string().trim().max(160).optional(),
});

export type AssistantLead = z.infer<typeof assistantLeadSchema>;

export function createLeadExtractor() {
  /** Text seen but not yet released, in case a sentinel is forming. */
  let pending = '';
  /** Everything after the sentinel. */
  let captured = '';
  let capturing = false;

  return {
    /** Feed a chunk; returns the text that is safe to show the visitor. */
    push(chunk: string): string {
      if (capturing) {
        captured += chunk;
        return '';
      }

      pending += chunk;

      const at = pending.indexOf(LEAD_SENTINEL);
      if (at !== -1) {
        capturing = true;
        const visible = pending.slice(0, at);
        captured = pending.slice(at + LEAD_SENTINEL.length);
        pending = '';
        return visible;
      }

      // Keep back enough to complete a sentinel that has only partly arrived.
      const hold = LEAD_SENTINEL.length - 1;
      if (pending.length <= hold) return '';

      const release = pending.slice(0, pending.length - hold);
      pending = pending.slice(pending.length - hold);
      return release;
    },

    /** Call once the stream ends; returns any remaining visible text. */
    flush(): string {
      if (capturing) return '';
      const rest = pending;
      pending = '';
      return rest;
    },

    /**
     * The validated lead, or null. Tolerates the model wrapping the JSON in a
     * code fence or trailing prose, which is the most likely way it goes wrong.
     */
    lead(): AssistantLead | null {
      if (!captured.trim()) return null;

      const text = captured.replace(/```(?:json)?/g, '').trim();
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end <= start) return null;

      try {
        const parsed: unknown = JSON.parse(text.slice(start, end + 1));
        const result = assistantLeadSchema.safeParse(parsed);
        return result.success ? result.data : null;
      } catch {
        return null;
      }
    },
  };
}
