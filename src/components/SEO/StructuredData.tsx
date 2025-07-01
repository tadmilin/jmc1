import type { ProductStructuredData } from '@/utils/seo'
import React from 'react'
import { getServerSideURL } from '@/utilities/getURL'

interface StructuredDataProps {
  data: ProductStructuredData | object
}

interface ImageStructuredDataProps {
  images?: Array<{
    url: string
    alt: string
    width?: number
    height?: number
  }>
  title: string
  description: string
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  )
}

export const ImageGalleryStructuredData: React.FC<ImageStructuredDataProps> = ({
  images,
  title,
  description,
}) => {
  if (!images || images.length === 0) return null

  const baseUrl = getServerSideURL()

  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: title,
    description: description,
    image: images.map((img) => ({
      '@type': 'ImageObject',
      url: img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`,
      description: img.alt,
      width: img.width || 1200,
      height: img.height || 630,
    })),
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'จงมีชัยค้าวัสดุ',
    image: images.map((img) => (img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`)),
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ปากซอยชักพระ6',
      addressLocality: 'ตลิ่งชัน',
      addressRegion: 'กรุงเทพมหานคร',
      postalCode: '10170',
      addressCountry: 'TH',
    },
    telephone: '02-434-8319',
    openingHours: 'Mo-Sa 07:00-17:00',
    priceRange: '฿฿',
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 13.780839074740534,
      longitude: 100.4622982337261,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageGallerySchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
    </>
  )
}
