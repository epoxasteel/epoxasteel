import type { ReactNode } from 'react';

/**
 * Artwork for the lifecycle sequence, plus the copy that goes with each stage.
 *
 * This module deliberately has no `'use client'` directive and is imported only
 * by a server component. The twelve scenes below are a few hundred SVG elements
 * of static markup — rendering them here puts that markup in the initial HTML
 * and keeps it out of the browser's JavaScript bundle. `Lifecycle` receives the
 * finished nodes as props and does nothing but animate between them.
 */

export type LifecycleStage = {
  title: string;
  caption: string;
  art: ReactNode;
};

/* -------------------------------------------------------------------------- */
/* Stage artwork                                                              */
/* -------------------------------------------------------------------------- */

function Frame({ children, tone = '#080b10' }: { children: React.ReactNode; tone?: string }) {
  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="size-full">
      <rect width="800" height="600" fill={tone} />
      {children}
    </svg>
  );
}

const LINE = 'rgba(190,206,224,0.42)';
const FAINT = 'rgba(190,206,224,0.14)';
const HOT = 'rgba(255,168,86,0.85)';
const ARC = 'rgba(96,168,240,0.85)';

function SkylineArt() {
  const bars = [40, 120, 175, 250, 330, 400, 470, 545, 620, 700];
  return (
    <Frame>
      <rect width="800" height="600" fill="url(#lc-sky)" />
      <defs>
        <linearGradient id="lc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070c14" />
          <stop offset="65%" stopColor="#0d1826" />
          <stop offset="100%" stopColor="#070a0f" />
        </linearGradient>
      </defs>
      <circle cx="580" cy="430" r="180" fill="rgba(40,102,170,0.12)" />
      {bars.map((x, index) => {
        const height = 120 + ((index * 67) % 260);
        return (
          <g key={x}>
            <rect x={x} y={500 - height} width={54} height={height} fill="rgba(178,196,216,0.09)" />
            <rect
              x={x}
              y={500 - height}
              width={54}
              height={height}
              fill="none"
              stroke={FAINT}
              strokeWidth="1"
            />
          </g>
        );
      })}
      <rect y="500" width="800" height="100" fill="rgba(5,7,10,0.9)" />
    </Frame>
  );
}

function BlueprintArt() {
  return (
    <Frame tone="#070b12">
      <g stroke={FAINT} strokeWidth="1">
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} />
        ))}
      </g>
      <g stroke={ARC} strokeWidth="2" fill="none">
        <rect x="180" y="140" width="440" height="320" />
        <line x1="180" y1="240" x2="620" y2="240" />
        <line x1="180" y1="340" x2="620" y2="340" />
        <line x1="400" y1="140" x2="400" y2="460" />
        <line x1="180" y1="140" x2="400" y2="240" />
        <line x1="620" y1="140" x2="400" y2="240" />
      </g>
      <g stroke={LINE} strokeWidth="1" strokeDasharray="6 5">
        <line x1="140" y1="140" x2="140" y2="460" />
        <line x1="130" y1="140" x2="150" y2="140" />
        <line x1="130" y1="460" x2="150" y2="460" />
        <line x1="180" y1="500" x2="620" y2="500" />
      </g>
      <g fill={LINE} fontSize="15" fontFamily="monospace">
        <text x="96" y="305">
          9600
        </text>
        <text x="380" y="524">
          13200
        </text>
      </g>
    </Frame>
  );
}

