import { NextRequest, NextResponse } from 'next/server'
import { getRateLimitResponse } from '@/lib/api-auth'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function POST(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 20, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const body = await request.json()
    const res = await fetch(`${GATEWAY_URL}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Gagal menghantar mesej ke OpenClaw' },
      { status: 500 }
    )
  }
}
