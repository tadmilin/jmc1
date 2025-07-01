import { getServerSideURL } from '@/utilities/getURL'

export type OrganizationSchema = {
  '@context': 'https://schema.org'
  '@type': 'LocalBusiness'
  name: string
  alternateName?: string
  description: string
  url: string
  logo: string
  image: string[]
  telephone: string
  email: string
  address: {
    '@type': 'PostalAddress'
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo: {
    '@type': 'GeoCoordinates'
    latitude: number
    longitude: number
  }
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification'
    dayOfWeek: string[]
    opens: string
    closes: string
  }[]
  priceRange: string
  paymentAccepted: string[]
  currenciesAccepted: string
  areaServed: string[]
  serviceType: string[]
  founder: {
    '@type': 'Person'
    name: string
  }
  foundingDate: string
  sameAs: string[]
  aggregateRating: {
    '@type': 'AggregateRating'
    ratingValue: string
    reviewCount: string
    bestRating: string
    worstRating: string
  }
  openingHours: string
  additionalProperty?: {
    '@type': 'PropertyValue'
    name: string
    value: string
  }[]
  makesOffer?: {
    '@type': 'Offer'
    name: string
    description: string
    areaServed?: string
    price?: string
    priceCurrency?: string
  }[]
}

export type WebSiteSchema = {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  alternateName?: string
  url: string
  description: string
  publisher: {
    '@type': 'Organization'
    name: string
    logo: {
      '@type': 'ImageObject'
      url: string
    }
  }
  potentialAction: {
    '@type': 'SearchAction'
    target: {
      '@type': 'EntryPoint'
      urlTemplate: string
    }
    'query-input': string
  }
  inLanguage: string
}

/**
 * Generates Organization/LocalBusiness structured data
 */
export function generateOrganizationSchema(): OrganizationSchema {
  const baseUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'จงมีชัยค้าวัสดุ',
    alternateName: 'ร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน JMC ปากซอยชักพระ6',
    description:
      'ร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน ปากซอยชักพระ6 ราคาถูก ส่งฟรี ครบวงจร อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า บริการพื้นที่ ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย ช่างมืออาชีพ โทร 02-434-8319',
    url: baseUrl,
    logo: `${baseUrl}/jmc-og-image.svg`,
    image: [`${baseUrl}/jmc-og-image.svg`],
    telephone: '02-434-8319',
    email: 'tadeyes1@gmail.com',
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
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '07:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '08:00',
        closes: '16:00',
      },
    ],
    priceRange: '฿฿',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Promptpay'],
    currenciesAccepted: 'THB',
    areaServed: [
      'ตลิ่งชัน',
      'ปากซอยชักพระ6',
      'ถนนชักพระ',
      'แขวงตลิ่งชัน',
      'เขตตลิ่งชัน',
      'ปิ่นเกล้า',
      'จรัญสนิทวงศ์',
      'บางขุนนนท์',
      'บรมราชชนนี',
      'สวนผัก',
      'พระราม5',
      'บางกรวย',
      'บางพลัด',
      'บางกอกน้อย',
      'ธนบุรี',
      'บางกอกใหญ่',
      'หนองแขม',
      'บางแค',
      'ทวีวัฒนา',
      'ภาษีเจริญ',
      'กรุงเทพมหานคร',
      'นนทบุรี',
      'ปทุมธานี',
    ],
    serviceType: [
      'ร้านวัสดุก่อสร้าง ตลิ่งชัน',
      'วัสดุก่อสร้าง ใกล้ฉัน',
      'ร้านวัสดุก่อสร้าง ปากซอยชักพระ6',
      'วัสดุก่อสร้าง ปิ่นเกล้า',
      'วัสดุก่อสร้าง จรัญ',
      'วัสดุก่อสร้าง บางขุนนนท์',
      'อิฐ หิน ปูน ทราย ตลิ่งชัน',
      'เหล็ก ประปา ไฟฟ้า ตลิ่งชัน',
      'อุปกรณ์ก่อสร้าง ตลิ่งชัน',
      'ท่อ PVC ตลิ่งชัน',
      'ปั๊มน้ำ ตลิ่งชัน',
      'สีทาบ้าน ตลิ่งชัน',
      'ช่างรับเหมา ตลิ่งชัน',
      'ส่งวัสดุก่อสร้าง ฟรี',
      'คำนวณสี ฟรี',
      'บริการส่งถึงไซต์งาน',
    ],
    founder: {
      '@type': 'Person',
      name: 'คุณทัด จงมีชัย',
    },
    foundingDate: '1990-01-01',
    sameAs: [
      'https://www.facebook.com/jmc1990lekmor',
      'https://page.line.me/308aoxno',
      'https://share.google/TxjtGXd6tcJBmaMCd',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '9',
      bestRating: '5',
      worstRating: '1',
    },
    openingHours: 'Mo-Sa 07:00-17:00, Su 08:00-16:00',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'business_type',
        value: 'ร้านวัสดุก่อสร้าง',
      },
      {
        '@type': 'PropertyValue',
        name: 'service_area',
        value: 'ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์',
      },
      {
        '@type': 'PropertyValue',
        name: 'keywords',
        value: 'วัสดุก่อสร้าง ใกล้ฉัน, ร้านวัสดุก่อสร้าง ตลิ่งชัน, ปากซอยชักพระ6',
      },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        name: 'ส่งฟรี วัสดุก่อสร้าง',
        description: 'บริการส่งฟรี วัสดุก่อสร้าง ในพื้นที่ ตลิ่งชัน ปิ่นเกล้า จรัญ',
        areaServed: 'ตลิ่งชัน, ปิ่นเกล้า, จรัญสนิทวงศ์',
      },
      {
        '@type': 'Offer',
        name: 'คำนวณสีฟรี',
        description: 'บริการคำนวณสี ผสมสี ฟรี ไม่มีค่าใช้จ่าย',
        areaServed: 'ทุกพื้นที่บริการ',
        price: '0',
        priceCurrency: 'THB',
      },
    ],
  }
}

/**
 * Generates WebSite structured data
 */
export function generateWebSiteSchema(): WebSiteSchema {
  const baseUrl = getServerSideURL()

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ใกล้ฉัน',
    alternateName: 'จงมีชัยค้าวัสดุ',
    url: baseUrl,
    description:
      'ร้านวัสดุก่อสร้างราคาถูกครบวงจร ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน ให้บริการพื้นที่ ตลิ่งชัน ชักพระ บางขุนนนท์ จรัญสนิทวงศ์ ปิ่นเกล้า พระราม5 บางกรวย สวนผัก อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ส่งไว',
    publisher: {
      '@type': 'Organization',
      name: 'จงมีชัยค้าวัสดุ',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/jmc-og-image.svg`,
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'th-TH',
  }
}

/**
 * Generates BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>,
): object {
  if (breadcrumbs.length === 0) return {}

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}
