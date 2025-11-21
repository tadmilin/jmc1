'use client'

import React, { useEffect, useState } from 'react'

interface MediaItem {
  id: string
  alt: string
  filename?: string
  url?: string
  thumbnailURL?: string
  mimeType?: string
  sizes?: {
    thumbnail?: {
      url?: string
      filename?: string
    }
    card?: {
      url?: string
      filename?: string
    }
    feature?: {
      url?: string
      filename?: string
    }
  }
}

interface MediaResponse {
  docs: MediaItem[]
  totalDocs: number
}

export default function MediaTest() {
  const [mediaData, setMediaData] = useState<MediaResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/media?limit=3')
      .then((response) => response.json())
      .then((data) => {
        setMediaData(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!mediaData) return <div className="p-4">No data</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">PayloadCMS Media Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaData.docs.map((media) => (
          <div key={media.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-medium mb-2">{media.alt}</h3>

            {/* Test different URL approaches */}
            <div className="space-y-3">
              {/* Method 1: thumbnailURL (PayloadCMS generated) */}
              {media.thumbnailURL && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">thumbnailURL:</p>
                  <img
                    src={media.thumbnailURL}
                    alt={media.alt}
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling!.textContent = '❌ Failed to load'
                    }}
                  />
                  <p className="text-xs text-green-600 mt-1">✓ thumbnailURL works</p>
                </div>
              )}

              {/* Method 2: sizes.thumbnail.url */}
              {media.sizes?.thumbnail?.url && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">sizes.thumbnail.url:</p>
                  <img
                    src={`/api/media/file/${media.sizes.thumbnail.url.replace('media/', '')}`}
                    alt={media.alt}
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling!.textContent = '❌ Failed to load'
                    }}
                  />
                  <p className="text-xs text-blue-600 mt-1">✓ sizes.thumbnail works</p>
                </div>
              )}

              {/* Method 3: Direct filename */}
              {media.sizes?.thumbnail?.filename && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Direct filename:</p>
                  <img
                    src={`/api/media/file/${media.sizes.thumbnail.filename}`}
                    alt={media.alt}
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling!.textContent = '❌ Failed to load'
                    }}
                  />
                  <p className="text-xs text-purple-600 mt-1">✓ Direct filename works</p>
                </div>
              )}

              {/* Debug info */}
              <details className="mt-4">
                <summary className="text-xs cursor-pointer text-gray-500">Debug Info</summary>
                <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-auto">
                  {JSON.stringify(
                    {
                      filename: media.filename,
                      url: media.url,
                      thumbnailURL: media.thumbnailURL,
                      sizes: media.sizes,
                    },
                    null,
                    2,
                  )}
                </pre>
              </details>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        Total: {mediaData.totalDocs} media files
      </div>
    </div>
  )
}
