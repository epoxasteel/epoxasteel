/**
 * Whether the assistant has a model behind it.
 *
 * Its own module so that a server component can ask the question without pulling
 * in the provider — and through it the system prompt and the whole compiled
 * knowledge base — just to decide whether to render a button.
 *
 * ## Two things to know
 *
 * **This is read at build time.** The root layout is statically prerendered, so
 * whether the dock offers the enquiry desk is decided when `next build` runs,
 * not per request. Railway exposes service variables to builds, so setting
 * `OPENAI_API_KEY` there is enough. On a platform that only injects secrets at
 * runtime, set `NEXT_PUBLIC_ASSISTANT_ENABLED=1` as well — it is inlined at
 * build and turns the entrance on without the key ever being present in the
 * browser bundle. The route still refuses to answer without a real key, so this
 * cannot leak anything or fake a working assistant.
 *
 * **`OPENAI_API_KEY` is server-only.** It has no `NEXT_PUBLIC_` prefix, so it is
 * undefined in the browser and this would report false there. Call it on the
 * server and pass the answer down as a prop.
 */
export function assistantConfigured() {
  if (process.env.NEXT_PUBLIC_ASSISTANT_ENABLED === '1') return true;
  return Boolean(process.env.OPENAI_API_KEY);
}
