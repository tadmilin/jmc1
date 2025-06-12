import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers })
  }

  // Log admin route access for debugging
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log(`🔐 Admin route accessed: ${request.nextUrl.pathname}`)
    console.log(`🌐 Origin: ${request.headers.get('origin')}`)
    console.log(`🍪 Cookies: ${request.headers.get('cookie') ? 'Present' : 'None'}`)
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
} 