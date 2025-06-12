import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '100')
    const page = parseInt(searchParams.get('page') || '1')
    const depth = parseInt(searchParams.get('depth') || '0')
    const sort = searchParams.get('sort') || 'title'

    console.log('Categories API Query:', {
      limit,
      page,
      depth,
      sort,
    })

    const result = await payload.find({
      collection: 'categories',
      limit,
      page,
      depth,
      sort: [sort],
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Categories API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
} 