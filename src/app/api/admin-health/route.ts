import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  let payload
  try {
    // ทดสอบการเชื่อมต่อ Payload
    payload = await getPayload({ config })

    // ตรวจสอบการตั้งค่า admin
    const adminConfig = payload.config.admin
    const serverURL = payload.config.serverURL || process.env.NEXT_PUBLIC_SERVER_URL

    // ทดสอบการเชื่อมต่อฐานข้อมูล
    const dbStatus = payload.db ? 'connected' : 'disconnected'

    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      admin: {
        enabled: !!adminConfig,
        user: adminConfig?.user,
        routes: adminConfig?.routes,
        serverURL,
      },
      database: {
        status: dbStatus,
        type: 'mongodb',
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        payloadSecret: !!process.env.PAYLOAD_SECRET,
        databaseUri: !!process.env.DATABASE_URI,
      },
      routes: {
        admin: '/admin',
        api: '/api',
      },
    })
  } catch (error) {
    console.error('Admin health check error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  } finally {
    // ปิด connections
    if (payload?.db?.connection) {
      try {
        await payload.db.connection.close()
      } catch (closeError) {
        console.error('Error closing connection:', closeError)
      }
    }
  }
}
