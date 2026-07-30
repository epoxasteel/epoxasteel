/**
 * Single source of truth for company facts, contact details and navigation.
 * Everything that appears in more than one place — the footer, the schema.org
 * payloads, e-mail templates — reads from here.
 *
 * ## Everything here can be changed without touching code
 *
 * Every business fact below has a `NEXT_PUBLIC_*` variable behind it, with the
 * current value as the fallback. Move offices, change the phone number, add a
 * social account: set the variable and redeploy. `.env.example` lists them all.
 *
 * They are `NEXT_PUBLIC_` because this file is imported by client components — the
 * footer, the dock, the assistant panel — and a variable without that prefix is
 * simply undefined in the browser, which would render an empty phone number rather
 * than a wrong one. Nothing here is a secret; it is all on the page already.
 *
 * Each is written out as a literal `process.env.NEXT_PUBLIC_THING` on purpose.
 * Next inlines those at build time by textual substitution, so a lookup through a
 * variable key (`process.env[name]`) is never replaced and would silently be
 * undefined in the browser. A helper that took a key would look tidier and would
 * not work.
 */

/**
 * Trims, and treats an empty or whitespace-only variable as unset.
 *
 * The right behaviour for a fact the site cannot do without. An empty company name
 * or a blank phone number is worse than a stale one, so a variable set to nothing
 * is read as a mistake and the fallback stands.
 */
