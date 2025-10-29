import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ข้าม admin routes ทั้งหมด - ให้ Payload จัดการเอง
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Force server-side rendering for pages with server components
  if (pathname.startsWith('/catalogs')) {
    const response = NextResponse.next()
    response.headers.set('x-middleware-next', '1')
    return response
  }

  const response = NextResponse.next()

  // จัดการเฉพาะ API routes
  if (pathname.startsWith('/api')) {
    // ป้องกัน sensitive API endpoints จาก external access
    if (
      pathname.startsWith('/api/admin-status') ||
      pathname.startsWith('/api/health') ||
      pathname.startsWith('/api/env-check')
    ) {
      const referer = request.headers.get('referer')
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

      // บล็อกถ้าไม่ได้มาจาก admin panel หรือไม่มี authentication
      if (
        !referer?.startsWith(serverURL + '/admin') &&
        !request.headers.get('cookie')?.includes('payload-token')
      ) {
        return new NextResponse('Not Found', { status: 404 })
      }
    }

    // Get the origin for CORS
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      'https://jmc111.vercel.app',
      'https://jmc111-git-main-tadmilins-projects.vercel.app',
      ...(process.env.NODE_ENV === 'development'
        ? ['http://localhost:3000', 'http://localhost:3001']
        : []),
    ]

    // Set CORS headers
    if (process.env.NODE_ENV === 'production') {
      if (origin && allowedOrigins.includes(origin)) {
        response.headers.set('Access-Control-Allow-Origin', origin)
      }
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*')
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    )
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }

    response.headers.set('Cache-Control', 'no-cache')
  }

  return response
}

export const config = {
  matcher: [
    // เฉพาะ API routes เท่านั้น
    '/api/:path*',
  ],
}
