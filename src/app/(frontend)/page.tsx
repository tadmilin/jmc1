import PageTemplate from './[slug]/page'
import { generateMeta } from '@/utilities/generateMeta'
import type { Metadata } from 'next'


export default PageTemplate

// เพิ่ม metadata เฉพาะสำหรับ homepage
export async function generateMetadata(): Promise<Metadata> {
 
  try {

    // SEO สำหรับหน้าแรกโดยเฉพาะ
    const homeMetadata = await generateMeta({
      doc: {
        slug: 'home',
        title: 'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6',
        meta: {
          title: 'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 | วัสดุก่อสร้างใกล้ฉัน ราคาถูก ส่งด่วน',
          description:
            'ร้านวัสดุก่อสร้าง ร้านวัสดุก่อสร้างใกล้ฉัน ตลิ่งชัน ครบวงจร อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ส่งเร็ว งานด่วน รับประกันคุณภาพ โทร 02-434-8319',
        },
      },
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
