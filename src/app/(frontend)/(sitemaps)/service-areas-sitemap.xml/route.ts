import { getServerSideURL } from '@/utilities/getURL'

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

export async function GET(): Promise<Response> {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${serviceAreas
  .map((area) => {
    return `  <url>
    <loc>${getServerSideURL()}/service-areas/${area.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  })
  .join('\n')}
</urlset>`

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
