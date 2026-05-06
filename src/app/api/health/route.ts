import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: {
      node: process.version,
      nodeEnv: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URI,
      hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
    },
  }

  return NextResponse.json(health, { status: 200 })
}
