import { NextResponse } from 'next/server'

const GATEWAY_PORT = 3030

export async function GET() {
  try {
    const res = await fetch(`/api/cron?XTransformPort=${GATEWAY_PORT}`, {
      signal: AbortSignal.timeout(5000),
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch cron jobs' },
      { status: 503 }
    )
  }
}
