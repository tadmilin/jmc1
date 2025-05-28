import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ตรวจสอบว่าเป็น admin route หรือไม่
  if (pathname.startsWith('/admin')) {
    // เพิ่ม headers สำหรับ admin panel
    const response = NextResponse.next()

    // เพิ่ม security headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // เพิ่ม CORS headers สำหรับ admin panel
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_SERVER_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
  }

  // สำหรับ API routes
  if (pathname.startsWith('/api')) {
    const response = NextResponse.next()

    // เพิ่ม CORS headers สำหรับ API
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
