import type { MetadataRoute } from 'next';
import { getBaseUrl } from '../lib/urls/urls';

/**
 * Simplified sitemap with only essential pages in English
 * Only includes key pages that should be indexed by search engines
 */
const essentialRoutes = ['/', '/pricing', '/about', '/contact'];

/**
 * Generate a minimal sitemap for the website
 * Only includes English locale and essential pages
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  return essentialRoutes.map((route) => ({
    url: `${baseUrl}/en${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1.0 : 0.8,
  }));
}
