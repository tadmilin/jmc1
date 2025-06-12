// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import sharp from 'sharp'

import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { QuoteRequests } from './collections/QuoteRequests'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { CategoryShowcase } from './CategoryShowcase/config'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://jmc111.vercel.app'

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- จงมีชัยค้าวัสดุ',
    },
    autoLogin: false,
    disable: false,
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
  cors: [
    'https://jmc111.vercel.app',
    'https://jmc111-git-main-tadmilins-projects.vercel.app',
    'https://jmc111-mv7jkkd-tadmilins-projects.vercel.app',
    ...(process.env.NODE_ENV === 'development' ? [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ] : []),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ].filter(Boolean),
  csrf: [
    'https://jmc111.vercel.app',
    'https://jmc111-git-main-tadmilins-projects.vercel.app',
    'https://jmc111-mv7jkkd-tadmilins-projects.vercel.app',
    ...(process.env.NODE_ENV === 'development' ? [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ] : []),
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ].filter(Boolean),

  // Secret key setting
  secret: process.env.PAYLOAD_SECRET || '8ecc0ba2b1c8c461f2daba9d',

  // Adapter settings
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
    connectOptions: {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 30000, // เพิ่มเวลา timeout
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000, // เพิ่มเวลา timeout
      bufferCommands: false,
      autoIndex: true,
      family: 4, // Use IPv4, skip trying IPv6
    },
  }),

  // Set lexicalEditor as the default editor
  editor: lexicalEditor({}),

  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },

  typescript: {
    outputFile: path.resolve(dirname, './payload-types.ts'),
  },

  graphQL: {
    disable: true,
  },

  // Callback สำหรับ debug และ logging
  onInit: async (payload) => {
    if (process.env.NODE_ENV === 'production') {
      payload.logger.info('🚀 Payload CMS initialized in production mode')
      payload.logger.info(`📊 Server URL: ${serverURL}`)
      payload.logger.info(`🗄️ Database connected: ${process.env.DATABASE_URI ? 'Yes' : 'No'}`)
      payload.logger.info(`🔐 Admin Panel: ${serverURL}/admin`)
    }
  },

  collections: [Categories, Media, Pages, Posts, Products, Users, QuoteRequests],
  globals: [Header, Footer, CategoryShowcase],
  plugins: [
    ...plugins,
    // ใช้ Vercel Blob Storage เฉพาะใน production
    ...(process.env.NODE_ENV === 'production' ? [
      vercelBlobStorage({
        enabled: true,
        collections: {
          media: true,
        },
        token: process.env.BLOB_READ_WRITE_TOKEN || '',
        addRandomSuffix: true,
        cacheControlMaxAge: 365 * 24 * 60 * 60,
        clientUploads: true,
      })
    ] : []),
  ],
})
