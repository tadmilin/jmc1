import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/utils/getProducts'
import type { Where } from 'payload'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '12')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    // Build where clause
    const where: Where = {
      status: { equals: 'active' },
    }

    if (search) {
      where.title = { contains: search }
    }

    if (category && category !== 'all') {
      where.categories = { in: [category] }
    }

    // Get products using server-side function
    const result = await getProducts({
      limit,
      page,
      where,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching public products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
