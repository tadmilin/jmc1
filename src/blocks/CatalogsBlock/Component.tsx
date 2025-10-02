'use client'

import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

interface CatalogItem {
  name: string
  description?: string
  category?: string
  thumbnailImage: string | Media
  pdfFile: string | Media
}

interface CatalogsBlockProps {
  heading?: string
  layout?: 'grid' | 'list'
  items?: CatalogItem[]
}

const getMediaUrl = (media: string | Media): string => {
  if (typeof media === 'string') {
    if (media.includes('/')) return media
    return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${encodeURIComponent(media)}`
  }
  if (!media?.filename) {
    console.warn('Media object missing filename:', media)
    return '/placeholder-image.jpg'
  }
  return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/media/${encodeURIComponent(media.filename)}`
}

export const CatalogsBlock: React.FC<CatalogsBlockProps> = ({
  heading,
  layout = 'grid',
  items = [],
}) => {
  const containerClass =
    layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'

  if (!items?.length) {
    return <div className="text-center text-gray-600 py-12">ไม่พบแคตตาล็อก</div>
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {heading && <h2 className="text-3xl font-bold mb-8 text-center">{heading}</h2>}
        <div className={containerClass}>
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-video">
                <Image
                  src={getMediaUrl(item.thumbnailImage)}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    console.error('Image failed to load:', item.thumbnailImage)
                    e.currentTarget.src = '/placeholder-image.jpg'
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                {item.category && (
                  <span className="inline-block px-3 py-1 bg-gray-100 text-sm text-gray-600 rounded-full mb-3">
                    {item.category}
                  </span>
                )}
                {item.description && (
                  <p className="text-gray-700 mb-4 line-clamp-3">{item.description}</p>
                )}
                <a
                  href={getMediaUrl(item.pdfFile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  download
                  onClick={(e) => {
                    const url = getMediaUrl(item.pdfFile)
                    if (!url || url === '/placeholder-image.jpg') {
                      e.preventDefault()
                      alert('ไฟล์ PDF ไม่พร้อมใช้งาน')
                    }
                  }}
                >
                  📄 ดาวน์โหลด PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
