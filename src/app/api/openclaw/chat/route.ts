import { NextRequest, NextResponse } from 'next/server'
import { getRateLimitResponse } from '@/lib/api-auth'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function POST(req: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(req, 20, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const body = await req.json()
    const { model, messages, tools, stream } = body

    const response = await fetch(`${GATEWAY_URL}/api/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'openclaw/default',
        messages,
        tools: tools || [],
        stream: stream || false,
      }),
      signal: AbortSignal.timeout(30000),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Chat completion gagal', message },
      { status: 500 }
    )
  }
}
