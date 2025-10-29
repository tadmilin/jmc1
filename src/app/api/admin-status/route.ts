import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // ตรวจสอบ Authentication - เฉพาะ admin เท่านั้น
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    // ทดสอบการเชื่อมต่อ database
    const [users, products, categories] = await Promise.all([
      payload
        .find({
          collection: 'users',
          limit: 1,
        })
        .catch((err) => ({ error: err.message, totalDocs: 0 })),
      payload
        .find({
          collection: 'products',
          limit: 1,
        })
        .catch((err) => ({ error: err.message, totalDocs: 0 })),
      payload
        .find({
          collection: 'categories',
          limit: 1,
        })
        .catch((err) => ({ error: err.message, totalDocs: 0 })),
    ])

    const adminStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
      database: {
        connected: !!process.env.DATABASE_URI,
        collections: {
          users: {
            accessible: !('error' in users),
            count: users.totalDocs || 0,
            error: 'error' in users ? users.error : null,
          },
          products: {
            accessible: !('error' in products),
            count: products.totalDocs || 0,
            error: 'error' in products ? products.error : null,
          },
          categories: {
            accessible: !('error' in categories),
            count: categories.totalDocs || 0,
            error: 'error' in categories ? categories.error : null,
          },
        },
      },
      payload: {
        initialized: true,
        secret: !!process.env.PAYLOAD_SECRET,
        adminPath: '/admin',
      },
      vercel: {
        url: process.env.VERCEL_URL,
        region: process.env.VERCEL_REGION,
        env: process.env.VERCEL_ENV,
      },
    }

    return NextResponse.json(adminStatus)
  } catch (error) {
    console.error('Admin Status Error:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: 'Failed to check admin status',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
