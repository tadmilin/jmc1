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
    landmarks: ['โรงพยาบาลศิริราช', 'ห้างสรรพสินค้าเซ็นทรัลปิ่นเกล้า', 'สะพานสมเด็จพระปิ่นเกล้า'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้ปิ่นเกล้า บริการย่านฝั่งธนบุรีทางทิศตะวันตกของกรุงเทพฯ ส่งฟรีทุกออเดอร์ มีอิฐ หิน ปูน ทราย ท่อ PVC คุณภาพดี ราคาถูก',
    uniqueContent: 'พื้นที่ปิ่นเกล้าเป็นย่านที่อยู่อาศัยหนาแน่น มีโครงการก่อสร้างต่อเนื่อง ร้านเราอยู่ห่างเพียง 8 กม. ผ่านถนนจรัญสนิทวงศ์ สามารถส่งได้ทั้งโครงการขนาดใหญ่และงานซ่อมแซมบ้าน',
  },
  jaran: {
    name: 'จรัญสนิทวงศ์',
    searchName: 'จรัญ',
    fullName: 'ถนนจรัญสนิทวงศ์',
    distance: '7 กม.',
    deliveryTime: '25-40 นาที',
    landmarks: ['MRT สถานีจรัญ 13', 'ตลาดพลู', 'ท่าเรือวัดระฆัง'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้จรัญสนิทวงศ์ ส่งฟรีทุกออเดอร์ อิฐแดง อิฐมอญ ปูนซีเมนต์ ทรายก่อสร้าง คุณภาพเยี่ยม',
    uniqueContent: 'แนวถนนจรัญสนิทวงศ์มีคอนโดมิเนียมและอาคารพาณิชย์ขึ้นใหม่จำนวนมาก ร้านเราส่งวัสดุได้รวดเร็วผ่านเส้นทางสายนี้ โดยไม่ติดสัญญาณไฟในชั่วโมงเร่งด่วน',
  },
  bangkunnon: {
    name: 'บางขุนนนท์',
    searchName: 'บางขุนนนท์',
    fullName: 'เขตบางขุนนนท์',
    distance: '5 กม.',
    deliveryTime: '20-35 นาที',
    landmarks: ['MRT สถานีบางขุนนนท์', 'ตลาดบางขุนนนท์', 'วัดดุสิตาราม'],
    description: 'ร้านวัสดุก่อสร้าง ใกล้บางขุนนนท์ ส่งฟรีทุกออเดอร์ วัสดุครบครัน ราคาถูก คุณภาพดี',
    uniqueContent: 'บางขุนนนท์เป็นหนึ่งในพื้นที่ที่ใกล้ร้านที่สุด ส่งได้ภายใน 20 นาที เหมาะสำหรับงานด่วนที่ขาดวัสดุกลางคัน รับออเดอร์ถึง 17:00 น. ส่งทันวันเดียวกัน',
  },
  borom: {
    name: 'บรมราชชนนี',
    searchName: 'บรมราชชนนี',
    fullName: 'ถนนบรมราชชนนี',
    distance: '6 กม.',
    deliveryTime: '25-40 นาที',
    landmarks: ['โรงพยาบาลศิริราช ปิยมหาราชการุณย์', 'ห้างบิ๊กซี บรมราชชนนี', 'สวนสาธารณะตากสิน'],
    description: 'ร้านวัสดุก่อสร้าง ใกล้บรมราชชนนี ส่งฟรีทุกออเดอร์ อิฐ หิน ปูน ทราย เหล็ก ครบครัน',
    uniqueContent: 'แนวถนนบรมราชชนนีมีบ้านจัดสรรและหมู่บ้านหนาแน่น ร้านเราส่งวัสดุครอบคลุมทั้งสองฝั่งถนน มีรถบรรทุก 4 ล้อและ 6 ล้อพร้อมส่งสำหรับออเดอร์ขนาดใหญ่',
  },
  suanphak: {
    name: 'สวนผัก',
    searchName: 'สวนผัก',
    fullName: 'ถนนสวนผัก',
    distance: '4 กม.',
    deliveryTime: '15-30 นาที',
    landmarks: ['วัดสวนผัก', 'โรงเรียนวัดสวนผัก', 'ชุมชนสวนผัก'],
    description: 'ร้านวัสดุก่อสร้าง ใกล้สวนผัก ส่งฟรีทุกออเดอร์ ใกล้ที่สุด ส่งเร็ว คุณภาพดี',
    uniqueContent: 'สวนผักอยู่ห่างจากร้านเพียง 4 กม. เป็นระยะทางที่สั้นที่สุดในบรรดาพื้นที่ให้บริการ ทำให้ส่งได้เร็วที่สุดภายใน 15 นาที เหมาะมากสำหรับงานก่อสร้างที่ต้องการวัสดุด่วน',
  },
  rama5: {
    name: 'พระราม 5',
    searchName: 'พระราม 5',
    fullName: 'ถนนพระราม 5',
    distance: '9 กม.',
    deliveryTime: '35-50 นาที',
    landmarks: ['สวนจตุจักร', 'โรงพยาบาลราชวิถี', 'ห้างแพลตินั่ม'],
    description: 'ร้านวัสดุก่อสร้าง ใกล้พระราม 5 ส่งฟรีทุกออเดอร์ วัสดุครบครัน ราคาถูก',
    uniqueContent: 'ย่านพระราม 5 มีหมู่บ้านจัดสรรและโครงการที่อยู่อาศัยขนาดใหญ่ ร้านเราให้บริการทั้งการซื้อปลีกและส่งเป็นโครงการ มีส่วนลดพิเศษสำหรับออเดอร์จำนวนมาก',
  },
  bangkruai: {
    name: 'บางกรวย',
    searchName: 'บางกรวย',
    fullName: 'อำเภอบางกรวย นนทบุรี',
    distance: '12 กม.',
    deliveryTime: '45-60 นาที',
    landmarks: ['ตลาดน้ำบางกรวย', 'วัดชมภูเวก', 'ห้างแมคโครบางกรวย'],
    description: 'ร้านวัสดุก่อสร้าง ใกล้บางกรวย นนทบุรี ส่งฟรีทุกออเดอร์ ครอบคลุมพื้นที่กว้าง คุณภาพดี',
    uniqueContent: 'บางกรวยเป็นพื้นที่ในนนทบุรีที่ร้านเราขยายบริการครอบคลุม มีทั้งชุมชนเก่าแก่และโครงการบ้านจัดสรรใหม่ รับออเดอร์ออนไลน์ได้ตลอด 24 ชม. ส่งทุกวันไม่เว้นวันหยุด',
  },
  talingchan: {
    name: 'ตลิ่งชัน',
    searchName: 'ตลิ่งชัน',
    fullName: 'เขตตลิ่งชัน',
    distance: '3 กม.',
    deliveryTime: '10-25 นาที',
    landmarks: ['ตลาดน้ำตลิ่งชัน', 'สถานีรถไฟตลิ่งชัน', 'ซอยชักพระ'],
    description:
      'ร้านวัสดุก่อสร้าง ใกล้ตลิ่งชัน ส่งฟรีทุกออเดอร์ ใกล้ที่สุด ส่งเร็วที่สุด คุณภาพดี',
    uniqueContent: 'ร้านจงมีชัยตั้งอยู่ที่ปากซอยชักพระ 6 ในเขตตลิ่งชัน ดังนั้นพื้นที่ตลิ่งชันคือพื้นที่บ้านของเรา ส่งได้เร็วที่สุดภายใน 10 นาที รู้จักทุกซอยในพื้นที่ดี',
  },
  bangphlat: {
    name: 'บางพลัด',
    searchName: 'บางพลัด',
    fullName: 'เขตบางพลัด',
    distance: '6 กม.',
    deliveryTime: '25-40 นาที',
    landmarks: ['MRT สถานีบางพลัด', 'ห้างบิ๊กซี บางพลัด', 'วัดบางพลัดนอก'],
    description: 'ร้านวัสดุก่อสร้าง ใกล้บางพลัด ส่งฟรีทุกออเดอร์ วัสดุครบครัน ราคาถูก',
    uniqueContent: 'บางพลัดเชื่อมต่อกับตลิ่งชันโดยตรงผ่านถนนบรมราชชนนี ร้านเราส่งครอบคลุมทั้งเขต มีรถส่งออกทุกเช้า 8:00-17:00 น. สำหรับออเดอร์ที่สั่งก่อน 16:00 น.',
  },
  thonburi: {
    name: 'ธนบุรี',
    searchName: 'ธนบุรี',
    fullName: 'เขตธนบุรี',
    distance: '10 กม.',
    deliveryTime: '40-55 นาที',
    landmarks: ['วัดอรุณราชวราราม (วัดแจ้ง)', 'สถานีรถไฟธนบุรี', 'ห้างเซ็นทรัล พระราม 2'],
    description: 'ร้านวัสดุก่อสร้าง ใกล้ธนบุรี ส่งฟรีทุกออเดอร์ ครอบคลุมพื้นที่กว้าง คุณภาพดี',
    uniqueContent: 'เขตธนบุรีเป็นพื้นที่ประวัติศาสตร์ที่มีงานบูรณะอาคารเก่าและก่อสร้างใหม่อยู่เสมอ ร้านเราเข้าใจความต้องการวัสดุเฉพาะทั้งงานโบราณสถานและงานก่อสร้างสมัยใหม่',
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
            {areaData.uniqueContent && (
              <p className="text-gray-700 text-lg mb-6 leading-relaxed border-l-4 border-blue-400 pl-4">
                {areaData.uniqueContent}
              </p>
            )}
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
              🏗️ วัสดุก่อสร้าง ส่ง{areaData.name} ครบทุกชนิด
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'อิฐ หิน ปูน ทราย', desc: 'คุณภาพดี รับประกัน', icon: '🧱' },
                { name: 'เหล็ก ประปา ไฟฟ้า', desc: 'ของแท้ ครบครัน', icon: '⚡' },
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
                  <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-center">{product.desc}</p>
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
