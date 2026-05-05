const _envUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
const SITE_URL =
  (_envUrl && !_envUrl.includes('localhost') ? _envUrl : null) ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ||
  'https://jmc111.vercel.app'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: false, // manual public/robots.txt is used instead
  exclude: [
    '/admin', '/admin/*', '/api/*', '/next/*',
    // จัดการโดย dynamic sitemaps แล้ว — ป้องกัน URL ซ้ำ
    '/products', '/products/*',
    '/posts', '/posts/*',
    '/service-areas', '/service-areas/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        disallow: '/admin/*',
      },
      {
        userAgent: '*',
        disallow: '/api/*',
      },
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/pages-sitemap.xml`,
      `${SITE_URL}/posts-sitemap.xml`,
      `${SITE_URL}/products-sitemap.xml`,
      `${SITE_URL}/categories-sitemap.xml`,
      `${SITE_URL}/service-areas-sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // กรอง slug ที่ไม่ valid (ภาษาไทยที่ convert เป็น - ล้วน)
    const lastSegment = path.split('/').pop() || ''
    if (/^-+$/.test(lastSegment)) return null

    // กำหนด priority และ changefreq
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }

    if (path.startsWith('/products') || path.startsWith('/categories')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }

    if (path.startsWith('/posts')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      }
    }

    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.5,
      lastmod: new Date().toISOString(),
    }
  },
}
