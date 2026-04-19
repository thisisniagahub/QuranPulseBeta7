import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_PORT = 3030

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, prompt, model } = body

    if (!type || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: type, prompt' },
        { status: 400 }
      )
    }

    if (!['image', 'video', 'music'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be: image, video, or music' },
        { status: 400 }
      )
    }

    const response = await fetch(`/api/generate?XTransformPort=${GATEWAY_PORT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, prompt, model }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Generation failed', message: error.message },
      { status: 500 }
    )
  }
}
