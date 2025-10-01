import React from 'react'
import Image from 'next/image'
import { usePayloadAPI } from '@/hooks/usePayloadAPI'

interface CatalogsBlockProps {
  heading?: string
  layout?: 'grid' | 'list'
  limit?: number
}

export const CatalogsBlock: React.FC<CatalogsBlockProps> = ({
  heading,
  layout = 'grid',
  limit = 6,
}) => {
  const { data: catalogs, isLoading } = usePayloadAPI('catalogs', {
    limit,
    sort: '-createdAt',
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="loading">กำลังโหลด...</div>
      </div>
    )
  }

  const containerClass =
    layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {heading && <h2 className="text-3xl font-bold mb-8 text-gray-900">{heading}</h2>}
        <div className={containerClass}>
          {catalogs?.docs?.map((catalog) => (
            <div
              key={catalog.id}
              className={`
                bg-white rounded-lg shadow-md overflow-hidden
                ${layout === 'list' ? 'flex items-center' : 'flex flex-col'}
              `}
            >
              <div
                className={`
                relative
                ${layout === 'list' ? 'w-1/3' : 'w-full aspect-video'}
              `}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${catalog.thumbnailImage.filename}`}
                  alt={catalog.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div
                className={`
                p-4 flex flex-col
                ${layout === 'list' ? 'w-2/3' : 'w-full'}
              `}
              >
                <h3 className="text-xl font-semibold mb-2">{catalog.name}</h3>
                {catalog.category && (
                  <span className="text-sm text-gray-600 mb-2">{catalog.category}</span>
                )}
                {catalog.description && (
                  <p className="text-gray-700 mb-4 line-clamp-2">{catalog.description}</p>
                )}
                <a
                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/media/${catalog.pdfFile.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors mt-auto"
                  download
                >
                  ดาวน์โหลด PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
