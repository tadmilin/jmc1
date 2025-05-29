import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  experimental: {
    reactCompiler: false,
  },
  // เพิ่มการตั้งค่าสำหรับ images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jmc111.vercel.app',
        port: '',
        pathname: '/api/media/**',
      },
      // เพิ่ม pattern สำหรับ Vercel preview deployments
      {
        protocol: 'https',
        hostname: 'jmc111-*-tadmilins-projects.vercel.app',
        port: '',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: '*-tadmilins-projects.vercel.app',
        port: '',
        pathname: '/api/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      // Vercel Blob Storage - รองรับทุก subdomain
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      // รองรับ blob storage โดยตรง
      {
        protocol: 'https',
        hostname: 'blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    // การตั้งค่าสำหรับประสิทธิภาพ
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false, // ปิดเพื่อความปลอดภัย
  },
  // เพิ่มการตั้งค่าสำหรับ Vercel deployment
  output: 'standalone',
  // เพิ่ม rewrites สำหรับ admin panel
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
    ]
  },
  // เพิ่มการตั้งค่าสำหรับ headers ที่รองรับ blob storage
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      // เพิ่ม headers สำหรับ admin routes
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
  // เพิ่มการตั้งค่า webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }
    return config
  },
}

export default withPayload(nextConfig)
