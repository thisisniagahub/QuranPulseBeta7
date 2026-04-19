import { NextResponse } from 'next/server'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function GET() {
  try {
    const res = await fetch(`${GATEWAY_URL}/api/sessions`, {
      signal: AbortSignal.timeout(5000),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Gagal mendapatkan sesi', sessions: [] },
      { status: 503 }
    )
  }
}
