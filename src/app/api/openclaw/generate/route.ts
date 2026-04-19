import { NextRequest, NextResponse } from 'next/server'
import { getRateLimitResponse } from '@/lib/api-auth'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function POST(req: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(req, 10, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const body = await req.json()
    const { type, prompt, model } = body

    if (!type || !prompt) {
      return NextResponse.json(
        { error: 'Field diperlukan: type, prompt' },
        { status: 400 }
      )
    }

    if (!['image', 'video', 'music'].includes(type)) {
      return NextResponse.json(
        { error: 'Type tidak sah. Mesti: image, video, atau music' },
        { status: 400 }
      )
    }

    const response = await fetch(`${GATEWAY_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, prompt, model }),
      signal: AbortSignal.timeout(30000),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Penjanaan gagal', message },
      { status: 500 }
    )
  }
}
