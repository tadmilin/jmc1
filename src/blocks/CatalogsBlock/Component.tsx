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
    layout === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
      : 'space-y-6'

  if (!items?.length) {
    return (
      <div className="text-center text-gray-600 py-12 bg-white">
        <p>ไม่พบแคตตาล็อก</p>
        <p className="text-sm">กรุณาเพิ่มรายการแคตตาล็อกใน Admin Panel</p>
      </div>
    )
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {heading && <h2 className="text-3xl font-bold mb-8 text-center text-black">{heading}</h2>}
        <div className={containerClass}>
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative w-full aspect-[3/4] bg-gray-100">
                {item.thumbnailImage ? (
                  <Image
                    src={getMediaUrl(item.thumbnailImage)}
                    alt={item.name || 'รูปภาพแคตตาล็อก'}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized={true}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
                    📷 ไม่มีรูปภาพ
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-black line-clamp-2">{item.name}</h3>
                {item.category && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full mb-2">
                    {item.category}
                  </span>
                )}
                {item.description && (
                  <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.description}</p>
                )}
                <a
                  href={getMediaUrl(item.pdfFile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  download
                  onClick={(e) => {
                    const url = getMediaUrl(item.pdfFile)
                    if (!url || url === '/placeholder-image.svg' || !item.pdfFile) {
                      e.preventDefault()
                      alert('ไฟล์ PDF ไม่พร้อมใช้งาน')
                    }
                  }}
                >
                  📄 ดาวน์โหลด Catalog
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
