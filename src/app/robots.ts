import { MetadataRoute } from 'next'
import { getAppUrl } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/admin/', '/api/'],
    },
    sitemap: `${getAppUrl()}/sitemap.xml`,
  }
}
