import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // ทดสอบการเชื่อมต่อ database
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
      database: {
        connected: !!process.env.DATABASE_URI,
        userCount: users.totalDocs,
      },
      payload: {
        initialized: true,
        secret: !!process.env.PAYLOAD_SECRET,
      },
      vercel: {
        url: process.env.VERCEL_URL,
        region: process.env.VERCEL_REGION,
      },
    }

    return NextResponse.json(healthData, { status: 200 })
  } catch (error) {
    const errorData = {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : String(error),
      environment: process.env.NODE_ENV,
      serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
      database: {
        connected: !!process.env.DATABASE_URI,
      },
      payload: {
        initialized: false,
        secret: !!process.env.PAYLOAD_SECRET,
      },
    }

    return NextResponse.json(errorData, { status: 500 })
  }
} 