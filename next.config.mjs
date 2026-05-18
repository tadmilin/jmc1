import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false,
  },
  // ข้าม TypeScript checking เหมือน production
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // เพิ่ม serverExternalPackages สำหรับ Payload (ใช้อันนี้แทน experimental.serverComponentsExternalPackages)
  serverExternalPackages: ['payload', 'mongodb', 'sharp'],
  // การ optimize สำหรับ production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Images configuration for PayloadCMS v3 + Vercel Blob Storage
  images: {
    remotePatterns: [
      // Development - PayloadCMS collections API
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/collections/**',
      },
      // Production - dynamic hostname from env (Railway or custom domain)
      ...((() => {
        try {
          const h = process.env.NEXT_PUBLIC_SERVER_URL
          return h ? [{ protocol: 'https', hostname: new URL(h).hostname, pathname: '/api/collections/**' }] : []
        } catch { return [] }
      })()),
      // Railway public domain fallback
      ...(process.env.RAILWAY_PUBLIC_DOMAIN
        ? [
            {
              protocol: 'https',
              hostname: process.env.RAILWAY_PUBLIC_DOMAIN,
              pathname: '/api/collections/**',
            },
          ]
        : []),
      // Vercel Blob Storage (kept for legacy media fallback)
      {
        protocol: 'https',
        hostname: '**.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
        pathname: '/**',
      },
      // Cloudflare R2 — รูปจาก import script
      {
        protocol: 'https',
        hostname: '**.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
    // Optimization settings
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache for blob storage
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 301 permanent redirects — ส่ง SEO juice จาก domain เก่าทั้งหมดมาที่ jongmeechai.com
  async redirects() {
    return [
      // 301 ส่ง SEO juice จาก domain เก่า
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'jmc111.vercel.app' }],
        destination: 'https://jongmeechai.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'jmc1-production.up.railway.app' }],
        destination: 'https://jongmeechai.com/:path*',
        permanent: true,
      },

      // 301 จาก URL โครงสร้างเก่า /iron/[slug] → /products/[slug]
      // (Google พบ URL เหล่านี้ใน GSC เป็น 404)
      {
        source: '/iron/:slug*',
        destination: '/products/:slug*',
        permanent: true,
      },

      // 301 จาก root-level Thai slug ที่ไม่มี prefix → /products/[slug]
      // ครอบคลุม URL เช่น /เหลกแผนดำ /อิฐแดง ฯลฯ ที่เคยมี
      {
        source: '/เหลกแผนดำ',
        destination: '/products/เหลกแผนดำ',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
          {
            key: 'X-Robots-Tag',
            value: 'all',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value:
              process.env.NODE_ENV === 'development'
                ? '*'
                : process.env.NEXT_PUBLIC_SERVER_URL || '',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-API-Key',
          },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ]
  },
  // Webpack configuration for PayloadCMS v3
  webpack: (config, { isServer }) => {
    // Client-side fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
      }
    }

    return config
  },
}

export default withPayload(nextConfig)
