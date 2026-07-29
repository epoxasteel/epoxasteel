import { NextResponse } from 'next/server';
import { isDatabaseConfigured } from '@/lib/db';
import { emailProvider } from '@/lib/email';

/**
 * Health and configuration check.
 *
 * Railway can point a health check here. It intentionally reports *whether*
 * services are configured, never any credential or connection string.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: isDatabaseConfigured ? 'configured' : 'not configured (email-only mode)',
        email: emailProvider(),
      },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
