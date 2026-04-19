import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_PORT = 3030

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const res = await fetch(`/api/message?XTransformPort=${GATEWAY_PORT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Failed to send message to OpenClaw' },
      { status: 500 }
    )
  }
}
