import type { Product } from './types';

/**
 * The steel catalogue. Grades, standards and dimension ranges follow common
 * ASTM/EN designations so the tables read correctly to an engineer; stock
 * ranges should be confirmed against live mill availability before publishing
 * any figure as a commitment.
 */
export const products: Product[] = [
  {
    slug: 'structural-steel',
    name: 'Structural Steel',
    category: 'Structural',
    tagline: 'The load-bearing backbone of modern construction.',
    summary:
      'Mill-certified structural sections supplied to ASTM and EN standards, cut to length and sequenced to your erection programme.',
    overview: [
      'Structural steel is where a drawing becomes a building. Every section we supply arrives with full mill traceability, tested chemistry and mechanical properties you can hand straight to your inspector — because the paperwork matters as much as the metal when a certificate of occupancy is on the line.',
      'We hold wide-flange, channel, angle and hollow section inventory across the most requested grades, and we buy directly from mills we have audited. That combination lets us commit to delivery dates on fast-track projects where a two-week float on steel is the difference between a bonus and a penalty.',
      'For projects with complex geometry, our fabrication division takes the same sections through cutting, coping, drilling and welding, so the material that leaves our facility is ready to bolt up rather than ready to rework.',
    ],
    keyFacts: [
      { label: 'Standards', value: 'ASTM A992 / A572 / A36, EN 10025 S355' },
      { label: 'Typical lead time', value: '5–15 working days from stock' },
      { label: 'Documentation', value: 'EN 10204 3.1 mill certificates' },
      { label: 'Processing', value: 'Cut to length, cambered, pre-drilled' },
    ],
    grades: ['ASTM A992', 'ASTM A572 Gr.50', 'ASTM A36', 'EN 10025-2 S275', 'EN 10025-2 S355'],
    standards: ['ASTM A6/A6M', 'EN 10034', 'AISC 360', 'CE marking to EN 1090'],
    finishes: ['Mill finish', 'Shot blast SA 2.5', 'Primed', 'Hot-dip galvanized', 'Intumescent'],
    applications: [
      'Multi-storey commercial frames',
      'Industrial portal frames',
      'Mezzanine and platform structures',
      'Stadium and long-span roofs',
      'Retrofit and strengthening works',
    ],
    industries: ['commercial', 'construction', 'infrastructure', 'industrial', 'warehousing'],
    dimensions: {
      title: 'Available section ranges',
      caption: 'Other sizes available to order. Confirm current stock with your account manager.',
      columns: ['Section type', 'Size range', 'Weight range', 'Standard lengths'],
      rows: [
        ['Wide flange (W)', 'W6×9 – W44×335', '9 – 335 lb/ft', '20, 30, 40, 60 ft'],
        ['European (IPE / HEA / HEB)', 'IPE 80 – HEB 1000', '6 – 314 kg/m', '6, 12, 15 m'],
        ['Channel (C / UPN)', 'C3×4.1 – C15×50', '4.1 – 50 lb/ft', '20, 40 ft'],
        ['Angle (L)', 'L2×2×1/8 – L8×8×1', '1.6 – 51 lb/ft', '20, 40 ft'],
        ['Tee (WT)', 'WT3 – WT18', '4.5 – 167 lb/ft', '20, 40 ft'],
      ],
    },
    downloads: [
      {
        label: 'Structural Sections Catalogue',
        description: 'Full dimensional data, section properties and weights.',
        size: '4.2 MB',
        format: 'PDF',
        href: '/downloads/epoxa-structural-sections.pdf',
      },
    ],
    related: ['steel-beams', 'steel-channels', 'steel-angles', 'custom-fabrication'],
    profile: 'i-beam',
    featured: true,
  },
  {
    slug: 'steel-beams',
    name: 'Steel Beams',
    category: 'Structural',
    tagline: 'Wide-flange and universal beams engineered for span.',
    summary:
      'W-shapes, universal beams and IPE sections in A992 and S355, held in depth so your frame is never waiting on a rolling window.',
    overview: [
      'Beams carry the floor, and the floor carries the schedule. We stock wide-flange sections in the sizes that specifications actually call for, which means most orders ship from inventory instead of waiting for the next mill rolling window.',
      'Every beam is supplied with heat-number traceability and can be cambered, cut, coped and pre-drilled to your connection details. For long-span work we source lengths up to 18 metres and coordinate transport permits as part of the delivery package.',
      'Where erection sequencing is critical, we deliver in shipping marks and bundle order defined by your steel erector — trailers arrive in the order the crane needs them, not the order the yard found them.',
    ],
    keyFacts: [
      { label: 'Depth range', value: '100 mm – 1,100 mm (W6 – W44)' },
      { label: 'Primary grade', value: 'ASTM A992 (Fy 50 ksi)' },
      { label: 'Camber', value: 'Available to ±1/8 in over span' },
      { label: 'Max length', value: '18 m with permitted transport' },
    ],
    grades: ['ASTM A992', 'ASTM A572 Gr.50', 'ASTM A36', 'EN 10025-2 S355JR', 'EN 10025-2 S355J2'],
    standards: ['ASTM A6/A6M', 'EN 10365', 'AISC Steel Construction Manual'],
    finishes: ['Mill finish', 'Blast and prime', 'Hot-dip galvanized to ASTM A123'],
    applications: [
      'Primary floor framing',
      'Transfer beams and headers',
      'Roof girders and purlins',
      'Crane runway beams',
      'Bridge stringers',
    ],
    industries: ['commercial', 'construction', 'bridges', 'warehousing', 'infrastructure'],
    dimensions: {
      title: 'Wide-flange beam sizes',
      caption: 'Imperial designations shown with nearest metric equivalents.',
      columns: ['Designation', 'Depth', 'Flange width', 'Weight', 'Availability'],
      rows: [
        ['W8×31', '203 mm', '203 mm', '46 kg/m', 'Stock'],
        ['W10×49', '254 mm', '254 mm', '73 kg/m', 'Stock'],
        ['W12×65', '305 mm', '305 mm', '97 kg/m', 'Stock'],
        ['W14×90', '356 mm', '368 mm', '134 kg/m', 'Stock'],
        ['W18×119', '478 mm', '283 mm', '177 kg/m', 'Stock'],
        ['W24×162', '622 mm', '328 mm', '241 kg/m', 'Indent'],
        ['W36×256', '927 mm', '423 mm', '381 kg/m', 'Indent'],
      ],
    },
    downloads: [
      {
        label: 'Beam Section Properties',
        description: 'Section modulus, moment of inertia and radius of gyration tables.',
        size: '1.8 MB',
        format: 'PDF',
        href: '/downloads/epoxa-beam-properties.pdf',
      },
    ],
    related: ['structural-steel', 'steel-channels', 'steel-plates', 'custom-fabrication'],
    profile: 'i-beam',
    featured: true,
  },
  {
    slug: 'steel-channels',
    name: 'Steel Channels',
    category: 'Structural',
    tagline: 'C-sections and UPN profiles for framing and support.',
    summary:
      'Hot-rolled channel in imperial and European profiles, ideal for bracing, purlins, edge beams and equipment frames.',
    overview: [
      'Channel sections earn their place wherever a flat back needs to sit against another surface — stair stringers, lintels, edge angles, machine bases and bracing runs. We carry both American Standard C-shapes and European UPN/UPE profiles so specifications drafted anywhere in the world can be filled without substitution requests.',
      'Because channel is so often used in repetitive assemblies, we process it in volume: batch cutting to fixed lengths, punching hole patterns and stamping piece marks so your fitters spend their time assembling rather than measuring.',
    ],
    keyFacts: [
      { label: 'Profiles', value: 'C, MC, UPN, UPE' },
      { label: 'Depth range', value: '50 mm – 400 mm' },
      { label: 'Processing', value: 'Batch cut, punched, marked' },
      { label: 'Typical lead time', value: '3–10 working days' },
    ],
    grades: ['ASTM A36', 'ASTM A572 Gr.50', 'EN 10025-2 S235JR', 'EN 10025-2 S355JR'],
    standards: ['ASTM A6/A6M', 'EN 10279', 'DIN 1026-1'],
    finishes: ['Mill finish', 'Primed', 'Hot-dip galvanized'],
    applications: [
      'Purlins and side rails',
      'Stair stringers',
      'Lintels over openings',
      'Equipment and skid frames',
      'Bracing and secondary steel',
    ],
    industries: ['construction', 'industrial', 'manufacturing', 'warehousing', 'agriculture'],
    dimensions: {
      title: 'Channel profiles',
      columns: ['Designation', 'Depth', 'Flange', 'Web thickness', 'Weight'],
      rows: [
        ['C4×5.4', '102 mm', '40 mm', '4.7 mm', '8.0 kg/m'],
        ['C6×8.2', '152 mm', '48 mm', '5.1 mm', '12.2 kg/m'],
        ['C8×11.5', '203 mm', '57 mm', '5.6 mm', '17.1 kg/m'],
        ['C10×15.3', '254 mm', '66 mm', '6.1 mm', '22.8 kg/m'],
        ['UPN 200', '200 mm', '75 mm', '8.5 mm', '25.3 kg/m'],
        ['UPN 300', '300 mm', '100 mm', '10.0 mm', '46.2 kg/m'],
      ],
    },
    downloads: [
      {
        label: 'Channel Profile Data',
        description: 'Dimensions and section properties for C, MC, UPN and UPE.',
        size: '1.2 MB',
        format: 'PDF',
        href: '/downloads/epoxa-channel-profiles.pdf',
      },
    ],
    related: ['steel-angles', 'structural-steel', 'steel-beams'],
    profile: 'channel',
  },
  {
    slug: 'steel-angles',
    name: 'Steel Angles',
    category: 'Structural',
    tagline: 'Equal and unequal leg angle for bracing and connection.',
    summary:
      'Hot-rolled angle in a full range of leg sizes and thicknesses — the connection detail that holds every frame together.',
    overview: [
      'Angle is the quiet workhorse of structural steel. It braces frames, forms connection cleats, trims openings, carries masonry and protects corners. We stock equal and unequal leg angle across the full thickness range so a designer never has to round up to the next available size and carry the weight penalty.',
      'Short-run and cut-to-length orders are handled the same day for stocked sizes, which matters when a site discovers a missing cleat at 3pm and needs it before the next pour.',
    ],
    keyFacts: [
      { label: 'Leg range', value: '25 mm – 200 mm' },
      { label: 'Thickness', value: '3 mm – 25 mm' },
      { label: 'Configuration', value: 'Equal and unequal leg' },
      { label: 'Same-day cutting', value: 'Stocked sizes, orders before 14:00' },
    ],
    grades: ['ASTM A36', 'ASTM A572 Gr.50', 'EN 10025-2 S235JR', 'EN 10025-2 S355JR'],
    standards: ['ASTM A6/A6M', 'EN 10056-1', 'EN 10056-2'],
    finishes: ['Mill finish', 'Primed', 'Hot-dip galvanized', 'Powder coated'],
    applications: [
      'Cross bracing and wind girts',
      'Connection cleats and gussets',
      'Masonry support angles',
      'Frame and rack construction',
      'Edge protection and trim',
    ],
    industries: ['construction', 'commercial', 'industrial', 'agriculture', 'manufacturing'],
    dimensions: {
      title: 'Angle sizes',
      columns: ['Size', 'Thickness range', 'Weight range', 'Type'],
      rows: [
        ['L25×25', '3 – 5 mm', '1.1 – 1.8 kg/m', 'Equal'],
        ['L50×50', '4 – 8 mm', '3.1 – 5.8 kg/m', 'Equal'],
        ['L75×75', '5 – 10 mm', '5.8 – 11.0 kg/m', 'Equal'],
        ['L100×100', '6 – 14 mm', '9.3 – 21.0 kg/m', 'Equal'],
        ['L150×150', '10 – 20 mm', '23.0 – 44.0 kg/m', 'Equal'],
        ['L100×75', '8 – 12 mm', '10.6 – 15.4 kg/m', 'Unequal'],
        ['L150×90', '10 – 15 mm', '17.8 – 26.6 kg/m', 'Unequal'],
      ],
    },
    downloads: [
      {
        label: 'Angle Size Chart',
        description: 'Equal and unequal leg dimensions with section properties.',
        size: '980 KB',
        format: 'PDF',
        href: '/downloads/epoxa-angle-chart.pdf',
      },
    ],
    related: ['steel-channels', 'steel-bars', 'structural-steel'],
    profile: 'angle',
  },
  {
    slug: 'steel-plates',
    name: 'Steel Plates',
    category: 'Flat Products',
    tagline: 'Heavy plate for base plates, gussets and wear surfaces.',
    summary:
      'Hot-rolled plate from 5 mm to 200 mm in structural, pressure vessel and abrasion-resistant grades, profiled to your DXF.',
    overview: [
      'Plate is where structural steel meets precision. Base plates, splice plates, gussets, stiffeners and shear tabs all begin as a flat sheet and end as a part that must fit within millimetres. Our profiling floor runs CNC plasma and oxy-fuel for heavy sections and high-definition laser for fine work, all driven straight from your DXF or DSTV files.',
      'We carry structural grades for everyday connection work, pressure-vessel grades for tanks and vessels, and abrasion-resistant plate for chutes, liners and buckets. Where a project needs certified flatness or through-thickness properties, we source plate with the required Z-grade testing and supply the documentation to prove it.',
    ],
    keyFacts: [
      { label: 'Thickness', value: '5 mm – 200 mm' },
      { label: 'Max plate size', value: '3,000 × 12,000 mm' },
      { label: 'Cutting tolerance', value: '±0.5 mm (laser), ±1.5 mm (plasma)' },
      { label: 'File formats', value: 'DXF, DWG, DSTV, STEP' },
    ],
    grades: [
      'ASTM A36',
      'ASTM A572 Gr.50',
      'ASTM A516 Gr.70',
      'EN 10025-2 S355J2+N',
      'AR400 / AR500',
    ],
    standards: ['ASTM A6/A6M', 'EN 10029', 'EN 10160 (ultrasonic)', 'ASTM A20'],
    finishes: ['As rolled', 'Normalized', 'Shot blast and prime', 'Hot-dip galvanized'],
    applications: [
      'Column base plates and cap plates',
      'Gussets, stiffeners and shear tabs',
      'Storage tank shells and floors',
      'Wear liners and chute plate',
      'Bridge girder webs and flanges',
    ],
    industries: ['construction', 'industrial', 'energy', 'bridges', 'manufacturing'],
    dimensions: {
      title: 'Plate thickness and format',
      caption: 'Larger formats available to order; cut-to-size from stock is standard.',
      columns: ['Thickness', 'Common widths', 'Common lengths', 'Typical use'],
      rows: [
        ['5 – 10 mm', '1,500 / 2,000 mm', '6,000 mm', 'Gussets, cleats'],
        ['12 – 20 mm', '2,000 / 2,500 mm', '6,000 / 12,000 mm', 'Base plates'],
        ['25 – 40 mm', '2,500 mm', '12,000 mm', 'Heavy connections'],
        ['50 – 80 mm', '2,500 / 3,000 mm', '12,000 mm', 'Transfer nodes'],
        ['100 – 200 mm', '3,000 mm', '6,000 / 12,000 mm', 'Machine bases'],
      ],
    },
    downloads: [
      {
        label: 'Plate Grade Guide',
        description: 'Chemistry, mechanical properties and selection notes by grade.',
        size: '2.6 MB',
        format: 'PDF',
        href: '/downloads/epoxa-plate-grades.pdf',
      },
    ],
    related: ['steel-sheets', 'custom-fabrication', 'structural-steel'],
    profile: 'plate',
    featured: true,
  },
  {
    slug: 'steel-sheets',
    name: 'Steel Sheets',
    category: 'Flat Products',
    tagline: 'Cold and hot-rolled sheet for cladding, decking and enclosures.',
    summary:
      'Sheet stock from 0.5 mm to 6 mm in hot-rolled, cold-rolled and pre-coated finishes, slit and blanked to size.',
    overview: [
      'Sheet is the skin of a building and the body of a machine. We supply hot-rolled sheet for structural decking and general fabrication, cold-rolled for close-tolerance forming work, and pre-coated coil for cladding and roofing where finish quality is visible in the completed project.',
      'Slitting, blanking and levelling are handled in-house, so material arrives flat, square and in the exact blank size your press or folder expects — which removes the scrap and the second handling that eat margin on sheet metal work.',
    ],
    keyFacts: [
      { label: 'Thickness', value: '0.5 mm – 6.0 mm' },
      { label: 'Coil width', value: 'Up to 1,850 mm' },
      { label: 'Processing', value: 'Slit, blank, level, shear' },
      { label: 'Flatness', value: 'Precision levelled on request' },
    ],
    grades: [
      'ASTM A1011 CS',
      'ASTM A1008 CS',
      'EN 10130 DC01',
      'EN 10346 DX51D+Z',
      'EN 10025 S280GD',
    ],
    standards: ['EN 10131', 'EN 10051', 'ASTM A568'],
    finishes: ['Hot-rolled pickled & oiled', 'Cold-rolled matt', 'Galvanized', 'Pre-painted PPGI'],
    applications: [
      'Composite floor decking',
      'Wall and roof cladding',
      'Ductwork and enclosures',
      'Machine guarding and panels',
      'Formed and pressed components',
    ],
    industries: ['construction', 'commercial', 'manufacturing', 'warehousing', 'agriculture'],
    dimensions: {
      title: 'Sheet formats',
      columns: ['Type', 'Thickness', 'Standard sheet size', 'Coil availability'],
      rows: [
        ['Hot-rolled', '1.5 – 6.0 mm', '1,500 × 3,000 mm', 'Yes'],
        ['Cold-rolled', '0.5 – 3.0 mm', '1,250 × 2,500 mm', 'Yes'],
        ['Galvanized', '0.5 – 3.0 mm', '1,250 × 2,500 mm', 'Yes'],
        ['Pre-painted', '0.4 – 1.2 mm', '1,220 × 2,440 mm', 'Yes'],
      ],
    },
    downloads: [
      {
        label: 'Sheet & Coil Specification',
        description: 'Grades, tolerances, coating weights and colour range.',
        size: '3.1 MB',
        format: 'PDF',
        href: '/downloads/epoxa-sheet-coil.pdf',
      },
    ],
    related: ['steel-plates', 'galvanized-steel', 'stainless-steel'],
    profile: 'sheet',
  },
  {
    slug: 'steel-tubes',
    name: 'Steel Tubes',
    category: 'Hollow Sections',
    tagline: 'Square and rectangular hollow sections with clean lines.',
    summary:
      'Cold-formed and hot-finished SHS and RHS for exposed structures, frames and architectural steelwork.',
    overview: [
      'Hollow sections give designers strength in every direction and a finished edge that needs no cladding. We stock square and rectangular tube across the full size range, in both cold-formed and hot-finished condition, including grades suited to architecturally exposed structural steel where the weld and the corner radius are part of the design.',
      'For visible steelwork we can supply matched heat numbers across a bay so colour and surface texture stay consistent after blasting and coating — a detail that separates a considered building from a compromised one.',
    ],
    keyFacts: [
      { label: 'Sizes', value: '20×20 mm – 500×500 mm SHS' },
      { label: 'Wall thickness', value: '1.5 mm – 20 mm' },
      { label: 'Condition', value: 'Cold-formed and hot-finished' },
      { label: 'AESS', value: 'Matched-heat supply available' },
    ],
    grades: ['ASTM A500 Gr.B', 'ASTM A500 Gr.C', 'EN 10219 S355J2H', 'EN 10210 S355J2H'],
    standards: ['ASTM A500', 'EN 10219-2', 'EN 10210-2'],
    finishes: [
      'Mill finish',
      'Shot blast',
      'Primed',
      'Hot-dip galvanized',
      'Architectural coating',
    ],
    applications: [
      'Exposed structural frames',
      'Canopies and entrance structures',
      'Trusses and space frames',
      'Handrails and balustrades',
      'Equipment and conveyor frames',
    ],
    industries: ['commercial', 'construction', 'transportation', 'industrial', 'residential'],
    dimensions: {
      title: 'Hollow section range',
      columns: ['Profile', 'Size range', 'Wall thickness', 'Standard length'],
      rows: [
        ['SHS', '20×20 – 500×500 mm', '1.5 – 20 mm', '6 / 12 m'],
        ['RHS', '40×20 – 500×300 mm', '1.5 – 20 mm', '6 / 12 m'],
        ['CHS', '21.3 – 508 mm OD', '2.0 – 25 mm', '6 / 12 m'],
      ],
    },
    downloads: [
      {
        label: 'Hollow Section Data',
        description: 'Dimensions, properties and capacity tables for SHS, RHS and CHS.',
        size: '2.9 MB',
        format: 'PDF',
        href: '/downloads/epoxa-hollow-sections.pdf',
      },
    ],
    related: ['steel-pipes', 'structural-steel', 'custom-fabrication'],
    profile: 'square-tube',
    featured: true,
  },
  {
    slug: 'steel-pipes',
    name: 'Steel Pipes',
    category: 'Hollow Sections',
    tagline: 'Line pipe, structural pipe and casing to pressure standards.',
    summary:
      'Seamless and welded pipe for structural, conveyance and pressure duty, with NDT documentation and coating options.',
    overview: [
      'Pipe carries loads and it carries contents, and the two duties demand different evidence. We supply structural pipe for columns, piles and frames, and pressure-rated line pipe for conveyance — each with the testing regime its service requires, from hydrostatic test reports to full ultrasonic and radiographic records.',
      'Coating and lining are handled through our qualified partners: fusion-bonded epoxy, three-layer polyethylene, cement mortar lining and galvanizing are all available with inspection release documentation.',
    ],
    keyFacts: [
      { label: 'Outside diameter', value: '21.3 mm – 1,220 mm' },
      { label: 'Manufacture', value: 'Seamless, ERW, SAW' },
      { label: 'Testing', value: 'Hydrostatic, UT, RT on request' },
      { label: 'Coatings', value: 'FBE, 3LPE, galvanized, lined' },
    ],
    grades: ['ASTM A53 Gr.B', 'ASTM A106 Gr.B', 'API 5L Gr.B / X42 / X52', 'ASTM A252 Gr.3'],
    standards: ['ASTM A53', 'ASTM A106', 'API 5L', 'EN 10217', 'EN 10255'],
    finishes: ['Black', 'Galvanized', 'FBE coated', '3LPE coated', 'Cement lined'],
    applications: [
      'Structural columns and piles',
      'Water and process pipelines',
      'Fire protection mains',
      'Micro-piling and foundations',
      'Scaffold and temporary works',
    ],
    industries: ['infrastructure', 'energy', 'industrial', 'construction', 'government-projects'],
    dimensions: {
      title: 'Pipe schedule availability',
      columns: ['Nominal size', 'OD', 'SCH 40 wall', 'SCH 80 wall', 'Type'],
      rows: [
        ['DN50 (2")', '60.3 mm', '3.91 mm', '5.54 mm', 'ERW / Seamless'],
        ['DN100 (4")', '114.3 mm', '6.02 mm', '8.56 mm', 'ERW / Seamless'],
        ['DN150 (6")', '168.3 mm', '7.11 mm', '10.97 mm', 'ERW / Seamless'],
        ['DN250 (10")', '273.1 mm', '9.27 mm', '15.09 mm', 'ERW / SAW'],
        ['DN400 (16")', '406.4 mm', '9.53 mm', '21.44 mm', 'SAW'],
        ['DN600 (24")', '610.0 mm', '9.53 mm', '24.61 mm', 'SAW'],
      ],
    },
    downloads: [
      {
        label: 'Pipe Schedule Chart',
        description: 'Wall thickness and weight by nominal bore and schedule.',
        size: '1.4 MB',
        format: 'PDF',
        href: '/downloads/epoxa-pipe-schedule.pdf',
      },
    ],
    related: ['steel-tubes', 'galvanized-steel', 'structural-steel'],
    profile: 'pipe',
  },
  {
    slug: 'steel-bars',
    name: 'Steel Bars',
    category: 'Bar & Reinforcement',
    tagline: 'Round, square, flat and hexagonal bar stock.',
    summary:
      'Hot-rolled and bright-drawn bar in carbon and alloy grades for machining, forging and general engineering.',
    overview: [
      'Bar stock is the raw material of everything that gets machined, forged or welded into a bespoke part. We hold round, square, flat and hexagonal bar in carbon, free-cutting and alloy grades, in both hot-rolled and bright-drawn condition.',
      'Bright bar is supplied to close diametric tolerance with a clean surface, ready for turning without a roughing pass. Heavier hot-rolled bar is available cut to billet length for forging and heavy fabrication.',
    ],
    keyFacts: [
      { label: 'Round bar', value: '6 mm – 300 mm diameter' },
      { label: 'Flat bar', value: '20×3 mm – 300×50 mm' },
      { label: 'Condition', value: 'Hot-rolled, bright-drawn, peeled' },
      { label: 'Cutting', value: 'Bandsaw cut to ±1 mm' },
    ],
    grades: ['ASTM A36', 'AISI 1018', 'AISI 1045', 'AISI 4140', 'EN 10277 S355J2C'],
    standards: ['EN 10060', 'EN 10058', 'EN 10059', 'ASTM A29'],
    finishes: ['Hot-rolled black', 'Bright-drawn', 'Peeled and polished', 'Chrome-plated'],
    applications: [
      'Machined components and shafts',
      'Anchor bolts and tie rods',
      'Forged fittings',
      'Base frames and supports',
      'Handrail and balustrade infill',
    ],
    industries: ['manufacturing', 'industrial', 'construction', 'energy', 'agriculture'],
    dimensions: {
      title: 'Bar profiles and sizes',
      columns: ['Profile', 'Size range', 'Condition', 'Standard length'],
      rows: [
        ['Round', '6 – 300 mm dia.', 'HR / Bright', '3 / 6 m'],
        ['Square', '10 – 100 mm', 'HR / Bright', '3 / 6 m'],
        ['Flat', '20×3 – 300×50 mm', 'HR', '6 m'],
        ['Hexagonal', '8 – 75 mm A/F', 'Bright', '3 m'],
      ],
    },
    downloads: [
      {
        label: 'Bar Stock Reference',
        description: 'Sizes, tolerances and grade selection guidance.',
        size: '1.1 MB',
        format: 'PDF',
        href: '/downloads/epoxa-bar-stock.pdf',
      },
    ],
    related: ['reinforcing-steel', 'steel-angles', 'stainless-steel'],
    profile: 'round-bar',
  },
  {
    slug: 'reinforcing-steel',
    name: 'Reinforcing Steel',
    category: 'Bar & Reinforcement',
    tagline: 'Rebar, mesh and cut-and-bent schedules, delivered to pour.',
    summary:
      'Deformed reinforcing bar, welded mesh and made-to-schedule cut-and-bent assemblies sequenced to your concrete programme.',
    overview: [
      'Concrete only works because of what is inside it. We supply deformed reinforcing bar from Ø8 to Ø40, welded wire mesh in standard and bespoke sheet sizes, and full cut-and-bent schedules produced directly from your bar bending schedules.',
      'Cut-and-bent reinforcement arrives tagged by pour, bundled by location and delivered in the order the site needs it, which removes the sorting time that quietly consumes a rebar gang. Every bundle carries a tag traceable to a mill certificate and a bending schedule line.',
      'We also supply couplers, spacers, chairs and tying wire, so the reinforcement package arrives as one coordinated delivery instead of five partial ones.',
    ],
    keyFacts: [
      { label: 'Bar diameter', value: 'Ø8 – Ø40 mm (#3 – #14)' },
      { label: 'Grades', value: 'Gr.60, Gr.80, B500B, B500C' },
      { label: 'Bending tolerance', value: 'To BS 8666 / ACI 117' },
      { label: 'Delivery', value: 'Tagged and sequenced by pour' },
    ],
    grades: ['ASTM A615 Gr.60', 'ASTM A706 Gr.60', 'EN 10080 B500B', 'EN 10080 B500C'],
    standards: ['ASTM A615/A706', 'EN 10080', 'BS 8666', 'ACI 318'],
    finishes: ['Black', 'Epoxy coated', 'Galvanized', 'Stainless (duplex)'],
    applications: [
      'Foundations, rafts and pile caps',
      'Suspended slabs and beams',
      'Retaining walls and cores',
      'Bridge decks and abutments',
      'Precast concrete elements',
    ],
    industries: ['construction', 'infrastructure', 'bridges', 'residential', 'government-projects'],
    dimensions: {
      title: 'Rebar sizes',
      columns: ['Metric', 'Imperial', 'Nominal dia.', 'Cross-section', 'Weight'],
      rows: [
        ['Ø10', '#3', '9.5 mm', '71 mm²', '0.56 kg/m'],
        ['Ø12', '#4', '12.7 mm', '129 mm²', '0.99 kg/m'],
        ['Ø16', '#5', '15.9 mm', '199 mm²', '1.55 kg/m'],
        ['Ø20', '#6', '19.1 mm', '284 mm²', '2.24 kg/m'],
        ['Ø25', '#8', '25.4 mm', '510 mm²', '3.98 kg/m'],
        ['Ø32', '#10', '32.3 mm', '819 mm²', '6.40 kg/m'],
        ['Ø40', '#14', '43.0 mm', '1,452 mm²', '11.38 kg/m'],
      ],
    },
    downloads: [
      {
        label: 'Rebar & Mesh Guide',
        description: 'Bar sizes, mesh types, lap lengths and bending shape codes.',
        size: '3.4 MB',
        format: 'PDF',
        href: '/downloads/epoxa-rebar-guide.pdf',
      },
    ],
    related: ['steel-bars', 'structural-steel', 'galvanized-steel'],
    profile: 'rebar',
    featured: true,
  },
  {
    slug: 'galvanized-steel',
    name: 'Galvanized Steel',
    category: 'Coated & Stainless',
    tagline: 'Zinc protection measured in decades, not seasons.',
    summary:
      'Hot-dip galvanized sections, plate, sheet and fabrications with certified coating thickness to ASTM A123 and ISO 1461.',
    overview: [
      'Galvanizing is the most reliable corrosion protection available for structural steel, and its economics improve the longer a structure stands. A properly specified hot-dip coating delivers decades of maintenance-free service in most atmospheric environments.',
      'We galvanize sections, plate, fabricated assemblies and reinforcement through kettles long enough to take full-length beams in a single dip — avoiding the double-dip line that spoils the appearance of exposed steelwork. Coating thickness is verified and reported against the applicable standard on every batch.',
      'Design guidance is part of the service: vent and drain hole placement, distortion control and the treatment of faying surfaces all affect the outcome, and we review drawings before galvanizing rather than after.',
    ],
    keyFacts: [
      { label: 'Coating standard', value: 'ASTM A123 / ISO 1461' },
      { label: 'Typical thickness', value: '85 – 140 µm by section' },
      { label: 'Max single-dip length', value: '15.5 m' },
      { label: 'Expected life', value: '50+ years, C3 environment' },
    ],
    grades: ['ASTM A123 (fabricated)', 'ASTM A153 (fasteners)', 'EN 10346 DX51D+Z', 'ISO 1461'],
    standards: ['ASTM A123', 'ASTM A153', 'ISO 1461', 'ISO 14713'],
    finishes: ['Bright spangle', 'Matt grey', 'Duplex (galv + paint)', 'Passivated'],
    applications: [
      'External structural frames',
      'Coastal and marine structures',
      'Bridge parapets and furniture',
      'Agricultural buildings',
      'Access platforms and walkways',
    ],
    industries: ['infrastructure', 'bridges', 'agriculture', 'energy', 'transportation'],
    dimensions: {
      title: 'Coating thickness by steel thickness',
      caption: 'Minimum average coating thickness per ISO 1461 for articles not centrifuged.',
      columns: ['Steel thickness', 'Min. local coating', 'Min. mean coating', 'Typical life (C3)'],
      rows: [
        ['< 1.5 mm', '35 µm', '45 µm', '20 – 30 years'],
        ['1.5 – 3 mm', '45 µm', '55 µm', '25 – 40 years'],
        ['3 – 6 mm', '55 µm', '70 µm', '35 – 50 years'],
        ['> 6 mm', '70 µm', '85 µm', '50+ years'],
      ],
    },
    downloads: [
      {
        label: 'Galvanizing Design Guide',
        description: 'Vent hole sizing, distortion control and drawing checklist.',
        size: '2.2 MB',
        format: 'PDF',
        href: '/downloads/epoxa-galvanizing-guide.pdf',
      },
    ],
    related: ['structural-steel', 'steel-sheets', 'reinforcing-steel'],
    profile: 'galvanized',
  },
  {
    slug: 'stainless-steel',
    name: 'Stainless Steel',
    category: 'Coated & Stainless',
    tagline: 'Austenitic and duplex grades for corrosive service.',
    summary:
      'Stainless plate, sheet, bar, tube and sections in 304, 316 and duplex grades with architectural and process finishes.',
    overview: [
      'Where chlorides, chemicals, hygiene requirements or a hundred-year design life rule out coated carbon steel, stainless is the answer. We supply the austenitic workhorses — 304/304L and 316/316L — alongside duplex grades that offer roughly twice the strength at lower nickel content.',
      'Architectural work is handled with care: we control finish direction, protect surfaces through fabrication and transport, and keep stainless processing physically separated from carbon steel to prevent iron contamination that would show as rust bleed months after handover.',
    ],
    keyFacts: [
      { label: 'Common grades', value: '304/304L, 316/316L, 2205 duplex' },
      { label: 'Products', value: 'Plate, sheet, bar, tube, angle' },
      { label: 'Finishes', value: '2B, No.4 brushed, mirror, bead blast' },
      { label: 'Segregation', value: 'Dedicated stainless processing area' },
    ],
    grades: [
      'ASTM A240 304/304L',
      'ASTM A240 316/316L',
      'ASTM A240 2205',
      'EN 1.4301',
      'EN 1.4404',
    ],
    standards: ['ASTM A240', 'ASTM A276', 'ASTM A554', 'EN 10088-2'],
    finishes: ['2B mill', 'No.4 brushed', 'No.8 mirror', 'Bead blast', 'Electropolished'],
    applications: [
      'Architectural façades and cladding',
      'Balustrades and handrails',
      'Food and pharmaceutical process plant',
      'Coastal and marine structures',
      'Water treatment equipment',
    ],
    industries: ['commercial', 'industrial', 'manufacturing', 'infrastructure', 'energy'],
    dimensions: {
      title: 'Stainless product availability',
      columns: ['Product', 'Size range', 'Grades', 'Finish options'],
      rows: [
        ['Sheet', '0.5 – 3.0 mm', '304, 316', '2B, No.4, mirror'],
        ['Plate', '3 – 60 mm', '304L, 316L, 2205', 'Hot-rolled, pickled'],
        ['Round bar', '6 – 200 mm', '304, 316, 2205', 'Bright, peeled'],
        ['Tube', '12 – 168 mm OD', '304, 316', 'Polished, mill'],
        ['Angle', '25×25 – 100×100 mm', '304, 316', 'Pickled'],
      ],
    },
    downloads: [
      {
        label: 'Stainless Grade Selector',
        description: 'Corrosion resistance, strength and cost comparison by grade.',
        size: '1.9 MB',
        format: 'PDF',
        href: '/downloads/epoxa-stainless-selector.pdf',
      },
    ],
    related: ['steel-sheets', 'steel-plates', 'steel-bars'],
    profile: 'stainless',
  },
  {
    slug: 'custom-fabrication',
    name: 'Custom Fabrication',
    category: 'Fabrication',
    tagline: 'From model to erected steel, under one certificate.',
    summary:
      'Full-service fabrication — cutting, drilling, coping, welding, blasting and coating — delivered erection-ready and sequenced.',
    overview: [
      'Buying steel and buying a fabricated structure are different purchases. Fabrication is where tolerances, weld procedures, inspection and sequencing determine whether a frame goes up in a week or fights you for a month.',
      'Our shop runs CNC beam lines, plasma and laser profiling, robotic and manual welding to qualified procedures, automated blasting and a controlled coating bay. Certified welding supervision and third-party inspection are available on every job, and we issue a single set of release documentation covering material, welding and coating.',
      'Detailing is supported directly from Tekla, Advance Steel and SDS/2 models. We take your model, resolve fabrication-level detail, and return approved shop drawings — so the geometry that leaves the office is the geometry that arrives on site.',
    ],
    keyFacts: [
      { label: 'Capacity', value: '850 tonnes per month' },
      { label: 'Welding', value: 'Qualified to AWS D1.1 / EN ISO 3834-2' },
      { label: 'Execution class', value: 'EXC1 – EXC3 to EN 1090-2' },
      { label: 'Model formats', value: 'Tekla, Advance Steel, SDS/2, IFC' },
    ],
    grades: ['Carbon steel', 'Weathering steel', 'Stainless steel', 'Aluminium (by arrangement)'],
    standards: ['AWS D1.1', 'EN 1090-2', 'EN ISO 3834-2', 'AISC 303'],
    finishes: ['Blast SA 2.5', 'Zinc primer', 'Epoxy system', 'Polyurethane topcoat', 'Galvanized'],
    applications: [
      'Structural frames and connections',
      'Stairs, platforms and walkways',
      'Architecturally exposed steelwork',
      'Plant structures and pipe racks',
      'Bespoke brackets and assemblies',
    ],
    industries: ['commercial', 'industrial', 'infrastructure', 'energy', 'manufacturing'],
    dimensions: {
      title: 'Fabrication capability',
      columns: ['Process', 'Capacity', 'Tolerance', 'Notes'],
      rows: [
        ['CNC beam line', 'Up to 1,100 mm depth', '±1.0 mm', 'Drill, saw, mark'],
        ['Plasma profiling', 'Up to 60 mm plate', '±1.5 mm', '3,000 × 12,000 mm bed'],
        ['Laser profiling', 'Up to 25 mm plate', '±0.5 mm', 'Fibre laser'],
        ['Press brake', '640 tonne, 6 m', '±0.5°', 'CNC back gauge'],
        ['Blast & paint', '1.6 × 12 m throughput', 'DFT verified', 'Climate controlled'],
      ],
    },
    downloads: [
      {
        label: 'Fabrication Capability Statement',
        description: 'Equipment list, certifications, quality plan and references.',
        size: '5.6 MB',
        format: 'PDF',
        href: '/downloads/epoxa-fabrication-capability.pdf',
      },
    ],
    related: ['structural-steel', 'steel-plates', 'steel-beams', 'steel-tubes'],
    profile: 'fabrication',
    featured: true,
  },
];

export const productCategories = [
  'Structural',
  'Flat Products',
  'Hollow Sections',
  'Bar & Reinforcement',
  'Coated & Stainless',
  'Fabrication',
] as const;

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts() {
  return products.filter((product) => product.featured);
}

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export function getRelatedProducts(slug: string) {
  const product = getProduct(slug);
  if (!product) return [];
  return product.related
    .map((relatedSlug) => getProduct(relatedSlug))
    .filter((item): item is Product => Boolean(item));
}

export const productSlugs = products.map((product) => product.slug);
