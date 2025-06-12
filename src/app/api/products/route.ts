import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const depth = parseInt(searchParams.get('depth') || '1')
    const sort = searchParams.get('sort') || '-createdAt'

    // Build where conditions
    const where: any = {}

    // Status filter (always active)
    where.status = { equals: 'active' }

    // Search by title
    const titleSearch = searchParams.get('where[title][contains]')
    if (titleSearch) {
      where.title = { contains: titleSearch }
    }

    // Category filter
    const categoryFilter = searchParams.get('where[categories][in]')
    if (categoryFilter) {
      where.categories = { in: [categoryFilter] }
    }

    // Sale products filter
    const saleFilter = searchParams.get('sale')
    if (saleFilter === 'true') {
      where.and = [
        { salePrice: { exists: true } },
        { price: { exists: true } },
        { salePrice: { greater_than: 0 } },
      ]
    }

    // Featured filter
    const featuredFilter = searchParams.get('featured')
    if (featuredFilter === 'true') {
      where.featured = { equals: true }
    }

    console.log('Products API Query:', {
      limit,
      page,
      where,
      sort,
    })

    const result = await payload.find({
      collection: 'products',
      where,
      limit,
      page,
      depth,
      sort: [sort],
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 