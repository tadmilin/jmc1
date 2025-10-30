import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    // Check API key OR internal request
    const apiKey = request.headers.get('x-api-key')
    const referer = request.headers.get('referer') || ''
    const host = request.headers.get('host') || ''

    // Allow internal requests (from same domain) OR valid API key
    const isInternalRequest =
      referer.includes(host) ||
      referer.includes('localhost:3000') ||
      referer.includes(process.env.NEXT_PUBLIC_SERVER_URL || '')

    if (!apiKey && !isInternalRequest) {
      return NextResponse.json(
        { error: 'Unauthorized: External requests require API key' },
        { status: 401 },
      )
    }

    if (apiKey && apiKey !== process.env.PRIVATE_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized: Invalid API key' }, { status: 401 })
    }

    // Get Payload instance
    const payload = await getPayload({ config })

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const depth = parseInt(searchParams.get('depth') || '1')
    const sort = searchParams.get('sort') || '-createdAt'

    // Build where clause from query parameters
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}

    // Handle various where conditions
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('where[') && key.endsWith(']')) {
        const field = key.slice(6, -1)
        if (field.includes('[') && field.includes(']')) {
          // Handle nested conditions like where[categories][in]
          const parts = field.split(/[[\]]/).filter(Boolean)
          if (parts.length === 2) {
            const [fieldName, operator] = parts
            if (fieldName && operator) {
              if (!where[fieldName]) where[fieldName] = {}
              where[fieldName][operator] = value.split(',')
            }
          }
        } else {
          where[field] = value
        }
      }
    }

    // Restrict to published posts only
    where._status = { equals: 'published' }

    // Fetch posts
    const posts = await payload.find({
      collection: 'posts',
      where,
      limit,
      page,
      depth,
      sort: sort.split(','),
      overrideAccess: true, // Use internal access since we handle auth above
    })

    // For API key access, filter response fields
    if (apiKey) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredDocs = posts.docs.map((post: any) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        categories: post.categories,
        meta: post.meta,
        _status: post._status,
      }))

      return NextResponse.json({
        docs: filteredDocs,
        totalDocs: posts.totalDocs,
        limit: posts.limit,
        totalPages: posts.totalPages,
        page: posts.page,
        pagingCounter: posts.pagingCounter,
        hasPrevPage: posts.hasPrevPage,
        hasNextPage: posts.hasNextPage,
        prevPage: posts.prevPage,
        nextPage: posts.nextPage,
      })
    }

    // For admin access, return full data
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error in posts API:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
