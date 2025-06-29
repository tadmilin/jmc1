import { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

export const metadata: Metadata = {
  title: 'ติดต่อเรา - ร้านวัสดุก่อสร้าง ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน | JMC',
  description:
    'ติดต่อร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 โทร 02-434-8319 เปิด จ-ส 07:00-17:00 น.',
  keywords:
    'ติดต่อ JMC, ร้านวัสดุก่อสร้าง ตลิ่งชัน, ปากซอยชักพระ6, วัสดุก่อสร้างใกล้ฉัน, โทรศัพท์, ที่อยู่',
  alternates: {
    canonical: `${getServerSideURL()}/contact`,
  },
}

export default function ContactPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'ติดต่อร้านวัสดุก่อสร้าง JMC',
    description: 'ติดต่อร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'ร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ใกล้ฉัน',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '38,40 ถนนชักพระ เขตตลิ่งชัน แขวงตลิ่งชัน ซอยชักพระ6',
        addressLocality: 'กรุงเทพมหานคร',
        postalCode: '10170',
        addressCountry: 'TH',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 13.7563,
        longitude: 100.5018,
      },
      telephone: '02-434-8319',
      email: 'tadeyes1@gmail.com',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '07:00',
          closes: '17:00',
        },
      ],
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
          ติดต่อร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          จงมีชัยค้าวัสดุ ปากซอยชักพระ6 พร้อมให้บริการ วัสดุก่อสร้างครบวงจร ราคาถูก ส่งไว
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">ข้อมูลติดต่อ</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">ที่อยู่ร้าน</h3>
                  <p className="text-gray-600">
                    38,40 ถนนชักพระ เขตตลิ่งชัน
                    <br />
                    แขวงตลิ่งชัน ซอยชักพระ6
                    <br />
                    กรุงเทพมหานคร 10170
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">โทรศัพท์</h3>
                  <p className="text-gray-600">
                    <a href="tel:02-434-8319" className="text-blue-600 hover:text-blue-800">
                      02-434-8319
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">อีเมล</h3>
                  <p className="text-gray-600">
                    <a
                      href="mailto:tadeyes1@gmail.com"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      tadeyes1@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">เวลาทำการ</h3>
                  <p className="text-gray-600">
                    จันทร์ - เสาร์: 07:00 - 17:00 น.
                    <br />
                    อาทิตย์: ปิด
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">บริการของเรา</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• วัสดุก่อสร้างครบวงจร</li>
              <li>• ท่อ PVC และข้อต่อ</li>
              <li>• ปั๊มน้ำและอุปกรณ์ประปา</li>
              <li>• เครื่องมือช่าง</li>
              <li>• บริการส่งถึงไซต์งาน</li>
              <li>• คำนวณสีฟรี</li>
            </ul>
          </div>
        </div>

        {/* Google Map */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">แผนที่ร้าน</h2>
            <p className="text-gray-600 mb-6">
              ร้านตั้งอยู่ในตลิ่งชัน ปากซอยชักพระ6 เดินทางสะดวก จอดรถได้
            </p>
          </div>

          <div className="aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.4650290896626!2d100.52599237523058!3d13.750127997585802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ec7c571b34b%3A0xed43e783d7eec5ae!2z4Liq4LiB4Liy4Lir4Lie4Liy4Lij4Liy4LiT!5e0!3m2!1sth!2sth!4v1717058343895!5m2!1sth!2sth"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">พร้อมให้บริการแล้ว!</h2>
        <p className="text-xl mb-6">ต้องการวัสดุก่อสร้าง ปรึกษาฟรี โทรเลย!</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:02-434-8319"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
          >
            📞 โทรตอนนี้
          </a>
          <a
            href="/calculator"
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-full transition-colors duration-300"
          >
            🎨 คำนวณสี
          </a>
        </div>
      </div>
    </div>
  )
}
