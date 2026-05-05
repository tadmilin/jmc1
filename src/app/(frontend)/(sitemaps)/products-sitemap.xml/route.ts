import { getServerSideURL } from '@/utilities/getURL'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

const getProductsSitemap = unstable_cache(
  async () => {
    const SITE_URL = getServerSideURL()

    try {
      const payload = await getPayload({ config: configPromise })

      const products = await payload.find({
        collection: 'products',
        limit: 5000,
        pagination: false,
        where: {
          status: {
            equals: 'active',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
        depth: 0,
      })

      return products.docs
        .filter((p) => !!p.slug && !p.slug.startsWith('-'))
        .map((p) => ({
          loc: `${SITE_URL}/products/${encodeURIComponent(p.slug!)}`,
          lastmod: p.updatedAt ?? new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        }))
    } catch (error) {
      console.error('Error generating products sitemap:', error)
      return [
        {
          loc: `${SITE_URL}/products`,
          lastmod: new Date().toISOString(),
          changefreq: 'weekly',
          priority: 0.8,
        },
      ]
    }
  },
  ['products-sitemap'],
  {
    tags: ['products-sitemap'],
    revalidate: 3600,
  },
)

export async function GET(): Promise<Response> {
  const sitemap = await getProductsSitemap()

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
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
