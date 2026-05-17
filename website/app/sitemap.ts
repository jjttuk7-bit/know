import type { MetadataRoute } from 'next'
import { getAllArticleIds, getPublishedCategories } from '@/lib/db'
import { catToSlug, SITE_URL } from '@/lib/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL

  const articleIds  = getAllArticleIds()
  const categories  = getPublishedCategories()

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily',  priority: 1.0 },
    { url: `${base}/privacy`, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terms`,   changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/dmca`,    changeFrequency: 'yearly',  priority: 0.3 },

    ...categories.map(cat => ({
      url:             `${base}/${catToSlug(cat)}`,
      lastModified:    new Date(),
      changeFrequency: 'daily'  as const,
      priority:        0.9,
    })),

    ...articleIds.map(id => ({
      url:             `${base}/articles/${id}`,
      lastModified:    new Date(),
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    })),
  ]
}
