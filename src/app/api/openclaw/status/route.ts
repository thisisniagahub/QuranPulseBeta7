import { NextRequest, NextResponse } from 'next/server'
import { getRateLimitResponse } from '@/lib/api-auth'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function GET(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 60, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const res = await fetch(`${GATEWAY_URL}/health`, {
      signal: AbortSignal.timeout(5000),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { status: 'offline', error: 'OpenClaw Gateway tidak dapat diakses', openclawReachable: false },
      { status: 503 }
    )
  }
}
