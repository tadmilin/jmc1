/**
 * scrape-steel.ts — ดึงข้อมูลสินค้าเหล็ก + ราคาสดจาก steellead.com
 *
 * ราคา: scrape ตรงจาก steellead.com (อัพเดทรายวัน) — แม่นยำ 100%
 *
 * วิธีใช้:
 *   pnpm tsx scripts/scrape-steel.ts
 *
 * Output:
 *   scripts/steel-scraped.csv  → เปิดใน Google Sheets ตรวจข้อมูล
 *   scripts/images/            → ที่เก็บรูป (ยังว่าง ต้องรัน gen-images)
 *
 * ขั้นตอนต่อไป:
 *   pnpm gen:images             → สร้างรูป AI อัตโนมัติ
 *   pnpm import:products        → import เข้า Payload CMS
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.join(__dirname, 'images')
const OUT_CSV = path.join(__dirname, 'steel-scraped.csv')

const DELAY_MS = 1200  // หน่วงระหว่าง request (ms)

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Cache-Control': 'no-cache',
  Referer: 'https://www.google.com/',
}

interface Product {
  sku: string
  nameTH: string
  description: string
  price: number
  brand: string
  imageUrl: string
  localImage: string
  parentCategory?: string // หมวดหมู่แม่ เช่น "เหล็ก", "ท่อ PVC"
  category: string        // หมวดหมู่ย่อย เช่น "เหล็กเส้น / เหล็กข้ออ้อย"
  specs: string
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function fetchHtml(url: string): Promise<string | null> {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: HEADERS as Record<string, string> })
      if (res.ok) return await res.text()
      console.warn(`  [${res.status}] ${url}`)
      if (res.status === 403 || res.status === 404) return null
    } catch (err) {
      console.warn(`  fetch error: ${err}`)
    }
    await sleep(DELAY_MS * (i + 1))
  }
  return null
}

// ════════════════════════════════════════════════════════════════════════════
//  SteelLead Price Scraper
// ════════════════════════════════════════════════════════════════════════════

interface SectionRow {
  /** ค่าตัวเลขจากคอลัมน์ที่ 1 (ปกติคือความหนา หรือเส้นผ่าศูนย์กลาง) */
  firstColNum: number
  price: number
}

interface PageSection {
  rawLabel: string
  sizeKey: string   // normalized key เช่น "10", "25x25", "0.50in"
  rows: SectionRow[]
  minPrice: number
}

interface PriceMap {
  sections: PageSection[]
  bySizeKey: Map<string, PageSection>
}

interface SteelLeadDB {
  deformedBar: PriceMap   // ข้ออ้อย SD40T  (key: mm เช่น "10","12","16","20","25")
  roundBar: PriceMap      // เหล็กเส้นกลม SR24 (key: mm เช่น "6","9","12","19","25")
  blackBox: PriceMap      // เหล็กกล่องดำ   (key: "WxH" เช่น "25x25","40x40")
  galvBox: PriceMap       // กล่องกัลวาไนซ์ (key: "WxH" เช่น "25x25","25x50")
  angleBar: PriceMap      // เหล็กฉาก      (key: "NxN" เช่น "25x25","50x50")
  flatBar: PriceMap       // เหล็กแบน      (key: "WxT" เช่น "25x3","50x6")
  lipChannel: PriceMap    // ตัวซีดำ/GI    (key: section)
  iBeam: PriceMap         // I-Beam        (key: section)
  wfBeam: PriceMap        // WF Beam       (key: section)
  uChannel: PriceMap      // รางน้ำ/U-Chan  (key: section)
  sheet: PriceMap         // เหล็กแผ่นดำ   (key: mm หนา เช่น "1.2","3.0")
  wireMesh: PriceMap      // ไวร์เมช       (key: section)
  giPipe: PriceMap        // ท่อ GI กลม    (key: เช่น "0.50in","1.00in")
  blackPipe: PriceMap     // ท่อดำ ERW     (key: เช่น "0.50in","1.00in")
}

const emptyMap: PriceMap = { sections: [], bySizeKey: new Map() }

