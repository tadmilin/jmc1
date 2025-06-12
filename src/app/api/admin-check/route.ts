import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // ตรวจสอบการเชื่อมต่อ database
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    const adminCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      admin: {
        accessible: true,
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin`,
        userCollection: users.totalDocs > 0,
        totalUsers: users.totalDocs,
      },
      database: {
        connected: true,
        uri: process.env.DATABASE_URI ? 'configured' : 'missing',
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        serverUrl: process.env.NEXT_PUBLIC_SERVER_URL,
        payloadSecret: !!process.env.PAYLOAD_SECRET,
        vercelUrl: process.env.VERCEL_URL,
      },
    }

    return NextResponse.json(adminCheck)
  } catch (error) {
    console.error('Admin Check Error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Failed to check admin status',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
} 