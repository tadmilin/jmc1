import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Simple health check ไม่ต้องเชื่อมต่อ payload
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
        payloadSecret: !!process.env.PAYLOAD_SECRET,
        databaseURI: !!process.env.DATABASE_URI,
        vercelUrl: process.env.VERCEL_URL,
        cronSecret: !!process.env.CRON_SECRET,
      },
      routes: {
        admin: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin`,
        api: `${process.env.NEXT_PUBLIC_SERVER_URL}/api`,
        debug: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/debug`,
      }
    }

    return NextResponse.json(health)
  } catch (error) {
    console.error('Health Check Error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Health check failed',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
} 