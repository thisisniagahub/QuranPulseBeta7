import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function POST(request: NextRequest) {
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
