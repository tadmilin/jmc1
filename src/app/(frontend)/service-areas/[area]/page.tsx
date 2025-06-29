import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateMeta } from '@/utilities/generateMeta'
import { generateContactPageSchema } from '@/utils/contact-about-schema'

const serviceAreas = {
  pinklao: {
    name: 'ปิ่นเกล้า',
    searchName: 'ปิ่นเกล้า',
    fullName: 'เขตปิ่นเกล้า',
    distance: '8 กม.',
    deliveryTime: '30-45 นาที',
    landmarks: ['หน้าโรงพยาบาลศิริราช', 'ปิ่นเกล้า-นครชัยศรี', 'บางบำรุง'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้ปิ่นเกล้า ส่งฟรีทุกออเดอร์ มีอิฐ หิน ปูน ทราย ท่อ PVC คุณภาพดี ราคาถูก',
  },
  jaran: {
    name: 'จรัญ',
    searchName: 'จรัญสนิทวงศ์',
    fullName: 'ถนนจรัญสนิทวงศ์',
    distance: '7 กม.',
    deliveryTime: '25-40 นาที',
    landmarks: ['ตลาดพลู', 'วัดระฆัง', 'สะพานพุทธ'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้จรัญ ส่งฟรีทุกออเดอร์ อิฐแดง อิฐมอญ ปูนซีเมนต์ ทรายก่อสร้าง คุณภาพเยี่ยม',
  },
  bangkunnon: {
    name: 'บางขุนนนท์',
    searchName: 'บางขุนนนท์',
    fullName: 'เขตบางขุนนนท์',
    distance: '12 กม.',
    deliveryTime: '35-50 นาที',
    landmarks: ['ตลาดบางขุนนนท์', 'วัดอุทัยนาวี', 'โรงพยาบาลศิรินธร'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้บางขุนนนท์ ส่งฟรีทุกออเดอร์ วัสดุครบครัน ราคาโรงงาน บริการรวดเร็ว',
  },
  borom: {
    name: 'บรม',
    searchName: 'บรมราชชนนี',
    fullName: 'ถนนบรมราชชนนี',
    distance: '9 กม.',
    deliveryTime: '30-45 นาที',
    landmarks: ['มหาวิทยาลัยเกษตรศาสตร์', 'เซ็นทรัลปิ่นเกล้า', 'วัดพิกุลทอง'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้บรม ส่งฟรีทุกออเดอร์ วัสดุก่อสร้างคุณภาพ ราคาถูกที่สุด บริการเยี่ยม',
  },
  suanphak: {
    name: 'สวนผัก',
    searchName: 'สวนผัก',
    fullName: 'ถนนสวนผัก',
    distance: '6 กม.',
    deliveryTime: '20-35 นาที',
    landmarks: ['ตลาดสวนผัก', 'วัดบางกร่าง', 'สถานีรถไฟสวนผัก'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้สวนผัก ส่งฟรีทุกออเดอร์ อิฐ หิน ปูน ทราย ราคาส่ง บริการส่งถึงไซต์งาน',
  },
  rama5: {
    name: 'พระราม5',
    searchName: 'พระราม 5',
    fullName: 'ถนนพระราม 5',
    distance: '10 กม.',
    deliveryTime: '30-50 นาที',
    landmarks: ['เซ็นทรัลพระราม 5', 'โรงพยาบาลราชวิถี', 'วัดเบญจมบพิตร'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้พระราม5 ส่งฟรีทุกออเดอร์ วัสดุคุณภาพ ราคาถูก ส่งเร็ว บริการดี',
  },
  bangkruai: {
    name: 'บางกรวย',
    searchName: 'บางกรวย',
    fullName: 'อำเภอบางกรวย',
    distance: '15 กม.',
    deliveryTime: '40-60 นาที',
    landmarks: ['ตลาดบางกรวย', 'เซ็นทรัลเวสต์เกต', 'วัดบางกรวย'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้บางกรวย ส่งฟรีทุกออเดอร์ วัสดุครบครัน ราคาดี บริการส่งถึงที่ รวดเร็ว',
  },
}

interface ServiceAreaPageProps {
  params: {
    area: string
  }
}

export async function generateMetadata({ params }: ServiceAreaPageProps): Promise<Metadata> {
  const areaData = serviceAreas[params.area as keyof typeof serviceAreas]

  if (!areaData) {
    return generateMeta({
      doc: {
        title: 'ไม่พบหน้าที่ค้นหา - จงมีชัยค้าวัสดุ',
        meta: {
          title: 'ไม่พบหน้าที่ค้นหา - จงมีชัยค้าวัสดุ',
          description: 'ไม่พบหน้าที่ค้นหา กรุณาตรวจสอบ URL อีกครั้ง',
        },
      },
      pageType: 'page',
    })
  }

  const title = `วัสดุก่อสร้าง ${areaData.name} | ส่งฟรี ${areaData.distance} | จงมีชัยค้าวัสดุ ตลิ่งชัน`
  const description = `🏆 ${areaData.description} ส่งฟรี ${areaData.distance} ภายใน ${areaData.deliveryTime} โทร 02-434-8319`

  return generateMeta({
    doc: {
      title,
      slug: `service-areas/${params.area}`,
      meta: {
        title,
        description,
      },
    },
    pageType: 'page',
  })
}

export default async function ServiceArea({ params }: ServiceAreaPageProps) {
  const areaData = serviceAreas[params.area as keyof typeof serviceAreas]

  if (!areaData) {
    notFound()
  }

  const schemaMarkup = generateContactPageSchema()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaMarkup),
        }}
      />
      {/* Simple Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              🏆 วัสดุก่อสร้าง {areaData.name} อันดับ 1
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              ร้านวัสดุก่อสร้างใกล้{areaData.name} ส่งฟรี {areaData.distance} ภายใน{' '}
              {areaData.deliveryTime}
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-8 text-left max-w-2xl mx-auto">
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="mr-2">✅</span> อิฐแดง อิฐมอญ คุณภาพเยี่ยม
                </p>
                <p className="flex items-center">
                  <span className="mr-2">✅</span> ปูนซีเมนต์ ปูนก่อ ปูนฉาบ
                </p>
                <p className="flex items-center">
                  <span className="mr-2">✅</span> ทรายก่อสร้าง ทรายหยาบ ทรายละเอียด
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center">
                  <span className="mr-2">✅</span> หินคลุก หิน 1 หิน 2 หิน 3
                </p>
                <p className="flex items-center">
                  <span className="mr-2">✅</span> ท่อ PVC ข้อต่อ อุปกรณ์ประปา
                </p>
                <p className="flex items-center">
                  <span className="mr-2">✅</span> ส่งฟรี ราคาโรงงาน
                </p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-xl p-6 inline-block">
              <p className="text-3xl font-bold mb-2">📞 สั่งเลย: 02-434-8319</p>
              <p className="text-lg opacity-90">ปรึกษาฟรี คำนวณปริมาณให้</p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Service Area Info */}
          <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">
              🎯 บริการพื้นที่ {areaData.fullName}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">📍 ข้อมูลการส่ง</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    📏 <strong>ระยะทาง:</strong> {areaData.distance} จากร้าน
                  </li>
                  <li>
                    ⏰ <strong>เวลาส่ง:</strong> {areaData.deliveryTime}
                  </li>
                  <li>
                    🚚 <strong>ค่าส่ง:</strong> ฟรี! (ออเดอร์ขั้นต่ำ 1,000 บาท)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">🗺️ จุดสังเกตใกล้เคียง</h3>
                <ul className="space-y-2 text-gray-700">
                  {areaData.landmarks.map((landmark, index) => (
                    <li key={index}>📌 {landmark}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Products Section */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">
              🏗️ วัสดุก่อสร้าง ส่ง{areaData.name}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: 'อิฐแดง อิฐมอญ',
                  desc: 'คุณภาพเยี่ยม ราคาโรงงาน',
                  price: 'เริ่มต้น 2.50 บาท/ก้อน',
                },
                {
                  name: 'ปูนซีเมนต์',
                  desc: 'ตราช้าง ตราเสือ คุณภาพดี',
                  price: 'เริ่มต้น 185 บาท/ถุง',
                },
                {
                  name: 'ทรายก่อสร้าง',
                  desc: 'ทรายหยาบ ทรายละเอียด สะอาด',
                  price: 'เริ่มต้น 180 บาท/คิว',
                },
                {
                  name: 'หินคลุก หิน 1-2-3',
                  desc: 'หินแกรนิต คุณภาพเกรด A',
                  price: 'เริ่มต้น 280 บาท/คิว',
                },
                { name: 'ท่อ PVC อุปกรณ์', desc: 'บราเดีย ไทยยา ครบครัน', price: 'ราคาโรงงาน' },
                {
                  name: 'เหล็กก่อสร้าง',
                  desc: 'เหล็กเส้น แผ่นเหล็ก เหล็กฉาก',
                  price: 'ราคาโรงงาน',
                },
              ].map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.desc}</p>
                  <p className="text-blue-600 font-semibold">{product.price}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-6">
              ⭐ ทำไมต้องเลือกเรา สำหรับ{areaData.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🚚',
                  title: 'ส่งฟรี ส่งเร็ว',
                  desc: `ส่งฟรีทุกออเดอร์ถึง${areaData.name} ภายใน ${areaData.deliveryTime}`,
                },
                {
                  icon: '💰',
                  title: 'ราคาถูกที่สุด',
                  desc: 'ราคาโรงงาน ไม่ผ่านตัวกลาง ประหยัดได้มาก',
                },
                { icon: '✅', title: 'คุณภาพดี', desc: 'วัสดุคุณภาพเยี่ยม ผ่านมาตรฐาน มอก.' },
                { icon: '📞', title: 'บริการดี', desc: 'ปรึกษาฟรี แนะนำ คำนวณปริมาณให้' },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              📞 สั่งวัสดุก่อสร้าง ส่ง{areaData.name} เลย!
            </h2>
            <p className="text-xl mb-6 opacity-90">
              ปรึกษาฟรี คำนวณปริมาณให้ ส่งฟรี {areaData.distance} ภายใน {areaData.deliveryTime}
            </p>
            <div className="space-y-2">
              <p className="text-2xl font-bold">📞 02-434-8319</p>
              <p className="text-lg">📱 Line: @jmcmaterials</p>
              <p className="text-sm opacity-80">⏰ เปิดทุกวัน 07:00-18:00 น.</p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  return Object.keys(serviceAreas).map((area) => ({
    area,
  }))
}
