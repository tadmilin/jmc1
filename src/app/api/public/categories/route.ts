import { NextRequest, NextResponse } from 'next/server'
import { getCategories } from '@/utils/getCategories'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '100')
    const page = parseInt(searchParams.get('page') || '1')

    // Get categories using server-side function
    const result = await getCategories({
      limit,
      page,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching public categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}
