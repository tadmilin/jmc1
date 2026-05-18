import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ข้าม admin routes ทั้งหมด - ให้ Payload จัดการเอง
  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const response = NextResponse.next()

  if (!pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    response.headers.set('Vary', 'Accept-Encoding')
  }

  // Force server-side rendering for catalogs page
  if (pathname.startsWith('/catalogs')) {
    response.headers.set('x-middleware-cache', 'no-cache')
  }

  // จัดการเฉพาะ API routes
  if (pathname.startsWith('/api')) {
    // /api/health — ต้องเปิด public เพื่อให้ Railway/load-balancer healthcheck เข้าถึงได้
    if (pathname === '/api/health') {
      return NextResponse.next()
    }

    // ป้องกัน sensitive API endpoints จาก external access
    if (
      pathname.startsWith('/api/admin-status') ||
      pathname.startsWith('/api/env-check')
    ) {
      const referer = request.headers.get('referer')
      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

      if (
        !referer?.startsWith(serverURL + '/admin') &&
        !request.headers.get('cookie')?.includes('payload-token')
      ) {
        return new NextResponse('Not Found', { status: 404 })
      }
    }

    // Get the origin for CORS
    const origin = request.headers.get('origin')
    const productionURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const allowedOrigins = [
      productionURL,
      ...(process.env.RAILWAY_PUBLIC_DOMAIN
        ? [`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`]
        : []),
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
    // ครอบคลุม frontend routes ทั้งหมด ยกเว้น static assets
    '/((?!_next/static|_next/image|favicon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
