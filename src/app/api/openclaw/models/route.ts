import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_PORT = 3030

export async function GET() {
  try {
    const response = await fetch(`/api/models?XTransformPort=${GATEWAY_PORT}`, {
      headers: { 'Accept': 'application/json' },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch models', message: error.message },
      { status: 503 }
    )
  }
}
