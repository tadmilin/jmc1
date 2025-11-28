import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
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
      // Production - PayloadCMS collections API
      {
        protocol: 'https',
        hostname: 'jmc111.vercel.app',
        pathname: '/api/collections/**',
      },
      // Vercel Blob Storage - Direct access
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
    ],
    // Optimization settings
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year cache for blob storage
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // PayloadCMS v3 handles admin routes automatically - no rewrites needed
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate, s-maxage=60, stale-while-revalidate=300',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding, User-Agent',
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
            value: process.env.NODE_ENV === 'development' ? '*' : 'https://jmc111.vercel.app',
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
