import type { Service } from './types';

export const services: Service[] = [
  {
    slug: 'steel-supply',
    name: 'Steel Supply',
    tagline: 'Certified material, on the date you were promised.',
    summary:
      'Direct mill relationships and deep local inventory, so your material arrives when the program says it should, with the certificates to match.',
    overview: [
      'Supply is a promise about time as much as it is about metal. We hold inventory in the sizes and grades that specifications actually call for, and we buy directly from mills we have audited rather than through layers of traders who add margin and remove accountability.',
      'Every order is assigned to a named account manager who owns it from inquiry to proof of delivery. You are never explaining your project to a call center, and you always know who to call when something changes.',
      'Documentation travels with the steel. Mill certificates matched to heat numbers, delivery notes referencing your purchase order lines, and a project file that stays complete for the full defects liability period.',
    ],
    process: [
      {
        title: 'Inquiry and take-off',
        body: 'Send drawings, a bill of quantities or a simple list. We check availability, flag substitutions worth considering, and price against real stock rather than an indicative rate.',
      },
      {
        title: 'Quotation',
        body: 'A line-by-line quotation within 48 hours for standard inquiries, showing grade, size, quantity, lead time and delivery terms with nothing buried in a footnote.',
      },
      {
        title: 'Order confirmation',
        body: 'Written confirmation of every line, agreed delivery dates and a nominated account manager. Material is allocated to your order at this point, not at dispatch.',
      },
      {
        title: 'Processing and release',
        body: 'Cutting, drilling and finishing as required, followed by dimensional and documentation checks before anything is released to transport.',
      },
      {
        title: 'Delivery and proof',
        body: 'Delivered to your window with certificates, packing list and photographic proof of delivery filed against your order.',
      },
    ],
    capabilities: [
      'Direct mill sourcing from audited suppliers',
      'Inventory across structural, flat, hollow and reinforcement',
      'Call-off and blanket order arrangements',
      'Framework and multi-phase pricing',
      'Mill-traceable certification on every line',
      'Emergency and same-day supply from stock',
    ],
    deliverables: [
      'Line-by-line quotation',
      'Order acknowledgement with committed dates',
      'EN 10204 3.1 mill certificates',
      'Packing list and delivery documentation',
      'Photographic proof of delivery',
    ],
    relatedProducts: ['structural-steel', 'steel-beams', 'steel-plates', 'reinforcing-steel'],
    icon: 'supply',
    featured: true,
  },
  {
    slug: 'fabrication',
    name: 'Fabrication',
    tagline: 'Erection-ready steel from a single accountable source.',
    summary:
      'CNC processing, qualified welding, blasting and coating under one roof, and one release certificate covering all of it.',
    overview: [
      'Splitting fabrication across multiple suppliers splits accountability with it. When a connection does not fit, the material supplier, the fabricator and the coater each have a reason it is not their problem. We remove that conversation by doing the work ourselves.',
      'Our shop runs CNC beam lines, plasma and laser profiling, robotic and manual welding to qualified procedures, automated blast cleaning and a climate-controlled coating bay. Certified welding supervision oversees every job, and third-party inspection is available on request.',
      'The output is steel that arrives marked, sequenced and ready to lift, with a single documentation package covering material, welding and coating.',
    ],
    process: [
      {
        title: 'Model and drawing review',
        body: 'We take your Tekla, Advance Steel or SDS/2 model and review it for fabrication-level detail before a single cut is made.',
      },
      {
        title: 'Shop drawing approval',
        body: 'Fabrication drawings issued for approval with a clear revision log. Nothing enters production until drawings are signed.',
      },
      {
        title: 'Cutting and preparation',
        body: 'CNC sawing, drilling, coping and profiling straight from the approved model, the geometry is never re-keyed by hand.',
      },
      {
        title: 'Welding and assembly',
        body: 'Welded to qualified procedures by coded welders under certified supervision, with in-process and final inspection.',
      },
      {
        title: 'Surface treatment',
        body: 'Blast cleaning to SA 2.5, then priming and coating in a controlled environment with dry film thickness verified and recorded.',
      },
      {
        title: 'Release and dispatch',
        body: 'Final dimensional check, piece marking, and release documentation issued as one package before loading in erection sequence.',
      },
    ],
    capabilities: [
      '850 tonnes per month capacity',
      'CNC beam line to 1,100 mm depth',
      'Robotic and manual welding to AWS D1.1 and EN ISO 3834-2',
      'EN 1090-2 execution classes EXC1 to EXC3',
      'Automated blast cleaning and controlled coating bay',
      'Trial assembly for complex geometry',
    ],
    deliverables: [
      'Approved shop drawings',
      'Welding procedure and welder qualification records',
      'NDT reports where specified',
      'Coating inspection and DFT records',
      'Erection sequence and delivery plan',
      'Single consolidated release certificate',
    ],
    relatedProducts: ['custom-fabrication', 'structural-steel', 'steel-plates', 'steel-tubes'],
    icon: 'fabrication',
    featured: true,
  },
  {
    slug: 'steel-cutting',
    name: 'Steel Cutting',
    tagline: 'Precision profiling from your files, not your phone call.',
    summary:
      'Laser, plasma, oxy-fuel, saw and shear processing driven directly from DXF, DWG and DSTV files, to tolerance, first time.',
    overview: [
      'Cutting is where errors are cheapest to prevent and most expensive to discover. We drive every machine directly from your CAD files, so what you drew is what gets cut, no transcription, no interpretation, no misread dimension.',
      'Fiber laser handles fine work to ±0.5 mm; CNC plasma covers heavy plate to 60 mm; oxy-fuel takes the very thick sections; and bandsaws, shears and press brakes complete the process. Nesting is optimised across your order to minimise the material you pay for and never use.',
    ],
    process: [
      {
        title: 'File submission',
        body: 'Send DXF, DWG, DSTV or STEP files. We check them for open contours, duplicate lines and geometry that will not cut cleanly, and come back with anything that needs a decision.',
      },
      {
        title: 'Nesting and quotation',
        body: 'Parts are nested across sheets to maximise yield. You see the material utilisation and the resulting price before committing.',
      },
      {
        title: 'Cutting',
        body: 'Processed on the machine best suited to the thickness and tolerance, with in-process checks against the drawing.',
      },
      {
        title: 'Finishing and inspection',
        body: 'Deburring, edge preparation and dimensional inspection. First-article reports issued where the drawing requires them.',
      },
    ],
    capabilities: [
      'Fiber laser to 25 mm, ±0.5 mm tolerance',
      'CNC plasma to 60 mm, 3,000 × 12,000 mm bed',
      'Oxy-fuel for heavy plate to 200 mm',
      'Bandsaw cutting to ±1 mm on section and bar',
      '640 tonne press brake, 6 m capacity',
      'Optimised nesting across the full order',
    ],
    deliverables: [
      'Nesting report with material utilisation',
      'Cut parts, deburred and marked',
      'First-article inspection reports',
      'Offcut return or credit where applicable',
    ],
    relatedProducts: ['steel-plates', 'steel-sheets', 'steel-bars', 'custom-fabrication'],
    icon: 'cutting',
  },
  {
    slug: 'custom-orders',
    name: 'Custom Orders',
    tagline: 'When the catalogue does not have the answer.',
    summary:
      'Non-standard grades, unusual sizes, special lengths and mill-direct orders sourced and managed end to end.',
    overview: [
      "Some projects need steel that is not sitting in anyone's yard: a grade with specific impact toughness at low temperature, a length nobody stocks, a section rolled to an obsolete standard for a heritage repair.",
      'We handle mill-direct inquiries as a managed process rather than a hopeful email. We know which mills roll what, when their rolling windows fall, and what minimum tonnage each will accept, so we can tell you quickly whether an order is viable and what it will actually cost.',
      'For repeat non-standard requirements we hold consignment stock against your forecast, converting a twelve-week mill lead time into a two-day call-off.',
    ],
    process: [
      {
        title: 'Technical review',
        body: 'We review the requirement against available standards and suggest equivalents where a specified grade is unnecessarily restrictive or commercially punishing.',
      },
      {
        title: 'Mill inquiry',
        body: 'Inquiries placed with mills capable of the specification, with rolling windows and minimum quantities confirmed before you commit.',
      },
      {
        title: 'Order placement',
        body: 'Mill order placed with agreed inspection requirements, test regime and delivery terms.',
      },
      {
        title: 'Production monitoring',
        body: 'Progress tracked against the rolling program with milestone updates, so a slipped window is known weeks ahead rather than on the delivery date.',
      },
      {
        title: 'Inspection and release',
        body: 'Third-party inspection at the mill where required, with certificates verified before shipment.',
      },
    ],
    capabilities: [
      'Mill-direct sourcing across Europe, Asia and the Americas',
      'Non-standard grades and impact-tested material',
      'Special lengths beyond standard stock',
      'Heritage and obsolete section matching',
      'Consignment stock against forecast',
      'Third-party mill inspection coordination',
    ],
    deliverables: [
      'Technical review and equivalence report',
      'Mill quotation with rolling window',
      'Production progress reporting',
      'Third-party inspection release notes',
      'Full mill certification package',
    ],
    relatedProducts: ['structural-steel', 'steel-plates', 'stainless-steel', 'steel-bars'],
    icon: 'custom',
  },
  {
    slug: 'engineering-support',
    name: 'Engineering Support',
    tagline: 'Chartered engineers on your side of the table.',
    summary:
      'Connection design, value engineering, substitution analysis and buildability review from engineers who work with steel every day.',
    overview: [
      "The most expensive decisions on a steel package are made before anything is ordered. A connection detailed for the designer's convenience rather than the fabricator's can add fifteen percent to a package cost without adding a gram of capacity.",
      'Our in-house engineering team reviews designs for buildability, proposes connection alternatives with calculations attached, and analyses substitutions where a specified section is commercially unattractive or on a long lead time.',
      'Every recommendation comes with the working shown. We are not asking you to take our word for it. We are giving your engineer something to check and sign.',
    ],
    process: [
      {
        title: 'Design review',
        body: 'We read the drawings and the specification, and identify where cost, lead time or buildability could be improved without changing performance.',
      },
      {
        title: 'Options and calculations',
        body: 'Alternatives presented with calculations, weight comparisons and cost impact, so the decision is evidence-based.',
      },
      {
        title: 'Coordination',
        body: 'Agreed changes coordinated with the design team and reflected in the fabrication model and shop drawings.',
      },
      {
        title: 'Technical query support',
        body: 'A named engineer available throughout fabrication and erection for the questions that inevitably arise on site.',
      },
    ],
    capabilities: [
      'Connection design to AISC 360 and EN 1993-1-8',
      'Value engineering with documented cost impact',
      'Grade and section substitution analysis',
      'Buildability and erection sequence review',
      'Weight and carbon comparison studies',
      'Technical query response during construction',
    ],
    deliverables: [
      'Design review report',
      'Connection calculations',
      'Substitution analysis with cost and weight comparison',
      'Marked-up drawings and coordination notes',
      'Named engineer contact for the project duration',
    ],
    relatedProducts: ['structural-steel', 'custom-fabrication', 'steel-beams', 'steel-plates'],
    icon: 'engineering',
    featured: true,
  },
  {
    slug: 'project-consultation',
    name: 'Project Consultation',
    tagline: 'Planning the steel package before it becomes a problem.',
    summary:
      'Early-stage advice on procurement strategy, packaging, program and risk, brought in when it can still change the outcome.',
    overview: [
      'Steel is usually one of the first packages procured and one of the last to be forgiven for slipping. Bringing a supplier in during design rather than at tender lets decisions be made when they are still cheap.',
      'We work with clients, contractors and design teams at feasibility and design stage: advising on procurement route, package boundaries, market conditions, lead times and the risks that most commonly derail steel programs.',
      'This is advisory work, offered without obligation to purchase. Clients who use it usually do buy from us, but they buy a better-planned package.',
    ],
    process: [
      {
        title: 'Briefing',
        body: 'We take the project brief, program and current design status, and agree what decisions the consultation needs to inform.',
      },
      {
        title: 'Market and options analysis',
        body: 'Current pricing, mill capacity, lead times and procurement route options assessed against your program.',
      },
      {
        title: 'Package strategy',
        body: 'Recommended package boundaries, release sequence and procurement milestones documented against the construction program.',
      },
      {
        title: 'Risk register',
        body: 'The steel-specific risks that could affect program or cost, with mitigation and ownership assigned.',
      },
    ],
    capabilities: [
      'Feasibility and early-stage cost advice',
      'Procurement route and package strategy',
      'Market condition and lead time briefing',
      'Program risk identification',
      'Design team workshops and CPD sessions',
      'Tender documentation review',
    ],
    deliverables: [
      'Procurement strategy report',
      'Indicative budget with basis clearly stated',
      'Package release program',
      'Steel-specific risk register',
    ],
    relatedProducts: ['structural-steel', 'custom-fabrication', 'reinforcing-steel'],
    icon: 'consultation',
  },
  {
    slug: 'logistics',
    name: 'Logistics',
    tagline: 'Getting heavy steel to difficult places, on time.',
    summary:
      'Route planning, abnormal loads, permits, customs and multi-modal freight managed as part of the supply, not bolted on after.',
    overview: [
      'Steel is heavy, long and awkward, and the last mile is frequently the hardest part of the whole supply chain. A restricted access road, a low bridge or a missing permit can strand a load within sight of the site.',
      'We plan transport when the order is placed, not when it is ready. Route surveys, vehicle selection, permits, escorts and offload method are agreed and documented before production completes, so dispatch is a formality rather than a negotiation.',
      'For international projects we handle export documentation, customs clearance and multi-modal freight, including container and break-bulk shipment with the packing specification that survives a sea voyage.',
    ],
    process: [
      {
        title: 'Transport assessment',
        body: 'Load dimensions, weight and site access assessed at order stage, and any abnormal load requirement flagged immediately.',
      },
      {
        title: 'Route and permits',
        body: 'Route surveyed where required, permits applied for, escorts arranged and timings agreed with the relevant authorities.',
      },
      {
        title: 'Load planning',
        body: 'Loads built in erection sequence, secured to standard and photographed before departure.',
      },
      {
        title: 'Tracking and delivery',
        body: 'Live tracking, an ETA the day before and a delivery confirmed against your nominated window.',
      },
    ],
    capabilities: [
      'Flatbed, extendable and low-loader transport',
      'Abnormal load permits and escorting',
      'Crane and self-offload vehicle arrangement',
      'Export documentation and customs clearance',
      'Container and break-bulk sea freight',
      'Bonded and third-party warehousing',
    ],
    deliverables: [
      'Transport plan with vehicle and route',
      'Permits and escort confirmations',
      'Load photographs and securing records',
      'Live tracking and delivery ETA',
      'Export and customs documentation',
    ],
    relatedProducts: ['structural-steel', 'steel-beams', 'steel-plates'],
    icon: 'logistics',
  },
  {
    slug: 'delivery',
    name: 'Delivery',
    tagline: 'Sequenced, timed and confirmed.',
    summary:
      'Deliveries planned to your erection sequence and crane availability, with timed windows and documented proof of delivery.',
    overview: [
      'A delivery that arrives on the right day but in the wrong order still costs you a day. Steel should land in the sequence the crane needs it, bundled by shipping mark, marked clearly enough to identify from the ground.',
      'We plan deliveries against your erection sequence and lift schedule, in timed windows down to the hour where a site requires it. Every delivery is confirmed the day before and evidenced with a signed note and photographs on arrival.',
      'For sites with no storage, just-in-time delivery keeps material off the ground entirely: steel goes from trailer to structure.',
    ],
    process: [
      {
        title: 'Sequence agreement',
        body: 'Erection sequence and lift schedule agreed with your steel erector and translated into a delivery schedule.',
      },
      {
        title: 'Bundling and marking',
        body: 'Material bundled by shipping mark and marked so pieces are identifiable from the ground without unstrapping.',
      },
      {
        title: 'Scheduling',
        body: 'Timed windows confirmed the day before, with driver details and vehicle registration sent ahead for site security.',
      },
      {
        title: 'Delivery and confirmation',
        body: 'Signed delivery note, photographs of the load in position and proof of delivery filed against your order the same day.',
      },
    ],
    capabilities: [
      'Erection-sequenced loading',
      'Timed delivery windows to the hour',
      'Night and weekend delivery',
      'Just-in-time supply for constrained sites',
      'Self-offload and crane-assisted delivery',
      'Same-day dispatch on stocked items',
    ],
    deliverables: [
      'Delivery schedule aligned to erection sequence',
      'Advance notification with vehicle and driver details',
      'Signed delivery note',
      'Photographic proof of delivery',
    ],
    relatedProducts: ['structural-steel', 'reinforcing-steel', 'steel-beams'],
    icon: 'delivery',
  },
  {
    slug: 'technical-assistance',
    name: 'Technical Assistance',
    tagline: 'Answers from people who have solved it before.',
    summary:
      'Grade selection, standards interpretation, welding guidance and on-site problem solving, available throughout your project.',
    overview: [
      'Most technical questions on a steel package are not complicated. They are just urgent. Which grade satisfies this clause? Can we weld this to that? What preheat does this thickness need? Waiting three days for an answer is what turns a small question into a delay.',
      'Our technical team answers material and welding queries within one working day, and we back that with site visits when a problem needs eyes on it rather than an email thread.',
      'We also run CPD sessions for design teams and toolbox talks for site crews, covering grade selection, corrosion protection, welding and inspection.',
    ],
    process: [
      {
        title: 'Raise a query',
        body: 'Email, call or send a photograph. Queries are logged and routed to the right specialist immediately.',
      },
      {
        title: 'Response',
        body: 'A documented answer within one working day, with the standard or calculation it relies on cited rather than asserted.',
      },
      {
        title: 'Site attendance',
        body: 'Where a query cannot be resolved remotely, an engineer attends site, usually within 48 hours.',
      },
      {
        title: 'Close-out',
        body: 'Resolution documented and added to the project file so the same question does not need asking twice.',
      },
    ],
    capabilities: [
      'Grade selection and standards interpretation',
      'Welding procedure and preheat guidance',
      'Corrosion protection specification',
      'Non-conformance investigation and resolution',
      'On-site technical attendance',
      'CPD sessions and toolbox talks',
    ],
    deliverables: [
      'Written technical response with references',
      'Site visit report where attended',
      'Non-conformance investigation record',
      'CPD material and training records',
    ],
    relatedProducts: [
      'structural-steel',
      'galvanized-steel',
      'stainless-steel',
      'custom-fabrication',
    ],
    icon: 'support',
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

export const serviceSlugs = services.map((service) => service.slug);
