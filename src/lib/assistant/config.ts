/**
 * Whether the AI assistant is switched on.
 *
 * ## Turning it on later
 *
 * The assistant ships complete and deliberately dark. To bring it live:
 *
 *   1. Set `OPENAI_API_KEY` to a real key.
 *   2. Set `AI_ENABLED=true`.
 *   3. Redeploy.
 *
 * That is the whole procedure — no code change, no migration, no rebuild of
 * anything but the app itself. Until then the dock still opens a panel; it says
 * the assistant is being prepared and offers the quote form and the contact page,
 * which is what somebody who opened it actually wanted.
 *
 * ## Why both variables
 *
 * Two conditions rather than one, because they answer different questions and
 * either alone gets it wrong. `AI_ENABLED` is the business decision — is the
 * assistant something we are offering customers yet. `OPENAI_API_KEY` is the
 * technical fact — can it answer. A key present with the flag off means somebody
 * is staging the credential ahead of launch, and the panel must stay in Coming
 * Soon. The flag on with no key would mean offering to answer and then failing,
 * which is worse than not offering; `lib/env.ts` refuses to start production in
 * that state rather than letting it reach a customer.
 *
 * ## Read at build time
 *
 * The root layout is statically prerendered, so this is evaluated when
 * `next build` runs, not per request. Railway exposes service variables to builds,
 * so setting both there is enough — and step 3 above is a redeploy for exactly
 * this reason. On a platform that only injects secrets at runtime, set
 * `NEXT_PUBLIC_ASSISTANT_ENABLED=1` as well: it is inlined at build and turns the
 * live panel on without the key ever entering the browser bundle. The API route
 * still refuses to answer without a real key, so that escape hatch cannot leak
 * anything or fake a working assistant.
 *
 * ## Server-only
 *
 * `OPENAI_API_KEY` has no `NEXT_PUBLIC_` prefix, so it is undefined in the
 * browser and this would report false there. Call it on the server and pass the
 * answer down as a prop.
 */
export function assistantConfigured() {
  if (process.env.NEXT_PUBLIC_ASSISTANT_ENABLED === '1') return true;
  if (process.env.AI_ENABLED !== 'true') return false;
  return Boolean(process.env.OPENAI_API_KEY);
}
