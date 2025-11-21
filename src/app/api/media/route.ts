import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    // Check API key OR internal request
    const apiKey = request.headers.get('x-api-key')
    const referer = request.headers.get('referer') || ''
    const host = request.headers.get('host') || ''
    const origin = request.headers.get('origin') || ''

    // Allow internal requests (from same domain) OR valid API key
    const isInternalRequest =
      // มี referer ภายในโดเมนเดียวกัน
      referer.includes(host) ||
      referer.includes('localhost:3000') ||
      referer.includes(process.env.NEXT_PUBLIC_SERVER_URL || '') ||
      // SSR หรือ fetch ภายในบางกรณีจะไม่มี Referer/Origin ให้ถือว่าเป็น internal
      (!referer && !origin) ||
      // อนุญาต origin เดียวกัน (เช่น เรียกจากหน้าเว็บเดียวกัน)
      (!!origin && (origin.includes(host) || origin.includes('localhost:3000')))

    if (!apiKey && !isInternalRequest) {
      return NextResponse.json(
        {
          error: 'API key required',
          message: 'กรุณาระบุ x-api-key ใน header',
        },
        { status: 401 },
      )
    }

    // Validate API key if provided
    const validApiKey = process.env.API_KEY
    if (apiKey && validApiKey && apiKey !== validApiKey) {
      return NextResponse.json(
        {
          error: 'Invalid API key',
          message: 'API key ไม่ถูกต้อง',
        },
        { status: 401 },
      )
    }

    const payload = await getPayload({ config })

    // Get query parameters
    const url = new URL(request.url)
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 100)
    const page = parseInt(url.searchParams.get('page') || '1')
    const sort = url.searchParams.get('sort') || '-createdAt'
    const search = url.searchParams.get('search') || ''

    // Build where clause for search
    let where = {}
    if (search) {
      where = {
        or: [
          {
            alt: {
              contains: search,
            },
          },
          {
            filename: {
              contains: search,
            },
          },
        ],
      }
    }

    // Fetch media with proper error handling
    const mediaData = await payload.find({
      collection: 'media',
      where,
      limit,
      page,
      sort,
      depth: 0, // Don't populate relations to avoid circular references
    })

    // Transform data to include full URLs
    const transformedDocs = mediaData.docs.map((media) => {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || `http://localhost:3000`

      // Helper function to create proper media URL
      const createMediaUrl = (path: string | null | undefined): string | null => {
        if (!path || path === 'undefined' || path === 'null') return null
        if (path.startsWith('http')) return path

        // Remove duplicate 'media/' prefix if exists
        const cleanPath = path.startsWith('media/') ? path.replace('media/', '') : path
        return `${baseUrl}/api/media/file/${cleanPath}`
      }

      return {
        ...media,
        // Add full URL using proper media endpoint
        fullUrl: media.url
          ? createMediaUrl(media.url)
          : media.filename
            ? createMediaUrl(media.filename)
            : null,
        // Use existing thumbnailURL if available (it's usually correct)
        displayUrl:
          media.thumbnailURL || createMediaUrl(media.url) || createMediaUrl(media.filename),
        // Add full URLs for different sizes
        sizes: media.sizes
          ? {
              ...media.sizes,
              thumbnail: media.sizes.thumbnail
                ? {
                    ...media.sizes.thumbnail,
                    fullUrl: createMediaUrl(
                      media.sizes.thumbnail.url || media.sizes.thumbnail.filename,
                    ),
                    displayUrl: createMediaUrl(
                      media.sizes.thumbnail.url || media.sizes.thumbnail.filename,
                    ),
                  }
                : undefined,
              card: media.sizes.card
                ? {
                    ...media.sizes.card,
                    fullUrl: createMediaUrl(media.sizes.card.url || media.sizes.card.filename),
                    displayUrl: createMediaUrl(media.sizes.card.url || media.sizes.card.filename),
                  }
                : undefined,
              feature: media.sizes.feature
                ? {
                    ...media.sizes.feature,
                    fullUrl: createMediaUrl(
                      media.sizes.feature.url || media.sizes.feature.filename,
                    ),
                    displayUrl: createMediaUrl(
                      media.sizes.feature.url || media.sizes.feature.filename,
                    ),
                  }
                : undefined,
            }
          : undefined,
      }
    })

    const response = {
      docs: transformedDocs,
      totalDocs: mediaData.totalDocs,
      limit: mediaData.limit,
      page: mediaData.page,
      totalPages: mediaData.totalPages,
      hasNextPage: mediaData.hasNextPage,
      hasPrevPage: mediaData.hasPrevPage,
      nextPage: mediaData.nextPage,
      prevPage: mediaData.prevPage,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Media API Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล Media',
      },
      { status: 500 },
    )
  }
}

// GET single media item by ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const media = await payload.findByID({
      collection: 'media',
      id,
      depth: 0,
    })

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Add full URLs
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || `http://localhost:3000`
    const transformedMedia = {
      ...media,
      fullUrl: media.url
        ? media.url.startsWith('http')
          ? media.url
          : `${baseUrl}${media.url}`
        : null,
      sizes: media.sizes
        ? {
            ...media.sizes,
            thumbnail: media.sizes.thumbnail
              ? {
                  ...media.sizes.thumbnail,
                  fullUrl: media.sizes.thumbnail.url
                    ? media.sizes.thumbnail.url.startsWith('http')
                      ? media.sizes.thumbnail.url
                      : `${baseUrl}${media.sizes.thumbnail.url}`
                    : null,
                }
              : undefined,
            card: media.sizes.card
              ? {
                  ...media.sizes.card,
                  fullUrl: media.sizes.card.url
                    ? media.sizes.card.url.startsWith('http')
                      ? media.sizes.card.url
                      : `${baseUrl}${media.sizes.card.url}`
                    : null,
                }
              : undefined,
            feature: media.sizes.feature
              ? {
                  ...media.sizes.feature,
                  fullUrl: media.sizes.feature.url
                    ? media.sizes.feature.url.startsWith('http')
                      ? media.sizes.feature.url
                      : `${baseUrl}${media.sizes.feature.url}`
                    : null,
                }
              : undefined,
          }
        : undefined,
    }

    return NextResponse.json(transformedMedia)
  } catch (error) {
    console.error('Media API Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล Media',
      },
      { status: 500 },
    )
  }
}
