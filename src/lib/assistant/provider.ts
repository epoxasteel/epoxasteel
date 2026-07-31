import { systemPrompt } from '@/lib/assistant/prompt';
import { assistantConfigured } from '@/lib/assistant/config';

/**
 * The model call.
 *
 * Written against the OpenAI Chat Completions streaming API with `fetch` rather
 * than the SDK: it is one POST and one SSE parser, and it keeps a dependency —
 * and its transitive tree — out of a bundle that is already the heaviest thing
 * we ship. It also means the whole provider surface is this one file, so moving
 * to a different one is a contained change (see docs/AI-ASSISTANT.md).
 *
 * Everything here runs on the server only. The key never reaches the browser.
 */

export type AssistantTurn = { role: 'user' | 'assistant'; content: string };

export { assistantConfigured };

const DEFAULT_MODEL = 'gpt-4.1-mini';

/**
 * `OPENAI_BASE_URL` points the client at an OpenAI-compatible endpoint —
 * Azure OpenAI, a gateway, or a local stub during testing — without touching
 * this file. Defaults to OpenAI itself.
 */
function endpoint() {
  const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/+$/, '');
  return `${base}/chat/completions`;
}

export class AssistantError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'AssistantError';
  }
}

/**
 * Opens the stream and yields plain text deltas.
 *
 * `signal` is threaded through so that when a visitor closes the panel
 * mid-answer we stop paying for tokens nobody will read.
 */
export async function* streamAssistant(
  turns: AssistantTurn[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new AssistantError('The assistant is not configured.', 503);

  const response = await fetch(endpoint(), {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      ...(process.env.OPENAI_ORG_ID ? { 'OpenAI-Organization': process.env.OPENAI_ORG_ID } : {}),
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      stream: true,
      // Low temperature: this desk quotes standards and tolerances, and there is
      // no upside to it phrasing them creatively.
      temperature: 0.3,
      max_tokens: 700,
      messages: [{ role: 'system', content: systemPrompt() }, ...turns],
    }),
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => '');
    // Surface the class of failure, never the provider's message — it can carry
    // account and organization details.
    const status = response.status === 429 ? 429 : 502;
    console.error(`[assistant] upstream ${response.status}: ${detail.slice(0, 400)}`);
    throw new AssistantError(
      status === 429
        ? 'The assistant is busy right now. Please try again in a moment.'
        : 'The assistant is unavailable right now.',
      status,
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line; a frame can span reads.
    let boundary = buffer.indexOf('\n\n');
    while (boundary !== -1) {
      const frame = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      boundary = buffer.indexOf('\n\n');

      for (const line of frame.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data) as {
            choices?: { delta?: { content?: string } }[];
          };
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          /* A partial or unexpected frame is not worth failing the answer for. */
        }
      }
    }
  }
}
