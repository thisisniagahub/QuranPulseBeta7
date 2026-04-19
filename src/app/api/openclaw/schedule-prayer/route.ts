import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_PORT = 3030

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prayerName, time, channel } = body

    if (!prayerName || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: prayerName, time' },
        { status: 400 }
      )
    }

    const response = await fetch(`/api/schedule-prayer?XTransformPort=${GATEWAY_PORT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prayerName, time, channel }),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Prayer scheduling failed', message: error.message },
      { status: 500 }
    )
  }
}
