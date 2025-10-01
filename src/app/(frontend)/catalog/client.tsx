'use client'

import React from 'react'
import Image from 'next/image'
import type { Catalog, Media } from '@/payload-types'

interface CatalogClientProps {
  initialData: {
    docs: Catalog[]
  }
}

export default function CatalogClient({ initialData }: CatalogClientProps) {
  const catalogs = initialData.docs

  if (!catalogs?.length) {
    return <div className="text-center text-gray-600">ไม่พบแคตตาล็อก</div>
  }

  const getMediaFilename = (field: string | Media): string => {
    if (typeof field === 'string') return field
    return field.filename || ''
  }

  const getMediaAlt = (field: string | Media, fallback: string): string => {
    if (typeof field === 'string') return fallback
    return field.alt || fallback
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {catalogs.map((catalog) => (
        <div
          key={catalog.id}
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
        >
          <div className="relative w-full aspect-video">
            {catalog.thumbnailImage && (
              <Image
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${getMediaFilename(catalog.thumbnailImage)}`}
                alt={getMediaAlt(catalog.thumbnailImage, catalog.name)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-xl font-semibold mb-2">{catalog.name}</h3>
            {catalog.category && (
              <span className="text-sm text-gray-600 mb-2">{catalog.category}</span>
            )}
            {catalog.description && (
              <p className="text-gray-700 mb-4 line-clamp-2">{catalog.description}</p>
            )}
            {catalog.pdfFile && (
              <a
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${getMediaFilename(catalog.pdfFile)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors mt-auto"
                download
              >
                ดาวน์โหลด PDF
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
