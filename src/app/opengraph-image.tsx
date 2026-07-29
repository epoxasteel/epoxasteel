import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const runtime = 'nodejs';
export const alt = `${siteConfig.name} — premium structural steel supply and fabrication`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The default social preview card, generated at build time.
 *
 * Deliberately typographic and drawn with layout primitives only — no external
 * fonts or images — so it renders identically everywhere and never fails a
 * build because an asset could not be fetched.
 */
export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(150deg, #060709 0%, #0d1420 52%, #08090c 100%)',
        padding: 72,
        position: 'relative',
      }}
    >
      {/* Engineering grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Accent glow */}
      <div
        style={{
          position: 'absolute',
          top: -160,
          right: -120,
          width: 620,
          height: 620,
          display: 'flex',
          borderRadius: 9999,
          background: 'radial-gradient(circle, rgba(28,98,174,0.32) 0%, rgba(28,98,174,0) 68%)',
        }}
      />

      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ display: 'flex', width: 54, height: 11, background: '#3a8ae0' }} />
          <div style={{ display: 'flex', width: 54, justifyContent: 'center' }}>
            <div style={{ display: 'flex', width: 11, height: 30, background: '#e8edf4' }} />
          </div>
          <div style={{ display: 'flex', width: 54, height: 11, background: '#3a8ae0' }} />
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: 10,
            color: '#f2f5f9',
          }}
        >
          EPOXA STEEL
        </div>
      </div>

      {/* Headline */}
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            fontSize: 88,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.02,
            color: '#f2f5f9',
          }}
        >
          Reinforce Your Dream.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 26,
            fontSize: 27,
            lineHeight: 1.45,
            color: '#98a3b0',
            maxWidth: 880,
          }}
        >
          Certified structural steel supply, fabrication and delivery for commercial, residential
          and infrastructure construction.
        </div>
      </div>

      {/* Footer strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #232a33',
          paddingTop: 26,
          position: 'relative',
        }}
      >
        <div style={{ display: 'flex', gap: 34, fontSize: 20, color: '#78828f' }}>
          <div style={{ display: 'flex' }}>Supply</div>
          <div style={{ display: 'flex' }}>Fabrication</div>
          <div style={{ display: 'flex' }}>Engineering</div>
          <div style={{ display: 'flex' }}>Delivery</div>
        </div>
        <div style={{ display: 'flex', fontSize: 22, color: '#3a8ae0', letterSpacing: 1 }}>
          {siteConfig.domain}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
