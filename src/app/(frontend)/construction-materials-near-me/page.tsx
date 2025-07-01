import React from 'react'
import type { Metadata } from 'next'
import StructuredData from '@/components/SEO/StructuredData'

// หน้า Local SEO: ร้านวัสดุก่อสร้าง ใกล้ฉัน (English URL)
export default function ConstructionMaterialsNearMePage() {
  const localSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'ร้านวัสดุก่อสร้าง ใกล้ฉัน - จงมีชัยค้าวัสดุ ตลิ่งชัน',
    description:
      'ร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน ปากซอยชักพระ6 ราคาถูก ส่งฟรี อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ครบวงจร ให้บริการพื้นที่ ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย โทร 02-434-8319',
    url: 'https://jmc111.vercel.app/construction-materials-near-me',
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

  return (
    <>
      <StructuredData data={localSchema} />

      <div className="container mx-auto px-4 py-8">
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

          {/* Local Keywords Section */}
          <section className="mb-12 bg-gray-50 p-8 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🔍 ค้นหา: วัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg mb-3">📍 คำค้นหายอดนิยม:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• ร้านวัสดุก่อสร้าง ใกล้ฉัน</li>
                  <li>• วัสดุก่อสร้าง ตลิ่งชัน</li>
                  <li>• ร้านวัสดุก่อสร้าง ปากซอยชักพระ6</li>
                  <li>• วัสดุก่อสร้าง ราคาถูก ใกล้ฉัน</li>
                  <li>• อิฐ หิน ปูน ทราย ตลิ่งชัน</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-3">🚚 พื้นที่ส่งฟรี:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• วัสดุก่อสร้าง ปิ่นเกล้า</li>
                  <li>• วัสดุก่อสร้าง จรัญสนิทวงศ์</li>
                  <li>• วัสดุก่อสร้าง บางขุนนนท์</li>
                  <li>• วัสดุก่อสร้าง บรมราชชนนี</li>
                  <li>• วัสดุก่อสร้าง สวนผัก</li>
                </ul>
              </div>
            </div>
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
                <div
                  key={area}
                  className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors"
                >
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
                { name: 'อิฐ หิน ปูน ทราย', desc: 'คุณภาพดี ราคาถูก', icon: '🧱' },
                { name: 'เหล็ก ประปา ไฟฟ้า', desc: 'ของแท้ รับประกัน', icon: '⚡' },
                { name: 'ท่อ PVC อุปกรณ์', desc: 'ครบชุด ทุกขนาด', icon: '🔧' },
                { name: 'สีทาบ้าน', desc: 'คำนวณสีฟรี', icon: '🎨' },
                { name: 'ปั๊มน้ำ', desc: 'ติดตั้งให้ฟรี', icon: '💧' },
                { name: 'ช่างรับเหมา', desc: 'มืออาชีพ', icon: '👷' },
              ].map((product) => (
                <div
                  key={product.name}
                  className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3 text-center">{product.icon}</div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2 text-center">
                    {product.name}
                  </h4>
                  <p className="text-gray-600 text-center">{product.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SEO Content */}
          <section className="mb-12 prose max-w-none">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ทำไมต้องเลือกร้านวัสดุก่อสร้าง ใกล้ฉัน จงมีชัยค้าวัสดุ?
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">✅ ข้อดีของเรา:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>📍 ใกล้ฉันที่สุด ตลิ่งชัน ปากซอยชักพระ6</li>
                  <li>💰 ราคาถูก คุณภาพดี รับประกัน</li>
                  <li>🚚 ส่งฟรี ครอบคลุมทุกพื้นที่</li>
                  <li>⏰ เปิดทุกวัน 07:00-17:00 น.</li>
                  <li>📞 โทรสั่งได้ 24 ชั่วโมง</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🎯 บริการพิเศษ:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>🎨 คำนวณสี ผสมสี ฟรี</li>
                  <li>🔧 ช่างติดตั้ง มืออาชีพ</li>
                  <li>📱 รับสั่งผ่าน LINE, Facebook</li>
                  <li>💳 รับชำระเงินหลายช่องทาง</li>
                  <li>📋 ให้คำปรึกษาฟรี</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-lg text-center">
            <h3 className="text-3xl font-bold mb-4">ร้านวัสดุก่อสร้าง ใกล้ฉันที่สุด</h3>
            <p className="text-xl mb-6">📍 38,40 ปากซอยชักพระ6 ตลิ่งชัน กรุงเทพฯ 10170</p>
            <div className="space-y-4">
              <a
                href="tel:024348319"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                📞 โทรเลย 02-434-8319
              </a>
              <div className="text-lg">🕐 เปิดทุกวัน จ-ส 07:00-17:00 น. | อา 08:00-16:00 น.</div>
              <div className="text-sm opacity-90 mt-4">
                ⭐ ร้านวัสดุก่อสร้าง ใกล้ฉัน ตลิ่งชัน ที่ลูกค้าไว้วางใจมากว่า 30 ปี
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export const metadata: Metadata = {
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
    url: 'https://jmc111.vercel.app/construction-materials-near-me',
  },
  alternates: {
    canonical: 'https://jmc111.vercel.app/construction-materials-near-me',
  },
}
