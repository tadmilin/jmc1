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
    name: 'ร้านวัสดุก่อสร้าง จงมีชัยค้าวัสดุ ตลิ่งชัน ใกล้ฉัน',
    alternateName: 'จงมีชัยค้าวัสดุ',
    description:
      'ร้านวัสดุก่อสร้างราคาถูกครบวงจร ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ส่งไว',
    url: baseUrl,
    logo: `${baseUrl}/jmc-og-image.svg`,
    image: [`${baseUrl}/jmc-og-image.svg`],
    telephone: '02-434-8319', // TODO: Update with real phone number
    email: 'tadeyes1@gmail.com', // TODO: Update with real email
    address: {
      '@type': 'PostalAddress',
      streetAddress: '38,40 ถนนชักพระ เขตตลิ่งชัน แขวงตลิ่งชัน ซอยชักพระ6 กรุงเทพ 10170', // TODO: Update with real address
      addressLocality: 'กรุงเทพมหานคร',
      addressRegion: 'กรุงเทพมหานคร',
      postalCode: '10170', // TODO: Update with real postal code
      addressCountry: 'TH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.7563, // TODO: Update with real coordinates
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
    priceRange: '฿฿',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
    currenciesAccepted: 'THB',
    areaServed: ['Thailand'],
    serviceType: ['วัสดุก่อสร้าง', 'อุปกรณ์ก่อสร้าง', 'คำนวณสี', 'ประปา', 'ปูน', 'เหล็ก', 'อิฐ', 'หิน', 'ทราย', 'ไฟฟ้า', 'ช่าง'],
    founder: {
      '@type': 'Person',
      name: 'ทัด', // TODO: Update with real founder name
    },
    foundingDate: '2000-01-01', // TODO: Update with real founding date
    sameAs: [
      'https://www.facebook.com/jmc1990lekmor',
      'https://page.line.me/308aoxno'
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
    description: 'ร้านวัสดุก่อสร้างราคาถูกครบวงจร ตลิ่งชัน ปากซอยชักพระ6 ใกล้ฉัน อิฐ หิน ปูน ทราย เหล็ก ประปา ไฟฟ้า ช่าง ส่งไว',
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
