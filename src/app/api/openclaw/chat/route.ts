import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_PORT = 3030

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { model, messages, tools, stream } = body

    const response = await fetch(`/api/chat/completions?XTransformPort=${GATEWAY_PORT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'openclaw/default',
        messages,
        tools: tools || [],
        stream: stream || false,
      }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Chat completion failed', message: error.message },
      { status: 500 }
    )
  }
}
