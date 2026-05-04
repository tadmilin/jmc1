/**
 * สคริปนำเข้า/อัปเดตสินค้าจาก CSV (export จาก Google Sheets)
 *
 * วิธีใช้:
 *   1. Export Google Sheets เป็น CSV → ใส่ที่ scripts/products.csv
 *   2. ลากรูปใส่ scripts/images/ ตั้งชื่อไฟล์ = SKU เช่น PVC-4IN.jpg
 *   3. รัน: pnpm import:products
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import sharp from 'sharp'

// โหลด env ก่อนที่จะ import payload.config (สำคัญมาก!)
// ESM imports ทั้งหมดจะรันก่อน code ดังนั้นต้องโหลด env ที่นี่
// แล้วค่อย dynamic import payload หลังจากนั้น
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, 'images')

// === R2 (Cloudflare) — รูปใหม่จากสคริปอัปโหลดเข้า R2 โดยตรง ===
// (admin panel ยังใช้ Vercel Blob สำหรับ uploads ปกติ — รูปเก่าใน DB ที่เป็น Blob URL ยังแสดงปกติ)
const R2_BUCKET = process.env.R2_BUCKET_NAME || process.env.R2_BUCKET || ''
const R2_ENDPOINT = process.env.R2_ACCOUNT_ID
  ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  : ''
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '')
const R2_PREFIX = 'jmc'

if (!R2_BUCKET || !R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  console.error('❌ R2 credentials missing — required: R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY')
  process.exit(1)
}
if (!R2_PUBLIC_URL) {
  console.error('❌ R2_PUBLIC_URL missing — set to your R2 public dev URL (https://pub-<id>.r2.dev) or custom domain')
  process.exit(1)
}

const r2Client = new S3Client({
  endpoint: R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
})

async function putToR2(buffer: Buffer, key: string, contentType: string) {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: `public, max-age=${365 * 24 * 60 * 60}, immutable`,
    }),
  )
}

function sanitizeBaseName(name: string): string {
  return name.replace(/[^\w\-]/g, '_').slice(0, 80) || 'image'
}

// รับ --file argument หรือใช้ products.csv เป็น default
const args = process.argv.slice(2)
const fileIdx = args.indexOf('--file')
const csvArg = fileIdx !== -1 ? args[fileIdx + 1] : null
const CSV_FILE = csvArg
  ? path.isAbsolute(csvArg) ? csvArg : path.join(process.cwd(), csvArg)
  : path.join(__dirname, 'products.csv')

type Row = Record<string, string | undefined>

// อ่านค่าจาก row ให้ได้ string เสมอ (ไม่ undefined)
function col(row: Row, ...keys: string[]): string {
  for (const key of keys) {
    const val = row[key]?.trim()
    if (val) return val
  }
  return ''
}

function parseBool(val: string): boolean {
  return ['true', '1', 'yes', 'จริง'].includes(val.trim().toLowerCase())
}

function parseNum(val: string): number | undefined {
  const n = parseFloat(val.trim())
  return isNaN(n) ? undefined : n
}

// ดาวน์โหลดรูปจาก URL
async function downloadImage(url: string) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`Download failed: ${res.status} ${url}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  const contentType = res.headers.get('content-type') ?? 'image/jpeg'
  const mimeType = contentType.split(';')[0] ?? 'image/jpeg'
  const ext = (mimeType.split('/')[1] ?? 'jpg').replace('jpeg', 'jpg')
  const urlPath = new URL(url).pathname
  const original = path.basename(urlPath)
  const filename = original.includes('.') ? original : `image-${Date.now()}.${ext}`

  return { buffer, filename, mimeType }
}

// อัปโหลดรูปเข้า R2 โดยตรง → สร้าง media doc พร้อม absolute URL → คืน media ID
// **ไม่ส่ง file param ให้ payload.create** — เพื่อ bypass Vercel Blob storage adapter
// (รูปจากสคริปจะอยู่ที่ R2, รูปจาก admin panel จะอยู่ที่ Vercel Blob ต่อไป)
async function uploadImage(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  source: string,
  altText: string,
): Promise<string | null> {
  try {
    let buffer: Buffer
    let originalName: string

    if (source.startsWith('http://') || source.startsWith('https://')) {
      const result = await downloadImage(source)
      buffer = result.buffer
      originalName = result.filename
    } else {
      const fromImages = path.join(IMAGES_DIR, source)
      const fromRoot = path.join(process.cwd(), source)
      const fromImagesBase = path.join(IMAGES_DIR, path.basename(source))
      const localPath = path.isAbsolute(source)
        ? source
        : fs.existsSync(fromImages)
          ? fromImages
          : fs.existsSync(fromRoot)
            ? fromRoot
            : fromImagesBase
      if (!fs.existsSync(localPath)) {
        console.warn(`  ⚠️  ไม่พบไฟล์: ${localPath}`)
        return null
      }
      buffer = fs.readFileSync(localPath)
      originalName = path.basename(localPath)
    }

    // แปลงเป็น webp + resize ให้ตรง preset ของ Media collection (max 1920x1080)
    const processed = await sharp(buffer)
      .rotate() // auto-rotate ตาม EXIF
      .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true })

    const baseName = sanitizeBaseName(path.parse(originalName).name)
    const filename = `${baseName}-${Date.now()}.webp`
    const key = `${R2_PREFIX}/${filename}`
    const mimeType = 'image/webp'

    await putToR2(processed.data, key, mimeType)
    const url = `${R2_PUBLIC_URL}/${key}`

    // สร้าง media doc ด้วย metadata เต็ม + absolute URL
    // ไม่ใส่ file → Payload's storage adapter ไม่ทำงาน (URL คงอยู่ตามที่เราใส่)
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
        filename,
        mimeType,
        filesize: processed.data.length,
        width: processed.info.width,
        height: processed.info.height,
        url,
        focalX: 50,
        focalY: 50,
      },
    })
    return String(media.id)
  } catch (err) {
    console.warn(`  ⚠️  อัปโหลดรูปไม่สำเร็จ:`, err instanceof Error ? err.message : err)
    return null
  }
}

// หาหรือสร้าง category
async function getOrCreateCategory(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  name: string,
  cache: Map<string, string>,
): Promise<string | null> {
  if (!name.trim()) return null
  const key = name.trim().toLowerCase()
  if (cache.has(key)) return cache.get(key)!

  const existing = await payload.find({
    collection: 'categories',
    where: { title: { equals: name.trim() } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const id = String(existing.docs[0].id)
    cache.set(key, id)
    return id
  }

  const created = await payload.create({
    collection: 'categories',
    data: {
      title: name.trim(),
      slug: name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    },
  })
  const id = String(created.id)
  cache.set(key, id)
  console.log(`  ✅ สร้าง category ใหม่: ${name}`)
  return id
}

async function main() {
  console.log('🚀 เริ่ม import สินค้า...\n')

  if (!fs.existsSync(CSV_FILE)) {
    console.error(`❌ ไม่พบไฟล์: ${CSV_FILE}`)
    process.exit(1)
  }

  // Dynamic import — ต้องอยู่หลัง dotenv.config() ไม่งั้น env vars ยังไม่เข้า
  const { getPayload } = await import('payload')
  const configPromise = (await import('../src/payload.config.js')).default
  const payload = await getPayload({ config: configPromise })

  const rows = parse(fs.readFileSync(CSV_FILE, 'utf-8'), {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Row[]

  console.log(`📋 พบสินค้า ${rows.length} รายการ\n`)

  const categoryCache = new Map<string, string>()
  let created = 0
  let updated = 0
  let skipped = 0

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!
    const sku = col(row, 'SKU')
    const title = col(row, 'Product Name (TH)', 'ชื่อสินค้า')

    if (!title) {
      console.warn(`⚠️  แถว ${i + 2}: ไม่มีชื่อสินค้า ข้ามไป`)
      skipped++
      continue
    }

    console.log(`[${i + 1}/${rows.length}] ${title}`)

    try {
      // Categories — ใช้ Category เป็นหลัก
      const categoryIds: string[] = []
      const categoryName = col(row, 'Category')
      if (categoryName) {
        const id = await getOrCreateCategory(payload, categoryName, categoryCache)
        if (id) categoryIds.push(id)
      }
      if (categoryIds.length === 0) {
        const id = await getOrCreateCategory(payload, 'ทั่วไป', categoryCache)
        if (id) categoryIds.push(id)
      }

      // Images: ค่าใน Image URLs = URL หรือชื่อไฟล์ใน scripts/images/
      // คั่นด้วย | (แบบ ecomm1) หรือ , ก็ได้
      const imagesData: { image: string; alt: string }[] = []
      const imageUrls = col(row, 'Image URLs')
      const imageSources = imageUrls
        .split(/[|,]/)
        .map((s) => s.trim())
        .filter(Boolean)

      for (const src of imageSources) {
        const id = await uploadImage(payload, src, title)
        if (id) imagesData.push({ image: id, alt: title })
      }

      // Specifications
      const specifications: { label: string; value: string }[] = []
      const specMap = [
        ['Weight', 'น้ำหนัก'],
        ['Length', 'ความยาว'],
        ['Width', 'ความกว้าง'],
        ['Height', 'ความสูง'],
        ['Brand', 'ยี่ห้อ'],
        ['Model', 'รุ่น'],
      ] as const
      for (const [key, label] of specMap) {
        const val = col(row, key)
        if (val) specifications.push({ label, value: val })
      }

      // Status
      const statusMap: Record<string, string> = {
        active: 'active', inactive: 'inactive',
        out_of_stock: 'out_of_stock', discontinued: 'discontinued',
        พร้อมขาย: 'active', ไม่พร้อมขาย: 'inactive', สินค้าหมด: 'out_of_stock',
      }
      const rawStatus = col(row, 'Status').toLowerCase()
      const status = statusMap[rawStatus] ?? 'active'

      // Product data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productData: any = {
        title,
        shortDescription: col(row, 'Description (TH)') || undefined,
        price: parseNum(col(row, 'Price')) ?? 0,
        stock: parseNum(col(row, 'Stock')) ?? 0,
        status,
        featured: parseBool(col(row, 'Featured')),
        categories: categoryIds,
        ...(sku && { sku }),
        ...(imagesData.length > 0 && { images: imagesData }),
        ...(specifications.length > 0 && { specifications }),
      }

      const salePrice = parseNum(col(row, 'Compare At Price'))
      if (salePrice !== undefined) productData.salePrice = salePrice

      // Upsert
      const existing = sku
        ? await payload.find({ collection: 'products', where: { sku: { equals: sku } }, limit: 1 })
        : { docs: [] }

      if (existing.docs.length > 0) {
        await payload.update({ collection: 'products', id: String(existing.docs[0]!.id), data: productData })
        console.log(`  ↻  อัปเดต (SKU: ${sku})`)
        updated++
      } else {
        await payload.create({ collection: 'products', data: productData })
        console.log(`  ✨ สร้างใหม่`)
        created++
      }
    } catch (err) {
      console.error(`  ❌ Error:`, err instanceof Error ? err.message : err)
      skipped++
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ สร้างใหม่:  ${created}`)
  console.log(`↻  อัปเดต:    ${updated}`)
  console.log(`⚠️  ข้าม:      ${skipped}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
