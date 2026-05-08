/**
 * gen-images.ts — สร้างรูปสินค้าอัตโนมัติด้วย Google Imagen 4 Ultra (via Replicate)
 *
 * ต้องการ:
 *   REPLICATE_API_TOKEN=r8_xxxx  ← ใส่ใน .env.local
 *
 * วิธีใช้:
 *   pnpm gen:images                                  ← ทำทุกแถวที่ยังไม่มีรูป
 *   pnpm gen:images:test                             ← ทดสอบ 3 รูปแรก
 *   pnpm gen:images --csv scripts/steel-scraped.csv  ← ระบุไฟล์เอง
 *   pnpm gen:images --limit 10                       ← จำกัดจำนวน
 *   pnpm gen:images --overwrite                      ← เจนทับของเดิมด้วย
 *
 * Output:
 *   scripts/images/SKU.jpg    ← รูปที่ generate (เก็บชั่วคราวบนเครื่อง)
 *   steel-scraped.csv         ← อัพเดทคอลัมน์ Image URLs อัตโนมัติ
 *
 * หลังจากนั้น:
 *   pnpm import:steel   → upload รูปเข้า Payload → Cloudflare R2 (เก็บถาวร)
 */

import Replicate from 'replicate'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, 'images')

// ─── Parse arguments ─────────────────────────────────────────────────────────
const args = process.argv.slice(2)
function getArg(flag: string): string | null {
  const i = args.indexOf(flag)
  return i !== -1 && args[i + 1] ? args[i + 1]! : null
}
const CSV_FILE = getArg('--csv') ?? path.join(__dirname, 'steel-scraped.csv')
const LIMIT = parseInt(getArg('--limit') ?? '0', 10) || Infinity
const OVERWRITE = args.includes('--overwrite')

// ─── Replicate client ─────────────────────────────────────────────────────────
const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN
if (!REPLICATE_TOKEN) {
  console.error('❌ ไม่พบ REPLICATE_API_TOKEN')
  console.error('   ใส่ใน .env.local:  REPLICATE_API_TOKEN=r8_xxxx')
  console.error('   สมัครได้ที่: https://replicate.com/account/api-tokens')
  process.exit(1)
}

const replicate = new Replicate({ auth: REPLICATE_TOKEN })

// ─── Prompt builder ───────────────────────────────────────────────────────────
function buildPrompt(productName: string, _category: string): string {
  return `ขอรูปสำหรับขายของในเว็ป e-commerce เป็นสินค้า ${productName}`
}

