import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: NextRequest) {
  try {
    // Get Payload instance
    const payload = await getPayload({ config })

    // Check authentication - same as products API
    const apiKey = request.headers.get('x-api-key')
    let isAuthorized = false
    let isAdmin = false

    // Check admin authentication first
    try {
      const { user } = await payload.auth({ headers: request.headers })
      if (user?.role === 'admin') {
        isAuthorized = true
        isAdmin = true
      }
    } catch (_authError) {
      // Authentication failed, continue to check API key
    }

    // If not admin, check API key
    if (!isAuthorized && apiKey === process.env.PRIVATE_API_KEY) {
      isAuthorized = true
    }

    // Deny access if neither authentication method worked
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin login or valid API key required' },
        { status: 401 },
      )
    }

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
        const field = key.slice(6, -1) // Remove 'where[' and ']'

        // Handle nested conditions like where[status][equals]
        if (field.includes('][')) {
          const [fieldName, operator] = field.split('][')
          if (fieldName && operator) {
            if (!where[fieldName]) where[fieldName] = {}
            where[fieldName][operator] = value
          }
        } else {
          where[field] = value
        }
      }
    }

    // For non-admin access, restrict to published categories only
    if (!isAdmin) {
      where._status = { equals: 'published' }
    }

    // Fetch categories
    const categories = await payload.find({
      collection: 'categories',
      where,
      limit,
      page,
      depth,
      sort: sort.split(','),
      overrideAccess: true, // Use internal access since we handle auth above
    })

    // For API key access, filter response fields
    if (!isAdmin && apiKey) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filteredDocs = categories.docs.map((category: any) => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
        description: category.description,
        image: category.image,
        _status: category._status,
      }))

      return NextResponse.json({
        ...categories,
        docs: filteredDocs,
      })
    }

    // Return full data for admin users
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error in categories API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
