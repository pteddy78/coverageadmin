import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting map: IP -> { count: number, timestamp: number }
const rateLimit = new Map()

// Rate limit settings
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 100 // Maximum requests per minute

export async function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  // Basic rate limiting
  const ip = request.ip ?? 'anonymous'
  const now = Date.now()
  const rateLimitInfo = rateLimit.get(ip) ?? { count: 0, timestamp: now }

  // Reset count if outside window
  if (now - rateLimitInfo.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitInfo.count = 0
    rateLimitInfo.timestamp = now
  }

  if (rateLimitInfo.count >= MAX_REQUESTS) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  rateLimitInfo.count++
  rateLimit.set(ip, rateLimitInfo)

  // Add security headers
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}
