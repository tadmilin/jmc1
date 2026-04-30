import { getServerSideURL } from '@/utilities/getURL'
import { unstable_cache } from 'next/cache'

const serviceAreas = [
  { thai: 'ปิ่นเกล้า', slug: 'pinklao' },
  { thai: 'จรัญสนิทวงศ์', slug: 'jaran' },
  { thai: 'บางขุนนนท์', slug: 'bangkunnon' },
  { thai: 'บรม', slug: 'borom' },
  { thai: 'สวนผัก', slug: 'suanphak' },
  { thai: 'พระราม5', slug: 'rama5' },
  { thai: 'บางกรวย', slug: 'bangkruai' },
  { thai: 'ตลิ่งชัน', slug: 'talingchan' },
  { thai: 'บางพลัด', slug: 'bangphlat' },
  { thai: 'ธนบุรี', slug: 'thonburi' },
]

const getServiceAreasSitemap = unstable_cache(
  async () => {
    const SITE_URL = getServerSideURL()
    const lastmod = new Date().toISOString()

    return serviceAreas.map((area) => ({
      loc: `${SITE_URL}/service-areas/${area.slug}`,
      lastmod,
    }))
  },
  ['service-areas-sitemap'],
  {
    tags: ['service-areas-sitemap'],
    revalidate: 86400, // revalidate ทุก 24 ชั่วโมง
  },
)

export async function GET(): Promise<Response> {
  const SITE_URL = getServerSideURL()
  const items = await getServiceAreasSitemap()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
