// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { QuoteRequests } from './collections/QuoteRequests'
import { Footer } from './Footer/config'
import { Header } from './Header/config'

import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'
import { defaultLexical } from './fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Ensure DATABASE_URI is provided for production
const databaseUri = process.env.DATABASE_URI
if (!databaseUri) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URI environment variable is required for production')
  }
  console.warn('DATABASE_URI not provided, using fallback for development')
}

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      // beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      // beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url:
      databaseUri ||
      (process.env.NODE_ENV === 'development' ? 'mongodb://localhost:27017/jmc-dev' : ''),
    connectOptions: {
      // M0 Free Tier = 500 connections max
      // Serverless rule: maxPoolSize: 1 → supports 500 concurrent instances safely
      // (maxPoolSize: 10 = only 50 instances before hitting limit)
      maxPoolSize: 1,
      minPoolSize: 0, // close idle connections immediately — critical for serverless
      maxIdleTimeMS: 10000, // release connection after 10s idle
      serverSelectionTimeoutMS: 5000, // fail fast, don't hold connection waiting
      socketTimeoutMS: 30000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority',
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users, Products, QuoteRequests],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer, SiteSettings],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
    // Vercel Blob เป็น primary adapter สำหรับ admin uploads + reads รูปเก่า
    // (รูปเก่าถูกอัปโหลดเข้า Vercel Blob — URL ใน DB ชี้ไป *.public.blob.vercel-storage.com)
    // รูปใหม่จาก import script → upload ตรงเข้า R2 ผ่าน S3 SDK (bypass adapter นี้)
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      addRandomSuffix: true,
      cacheControlMaxAge: 365 * 24 * 60 * 60,
      clientUploads: true,
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // jobs disabled — no tasks defined, prevents unnecessary Vercel Cron connections
  // jobs: { ... },
  async onInit(payload) {
    // Only seed in development
    if (process.env.NODE_ENV === 'development') {
      const existingUsers = await payload.find({
        collection: 'users',
        limit: 1,
      })

      if (existingUsers.docs.length === 0) {
        await payload.create({
          collection: 'users',
          data: {
            name: 'Dev Admin',
            email: 'dev@payloadcms.com',
            password: 'test',
            role: 'admin',
          },
        })
      }
    }
  },
})
