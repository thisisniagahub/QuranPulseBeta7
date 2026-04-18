import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { audioBase64 } = await req.json()

    if (!audioBase64 || typeof audioBase64 !== 'string') {
      return NextResponse.json(
        { error: 'Audio base64 diperlukan' },
        { status: 400 }
      )
    }

    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()

    const response = await zai.audio.asr.create({
      file_base64: audioBase64,
    })

    return NextResponse.json({
      success: true,
      text: response.text,
    })
  } catch (error) {
    console.error('ASR API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Gagal menranskrip audio',
      },
      { status: 500 }
    )
  }
}
