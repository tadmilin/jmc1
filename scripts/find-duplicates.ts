/**
 * find-duplicates.ts — หาสินค้าที่ชื่อซ้ำกันใน products collection
 *
 * วิธีรัน:
 *   pnpm find:dupes              → แสดง duplicates ทั้งหมด
 *   pnpm find:dupes --delete-new → ลบตัวที่ใหม่กว่าทิ้ง (เก็บตัวแรกสุด)
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const deleteNew = process.argv.includes('--delete-new')

async function main() {
  console.log(`\n🔍 find-duplicates.ts — ${deleteNew ? 'DELETE MODE' : 'REPORT MODE'}`)
  console.log('='.repeat(60))

  const { getPayload } = await import('payload')
  const configPromise = (await import('../src/payload.config.js')).default
  const payload = await getPayload({ config: configPromise })

  // ดึงสินค้าทั้งหมด (title + id + slug + sku + createdAt + มีรูปไหม)
  const allProducts: {
    id: string
    title: string
    slug: string
    sku: string
    createdAt: string
    hasImages: boolean
    hasPrice: boolean
  }[] = []

  let page = 1
  while (true) {
    const result = await payload.find({
      collection: 'products',
      limit: 200,
      page,
      overrideAccess: true,
      depth: 0,
    })
    if (result.docs.length === 0) break

    for (const p of result.docs) {
      allProducts.push({
        id: String(p.id),
        title: typeof p.title === 'string' ? p.title : '',
        slug: typeof p.slug === 'string' ? p.slug : '',
        sku: typeof p.sku === 'string' ? p.sku : '',
        createdAt: typeof p.createdAt === 'string' ? p.createdAt : '',
        hasImages: Array.isArray(p.images) && p.images.length > 0,
        hasPrice: typeof p.price === 'number' && p.price > 0,
      })
    }

    if (!result.hasNextPage) break
    page++
  }

  console.log(`\n📦 สินค้าทั้งหมดใน DB: ${allProducts.length} รายการ`)

  // จัดกลุ่มตาม title (normalize: trim + lowercase)
  const byTitle = new Map<string, typeof allProducts>()
  for (const p of allProducts) {
    const key = p.title.trim().toLowerCase()
    if (!byTitle.has(key)) byTitle.set(key, [])
    byTitle.get(key)!.push(p)
  }

  // หา title ที่มีมากกว่า 1 รายการ
  const duplicates = [...byTitle.entries()]
    .filter(([, items]) => items.length > 1)
    .sort((a, b) => b[1].length - a[1].length)

  if (duplicates.length === 0) {
    console.log('\n✅ ไม่พบสินค้าซ้ำ!')
    process.exit(0)
  }

  console.log(`\n⚠️  พบชื่อซ้ำ: ${duplicates.length} กลุ่ม\n`)

  let totalToDelete = 0
  const idsToDelete: string[] = []

  for (const [title, items] of duplicates) {
    // เรียงตาม createdAt เก่าสุดก่อน
    const sorted = [...items].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    const keep = sorted[0]!
    const remove = sorted.slice(1)
    totalToDelete += remove.length

    console.log(`📌 "${title.slice(0, 60)}"`)
    console.log(`   เก็บไว้  : [${keep.id}] slug="${keep.slug}" sku="${keep.sku}" รูป=${keep.hasImages ? '✅' : '❌'} ราคา=${keep.hasPrice ? '✅' : '❌'} (${keep.createdAt.slice(0, 10)})`)
    for (const r of remove) {
      console.log(`   ลบทิ้ง  : [${r.id}] slug="${r.slug}" sku="${r.sku}" รูป=${r.hasImages ? '✅' : '❌'} ราคา=${r.hasPrice ? '✅' : '❌'} (${r.createdAt.slice(0, 10)})`)
      idsToDelete.push(r.id)
    }
    console.log()
  }

  console.log('='.repeat(60))
  console.log(`สรุป: จะลบ ${totalToDelete} รายการ, เหลือ ${allProducts.length - totalToDelete} รายการ`)

  if (!deleteNew) {
    console.log('\n💡 รัน pnpm find:dupes --delete-new เพื่อลบ duplicates จริง')
    process.exit(0)
  }

  // ── DELETE MODE ─────────────────────────────────────────────────────────────
  console.log('\n🗑️  กำลังลบ duplicates...')
  let deleted = 0
  let errored = 0

  for (const id of idsToDelete) {
    try {
      await payload.delete({ collection: 'products', id, overrideAccess: true })
      process.stdout.write('.')
      deleted++
    } catch (e) {
      process.stdout.write('x')
      errored++
      console.error(`\n  ❌ ลบ id=${id} ไม่ได้:`, e instanceof Error ? e.message : e)
    }
  }

  console.log(`\n\n✅ ลบเสร็จ: ${deleted} รายการ`)
  if (errored > 0) console.log(`❌ ผิดพลาด: ${errored} รายการ`)

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