/** ดึงราคาจากหน้า steellead ทุกหน้าที่เกี่ยวข้อง (ปิดใช้งานชั่วคราว) */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _fetchSteelLeadPrices(): Promise<SteelLeadDB> {
  const db: SteelLeadDB = {
    deformedBar: emptyMap,
    roundBar: emptyMap,
    blackBox: emptyMap,
    galvBox: emptyMap,
    angleBar: emptyMap,
    flatBar: emptyMap,
    lipChannel: emptyMap,
    iBeam: emptyMap,
    wfBeam: emptyMap,
    uChannel: emptyMap,
    sheet: emptyMap,
    wireMesh: emptyMap,
    giPipe: emptyMap,
    blackPipe: emptyMap,
  }

  const BASE = 'https://www.steellead.com'

  type PageSpec = {
    url: string
    label: string
    assign: (sections: PageSection[]) => void
  }

  const pages: PageSpec[] = [
    {
      url: `${BASE}/round-bar-price.html`,
      label: 'เหล็กเส้น / ข้ออ้อย',
      assign: (sections) => {
        // แยก deformed bar (ข้ออ้อย) vs round bar (เส้นกลม) ด้วย Thai keyword
        const rebarSec = sections.filter((s) => s.rawLabel.includes('ข้ออ้อย'))
        const roundSec = sections.filter((s) => s.rawLabel.includes('เส้นกลม'))
        // Fallback: ถ้า Thai decode ไม่ถูก → แยกด้วย size (rebar: 10+, round: ≤9 และ 15)
        if (rebarSec.length === 0 && roundSec.length === 0) {
          const rebarSizes = new Set(['10', '12', '16', '20', '25', '28', '32'])
          const roundOnlySizes = new Set(['6', '8', '9', '15', '19'])
          for (const s of sections) {
            const k = s.sizeKey.replace(/\..*$/, '')
            if (roundOnlySizes.has(k)) roundSec.push(s)
            else if (rebarSizes.has(k)) rebarSec.push(s)
          }
        }
        db.deformedBar = buildPriceMap(rebarSec.length ? rebarSec : sections.filter((s) => parseFloat(s.sizeKey) >= 10 && parseFloat(s.sizeKey) <= 32 && !s.sizeKey.includes('x') && !s.sizeKey.includes('in')))
        db.roundBar = buildPriceMap(roundSec.length ? roundSec : sections.filter((s) => parseFloat(s.sizeKey) <= 9 && !s.sizeKey.includes('x') && !s.sizeKey.includes('in')))
      },
    },
    {
      url: `${BASE}/steel-tube-price.html`,
      label: 'เหล็กกล่องดำ',
      assign: (sections) => {
        db.blackBox = buildPriceMap(sections.filter((s) => s.sizeKey.includes('x') && !s.sizeKey.includes('in')))
      },
    },
    {
      url: `${BASE}/galvanize-pipe-price.html`,
      label: 'เหล็กกล่อง GI กัลวาไนซ์',
      assign: (sections) => {
        db.galvBox = buildPriceMap(sections.filter((s) => s.sizeKey.includes('x') && !s.sizeKey.includes('in')))
      },
    },
    {
      url: `${BASE}/angle-bar-price.html`,
      label: 'เหล็กฉาก',
      assign: (sections) => {
        db.angleBar = buildPriceMap(sections.filter((s) => s.sizeKey.includes('x') && !s.sizeKey.includes('in')))
      },
    },
    {
      url: `${BASE}/flat-bar-price.html`,
      label: 'เหล็กแบน',
      assign: (sections) => {
        // sections ใช้ WIDTH เท่านั้น (12, 15, 19, 25, 32...) ไม่มี x
        db.flatBar = buildPriceMap(sections.filter((s) => !s.sizeKey.includes('in')))
      },
    },
    {
      url: `${BASE}/lip-channel-steel-price.html`,
      label: 'เหล็กตัวซี C-Channel',
      assign: (sections) => {
        db.lipChannel = buildPriceMap(sections)
      },
    },
    {
      url: `${BASE}/i-beam-price.html`,
      label: 'I-Beam',
      assign: (sections) => {
        db.iBeam = buildPriceMap(sections)
      },
    },
    {
      url: `${BASE}/h-beam-price.html`,
      label: 'H-Beam / WF Beam',
      assign: (sections) => {
        db.wfBeam = buildPriceMap(sections.filter((s) => s.sizeKey.includes('x') && !s.sizeKey.includes('in')))
      },
    },
    {
      url: `${BASE}/light-channel-price.html`,
      label: 'รางน้ำ U-Channel',
      assign: (sections) => {
        db.uChannel = buildPriceMap(sections)
      },
    },
    {
      url: `${BASE}/steel-sheet-price.html`,
      label: 'เหล็กแผ่นดำ',
      assign: (sections) => {
        // หน้านี้มี 1 section ต่อประเภท แต่ rows แยกตาม thickness
        // ดึงเฉพาะ "แผ่นดำ / Hot Rolled" section แล้ว index ด้วย thickness
        const hrSection = sections.find(
          (s) =>
            s.rawLabel.toLowerCase().includes('hot rolled') ||
            s.rawLabel.toLowerCase().includes('hr') ||
            s.rawLabel.includes('แผ่นดำ'),
        )
        if (!hrSection) return
        // สร้าง virtual sections ตาม thickness (col[0])
        const thickMap = new Map<string, SectionRow[]>()
        for (const row of hrSection.rows) {
          const key = row.firstColNum.toFixed(1)
          if (!thickMap.has(key)) thickMap.set(key, [])
          thickMap.get(key)!.push(row)
        }
        const virtualSecs: PageSection[] = [...thickMap.entries()].map(([k, rows]) => ({
          rawLabel: `แผ่นดำ ${k}mm`,
          sizeKey: k,
          rows,
          minPrice: Math.min(...rows.map((r) => r.price)),
        }))
        db.sheet = buildPriceMap(virtualSecs)
      },
    },
    {
      url: `${BASE}/steel-wire-mesh-price.html`,
      label: 'ตะแกรงไวร์เมช',
      assign: (sections) => {
        // sections แยกด้วย mesh spacing (200x200, 150x150)
        // rows แยกด้วย wire diameter (col[0] = mm)
        db.wireMesh = buildPriceMap(sections)
      },
    },
    {
      url: `${BASE}/plumbing-steel-pipe.html`,
      label: 'ท่อ GI ประปา',
      assign: (sections) => {
        db.giPipe = buildPriceMap(sections.filter((s) => s.sizeKey.endsWith('in')))
      },
    },
    {
      url: `${BASE}/round-pipe-price.html`,
      label: 'ท่อดำ ERW',
      assign: (sections) => {
        db.blackPipe = buildPriceMap(sections.filter((s) => s.sizeKey.endsWith('in')))
      },
    },
  ]

  for (const page of pages) {
    process.stdout.write(`  📡 ${page.label}... `)
    const html = await fetchHtml(page.url)
    if (html) {
      const sections = parseSteelLeadHtml(html)
      page.assign(sections)
      console.log(`✅ ${sections.length} sections`)
    } else {
      console.log(`⚠️  ดึงไม่ได้ (ใช้ราคา 0)`)
    }
    await sleep(DELAY_MS)
  }

  return db
}

