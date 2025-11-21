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
      referer.includes(host) ||
      referer.includes('localhost:3000') ||
      referer.includes(process.env.NEXT_PUBLIC_SERVER_URL || '') ||
      (!referer && !origin) ||
      (!!origin && (origin.includes(host) || origin.includes('localhost:3000')))

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

    // Restrict to active products only
    where.status = { equals: 'active' }

    // Fetch products
    const products = await payload.find({
      collection: 'products',
      where,
      limit,
      page,
      depth,
      sort: sort.split(','),
      overrideAccess: true, // Use internal access since we handle auth above
    })

    // Filter response fields for security
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredDocs = products.docs.map((product: any) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice, // เพิ่ม salePrice สำหรับสินค้าลดราคา
      variants: product.variants, // เพิ่ม variants สำหรับตัวเลือกสินค้า
      images: product.images,
      shortDescription: product.shortDescription,
      categories: product.categories,
      status: product.status,
      _status: product._status,
    }))

    return NextResponse.json({
      ...products,
      docs: filteredDocs,
    })
  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
