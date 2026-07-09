import { MetadataRoute } from 'next'
import { getAppUrl } from '@/lib/env'

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getAppUrl()

  return [
    {
      url: `${url}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${url}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${url}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${url}/compliance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