/** parse HTML จาก steellead → array ของ PageSection */
function parseSteelLeadHtml(html: string): PageSection[] {
  const $ = cheerio.load(html)
  const sections: PageSection[] = []

  $('div.sl-table-wrap[data-h3]').each((_, el) => {
    const rawLabel = $(el).attr('data-h3') ?? ''
    const sizeKey = normalizeSizeKey(rawLabel)

    const rows: SectionRow[] = []
    $(el)
      .find('table.custom-table tr')
      .each((rowIdx, row) => {
        if (rowIdx === 0) return // skip header
        const cells = $(row).find('td')
        if (cells.length < 2) return
        const lastCell = cells.last()
        const priceText = lastCell.find('strong').first().text()
        const price = parseNum(priceText)
        if (price <= 0) return
        const firstColNum = parseNum(cells.first().text())
        rows.push({ firstColNum, price })
      })

    if (rows.length > 0) {
      sections.push({
        rawLabel,
        sizeKey,
        rows,
        minPrice: Math.min(...rows.map((r) => r.price)),
      })
    }
  })

  return sections
}

function parseNum(text: string): number {
  const v = parseFloat(text.replace(/,/g, '').replace(/[^0-9.]/g, '').trim())
  return isNaN(v) ? 0 : v
}

/**
 * แปลง data-h3 label เป็น normalized size key
 * ตัวอย่าง:
 *   "ราคาข้ออ้อย 10 มม."     → "10"
 *   "เหล็กกล่องดำ 25 x 25 มม." → "25x25"
 *   "ท่อ GI 1/2 นิ้ว"         → "0.50in"
 *   'ท่อ GI 1"1/2 (กลม)'      → "1.50in"
 */
