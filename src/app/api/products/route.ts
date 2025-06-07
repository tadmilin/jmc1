import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit')) || 10
    const depth = Number(searchParams.get('depth')) || 1
    const whereParam = searchParams.get('where')

    let whereCondition
    try {
      whereCondition = whereParam ? JSON.parse(whereParam) : undefined
    } catch (parseError) {
      console.error('Invalid where parameter:', whereParam)
      return new Response(
        JSON.stringify({
          error: 'Invalid where parameter format',
          details: parseError instanceof Error ? parseError.message : 'JSON parse error',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    const payload = await getPayload({ config: configPromise })

    const query = {
      collection: 'products' as const,
      limit,
      depth,
      where: whereCondition,
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
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('Invalid collection')) {
        return new Response(
          JSON.stringify({
            error: 'Collection not found',
            details: error.message,
          }),
          {
            status: 404,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
      }
      
      if (error.message.includes('Authentication')) {
        return new Response(
          JSON.stringify({
            error: 'Authentication required',
            details: error.message,
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
      }
    }

    // Generic error response
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unknown error occurred',
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
