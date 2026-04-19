import { NextResponse } from 'next/server'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function GET() {
  try {
    const response = await fetch(`${GATEWAY_URL}/api/models`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'OpenClaw Gateway tidak dapat diakses', models: [], message: error.message },
      { status: 503 }
    )
  }
}
