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
    name: 'บริษัท เจเอ็มซี จำกัด',
    alternateName: 'JMC Company',
    description:
      'ผู้จำหน่ายท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปาคุณภาพสูง ราคาย่อมเยา พร้อมบริการคำนวณสีฟรี',
    url: baseUrl,
    logo: `${baseUrl}/jmc-og-image.svg`,
    image: [`${baseUrl}/jmc-og-image.svg`],
    telephone: '+66-XX-XXX-XXXX', // TODO: Update with real phone number
    email: 'info@jmc.co.th', // TODO: Update with real email
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'XXX ถนนXXX', // TODO: Update with real address
      addressLocality: 'กรุงเทพมหานคร',
      addressRegion: 'กรุงเทพมหานคร',
      postalCode: '10XXX', // TODO: Update with real postal code
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
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '08:00',
        closes: '17:00',
      },
    ],
    priceRange: '฿฿',
    paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
    currenciesAccepted: 'THB',
    areaServed: ['Thailand'],
    serviceType: ['ท่อ PVC', 'ข้อต่อ', 'ปั๊มน้ำ', 'อุปกรณ์ประปา', 'คำนวณสี'],
    founder: {
      '@type': 'Person',
      name: 'JMC Founder', // TODO: Update with real founder name
    },
    foundingDate: '2000-01-01', // TODO: Update with real founding date
    sameAs: [
      // TODO: Add social media profiles
      // 'https://www.facebook.com/jmccompany',
      // 'https://line.me/ti/p/@jmccompany',
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
    name: 'JMC Company',
    alternateName: 'บริษัท เจเอ็มซี จำกัด',
    url: baseUrl,
    description: 'ผู้จำหน่ายท่อ PVC ข้อต่อ ปั๊มน้ำ และอุปกรณ์ประปาคุณภาพสูง',
    publisher: {
      '@type': 'Organization',
      name: 'JMC Company',
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
