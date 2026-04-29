import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Type for site settings
interface SiteSettings {
  siteName?: string
  siteTagline?: string
  siteDescription?: string
  siteKeywords?: string
  ogImage?: Media | string
  companyName?: string
  address?: string
  phone?: string
  email?: string
  businessHours?: string
  line?: string
  facebook?: string
}

// Extended Media type with sizes
interface MediaWithSizes extends Media {
  sizes?: {
    feature?: {
      url: string
      width?: number
      height?: number
    }
    card?: {
      url: string
      width?: number
      height?: number
    }
    thumbnail?: {
      url: string
      width?: number
      height?: number
    }
  }
}

// Helper function to get image URL from media object
const getImageURL = (
  image?: Media | Config['db']['defaultIDType'] | null,
  fallbackUrl?: string,
) => {
  const serverUrl = getServerSideURL()

  let url = fallbackUrl || serverUrl + '/jmc-og-image.svg'

  if (image && typeof image === 'object' && 'url' in image) {
    // ใช้ feature size ถ้ามี (1024x768) หรือ card size (768x576) สำหรับ OG
    const mediaWithSizes = image as MediaWithSizes
    const featureUrl = mediaWithSizes.sizes?.feature?.url
    const cardUrl = mediaWithSizes.sizes?.card?.url
    const originalUrl = image.url
    const filename = image.filename || undefined
    const prefix = (image as unknown as { prefix?: string }).prefix

    let finalUrl = null

    if (featureUrl) {
      finalUrl = featureUrl
    } else if (cardUrl) {
      finalUrl = cardUrl
    } else if (originalUrl) {
      finalUrl = originalUrl
    }

    if (finalUrl && finalUrl !== 'undefined') {
      // ตามเอกสาร PayloadCMS v3 + Vercel Blob Storage
      // media.url จะเป็น absolute URL จาก Blob Storage เสมอ
      if (finalUrl.startsWith('http')) {
        // Absolute URL จาก Blob Storage - ใช้โดยตรง (ถูกต้องตามเอกสาร)
        url = finalUrl
      } else {
        // Fallback robust: รองรับหลายรูปแบบให้มากที่สุด
        // 1) ถ้ามี prefix + filename (Vercel Blob) ให้ใช้โดยตรง
        if (prefix && filename) {
          url = `${prefix}/${filename}`
        }
        // 2) ถ้ามี filename อย่างเดียว ใช้เส้นทาง Payload v3 ที่ถูกต้อง
        else if (filename) {
          url = `${serverUrl}/api/collections/media/file/${filename}`
        }
        // 3) ถ้า finalUrl เป็น '/media/xyz' หรือ 'media/xyz' ให้แม็พเป็นเส้นทาง Payload v3
        else if (/^\/?media\//.test(finalUrl)) {
          url = `${serverUrl}/api/collections/media/file/${finalUrl.replace(/^\/?media\//, '')}`
        }
        // 4) ถ้า finalUrl เป็น relative path ทั่วไป ให้ต่อกับ serverUrl
        else if (finalUrl.startsWith('/')) {
          url = `${serverUrl}${finalUrl}`
        } else {
          // 5) สุดท้าย fallback OG image เริ่มต้น
          console.warn('⚠️ Unexpected media path; using default OG image:', finalUrl)
          url = serverUrl + '/jmc-og-image.svg'
        }
      }
    }

    console.log('🖼️ Image URL processed:', {
      hasFeature: !!featureUrl,
      hasCard: !!cardUrl,
      hasOriginal: !!originalUrl,
      finalUrl: url,
    })
  }

  return url
}

