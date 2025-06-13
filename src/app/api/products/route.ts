import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '8')
    const page = parseInt(searchParams.get('page') || '1')
    const depth = parseInt(searchParams.get('depth') || '1')
    
    // Build where conditions
    const where: any = {
      status: { equals: 'active' }
    }
    
    // Add search filter
    const searchTitle = searchParams.get('where[title][contains]')
    if (searchTitle) {
      where.title = { contains: searchTitle }
    }
    
    // Add category filter
    const categoryFilter = searchParams.get('where[categories][in]')
    if (categoryFilter) {
      where.categories = { in: [categoryFilter] }
    }
    
    // Add sale filter
    const showOnlyOnSale = searchParams.get('showOnlyOnSale')
    if (showOnlyOnSale === 'true') {
      where.salePrice = { greater_than: 0 }
    }
    
    // Add sorting
    let sort = '-createdAt' // default sort by newest
    const sortParam = searchParams.get('sort')
    if (sortParam) {
      sort = sortParam
    }

    console.log('Direct Products API called:', { limit, page, where, sort })
    
    const result = await payload.find({
      collection: 'products',
      where,
      limit,
      page,
      depth,
      sort,
    })

    console.log('Direct Products API success:', result.totalDocs, 'products found')
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Direct Products API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : String(error),
        docs: [],
        totalDocs: 0,
        totalPages: 0,
      },
      { status: 500 }
    )
  }
} 