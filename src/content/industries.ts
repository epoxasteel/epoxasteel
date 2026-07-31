import type { Industry } from './types';

export const industries: Industry[] = [
  {
    slug: 'construction',
    name: 'Construction',
    tagline: 'Steel that keeps the programme honest.',
    summary:
      'General contractors rely on us for predictable delivery, complete documentation and the flexibility to absorb the changes every build produces.',
    overview: [
      'Construction runs on sequence. A frame is only as fast as the material feeding it, and a single late trailer can push a crane hire, a concrete pour and a trade handover in one afternoon. We build our supply commitments around your programme rather than our yard convenience.',
      'That means delivery windows measured in hours, loads bundled in erection sequence, and a named account manager who knows which package is critical this week. When drawings change, and they do. We re-cut, re-schedule and re-issue documentation without turning it into a procurement event.',
    ],
    challenges: [
      {
        title: 'Programme volatility',
        body: 'Sequences move. We hold buffer stock against your critical packages and re-plan deliveries within 24 hours of a revised programme, at no re-scheduling charge.',
      },
      {
        title: 'Documentation for sign-off',
        body: 'Every delivery ships with mill certificates matched to heat numbers, so the inspector who arrives unannounced finds a complete file rather than a promise.',
      },
      {
        title: 'Site logistics constraints',
        body: 'Restricted access, night deliveries and crane windows are planned before the load leaves. Vehicle type, offload method and timing are agreed in writing.',
      },
    ],
    products: [
      'structural-steel',
      'steel-beams',
      'reinforcing-steel',
      'steel-plates',
      'steel-angles',
    ],
    services: ['steel-supply', 'fabrication', 'logistics', 'delivery'],
    stats: [
      { value: '2,600+', label: 'Projects supplied' },
      { value: '99.4%', label: 'On-time delivery' },
      { value: '24h', label: 'Re-schedule response' },
    ],
    icon: 'crane',
    featured: true,
  },
  {
    slug: 'commercial',
    name: 'Commercial',
    tagline: 'Office, retail and hospitality structures with no visible compromise.',
    summary:
      'Long spans, exposed steelwork and finish quality that survives the architect walkthrough, supplied to programmes that cannot slip.',
    overview: [
      'Commercial buildings are judged twice: once by the structural engineer and once by everyone who walks through the lobby. We supply the sections that carry the loads and the architecturally exposed steelwork that people actually touch, with the surface quality and consistency that exposed work demands.',
      'For tenant-driven schedules where the lease start date is fixed, we work backwards from handover: steel released in packages, fabricated in parallel, and delivered to a crane schedule agreed months in advance.',
    ],
    challenges: [
      {
        title: 'Architecturally exposed steel',
        body: 'AESS categories 1–4 supplied with matched heat numbers, controlled weld profiles and protected transport so the finish arrives as specified.',
      },
      {
        title: 'Long-span floor plates',
        body: 'Cellular and castellated beam options engineered with service penetrations designed in, reducing floor-to-floor height without adding depth.',
      },
      {
        title: 'Fixed handover dates',
        body: 'Package-based release with agreed milestone dates and weekly progress reporting against the erection programme.',
      },
    ],
    products: [
      'steel-beams',
      'structural-steel',
      'steel-tubes',
      'stainless-steel',
      'custom-fabrication',
    ],
    services: ['steel-supply', 'fabrication', 'engineering-support', 'project-consultation'],
    stats: [
      { value: '180+', label: 'Commercial towers' },
      { value: '4.2M', label: 'Sq. ft. framed' },
      { value: 'AESS 4', label: 'Highest finish class' },
    ],
    icon: 'building',
    featured: true,
  },
  {
    slug: 'residential',
    name: 'Residential',
    tagline: 'From single dwellings to high-rise apartment frames.',
    summary:
      'Reinforcement, structural framing and balcony steel for developers building at every scale, with schedules matched to pour cycles.',
    overview: [
      'Residential construction lives and dies by cycle time. A tower floor plate that turns in six days instead of eight saves months across a build, and reinforcement delivery is often the constraint that decides which it is.',
      'We supply cut-and-bent reinforcement tagged by pour, structural steel for transfer levels and podiums, and the balcony, balustrade and canopy steelwork that finishes a scheme. Deliveries are timed to the pour, not to the week.',
    ],
    challenges: [
      {
        title: 'Compressed pour cycles',
        body: 'Reinforcement delivered pour-by-pour, tagged and bundled by location, so the fixing gang starts work the moment the load lands.',
      },
      {
        title: 'Constrained urban sites',
        body: 'Small-vehicle deliveries, timed slots and just-in-time supply for sites with no laydown area.',
      },
      {
        title: 'Cost certainty at scale',
        body: 'Framework pricing across a multi-phase development, with rates fixed against agreed volume and drawdown schedules.',
      },
    ],
    products: [
      'reinforcing-steel',
      'structural-steel',
      'steel-beams',
      'steel-tubes',
      'galvanized-steel',
    ],
    services: ['steel-supply', 'delivery', 'custom-orders', 'logistics'],
    stats: [
      { value: '340+', label: 'Residential schemes' },
      { value: '61,000', label: 'Homes supported' },
      { value: '6-day', label: 'Typical floor cycle' },
    ],
    icon: 'home',
  },
  {
    slug: 'infrastructure',
    name: 'Infrastructure',
    tagline: 'Public works built to outlive everyone who signed for them.',
    summary:
      'Certified material and traceable documentation for the roads, utilities and civic structures a region depends on for a century.',
    overview: [
      'Infrastructure procurement is defined by scrutiny. Public money, long design lives and unforgiving audit requirements mean the documentation package is scrutinised as closely as the steel itself.',
      'We supply to public-sector frameworks with full chain-of-custody traceability, third-party verified test certificates and the corrosion protection systems that hundred-year design lives require. Our project files are structured to survive an audit five years after practical completion.',
    ],
    challenges: [
      {
        title: 'Design life and durability',
        body: 'Corrosion protection specified against exposure category, with duplex systems and weathering steel options assessed for whole-life cost.',
      },
      {
        title: 'Audit and traceability',
        body: 'Chain-of-custody records from mill to site, retained for the full defects liability period and available on request.',
      },
      {
        title: 'Framework compliance',
        body: 'Pre-qualified on public-sector frameworks with the insurance, accreditation and reporting those frameworks require.',
      },
    ],
    products: [
      'structural-steel',
      'steel-plates',
      'reinforcing-steel',
      'steel-pipes',
      'galvanized-steel',
    ],
    services: ['steel-supply', 'engineering-support', 'logistics', 'technical-assistance'],
    stats: [
      { value: '95', label: 'Public projects' },
      { value: '120yr', label: 'Design life supplied' },
      { value: '100%', label: 'Traceable material' },
    ],
    icon: 'landmark',
    featured: true,
  },
  {
    slug: 'warehousing',
    name: 'Warehousing & Logistics',
    tagline: 'Portal frames and racking steel, up fast and built to work.',
    summary:
      'High-volume structural packages for distribution centres, cold stores and fulfilment facilities where speed to operation is everything.',
    overview: [
      'A distribution centre is a machine for moving goods, and every week it is not operating is revenue that never arrives. Warehouse steel is high volume, highly repetitive and utterly schedule-driven.',
      'We supply complete portal frame packages, columns, rafters, purlins, side rails, bracing and cladding rails, batch-fabricated and delivered in erection bays. Repetition is an advantage we pass back as price, and volume is planned months ahead against your programme.',
    ],
    challenges: [
      {
        title: 'Volume and repetition',
        body: 'Batch production of identical frames drives unit cost down; savings are reflected in package pricing rather than absorbed.',
      },
      {
        title: 'Speed to operation',
        body: 'Bay-by-bay delivery lets erection start on frame one while frame twenty is still in the shop.',
      },
      {
        title: 'Cold store and clean environments',
        body: 'Galvanized and specialist-coated steel for temperature-controlled and hygiene-critical facilities.',
      },
    ],
    products: [
      'structural-steel',
      'steel-beams',
      'steel-channels',
      'steel-sheets',
      'galvanized-steel',
    ],
    services: ['steel-supply', 'fabrication', 'logistics', 'delivery'],
    stats: [
      { value: '210+', label: 'Facilities supplied' },
      { value: '18M', label: 'Sq. ft. under roof' },
      { value: '11wk', label: 'Typical frame delivery' },
    ],
    icon: 'warehouse',
  },
  {
    slug: 'industrial',
    name: 'Industrial',
    tagline: 'Heavy structures for plants that never stop.',
    summary:
      'Pipe racks, equipment supports, platforms and heavy framing for process plants where shutdown windows are measured in hours.',
    overview: [
      'Industrial steelwork carries equipment, resists vibration, tolerates heat and takes a beating from process conditions that would destroy an office frame. It is also frequently installed during a shutdown window that cannot extend.',
      'We plan shutdown work backwards from the restart date: pre-fabricated, trial-assembled where geometry demands it, delivered complete with fasteners and consumables, and marked so installation crews are never searching for a piece.',
    ],
    challenges: [
      {
        title: 'Shutdown windows',
        body: 'Trial assembly in the shop proves fit before the outage starts. Nothing arrives on site untested.',
      },
      {
        title: 'Harsh service conditions',
        body: 'Abrasion-resistant plate, heat-resistant grades and chemical-resistant coating systems specified to the actual process environment.',
      },
      {
        title: 'Equipment coordination',
        body: 'Support steel detailed against vendor equipment drawings, with hold points until certified dimensions are released.',
      },
    ],
    products: [
      'structural-steel',
      'steel-plates',
      'steel-pipes',
      'steel-tubes',
      'custom-fabrication',
    ],
    services: ['fabrication', 'engineering-support', 'custom-orders', 'technical-assistance'],
    stats: [
      { value: '430+', label: 'Industrial packages' },
      { value: '72h', label: 'Emergency response' },
      { value: 'AR500', label: 'Wear plate supplied' },
    ],
    icon: 'factory',
  },
  {
    slug: 'bridges',
    name: 'Bridges',
    tagline: 'Spans engineered for a century of loading.',
    summary:
      'Girder plate, weathering steel and heavy fabrication for road, rail and pedestrian crossings, delivered with full NDT records.',
    overview: [
      'Bridge steel is the most heavily scrutinised material in construction, and rightly so. Fatigue detailing, fracture-critical member designation, weld inspection and dimensional control all carry consequences that last decades.',
      'We supply plate girder material with through-thickness testing, weathering steel for maintenance-free spans, and fabrication to fracture-critical procedures with independent NDT. Every weld on a fracture-critical member is documented and traceable to a welder qualification record.',
    ],
    challenges: [
      {
        title: 'Fracture-critical members',
        body: 'Fabrication under dedicated FCM procedures with 100% UT of tension welds and full traceability to welder qualification.',
      },
      {
        title: 'Fatigue detailing',
        body: 'Weld profiles, grinding and transition details executed to the fatigue category the designer specified, not the nearest convenient equivalent.',
      },
      {
        title: 'Transport of large assemblies',
        body: 'Abnormal load planning, permits, escorts and splice design that balances shop welding against site access.',
      },
    ],
    products: [
      'steel-plates',
      'structural-steel',
      'reinforcing-steel',
      'galvanized-steel',
      'custom-fabrication',
    ],
    services: ['fabrication', 'engineering-support', 'logistics', 'steel-supply'],
    stats: [
      { value: '64', label: 'Bridge projects' },
      { value: '100%', label: 'UT on FCM welds' },
      { value: '120yr', label: 'Design life' },
    ],
    icon: 'bridge',
    featured: true,
  },
  {
    slug: 'transportation',
    name: 'Transportation',
    tagline: 'Terminals, depots and transit structures.',
    summary:
      'Steel for airports, stations, ports and transit facilities, long spans, high footfall and phased construction around live operations.',
    overview: [
      'Transport infrastructure is almost always built while it is being used. Airports keep flying, stations keep running, and construction happens in the gaps, often overnight, always under scrutiny.',
      'We deliver into live operational environments with the security clearance, night-working logistics and pre-assembled solutions that phased construction requires, including modules assembled off-site and lifted in during a single possession.',
    ],
    challenges: [
      {
        title: 'Live operational sites',
        body: 'Night deliveries, security-cleared drivers and pre-planned access routes agreed with the operator in advance.',
      },
      {
        title: 'Possession windows',
        body: 'Modular assemblies built and trial-fitted off-site so installation fits inside a single possession.',
      },
      {
        title: 'High-footfall durability',
        body: 'Finishes and details specified for cleaning regimes, impact and decades of public use.',
      },
    ],
    products: [
      'structural-steel',
      'steel-tubes',
      'steel-plates',
      'stainless-steel',
      'custom-fabrication',
    ],
    services: ['fabrication', 'logistics', 'project-consultation', 'delivery'],
    stats: [
      { value: '38', label: 'Transit facilities' },
      { value: '96m', label: 'Longest clear span' },
      { value: '0', label: 'Operational disruptions' },
    ],
    icon: 'train',
  },
  {
    slug: 'energy',
    name: 'Energy',
    tagline: 'Structures for generation, transmission and transition.',
    summary:
      'Substation steel, turbine foundations, solar mounting and process structures for conventional and renewable energy projects.',
    overview: [
      'Energy infrastructure spans a wider range of steel requirements than almost any other sector: galvanized lattice for transmission, heavy plate for pressure equipment, precision mounting systems for solar, and enormous embedded reinforcement cages for turbine foundations.',
      'We supply across that range with the certification each application demands, and we understand the grid connection deadlines that drive renewable programmes, where a delayed structure means a missed energisation window and a year of lost generation revenue.',
    ],
    challenges: [
      {
        title: 'Grid connection deadlines',
        body: 'Programme-critical supply planned against energisation dates, with escalation routes agreed before they are needed.',
      },
      {
        title: 'Remote site logistics',
        body: 'Delivery to sites without hard standing or lifting capacity, including self-offload vehicles and staged laydown.',
      },
      {
        title: 'Long-life corrosion protection',
        body: 'Hot-dip galvanizing and duplex systems specified for 25 to 40 year maintenance-free service in exposed conditions.',
      },
    ],
    products: [
      'structural-steel',
      'steel-plates',
      'steel-pipes',
      'galvanized-steel',
      'reinforcing-steel',
    ],
    services: ['steel-supply', 'fabrication', 'engineering-support', 'logistics'],
    stats: [
      { value: '2.4GW', label: 'Capacity supported' },
      { value: '78', label: 'Energy projects' },
      { value: '40yr', label: 'Coating design life' },
    ],
    icon: 'energy',
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    tagline: 'Machine bases, frames and production infrastructure.',
    summary:
      'Precision-cut plate, bar and section for OEMs and fabricators who need dimensional accuracy and repeatable supply.',
    overview: [
      'Manufacturers do not buy steel by the tonne; they buy parts by the piece, to tolerance, on a schedule that keeps a production line fed. A late or out-of-tolerance blank stops a cell.',
      'We support OEM customers with kanban supply, blanket orders drawn down against forecast, and first-article inspection on new parts. Dimensional reports accompany every batch where the drawing calls for it.',
    ],
    challenges: [
      {
        title: 'Dimensional repeatability',
        body: 'Laser profiling with in-process measurement and documented first-article inspection on every new part number.',
      },
      {
        title: 'Line-side supply',
        body: 'Kanban and call-off arrangements with stock held against forecast, delivered direct to the cell.',
      },
      {
        title: 'Mixed-material sourcing',
        body: 'Carbon, stainless and aluminium consolidated into a single order, delivery and invoice.',
      },
    ],
    products: [
      'steel-plates',
      'steel-bars',
      'steel-sheets',
      'stainless-steel',
      'custom-fabrication',
    ],
    services: ['steel-cutting', 'custom-orders', 'steel-supply', 'delivery'],
    stats: [
      { value: '±0.5mm', label: 'Laser tolerance' },
      { value: '190+', label: 'OEM accounts' },
      { value: '48h', label: 'Call-off lead time' },
    ],
    icon: 'gear',
  },
  {
    slug: 'agriculture',
    name: 'Agriculture',
    tagline: 'Durable structures for working land.',
    summary:
      'Portal frames, grain stores, livestock buildings and handling structures built for weather, chemicals and hard use.',
    overview: [
      'Agricultural buildings face a punishing combination: constant moisture, ammonia from livestock, fertiliser dust and equipment that hits things. Steel that would last thirty years in an office lasts a fraction of that in a cattle shed unless it is specified properly.',
      'We supply galvanized frames, coated sheet and heavy-duty fittings selected for the actual environment, and we price for the realities of farm construction, seasonal windows, phased budgets and self-build erection.',
    ],
    challenges: [
      {
        title: 'Corrosive environments',
        body: 'Galvanized frames and coated cladding specified for ammonia, slurry and fertiliser exposure rather than generic external use.',
      },
      {
        title: 'Seasonal construction windows',
        body: 'Delivery planned around harvest and calving, with material held in our yard until the window opens.',
      },
      {
        title: 'Self-build erection',
        body: 'Clear marking, simple bolted connections and assembly drawings written for farm teams rather than steel erectors.',
      },
    ],
    products: [
      'structural-steel',
      'steel-channels',
      'steel-sheets',
      'galvanized-steel',
      'steel-angles',
    ],
    services: ['steel-supply', 'fabrication', 'delivery', 'technical-assistance'],
    stats: [
      { value: '520+', label: 'Farm buildings' },
      { value: '30yr', label: 'Typical frame life' },
      { value: '5 day', label: 'Stock delivery' },
    ],
    icon: 'tractor',
  },
  {
    slug: 'government-projects',
    name: 'Government Projects',
    tagline: 'Compliance-first supply for the public sector.',
    summary:
      'Pre-qualified supply for defence, education, healthcare and civic projects, with the certification and reporting public contracts demand.',
    overview: [
      'Public sector work rewards suppliers who understand that compliance is not paperwork bolted onto a delivery. It is part of the delivery. Social value commitments, local content reporting, modern slavery declarations and prompt payment obligations are contractual, and failing them is as serious as failing a spec.',
      'We are pre-qualified across public frameworks and maintain the accreditation, insurance and reporting capability that government contracts require. Our project reporting is built around the metrics that public clients actually ask for.',
    ],
    challenges: [
      {
        title: 'Framework pre-qualification',
        body: 'Current accreditations, insurances and financial standing maintained and evidenced without a scramble at tender stage.',
      },
      {
        title: 'Social value reporting',
        body: 'Local content, apprenticeship and carbon reporting supplied in the format the contracting authority specifies.',
      },
      {
        title: 'Security requirements',
        body: 'Cleared personnel, controlled site access and secure document handling for sensitive projects.',
      },
    ],
    products: [
      'structural-steel',
      'reinforcing-steel',
      'steel-plates',
      'galvanized-steel',
      'custom-fabrication',
    ],
    services: ['steel-supply', 'fabrication', 'project-consultation', 'engineering-support'],
    stats: [
      { value: '11', label: 'Active frameworks' },
      { value: '95', label: 'Public contracts' },
      { value: '100%', label: 'Prompt payment' },
    ],
    icon: 'road',
  },
];

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

export function getFeaturedIndustries() {
  return industries.filter((industry) => industry.featured);
}

export const industrySlugs = industries.map((industry) => industry.slug);
