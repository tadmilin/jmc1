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
  // CORS settings - เพิ่ม specific preview deployment URLs
  cors: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://jmc111.vercel.app',
    'https://jmc111-mepahkukj-tadmilins-projects.vercel.app',
    'https://jmc111-1isqubvbp-tadmilins-projects.vercel.app',
    'https://*.vercel.app',
    'https://vercel.app',
    // เพิ่ม blob storage domains
    'https://*.public.blob.vercel-storage.com',
    'https://*.blob.vercel-storage.com',
  ],

  // CSRF settings - เพิ่ม specific preview deployment URLs
  csrf: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://jmc111.vercel.app',
    'https://jmc111-mepahkukj-tadmilins-projects.vercel.app',
    'https://jmc111-1isqubvbp-tadmilins-projects.vercel.app',
    'https://*.vercel.app',
    'https://vercel.app',
    // เพิ่ม blob storage domains
    'https://*.public.blob.vercel-storage.com',
    'https://*.blob.vercel-storage.com',
  ],

  // Secret key setting
  secret: process.env.PAYLOAD_SECRET || '8ecc0ba2b1c8c461f2daba9d',

  // Adapter settings - ปรับปรุงการเชื่อมต่อ MongoDB
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
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    },
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
    // ปรับปรุงการตั้งค่า Vercel Blob Storage ตามเอกสาร
    vercelBlobStorage({
      enabled: true, // เปิดใช้งาน plugin
      collections: {
        media: true, // ใช้กับ media collection
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      addRandomSuffix: false, // ไม่เพิ่ม random suffix
      cacheControlMaxAge: 365 * 24 * 60 * 60, // 1 year cache
      clientUploads: true, // สำคัญ: เปิดใช้ client uploads เพื่อหลีกเลี่ยงข้อจำกัด 4.5MB ของ Vercel
    }),
  ],

  // เพิ่มการตั้งค่าสำหรับ serverURL
  serverURL:
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (process.env.NODE_ENV === 'production' ? 'https://jmc111.vercel.app' : 'http://localhost:3000'),
})
