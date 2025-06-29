import { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

export const metadata: Metadata = {
  title: 'เกี่ยวกับเรา - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | JMC',
  description:
    'จงมีชัยค้าวัสดุ ก่อตั้งปี 2020 ร้านวัสดุก่อสร้างครบวงจร ตลิ่งชัน ปากซอยชักพระ6 ให้บริการชุมชน มีช่างฝีมือ ส่งไว',
  keywords:
    'เกี่ยวกับ JMC, ประวัติร้าน, วัสดุก่อสร้าง ตลิ่งชัน, ปากซอยชักพระ6, ร้านวัสดุก่อสร้างใกล้ฉัน, ประสบการณ์',
  alternates: {
    canonical: `${getServerSideURL()}/about`,
  },
}

export default function AboutPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'เกี่ยวกับร้านวัสดุก่อสร้าง JMC',
    description: 'ประวัติและข้อมูลร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'ร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ใกล้ฉัน',
      foundingDate: '2020',
      description: 'ร้านวัสดุก่อสร้างครบวงจร ให้บริการชุมชนตลิ่งชัน มีประสบการณ์กว่า 35 ปี',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '38,40 ถนนชักพระ เขตตลิ่งชัน แขวงตลิ่งชัน ซอยชักพระ6',
        addressLocality: 'กรุงเทพมหานคร',
        postalCode: '10170',
        addressCountry: 'TH',
      },
      areaServed: ['ตลิ่งชัน', 'บางเขน', 'หนองแขม', 'บางแค', 'บางพลัด', 'ทวีวัฒนา', 'ภาษีเจริญ'],
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          เกี่ยวกับร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          จงมีชัยค้าวัสดุ ให้บริการชุมชนตลิ่งชัน ปากซอยชักพระ6 มากกว่า 4 ปี
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        {/* เกี่ยวกับเรา */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">ประวัติร้าน JMC</h2>

            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                <strong>จงมีชัยค้าวัสดุ (JMC)</strong> ก่อตั้งขึ้นในปี <strong>2020</strong>
                ด้วyความมุ่งมั่นที่จะเป็นร้านวัสดุก่อสร้างที่ดีที่สุดในเขตตลิ่งชัน
              </p>

              <p className="text-lg leading-relaxed">
                ตั้งอยู่ในทำเลที่ดี <strong>ปากซอยชักพระ6</strong> เดินทางสะดวก ใกล้ชุมชน
                สามารถให้บริการได้ทั่วเขตตลิ่งชันและพื้นที่ใกล้เคียง
              </p>

              <p className="text-lg leading-relaxed">
                เรามี<strong>ประสบการณ์กว่า 4 ปี</strong> ในการให้บริการวัสดุก่อสร้าง
                จึงเข้าใจความต้องการของลูกค้าเป็นอย่างดี
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">วิสัยทัศน์</h3>
            <p className="text-gray-700 text-lg">
              "เป็นร้านวัสดุก่อสร้างอันดับ 1 ในใจชาวตลิ่งชัน ด้วยสินค้าคุณภาพ ราคาย่อมเยา
              และบริการที่ใส่ใจ"
            </p>
          </div>
        </div>

        {/* จุดเด่นของเรา */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">จุดเด่นของเรา</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">ใกล้บ้าน ใกล้ใจ</h3>
                  <p className="text-gray-600">
                    ตั้งอยู่ในหัวใจชุมชนตลิ่งชัน เดินทางสะดวก จอดรถได้
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">วัสดุครบวงจร</h3>
                  <p className="text-gray-600">
                    ท่อ PVC, ข้อต่อ, ปั๊มน้ำ, เครื่องมือช่าง, สี อุปกรณ์ประปา-ไฟฟ้า
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">ราคาโรงงาน</h3>
                  <p className="text-gray-600">ขายตรงจากโรงงาน ไม่มีผ่านคนกลาง ราคาดีที่สุด</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">ส่งถึงไซต์งาน</h3>
                  <p className="text-gray-600">
                    บริการส่งสินค้าถึงไซต์งาน ในเขตตลิ่งชันและพื้นที่ใกล้เคียง
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">คำนวณสีฟรี</h3>
                  <p className="text-gray-600">
                    เครื่องคำนวณสีออนไลน์ ช่วยประมาณปริมาณสีที่ต้องใช้
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* พื้นที่ให้บริการ */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          พื้นที่ให้บริการ วัสดุก่อสร้าง ใกล้ฉัน
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-blue-600 mb-3">เขตหลัก</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• ตลิ่งชัน</li>
              <li>• บางเขน</li>
              <li>• หนองแขม</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-green-600 mb-3">เขตใกล้เคียง</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• บางแค</li>
              <li>• บางพลัด</li>
              <li>• ทวีวัฒนา</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-bold text-purple-600 mb-3">พื้นที่พิเศษ</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• ภาษีเจริญ</li>
              <li>• บางกอกน้อย</li>
              <li>• ปากซอยชักพระ6</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">พร้อมดูแลโปรเจ็กต์ของคุณ!</h2>
        <p className="text-xl mb-6">วัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน ราคาดี คุณภาพเยี่ยม</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
          >
            📍 ดูที่อยู่ร้าน
          </a>
          <a
            href="tel:02-434-8319"
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-full transition-colors duration-300"
          >
            📞 โทรสอบถาม
          </a>
        </div>
      </div>
    </div>
  )
}