// ─── Generate one image via Replicate Imagen 4 Ultra ─────────────────────────
async function generateImage(prompt: string, outputPath: string): Promise<boolean> {
  try {
    console.log(`    prompt: "${prompt.slice(0, 80)}..."`)

    const output = await replicate.run('google/imagen-4-ultra', {
      input: {
        prompt,
        aspect_ratio: '1:1',
        output_format: 'jpg',
        safety_filter_level: 'block_only_high',
      },
    })

    // output เป็น URL string, Blob, หรือ array
    const raw = output as unknown
    let imageUrl: string

    if (typeof raw === 'string') {
      imageUrl = raw
    } else if (Array.isArray(raw) && raw.length > 0) {
      const first = raw[0]
      imageUrl = typeof first === 'string' ? first : String(first)
    } else if (raw && typeof (raw as Record<string, unknown>).url === 'function') {
      imageUrl = String((raw as Record<string, unknown>).url)
    } else {
      throw new Error(`Unexpected output type: ${typeof raw}`)
    }

    const res = await fetch(imageUrl)
    if (!res.ok) throw new Error(`Download failed: ${res.status} ${imageUrl}`)
    const bytes = new Uint8Array(await res.arrayBuffer())
    fs.writeFileSync(outputPath, bytes)
    return true
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`    ⚠️  generate ล้มเหลว: ${msg}`)
    return false
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🖼️  gen-images.ts — Google Imagen 4 Ultra (via Replicate)\n')

  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true })
  if (!fs.existsSync(CSV_FILE)) {
    console.error(`❌ ไม่พบไฟล์: ${CSV_FILE}`)
    console.error('   รัน scrape:steel ก่อน')
    process.exit(1)
  }

  // อ่าน CSV
  const raw = fs.readFileSync(CSV_FILE, 'utf-8').replace(/^\ufeff/, '')
  const rows = parse(raw, { columns: true, skip_empty_lines: true, trim: true }) as Record<
    string,
    string
  >[]

  // กรองเฉพาะแถวที่ยังไม่มีรูป (หรือ --overwrite)
  const targets = rows.filter((row) => {
    const hasImage = (row['Image URLs'] ?? '').trim().length > 0
    return OVERWRITE ? true : !hasImage
  })

  const toProcess = targets.slice(0, LIMIT)

  console.log(`📋 รวม ${rows.length} รายการ`)
  console.log(`🎯 จะ generate: ${toProcess.length} รายการ${OVERWRITE ? ' (overwrite mode)' : ' (ที่ยังไม่มีรูป)'}`)
  if (LIMIT < targets.length) {
    console.log(`⚡ จำกัด: ${LIMIT} รายการ (--limit)`)
  }
  console.log()

  let success = 0
  let failed = 0

  for (let i = 0; i < toProcess.length; i++) {
    const row = toProcess[i]!
    const sku = (row['SKU'] ?? '').trim()
    const name = (row['Product Name (TH)'] ?? '').trim()
    const category = (row['Category'] ?? '').trim()

    if (!name) continue

    const filename = `${sku || `item-${i}`}.jpg`
    const outputPath = path.join(IMAGES_DIR, filename)

    console.log(`[${i + 1}/${toProcess.length}] ${sku} — ${name}`)

    // ข้ามถ้ามีไฟล์อยู่แล้วและไม่ได้ --overwrite
    if (!OVERWRITE && fs.existsSync(outputPath)) {
      console.log(`    ✅ มีไฟล์อยู่แล้ว (${filename}) ข้าม`)
      // อัพเดท Image URLs ถ้ายังว่าง
      if (!(row['Image URLs'] ?? '').trim()) {
        const idx = rows.findIndex((r) => r['SKU'] === sku)
        if (idx !== -1) rows[idx]!['Image URLs'] = filename
      }
      success++
      continue
    }

    const prompt = buildPrompt(name, category)
    const ok = await generateImage(prompt, outputPath)

    if (ok) {
      console.log(`    ✅ บันทึก: scripts/images/${filename}`)
      // อัพเดท Image URLs ใน rows array
      const idx = rows.findIndex((r) => r['SKU'] === sku)
      if (idx !== -1) rows[idx]!['Image URLs'] = filename
      success++
    } else {
      failed++
    }

    // บันทึก CSV หลังทุก row เพื่อป้องกันข้อมูลหายถ้า script หยุดกลางคัน
    const updatedCsv =
      '\ufeff' +
      stringify(rows, {
        header: true,
        columns: Object.keys(rows[0]!),
      })
    fs.writeFileSync(CSV_FILE, updatedCsv, 'utf-8')

    // หน่วง 2 วินาทีระหว่าง request (Imagen 4 Ultra มี rate limit)
    if (i < toProcess.length - 1) {
      await new Promise((r) => setTimeout(r, 2000))
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ สำเร็จ:  ${success} รายการ`)
  if (failed > 0) console.log(`❌ ล้มเหลว: ${failed} รายการ`)
  console.log(`📄 CSV อัพเดทแล้ว: ${CSV_FILE}`)
  console.log(`🖼️  รูปอยู่ที่:     scripts/images/`)
  console.log(`\nขั้นตอนต่อไป:`)
  console.log(`  pnpm import:steel   → import สินค้า + รูปเข้า CMS → Cloudflare R2`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
