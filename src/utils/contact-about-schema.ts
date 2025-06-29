import { getServerSideURL } from '@/utilities/getURL'

/**
 * Generate Contact Page Schema for Local SEO
 */
export function generateContactPageSchema() {
  const baseUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'ติดต่อร้านวัสดุก่อสร้าง JMC',
    description: 'ติดต่อร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน',
    url: `${baseUrl}/contactus-`,
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#organization`,
      name: 'ร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ใกล้ฉัน',
      alternateName: 'จงมีชัยค้าวัสดุ',
      description: 'ร้านวัสดุก่อสร้างราคาถูกครบวงจร ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน',
      url: baseUrl,
      telephone: '02-434-8319',
      email: 'tadeyes1@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '38,40 ถนนชักพระ เขตตลิ่งชัน แขวงตลิ่งชัน ซอยชักพระ6',
        addressLocality: 'ตลิ่งชัน',
        addressRegion: 'กรุงเทพมหานคร',
        postalCode: '10170',
        addressCountry: 'TH',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 13.7563,
        longitude: 100.5018,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '07:00',
          closes: '17:00',
        },
      ],
      areaServed: [
        {
          '@type': 'City',
          name: 'ตลิ่งชัน',
        },
        {
          '@type': 'City',
          name: 'บางเขน',
        },
        {
          '@type': 'City',
          name: 'หนองแขม',
        },
        {
          '@type': 'City',
          name: 'บางแค',
        },
        {
          '@type': 'City',
          name: 'บางพลัด',
        },
        {
          '@type': 'City',
          name: 'ทวีวัฒนา',
        },
        {
          '@type': 'City',
          name: 'ภาษีเจริญ',
        },
      ],
      serviceType: [
        'วัสดุก่อสร้าง',
        'ท่อ PVC',
        'ข้อต่อ',
        'ปั๊มน้ำ',
        'อุปกรณ์ประปา',
        'เครื่องมือช่าง',
        'บริการส่งสินค้า',
        'คำนวณสีฟรี',
      ],
      priceRange: '฿฿',
      currenciesAccepted: 'THB',
      paymentAccepted: ['Cash', 'Bank Transfer'],
      hasMap: `${baseUrl}/contactus-`,
      isicV4: '4663', // Wholesale of construction materials
    },
  }
}

/**
 * Generate About Page Schema
 */
