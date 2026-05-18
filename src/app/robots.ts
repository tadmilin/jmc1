import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getServerSideURL()

  return {
    rules: [
      {
        userAgent: '*',
        // อนุญาตรูปภาพสินค้าทั้งสอง path pattern ที่ Payload v3 ใช้จริง
        allow: ['/', '/api/media/file/', '/api/collections/media/file/'],
        disallow: ['/admin/', '/api/admin-status', '/api/env-check', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
