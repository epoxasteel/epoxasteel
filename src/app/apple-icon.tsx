import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon: the beam mark on the brand's darkest surface. */
export default async function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        background: '#0a0c0f',
      }}
    >
      <div style={{ display: 'flex', width: 108, height: 22, background: '#3a8ae0' }} />
      <div style={{ display: 'flex', width: 22, height: 58, background: '#e8edf4' }} />
      <div style={{ display: 'flex', width: 108, height: 22, background: '#3a8ae0' }} />
    </div>,
    { ...size },
  );
}
