import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  let payload
  try {
    payload = await getPayload({ config })

    // ทดสอบการเชื่อมต่อด้วยการ count users
    const userCount = await payload.count({
      collection: 'users',
    })

    return NextResponse.json({
      status: 'OK',
      database: 'Connected',
      userCount: userCount.totalDocs,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      {
        status: 'ERROR',
        database: 'Failed',
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