// Google Algorithm 2025 - Enhanced title generation with local keywords
const generateOptimizedTitle = (
  pageTitle?: string,
  _siteName?: string,
  pageType?: 'home' | 'page' | 'product' | 'category' | 'post',
  pageSlug?: string,
): string => {
  const businessName = 'จงมีชัยค้าวัสดุ'
  const localKeywords = 'ตลิ่งชัน ปากซอยชักพระ6'
  const primaryKeywords = 'วัสดุก่อสร้าง ใกล้ฉัน'

  // Special handling for contact page
  if (pageSlug === 'contactus-' || pageSlug === 'contact') {
    return pageTitle
      ? `${pageTitle} - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | JMC`
      : 'ติดต่อเรา - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | จงมีชัยค้าวัสดุ'
  }

  // Special handling for about page
  if (pageSlug === 'aboutus' || pageSlug === 'about') {
    return pageTitle
      ? `${pageTitle} - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | JMC`
      : 'เกี่ยวกับเรา - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | จงมีชัยค้าวัสดุ'
  }

  // Default titles optimized for Google 2026 - Local Map Pack + Multi-area targeting
  const defaultTitles = {
    home: `${businessName} ${localKeywords} | ${primaryKeywords} แถวตลิ่งชัน ราคาถูก ส่งฟรี ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย`,
    page: pageTitle
      ? `${pageTitle} | ${businessName} ${localKeywords}`
      : `${businessName} ${localKeywords}`,
    product: pageTitle
      ? `${pageTitle} | ${businessName} ${localKeywords} ราคาดี`
      : `สินค้า ${businessName}`,
    category: pageTitle
      ? `หมวด${pageTitle} | ${businessName} ${localKeywords}`
      : `หมวดสินค้า ${businessName}`,
    post: pageTitle ? `${pageTitle} | บทความ ${businessName}` : `บทความ ${businessName}`,
  }

  if (pageTitle) {
    return defaultTitles[pageType || 'page']
  }

  return defaultTitles[pageType || 'home']
}

// Google Algorithm 2025 - Enhanced description with semantic keywords
const generateOptimizedDescription = (
  pageDescription?: string,
  pageType?: 'home' | 'page' | 'product' | 'category' | 'post',
  pageTitle?: string,
  pageSlug?: string,
): string => {
  const baseDescription =
    'จงมีชัยค้าวัสดุ แถวตลิ่งชัน ปากซอยชักพระ6 ร้านวัสดุก่อสร้างครบวงจร ราคาถูก ส่งด่วนถึงไซต์งาน'
  const semanticKeywords = 'อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ครบจบที่เดียว'
  const trustSignals = 'บริการมืออาชีพ รับประกันคุณภาพ'

  // Special handling for contact page
  if (pageSlug === 'contactus-' || pageSlug === 'contact') {
    return (
      pageDescription ||
      'ติดต่อร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 โทร 02-434-8319 เปิด จ-ส 07:00-17:00 น. ดูแผนที่ร้าน ข้อมูลติดต่อครบถ้วน'
    )
  }

  // Special handling for about page
  if (pageSlug === 'aboutus' || pageSlug === 'about') {
    return (
      pageDescription ||
      'เกี่ยวกับจงมีชัยค้าวัสดุ ก่อตั้งปี 2020 ร้านวัสดุก่อสร้างครบวงจร ตลิ่งชัน ปากซอยชักพระ6 ให้บริการชุมชน มีประสบการณ์กว่า 35 ปี ราคาถูก คุณภาพเยี่ยม'
    )
  }

  if (pageDescription) {
    // เพิ่ม local keywords และ trust signals
    return `${pageDescription} ${baseDescription} ${trustSignals}`
  }

  const defaultDescriptions = {
    home: `🏆 ร้านวัสดุก่อสร้างที่อยู่ใกล้ฉัน อันดับ1 ${baseDescription} ส่งฟรี ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย ${semanticKeywords} ${trustSignals} โทร 02-434-8319`,
    page: `${pageTitle ? pageTitle + ' - ' : ''}${baseDescription} ${trustSignals}`,
    product: `${pageTitle ? pageTitle + ' คุณภาพสูง - ' : ''}${baseDescription} ${trustSignals}`,
    category: `${pageTitle ? 'สินค้า' + pageTitle + ' - ' : ''}${baseDescription} ${semanticKeywords}`,
    post: `${pageTitle ? pageTitle + ' - ' : ''}เทคนิคและความรู้ ${baseDescription}`,
  }

  return defaultDescriptions[pageType || 'home']
}

