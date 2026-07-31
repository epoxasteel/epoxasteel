/**
 * Runs once, on the server, before the first request is served.
 *
 * The only thing here is the environment check — the point being that a
 * misconfigured deployment fails at boot with a readable reason, rather than
 * appearing healthy while every inquiry goes into a log nobody reads.
 */
export async function register() {
  const { validateEnv } = await import('@/lib/env');
  validateEnv();
}