export function generateAboutPageSchema() {
  const baseUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'เกี่ยวกับร้านวัสดุก่อสร้าง JMC',
    description: 'ประวัติและข้อมูลร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ปากซอยชักพระ6',
    url: `${baseUrl}/aboutus`,
    mainEntity: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#organization`,
      name: 'ร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ใกล้ฉัน',
      alternateName: ['จงมีชัยค้าวัสดุ', 'JMC'],
      description: 'ร้านวัสดุก่อสร้างครบวงจร ให้บริการชุมชนตลิ่งชัน มีประสบการณ์กว่า 35 ปี',
      foundingDate: '2020',
      founder: {
        '@type': 'Person',
        name: 'เจ้าของร้าน JMC',
      },
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: '5-10',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '38,40 ถนนชักพระ เขตตลิ่งชัน แขวงตลิ่งชัน ซอยชักพระ6',
        addressLocality: 'ตลิ่งชัน',
        addressRegion: 'กรุงเทพมหานคร',
        postalCode: '10170',
        addressCountry: 'TH',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 13.7563,
        longitude: 100.5018,
      },
      areaServed: [
        {
          '@type': 'City',
          name: 'ตลิ่งชัน',
          description: 'พื้นที่บริการหลัก',
        },
        {
          '@type': 'City',
          name: 'บางเขน',
          description: 'พื้นที่บริการรอง',
        },
        {
          '@type': 'City',
          name: 'หนองแขม',
          description: 'พื้นที่บริการรอง',
        },
        {
          '@type': 'City',
          name: 'บางแค',
          description: 'พื้นที่บริการเสริม',
        },
        {
          '@type': 'City',
          name: 'บางพลัด',
          description: 'พื้นที่บริการเสริม',
        },
        {
          '@type': 'City',
          name: 'ทวีวัฒนา',
          description: 'พื้นที่บริการเสริม',
        },
        {
          '@type': 'City',
          name: 'ภาษีเจริญ',
          description: 'พื้นที่บริการพิเศษ',
        },
      ],
      specialties: [
        'วัสดุก่อสร้างครบวงจร',
        'ท่อ PVC และข้อต่อ',
        'ปั๊มน้ำและอุปกรณ์ประปา',
        'เครื่องมือช่าง',
        'บริการส่งถึงไซต์งาน',
        'เครื่องคำนวณสีฟรี',
        'ราคาโรงงาน',
        'บริการมืออาชีพ',
      ],
      slogan: 'วัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน ราคาดี คุณภาพเยี่ยม',
      mission:
        'เป็นร้านวัสดุก่อสร้างอันดับ 1 ในใจชาวตลิ่งชัน ด้วยสินค้าคุณภาพ ราคาย่อมเยา และบริการที่ใส่ใจ',
      award: ['ความไว้วางใจจากชุมชนตลิ่งชัน', 'ประสบการณ์ 35 ปี', 'ลูกค้าประจำมากมาย'],
      knowsAbout: [
        'วัสดุก่อสร้าง',
        'ท่อ PVC',
        'ปั๊มน้ำ',
        'อุปกรณ์ประปา',
        'เครื่องมือช่าง',
        'การก่อสร้าง',
        'การปรับปรุงบ้าน',
        'ระบบประปา',
        'ระบบไฟฟ้า',
      ],
      isicV4: '4663', // Wholesale of construction materials
      naics: '423330', // Roofing, Siding, and Insulation Material Merchant Wholesalers
    },
  }
}

/**
 * Generate FAQ Schema for Contact/About pages
 */
export function generateContactFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'ร้าน JMC อยู่ที่ไหน?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'จงมีชัยค้าวัสดุ ตั้งอยู่ที่ 38,40 ถนนชักพระ เขตตลิ่งชัน แขวงตลิ่งชัน ซอยชักพระ6 กรุงเทพมหานคร 10170',
        },
      },
      {
        '@type': 'Question',
        name: 'เปิดกี่โมง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'เปิดให้บริการวันจันทร์ - เสาร์ เวลา 07:00 - 17:00 น. วันอาทิตย์ปิด',
        },
      },
      {
        '@type': 'Question',
        name: 'มีบริการส่งสินค้าไหม?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'มีครับ เรามีบริการส่งสินค้าถึงไซต์งานในเขตตลิ่งชันและพื้นที่ใกล้เคียง โทรสอบถาม 02-434-8319',
        },
      },
      {
        '@type': 'Question',
        name: 'มีวัสดุอะไรบ้าง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'เรามีวัสดุก่อสร้างครบวงจร ท่อ PVC, ข้อต่อ, ปั๊มน้ำ, อุปกรณ์ประปา, เครื่องมือช่าง, สี และอื่นๆ อีกมากมาย',
        },
      },
      {
        '@type': 'Question',
        name: 'ราคาเป็นยังไง?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'เราขายราคาโรงงาน ไม่ผ่านคนกลาง ราคาดีที่สุด สอบถามราคาได้ที่ 02-434-8319',
        },
      },
    ],
  }
}

/**
 * Helper function to generate all schemas for a page
 */
export function generatePageSchemas(pageType: 'contact' | 'about') {
  const schemas = []

  if (pageType === 'contact') {
    schemas.push(generateContactPageSchema())
    schemas.push(generateContactFAQSchema())
  } else if (pageType === 'about') {
    schemas.push(generateAboutPageSchema())
  }

  return schemas
}
