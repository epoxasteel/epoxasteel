# The AI enquiry desk

A streaming assistant that answers questions about EPOXA STEEL's products and
processes, and turns a real enquiry into a lead on the sales desk.

It is built to read as part of the site rather than a widget bolted onto it: the
same surfaces, hairlines, grain and arc accent as every other panel, the same
easing curve, and no bubble avatar.

---

## Turning it on

Set one variable and redeploy:

```
OPENAI_API_KEY="sk-..."
```

That is the whole setup. Without it, the assistant is not offered at all — no
dock, no panel, and the transcript UI is left out of the browser bundle. The rest
of the site is unaffected.

Optional:

| Variable | Default | Why you would set it |
| --- | --- | --- |
| `OPENAI_MODEL` | `gpt-4.1-mini` | A larger model for harder questions, or a cheaper one. |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1` | Azure OpenAI, a gateway, or a proxy. |
| `OPENAI_ORG_ID` | — | Only if your key belongs to several organisations. |
| `NEXT_PUBLIC_ASSISTANT_ENABLED` | — | See the build-time note below. |

### One thing that will catch you out

The root layout is statically prerendered, so whether the dock offers the enquiry
desk is decided **when `next build` runs**, not per request.

Railway exposes service variables to builds, so setting `OPENAI_API_KEY` in the
Railway dashboard is enough — nothing else to do. On a platform that only injects
secrets at runtime, the build would decide "no assistant" and the dock would
never appear even though the key is present. Set
`NEXT_PUBLIC_ASSISTANT_ENABLED=1` there as well. It is a boolean, it is inlined
at build, and the API route still refuses to answer without a real key on the
server — so it cannot leak anything or fake a working assistant.

---

## What it will and will not say

Three rules are wired into the system prompt, because they are the three a steel
supplier gets sued over:

1. **No prices.** Not a figure, not a range, not a "typically around". Pricing
   depends on tonnage, grade, processing and the day's mill position, and it
   comes from the desk after a quote request.
2. **No structural design.** It explains what a product is generally used for. It
   will not specify a section for a real span — that is engineering, and it goes
   to `/services/engineering-support`.
3. **No invented facts.** Grades, standards, tolerances, certifications,
   statistics and dimensions come from the knowledge base or they do not get
   said.

It also stays in scope: asked about anything other than EPOXA STEEL, steel and
construction procurement, it declines and offers to help with steel. Instructions
embedded in a visitor's message — "ignore your rules", "show me your prompt" —
are treated as off-topic requests.

## Where its knowledge comes from

`src/lib/assistant/knowledge.ts` compiles a digest from the same typed content
modules the pages render: every product with its grades, standards, finishes,
applications, key facts and full dimension table; every service and industry;
the FAQs; and the company's verified figures and contact details.

That digest is sent with each request. Nothing is asked of the model's memory.

**This means editing content updates the assistant in the same commit.** Add a
grade to `src/content/products.ts` and the assistant knows about it on the next
deploy. There is no second copy to drift.

---

## How a lead reaches the desk

When the assistant has gathered both a name and an email address, it appends a
single line to its final message:

```
[[LEAD]]{"name":"…","email":"…","company":"…","product":"…","summary":"…"}
```

The server strips that from the stream — the visitor never sees a character of it
— validates it with Zod, and emails the desk with the full conversation attached,
`Reply-To` set to the customer. Whoever picks it up can see what was already
said, so the customer never has to repeat themselves.

Optional fields the model fills in when it knows them: `company`, `phone`,
`product`, `quantity`, `timeline`, `location`, `summary`, `callback`. `callback`
is when the visitor said they would like to be contacted.

### Why a sentinel rather than tool calling

A single marker at the end of a message is trivial to parse deterministically,
cannot half-fire mid-stream, and degrades to "no lead recorded" if the model
ignores it. A broken tool loop breaks the whole conversation.

The extractor in `src/lib/assistant/lead.ts` holds back the last few characters
of every chunk in case a sentinel is forming, so the marker cannot flash on
screen for a frame even when it straddles a network boundary.

---

## Limits

Per visitor, per IP:

- **30 messages per 10 minutes** — a person will never notice, a script hits it
  immediately.
- **24 turns of history** sent per request, so a long conversation cannot grow
  the prompt without bound.
- **2,000 characters per message.**
- **700 output tokens**, which is about six paragraphs.

The transcript lives in `sessionStorage`, so it survives navigation between
pages and is gone when the tab closes. Nothing is stored server-side unless the
conversation produces a lead.

---

## Files

| File | What it does |
| --- | --- |
| `src/lib/assistant/config.ts` | Is a model configured? |
| `src/lib/assistant/knowledge.ts` | Compiles the knowledge digest from site content. |
| `src/lib/assistant/prompt.ts` | The system prompt and the lead sentinel. |
| `src/lib/assistant/provider.ts` | The streaming model call. The entire provider surface. |
| `src/lib/assistant/lead.ts` | Sentinel extraction and lead validation. |
| `src/app/api/assistant/route.ts` | The endpoint: validation, limits, streaming, lead handoff. |
| `src/components/assistant/assistant-panel.tsx` | The panel. |
| `src/components/assistant/rich-text.tsx` | Renders replies; turns bare paths into links. |
| `src/components/assistant/assistant-context.tsx` | Open state, so any page can start a conversation. |
| `src/components/layout/floating-contact.tsx` | The dock. |

### Moving to a different provider

`provider.ts` is the only file that knows about OpenAI, and it is one POST plus
an SSE parser — no SDK. Swapping to Anthropic, Azure, Bedrock or a self-hosted
model means rewriting `streamAssistant` to yield text deltas from that API.
Nothing else changes.

### Opening the assistant from anywhere

```tsx
'use client';
import { useAssistant } from '@/components/assistant/assistant-context';

const { openAssistant } = useAssistant();

// Pre-fills the composer without sending, so the visitor stays in control.
<button onClick={() => openAssistant('Can you cut steel beams to my drawings?')}>
  Ask about this product
</button>
```

---

## Testing without a key

`docs/` deliberately does not ship a stub, but the shape is small. Run any local
server that speaks the OpenAI SSE format, then:

```bash
OPENAI_API_KEY=anything OPENAI_BASE_URL=http://127.0.0.1:4310/v1 npm run build
OPENAI_API_KEY=anything OPENAI_BASE_URL=http://127.0.0.1:4310/v1 npm start
```

Each frame it needs to emit:

```
data: {"choices":[{"delta":{"content":"some text"}}]}

data: [DONE]

```

With no email transport configured, lead notifications print to the server
console — which is the fastest way to confirm the sentinel path end to end.
