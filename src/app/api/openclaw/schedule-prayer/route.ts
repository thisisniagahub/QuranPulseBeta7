import { NextRequest, NextResponse } from 'next/server'

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3030'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { prayerName, time, channel } = body

    if (!prayerName || !time) {
      return NextResponse.json(
        { error: 'Field diperlukan: prayerName, time' },
        { status: 400 }
      )
    }

    const response = await fetch(`${GATEWAY_URL}/api/schedule-prayer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prayerName, time, channel }),
      signal: AbortSignal.timeout(10000),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Penjadualan solat gagal', message: error.message },
      { status: 500 }
    )
  }
}
