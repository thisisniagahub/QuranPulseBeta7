import { NextRequest, NextResponse } from 'next/server'
import { getRateLimitResponse } from '@/lib/api-auth'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function POST(req: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(req, 15, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const body = await req.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query diperlukan untuk carian web' },
        { status: 400 }
      )
    }

    const response = await fetch(`${GATEWAY_URL}/api/web-search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Carian web gagal', message },
      { status: 500 }
    )
  }
}