function FurnaceArt() {
  return (
    <Frame tone="#0a0705">
      <defs>
        <radialGradient id="lc-heat" cx="50%" cy="62%" r="52%">
          <stop offset="0%" stopColor="rgba(255,214,140,0.95)" />
          <stop offset="42%" stopColor="rgba(255,138,44,0.55)" />
          <stop offset="100%" stopColor="rgba(120,40,10,0)" />
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="#0a0806" />
      <ellipse cx="400" cy="380" rx="330" ry="200" fill="url(#lc-heat)" />
      <path d="M300 120 L340 340 H460 L500 120 Z" fill="rgba(24,18,14,0.9)" stroke={FAINT} />
      <path
        d="M370 340 Q400 430 400 500"
        stroke={HOT}
        strokeWidth="16"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M400 340 Q408 430 400 500"
        stroke="rgba(255,236,196,0.9)"
        strokeWidth="6"
        fill="none"
      />
      <ellipse cx="400" cy="505" rx="140" ry="26" fill="rgba(255,150,54,0.55)" />
      <ellipse cx="400" cy="505" rx="74" ry="13" fill="rgba(255,232,190,0.7)" />
      {[
        [250, 300],
        [520, 260],
        [560, 350],
        [230, 400],
        [600, 420],
      ].map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r={2 + (index % 3)} fill={HOT} opacity={0.75} />
      ))}
      <rect y="530" width="800" height="70" fill="rgba(5,4,3,0.92)" />
    </Frame>
  );
}

function CuttingArt() {
  return (
    <Frame>
      <rect x="90" y="180" width="620" height="290" fill="rgba(150,166,186,0.07)" stroke={FAINT} />
      <g stroke={LINE} strokeWidth="1.5" fill="none">
        <circle cx="250" cy="290" r="42" />
        <circle cx="420" cy="360" r="28" />
        <rect x="500" y="240" width="140" height="90" rx="6" />
        <path d="M150 400 h180 v50 h-180 Z" />
      </g>
      {/* Cutting head and beam */}
      <g>
        <rect x="392" y="70" width="36" height="120" fill="rgba(150,166,186,0.2)" stroke={FAINT} />
        <path d="M410 190 L410 360" stroke={ARC} strokeWidth="3" />
        <circle cx="410" cy="360" r="16" fill="rgba(120,190,255,0.28)" />
        <circle cx="410" cy="360" r="6" fill="rgba(220,240,255,0.95)" />
      </g>
      {/* Sparks */}
      {[
        [430, 372, 38, 30],
        [392, 376, -34, 26],
        [418, 380, 12, 44],
      ].map(([x, y, dx, dy], index) => (
        <line
          key={index}
          x1={x}
          y1={y}
          x2={x + dx}
          y2={y + dy}
          stroke={HOT}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity={0.8}
        />
      ))}
      <rect x="90" y="470" width="620" height="14" fill="rgba(10,14,20,0.9)" />
    </Frame>
  );
}

function WeldingArt() {
  return (
    <Frame tone="#070a0e">
      <defs>
        <radialGradient id="lc-arc" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(214,236,255,0.95)" />
          <stop offset="30%" stopColor="rgba(120,180,255,0.5)" />
          <stop offset="100%" stopColor="rgba(50,110,190,0)" />
        </radialGradient>
      </defs>
      <path d="M120 380 h560 v40 h-560 Z" fill="rgba(150,166,186,0.1)" stroke={FAINT} />
      <path d="M330 180 h140 v200 h-140 Z" fill="rgba(150,166,186,0.08)" stroke={FAINT} />
      <ellipse cx="400" cy="380" rx="220" ry="120" fill="url(#lc-arc)" opacity="0.55" />
      <path d="M470 250 L560 150" stroke={LINE} strokeWidth="8" strokeLinecap="round" />
      <circle cx="400" cy="380" r="14" fill="rgba(236,246,255,0.95)" />
      {Array.from({ length: 12 }).map((_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        return (
          <line
            key={index}
            x1={400}
            y1={380}
            x2={400 + Math.cos(angle) * (46 + (index % 4) * 18)}
            y2={380 + Math.sin(angle) * (34 + (index % 3) * 16)}
            stroke={HOT}
            strokeWidth="1.4"
            opacity={0.6}
            strokeLinecap="round"
          />
        );
      })}
    </Frame>
  );
}

