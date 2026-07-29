/** Shared shapes for the file-based content layer.
 *
 * Content lives in typed TypeScript modules rather than a CMS so the whole
 * catalogue is statically analysable, fully type-checked and pre-rendered at
 * build time. `docs/CMS.md` describes the swap to a headless CMS later — the
 * page components only ever touch the accessor functions in each module, so
 * the data source can change without touching the UI.
 */

export type SpecRow = {
  label: string;
  value: string;
};

export type SpecTable = {
  title: string;
  caption?: string;
  columns: string[];
  rows: string[][];
};

export type Download = {
  label: string;
  description: string;
  /** File size hint shown in the UI, e.g. "1.8 MB". */
  size: string;
  format: 'PDF' | 'DWG' | 'XLSX' | 'ZIP';
  href: string;
};

export type ProductCategory =
  | 'Structural'
  | 'Flat Products'
  | 'Hollow Sections'
  | 'Bar & Reinforcement'
  | 'Coated & Stainless'
  | 'Fabrication';

export type Product = {
  slug: string;
  name: string;
  category: ProductCategory;
  /** One line, used on cards and in the mega-menu. */
  tagline: string;
  /** 1–2 sentences, used for meta descriptions and card bodies. */
  summary: string;
  /** Long-form body paragraphs for the detail page. */
  overview: string[];
  /** Headline attributes rendered as a definition grid. */
  keyFacts: SpecRow[];
  grades: string[];
  standards: string[];
  finishes: string[];
  applications: string[];
  /** Industry slugs this product commonly serves. */
  industries: string[];
  dimensions: SpecTable;
  downloads: Download[];
  related: string[];
  /** Drives the generated profile illustration. */
  profile: ProfileShape;
  featured?: boolean;
};

/** Cross-sections drawn by the SteelProfile component. */
export type ProfileShape =
  | 'i-beam'
  | 'channel'
  | 'angle'
  | 'plate'
  | 'sheet'
  | 'round-tube'
  | 'square-tube'
  | 'pipe'
  | 'round-bar'
  | 'rebar'
  | 'galvanized'
  | 'stainless'
  | 'fabrication';

export type Industry = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  overview: string[];
  /** What the sector demands and how Epoxa answers it. */
  challenges: { title: string; body: string }[];
  products: string[];
  services: string[];
  stats: { value: string; label: string }[];
  icon: IndustryIcon;
  featured?: boolean;
};

export type IndustryIcon =
  | 'building'
  | 'home'
  | 'bridge'
  | 'factory'
  | 'warehouse'
  | 'road'
  | 'energy'
  | 'crane'
  | 'tractor'
  | 'landmark'
  | 'train'
  | 'gear';

export type Service = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  overview: string[];
  /** Numbered delivery steps shown as a timeline. */
  process: { title: string; body: string }[];
  capabilities: string[];
  deliverables: string[];
  relatedProducts: string[];
  icon: ServiceIcon;
  featured?: boolean;
};

export type ServiceIcon =
  | 'supply'
  | 'fabrication'
  | 'cutting'
  | 'custom'
  | 'engineering'
  | 'consultation'
  | 'logistics'
  | 'delivery'
  | 'support';

export type Project = {
  slug: string;
  name: string;
  client: string;
  location: string;
  country: string;
  industry: string;
  year: string;
  timeline: string;
  scale: string;
  summary: string;
  overview: string[];
  challenge: string;
  solution: string;
  outcome: string;
  productsUsed: string[];
  servicesUsed: string[];
  metrics: { value: string; label: string }[];
  /** Seeds for the generated project artwork. */
  gallery: { caption: string; seed: number }[];
  featured?: boolean;
};

export type PostCategory =
  'Engineering' | 'Market Insight' | 'Sustainability' | 'Company News' | 'Project Story';

export type Post = {
  slug: string;
  title: string;
  category: PostCategory;
  excerpt: string;
  published: string;
  updated?: string;
  author: { name: string; role: string };
  /** Lightweight markdown: ##, ###, paragraphs, - lists, > quotes, **bold**. */
  body: string;
  tags: string[];
  featured?: boolean;
};

export type Faq = {
  question: string;
  answer: string;
  category: 'Ordering' | 'Products' | 'Delivery' | 'Quality' | 'Payment' | 'Support';
};

export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  posted: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  project?: string;
};
