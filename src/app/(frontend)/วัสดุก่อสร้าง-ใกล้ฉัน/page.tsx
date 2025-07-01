import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateMeta } from '@/utilities/generateMeta'
import { generateContactPageSchema } from '@/utils/contact-about-schema'
import StructuredData from '@/components/SEO/StructuredData'

// หน้าเฉพาะสำหรับ Local SEO: วัสดุก่อสร้าง ใกล้ฉัน
export default function LocalSEOPage() {
  const localSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ร้านวัสดุก่อสร้าง ใกล้ฉัน - จงมีชัยค้าวัสดุ ตลิ่งชัน',
    description:
      'ร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน ปากซอยชักพระ6 ราคาถูก ส่งฟรี อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ครบวงจร ให้บริการพื้นที่ ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย โทร 02-434-8319',
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
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <StructuredData data={localSchema} />

      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ร้านวัสดุก่อสร้าง <span className="text-blue-600">ใกล้ฉัน</span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-700 mb-6">
            จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            ร้านวัสดุก่อสร้าง ใกล้ฉันที่สุด ตลิ่งชัน ราคาถูก ส่งฟรี ครบวงจร อิฐ หิน ปูน ทราย เหล็ก
            ประปา ไฟฟ้า
          </p>
          <div className="text-3xl font-bold text-blue-600 mb-4">📞 02-434-8319</div>
        </section>

        {/* Service Areas */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            พื้นที่บริการ วัสดุก่อสร้าง ใกล้ฉัน
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
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
              'ทวีวัฒนา',
            ].map((area) => (
              <div key={area} className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-gray-900">วัสดุก่อสร้าง {area}</h4>
                <p className="text-sm text-gray-600">ส่งฟรี ใกล้ฉัน</p>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            วัสดุก่อสร้าง ใกล้ฉัน ครบทุกชนิด
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { name: 'อิฐ หิน ปูน ทราย', desc: 'คุณภาพดี ราคาถูก' },
              { name: 'เหล็ก ประปา ไฟฟ้า', desc: 'ของแท้ รับประกัน' },
              { name: 'ท่อ PVC อุปกรณ์', desc: 'ครบชุด ทุกขนาด' },
              { name: 'สีทาบ้าน', desc: 'คำนวณสีฟรี' },
              { name: 'ปั๊มน้ำ', desc: 'ติดตั้งให้ฟรี' },
              { name: 'ช่างรับเหมา', desc: 'มืออาชีพ' },
            ].map((product) => (
              <div
                key={product.name}
                className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm"
              >
                <h4 className="font-bold text-lg text-gray-900 mb-2">{product.name}</h4>
                <p className="text-gray-600">{product.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-blue-600 text-white p-8 rounded-lg text-center">
          <h3 className="text-3xl font-bold mb-4">ร้านวัสดุก่อสร้าง ใกล้ฉันที่สุด</h3>
          <p className="text-xl mb-6">📍 38,40 ปากซอยชักพระ6 ตลิ่งชัน กรุงเทพฯ 10170</p>
          <div className="space-y-4">
            <a
              href="tel:024348319"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100"
            >
              📞 โทรเลย 02-434-8319
            </a>
            <div className="text-lg">🕐 เปิด จ-ส 07:00-17:00 น. | อา 08:00-16:00 น.</div>
          </div>
        </section>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'ร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน ปากซอยชักพระ6 ราคาถูก ส่งฟรี | จงมีชัยค้าวัสดุ',
  description:
    'ร้านวัสดุก่อสร้าง ใกล้ฉันที่สุด ตลิ่งชัน ปากซอยชักพระ6 ราคาถูก ส่งฟรี ครบวงจร อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่างมืออาชีพ บริการพื้นที่ ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย โทร 02-434-8319',
  keywords:
    'ร้านวัสดุก่อสร้าง ใกล้ฉัน, วัสดุก่อสร้าง ตลิ่งชัน, ร้านวัสดุก่อสร้าง ปากซอยชักพระ6, วัสดุก่อสร้าง ใกล้ฉัน ราคาถูก, ร้านวัสดุก่อสร้าง ส่งฟรี, อิฐ หิน ปูน ทราย ใกล้ฉัน, เหล็ก ประปา ไฟฟ้า ตลิ่งชัน, ร้านวัสดุก่อสร้าง เปิด 24 ชั่วโมง',
  openGraph: {
    title: 'ร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน | จงมีชัยค้าวัสดุ',
    description: 'ร้านวัสดุก่อสร้าง ใกล้ฉันที่สุด ตลิ่งชัน ราคาถูก ส่งฟรี ครบวงจร โทร 02-434-8319',
    locale: 'th_TH',
    type: 'website',
  },
}
