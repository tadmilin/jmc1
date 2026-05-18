/**
 * fix-slugs.ts
 * วิ่งผ่านสินค้าทุกชิ้นใน DB แล้ว re-generate slug จาก title
 * ด้วย format function ที่รองรับ Thai Unicode อย่างถูกต้อง
 *
 * วิธีรัน:
 *   pnpm fix:slugs
 *
 * dry-run (ดูก่อน ไม่แก้จริง):
 *   pnpm fix:slugs --dry-run
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDryRun = process.argv.includes('--dry-run')

// format function เดียวกับ formatSlug.ts แต่รองรับ Thai Unicode
const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\p{L}\p{M}\p{N}-]+/gu, '')
    .toLowerCase()

async function main() {
  console.log(`\n🔧 fix-slugs.ts — ${isDryRun ? 'DRY RUN (ไม่แก้จริง)' : 'LIVE MODE'}`)
  console.log('='.repeat(60))

  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config.ts')
  const payload = await getPayload({ config: configPromise })

  let page = 1
  const limit = 100
  let totalFixed = 0
  let totalSkipped = 0
  let totalErrors = 0

  while (true) {
    const result = await payload.find({
      collection: 'products',
      limit,
      page,
      pagination: true,
      overrideAccess: true,
      select: { id: true, title: true, slug: true },
      depth: 0,
    })

    if (result.docs.length === 0) break

    console.log(`\n📦 Page ${page}/${result.totalPages} — ${result.docs.length} สินค้า`)

    for (const product of result.docs) {
      const id = String(product.id)
      const title = typeof product.title === 'string' ? product.title : ''
      const currentSlug = typeof product.slug === 'string' ? product.slug : ''

      if (!title) {
        console.log(`  ⚠️  [${id}] ไม่มี title — ข้าม`)
        totalSkipped++
        continue
      }

      const correctSlug = format(title)

      if (currentSlug === correctSlug) {
        totalSkipped++
        continue
      }

      console.log(`  🔄 "${title}"`)
      console.log(`     slug เดิม : ${currentSlug}`)
      console.log(`     slug ใหม่ : ${correctSlug}`)

      if (!isDryRun) {
        try {
          await payload.update({
            collection: 'products',
            id,
            data: { slug: correctSlug },
            overrideAccess: true,
          })
          console.log(`     ✅ อัปเดตแล้ว`)
          totalFixed++
        } catch (err) {
          console.error(`     ❌ error:`, err instanceof Error ? err.message : err)
          totalErrors++
        }
      } else {
        totalFixed++
      }
    }

    if (!result.hasNextPage) break
    page++
  }

  console.log('\n' + '='.repeat(60))
  console.log(`✅ แก้ slug : ${totalFixed} รายการ`)
  console.log(`⏭️  ข้าม    : ${totalSkipped} รายการ (slug ถูกแล้ว)`)
  if (totalErrors > 0) console.log(`❌ error   : ${totalErrors} รายการ`)
  if (isDryRun) console.log('\n💡 รัน pnpm fix:slugs เพื่อแก้จริง')

  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
