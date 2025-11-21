import { useQuery } from '@tanstack/react-query'

interface MediaItem {
  id: string
  alt: string
  filename?: string
  url?: string
  thumbnailURL?: string
  fullUrl?: string | null
  displayUrl?: string | null
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
  createdAt: string
  updatedAt: string
  sizes?: {
    thumbnail?: {
      url?: string
      fullUrl?: string | null
      displayUrl?: string | null
      width?: number
      height?: number
      filename?: string
    }
    card?: {
      url?: string
      fullUrl?: string | null
      displayUrl?: string | null
      width?: number
      height?: number
      filename?: string
    }
    feature?: {
      url?: string
      fullUrl?: string | null
      displayUrl?: string | null
      width?: number
      height?: number
      filename?: string
    }
  }
}

interface MediaResponse {
  docs: MediaItem[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage?: number | null
  prevPage?: number | null
}

interface MediaQueryParams {
  limit?: number
  page?: number
  search?: string
  sort?: string
}

type MediaSingleResponse = MediaItem

export const useMediaList = (params: MediaQueryParams = {}) => {
  const { limit = 20, page = 1, search, sort = '-createdAt' } = params

  const queryString = new URLSearchParams({
    limit: limit.toString(),
    page: page.toString(),
    sort,
    ...(search && { search }),
  }).toString()

  return useQuery<MediaResponse>({
    queryKey: ['media', queryString],
    queryFn: async () => {
      const response = await fetch(`/api/media?${queryString}`, {
        headers: {
          'Content-Type': 'application/json',
          // Include API key if needed for external requests
          ...(process.env.NEXT_PUBLIC_API_KEY && {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          }),
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useMediaItem = (id: string) => {
  return useQuery<MediaSingleResponse>({
    queryKey: ['media', id],
    queryFn: async () => {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.NEXT_PUBLIC_API_KEY && {
            'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
          }),
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}

// Helper function to get the best image URL for display
export const getMediaDisplayUrl = (
  media: MediaItem | null,
  preferredSize: 'thumbnail' | 'card' | 'feature' = 'card',
): string | null => {
  if (!media) return null

  // Try preferred size first
  if (media.sizes?.[preferredSize]?.displayUrl) {
    return media.sizes[preferredSize].displayUrl
  }

  // Fallback to thumbnailURL (usually works)
  if (media.thumbnailURL) {
    return media.thumbnailURL
  }

  // Fallback to displayUrl or fullUrl
  if (media.displayUrl) {
    return media.displayUrl
  }

  if (media.fullUrl) {
    return media.fullUrl
  }

  // Try any available size
  if (media.sizes) {
    const availableSizes = ['feature', 'card', 'thumbnail'] as const
    for (const size of availableSizes) {
      if (media.sizes[size]?.displayUrl) {
        return media.sizes[size].displayUrl
      }
    }
  }

  return null
}

// Type guards
export const isImageMedia = (media: MediaItem): boolean => {
  return media.mimeType?.startsWith('image/') ?? false
}

export const isPdfMedia = (media: MediaItem): boolean => {
  return media.mimeType === 'application/pdf'
}

export const isVideoMedia = (media: MediaItem): boolean => {
  return media.mimeType?.startsWith('video/') ?? false
}

// Export types
export type { MediaItem, MediaResponse, MediaQueryParams, MediaSingleResponse }
