import { NextRequest, NextResponse } from 'next/server'
import { getRateLimitResponse } from '@/lib/api-auth'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function GET(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const response = await fetch(`${GATEWAY_URL}/api/models`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'OpenClaw Gateway tidak dapat diakses', models: [], message },
      { status: 503 }
    )
  }
}
