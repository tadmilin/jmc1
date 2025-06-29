import { getServerSideURL } from '@/utilities/getURL'

const serviceAreas = ['pinklao', 'jaran', 'bangkunnon', 'borom', 'suanphak', 'rama5', 'bangkruai']

export async function GET(): Promise<Response> {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${serviceAreas
  .map((area) => {
    return `  <url>
    <loc>${getServerSideURL()}/service-areas/${area}</loc>
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
