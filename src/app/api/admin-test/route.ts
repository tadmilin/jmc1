import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  let payload
  try {
    payload = await getPayload({ config })

    // ทดสอบการเข้าถึง admin config
    const adminConfig = payload.config.admin

    return NextResponse.json({
      status: 'OK',
      admin: {
        user: adminConfig?.user,
        meta: adminConfig?.meta,
        hasComponents: !!adminConfig?.components,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Admin test error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
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
