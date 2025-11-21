'use client'

import React from 'react'
import { useMediaList, getMediaDisplayUrl, isImageMedia, isPdfMedia } from '@/hooks/useMedia'

interface MediaGalleryProps {
  limit?: number
  showPdf?: boolean
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ limit = 12, showPdf = false }) => {
  const {
    data: mediaData,
    isLoading,
    error,
  } = useMediaList({
    limit,
    sort: '-createdAt',
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">เกิดข้อผิดพลาด</h3>
        <p className="text-red-600 text-sm mt-1">
          ไม่สามารถโหลด Media ได้: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  if (!mediaData?.docs?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>ไม่พบไฟล์ Media</p>
      </div>
    )
  }

  // Filter based on type
  const filteredMedia = mediaData.docs.filter((media) => {
    if (showPdf) return true
    return isImageMedia(media)
  })

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Media Gallery</h2>
        <span className="text-sm text-gray-500">
          แสดง {filteredMedia.length} จาก {mediaData.totalDocs} ไฟล์
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((media) => {
          const displayUrl = getMediaDisplayUrl(media, 'card')

          return (
            <div
              key={media.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Media Display */}
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                {isImageMedia(media) && displayUrl ? (
                  <img
                    src={displayUrl}
                    alt={media.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', displayUrl)
                      e.currentTarget.src =
                        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlmYTZiNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuNGVtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+Cjwvc3ZnPg=='
                    }}
                  />
                ) : isPdfMedia(media) ? (
                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto text-red-500 mb-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs text-red-600">PDF</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto text-gray-400 mb-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">ไฟล์อื่นๆ</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Media Info */}
              <div className="p-3">
                <h3 className="font-medium text-sm text-gray-900 truncate" title={media.alt}>
                  {media.alt}
                </h3>
                <div className="mt-1 text-xs text-gray-500 space-y-1">
                  {media.mimeType && <p className="truncate">{media.mimeType}</p>}
                  {media.filesize && <p>{(media.filesize / 1024).toFixed(1)} KB</p>}
                  {media.width && media.height && (
                    <p>
                      {media.width} × {media.height}
                    </p>
                  )}
                </div>

                {/* Debug Info */}
                <div className="mt-2 text-xs text-gray-400">
                  <details className="cursor-pointer">
                    <summary>Debug URLs</summary>
                    <div className="mt-1 space-y-1 bg-gray-50 p-2 rounded text-xs">
                      <p>
                        <strong>displayUrl:</strong> {displayUrl || 'null'}
                      </p>
                      <p>
                        <strong>thumbnailURL:</strong> {media.thumbnailURL || 'null'}
                      </p>
                      <p>
                        <strong>url:</strong> {media.url || 'null'}
                      </p>
                      <p>
                        <strong>filename:</strong> {media.filename || 'null'}
                      </p>
                      {media.sizes?.card?.displayUrl && (
                        <p>
                          <strong>card.displayUrl:</strong> {media.sizes.card.displayUrl}
                        </p>
                      )}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination Info */}
      {mediaData.totalPages > 1 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          หน้า {mediaData.page} จาก {mediaData.totalPages}({mediaData.totalDocs} ไฟล์ทั้งหมด)
        </div>
      )}
    </div>
  )
}

export default MediaGallery
