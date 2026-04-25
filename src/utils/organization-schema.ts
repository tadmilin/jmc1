import { getServerSideURL } from '@/utilities/getURL'

export type OrganizationSchema = {
  '@context': 'https://schema.org'
  '@id'?: string
  '@type': string
  name: string
  alternateName?: string
  description: string
  url: string
  logo: string | { '@type': 'ImageObject'; url: string; width: number; height: number }
  image: string[]
  telephone: string
  email: string
  hasMap?: string
  photo?: string[]
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
  areaServed: object[]
  keywords: string
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
  hasOfferCatalog?: {
    '@type': 'OfferCatalog'
    name: string
    itemListElement: { '@type': 'OfferCatalog'; name: string }[]
  }
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
    '@id': `${baseUrl}/#hardware-store`,
    '@type': 'HardwareStore',
    name: 'จงมีชัยค้าวัสดุ',
    alternateName: 'ร้านวัสดุก่อสร้าง ตลิ่งชัน ใกล้ฉัน แถวตลิ่งชัน JMC ปากซอยชักพระ6',
    description:
      'ร้านวัสดุก่อสร้าง แถวตลิ่งชัน ใกล้ฉัน ปากซอยชักพระ6 ราคาถูก ส่งฟรี ครบวงจร อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า บริการพื้นที่ ตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์ บรม สวนผัก พระราม5 บางกรวย ช่างมืออาชีพ โทร 02-434-8319',
    url: baseUrl,
    hasMap: 'https://share.google/TxjtGXd6tcJBmaMCd',
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/jmc-og-image.svg`,
      width: 600,
      height: 314,
    },
    image: [`${baseUrl}/jmc-og-image.svg`],
    photo: [`${baseUrl}/jmc-og-image.svg`],
    telephone: '+6624348319',
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
      { '@type': 'City', name: 'ตลิ่งชัน', sameAs: 'https://www.wikidata.org/wiki/Q2368578' },
      { '@type': 'AdministrativeArea', name: 'แขวงตลิ่งชัน' },
      { '@type': 'AdministrativeArea', name: 'เขตตลิ่งชัน' },
      { '@type': 'Neighborhood', name: 'ปากซอยชักพระ6' },
      { '@type': 'Neighborhood', name: 'ถนนชักพระ' },
      { '@type': 'Neighborhood', name: 'ปิ่นเกล้า' },
      { '@type': 'Neighborhood', name: 'จรัญสนิทวงศ์' },
      { '@type': 'Neighborhood', name: 'บางขุนนนท์' },
      { '@type': 'Neighborhood', name: 'บางพลัด' },
      { '@type': 'Neighborhood', name: 'ท่าพระ' },
      { '@type': 'Neighborhood', name: 'บางกอกน้อย' },
      { '@type': 'Neighborhood', name: 'บางบำหรุ' },
      { '@type': 'Neighborhood', name: 'บรมราชชนนี' },
      { '@type': 'Neighborhood', name: 'สวนผัก' },
      { '@type': 'City', name: 'ธนบุรี' },
      { '@type': 'AdministrativeArea', name: 'พระราม 5' },
      { '@type': 'City', name: 'บางกรวย' },
    ],
    keywords:
      'ร้านวัสดุก่อสร้างใกล้ฉัน, วัสดุก่อสร้างใกล้ฉัน, ร้านวัสดุก่อสร้างแถวตลิ่งชัน, วัสดุก่อสร้างแถวตลิ่งชัน, ร้านวัสดุก่อสร้างย่านตลิ่งชัน, ร้านวัสดุก่อสร้าง ตลิ่งชัน, วัสดุก่อสร้าง ตลิ่งชัน, วัสดุก่อสร้างราคาถูก, จำหน่ายวัสดุก่อสร้าง, อิฐใกล้ฉัน, อิฐแดง, อิฐมอญ, อิฐบล็อก, อิฐมวลเบา, ปูนใกล้ฉัน, ปูนซีเมนต์ใกล้ฉัน, ปูนก่อ, ปูนฉาบ, ปูนสำเร็จรูป, ทรายใกล้ฉัน, ทรายก่อสร้าง, ทรายหยาบ, หินใกล้ฉัน, หิน 3/4, หินคลุก, เหล็กใกล้ฉัน, เหล็กเส้น, เหล็กฉาก, เหล็กกล่อง, ท่อ PVC ใกล้ฉัน, ท่อน้ำ, ปั๊มน้ำใกล้ฉัน, สายไฟใกล้ฉัน, สีทาบ้านใกล้ฉัน, กระเบื้องใกล้ฉัน, กระเบื้องหลังคา, ประตูหน้าต่างใกล้ฉัน, อุปกรณ์ก่อสร้างใกล้ฉัน, ส่งวัสดุฟรีถึงไซต์งาน, ต่อเติมบ้าน, ซ่อมแซมบ้าน, รีโนเวทบ้าน',
    serviceType: [
      'ร้านวัสดุก่อสร้าง ตลิ่งชัน',
      'ร้านวัสดุก่อสร้าง แถวตลิ่งชัน',
      'ร้านวัสดุก่อสร้าง ย่านตลิ่งชัน',
      'ร้านวัสดุก่อสร้าง เขตตลิ่งชัน',
      'วัสดุก่อสร้าง ใกล้ฉัน',
      'วัสดุก่อสร้าง แถวตลิ่งชัน',
      'ร้านวัสดุก่อสร้าง ปากซอยชักพระ6',
      'วัสดุก่อสร้าง ปิ่นเกล้า',
      'วัสดุก่อสร้าง แถวปิ่นเกล้า',
      'วัสดุก่อสร้าง จรัญ',
      'วัสดุก่อสร้าง แถวจรัญ',
      'วัสดุก่อสร้าง บางขุนนนท์',
      'วัสดุก่อสร้าง แถวบางขุนนนท์',
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
    openingHours: 'Mo-Sa 07:00-17:00 Su 08:00-16:00',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'business_type',
        value: 'ร้านวัสดุก่อสร้าง',
      },
      {
        '@type': 'PropertyValue',
        name: 'service_area',
        value: 'แถวตลิ่งชัน ย่านตลิ่งชัน เขตตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์',
      },
      {
        '@type': 'PropertyValue',
        name: 'near_me_keywords',
        value: 'ร้านวัสดุก่อสร้างใกล้ฉัน วัสดุก่อสร้างแถวตลิ่งชัน ร้านวัสดุก่อสร้างย่านตลิ่งชัน',
      },
      {
        '@type': 'PropertyValue',
        name: 'google_maps_url',
        value: 'https://share.google/TxjtGXd6tcJBmaMCd',
      },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        name: 'ส่งฟรี วัสดุก่อสร้าง แถวตลิ่งชัน',
        description: 'บริการส่งฟรี วัสดุก่อสร้าง ในพื้นที่แถวตลิ่งชัน ปิ่นเกล้า จรัญ บางขุนนนท์',
        areaServed: 'แถวตลิ่งชัน, ย่านตลิ่งชัน, ปิ่นเกล้า, จรัญสนิทวงศ์',
      },
      {
        '@type': 'Offer',
        name: 'วัสดุก่อสร้าง แถวตลิ่งชัน ราคาถูก',
        description: 'จำหน่ายวัสดุก่อสร้างครบวงจร แถวตลิ่งชัน อิฐ หิน ปูน ทราย เหล็ก ราคาถูก',
        areaServed: 'ตลิ่งชัน, แถวตลิ่งชัน, เขตตลิ่งชัน',
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
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'วัสดุก่อสร้าง แถวตลิ่งชัน ครบวงจร',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'อิฐ หิน ปูน ทราย' },
        { '@type': 'OfferCatalog', name: 'เหล็กก่อสร้าง' },
        { '@type': 'OfferCatalog', name: 'อุปกรณ์ประปา' },
        { '@type': 'OfferCatalog', name: 'อุปกรณ์ไฟฟ้า' },
        { '@type': 'OfferCatalog', name: 'สีทาบ้าน' },
        { '@type': 'OfferCatalog', name: 'ประตูและหน้าต่าง' },
        { '@type': 'OfferCatalog', name: 'ท่อ PVC และอุปกรณ์' },
      ],
    },
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
