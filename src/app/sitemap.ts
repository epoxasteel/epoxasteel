import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { productSlugs } from '@/content/products';
import { industrySlugs } from '@/content/industries';
import { serviceSlugs } from '@/content/services';
import { projectSlugs } from '@/content/projects';
import { posts, postCategories } from '@/content/posts';
import { jobSlugs } from '@/content/careers';
import { slugify } from '@/lib/utils';

const BASE = siteConfig.url;

/**
 * Generated from the content layer, so a new product or article appears in the
 * sitemap the moment it is added — there is no second list to keep in step.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}`, changeFrequency: 'weekly', priority: 1, lastModified: now },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${BASE}/products`, changeFrequency: 'weekly', priority: 0.9, lastModified: now },
    { url: `${BASE}/industries`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${BASE}/services`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${BASE}/projects`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${BASE}/quote`, changeFrequency: 'monthly', priority: 0.95, lastModified: now },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.8, lastModified: now },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.75, lastModified: now },
    { url: `${BASE}/careers`, changeFrequency: 'weekly', priority: 0.6, lastModified: now },
    { url: `${BASE}/faq`, changeFrequency: 'monthly', priority: 0.6, lastModified: now },
    { url: `${BASE}/search`, changeFrequency: 'yearly', priority: 0.2, lastModified: now },
    { url: `${BASE}/privacy`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${BASE}/cookies`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { url: `${BASE}/terms`, changeFrequency: 'yearly', priority: 0.3, lastModified: now },
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE}/products/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.85,
    lastModified: now,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industrySlugs.map((slug) => ({
    url: `${BASE}/industries/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: now,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${BASE}/services/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.75,
    lastModified: now,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${BASE}/projects/${slug}`,
    changeFrequency: 'yearly',
    priority: 0.65,
    lastModified: now,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    changeFrequency: 'yearly',
    priority: 0.6,
    lastModified: new Date(`${post.updated ?? post.published}T00:00:00Z`),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = postCategories.map((category) => ({
    url: `${BASE}/blog/category/${slugify(category)}`,
    changeFrequency: 'weekly',
    priority: 0.45,
    lastModified: now,
  }));

  const jobRoutes: MetadataRoute.Sitemap = jobSlugs.map((slug) => ({
    url: `${BASE}/careers/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
    lastModified: now,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...projectRoutes,
    ...postRoutes,
    ...categoryRoutes,
    ...jobRoutes,
  ];
}
