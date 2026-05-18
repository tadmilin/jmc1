import { getServerSideURL } from '@/utilities/getURL'

export async function GET(): Promise<Response> {
  const SITE_URL = getServerSideURL()
  const lastmod = new Date().toISOString()

  const sitemaps = [
    `${SITE_URL}/pages-sitemap.xml`,
    `${SITE_URL}/posts-sitemap.xml`,
    `${SITE_URL}/products-sitemap.xml`,
    `${SITE_URL}/categories-sitemap.xml`,
    `${SITE_URL}/service-areas-sitemap.xml`,
  ]

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((url) => `  <sitemap>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`).join('\n')}
</sitemapindex>`

  return new Response(sitemapIndex, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
