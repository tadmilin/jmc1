import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 10
    const depth = Number(searchParams.get('depth')) || 1
    const whereParam = searchParams.get('where')

    const payload = await getPayload({ config: configPromise })

    const query = {
      collection: 'products',
      limit,
      depth,
      where: whereParam ? JSON.parse(whereParam) : undefined,
    }

    console.log('Products API Query:', JSON.stringify(query, null, 2))

    const result = await payload.find(query)

    console.log('Products API Result:', {
      totalDocs: result.totalDocs,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
    })

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Products API Error:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
