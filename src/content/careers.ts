import type { Job } from './types';

export const cultureStatement = {
  title: 'Build something that stays built',
  body: [
    "Most of what we make outlives the people who made it. A bridge girder welded this year will still be carrying traffic when the welder's grandchildren are driving over it. That perspective changes how a workplace feels.",
    'We hire for judgement and train for everything else. Our welders are coded and kept current at our cost, our engineers are supported through chartership, and our apprentices are given real work with real consequences from their first month, supervised, but not sheltered.',
  ],
};

export const benefits = [
  {
    title: 'Competitive pay, reviewed annually',
    body: 'Benchmarked against regional market data and reviewed every year, with skills-based progression for shop-floor roles.',
  },
  {
    title: 'Certification paid in full',
    body: 'Welding tickets, NDT qualifications, plant licences and professional chartership funded and supported with paid study time.',
  },
  {
    title: 'Health cover from day one',
    body: 'Medical, dental and optical cover for you and your dependants, with no qualifying period.',
  },
  {
    title: 'Retirement contributions',
    body: 'Employer contribution above the statutory minimum, with matching on additional voluntary contributions.',
  },
  {
    title: 'Genuine stop-work authority',
    body: 'Every employee can halt any operation on safety grounds without permission or justification. It has never been questioned by a manager here.',
  },
  {
    title: 'Profit share',
    body: 'An annual profit-share scheme paid to every employee, on the same percentage basis from apprentice to director.',
  },
] as const;

