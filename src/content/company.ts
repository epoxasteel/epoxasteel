/**
 * Company narrative: mission, values, history, leadership, standards.
 * Used by the About page, the homepage and several trust sections.
 */

export const mission = {
  statement:
    'To supply the structural steel that turns ambitious drawings into standing buildings — certified, on schedule, and backed by people who answer the phone.',
  body: 'Steel is a commodity right up until the moment it is late, wrong, or undocumented. Then it is the most important thing on the project. EPOXA STEEL exists to make sure that moment never arrives: predictable supply, complete traceability, and engineering judgement applied before problems reach site.',
};

export const vision = {
  statement:
    'To be the supplier that contractors, engineers and developers name first when the schedule cannot slip.',
  body: 'We measure that ambition in one number: the proportion of our revenue that comes from clients who have bought from us before. It has not fallen below 78% in eleven years, and we intend to keep it that way as we expand into new regions.',
};

export const values = [
  {
    title: 'Precision',
    body: 'A tolerance is a promise. We cut to the drawing, not to the nearest convenient dimension, and we measure what we ship before it leaves.',
  },
  {
    title: 'Accountability',
    body: 'Every order has a named owner. When something goes wrong you will hear it from us first, with what we are doing about it already underway.',
  },
  {
    title: 'Traceability',
    body: 'Heat number to piece mark, mill to site. If we cannot prove where a piece of steel came from, we do not sell it.',
  },
  {
    title: 'Judgement',
    body: 'We tell clients when a specification is costing them money for no benefit — including when the answer means a smaller order for us.',
  },
  {
    title: 'Safety',
    body: 'Nobody in our yard, our shop or on our trailers is asked to take a risk to make a schedule. This is not negotiable and never has been.',
  },
  {
    title: 'Durability',
    body: 'We specify for the life of the structure, not the length of the warranty. The right coating and the right grade are cheaper over thirty years.',
  },
] as const;

export const history = [
  {
    year: '2009',
    title: 'Founded',
    body: 'EPOXA STEEL opens as a three-person stockholding operation supplying structural sections to regional contractors from a single leased yard.',
  },
  {
    year: '2012',
    title: 'First fabrication shop',
    body: 'A 2,400 m² fabrication facility opens with a CNC beam line and manual welding bays, taking the business from supply into processing.',
  },
  {
    year: '2015',
    title: 'Quality accreditation',
    body: 'ISO 9001 certification achieved, followed by EN 1090 factory production control and welding qualification to EN ISO 3834-2.',
  },
  {
    year: '2017',
    title: 'Bridge and infrastructure division',
    body: 'Fracture-critical fabrication capability established, opening public infrastructure work and the documentation discipline it demands.',
  },
  {
    year: '2019',
    title: 'A decade, and a million tonnes',
    body: 'The millionth tonne is supplied. Repeat business passes 80% of revenue for the first time.',
  },
  {
    year: '2021',
    title: 'Coating and finishing',
    body: 'An automated blast line and climate-controlled coating bay bring surface treatment in-house, consolidating release documentation.',
  },
  {
    year: '2023',
    title: 'International supply',
    body: 'Export operations formalised, with projects delivered across 34 countries and multi-modal freight managed in-house.',
  },
  {
    year: '2026',
    title: 'Digital delivery',
    body: 'Model-driven fabrication from IFC and DSTV becomes standard across the shop, and live order tracking opens to every client.',
  },
] as const;