function FabricationArt() {
  return (
    <Frame>
      <g stroke={FAINT} strokeWidth="1">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1="0" y1={60 * i + 40} x2="800" y2={60 * i + 40} />
        ))}
      </g>
      {/* I-beam in plan */}
      <g>
        <rect x="80" y="200" width="640" height="26" fill="rgba(178,196,216,0.16)" stroke={LINE} />
        <rect x="80" y="286" width="640" height="26" fill="rgba(178,196,216,0.16)" stroke={LINE} />
        <rect x="80" y="226" width="640" height="60" fill="rgba(150,166,186,0.07)" stroke={FAINT} />
      </g>
      {/* Bolt holes */}
      {[140, 200, 260, 560, 620, 680].map((x) => (
        <g key={x}>
          <circle cx={x} cy="213" r="7" fill="#080b10" stroke={ARC} strokeWidth="1.6" />
          <circle cx={x} cy="299" r="7" fill="#080b10" stroke={ARC} strokeWidth="1.6" />
        </g>
      ))}
      {/* End plate */}
      <rect x="700" y="180" width="24" height="152" fill="rgba(178,196,216,0.2)" stroke={LINE} />
      {/* Piece mark */}
      <g fill={LINE} fontFamily="monospace" fontSize="18">
        <text x="360" y="264">
          B-1204
        </text>
      </g>
      <g stroke={LINE} strokeWidth="1" strokeDasharray="5 4">
        <line x1="80" y1="380" x2="720" y2="380" />
        <line x1="80" y1="370" x2="80" y2="390" />
        <line x1="720" y1="370" x2="720" y2="390" />
      </g>
      <text x="368" y="410" fill={LINE} fontFamily="monospace" fontSize="15">
        12800
      </text>
    </Frame>
  );
}

function InspectionArt() {
  return (
    <Frame>
      <rect x="120" y="150" width="560" height="300" fill="rgba(150,166,186,0.06)" stroke={FAINT} />
      <g stroke={ARC} strokeWidth="1.6" fill="none">
        <circle cx="400" cy="300" r="96" />
        <circle cx="400" cy="300" r="60" />
        <line x1="284" y1="300" x2="516" y2="300" />
        <line x1="400" y1="184" x2="400" y2="416" />
      </g>
      {/* Ultrasonic trace */}
      <path
        d="M150 470 h60 l14 -46 l16 92 l14 -60 l20 34 l16 -20 h90 l14 -70 l18 118 l16 -80 l18 32 h240"
        stroke={ARC}
        strokeWidth="2"
        fill="none"
      />
      <g fill={LINE} fontFamily="monospace" fontSize="14">
        <text x="140" y="140">
          UT / WELD 412
        </text>
        <text x="560" y="140">
          PASS
        </text>
      </g>
      <rect x="548" y="122" width="72" height="24" fill="none" stroke="rgba(64,180,124,0.7)" />
    </Frame>
  );
}

function TransportArt() {
  return (
    <Frame>
      <rect y="430" width="800" height="170" fill="rgba(8,11,16,0.95)" />
      <g stroke={FAINT} strokeDasharray="26 22" strokeWidth="3">
        <line x1="0" y1="500" x2="800" y2="500" />
      </g>
      {/* Tractor unit */}
      <g fill="rgba(178,196,216,0.14)" stroke={LINE} strokeWidth="1.6">
        <path d="M110 380 h90 v-52 h58 l26 52 h20 v52 H110 Z" />
        <rect x="278" y="360" width="400" height="18" />
        <rect x="300" y="330" width="356" height="30" fill="rgba(150,166,186,0.1)" />
      </g>
      {/* Steel bundle */}
      <g stroke={LINE} strokeWidth="1.4" fill="rgba(178,196,216,0.18)">
        <rect x="310" y="300" width="340" height="14" />
        <rect x="310" y="314" width="340" height="14" />
        <rect x="330" y="286" width="300" height="14" />
      </g>
      <g stroke={ARC} strokeWidth="2">
        <line x1="380" y1="278" x2="380" y2="362" />
        <line x1="500" y1="278" x2="500" y2="362" />
        <line x1="610" y1="278" x2="610" y2="362" />
      </g>
      <g fill="rgba(8,11,16,1)" stroke={LINE} strokeWidth="2">
        <circle cx="172" cy="432" r="26" />
        <circle cx="470" cy="432" r="26" />
        <circle cx="540" cy="432" r="26" />
        <circle cx="610" cy="432" r="26" />
      </g>
      <circle cx="128" cy="352" r="6" fill={HOT} />
    </Frame>
  );
}

