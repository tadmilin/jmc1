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
    alternateName: 'ร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ใกล้ฉัน',
    description:
      'ร้านวัสดุก่อสร้างราคาถูกครบวงจร ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ส่งไว',
    url: baseUrl,
    logo: `${baseUrl}/jmc-og-image.svg`,
    image: [`${baseUrl}/jmc-og-image.svg`],
    telephone: '02-434-8319',
    email: 'tadeyes1@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '38,40 ปาก ซอยชักพระ6 ถนนชักพระ',
      addressLocality: 'ตลิ่งชัน',
      addressRegion: 'กรุงเทพมหานคร',
      postalCode: '10170',
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.780839074740534, // พิกัดที่ถูกต้องของร้าน - ต้องใส่พิกัดจริงจาก Google Maps
      longitude: 100.4622982337261, // พิกัดที่ถูกต้องของร้าน - ต้องใส่พิกัดจริงจาก Google Maps
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
      'บางพลัด',
      'บางกอกน้อย',
      'ธนบุรี',
      'บางกอกใหญ่',
      'กรุงเทพมหานคร',
      'นนทบุรี',
      'ปทุมธานี',
    ],
    serviceType: [
      'วัสดุก่อสร้าง',
      'อุปกรณ์ก่อสร้าง',
      'คำนวณสี',
      'ปูนกาว',
      'เหล็ก',
      'อิฐ',
      'หิน',
      'ทราย',
      'อุปกรณ์ประปา',
      'อุปกรณ์ไฟฟ้า',
      'สีทาบ้าน',
      'ช่างรับเหมา',
    ],
    founder: {
      '@type': 'Person',
      name: 'คุณทัด จงมีชัย',
    },
    foundingDate: '1990-01-01',
    sameAs: [
      'https://www.facebook.com/jmc1990lekmor',
      'https://page.line.me/308aoxno',
      'https://share.google/TxjtGXd6tcJBmaMCd', // ใส่ URL ของ Google Maps ที่แท้จริง
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '9',
      bestRating: '5',
      worstRating: '1',
    },
    openingHours: 'Mo-Sa 07:00-17:00, Su 08:00-16:00',
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
      'ร้านวัสดุก่อสร้างราคาถูกครบวงจร ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ส่งไว',
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
