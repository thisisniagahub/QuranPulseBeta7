import { NextResponse } from 'next/server'

const GATEWAY_PORT = 3030

export async function GET() {
  try {
    const res = await fetch(`http://localhost:${GATEWAY_PORT}/health`, {
      signal: AbortSignal.timeout(5000),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { status: 'offline', error: 'OpenClaw Gateway not reachable', openclawReachable: false },
      { status: 503 }
    )
  }
}