function SiteArt() {
  return (
    <Frame>
      <rect width="800" height="600" fill="#080c12" />
      {/* Crane */}
      <g stroke={LINE} strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M180 560 V120" />
        <path d="M168 560 V120 M192 560 V120" strokeWidth="1.2" opacity="0.7" />
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M168 ${560 - i * 32} L192 ${560 - (i + 1) * 32}`}
            strokeWidth="0.9"
            opacity="0.6"
          />
        ))}
        <path d="M100 120 H660" />
        <path d="M100 104 H660" strokeWidth="1.2" opacity="0.75" />
        <path d="M104 104 L180 60 L620 104" strokeWidth="1.4" opacity="0.85" />
        <path d="M520 120 V300" strokeWidth="1.2" />
      </g>
      {/* Load */}
      <g stroke={LINE} strokeWidth="1.6" fill="rgba(178,196,216,0.18)">
        <rect x="470" y="300" width="100" height="12" />
        <rect x="470" y="312" width="100" height="12" />
      </g>
      {/* Structure below */}
      <g stroke={FAINT} strokeWidth="2" fill="none">
        <rect x="320" y="380" width="380" height="180" />
        <line x1="320" y1="440" x2="700" y2="440" />
        <line x1="320" y1="500" x2="700" y2="500" />
        <line x1="450" y1="380" x2="450" y2="560" />
        <line x1="580" y1="380" x2="580" y2="560" />
      </g>
      <rect y="560" width="800" height="40" fill="rgba(5,7,10,0.95)" />
      <circle cx="640" cy="90" r="4" fill={HOT} opacity="0.9" />
    </Frame>
  );
}

function ErectionArt() {
  const columns = [140, 280, 420, 560, 700];
  const floors = [520, 430, 340, 250, 160];
  return (
    <Frame>
      <g stroke={LINE} strokeWidth="6" strokeLinecap="square">
        {columns.map((x) => (
          <line key={x} x1={x} y1="560" x2={x} y2="150" />
        ))}
      </g>
      <g stroke={LINE} strokeWidth="7">
        {floors.map((y, index) => (
          <line
            key={y}
            x1="140"
            y1={y}
            x2={index === 4 ? 420 : 700}
            y2={y}
            opacity={index === 4 ? 0.5 : 1}
          />
        ))}
      </g>
      <g stroke={ARC} strokeWidth="2.5" opacity="0.75">
        <line x1="280" y1="520" x2="420" y2="430" />
        <line x1="420" y1="520" x2="280" y2="430" />
        <line x1="560" y1="430" x2="700" y2="340" />
        <line x1="700" y1="430" x2="560" y2="340" />
      </g>
      <rect y="560" width="800" height="40" fill="rgba(5,7,10,0.95)" />
      {[
        [220, 505],
        [500, 415],
        [640, 325],
      ].map(([x, y], index) => (
        <circle key={index} cx={x} cy={y} r="5" fill={HOT} opacity="0.85" />
      ))}
    </Frame>
  );
}

function BuildingArt() {
  return (
    <Frame>
      <rect x="180" y="80" width="440" height="480" fill="rgba(150,166,186,0.08)" stroke={FAINT} />
      {Array.from({ length: 12 }).map((_, row) =>
        Array.from({ length: 9 }).map((_, column) => {
          const lit = (row * 7 + column * 3) % 5 < 2;
          return (
            <rect
              key={`${row}-${column}`}
              x={200 + column * 46}
              y={100 + row * 38}
              width={30}
              height={22}
              fill={lit ? 'rgba(180,208,244,0.28)' : 'rgba(150,166,186,0.06)'}
            />
          );
        }),
      )}
      <rect x="180" y="500" width="440" height="60" fill="rgba(10,14,20,0.85)" stroke={FAINT} />
      <rect y="560" width="800" height="40" fill="rgba(5,7,10,0.95)" />
      <ellipse cx="400" cy="560" rx="300" ry="40" fill="rgba(40,102,170,0.1)" />
    </Frame>
  );
}

function FinishedSkylineArt() {
  const towers = [30, 110, 190, 268, 350, 440, 520, 600, 690];
  return (
    <Frame>
      <defs>
        <linearGradient id="lc-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#060a11" />
          <stop offset="58%" stopColor="#122032" />
          <stop offset="86%" stopColor="#1d3149" />
          <stop offset="100%" stopColor="#0a0e14" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#lc-dawn)" />
      <circle cx="470" cy="470" r="150" fill="rgba(214,168,110,0.16)" />
      {towers.map((x, index) => {
        const height = 150 + ((index * 89) % 300);
        return (
          <g key={x}>
            <rect x={x} y={520 - height} width={62} height={height} fill="rgba(10,15,22,0.94)" />
            {Array.from({ length: Math.floor(height / 30) }).map((_, row) =>
              (row + index) % 3 === 0 ? (
                <rect
                  key={row}
                  x={x + 12}
                  y={520 - height + 16 + row * 30}
                  width={38}
                  height={9}
                  fill="rgba(186,212,246,0.24)"
                />
              ) : null,
            )}
          </g>
        );
      })}
      <rect y="520" width="800" height="80" fill="rgba(4,6,9,0.96)" />
    </Frame>
  );
}

export const lifecycleStages: LifecycleStage[] = [
  {
    title: 'Modern skyline',
    caption: 'A city decides to grow. Somewhere, a drawing becomes a commitment.',
    art: <SkylineArt />,
  },
  {
    title: 'Construction planning',
    caption: 'Loads resolved, sections sized, connections detailed. The steel package takes shape.',
    art: <BlueprintArt />,
  },
  {
    title: 'Steel manufacturing',
    caption:
      'Scrap becomes molten metal, molten metal becomes a heat with a number and a certificate.',
    art: <FurnaceArt />,
  },
  {
    title: 'Laser cutting',
    caption:
      'Geometry flows from the model to the machine — no transcription, no misread dimension.',
    art: <CuttingArt />,
  },
  {
    title: 'Welding',
    caption: 'Coded welders, qualified procedures, certified supervision. Every joint documented.',
    art: <WeldingArt />,
  },
  {
    title: 'Fabrication',
    caption: 'Drilled, coped, assembled and marked. What leaves the shop is ready to bolt up.',
    art: <FabricationArt />,
  },
  {
    title: 'Quality inspection',
    caption:
      'Dimensional check, weld inspection, coating thickness. Release is a gate, not a formality.',
    art: <InspectionArt />,
  },
  {
    title: 'Transportation',
    caption: 'Routes surveyed, permits secured, loads built in the order the crane will need them.',
    art: <TransportArt />,
  },
  {
    title: 'Construction site',
    caption: 'Trailer to crane hook. On the tightest sites, the steel never touches the ground.',
    art: <SiteArt />,
  },
  {
    title: 'Erection',
    caption: 'Bay by bay, floor by floor. A frame rises at the rate its material allows.',
    art: <ErectionArt />,
  },
  {
    title: 'Completed buildings',
    caption: 'Cladding, services, fit-out. The steel disappears behind everything it holds up.',
    art: <BuildingArt />,
  },
  {
    title: 'Finished skyline',
    caption: 'And the city is a little taller than it was. That is the whole job.',
    art: <FinishedSkylineArt />,
  },
];
