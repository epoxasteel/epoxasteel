import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * Home-screen icon: the beam mark on the brand's own page background.
 *
 * Proportions come straight from `<BeamMark />` — a 24-wide by 4.4-tall flange
 * and a 4.4 by 13.2 web in a 32 unit box — scaled up by 4.5, with the flanges
 * butted against the web exactly as they are drawn there.
 *
 * The web used to be white against blue flanges, and there was a 9px gap
 * splitting the three pieces apart. That made the home-screen icon a different
 * logo from the one in the header: a beam is one piece of rolled steel, so it is
 * one color and one shape.
 */
const UNIT = 4.5;

export default async function AppleIcon() {
  const flange = { display: 'flex', width: 24 * UNIT, height: 4.4 * UNIT, background: '#3a8ae0' };

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // `void` — the page background, so the icon matches the site it opens.
        background: '#060709',
      }}
    >
      <div style={flange} />
      <div
        style={{ display: 'flex', width: 4.4 * UNIT, height: 13.2 * UNIT, background: '#3a8ae0' }}
      />
      <div style={flange} />
    </div>,
    { ...size },
  );
}
