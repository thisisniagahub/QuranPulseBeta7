import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text, voice, speed } = await req.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Teks diperlukan' },
        { status: 400 }
      )
    }

    if (text.length > 1024) {
      return NextResponse.json(
        { error: 'Teks terlalu panjang (maksimum 1024 aksara)' },
        { status: 400 }
      )
    }

    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()

    const response = await zai.audio.tts.create({
      input: text.trim(),
      voice: voice || 'tongtong',
      speed: speed || 1.0,
      response_format: 'mp3',
      stream: false,
    })

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(new Uint8Array(arrayBuffer))

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('TTS API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal menjana audio' },
      { status: 500 }
    )
  }
}
