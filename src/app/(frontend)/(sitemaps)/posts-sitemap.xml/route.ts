import { unstable_cache } from 'next/cache'
import { getServerSideURL } from '@/utilities/getURL'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

const getPostsSitemap = unstable_cache(
  async () => {
    const SITE_URL = getServerSideURL()
    const dateFallback = new Date().toISOString()

    try {
      const payload = await getPayload({ config: configPromise })

      const posts = await payload.find({
        collection: 'posts',
        draft: false,
        limit: 5000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
        depth: 0,
      })

      const postEntries = posts.docs
        .filter((p) => !!p.slug && !p.slug.startsWith('-'))
        .map((p) => ({
          loc: `${SITE_URL}/posts/${p.slug}`,
          lastmod: p.updatedAt ?? dateFallback,
          changefreq: 'monthly',
          priority: 0.6,
        }))

      return [
        {
          loc: `${SITE_URL}/posts`,
          lastmod: dateFallback,
          changefreq: 'weekly',
          priority: 0.7,
        },
        ...postEntries,
      ]
    } catch (error) {
      console.error('Error generating posts sitemap:', error)

      return [
        {
          loc: `${SITE_URL}/posts`,
          lastmod: dateFallback,
          changefreq: 'weekly',
          priority: 0.7,
        },
      ]
    }
  },
  ['posts-sitemap'],
  {
    tags: ['posts-sitemap'],
    revalidate: 3600,
  },
)

export async function GET() {
  const sitemap = await getPostsSitemap()

  // สร้าง XML sitemap แบบ manual เพื่อควบคุม content-type และ XML declaration
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${sitemap
  .map((item) => {
    const changefreq = item.changefreq
      ? `<changefreq>${item.changefreq}</changefreq>`
      : '<changefreq>monthly</changefreq>'
    const priority = item.priority
      ? `<priority>${item.priority}</priority>`
      : '<priority>0.6</priority>'
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
