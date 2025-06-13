import { NextResponse } from 'next/server'

export async function GET() {
  // ตรวจสอบ environment variables โดยไม่เปิดเผยค่าจริง
  const envCheck = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      NEXT_PUBLIC_SERVER_URL: {
        set: !!process.env.NEXT_PUBLIC_SERVER_URL,
        value: process.env.NEXT_PUBLIC_SERVER_URL || 'NOT_SET',
      },
      DATABASE_URI: {
        set: !!process.env.DATABASE_URI,
        starts_with: process.env.DATABASE_URI ? process.env.DATABASE_URI.substring(0, 20) + '...' : 'NOT_SET',
      },
      PAYLOAD_SECRET: {
        set: !!process.env.PAYLOAD_SECRET,
        length: process.env.PAYLOAD_SECRET ? process.env.PAYLOAD_SECRET.length : 0,
      },
      CRON_SECRET: {
        set: !!process.env.CRON_SECRET,
        length: process.env.CRON_SECRET ? process.env.CRON_SECRET.length : 0,
      },
      VERCEL_URL: {
        set: !!process.env.VERCEL_URL,
        value: process.env.VERCEL_URL || 'NOT_SET',
      },
    },
    missing_vars: [],
  }

  // ตรวจสอบตัวแปรที่หายไป
  const requiredVars = ['NEXT_PUBLIC_SERVER_URL', 'DATABASE_URI', 'PAYLOAD_SECRET']
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      envCheck.missing_vars.push(varName)
    }
  }

  const status = envCheck.missing_vars.length === 0 ? 'OK' : 'MISSING_VARS'
  
  return NextResponse.json({
    status,
    ...envCheck
  })
} 