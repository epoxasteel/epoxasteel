import { z } from 'zod';
import { NextResponse } from 'next/server';
import { rateLimit, clientIdentifier } from '@/lib/rate-limit';
import { streamAssistant, AssistantError, assistantConfigured } from '@/lib/assistant/provider';
import { createLeadExtractor } from '@/lib/assistant/lead';
import { generateReference } from '@/lib/email';
import { deliverInquiry } from '@/lib/email/workflow';
import { assistantLeadEmail } from '@/lib/email/templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * The assistant endpoint.
 *
 * Streams the reply so the first words appear in well under a second, which is
 * the difference between a conversation and a loading state.
 *
 * Bounds are deliberately tight, because this is the one endpoint on the site
 * that costs money per request: 24 turns of history, 2,000 characters per
 * message, 30 messages per IP per ten minutes. A visitor will never notice any
 * of them; a script will hit all three.
 */

const MAX_TURNS = 24;
const MAX_CHARS = 2_000;

const turnSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(MAX_CHARS),
});

const requestSchema = z.object({
  messages: z.array(turnSchema).min(1).max(MAX_TURNS),
});

export async function POST(request: Request) {
  if (!assistantConfigured()) {
    return NextResponse.json(
      {
        message:
          'The assistant is not available right now. Please send us a quote request or call the office.',
      },
      { status: 503 },
    );
  }

  const identifier = clientIdentifier(request);
  const limited = rateLimit(`assistant:${identifier}`, { limit: 30, windowMs: 10 * 60_000 });

  if (!limited.success) {
    return NextResponse.json(
      {
        message:
          'That is a lot of questions in a short time. Give it a minute, or call the office and speak to someone directly.',
      },
      { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const { messages } = parsed.data;

  // The visitor's own words are data, not instructions — the system prompt says
  // as much, and the transport keeps them in user-role messages so the model
  // cannot be talked into a different brief by a pasted "system:" line.
  if (messages[messages.length - 1]?.role !== 'user') {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const extractor = createLeadExtractor();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let answer = '';

      try {
        for await (const delta of streamAssistant(messages, request.signal)) {
          const visible = extractor.push(delta);
          if (visible) {
            answer += visible;
            controller.enqueue(encoder.encode(visible));
          }
        }

        const tail = extractor.flush();
        if (tail) {
          answer += tail;
          controller.enqueue(encoder.encode(tail));
        }
      } catch (error) {
        if (error instanceof AssistantError) {
          // The stream may already carry half an answer, so the failure has to
          // arrive as text rather than a status code.
          controller.enqueue(encoder.encode(`\n\n${error.message}`));
        } else if ((error as Error)?.name !== 'AbortError') {
          console.error('[assistant] stream failed', error);
          controller.enqueue(
            encoder.encode(
              '\n\nSomething went wrong at our end. Please try again, or call the office.',
            ),
          );
        }
      } finally {
        controller.close();
      }

      // Notifying the desk happens after the visitor has their answer, and its
      // failure is never allowed to affect the conversation.
      const lead = extractor.lead();
      if (lead) {
        const transcript = [...messages, { role: 'assistant' as const, content: answer }]
          .map((turn) => `${turn.role === 'user' ? 'Visitor' : 'Assistant'}: ${turn.content}`)
          .join('\n\n');

        const reference = generateReference('EPX-AI');
        const message = assistantLeadEmail({ ...lead, reference, transcript });

        /*
         * No customer confirmation: the visitor is mid-conversation and has just
         * been told in the chat that we have their details. An email arriving to
         * say the same thing a second later reads as a system talking to itself.
         *
         * The owner notification goes through the same workflow as every form, so
         * the reference, the Reply-To and the routing cannot drift from them.
         */
        void deliverInquiry({
          reference,
          customerEmail: lead.email,
          owner: message,
        }).catch((error) => console.error('[assistant] lead notification failed', error));
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      // Stops any intermediary from buffering the stream into one response.
      'X-Accel-Buffering': 'no',
    },
  });
}