export const jobs: Job[] = [
  {
    slug: 'structural-steel-detailer',
    title: 'Structural Steel Detailer',
    department: 'Engineering',
    location: 'Brooklyn, NY',
    type: 'Full-time',
    posted: '2026-07-08',
    summary:
      'Produce fabrication-ready models and shop drawings from consultant designs, working directly with our fabrication team to resolve detail before it reaches the shop floor.',
    responsibilities: [
      'Develop 3D models in Tekla Structures from consultant drawings and specifications',
      'Produce general arrangement, assembly and single-part drawings for approval',
      'Resolve connection detail with our engineering team and the design consultant',
      'Issue CNC data to the fabrication shop and manage revision control',
      'Attend design coordination meetings and respond to technical queries',
    ],
    requirements: [
      'Three or more years detailing structural steelwork in Tekla Structures or Advance Steel',
      'Working knowledge of AISC 360 or EN 1993 connection design principles',
      'Ability to read and interpret consultant drawings and specifications accurately',
      'Meticulous approach to revision control and drawing management',
      'Clear written communication for technical queries and coordination',
    ],
    benefits: [
      'Hybrid working after probation',
      'Software training and licence provided',
      'Support toward professional qualification',
    ],
  },
  {
    slug: 'coded-welder-mig-mag',
    title: 'Coded Welder (MIG/MAG)',
    department: 'Fabrication',
    location: 'Brooklyn, NY',
    type: 'Full-time',
    posted: '2026-07-15',
    summary:
      'Join the fabrication floor welding structural assemblies to qualified procedures, on work ranging from portal frames to fracture-critical bridge components.',
    responsibilities: [
      'Weld structural steel assemblies to approved welding procedure specifications',
      'Interpret fabrication drawings and weld symbols accurately',
      'Carry out fit-up and tacking prior to final welding',
      'Perform visual inspection of your own work before presenting for inspection',
      'Maintain welding equipment and report defects promptly',
    ],
    requirements: [
      'Current coding to AWS D1.1 or EN ISO 9606-1 in relevant positions',
      'Five or more years structural welding experience',
      'Confident reading fabrication drawings and weld symbols',
      'Understanding of distortion control and welding sequence',
      'Commitment to working safely and to procedure',
    ],
    benefits: [
      'Coding renewals paid in full',
      'Shift premium for evening work',
      'Tool allowance and full PPE provided',
    ],
  },
  {
    slug: 'project-engineer',
    title: 'Project Engineer',
    department: 'Engineering',
    location: 'Brooklyn, NY',
    type: 'Full-time',
    posted: '2026-06-24',
    summary:
      'Own the technical delivery of steel packages from award to handover, working between clients, our engineering team and the fabrication floor.',
    responsibilities: [
      'Manage the technical delivery of assigned projects from award to completion',
      'Review consultant designs for buildability and identify value engineering opportunities',
      'Coordinate detailing, fabrication and delivery programmes against client requirements',
      'Chair technical coordination meetings with clients and design teams',
      'Resolve technical queries and non-conformances, and attend site as required',
    ],
    requirements: [
      'Degree in civil or structural engineering, or equivalent experience',
      'Three or more years in structural steel fabrication, contracting or consultancy',
      'Working knowledge of AISC 360, EN 1090 and EN 1993',
      'Confident client-facing communication under commercial pressure',
      'Valid driving licence and willingness to travel to site',
    ],
    benefits: [
      'Chartership support with mentoring and paid fees',
      'Company vehicle or allowance',
      'Performance-related bonus',
    ],
  },
  {
    slug: 'cnc-machine-operator',
    title: 'CNC Machine Operator',
    department: 'Processing',
    location: 'Brooklyn, NY',
    type: 'Full-time',
    posted: '2026-07-20',
    summary:
      'Operate our CNC beam line and profiling machines, turning approved models into accurately processed steel ready for the welding bays.',
    responsibilities: [
      'Set up and operate CNC beam line, plasma and laser profiling equipment',
      'Load and verify programs against approved drawings and models',
      'Carry out first-off inspection and in-process dimensional checks',
      'Optimise nesting to maximise material utilisation',
      'Perform routine machine maintenance and consumable changes',
    ],
    requirements: [
      'Two or more years operating CNC machinery in a metal processing environment',
      'Confident interpreting engineering drawings and CAD files',
      'Comfortable with measurement and dimensional inspection',
      'Overhead crane and forklift licences advantageous',
      'Methodical, safety-focused approach to machine setup',
    ],
    benefits: [
      'Structured skills-based pay progression',
      'Licence training provided',
      'Shift premium for evening work',
    ],
  },
  {
    slug: 'logistics-coordinator',
    title: 'Logistics Coordinator',
    department: 'Operations',
    location: 'Brooklyn, NY',
    type: 'Full-time',
    posted: '2026-07-02',
    summary:
      'Plan and dispatch deliveries across the fleet and third-party hauliers, keeping every load sequenced, permitted and on time.',
    responsibilities: [
      'Plan delivery schedules against project erection sequences',
      'Arrange abnormal load permits, escorts and route surveys',
      'Coordinate own fleet and third-party hauliers to agreed windows',
      'Prepare export documentation and liaise with customs agents',
      'Maintain proof-of-delivery records and resolve delivery queries',
    ],
    requirements: [
      'Two or more years in transport planning, ideally with heavy or abnormal loads',
      'Understanding of transport regulations and permit processes',
      'Strong organisation under competing priorities',
      'Confident communicator with drivers, sites and hauliers',
      'Export documentation experience advantageous',
    ],
    benefits: [
      'Professional transport qualifications funded',
      'Hybrid working after probation',
      'Performance-related bonus',
    ],
  },
  {
    slug: 'quality-inspector',
    title: 'Quality Inspector',
    department: 'Quality',
    location: 'Brooklyn, NY',
    type: 'Full-time',
    posted: '2026-06-30',
    summary:
      'Inspect fabricated steelwork against drawings and standards, and own the release decision that lets a job leave the building.',
    responsibilities: [
      'Carry out dimensional and visual inspection of fabricated assemblies',
      'Verify welding against qualified procedures and inspect weld quality',
      'Measure and record surface preparation and coating thickness',
      'Reconcile material certification against production records',
      'Raise, investigate and close non-conformance reports',
    ],
    requirements: [
      'CSWIP 3.1, CWI or equivalent welding inspection qualification',
      'Three or more years inspecting structural steel fabrication',
      'Working knowledge of AWS D1.1, EN 1090-2 and EN ISO 5817',
      'Confident holding a release decision under production pressure',
      'NDT qualifications advantageous',
    ],
    benefits: [
      'Inspection qualification renewals funded',
      'NDT training pathway available',
      'Direct reporting line to the Quality Director',
    ],
  },
];

export function getJob(slug: string) {
  return jobs.find((job) => job.slug === slug);
}

export const jobSlugs = jobs.map((job) => job.slug);
