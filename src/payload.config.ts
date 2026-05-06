// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { s3Storage } from '@payloadcms/storage-s3'

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

// DATABASE_URI validation — defensive, NOT throwing at module load
// Throwing here breaks `next build` page-data collection because the layout
// transitively imports this config. Mongoose will throw a real connection
// error at runtime if the URI is missing/invalid — that's the right place.
const databaseUri = process.env.DATABASE_URI
if (!databaseUri && process.env.NODE_ENV === 'production') {
  console.error(
    '⚠️  DATABASE_URI not set — runtime DB calls will fail until configured in Railway',
  )
} else if (!databaseUri) {
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
      // Railway = persistent server → higher pool is safe and improves throughput.
      // Vercel serverless needed maxPoolSize:1 to avoid exhausting Atlas M0 (500 conn limit).
      // With Railway's single always-on instance, 5 connections is comfortable and
      // leaves headroom for future scaling (Atlas M0 limit: 500 total).
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE || '5'),
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE || '1'),
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
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
    s3Storage({
      collections: {
        media: {
          prefix: 'jmc',
        },
      },
      bucket: process.env.R2_BUCKET_NAME || process.env.R2_BUCKET || '',
      config: {
        endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
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
