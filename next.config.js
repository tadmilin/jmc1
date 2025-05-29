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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      // เพิ่ม Vercel Blob Storage - ปรับปรุงให้ครอบคลุมมากขึ้น
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
      // เพิ่ม pattern สำหรับ blob storage ที่เฉพาะเจาะจงมากขึ้น
      {
        protocol: 'https',
        hostname: 'fzhrisgdjt706ftr.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    // เพิ่มการตั้งค่าเพิ่มเติมสำหรับ Vercel Blob Storage
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
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
