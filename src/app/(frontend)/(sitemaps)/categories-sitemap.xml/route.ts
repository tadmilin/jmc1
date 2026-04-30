import { getServerSideURL } from '@/utilities/getURL'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

const getCategoriesSitemap = unstable_cache(
  async () => {
    const SITE_URL = getServerSideURL()

    try {
      const payload = await getPayload({ config: configPromise })

      const categories = await payload.find({
        collection: 'categories',
        limit: 1000,
        pagination: false,
        select: {
          slug: true,
          updatedAt: true,
        },
        depth: 0,
      })

      return categories.docs
        .filter((c) => !!c.slug)
        .map((c) => ({
          loc: `${SITE_URL}/categories/${c.slug}`,
          lastmod: c.updatedAt ?? new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        }))
    } catch (error) {
      console.error('Error generating categories sitemap:', error)
      return [
        {
          loc: `${SITE_URL}/categories`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.7,
        },
      ]
    }
  },
  ['categories-sitemap'],
  {
    tags: ['categories-sitemap'],
    revalidate: 3600,
  },
)

export async function GET(): Promise<Response> {
  const sitemap = await getCategoriesSitemap()

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap
  .map(
    (item) =>
      `<url><loc>${item.loc}</loc><lastmod>${item.lastmod}</lastmod><changefreq>${item.changefreq}</changefreq><priority>${item.priority}</priority></url>`,
  )
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
