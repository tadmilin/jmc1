import PageTemplate from './[slug]/page'
import { generateMeta } from '@/utilities/generateMeta'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import Link from 'next/link'

export default PageTemplate

// เพิ่ม metadata เฉพาะสำหรับ homepage
export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config })

  try {
    const settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
    })

    // SEO สำหรับหน้าแรกโดยเฉพาะ
    const homeMetadata = generateMeta({
      title: 'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 | วัสดุก่อสร้าง ใกล้ฉัน ราคาถูก ส่งด่วน',
      description:
        'ร้านวัสดุก่อสร้าง ตลิ่งชัน ครบวงจร อิฐ หิน ปูน ทราย เหล็ก ท่อ PVC ราคาโรงงาน ส่งฟรี 24 ชม. บริการมืออาชีพ รับประกันคุณภาพ โทร 02-XXX-XXXX',
      doc: {
        slug: 'home',
        title: 'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6',
        meta: {
          title: 'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 | วัสดุก่อสร้าง ใกล้ฉัน ราคาถูก ส่งด่วน',
          description:
            'ร้านวัสดุก่อสร้าง ตลิ่งชัน ครบวงจร อิฐ หิน ปูน ทราย เหล็ก ท่อ PVC ราคาโรงงาน ส่งฟรี 24 ชม. บริการมืออาชีพ รับประกันคุณภาพ โทร 02-XXX-XXXX',
        },
      },
      collection: 'pages',
      siteSettings: settings,
      pageType: 'home',
    })

    return homeMetadata
  } catch (error) {
    console.error('Error generating home metadata:', error)

    // Fallback metadata
    return {
      title: 'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 | วัสดุก่อสร้าง ใกล้ฉัน ราคาถูก ส่งด่วน',
      description:
        'ร้านวัสดุก่อสร้าง ตลิ่งชัน ครบวงจร อิฐ หิน ปูน ทราย เหล็ก ท่อ PVC ราคาโรงงาน ส่งฟรี 24 ชม. บริการมืออาชีพ รับประกันคุณภาพ',
    }
  }
}
