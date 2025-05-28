// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

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
import { getServerSideURL } from '@/utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // CORS settings - ปรับให้ง่ายขึ้น
  cors:
    process.env.NODE_ENV === 'production'
      ? ['https://jmc111.vercel.app', 'https://*.vercel.app']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],

  // CSRF settings - ปรับให้ง่ายขึ้น
  csrf:
    process.env.NODE_ENV === 'production'
      ? ['https://jmc111.vercel.app', 'https://*.vercel.app']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],

  // Secret key setting
  secret: process.env.PAYLOAD_SECRET || '8ecc0ba2b1c8c461f2daba9d',

  // Adapter settings - ลดความซับซ้อน
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  // Set lexicalEditor as the default editor for all rich text fields
  editor: lexicalEditor({}),

  admin: {
    // Admin UI settings
    user: Users.slug,
    meta: {
      titleSuffix: 'จงมีชัยค้าวัสดุ',
    },
    autoLogin: false,
    disable: false,
  },

  // Storage settings
  upload: {
    limits: {
      fileSize: 12000000, // 12MB, written in bytes
    },
  },

  // Global settings
  typescript: {
    outputFile: path.resolve(dirname, './payload-types.ts'),
  },

  // Collection and global configs
  graphQL: {
    disable: true,
  },
  collections: [Categories, Media, Pages, Posts, Products, Users, QuoteRequests],
  globals: [Header, Footer, CategoryShowcase],
  plugins: [
    ...plugins,
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],

  // เพิ่มการตั้งค่าสำหรับ serverURL
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'https://jmc111.vercel.app',
})
