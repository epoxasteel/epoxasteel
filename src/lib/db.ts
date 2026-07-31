import { PrismaClient } from '@prisma/client';

/**
 * Prisma is optional at runtime.
 *
 * The site is fully functional without a database — inquiries are still
 * validated and emailed. Persistence switches on the moment `DATABASE_URL` is
 * present, which means the first Railway deploy works before Postgres is
 * attached, and adding Postgres later needs no code change.
 */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL);

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

/**
 * Returns a client, or `null` when no database is configured.
 * Callers must handle `null` rather than assuming persistence is available.
 */
export function getPrisma(): PrismaClient | null {
  if (!isDatabaseConfigured) return null;

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }

  return globalForPrisma.prisma;
}

// In development, hot reload would otherwise open a new pool every save.
if (process.env.NODE_ENV !== 'production' && isDatabaseConfigured && !globalForPrisma.prisma) {
  globalForPrisma.prisma = createClient();
}
