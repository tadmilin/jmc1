
import { unstable_cache } from 'next/cache'

const getPagesSitemap = unstable_cache(
  async () => {
    try {
      const SITE_URL =
        process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.VERCEL_PROJECT_PRODUCTION_URL ||
        'https://jmc111.vercel.app'

      const dateFallback = new Date().toISOString()

      // ใช้ fallback data ที่ถูกต้องแทน เพื่อหลีกเลี่ยง URL ซ้ำ
      const sitemap = [
        {
          loc: `${SITE_URL}/`,
          lastmod: dateFallback,
          changefreq: 'daily',
          priority: 1.0,
        },
        {
          loc: `${SITE_URL}/search`,
          lastmod: dateFallback,
          changefreq: 'weekly',
          priority: 0.5,
        },
        {
          loc: `${SITE_URL}/posts`,
          lastmod: dateFallback,
          changefreq: 'weekly',
          priority: 0.7,
        },
        {
          loc: `${SITE_URL}/construction-materials-near-me`,
          lastmod: dateFallback,
          priority: 0.9,
          changefreq: 'weekly',
        },
        {
          loc: `${SITE_URL}/aboutus`,
          lastmod: dateFallback,
          changefreq: 'monthly',
          priority: 0.6,
        },
        {
          loc: `${SITE_URL}/contact`,
          lastmod: dateFallback,
          changefreq: 'monthly',
          priority: 0.7,
        },
        {
          loc: `${SITE_URL}/quotation`,
          lastmod: dateFallback,
          changefreq: 'monthly',
          priority: 0.6,
        },
        {
          loc: `${SITE_URL}/calculator`,
          lastmod: dateFallback,
          changefreq: 'monthly',
          priority: 0.5,
        },
      ]

      return sitemap
    } catch (error) {
      console.error('Error generating pages sitemap:', error)

      // Emergency fallback
      const SITE_URL =
        process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.VERCEL_PROJECT_PRODUCTION_URL ||
        'https://jmc111.vercel.app'

      const dateFallback = new Date().toISOString()

      return [
        {
          loc: `${SITE_URL}/`,
          lastmod: dateFallback,
          changefreq: 'daily',
          priority: 1.0,
        },
        {
          loc: `${SITE_URL}/aboutus`,
          lastmod: dateFallback,
          changefreq: 'monthly',
          priority: 0.6,
        },
        {
          loc: `${SITE_URL}/contact`,
          lastmod: dateFallback,
          changefreq: 'monthly',
          priority: 0.7,
        },
      ]
    }
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
    revalidate: 3600, // 1 hour
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  // สร้าง XML sitemap แบบ manual เพื่อควบคุม content-type และ XML declaration
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${sitemap
  .map((item) => {
    const priority = item.priority
      ? `<priority>${item.priority}</priority>`
      : '<priority>0.5</priority>'
    const changefreq = item.changefreq
      ? `<changefreq>${item.changefreq}</changefreq>`
      : '<changefreq>monthly</changefreq>'
    return `<url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod>${changefreq}${priority}</url>`
  })
  .join('\n')}
</urlset>`

  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
