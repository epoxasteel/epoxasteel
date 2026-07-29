/**
 * Single source of truth for company facts, contact details and navigation.
 * Everything that appears in more than one place — the footer, the schema.org
 * payloads, e-mail templates — reads from here.
 */

export const siteConfig = {
  name: 'EPOXA STEEL',
  legalName: 'Epoxa Steel',
  shortName: 'Epoxa',
  domain: 'epoxasteel.com',
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://epoxasteel.com',
  tagline: 'Reinforce Your Dream.',
  description:
    'EPOXA STEEL supplies certified structural steel, plate, tube and reinforcement to commercial, residential and infrastructure projects worldwide — backed by in-house fabrication, mill-traceable documentation and schedule-driven logistics.',
  shortDescription:
    'Certified structural steel supply, fabrication and delivery for commercial, residential and infrastructure construction.',
  founded: '2009',
  locale: 'en_US',

  contact: {
    email: 'info@epoxasteel.com',
    salesEmail: 'sales@epoxasteel.com',
    quotesEmail: 'quotes@epoxasteel.com',
    careersEmail: 'careers@epoxasteel.com',
    phone: '+1 (212) 555-0180',
    phoneHref: '+12125550180',
    whatsapp: '12125550180',
    hours: [
      { days: 'Monday – Friday', time: '07:00 – 18:00' },
      { days: 'Saturday', time: '08:00 – 14:00' },
      { days: 'Sunday', time: 'Closed — emergency dispatch available' },
    ],
  },

  address: {
    line1: 'Epoxa Steel Center',
    line2: '1180 Ironworks Parkway, Building C',
    city: 'Newark',
    region: 'NJ',
    postalCode: '07114',
    country: 'United States',
    countryCode: 'US',
    // Used for the map embed and LocalBusiness schema.
    latitude: 40.6895,
    longitude: -74.1745,
  },

  social: {
    linkedin: 'https://www.linkedin.com/company/epoxasteel',
    instagram: 'https://www.instagram.com/epoxasteel',
    facebook: 'https://www.facebook.com/epoxasteel',
    x: 'https://x.com/epoxasteel',
    youtube: 'https://www.youtube.com/@epoxasteel',
  },

  /** Headline numbers used by the animated statistics blocks. */
  stats: [
    { value: 1400000, suffix: '+', label: 'Tonnes supplied', hint: 'Since 2009' },
    { value: 2600, suffix: '+', label: 'Projects delivered', hint: 'Across 34 countries' },
    { value: 99.4, suffix: '%', label: 'On-time delivery', hint: 'Rolling 24 months', decimals: 1 },
    { value: 48, suffix: 'h', label: 'Quote turnaround', hint: 'Standard enquiries' },
  ],
} as const;

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  href: string;
  /** When present the header renders a mega-menu panel for this entry. */
  columns?: { title: string; items: NavItem[] }[];
  featured?: { title: string; body: string; href: string; cta: string };
};

