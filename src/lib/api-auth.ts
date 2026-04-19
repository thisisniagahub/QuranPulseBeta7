import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from './rate-limit'

/**
 * Check rate limit for an incoming API request.
 *
 * Extracts the client IP from proxy headers (behind Caddy) or falls back
 * to 'unknown', then checks against the sliding window rate limiter.
 *
 * @param request  The incoming NextRequest
 * @param limit    Max requests allowed in the window (default: 30)
 * @param windowMs Window duration in ms (default: 60000 = 1 minute)
 * @returns        A NextResponse with 429 if rate-limited, or null if OK
 */
export function getRateLimitResponse(
  request: NextRequest,
  limit = 30,
  windowMs = 60000
): NextResponse | null {
  // Get IP from headers (behind Caddy proxy) or fallback
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'

  const result = rateLimit(ip, limit, windowMs)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.resetAt),
        },
      }
    )
  }

  return null // No rate limit hit, continue
}
