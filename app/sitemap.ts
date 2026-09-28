import type { MetadataRoute } from 'next'
import { getCodes, getDashboardIcons } from '@/lib/content'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pit.codes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [codes, icons] = await Promise.all([getCodes(), getDashboardIcons()])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/codes`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE}/dash-lights`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE}/articles`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE}/affiliate-disclaimer`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE}/contact-us`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const codeRoutes: MetadataRoute.Sitemap = codes.map((c) => ({
    url: `${SITE}/codes/${c.code.toUpperCase()}`,
    changeFrequency: 'monthly' as const,
    priority: c.searchPriority && c.searchPriority <= 20 ? 0.9 : 0.6,
  }))

  const iconRoutes: MetadataRoute.Sitemap = icons.map((i) => ({
    url: `${SITE}${i.permalink ?? `/dash-lights/${i.id}`}`,
    changeFrequency: 'monthly' as const,
    priority: i.searchPriority && i.searchPriority <= 20 ? 0.85 : 0.55,
  }))

  return [...staticRoutes, ...codeRoutes, ...iconRoutes]
}
