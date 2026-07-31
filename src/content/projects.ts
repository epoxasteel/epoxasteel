import type { Project } from './types';

/**
 * NOTE FOR THE CONTENT OWNER
 * These case studies are illustrative examples written to demonstrate the
 * layout and the level of detail the template expects. Replace each entry with
 * a real project — and obtain written permission before naming a client — before
 * the site goes live. See docs/CONTENT.md.
 */
export const projects: Project[] = [
  {
    slug: 'meridian-tower',
    name: 'Meridian Tower',
    client: 'Confidential, commercial developer',
    location: 'Newark, New Jersey',
    country: 'United States',
    industry: 'commercial',
    year: '2025',
    timeline: '19 months',
    scale: '4,850 tonnes',
    summary:
      'A 41-storey mixed-use tower framed in structural steel, delivered on a fixed handover date with zero program slip on the steel package.',
    overview: [
      "Meridian Tower replaced a surface car park in Newark's central business district with 41 storeys of office, retail and amenity space. The developer had pre-let six floors before ground was broken, which fixed the handover date twenty-two months out and made the steel program the single largest schedule risk on the job.",
      'We were appointed at design stage rather than at tender, which gave the engineering team room to revisit the floor framing before it was frozen. Cellular beams with designed-in service penetrations replaced the original solid-web scheme, removing 180 mm from every floor-to-floor dimension and returning almost a full storey of height within the same planning envelope.',
      'Steel was released in eight packages tracking the erection sequence. Every trailer arrived inside a two-hour window agreed the previous afternoon, on a site with no laydown area whatsoever, material went from trailer to crane hook.',
    ],
    challenge:
      'A fixed pre-let handover date, a city-center site with no storage, and a floor-to-floor dimension that would not accommodate the originally specified framing depth alongside the services zone.',
    solution:
      'Early-stage value engineering replaced solid-web beams with cellular sections carrying designed-in service openings, recovering height. The steel package was split into eight sequence-aligned releases, delivered just-in-time in two-hour windows straight to the crane.',
    outcome:
      'The steel frame topped out eleven days ahead of the program. The height recovered by the cellular beam redesign allowed an additional lettable floor within the approved envelope, and the developer handed over on the contracted date.',
    productsUsed: ['steel-beams', 'structural-steel', 'steel-plates', 'custom-fabrication'],
    servicesUsed: ['steel-supply', 'fabrication', 'engineering-support', 'delivery'],
    metrics: [
      { value: '4,850t', label: 'Steel supplied' },
      { value: '41', label: 'Storeys' },
      { value: '11 days', label: 'Ahead of program' },
      { value: '+1', label: 'Floor recovered' },
    ],
    gallery: [
      { caption: 'Frame at level 28 during erection', seed: 11 },
      { caption: 'Cellular beam service penetrations', seed: 27 },
      { caption: 'Night delivery to the crane', seed: 42 },
      { caption: 'Completed façade from the east', seed: 63 },
    ],
    featured: true,
  },
  {
    slug: 'harbour-crossing',
    name: 'Harbour Crossing Bridge',
    client: 'Regional transport authority',
    location: 'Baltimore, Maryland',
    country: 'United States',
    industry: 'bridges',
    year: '2024',
    timeline: '26 months',
    scale: '3,200 tonnes',
    summary:
      'A 340-meter four-span plate girder crossing fabricated to fracture-critical procedures, with 100% ultrasonic testing on tension welds.',
    overview: [
      'Harbour Crossing carries four lanes and a segregated cycleway over a working shipping channel, with a 120-year design life and a fracture-critical designation on the main girders. The specification left no room for interpretation: every tension weld ultrasonically tested, every welder individually qualified, every plate traceable to a heat with through-thickness properties.',
      'We supplied and fabricated the plate girders under a dedicated fracture-critical quality plan, with an independent inspection agency present throughout. Weathering steel was selected after a whole-life cost comparison showed it saving 38% against a painted alternative once maintenance access over a shipping channel was priced honestly.',
      'The girders were shipped in sections determined by a transport study rather than by convenience, splices were placed where the road network allowed rather than where the drawing office preferred, and the resulting welds were designed to suit site conditions.',
    ],
    challenge:
      'Fracture-critical fabrication over a live shipping channel, with a 120-year design life, a maintenance access constraint that made repainting prohibitively expensive, and abnormal load transport through a dense urban network.',
    solution:
      'Weathering steel eliminated the maintenance repaint cycle. Fabrication ran under a dedicated fracture-critical quality plan with 100% UT on tension welds and continuous independent inspection. Splice positions were set by a transport route survey conducted before detailing began.',
    outcome:
      'All 412 fracture-critical welds passed first-time inspection. The crossing opened six weeks early, and the weathering steel decision is projected to save $14M in maintenance across the design life.',
    productsUsed: ['steel-plates', 'structural-steel', 'reinforcing-steel', 'custom-fabrication'],
    servicesUsed: ['fabrication', 'engineering-support', 'logistics', 'steel-supply'],
    metrics: [
      { value: '340m', label: 'Total span' },
      { value: '412', label: 'FCM welds, all passed' },
      { value: '120yr', label: 'Design life' },
      { value: '$14M', label: 'Projected maintenance saving' },
    ],
    gallery: [
      { caption: 'Plate girder in the fabrication bay', seed: 8 },
      { caption: 'Ultrasonic testing of a tension weld', seed: 19 },
      { caption: 'Span three lift over the channel', seed: 34 },
      { caption: 'Completed crossing at dusk', seed: 55 },
    ],
    featured: true,
  },
  {
    slug: 'northgate-distribution',
    name: 'Northgate Distribution Center',
    client: 'National logistics operator',
    location: 'Columbus, Ohio',
    country: 'United States',
    industry: 'warehousing',
    year: '2025',
    timeline: '9 months',
    scale: '2,100 tonnes',
    summary:
      "A 1.2 million square foot fulfilment facility framed, clad and operational eleven weeks faster than the operator's previous build of comparable size.",
    overview: [
      "Northgate is a single-storey fulfilment center of 1.2 million square feet under one roof, with 40-meter clear spans and a 14-meter haunch height. The operator's business case depended on the building accepting inventory before the peak season, which meant the frame had to be complete in a window that left no contingency.",
      'Repetition was the opportunity. With 96 near-identical frames, we batch-fabricated columns and rafters in production runs rather than as individual pieces, cutting shop hours per tonne by 31% against a one-off approach, a saving reflected directly in the package price.',
      'Delivery ran bay by bay. Erection began on frame one while frame twenty was still in the shop, and the two processes ran in parallel for the whole program.',
    ],
    challenge:
      'A fixed operational date driven by peak season, 96 portal frames to fabricate and erect, and a site remote enough that a failed delivery could not be recovered the same day.',
    solution:
      'Batch production of repeated frame components drove shop hours down 31%. Bay-by-bay delivery allowed erection and fabrication to run concurrently, and a two-day buffer of frame components was held on site throughout.',
    outcome:
      "The building accepted its first inventory eleven weeks ahead of the operator's benchmark for a comparable facility. The batch fabrication saving was returned as a 9% reduction against the tendered package price.",
    productsUsed: ['structural-steel', 'steel-channels', 'steel-sheets', 'galvanized-steel'],
    servicesUsed: ['steel-supply', 'fabrication', 'logistics', 'delivery'],
    metrics: [
      { value: '1.2M', label: 'Sq. ft. under roof' },
      { value: '96', label: 'Portal frames' },
      { value: '31%', label: 'Shop hours saved' },
      { value: '11wk', label: 'Faster to operation' },
    ],
    gallery: [
      { caption: 'Portal frames in batch production', seed: 5 },
      { caption: 'Rafter lift, bay 34', seed: 21 },
      { caption: '40-meter clear span interior', seed: 47 },
      { caption: 'Completed facility, aerial', seed: 71 },
    ],
    featured: true,
  },
  {
    slug: 'cedar-park-residences',
    name: 'Cedar Park Residences',
    client: 'Residential developer',
    location: 'Austin, Texas',
    country: 'United States',
    industry: 'residential',
    year: '2024',
    timeline: '22 months',
    scale: '6,400 tonnes reinforcement',
    summary:
      'Three residential towers totalling 780 apartments, supplied with pour-sequenced cut-and-bent reinforcement on a five-day floor cycle.',
    overview: [
      'Cedar Park comprises three post-tensioned concrete towers of 22, 26 and 31 storeys sharing a common podium and basement. The contractor targeted a five-day floor cycle, aggressive for the region, and reinforcement delivery was the constraint that would decide whether it held.',
      'We supplied all reinforcement cut and bent to schedule, tagged by pour and bundled by location within the pour. A fixing gang arriving on a fresh deck found bundles positioned where the steel was going, labelled to match the drawing they were holding.',
      'Across 79 floor pours the five-day cycle was maintained on all but two, neither delayed by reinforcement supply.',
    ],
    challenge:
      'A five-day floor cycle across three towers, a constrained urban site with no reinforcement storage, and a fixing gang whose productivity depended entirely on material arriving sorted.',
    solution:
      "Cut-and-bent reinforcement produced directly from the bar bending schedules, tagged by pour and bundled by position within each pour. Deliveries were timed to the deck rather than the week, with nothing stored on site beyond a single pour's worth.",
    outcome:
      'The five-day cycle held on 77 of 79 pours, with no delay attributable to reinforcement. The podium and all three towers topped out within the original program.',
    productsUsed: ['reinforcing-steel', 'structural-steel', 'steel-beams', 'galvanized-steel'],
    servicesUsed: ['steel-supply', 'custom-orders', 'delivery', 'logistics'],
    metrics: [
      { value: '780', label: 'Apartments' },
      { value: '6,400t', label: 'Reinforcement' },
      { value: '5-day', label: 'Floor cycle held' },
      { value: '79', label: 'Pours supplied' },
    ],
    gallery: [
      { caption: 'Cut-and-bent reinforcement, tagged by pour', seed: 14 },
      { caption: 'Deck reinforcement before pour', seed: 30 },
      { caption: 'Tower two at level 19', seed: 52 },
      { caption: 'Completed towers from the park', seed: 68 },
    ],
  },
  {
    slug: 'atlas-energy-terminal',
    name: 'Atlas Energy Terminal',
    client: 'Energy infrastructure operator',
    location: 'Corpus Christi, Texas',
    country: 'United States',
    industry: 'energy',
    year: '2025',
    timeline: '14 months',
    scale: '1,850 tonnes',
    summary:
      'Pipe racks, equipment supports and access structures for a coastal energy terminal, installed across two shutdown windows with zero overrun.',
    overview: [
      'Atlas is a coastal terminal handling refined product, expanded while continuing to operate. The steel scope covered pipe racks, equipment support structures, access platforms and stair towers, all installed within two planned shutdown windows totalling nineteen days.',
      'A shutdown is unforgiving: every hour of overrun costs more than the steel package. We trial-assembled every structure in the shop before it shipped, proving fit against surveyed as-built dimensions rather than design dimensions, which is where this kind of work usually goes wrong.',
      'The coastal environment drove a C5-M coating specification. Hot-dip galvanizing plus a duplex epoxy system was selected after a whole-life comparison, targeting 25 years before first maintenance.',
    ],
    challenge:
      'Installation confined to two shutdown windows totalling nineteen days, on a live operational terminal, in a C5-M coastal corrosion environment with a 25-year maintenance-free target.',
    solution:
      'Full shop trial assembly against laser-surveyed as-built dimensions confirmed fit before dispatch. Structures were delivered pre-assembled to the largest module the site crane could lift, with a duplex galvanized-plus-epoxy coating system for the coastal exposure.',
    outcome:
      'Both shutdowns completed inside their windows, with the second finishing a day early. No site modification was required on any structure, every module fitted the survey it was built to.',
    productsUsed: ['structural-steel', 'steel-pipes', 'steel-plates', 'galvanized-steel'],
    servicesUsed: ['fabrication', 'engineering-support', 'logistics', 'technical-assistance'],
    metrics: [
      { value: '19 days', label: 'Total shutdown window' },
      { value: '0', label: 'Site modifications' },
      { value: '25yr', label: 'Coating design life' },
      { value: '1,850t', label: 'Steel installed' },
    ],
    gallery: [
      { caption: 'Pipe rack module trial assembly', seed: 3 },
      { caption: 'Duplex coating application', seed: 25 },
      { caption: 'Module lift during shutdown', seed: 44 },
      { caption: 'Completed terminal structures', seed: 60 },
    ],
  },
  {
    slug: 'westfield-transit-hub',
    name: 'Westfield Transit Hub',
    client: 'Metropolitan transit authority',
    location: 'Chicago, Illinois',
    country: 'United States',
    industry: 'transportation',
    year: '2024',
    timeline: '31 months',
    scale: '2,750 tonnes',
    summary:
      'A 96-meter clear-span station roof erected over live platforms during weekend possessions, with no service disruption across the entire program.',
    overview: [
      'Westfield serves 140,000 passengers a day and could not close. The new concourse roof, a 96-meter clear span of tubular trusses, had to be built above operating platforms, with erection confined to weekend possessions of roughly thirty hours each.',
      'The steel was architecturally exposed throughout, visible to every passenger, which set a finish standard far above ordinary structural work. We supplied matched heat numbers across each truss so surface texture stayed consistent after blasting and coating, and controlled weld profiles to AESS category 4.',
      'Trusses were assembled at ground level in a compound beside the station and lifted complete during possessions. Each lift was rehearsed against a 3D model of the crane envelope before the possession began.',
    ],
    challenge:
      'A 96-meter clear span erected above live platforms serving 140,000 daily passengers, restricted to thirty-hour weekend possessions, with architecturally exposed steelwork visible to the public.',
    solution:
      'Trusses were shop-fabricated to AESS category 4 with matched heat numbers per truss, assembled complete at ground level, and lifted during possessions after rehearsal against a 3D crane envelope model.',
    outcome:
      'The roof was completed across eleven possessions with no service disruption and no overrun. The exposed steelwork passed architectural inspection without a single remedial item.',
    productsUsed: ['steel-tubes', 'structural-steel', 'steel-plates', 'custom-fabrication'],
    servicesUsed: ['fabrication', 'logistics', 'project-consultation', 'delivery'],
    metrics: [
      { value: '96m', label: 'Clear span' },
      { value: '11', label: 'Possessions used' },
      { value: '0', label: 'Service disruptions' },
      { value: 'AESS 4', label: 'Finish category' },
    ],
    gallery: [
      { caption: 'Tubular truss assembly in the compound', seed: 9 },
      { caption: 'AESS weld dressing detail', seed: 23 },
      { caption: 'Overnight truss lift', seed: 49 },
      { caption: 'Completed concourse roof', seed: 66 },
    ],
  },
  {
    slug: 'ridgeline-solar',
    name: 'Ridgeline Solar Array',
    client: 'Renewable energy developer',
    location: 'Yuma County, Arizona',
    country: 'United States',
    industry: 'energy',
    year: '2025',
    timeline: '7 months',
    scale: '980 tonnes',
    summary:
      'Mounting structure and pile steel for a 320 MW solar array, delivered to a remote desert site against a fixed grid energisation date.',
    overview: [
      'Ridgeline is a 320 MW single-axis tracking array across 1,900 acres of desert. The grid connection agreement fixed the energisation date, and missing it would have deferred revenue by a full year, the kind of deadline that reframes every other decision on a project.',
      'The scope was galvanized pile and torque tube steel, supplied in eleven weekly deliveries to a site with no hard standing, no permanent crane and a single unpaved access road. We staged material at a regional yard and ran daily shuttle deliveries into the array as installation advanced across the site.',
      'All steel was hot-dip galvanized to a 40-year design life against the desert exposure category, with coating thickness verified per batch.',
    ],
    challenge:
      'A fixed grid energisation date, a remote desert site with no hard standing or lifting capacity, and 1,900 acres of installation front advancing daily away from the access point.',
    solution:
      'Material was staged at a regional yard and shuttled daily into the advancing installation front on self-offload vehicles. Weekly bulk deliveries kept the yard replenished, insulating the site from any single transport failure.',
    outcome:
      'The array energised four days ahead of its grid connection date. No installation crew was ever held for material across the seven-month program.',
    productsUsed: ['galvanized-steel', 'structural-steel', 'steel-tubes', 'steel-bars'],
    servicesUsed: ['steel-supply', 'logistics', 'delivery', 'custom-orders'],
    metrics: [
      { value: '320MW', label: 'Array capacity' },
      { value: '1,900', label: 'Acres covered' },
      { value: '4 days', label: 'Ahead of energisation' },
      { value: '40yr', label: 'Galvanized design life' },
    ],
    gallery: [
      { caption: 'Galvanized pile steel at the staging yard', seed: 16 },
      { caption: 'Torque tube installation', seed: 38 },
      { caption: 'Array under construction', seed: 57 },
      { caption: 'Completed array at first light', seed: 74 },
    ],
  },
  {
    slug: 'st-alban-civic-center',
    name: 'St Alban Civic Center',
    client: 'Municipal authority',
    location: 'Providence, Rhode Island',
    country: 'United States',
    industry: 'government-projects',
    year: '2023',
    timeline: '17 months',
    scale: '1,450 tonnes',
    summary:
      'A civic building combining a heritage stone façade retention with a new steel frame, delivered under a public framework with full social value reporting.',
    overview: [
      'St Alban retained the listed stone façade of a 1911 civic building and inserted an entirely new steel frame behind it. Temporary works carried the façade while the original structure was removed, and the new frame had to thread through fixed points that were surveyed rather than designed.',
      'Every connection near the retained façade was detailed against a point-cloud survey, and several sections were rolled to match obsolete profiles where the new frame tied into original ironwork that was being preserved.',
      "As a public framework contract, the job carried social value obligations alongside the technical scope. We reported local content, apprenticeship hours and embodied carbon monthly in the authority's required format.",
    ],
    challenge:
      'A retained heritage façade with surveyed rather than designed fixing points, tie-ins to preserved 1911 ironwork in obsolete profiles, and public framework reporting obligations running alongside the technical scope.',
    solution:
      "Connections were detailed from a point-cloud survey rather than record drawings. Obsolete sections were matched through mill-direct sourcing, and social value data was captured through production and reported monthly in the authority's format.",
    outcome:
      'The frame was installed without disturbing the retained façade, and the building opened on program. The project achieved 71% local content and supported 4,200 apprenticeship hours.',
    productsUsed: ['structural-steel', 'steel-plates', 'steel-beams', 'custom-fabrication'],
    servicesUsed: ['fabrication', 'engineering-support', 'custom-orders', 'project-consultation'],
    metrics: [
      { value: '1911', label: 'Façade retained from' },
      { value: '71%', label: 'Local content' },
      { value: '4,200', label: 'Apprenticeship hours' },
      { value: '0', label: 'Façade movement events' },
    ],
    gallery: [
      { caption: 'Façade retention temporary works', seed: 12 },
      { caption: 'New frame threading the retained wall', seed: 29 },
      { caption: 'Matched obsolete section tie-in', seed: 41 },
      { caption: 'Completed civic center', seed: 69 },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured);
}

export function getProjectsByIndustry(industrySlug: string) {
  return projects.filter((project) => project.industry === industrySlug);
}

export const projectSlugs = projects.map((project) => project.slug);
