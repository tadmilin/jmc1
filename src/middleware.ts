import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Get the origin for CORS
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    'https://jmc111.vercel.app',
    'https://jmc111-git-main-tadmilins-projects.vercel.app',
    ...(process.env.NODE_ENV === 'development' ? [
      'http://localhost:3000',
      'http://localhost:3001'
    ] : [])
  ]

  // Set CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (process.env.NODE_ENV === 'development') {
    response.headers.set('Access-Control-Allow-Origin', '*')
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: response.headers })
  }

  // Admin route handling
  if (pathname.startsWith('/admin')) {
    // Security headers for admin
    response.headers.set('X-Frame-Options', 'SAMEORIGIN')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
    
    // Log admin access for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Admin route accessed: ${pathname}`)
      console.log(`🌐 Origin: ${origin}`)
      console.log(`🍪 Cookies: ${request.headers.get('cookie') ? 'Present' : 'None'}`)
    }
  }

  // API route handling
  if (pathname.startsWith('/api')) {
    // Add additional headers for API routes
    response.headers.set('Cache-Control', 'no-cache')
    
    // Debug API calls in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔌 API route accessed: ${pathname}`)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 