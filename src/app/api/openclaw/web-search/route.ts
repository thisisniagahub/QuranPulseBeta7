import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function POST(req: NextRequest) {
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
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Carian web gagal', message: error.message },
      { status: 500 }
    )
  }
}
