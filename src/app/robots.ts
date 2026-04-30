import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getServerSideURL()

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/api/collections/media/file/'],
      disallow: ['/admin/', '/api/'],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/pages-sitemap.xml`,
      `${baseUrl}/posts-sitemap.xml`,
      `${baseUrl}/products-sitemap.xml`,
      `${baseUrl}/categories-sitemap.xml`,
      `${baseUrl}/service-areas-sitemap.xml`,
    ],
    host: baseUrl,
  }
}