// Google Algorithm 2026 - Generate keywords with semantic search + Local Map Pack support
const generateKeywords = (
  siteKeywords?: string,
  pageType?: 'home' | 'page' | 'product' | 'category' | 'post',
  pageTitle?: string,
): string => {
  // ─── 1. CORE ───────────────────────────────────────────────────────────────
  const coreKeywords = [
    'วัสดุก่อสร้าง',
    'ร้านวัสดุก่อสร้าง',
    'ตลิ่งชัน',
    'ใกล้ฉัน',
    'ปากซอยชักพระ6',
    'จงมีชัยค้าวัสดุ',
    'วัสดุก่อสร้างราคาถูก',
    'วัสดุก่อสร้างครบวงจร',
    'จำหน่ายวัสดุก่อสร้าง',
    'ขายวัสดุก่อสร้าง',
  ]

  // ─── 2. NEAR-ME / LOCAL INTENT ─────────────────────────────────────────────
  const nearMeKeywords = [
    'ร้านวัสดุก่อสร้างใกล้ฉัน',
    'วัสดุก่อสร้างใกล้ฉัน',
    'ร้านวัสดุก่อสร้างที่อยู่ใกล้ฉัน',
    'ร้านวัสดุก่อสร้างที่อยู่ใกล้',
    'วัสดุก่อสร้างที่อยู่ใกล้ฉัน',
    'ร้านวัสดุที่อยู่ใกล้ฉัน',
    'ร้านวัสดุใกล้ฉัน',
    'วัสดุใกล้ฉัน',
    'หาร้านวัสดุก่อสร้างใกล้ฉัน',
    'ซื้อวัสดุก่อสร้างที่ไหนดี',
    'ร้านค้าวัสดุก่อสร้างใกล้ฉัน',
    'ร้านวัสดุก่อสร้างที่ใกล้ที่สุด',
    'hardware store near me',
    'building materials near me',
  ]

  // ─── 3. ตลิ่งชัน AREA PATTERNS ────────────────────────────────────────────
  const talingchanKeywords = [
    // แถว
    'วัสดุก่อสร้างแถวตลิ่งชัน',
    'ร้านวัสดุก่อสร้างแถวตลิ่งชัน',
    'วัสดุก่อสร้าง แถวตลิ่งชัน',
    'ร้านวัสดุก่อสร้าง แถวตลิ่งชัน',
    'วัสดุก่อสร้างที่อยู่แถวตลิ่งชัน',
    // ย่าน
    'วัสดุก่อสร้างย่านตลิ่งชัน',
    'ร้านวัสดุก่อสร้างย่านตลิ่งชัน',
    'วัสดุก่อสร้าง ย่านตลิ่งชัน',
    'ร้านวัสดุก่อสร้าง ย่านตลิ่งชัน',
    // เขต/พื้นที่
    'วัสดุก่อสร้างเขตตลิ่งชัน',
    'ร้านวัสดุก่อสร้างเขตตลิ่งชัน',
    'วัสดุก่อสร้าง เขตตลิ่งชัน',
    'วัสดุก่อสร้าง ตลิ่งชัน กรุงเทพ',
    // ชักพระ
    'วัสดุก่อสร้าง ชักพระ',
    'ร้านวัสดุก่อสร้าง ชักพระ',
    'วัสดุก่อสร้างแถวชักพระ',
    'วัสดุก่อสร้าง ถนนชักพระ',
    // ใกล้ฉัน ตลิ่งชัน
    'วัสดุก่อสร้างใกล้ฉัน ตลิ่งชัน',
    'ร้านวัสดุก่อสร้างใกล้ฉัน ตลิ่งชัน',
  ]

  // ─── 4. OTHER AREA KEYWORDS ────────────────────────────────────────────────
  const areaKeywords = [
    'วัสดุก่อสร้างใกล้ฉัน ปิ่นเกล้า',
    'วัสดุก่อสร้างแถวปิ่นเกล้า',
    'วัสดุก่อสร้างย่านปิ่นเกล้า',
    'ร้านวัสดุก่อสร้าง ปิ่นเกล้า',
    'วัสดุก่อสร้าง ปิ่นเกล้า',
    'วัสดุก่อสร้างใกล้ฉัน จรัญ',
    'วัสดุก่อสร้างแถวจรัญ',
    'วัสดุก่อสร้าง จรัญสนิทวงศ์',
    'ร้านวัสดุก่อสร้าง จรัญ',
    'วัสดุก่อสร้างใกล้ฉัน บางขุนนนท์',
    'วัสดุก่อสร้างแถวบางขุนนนท์',
    'วัสดุก่อสร้าง บางขุนนนท์',
    'ร้านวัสดุก่อสร้าง บางขุนนนท์',
    'วัสดุก่อสร้างใกล้ฉัน บรม',
    'วัสดุก่อสร้าง บรมราชชนนี',
    'ร้านวัสดุก่อสร้าง บรม',
    'วัสดุก่อสร้างใกล้ฉัน สวนผัก',
    'วัสดุก่อสร้าง สวนผัก',
    'ร้านวัสดุก่อสร้าง สวนผัก',
    'วัสดุก่อสร้างใกล้ฉัน พระราม5',
    'วัสดุก่อสร้าง พระราม 5',
    'ร้านวัสดุก่อสร้าง พระราม5',
    'วัสดุก่อสร้างใกล้ฉัน บางกรวย',
    'วัสดุก่อสร้าง บางกรวย',
    'ร้านวัสดุก่อสร้าง บางกรวย',
    'วัสดุก่อสร้าง บางพลัด',
    'วัสดุก่อสร้าง ท่าพระ',
    'วัสดุก่อสร้าง บางกอกน้อย',
    'วัสดุก่อสร้าง ธนบุรี',
    'วัสดุก่อสร้าง บางบำหรุ',
  ]

  // ─── 5. PRODUCT-SPECIFIC: อิฐ ───────────────────────────────────────────────
  const brickKeywords = [
    'อิฐ',
    'อิฐใกล้ฉัน',
    'อิฐแดง',
    'อิฐมอญ',
    'อิฐบล็อก',
    'อิฐก่อสร้าง',
    'อิฐมวลเบา',
    'อิฐโฟม',
    'อิฐแดงใกล้ฉัน',
    'อิฐมอญใกล้ฉัน',
    'อิฐ ตลิ่งชัน',
    'อิฐแดง ตลิ่งชัน',
    'ราคาอิฐแดง',
    'อิฐก่อสร้างราคาถูก',
  ]

  // ─── 6. PRODUCT-SPECIFIC: ปูน ───────────────────────────────────────────────
  const cementKeywords = [
    'ปูน',
    'ปูนซีเมนต์',
    'ปูนใกล้ฉัน',
    'ปูนซีเมนต์ใกล้ฉัน',
    'ปูนก่อ',
    'ปูนฉาบ',
    'ปูนเทพื้น',
    'ปูนสำเร็จรูป',
    'ปูนซีเมนต์ ตลิ่งชัน',
    'ปูนซีเมนต์ราคาถูก',
    'ปูน TPI',
    'ปูน SCG',
    'ปูนนกอินทรีย์',
    'ปูนผสม',
    'ปูนขาว',
    'ปูนยิปซัม',
  ]

  // ─── 7. PRODUCT-SPECIFIC: ทราย ──────────────────────────────────────────────
  const sandKeywords = [
    'ทราย',
    'ทรายใกล้ฉัน',
    'ทรายก่อสร้าง',
    'ทรายหยาบ',
    'ทรายละเอียด',
    'ทรายล้าง',
    'ทรายถม',
    'ทรายผสมปูน',
    'ทราย ตลิ่งชัน',
    'ทรายก่อสร้างราคาถูก',
    'ทรายหยาบใกล้ฉัน',
    'ราคาทราย',
  ]

  // ─── 8. PRODUCT-SPECIFIC: หิน ───────────────────────────────────────────────
  const stoneKeywords = [
    'หิน',
    'หินใกล้ฉัน',
    'หิน 3/4',
    'หินคลุก',
    'หินก่อสร้าง',
    'หินฝุ่น',
    'หินเกล็ด',
    'หินแกรนิต',
    'หิน ตลิ่งชัน',
    'หินก่อสร้างราคาถูก',
    'ราคาหิน',
  ]

  // ─── 9. PRODUCT-SPECIFIC: เหล็ก ─────────────────────────────────────────────
  const steelKeywords = [
    'เหล็ก',
    'เหล็กใกล้ฉัน',
    'เหล็กเส้น',
    'เหล็กเส้นใกล้ฉัน',
    'เหล็กฉาก',
    'เหล็กกล่อง',
    'เหล็กแบน',
    'เหล็กหน้า 3',
    'เหล็กหน้า 4',
    'เหล็กหน้า 6',
    'เหล็กตะแกรง',
    'เหล็กรูปพรรณ',
    'เหล็กก่อสร้าง',
    'เหล็ก ตลิ่งชัน',
    'ราคาเหล็กเส้น',
    'เหล็กก่อสร้างราคาถูก',
    'เหล็กเส้นราคาถูก',
    'เหล็กกล่องราคาถูก',
  ]

  // ─── 10. PRODUCT-SPECIFIC: ประปา ─────────────────────────────────────────────
  const plumbingKeywords = [
    'ประปาใกล้ฉัน',
    'อุปกรณ์ประปา',
    'ท่อประปา',
    'ท่อ PVC',
    'ท่อ PVC ใกล้ฉัน',
    'ท่อน้ำ',
    'ท่อระบายน้ำ',
    'ท่อซีเมนต์',
    'ปั๊มน้ำ',
    'ปั๊มน้ำใกล้ฉัน',
    'ถังน้ำ',
    'ก๊อกน้ำ',
    'ฝักบัว',
    'วาล์วน้ำ',
    'สุขภัณฑ์',
    'โถส้วม',
    'อ่างล้างหน้า',
    'ราวจับ',
    'ท่อ PVC ตลิ่งชัน',
    'ปั๊มน้ำ ตลิ่งชัน',
    'อุปกรณ์ประปาใกล้ฉัน',
  ]

  // ─── 11. PRODUCT-SPECIFIC: ไฟฟ้า ─────────────────────────────────────────────
  const electricKeywords = [
    'ไฟฟ้าใกล้ฉัน',
    'อุปกรณ์ไฟฟ้า',
    'สายไฟ',
    'สายไฟใกล้ฉัน',
    'ท่อร้อยสาย',
    'ท่อ EMT',
    'เบรกเกอร์',
    'ตู้เบรกเกอร์',
    'ปลั๊กไฟ',
    'สวิตช์ไฟ',
    'หลอดไฟ',
    'โคมไฟ',
    'สายดิน',
    'สายไฟ IEC',
    'อุปกรณ์ไฟฟ้าใกล้ฉัน',
    'สายไฟ ตลิ่งชัน',
  ]

  // ─── 12. PRODUCT-SPECIFIC: สีทาบ้าน ─────────────────────────────────────────
  const paintKeywords = [
    'สีทาบ้าน',
    'สีทาบ้านใกล้ฉัน',
    'สีน้ำ',
    'สีน้ำมัน',
    'สีรองพื้น',
    'น้ำยากันซึม',
    'สีภายนอก',
    'สีภายใน',
    'สีทนร้อน',
    'สี TOA',
    'สี Nippon',
    'สี Dulux',
    'สีทาบ้าน ตลิ่งชัน',
    'ผสมสี',
    'คำนวณสี',
    'สีทาบ้านราคาถูก',
  ]

  // ─── 13. PRODUCT-SPECIFIC: กระเบื้อง ────────────────────────────────────────
  const tileKeywords = [
    'กระเบื้อง',
    'กระเบื้องใกล้ฉัน',
    'กระเบื้องปูพื้น',
    'กระเบื้องบุผนัง',
    'กระเบื้องหลังคา',
    'กระเบื้องลอนคู่',
    'กระเบื้องแกรนิต',
    'กระเบื้องเซรามิก',
    'กระเบื้อง ตลิ่งชัน',
    'กระเบื้องหลังคาราคาถูก',
    'กระเบื้องปูพื้นใกล้ฉัน',
  ]

  // ─── 14. PRODUCT-SPECIFIC: ไม้ + แผ่น ────────────────────────────────────────
  const woodKeywords = [
    'ไม้ก่อสร้าง',
    'ไม้ก่อสร้างใกล้ฉัน',
    'ไม้แบบ',
    'ไม้ค้ำ',
    'ไม้อัด',
    'ไม้พื้น',
    'ไม้เนื้อแข็ง',
    'ไม้เนื้ออ่อน',
    'ซีเมนต์บอร์ด',
    'ยิปซัมบอร์ด',
    'แผ่นผนังสำเร็จ',
    'ไม้ฝา',
    'ไม้ระแนง',
  ]

  // ─── 15. PRODUCT-SPECIFIC: ประตู/หน้าต่าง ────────────────────────────────────
  const doorWindowKeywords = [
    'ประตูหน้าต่าง',
    'ประตูหน้าต่างใกล้ฉัน',
    'ประตูเหล็ก',
    'ประตูไม้',
    'ประตู UPVC',
    'ประตูบานเลื่อน',
    'หน้าต่างอลูมิเนียม',
    'หน้าต่าง UPVC',
    'มุ้งลวด',
    'ลูกบิดประตู',
    'บานพับ',
    'ประตู ตลิ่งชัน',
    'ประตูเหล็กใกล้ฉัน',
  ]

  // ─── 16. PRODUCT-SPECIFIC: อุปกรณ์/เคมี ─────────────────────────────────────
  const chemicalKeywords = [
    'ซิลิโคน',
    'กาวร้าว',
    'น้ำยาเคมีก่อสร้าง',
    'โฟม PU',
    'น้ำยากันซึมหลังคา',
    'น้ำยาปูน',
    'น้ำยาฉาบ',
    'กาวซีเมนต์',
    'กาวกระเบื้อง',
    'อีพ็อกซี่',
    'สีสเปรย์',
    'ทินเนอร์',
    'แอลกอฮอล์',
  ]

  // ─── 17. PRODUCT-SPECIFIC: อุปกรณ์ช่าง/เครื่องมือ ──────────────────────────
  const toolKeywords = [
    'อุปกรณ์ก่อสร้าง',
    'อุปกรณ์ก่อสร้างใกล้ฉัน',
    'เครื่องมือก่อสร้าง',
    'สว่าน',
    'เลื่อย',
    'ค้อน',
    'ประแจ',
    'นั่งร้าน',
    'ถังน้ำ',
    'รถเข็นปูน',
    'ถาดปูน',
    'พลั่ว',
    'จอบ',
    'เหล็กเสริม',
    'ตะปู',
    'น็อต',
    'สกรู',
    'วงแหวน',
  ]

  // ─── 18. SERVICE KEYWORDS ─────────────────────────────────────────────────────
  const serviceKeywords = [
    'ส่งวัสดุก่อสร้างฟรี',
    'ส่งฟรีถึงบ้าน',
    'ส่งถึงไซต์งาน',
    'ส่งด่วนวัสดุก่อสร้าง',
    'วัสดุก่อสร้างส่งฟรี',
    'รับสินค้าได้เลย',
    'บริการส่ง ตลิ่งชัน',
    'วัสดุก่อสร้างราคาส่ง',
    'ราคาโรงงาน',
    'ราคาต้นทุน',
  ]

  // ─── 19. CONSTRUCTION PROJECT KEYWORDS ───────────────────────────────────────
  const projectKeywords = [
    'ก่อสร้างบ้าน',
    'ต่อเติมบ้าน',
    'ซ่อมแซมบ้าน',
    'ปรับปรุงบ้าน',
    'รีโนเวทบ้าน',
    'รีโนเวท',
    'ทาสีบ้าน',
    'ปูกระเบื้อง',
    'ก่ออิฐ',
    'เทพื้นคอนกรีต',
    'ผู้รับเหมา',
    'ช่างก่อสร้าง',
    'ช่างซ่อม',
    'สร้างรั้ว',
    'สร้างโรงรถ',
    'ห้องน้ำ',
    'ครัว',
  ]

  const keywords = [
    ...coreKeywords,
    ...nearMeKeywords,
    ...talingchanKeywords,
    ...areaKeywords,
    ...brickKeywords,
    ...cementKeywords,
    ...sandKeywords,
    ...stoneKeywords,
    ...steelKeywords,
    ...plumbingKeywords,
    ...electricKeywords,
    ...paintKeywords,
    ...tileKeywords,
    ...woodKeywords,
    ...doorWindowKeywords,
    ...chemicalKeywords,
    ...toolKeywords,
    ...serviceKeywords,
    ...projectKeywords,
  ]

  if (siteKeywords) {
    keywords.unshift(...siteKeywords.split(',').map((k) => k.trim()))
  }

  if (pageTitle && pageType !== 'home') {
    keywords.unshift(pageTitle)
  }

  return keywords.join(', ')
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
  pageType?: 'home' | 'page' | 'product' | 'category' | 'post'
}): Promise<Metadata> => {
  const { doc, pageType = 'page' } = args

  // Default fallback values optimized for Google Algorithm 2025 - Multi-area targeting
  let defaultSiteName = 'จงมีชัยค้าวัสดุ'
  let defaultKeywords =
    'ร้านวัสดุก่อสร้างใกล้ฉัน, ร้านวัสดุก่อสร้างที่อยู่ใกล้, วัสดุก่อสร้างใกล้ฉัน, ร้านวัสดุก่อสร้างแถวตลิ่งชัน, วัสดุก่อสร้างแถวตลิ่งชัน, ร้านวัสดุก่อสร้างย่านตลิ่งชัน, วัสดุก่อสร้าง, ตลิ่งชัน, ใกล้ฉัน, ปากซอยชักพระ6, จงมีชัยค้าวัสดุ, ปิ่นเกล้า, จรัญ, บางขุนนนท์, บรม, สวนผัก, พระราม5, บางกรวย'
  let defaultOgImageUrl = getServerSideURL() + '/jmc-og-image.svg'
  let siteSettings: SiteSettings | null = null

  try {
    // Try to get site settings from database
    const payload = await getPayload({ config: configPromise })
    // Get site-settings global - suppress type warning
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (payload as any).findGlobal({
      slug: 'site-settings',
      depth: 1,
    })

    siteSettings = result as SiteSettings

    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Generate Meta - Site Settings:', {
        exists: !!siteSettings,
        siteName: siteSettings?.siteName,
        hasOgImage: !!siteSettings?.ogImage,
      })
    }

    if (siteSettings) {
      defaultSiteName = siteSettings.siteName || defaultSiteName
      defaultKeywords = siteSettings.siteKeywords || defaultKeywords

      // Get OG image from site settings
      if (siteSettings.ogImage) {
        defaultOgImageUrl = getImageURL(siteSettings.ogImage, defaultOgImageUrl)
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Using OG image from settings:', defaultOgImageUrl)
        }
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Failed to load site settings for meta generation:', error)
    }
  }

  // Extract page slug for specific page handling
  const pageSlug = Array.isArray(doc?.slug) ? doc.slug.join('/') : doc?.slug

  // Google Algorithm 2025 optimized meta generation with local SEO
  const optimizedTitle = generateOptimizedTitle(
    doc?.meta?.title || undefined,
    defaultSiteName,
    pageType,
    pageSlug || undefined,
  )

  const optimizedDescription = generateOptimizedDescription(
    doc?.meta?.description || undefined,
    pageType,
    doc?.meta?.title || (typeof doc?.title === 'string' ? doc.title : undefined),
    pageSlug || undefined,
  )

  const optimizedKeywords = generateKeywords(
    defaultKeywords,
    pageType,
    doc?.meta?.title || (typeof doc?.title === 'string' ? doc.title : undefined),
  )

  const ogImage = getImageURL(doc?.meta?.image, defaultOgImageUrl)

  // สร้าง array ของรูปภาพสำหรับ Open Graph และ Google Images
  const allImages: Array<{
    url: string
    width: number
    height: number
    alt: string
    type: string
  }> = []

  // เพิ่มรูปหลัก
  if (ogImage) {
    allImages.push({
      url: ogImage,
      width: 1200,
      height: 630,
      alt: doc?.meta?.title || optimizedTitle,
      type: 'image/jpeg',
    })
  }

  // เพิ่มรูปเพิ่มเติมจาก meta.images
  if (doc?.meta && 'images' in doc.meta && Array.isArray(doc.meta.images)) {
    doc.meta.images.forEach((image: Media | string | null, index: number) => {
      if (image && typeof image === 'object') {
        const imageUrl = getImageURL(image, undefined)
        if (imageUrl && imageUrl !== ogImage) {
          // หลีกเลี่ยงรูปซ้ำ
          allImages.push({
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${doc?.meta?.title || optimizedTitle} - รูปที่ ${index + 2}`,
            type: 'image/jpeg',
          })
        }
      }
    })
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🎯 Google Algorithm 2025 Optimized Meta:', {
      title: optimizedTitle,
      description: optimizedDescription,
      keywords: optimizedKeywords,
      pageType,
      ogImage,
    })
  }

  // Generate canonical URL — 'home' slug maps to root, not /home
  const canonicalUrl = Array.isArray(doc?.slug)
    ? `${getServerSideURL()}/${doc?.slug.join('/')}`
    : doc?.slug && doc.slug !== 'home'
      ? `${getServerSideURL()}/${doc.slug}`
      : getServerSideURL()

  return {
    title: optimizedTitle,
    description: optimizedDescription,
    keywords: optimizedKeywords,
    authors: [{ name: defaultSiteName }],
    creator: defaultSiteName,
    publisher: defaultSiteName,
    formatDetection: {
      telephone: true,
      address: true,
      email: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google99f65fca623e2661',
    },
    openGraph: await mergeOpenGraph({
      title: optimizedTitle,
      description: optimizedDescription,
      images: allImages.length > 0 ? allImages : undefined,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug || '/',
      siteName: defaultSiteName,
      locale: 'th_TH',
      type: pageType === 'post' ? 'article' : 'website',
      // Facebook Algorithm 2025 - Enhanced Open Graph
      ...(siteSettings?.companyName && {
        'business:contact_data:street_address': siteSettings.address,
        'business:contact_data:locality': 'ตลิ่งชัน',
        'business:contact_data:region': 'กรุงเทพมหานคร',
        'business:contact_data:postal_code': '10170',
        'business:contact_data:country_name': 'ประเทศไทย',
        'business:contact_data:phone_number': siteSettings.phone,
        'business:contact_data:email': siteSettings.email,
      }),
    }),
    // Google Algorithm 2025 - Enhanced Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: optimizedTitle,
      description: optimizedDescription,
      images: allImages.length > 0 ? allImages.map((img) => img.url) : undefined,
      creator: '@jmccompany',
      site: '@jmccompany',
    },
    // Google Algorithm 2025 - App Links for mobile optimization
    appLinks: {
      web: {
        url: canonicalUrl,
        should_fallback: true,
      },
    },
    // Additional meta for Google Algorithm 2025
    other: {
      'google-site-verification': 'google99f65fca623e2661',
      'format-detection': 'telephone=yes',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'theme-color': '#ffffff',
      'msapplication-navbutton-color': '#ffffff',
      'apple-mobile-web-app-title': defaultSiteName,
      'application-name': defaultSiteName,
      'geo.region': 'TH-10',
      'geo.placename': 'ตลิ่งชัน, กรุงเทพมหานคร',
      'geo.position': '13.780839074740534;100.4622982337261',
      ICBM: '13.780839074740534, 100.4622982337261',
      // Local Business Schema signals
      'business-type': 'construction materials store',
      'business-hours': siteSettings?.businessHours || 'Mo-Sat 07:00-17:00',
      'serves-location': 'ตลิ่งชัน, กรุงเทพมหานคร, ประเทศไทย',
    },
  }
}
