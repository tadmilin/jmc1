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
  // ถ้าเป็น string (filename)
  if (typeof media === 'string') {
    if (media.startsWith('http') || media.startsWith('/')) {
      return media
    }
    // ใช้ Payload media endpoint
    return `/media/${media}`
  }

  // ถ้าเป็น Media object
  if (!media || typeof media !== 'object') {
    return '/placeholder-image.svg'
  }

  // ตรวจสอบ properties ต่างๆ ของ Media object
  if ('url' in media && media.url) {
    return media.url as string
  }

  if ('filename' in media && media.filename) {
    return `/media/${media.filename}`
  }

  if ('id' in media && media.id) {
    return `/media/${media.id}`
  }

  // ถ้าไม่เจอ property ไหนเลย
  return '/placeholder-image.svg'
}

export const CatalogsBlock: React.FC<CatalogsBlockProps> = ({
  heading,
  layout = 'grid',
  items = [],
}) => {
  // Debug logging เพื่อดูข้อมูล
  React.useEffect(() => {
    console.log('=== CatalogsBlock Debug ===')
    console.log('Items received:', items)
    console.log('Items count:', items?.length)
    if (items && items.length > 0) {
      console.log('First item detail:', items[0])
      console.log('Thumbnail image:', items[0]?.thumbnailImage)
      if (items[0]?.thumbnailImage) {
        console.log('Generated URL:', getMediaUrl(items[0].thumbnailImage))
      }
    }
  }, [items])

  const containerClass =
    layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'

  if (!items?.length) {
    return (
      <div className="text-center text-gray-600 py-12">
        <p>ไม่พบแคตตาล็อก</p>
        <p className="text-sm">กรุณาเพิ่มรายการแคตตาล็อกใน Admin Panel</p>
      </div>
    )
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
              <div className="relative w-full aspect-video bg-gray-100">
                {item.thumbnailImage ? (
                  <Image
                    src={getMediaUrl(item.thumbnailImage)}
                    alt={item.name || 'รูปภาพแคตตาล็อก'}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={true}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500 rounded-t-lg">
                    📷 ไม่มีรูปภาพ
                  </div>
                )}
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
                    if (!url || url === '/placeholder-image.svg' || !item.pdfFile) {
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