function normalizeSizeKey(raw: string): string {
  // decode HTML entities
  const label = raw
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#\d+;/g, '')

  // ── ขนาดนิ้ว compound เช่น 1"1/2, 1"1/4 ─────────────────────────────────
  const compound = label.match(/(\d+)"(\d+)\/(\d+)/)
  if (compound) {
    const v = parseInt(compound[1]!) + parseInt(compound[2]!) / parseInt(compound[3]!)
    return v.toFixed(2) + 'in'
  }

  // ── ขนาดนิ้ว เช่น 2", 3", 4" ──────────────────────────────────────────────
  const simpleInch = label.match(/(\d+)"\s*(?:[^1-9/]|$)/)
  if (simpleInch) return parseInt(simpleInch[1]!).toFixed(2) + 'in'

  // ── เศษส่วนนิ้ว เช่น 1/2, 3/4, 3/8 ───────────────────────────────────────
  const frac = label.match(/(?<!["\d])(\d)\/(\d+)(?!["\d])/)
  if (frac) return (parseInt(frac[1]!) / parseInt(frac[2]!)).toFixed(2) + 'in'

  // ── ขนาดมิล NxMxP, NxM, หรือ N ───────────────────────────────────────────
  const dims = label.match(/([\d.]+(?:\s*[xX×]\s*[\d.]+)*)(?:\s*(?:มม|mm)|\s*$)/i)
  if (dims) {
    return dims[1]!.toLowerCase().replace(/\s*[xX×]\s*/g, 'x').replace(/\s/g, '')
  }

  // fallback: เอาตัวเลขทั้งหมดมาต่อ
  const nums = label.match(/[\d.]+/g)
  return nums ? nums.join('x') : label.trim().toLowerCase().slice(0, 20)
}

function buildPriceMap(sections: PageSection[]): PriceMap {
  const bySizeKey = new Map<string, PageSection>()
  for (const s of sections) {
    if (!bySizeKey.has(s.sizeKey)) bySizeKey.set(s.sizeKey, s)
  }
  return { sections, bySizeKey }
}

/**
 * ค้นหาราคาจาก PriceMap
 * @param map     price map ของประเภทสินค้า
 * @param sizeKey normalized size key เช่น "25x25", "10", "0.50in"
 * @param thickness ความหนา (mm) สำหรับผลิตภัณฑ์ที่แยกตามความหนา เช่น angle bar
 */
function lookupPrice(map: PriceMap, sizeKey: string, thickness?: number): number {
  let section = map.bySizeKey.get(sizeKey)

  // ลอง reverse ถ้าไม่เจอ (25x50 vs 50x25)
  if (!section && sizeKey.includes('x')) {
    const reversed = sizeKey.split('x').reverse().join('x')
    section = map.bySizeKey.get(reversed)
  }

  if (!section) return 0

  if (thickness !== undefined && section.rows.length > 0) {
    // หา row ที่ตรงกับความหนาที่ต้องการ
    const exact = section.rows.find((r) => Math.abs(r.firstColNum - thickness) < 0.05)
    if (exact) return exact.price
    // ถ้าไม่เจอ ให้ใช้ row ที่ใกล้ที่สุด
    const closest = section.rows.reduce((best, r) =>
      Math.abs(r.firstColNum - thickness) < Math.abs(best.firstColNum - thickness) ? r : best,
    )
    return closest.price
  }

  return section.minPrice
}

// ════════════════════════════════════════════════════════════════════════════
//  รายการมาตรฐานเหล็กไทย (ดึงราคาจาก SteelLeadDB)
// ════════════════════════════════════════════════════════════════════════════

function getStandardSteelProducts(db: SteelLeadDB): Product[] {
  const items: Product[] = []

  // ─── เหล็กเส้นกลม SR24 ─────────────────────────────────────────────────
  const roundBars: Array<{ size: string; sku: string; steelleadKey: string }> = [
    { size: '6mm (2 หุน)',  sku: 'RBAR-62',  steelleadKey: '6'  },
    { size: '9mm (3 หุน)',  sku: 'RBAR-93',  steelleadKey: '9'  },
    { size: '12mm (4 หุน)', sku: 'RBAR-124', steelleadKey: '12' },
    { size: '19mm (6 หุน)', sku: 'RBAR-196', steelleadKey: '19' },
    { size: '25mm (8 หุน)', sku: 'RBAR-258', steelleadKey: '25' },
  ]
  for (const rb of roundBars) {
    items.push({
      sku: rb.sku,
      nameTH: `เหล็กเส้นกลม SD30 ขนาด ${rb.size}`,
      description: `เหล็กเส้นกลม มาตรฐาน SD30 ขนาด ${rb.size} ความยาว 10 เมตร ใช้สำหรับงานคอนกรีตเสริมเหล็กทั่วไป`,
      price: lookupPrice(db.roundBar, rb.steelleadKey),
      brand: 'SIAM YAMATO / G STEEL',
      imageUrl: '', localImage: '',
      category: 'เหล็กเส้น / เหล็กข้ออ้อย',
      specs: `ขนาด: ${rb.size} | มาตรฐาน: มอก.24-2548 (SD30) | ยาว: 10 ม.`,
    })
  }

  // ─── เหล็กข้ออ้อย SD40T ─────────────────────────────────────────────────
  const deformedBars: Array<{ size: string; sku: string }> = [
    { size: '10mm', sku: 'DBAR-10' },
    { size: '12mm', sku: 'DBAR-12' },
    { size: '16mm', sku: 'DBAR-16' },
    { size: '20mm', sku: 'DBAR-20' },
    { size: '25mm', sku: 'DBAR-25' },
    { size: '28mm', sku: 'DBAR-28' },
    { size: '32mm', sku: 'DBAR-32' },
  ]
  for (const db_ of deformedBars) {
    const sizeMm = db_.size.replace('mm', '')
    items.push({
      sku: db_.sku,
      nameTH: `เหล็กข้ออ้อย SD40T ขนาด ${db_.size}`,
      description: `เหล็กข้ออ้อย มาตรฐาน SD40T ขนาด ${db_.size} ความยาว 10 เมตร ใช้สำหรับงานโครงสร้างคอนกรีต`,
      price: lookupPrice(db.deformedBar, sizeMm),
      brand: 'SIAM YAMATO / G STEEL / TATA',
      imageUrl: '', localImage: '',
      category: 'เหล็กเส้น / เหล็กข้ออ้อย',
      specs: `ขนาด: ${db_.size} | มาตรฐาน: มอก.24-2548 (SD40T) | ยาว: 10 ม.`,
    })
  }

  // ─── เหล็กกล่องดำ RHS/SHS ───────────────────────────────────────────────
  const blackBoxes = [
    '25x25','40x40','50x50','60x60','75x75','100x100',
    '40x20','50x25','60x30','80x40','100x50',
  ]
  for (const sz of blackBoxes) {
    items.push({
      sku: `HBOX-${sz.replace('x','X')}`,
      nameTH: `เหล็กกล่องดำ ${sz} มม.`,
      description: `เหล็กกล่องรูปพรรณกลวงสี่เหลี่ยม (RHS/SHS) ขนาด ${sz} มม. ความยาว 6 เมตร`,
      price: lookupPrice(db.blackBox, sz),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กกล่อง',
      specs: `ขนาด: ${sz} มม. | ยาว: 6 ม.`,
    })
  }

  // ─── เหล็กตัวซีดำ C-Channel ─────────────────────────────────────────────
  // steellead lip-channel sections ใช้รูปแบบ "NxMxT มม."
  const cChannels: Array<{ size: string; sku: string; key: string }> = [
    { size: '60x30x10',  sku: 'CCHAN-60X30X10',  key: '60x30x10'  },
    { size: '75x45x15',  sku: 'CCHAN-75X45X15',  key: '75x45x15'  },
    { size: '100x50x20', sku: 'CCHAN-100X50X20', key: '100x50x20' },
    { size: '125x50x20', sku: 'CCHAN-125X50X20', key: '125x50x20' },
    { size: '150x65x20', sku: 'CCHAN-150X65X20', key: '150x65x20' },
  ]
  for (const c of cChannels) {
    items.push({
      sku: c.sku,
      nameTH: `เหล็กตัวซีดำ (C-Channel) ${c.size} มม.`,
      description: `เหล็กรูปพรรณตัวซีดำ ขนาด ${c.size} มม. ยาว 6 เมตร ใช้ทำโครงหลังคา งานโครงสร้างเบา`,
      price: lookupPrice(db.lipChannel, c.key),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กตัวซี',
      specs: `ขนาด: ${c.size} มม. | ยาว: 6 ม.`,
    })
  }

  // ─── เหล็กแบน Flat Bar ──────────────────────────────────────────────────
  // flat-bar-price.html: sections แยกด้วย WIDTH (12,15,19,25,32,38,44,50,65,75,90,100)
  // rows แยกด้วย thickness (col[0]) → ใช้ lookupPrice(map, widthKey, thickness)
  const flatBars: Array<{ size: string; widthKey: string; thick: number }> = [
    { size: '25x3',  widthKey: '25', thick: 3 },
    { size: '25x4',  widthKey: '25', thick: 4 },
    { size: '25x5',  widthKey: '25', thick: 5 },
    { size: '32x3',  widthKey: '32', thick: 3 },
    { size: '38x5',  widthKey: '38', thick: 5 },
    { size: '50x6',  widthKey: '50', thick: 6 },
    { size: '65x6',  widthKey: '65', thick: 6 },
    { size: '75x6',  widthKey: '75', thick: 6 },
  ]
  for (const fb of flatBars) {
    items.push({
      sku: `FBAR-${fb.size.replace('x','X')}`,
      nameTH: `เหล็กแบน (Flat Bar) ${fb.size} มม.`,
      description: `เหล็กแบนรีดร้อน ขนาด ${fb.size} มม. ความยาว 6 เมตร`,
      price: lookupPrice(db.flatBar, fb.widthKey, fb.thick),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กแบน / เหล็กฉาก',
      specs: `ขนาด: ${fb.size} มม. | ยาว: 6 ม.`,
    })
  }

  // ─── เหล็กฉาก Angle Bar ─────────────────────────────────────────────────
  // angle-bar-price.html — sections แยกด้วย outer dim (25x25, 30x30…)
  // rows แยกด้วย thickness → ใช้ lookupPrice(..., thick)
  const angleBars: Array<{ size: string; outerKey: string; thick: number }> = [
    { size: '25x25x3',   outerKey: '25x25',   thick: 3 },
    { size: '30x30x3',   outerKey: '30x30',   thick: 3 },
    { size: '40x40x4',   outerKey: '40x40',   thick: 4 },
    { size: '50x50x5',   outerKey: '50x50',   thick: 5 },
    { size: '60x60x6',   outerKey: '60x60',   thick: 6 },
    { size: '75x75x6',   outerKey: '75x75',   thick: 6 },
    { size: '100x100x8', outerKey: '100x100', thick: 8 },
  ]
  for (const ab of angleBars) {
    items.push({
      sku: `ABAR-${ab.size.replace(/x/g,'X')}`,
      nameTH: `เหล็กฉาก (Angle Bar) ${ab.size} มม.`,
      description: `เหล็กฉากรีดร้อน ขนาด ${ab.size} มม. ความยาว 6 เมตร ใช้งานโครงสร้างทั่วไป`,
      price: lookupPrice(db.angleBar, ab.outerKey, ab.thick),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กแบน / เหล็กฉาก',
      specs: `ขนาด: ${ab.size} มม. | ยาว: 6 ม.`,
    })
  }

  // ─── เหล็กบีม I-Beam ────────────────────────────────────────────────────
  // I-beam sections บน steellead ใช้ขนาด H mm เช่น 100x50, 150x75…
  const iBeams: Array<{ size: string; key: string }> = [
    { size: '100x50',  key: '100x50'  },
    { size: '150x75',  key: '150x75'  },
    { size: '200x100', key: '200x100' },
    { size: '250x125', key: '250x125' },
    { size: '300x150', key: '300x150' },
  ]
  for (const b of iBeams) {
    items.push({
      sku: `IBEAM-${b.size.replace('x','X')}`,
      nameTH: `เหล็กบีม (I-Beam) ${b.size} มม.`,
      description: `เหล็กบีมรีดร้อน ขนาด ${b.size} มม. ความยาว 6 เมตร ใช้งานโครงสร้างอาคาร`,
      price: lookupPrice(db.iBeam, b.key),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กบีม',
      specs: `ขนาด: ${b.size} มม. | ยาว: 6 ม.`,
    })
  }

  // ─── เหล็กไวด์แฟรงค์ / H-Beam ──────────────────────────────────────────
  // h-beam-price.html: sections ใช้ HxB เช่น 100x100, 125x125, 150x150…
  const wfBeams: Array<{ size: string; key: string }> = [
    { size: 'WF100x100', key: '100x100' },
    { size: 'WF125x125', key: '125x125' },
    { size: 'WF150x150', key: '150x150' },
    { size: 'WF200x200', key: '200x200' },
    { size: 'WF250x250', key: '250x250' },
    { size: 'WF300x300', key: '300x300' },
  ]
  for (const w of wfBeams) {
    items.push({
      sku: `WFBEAM-${w.size}`,
      nameTH: `เหล็กไวด์แฟรงค์ (WF Beam) ${w.size} มม.`,
      description: `เหล็กไวด์แฟรงค์รีดร้อน ขนาด ${w.size} มม. ความยาว 6 เมตร ใช้งานโครงสร้างอาคาร`,
      price: lookupPrice(db.wfBeam, w.key),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กบีม',
      specs: `ขนาด: ${w.size} มม. | ยาว: 6 ม. | มาตรฐาน: SS400`,
    })
  }

  // ─── ท่อเหล็กกลมดำ ERW ──────────────────────────────────────────────────
  // round-pipe-price.html — sections ใช้ inch notation
  const blackPipes: Array<{ size: string; inchDec: string }> = [
    { size: '1/2"',  inchDec: '0.50in' },
    { size: '3/4"',  inchDec: '0.75in' },
    { size: '1"',    inchDec: '1.00in' },
    { size: '1.5"',  inchDec: '1.50in' },
    { size: '2"',    inchDec: '2.00in' },
    { size: '3"',    inchDec: '3.00in' },
    { size: '4"',    inchDec: '4.00in' },
  ]
  for (const p of blackPipes) {
    const skuSafe = p.size.replace(/["/]/g, '')
    items.push({
      sku: `SPIPE-${skuSafe}`,
      nameTH: `ท่อเหล็กกลมดำ ERW ขนาด ${p.size}`,
      description: `ท่อเหล็กกลมดำ มาตรฐาน มอก.107 ขนาด ${p.size} ความยาว 6 เมตร`,
      price: lookupPrice(db.blackPipe, p.inchDec),
      brand: '', imageUrl: '', localImage: '',
      category: 'ท่อเหล็ก',
      specs: `ขนาด: ${p.size} | มาตรฐาน: มอก.107 | ความยาว: 6 ม.`,
    })
  }

  // ─── ท่อเหล็กกัลวาไนซ์ GI ───────────────────────────────────────────────
  // plumbing-steel-pipe.html — sections ใช้ inch notation
  const giPipes: Array<{ size: string; inchDec: string }> = [
    { size: '1/2"',  inchDec: '0.50in' },
    { size: '3/4"',  inchDec: '0.75in' },
    { size: '1"',    inchDec: '1.00in' },
    { size: '1.25"', inchDec: '1.25in' },
    { size: '1.5"',  inchDec: '1.50in' },
    { size: '2"',    inchDec: '2.00in' },
    { size: '2.5"',  inchDec: '2.50in' },
    { size: '3"',    inchDec: '3.00in' },
    { size: '4"',    inchDec: '4.00in' },
  ]
  for (const p of giPipes) {
    const skuSafe = p.size.replace(/["/]/g, '')
    items.push({
      sku: `GIPIPE-${skuSafe}`,
      nameTH: `ท่อเหล็กกัลวาไนซ์ GI ขนาด ${p.size}`,
      description: `ท่อเหล็กกัลวาไนซ์เคลือบสังกะสี มาตรฐาน มอก.107 ขนาด ${p.size} ความยาว 6 เมตร ป้องกันสนิม`,
      price: lookupPrice(db.giPipe, p.inchDec),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กกัลวาไนซ์ (GI)',
      specs: `ขนาด: ${p.size} | เคลือบ: กัลวาไนซ์ HDG | ยาว: 6 ม.`,
    })
  }

  // ─── เหล็กกล่องกัลวาไนซ์ GI ────────────────────────────────────────────
  const galvBoxes = ['25x25','40x40','50x50','25x50','40x60','50x100']
  for (const sz of galvBoxes) {
    items.push({
      sku: `GIBOX-${sz.replace('x','X')}`,
      nameTH: `เหล็กกล่องกัลวาไนซ์ ${sz} มม.`,
      description: `เหล็กกล่องกัลวาไนซ์เคลือบสังกะสี ขนาด ${sz} มม. ความยาว 6 เมตร`,
      price: lookupPrice(db.galvBox, sz),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กกัลวาไนซ์ (GI)',
      specs: `ขนาด: ${sz} มม. | เคลือบ: กัลวาไนซ์ | ยาว: 6 ม.`,
    })
  }

  // ─── เหล็กตัวซีกัลวาไนซ์ GI ────────────────────────────────────────────
  const giChannels: Array<{ size: string; key: string }> = [
    { size: 'C60x30x10',  key: '60x30x10'  },
    { size: 'C75x45x15',  key: '75x45x15'  },
    { size: 'C100x50x20', key: '100x50x20' },
    { size: 'C125x50x20', key: '125x50x20' },
    { size: 'C150x65x20', key: '150x65x20' },
  ]
  for (const c of giChannels) {
    items.push({
      sku: `GICCHAN-${c.size}`,
      nameTH: `เหล็กตัวซีกัลวาไนซ์ ${c.size} มม.`,
      description: `เหล็กตัวซีกัลวาไนซ์ ขนาด ${c.size} มม. ความยาว 6 เมตร ใช้ทำโครงหลังคาโรงงาน`,
      price: lookupPrice(db.lipChannel, c.key),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กกัลวาไนซ์ (GI)',
      specs: `ขนาด: ${c.size} มม. | ยาว: 6 ม.`,
    })
  }

  // ─── เหล็กรางน้ำ U-Channel ──────────────────────────────────────────────
  // light-channel-price.html: sections ใช้ format HxBxB เช่น 75x38x38, 100x50x50
  const uChannels: Array<{ size: string; key: string }> = [
    { size: 'U75x38',   key: '75x38x38'   },
    { size: 'U100x50',  key: '100x50x50'  },
    { size: 'U150x75',  key: '150x75x75'  },
    { size: 'U200x75',  key: '200x75x75'  },
    { size: 'U250x75',  key: '250x75x75'  },
    { size: 'U300x50',  key: '300x50x50'  },
  ]
  for (const u of uChannels) {
    items.push({
      sku: `UCHAN-${u.size}`,
      nameTH: `เหล็กรางน้ำ (U-Channel) ${u.size} มม.`,
      description: `เหล็กรูปพรรณรางน้ำ ขนาด ${u.size} มม. ความยาว 6 เมตร`,
      price: lookupPrice(db.uChannel, u.key),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กรางน้ำ / U-Channel',
      specs: `ขนาด: ${u.size} มม. | ยาว: 6 ม.`,
    })
  }

  // ─── เหล็กแผ่นดำ ────────────────────────────────────────────────────────
  // steel-sheet-price.html — virtual sections สร้างจาก rows ของ "แผ่นดำ HR"
  // key = thickness เช่น "1.2", "2.0", "3.0"
  const sheets: Array<{ thick: string; key: string }> = [
    { thick: '1.2mm', key: '1.2' },
    { thick: '2.0mm', key: '2.0' },
    { thick: '3.0mm', key: '3.0' },
    { thick: '4.5mm', key: '4.5' },
    { thick: '6.0mm', key: '6.0' },
    { thick: '9.0mm', key: '9.0' },
  ]
  for (const s of sheets) {
    items.push({
      sku: `SHEET-${s.thick.replace('.','').replace('mm','')}`,
      nameTH: `เหล็กแผ่นดำ หนา ${s.thick}`,
      description: `เหล็กแผ่นดำรีดร้อน ขนาด 1,219x2,438 มม. หนา ${s.thick} มาตรฐาน มอก.`,
      price: lookupPrice(db.sheet, s.key),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กแผ่นดำ',
      specs: `ความหนา: ${s.thick} | ขนาด: 1,219x2,438 มม. | มาตรฐาน: มอก.`,
    })
  }

  // ─── ตะแกรงไวร์เมช Wire Mesh ─────────────────────────────────────────────
  // steel-wire-mesh-price.html — sections แยกด้วย mesh spacing (200x200, 150x150)
  // rows แยกด้วย wire diameter (col[0] = mm)
  // ไวร์เมชมาตรฐาน TIS คือ @200x200 มม.
  const wireMeshes: Array<{ size: string; meshKey: string; wireDiam: number }> = [
    { size: 'RB6 (6mm)',   meshKey: '200x200', wireDiam: 6  },
    { size: 'RB7 (7mm)',   meshKey: '200x200', wireDiam: 7  },
    { size: 'RB8 (8mm)',   meshKey: '200x200', wireDiam: 8  },
    { size: 'RB9 (9mm)',   meshKey: '200x200', wireDiam: 9  },
    { size: 'RB10 (10mm)', meshKey: '200x200', wireDiam: 10 },
  ]
  for (const m of wireMeshes) {
    items.push({
      sku: `WMESH-${m.size.split('(')[0]!.trim()}`,
      nameTH: `ตะแกรงไวร์เมช ${m.size}`,
      description: `ตะแกรงไวร์เมช ขนาด ${m.size} แผ่นขนาด 2.2x6 ม. ใช้สำหรับเทพื้น`,
      price: lookupPrice(db.wireMesh, m.meshKey, m.wireDiam),
      brand: '', imageUrl: '', localImage: '',
      category: 'ตะแกรงไวร์เมช',
      specs: `ขนาดลวด: ${m.size} | แผ่น: 2.2x6 ม.`,
    })
  }

  // ─── เหล็กปลอก (ราคาต่อเส้น — steellead ไม่มีหน้าเฉพาะ) ──────────────
  const stirrups: Array<{ size: string; cat: string; price: number }> = [
    { size: '6mm (RB6)', cat: 'ปลอกเสา', price: 8  },
    { size: '9mm (RB9)', cat: 'ปลอกเสา', price: 15 },
    { size: 'DB10',      cat: 'ปลอกคาน', price: 18 },
    { size: 'DB12',      cat: 'ปลอกคาน', price: 22 },
  ]
  for (const s of stirrups) {
    items.push({
      sku: `STIRRUP-${s.size.replace(/[^a-zA-Z0-9]/g,'')}`,
      nameTH: `เหล็กปลอก ${s.size} (${s.cat})`,
      description: `เหล็กปลอกดัดสำเร็จรูป ขนาด ${s.size} ${s.cat} ราคาต่อเส้น`,
      price: s.price,  // ราคาโดยประมาณ steellead ไม่มีหน้าเฉพาะ
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กปลอก (Cut & Bend)',
      specs: `ขนาด: ${s.size} | ประเภท: ${s.cat}`,
    })
  }

  // ─── ลวดผูกเหล็ก ────────────────────────────────────────────────────────
  items.push({
    sku: 'BWIRE-1KG',
    nameTH: 'ลวดผูกเหล็ก (ม้วน 1 กก.)',
    description: 'ลวดผูกเหล็กมาตรฐาน ขนาดเส้นผ่าศูนย์กลาง 1-1.2 มม. บรรจุ 1 กิโลกรัม',
    price: 45,
    brand: '', imageUrl: '', localImage: '',
    category: 'เหล็กเส้น / เหล็กข้ออ้อย',
    specs: 'น้ำหนัก: 1 กก.',
  })

  // ─── เหล็กรางพับ Z-Purlin ────────────────────────────────────────────────
  const zPurlins = [
    { size: 'Z100x50x20', key: '100x50x20' },
    { size: 'Z120x50x20', key: '120x50x20' },
    { size: 'Z150x65x20', key: '150x65x20' },
  ]
  for (const z of zPurlins) {
    items.push({
      sku: `ZPURL-${z.size}`,
      nameTH: `เหล็กรางพับ Z-Purlin ${z.size} มม.`,
      description: `เหล็กรางพับ Z-Purlin ขนาด ${z.size} มม. ความยาว 6 เมตร ใช้งานโครงหลังคาโรงงาน`,
      price: lookupPrice(db.lipChannel, z.key),
      brand: '', imageUrl: '', localImage: '',
      category: 'เหล็กตัวซี',
      specs: `ขนาด: ${z.size} มม. | ยาว: 6 ม.`,
    })
  }

  // ทุกสินค้าในไฟล์นี้อยู่ใต้หมวดแม่ "เหล็ก"
  // dynamic: สคริปสินค้าอื่นสามารถ return parentCategory: 'ท่อ PVC' ฯลฯ ได้เลย
  return items.map((item) => ({ ...item, parentCategory: item.parentCategory || 'เหล็ก' }))
}

// ════════════════════════════════════════════════════════════════════════════
//  CSV helper
// ════════════════════════════════════════════════════════════════════════════

function csvEscape(val: string | number): string {
  const s = String(val ?? '')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

// ════════════════════════════════════════════════════════════════════════════
//  MAIN
// ════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('🔩 scrape-steel.ts — สร้างรายการสินค้าเหล็ก (ไม่มีราคา)\n')

  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true })

  // ── 1. ดึงราคาสดจาก steellead.com (ปิดไว้ก่อน — กรอกราคาเองใน Google Sheets)
  // console.log('📡 กำลังดึงราคาจาก steellead.com...')
  // const db = await _fetchSteelLeadPrices()

  // ใช้ empty db → ราคาทั้งหมดจะเป็น 0 (กรอกเองใน CSV / Google Sheets)
  const db: SteelLeadDB = {
    deformedBar: emptyMap, roundBar:   emptyMap,
    blackBox:    emptyMap, galvBox:    emptyMap,
    angleBar:    emptyMap, flatBar:    emptyMap,
    lipChannel:  emptyMap, iBeam:     emptyMap,
    wfBeam:      emptyMap, uChannel:  emptyMap,
    sheet:       emptyMap, wireMesh:  emptyMap,
    giPipe:      emptyMap, blackPipe: emptyMap,
  }

  // ── 2. สร้างรายการสินค้า ────────────────────────────────────────────────
  console.log('📋 สร้างรายการสินค้า...')
  const products = getStandardSteelProducts(db)

  // ── 3. เขียน CSV ────────────────────────────────────────────────────────
  const headers = [
    'SKU', 'Product Name (TH)', 'Description (TH)',
    'Price', 'Compare At Price', 'Stock',
    'Brand', 'Model', 'Parent Category', 'Category',
    'Status', 'Featured', 'Image URLs',
  ]

  const rows = products.map((p) => [
    csvEscape(p.sku),
    csvEscape(p.nameTH),
    csvEscape(p.description),
    csvEscape(p.price),
    csvEscape(''),
    csvEscape(0),
    csvEscape(p.brand),
    csvEscape(''),
    csvEscape(p.parentCategory ?? ''),
    csvEscape(p.category),
    csvEscape('active'),
    csvEscape('false'),
    csvEscape(p.localImage || p.imageUrl || ''),
  ])

  const csv = headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n')
  fs.writeFileSync(OUT_CSV, '\ufeff' + csv, 'utf-8')

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ รวม ${products.length} รายการ (ชื่อ / รายละเอียด / ประเภท)`)
  console.log(`📄 CSV: ${OUT_CSV}`)
  console.log(`\nขั้นตอนต่อไป:`)
  console.log(`  1. เปิด steel-scraped.csv ใน Google Sheets`)
  console.log(`  2. กรอกคอลัมน์ Price ตามราคาขายจริงของร้าน`)
  console.log(`  3. รัน: pnpm gen:images       → สร้างรูปภาพอัตโนมัติ`)
  console.log(`  4. รัน: pnpm import:products   → import เข้า CMS`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