export const mainNav: NavGroup[] = [
  {
    label: 'Products',
    href: '/products',
    columns: [
      {
        title: 'Structural',
        items: [
          { label: 'Structural Steel', href: '/products/structural-steel' },
          { label: 'Steel Beams', href: '/products/steel-beams' },
          { label: 'Steel Channels', href: '/products/steel-channels' },
          { label: 'Steel Angles', href: '/products/steel-angles' },
        ],
      },
      {
        title: 'Flat & Hollow',
        items: [
          { label: 'Steel Plates', href: '/products/steel-plates' },
          { label: 'Steel Sheets', href: '/products/steel-sheets' },
          { label: 'Steel Tubes', href: '/products/steel-tubes' },
          { label: 'Steel Pipes', href: '/products/steel-pipes' },
        ],
      },
      {
        title: 'Bar & Specialty',
        items: [
          { label: 'Steel Bars', href: '/products/steel-bars' },
          { label: 'Reinforcing Steel', href: '/products/reinforcing-steel' },
          { label: 'Galvanized Steel', href: '/products/galvanized-steel' },
          { label: 'Stainless Steel', href: '/products/stainless-steel' },
        ],
      },
    ],
    featured: {
      title: 'Custom Fabrication',
      body: 'Cut, drilled, coped, welded and finished to your shop drawings — delivered sequenced for erection.',
      href: '/products/custom-fabrication',
      cta: 'Explore fabrication',
    },
  },
  {
    label: 'Industries',
    href: '/industries',
    columns: [
      {
        title: 'Buildings',
        items: [
          { label: 'Commercial', href: '/industries/commercial' },
          { label: 'Residential', href: '/industries/residential' },
          { label: 'Warehousing', href: '/industries/warehousing' },
          { label: 'Construction', href: '/industries/construction' },
        ],
      },
      {
        title: 'Infrastructure',
        items: [
          { label: 'Infrastructure', href: '/industries/infrastructure' },
          { label: 'Bridges', href: '/industries/bridges' },
          { label: 'Transportation', href: '/industries/transportation' },
          { label: 'Government Projects', href: '/industries/government-projects' },
        ],
      },
      {
        title: 'Heavy & Energy',
        items: [
          { label: 'Industrial', href: '/industries/industrial' },
          { label: 'Energy', href: '/industries/energy' },
          { label: 'Manufacturing', href: '/industries/manufacturing' },
          { label: 'Agriculture', href: '/industries/agriculture' },
        ],
      },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    columns: [
      {
        title: 'Supply',
        items: [
          { label: 'Steel Supply', href: '/services/steel-supply' },
          { label: 'Custom Orders', href: '/services/custom-orders' },
          { label: 'Logistics', href: '/services/logistics' },
          { label: 'Delivery', href: '/services/delivery' },
        ],
      },
      {
        title: 'Processing',
        items: [
          { label: 'Fabrication', href: '/services/fabrication' },
          { label: 'Steel Cutting', href: '/services/steel-cutting' },
        ],
      },
      {
        title: 'Advisory',
        items: [
          { label: 'Engineering Support', href: '/services/engineering-support' },
          { label: 'Project Consultation', href: '/services/project-consultation' },
          { label: 'Technical Assistance', href: '/services/technical-assistance' },
        ],
      },
    ],
  },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  {
    label: 'Insights',
    href: '/blog',
    columns: [
      {
        title: 'Company',
        items: [
          { label: 'Blog', href: '/blog' },
          { label: 'Careers', href: '/careers' },
          { label: 'FAQ', href: '/faq' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
  },
];

export const footerNav = [
  {
    title: 'Products',
    items: [
      { label: 'Structural Steel', href: '/products/structural-steel' },
      { label: 'Steel Beams', href: '/products/steel-beams' },
      { label: 'Steel Plates', href: '/products/steel-plates' },
      { label: 'Steel Tubes', href: '/products/steel-tubes' },
      { label: 'Reinforcing Steel', href: '/products/reinforcing-steel' },
      { label: 'All products', href: '/products' },
    ],
  },
  {
    title: 'Industries',
    items: [
      { label: 'Commercial', href: '/industries/commercial' },
      { label: 'Infrastructure', href: '/industries/infrastructure' },
      { label: 'Bridges', href: '/industries/bridges' },
      { label: 'Energy', href: '/industries/energy' },
      { label: 'Warehousing', href: '/industries/warehousing' },
      { label: 'All industries', href: '/industries' },
    ],
  },
  {
    title: 'Services',
    items: [
      { label: 'Steel Supply', href: '/services/steel-supply' },
      { label: 'Fabrication', href: '/services/fabrication' },
      { label: 'Steel Cutting', href: '/services/steel-cutting' },
      { label: 'Engineering Support', href: '/services/engineering-support' },
      { label: 'Logistics', href: '/services/logistics' },
      { label: 'All services', href: '/services' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
] as const;

export const legalNav = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
] as const;
