import React from 'react'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { homeStatic } from '@/endpoints/seed/home-static'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import PageClient from '../[slug]/page.client'
import StructuredData from '@/components/SEO/StructuredData'
import { getServerSideURL } from '@/utilities/getURL'

// หน้า Local SEO: ร้านวัสดุก่อสร้าง ใกล้ฉัน (English URL) — แสดง content จากหน้า home
export default async function ConstructionMaterialsNearMePage() {
  const baseUrl = getServerSideURL()
  const pageUrl = `${baseUrl}/construction-materials-near-me`

  const localSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ร้านวัสดุก่อสร้าง ใกล้ฉัน - จงมีชัยค้าวัสดุ ตลิ่งชัน',
    description:
      'ร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน ปากซอยชักพระ6 ราคาถูก ส่งฟรี อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ครบวงจร ให้บริการพื้นที่ ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย โทร 02-434-8319',
    url: pageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '38,40 ปากซอยชักพระ6 ถนนชักพระ แขวงตลิ่งชัน',
      addressLocality: 'ตลิ่งชัน',
      addressRegion: 'กรุงเทพมหานคร',
      postalCode: '10170',
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.780839074740534,
      longitude: 100.4622982337261,
    },
    telephone: '02-434-8319',
    openingHours: 'Mo-Sa 07:00-17:00, Su 08:00-16:00',
    priceRange: '฿฿',
    areaServed: [
      'ตลิ่งชัน',
      'ปิ่นเกล้า',
      'จรัญสนิทวงศ์',
      'บางขุนนนท์',
      'บรมราชชนนี',
      'สวนผัก',
      'พระราม5',
      'บางกรวย',
      'บางพลัด',
      'หนองแขม',
      'บางแค',
    ],
    serviceType: [
      'ร้านวัสดุก่อสร้าง ตลิ่งชัน',
      'วัสดุก่อสร้าง ใกล้ฉัน',
      'อิฐ หิน ปูน ทราย ตลิ่งชัน',
      'เหล็ก ประปา ไฟฟ้า ตลิ่งชัน',
      'ส่งฟรี วัสดุก่อสร้าง',
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ร้านวัสดุก่อสร้างใกล้ฉันที่ไหน ตลิ่งชัน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'จงมีชัยค้าวัสดุ ตั้งอยู่ที่ 38,40 ปากซอยชักพระ6 ถนนชักพระ ตลิ่งชัน กรุงเทพฯ 10170 เปิด จ-ส 07:00-17:00 น. อา 08:00-16:00 น. โทร 02-434-8319 บริการส่งฟรีครอบคลุม ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย',
        },
      },
      {
        '@type': 'Question',
        name: 'ร้านวัสดุก่อสร้างแถวตลิ่งชันส่งฟรีไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ใช่ จงมีชัยค้าวัสดุ บริการส่งฟรีถึงไซต์งานในพื้นที่แถวตลิ่งชัน ปิ่นเกล้า จรัญสนิทวงศ์ บางขุนนนท์ บรมราชชนนี สวนผัก พระราม5 บางกรวย และพื้นที่ใกล้เคียง สั่งซื้อโทร 02-434-8319',
        },
      },
      {
        '@type': 'Question',
        name: 'วัสดุก่อสร้างแถวตลิ่งชันมีอะไรบ้าง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'จงมีชัยค้าวัสดุ จำหน่ายครบทุกชนิด ได้แก่ อิฐแดง อิฐมอญ อิฐบล็อก อิฐมวลเบา ปูนซีเมนต์ทุกยี่ห้อ ทรายหยาบ ทรายละเอียด หิน 3/4 หินคลุก เหล็กเส้น เหล็กฉาก ท่อ PVC อุปกรณ์ประปา สายไฟ อุปกรณ์ไฟฟ้า สีทาบ้าน กระเบื้อง ประตูหน้าต่าง และอื่น ๆ อีกมาก',
        },
      },
      {
        '@type': 'Question',
        name: 'ร้านวัสดุก่อสร้างใกล้ฉัน เปิดกี่โมง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'จงมีชัยค้าวัสดุ เปิดทำการ จันทร์-เสาร์ 07:00-17:00 น. และวันอาทิตย์ 08:00-16:00 น. ที่ตั้งร้าน ปากซอยชักพระ6 ตลิ่งชัน กรุงเทพฯ โทรสั่งได้เลย 02-434-8319',
        },
      },
      {
        '@type': 'Question',
        name: 'วัสดุก่อสร้างตลิ่งชัน ราคาถูกไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'จงมีชัยค้าวัสดุ จำหน่ายในราคาโรงงาน ไม่ผ่านตัวกลาง ทำให้ราคาถูกกว่าห้างทั่วไป มีส่วนลดพิเศษสำหรับการสั่งครั้งละมาก และบริการปรึกษาคำนวณปริมาณวัสดุฟรี โทร 02-434-8319',
        },
      },
    ],
  }

  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: 'home' } },
  })

  const page = result.docs?.[0] ?? homeStatic
  const { hero, layout } = page as typeof homeStatic

  return (
    <>
      <StructuredData data={localSchema} />
      <StructuredData data={faqSchema} />
      <article className="pb-24">
        <PageClient />
        <RenderHero {...hero} />
        <RenderBlocks blocks={layout as unknown as Array<{ blockType: string } & Record<string, unknown>>} />
      </article>
    </>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getServerSideURL()
  const pageUrl = `${baseUrl}/construction-materials-near-me`

  return {
    title: 'ร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน ปากซอยชักพระ6 ราคาถูก ส่งฟรี | จงมีชัยค้าวัสดุ',
    description:
      'ร้านวัสดุก่อสร้าง ใกล้ฉันที่สุด ตลิ่งชัน ปากซอยชักพระ6 ราคาถูก ส่งฟรี ครบวงจร อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่างมืออาชีพ บริการพื้นที่ ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย โทร 02-434-8319',
    keywords:
      'ร้านวัสดุก่อสร้าง ใกล้ฉัน, วัสดุก่อสร้าง ตลิ่งชัน, ร้านวัสดุก่อสร้าง ปากซอยชักพระ6, วัสดุก่อสร้าง ใกล้ฉัน ราคาถูก, ร้านวัสดุก่อสร้าง ส่งฟรี, อิฐ หิน ปูน ทราย ใกล้ฉัน, เหล็ก ประปา ไฟฟ้า ตลิ่งชัน, construction materials near me, hardware store near me',
    openGraph: {
      title: 'ร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน | จงมีชัยค้าวัสดุ',
      description: 'ร้านวัสดุก่อสร้าง ใกล้ฉันที่สุด ตลิ่งชัน ราคาถูก ส่งฟรี ครบวงจร โทร 02-434-8319',
      locale: 'th_TH',
      type: 'website',
      url: pageUrl,
    },
    alternates: {
      canonical: pageUrl,
    },
  }
}
