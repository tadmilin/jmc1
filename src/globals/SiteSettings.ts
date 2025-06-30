import type { GlobalConfig } from 'payload'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'การตั้งค่าเว็บไซต์',
  access: {
    read: () => true,
  },
  admin: {
    description: 'จัดการข้อมูล SEO และการตั้งค่าทั่วไปของเว็บไซต์',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO หน้าแรก',
          description: 'การตั้งค่า SEO สำหรับหน้าแรกของเว็บไซต์',
          fields: [
            {
              name: 'siteName',
              label: 'ชื่อเว็บไซต์',
              type: 'text',
              required: true,
              defaultValue: 'จงมีชัยค้าวัสดุ',
              admin: {
                description: 'ชื่อที่จะแสดงใน browser tab และเป็นชื่อเว็บไซต์หลัก',
              },
            },
            {
              name: 'siteTagline',
              label: 'คำโปรย (Tagline)',
              type: 'text',
              defaultValue: 'ร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน ปากซอยชักพระ6',
              admin: {
                description: 'คำโปรยที่จะแสดงต่อจากชื่อเว็บไซต์',
              },
            },
            {
              name: 'siteDescription',
              label: 'คำอธิบายเว็บไซต์',
              type: 'textarea',
              maxLength: 160,
              defaultValue:
                'จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 ร้านวัสดุก่อสร้างครบวงจร ราคาถูก ส่งด่วนถึงไซต์งาน อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ครบจบที่เดียว',
              admin: {
                description:
                  'คำอธิบายที่จะแสดงใน Google Search และเมื่อแชร์ลิงก์ (แนะนำ 150-160 ตัวอักษร)',
              },
            },
            {
              name: 'siteKeywords',
              label: 'คำสำคัญ (Keywords)',
              type: 'text',
              defaultValue:
                'วัสดุก่อสร้าง, ตลิ่งชัน, ใกล้ฉัน, ปากซอยชักพระ6, จงมีชัยค้าวัสดุ, อิฐ หิน ปูน ทราย, เหล็ก, ประปา, ไฟฟ้า',
              admin: {
                description: 'คำสำคัญสำหรับการค้นหา (คั่นด้วยเครื่องหมายจุลภาค)',
              },
            },
            {
              name: 'ogImage',
              label: 'รูปภาพ Open Graph',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'รูปภาพที่จะแสดงเมื่อแชร์ลิงก์ใน Facebook, LINE, Twitter (แนะนำ 1200x630px)',
              },
            },
          ],
        },
        {
          label: 'ข้อมูลติดต่อ',
          description: 'ข้อมูลติดต่อที่จะแสดงในเว็บไซต์',
          fields: [
            {
              name: 'companyName',
              label: 'ชื่อบริษัทเต็ม',
              type: 'text',
              defaultValue: 'จงมีชัยค้าวัสดุ',
            },
            {
              name: 'address',
              label: 'ที่อยู่',
              type: 'textarea',
              admin: {
                description: 'ที่อยู่ของบริษัท',
              },
            },
            {
              name: 'phone',
              label: 'เบอร์โทรศัพท์',
              type: 'text',
              admin: {
                description: 'เบอร์โทรศัพท์หลัก',
              },
            },
            {
              name: 'email',
              label: 'อีเมล',
              type: 'email',
              admin: {
                description: 'อีเมลติดต่อหลัก',
              },
            },
            {
              name: 'businessHours',
              label: 'เวลาทำการ',
              type: 'text',
              defaultValue: 'จันทร์-เสาร์ 07:00-17:00 น., อาทิตย์ 08:00-16:00 น.',
            },
          ],
        },
        {
          label: 'Social Media',
          description: 'ลิงก์ Social Media และการตั้งค่า',
          fields: [
            {
              name: 'facebook',
              label: 'Facebook URL',
              type: 'text',
              admin: {
                description: 'ลิงก์ Facebook Page',
              },
            },
            {
              name: 'line',
              label: 'LINE ID',
              type: 'text',
              admin: {
                description: 'LINE ID หรือ LINE URL',
              },
            },
            {
              name: 'twitterHandle',
              label: 'Twitter Handle',
              type: 'text',
              defaultValue: '@jmcmaterials',
              admin: {
                description: 'Twitter username (รวม @)',
              },
            },
          ],
        },
        {
          label: 'การตั้งค่าเพิ่มเติม',
          description: 'การตั้งค่าอื่นๆ ของเว็บไซต์',
          fields: [
            {
              name: 'faviconUrl',
              label: 'Favicon URL',
              type: 'text',
              admin: {
                description: 'URL ของ favicon (ไอคอนที่แสดงใน browser tab)',
              },
            },
            {
              name: 'googleAnalyticsId',
              label: 'Google Analytics ID',
              type: 'text',
              admin: {
                description: 'Google Analytics Tracking ID (GA4)',
              },
            },
            {
              name: 'enableSiteMap',
              label: 'เปิดใช้งาน Sitemap',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
}