export const leadership = [
  {
    name: 'Marcus Oyelaran',
    role: 'Chief Executive Officer',
    bio: 'Twenty-four years in steel distribution and fabrication. Founded EPOXA STEEL in 2009 after a decade running supply operations for a national stockholder.',
    focus: 'Strategy, client relationships, growth',
    initials: 'MO',
  },
  {
    name: 'Dr. Helena Vasquez',
    role: 'Technical Director',
    bio: 'Chartered structural engineer with a doctorate in fatigue behaviour of welded connections. Leads engineering support, connection design and technical assurance.',
    focus: 'Engineering, standards, technical assurance',
    initials: 'HV',
  },
  {
    name: 'Anders Lindqvist',
    role: 'Operations Director',
    bio: 'Thirty years in heavy fabrication, previously plant manager for a bridge fabricator delivering fracture-critical work across Northern Europe.',
    focus: 'Fabrication, capacity, throughput',
    initials: 'AL',
  },
  {
    name: 'Priya Raghunathan',
    role: 'Quality & Compliance Director',
    bio: 'Lead auditor for ISO 9001 and EN 1090. Owns the quality management system, supplier audit programme and certification portfolio.',
    focus: 'Quality systems, audit, certification',
    initials: 'PR',
  },
  {
    name: 'Daniel Okoro',
    role: 'Commercial Director',
    bio: 'Former quantity surveyor turned steel commercial lead. Responsible for estimating, procurement strategy and framework agreements.',
    focus: 'Commercial, procurement, frameworks',
    initials: 'DO',
  },
  {
    name: 'Sofia Marchetti',
    role: 'Supply Chain Director',
    bio: 'Built mill relationships across Europe and Asia over eighteen years. Runs sourcing, inventory strategy and international logistics.',
    focus: 'Sourcing, inventory, logistics',
    initials: 'SM',
  },
] as const;

export const certifications = [
  {
    code: 'ISO 9001',
    name: 'Quality Management',
    body: 'Certified quality management system covering supply, fabrication and finishing operations.',
  },
  {
    code: 'ISO 14001',
    name: 'Environmental Management',
    body: 'Environmental management system governing waste, emissions and material recovery.',
  },
  {
    code: 'ISO 45001',
    name: 'Occupational Health & Safety',
    body: 'Health and safety management across yard, shop, transport and site operations.',
  },
  {
    code: 'EN 1090',
    name: 'Factory Production Control',
    body: 'CE marking of structural steelwork to execution classes EXC1 through EXC3.',
  },
  {
    code: 'EN ISO 3834-2',
    name: 'Welding Quality',
    body: 'Comprehensive quality requirements for fusion welding of metallic materials.',
  },
  {
    code: 'AISC Certified',
    name: 'Steel Building Structures',
    body: 'Certification for fabrication of building structures, including complex projects.',
  },
] as const;

export const qualityCommitments = [
  {
    title: 'Every heat, traced',
    body: 'Material is recorded from mill heat number to finished piece mark. Any component on any project we have supplied can be traced back to its certificate within one working day.',
    metric: '100%',
    metricLabel: 'Material traceability',
  },
  {
    title: 'Inspected before release',
    body: 'Dimensional and visual inspection is a release gate, not a spot check. Nothing leaves the facility without a signed inspection record against the approved drawing.',
    metric: '3-stage',
    metricLabel: 'Inspection gates',
  },
  {
    title: 'Welding under supervision',
    body: 'All welding is carried out by coded welders to qualified procedures, under certified welding supervision, with records retained for the life of the structure.',
    metric: 'EN 3834-2',
    metricLabel: 'Welding standard',
  },
  {
    title: 'Coating, verified',
    body: 'Surface preparation and dry film thickness are measured and recorded on every coated item, with environmental conditions logged throughout application.',
    metric: 'SA 2.5',
    metricLabel: 'Standard preparation',
  },
] as const;

export const whyChooseUs = [
  {
    title: 'Dates we actually hold',
    body: 'A 99.4% on-time delivery record across the last 24 months, measured against the date we confirmed at order — not a date we quietly revised later.',
  },
  {
    title: 'One accountable supplier',
    body: 'Supply, fabrication, finishing and delivery under one roof and one certificate. When something needs resolving, there is nobody to point at.',
  },
  {
    title: 'Engineers who engage early',
    body: 'Chartered engineers who review your design for buildability and cost before the package is frozen, with the calculations attached for your engineer to check.',
  },
  {
    title: 'Documentation that survives audit',
    body: 'Mill certificates, welding records, coating logs and delivery evidence assembled as one project file and retained for the full liability period.',
  },
  {
    title: 'Stock in the sizes specified',
    body: 'Deep inventory in the grades and sections that specifications actually call for, so most orders ship from stock rather than waiting on a rolling window.',
  },
  {
    title: 'Logistics as part of supply',
    body: 'Route surveys, permits, escorts and offload planning handled at order stage — so delivery day is a formality, not a negotiation.',
  },
] as const;

