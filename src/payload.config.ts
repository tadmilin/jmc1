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
import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Production URL handling
const serverURL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- จงมีชัยค้าวัสดุ',
    },
  },

  // Secret key setting
  secret: process.env.PAYLOAD_SECRET || '8ecc0ba2b1c8c461f2daba9d',

  // Simplified database configuration
  collections: [Categories, Media, Pages, Posts, Products, Users, QuoteRequests],

  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  // Set lexicalEditor as the default editor
  editor: lexicalEditor({}),

  upload: {
    limits: {
      fileSize: 5000000, // 5MB
    },
  },

  // เพิ่ม sharp configuration สำหรับ image resizing
  sharp,

  typescript: {
    outputFile: path.resolve(dirname, './payload-types.ts'),
  },

  globals: [Header, Footer, CategoryShowcase, SiteSettings],
  cors: [serverURL].filter(Boolean),
  plugins: [
    ...plugins,
    // ใช้ Vercel Blob Storage ถ้ามี token (ทั้ง dev และ production)
    ...(process.env.BLOB_READ_WRITE_TOKEN
      ? [
          vercelBlobStorage({
            enabled: true,
            collections: {
              media: {
                prefix: 'media',
                generateFileURL: ({ filename, prefix }) => {
                  // Vercel Blob Storage จะให้ prefix (absolute URL) เสมอ
                  if (prefix) {
                    return `${prefix}/${filename}`
                  }
                  // สำหรับ development ที่อาจไม่มี Blob Storage
                  // ควรไม่เกิดขึ้นใน production แต่เก็บเป็น fallback
                  return `${serverURL}/api/collections/media/file/${filename}`
                },
              },
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
            addRandomSuffix: true,
            cacheControlMaxAge: 365 * 24 * 60 * 60,
            clientUploads: false,
          }),
        ]
      : []),
  ],
})
