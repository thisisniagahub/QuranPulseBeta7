import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_PORT = 3030

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 }
      )
    }

    const response = await fetch(`/api/web-search?XTransformPort=${GATEWAY_PORT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Web search failed', message: error.message },
      { status: 500 }
    )
  }
}
