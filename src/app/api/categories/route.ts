import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    
    const limit = parseInt(searchParams.get('limit') || '100')
    const depth = parseInt(searchParams.get('depth') || '0')
    
    console.log('Direct Categories API called:', { limit, depth })
    
    const result = await payload.find({
      collection: 'categories',
      limit,
      depth,
      sort: 'title',
    })

    console.log('Direct Categories API success:', result.totalDocs, 'categories found')
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Direct Categories API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories',
        details: error instanceof Error ? error.message : String(error),
        docs: [],
        totalDocs: 0,
        totalPages: 0,
      },
      { status: 500 }
    )
  }
} 