export const safetyCommitment = {
  title: 'Safety is the constraint, not the variable',
  body: [
    'Steel is heavy, and the ways it can hurt people are well understood. That understanding is worth nothing unless it is built into how work is planned rather than reviewed after an incident.',
    'Every lift, every load and every shop operation is planned before it starts. Our people are empowered to stop work without needing permission or justifying it afterwards, and that authority has never been questioned by a manager here.',
    'We publish our safety performance to clients on request, including the incidents we would rather not discuss. A supplier who only shares good numbers is telling you something about the numbers they are not sharing.',
  ],
  metrics: [
    { value: '0.31', label: 'Lost time injury rate', hint: 'Per 200,000 hours' },
    { value: '2,840', label: 'Safety observations', hint: 'Logged last year' },
    { value: '100%', label: 'Stop-work authority', hint: 'Every employee' },
  ],
};

export const innovation = {
  title: 'Innovation that reaches the shop floor',
  body: [
    'Innovation in steel is rarely dramatic. It is a nesting algorithm that recovers three percent of a plate, a model-driven workflow that removes a transcription step, or a coating system that adds a decade before first maintenance.',
    'We invest where the return reaches a project: model-driven fabrication straight from IFC and DSTV, in-process dimensional verification, and whole-life carbon reporting that lets design teams compare options on embodied emissions rather than tonnage alone.',
  ],
  initiatives: [
    {
      title: 'Model-driven fabrication',
      body: 'Geometry flows from your Tekla, Advance Steel or SDS/2 model straight to the machine. No re-keying, no transcription error, no drawing misread at 6am.',
    },
    {
      title: 'Embodied carbon reporting',
      body: 'EPD-backed carbon data for every supplied tonne, letting design teams compare structural options on emissions as well as cost.',
    },
    {
      title: 'Live order visibility',
      body: 'Clients see order status from mill release through fabrication to dispatch, with the same data our own production team works from.',
    },
    {
      title: 'Recycled content sourcing',
      body: 'Electric arc furnace material prioritised where the specification permits, currently averaging 71% recycled content across supplied tonnage.',
    },
  ],
};

export const futureGoals = [
  {
    title: 'Three new distribution hubs',
    body: 'Regional inventory closer to major construction markets, targeting next-day delivery to 80% of active projects by 2028.',
  },
  {
    title: 'Net-zero operations by 2035',
    body: 'A committed pathway covering our own operations, with interim targets published annually and independently verified.',
  },
  {
    title: 'Client portal and order tracking',
    body: 'Full self-service quoting, order tracking and documentation retrieval, extending the visibility our largest accounts already have to every client.',
  },
  {
    title: 'Expanded fabrication capacity',
    body: 'A second fabrication facility taking monthly capacity beyond 1,400 tonnes, with dedicated capacity reserved for framework clients.',
  },
] as const;

export const manufacturingStandards = [
  {
    title: 'Mill selection and audit',
    body: 'We buy from mills we have physically audited against our own supplier standard, covering process control, testing capability and certification integrity. A mill that cannot demonstrate consistent results does not enter our supply chain, regardless of price.',
  },
  {
    title: 'Incoming material verification',
    body: 'Every delivery is checked against its certificate on arrival: dimensions, markings, heat numbers and documentation. Material that does not reconcile is quarantined before it reaches stock.',
  },
  {
    title: 'Controlled processing',
    body: 'Machines are calibrated on a documented schedule and verified against reference standards. Programs are generated from approved models, and revision control prevents superseded geometry reaching production.',
  },
  {
    title: 'Welding control',
    body: 'Welding is carried out to qualified procedures by welders whose qualifications are current and verified. Consumables are controlled, stored and issued against the procedure they belong to.',
  },
  {
    title: 'Surface preparation and coating',
    body: 'Blast profile, ambient conditions, dew point and dry film thickness are measured and recorded for every coated item. Coating is applied within its specified window or the surface is prepared again.',
  },
  {
    title: 'Final inspection and release',
    body: 'Dimensional inspection against approved drawings, documentation reconciliation and a signed release note. Nothing ships on a verbal confirmation.',
  },
] as const;