function text(value: string | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

/**
 * Like `text`, but an explicitly empty variable means "there isn't one".
 *
 * For things a business may genuinely not have — a YouTube channel, an X account.
 * `undefined` (never set) falls back; `""` (set to nothing) returns empty, and the
 * caller hides the link.
 *
 * The distinction survives the build: Next substitutes a defined `NEXT_PUBLIC_`
 * variable with its literal value, so an empty one is inlined as `""` and an unset
 * one resolves to `undefined`. `text()` alone could not tell those apart, which is
 * how `NEXT_PUBLIC_YOUTUBE_URL=""` was still rendering a YouTube icon.
 */
function optionalText(value: string | undefined, fallback: string) {
  if (value === undefined) return fallback;
  return value.trim();
}

function number(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Opening hours, as `Days|Time` pairs separated by semicolons:
 *
 *   NEXT_PUBLIC_BUSINESS_HOURS="Mon – Fri|07:00 – 18:00;Saturday|08:00 – 14:00"
 *
 * A compact string rather than five variables, because these lines are read
 * together and a business with different opening days should not need a code
 * change to say so. Malformed entries are dropped rather than rendered as debris,
 * and if nothing survives the default stands — an empty opening-hours block on a
 * supplier's contact page is worse than a stale one.
 */
function parseHours(value: string | undefined, fallback: { days: string; time: string }[]) {
  if (!value?.trim()) return fallback;

  const parsed = value
    .split(';')
    .map((entry) => entry.split('|').map((part) => part.trim()))
    .filter(
      (parts): parts is [string, string] => parts.length === 2 && Boolean(parts[0] && parts[1]),
    )
    .map(([days, time]) => ({ days, time }));

  return parsed.length ? parsed : fallback;
}

const phone = text(process.env.NEXT_PUBLIC_CONTACT_PHONE, '+1 (212) 555-0180');

/**
 * The `tel:` form, derived rather than configured.
 *
 * It used to be its own field, which meant two variables that had to agree and
 * would eventually not — a corrected display number with a stale dial link is a
 * bug nobody notices until a customer reaches the wrong company.
 */
function dialable(display: string) {
  const digits = display.replace(/[^\d]/g, '');
  return display.trim().startsWith('+') ? `+${digits}` : digits;
}

export const siteConfig = {
  name: text(process.env.NEXT_PUBLIC_COMPANY_NAME, 'EPOXA STEEL'),
  legalName: text(process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME, 'Epoxa Steel'),
  shortName: text(process.env.NEXT_PUBLIC_COMPANY_SHORT_NAME, 'Epoxa'),
  domain: text(process.env.NEXT_PUBLIC_SITE_DOMAIN, 'epoxasteel.com'),
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '') || 'https://epoxasteel.com',
  tagline: text(process.env.NEXT_PUBLIC_COMPANY_TAGLINE, 'Reinforce Your Dream.'),
  description:
    'EPOXA STEEL supplies certified structural steel, plate, tube and reinforcement to commercial, residential and infrastructure projects worldwide — backed by in-house fabrication, mill-traceable documentation and schedule-driven logistics.',
  shortDescription:
    'Certified structural steel supply, fabrication and delivery for commercial, residential and infrastructure construction.',
  founded: text(process.env.NEXT_PUBLIC_COMPANY_FOUNDED, '2009'),
  locale: text(process.env.NEXT_PUBLIC_SITE_LOCALE, 'en_US'),

  contact: {
    email: text(process.env.NEXT_PUBLIC_CONTACT_EMAIL, 'info@epoxasteel.com'),
    salesEmail: text(process.env.NEXT_PUBLIC_SALES_EMAIL, 'sales@epoxasteel.com'),
    quotesEmail: text(process.env.NEXT_PUBLIC_QUOTES_EMAIL, 'quotes@epoxasteel.com'),
    careersEmail: text(process.env.NEXT_PUBLIC_CAREERS_EMAIL, 'careers@epoxasteel.com'),
    phone,
    phoneHref: dialable(phone),
    /** Digits only, no plus — what wa.me expects. */
    whatsapp: text(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, dialable(phone).replace(/^\+/, '')),
    hours: parseHours(process.env.NEXT_PUBLIC_BUSINESS_HOURS, [
      { days: 'Monday – Friday', time: '07:00 – 18:00' },
      { days: 'Saturday', time: '08:00 – 14:00' },
      { days: 'Sunday', time: 'Closed — emergency dispatch available' },
    ]),
  },

  address: {
    line1: text(process.env.NEXT_PUBLIC_ADDRESS_LINE1, 'Epoxa Steel Center'),
    line2: text(process.env.NEXT_PUBLIC_ADDRESS_LINE2, '1180 Ironworks Parkway, Building C'),
    city: text(process.env.NEXT_PUBLIC_ADDRESS_CITY, 'Newark'),
    region: text(process.env.NEXT_PUBLIC_ADDRESS_REGION, 'NJ'),
    postalCode: text(process.env.NEXT_PUBLIC_ADDRESS_POSTAL_CODE, '07114'),
    country: text(process.env.NEXT_PUBLIC_ADDRESS_COUNTRY, 'United States'),
    countryCode: text(process.env.NEXT_PUBLIC_ADDRESS_COUNTRY_CODE, 'US'),
    // LocalBusiness schema.
    latitude: number(process.env.NEXT_PUBLIC_ADDRESS_LATITUDE, 40.6895),
    longitude: number(process.env.NEXT_PUBLIC_ADDRESS_LONGITUDE, -74.1745),
    /**
     * The link the map card opens.
     *
     * Configurable because a business with a Google Business Profile wants its own
     * listing — reviews, photos, opening hours — not a coordinate search that
     * drops a pin in a car park. Falls back to a search for the address, which is
     * always correct if never ideal.
     */
    mapsUrl: process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL?.trim() || '',
  },

  /**
   * Social accounts. An empty value hides the link rather than rendering a dead
   * one — a footer icon that leads to somebody else's abandoned handle is worse
   * than one fewer icon.
   */
  social: {
    linkedin: optionalText(
      process.env.NEXT_PUBLIC_LINKEDIN_URL,
      'https://www.linkedin.com/company/epoxasteel',
    ),
    instagram: optionalText(
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      'https://www.instagram.com/epoxasteel',
    ),
    facebook: optionalText(
      process.env.NEXT_PUBLIC_FACEBOOK_URL,
      'https://www.facebook.com/epoxasteel',
    ),
    x: optionalText(process.env.NEXT_PUBLIC_X_URL, 'https://x.com/epoxasteel'),
    youtube: optionalText(
      process.env.NEXT_PUBLIC_YOUTUBE_URL,
      'https://www.youtube.com/@epoxasteel',
    ),
  },

  /** Headline numbers used by the animated statistics blocks. */
  /**
   * `display` overrides the formatted figure where the full number is too long
   * to be a headline. "1,400,000+" ran past the edge of its own tile and had
   * the plus sign clipped off; a headline figure has to be readable at a
   * glance, and the precise number is stated in the copy beside it anyway.
   */
  stats: [
    { value: 1400000, suffix: '+', display: '1.4M+', label: 'Tonnes supplied', hint: 'Since 2009' },
    { value: 2600, suffix: '+', label: 'Projects delivered', hint: 'Across 34 countries' },
    { value: 99.4, suffix: '%', label: 'On-time delivery', hint: 'Rolling 24 months', decimals: 1 },
    { value: 48, suffix: 'h', label: 'Quote turnaround', hint: 'Standard enquiries' },
  ],
} as const;

/** The full postal address on one line, as a map service or a label wants it. */
export function formattedAddress() {
  const { line1, line2, city, region, postalCode } = siteConfig.address;
  return `${line1}, ${line2}, ${city}, ${region} ${postalCode}`;
}

/**
 * Where the map card goes.
 *
 * `NEXT_PUBLIC_GOOGLE_MAPS_URL` wins so a business can point at its own Google
 * Business Profile — reviews, photos, the correct entrance. Without one, a search
 * for the address, which is always right if never as good.
 */
export function mapsHref() {
  return (
    siteConfig.address.mapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedAddress())}`
  );
}

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
    /*
     * Every mega panel carries a featured card. Without one the columns
     * stretched across the full panel width and left a third of it empty, so
     * the menu looked different depending on which item you hovered. It is also
     * the one place in the navigation where we get to make an argument rather
     * than just list destinations.
     */
    featured: {
      title: 'Bridges & infrastructure',
      body: 'Fracture-critical fabrication under third-party inspection, with full traceability from mill to span.',
      href: '/industries/bridges',
      cta: 'See the work',
    },
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
    featured: {
      title: 'Engineering support',
      body: 'Chartered engineers who review buildability and cost before the package is frozen — calculations attached.',
      href: '/services/engineering-support',
      cta: 'Talk to an engineer',
    },
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
    featured: {
      title: 'Working at EPOXA',
      body: 'Detailers, coded welders, CNC operators and project engineers — we are hiring across the shop and the office.',
      href: '/careers',
      cta: 'See open roles',
    },
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
  { label: 'Cookie Notice', href: '/cookies' },
  { label: 'Terms & Conditions', href: '/terms' },
] as const;
