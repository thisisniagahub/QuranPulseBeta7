import { NextRequest, NextResponse } from 'next/server'
import { quranService } from '@/lib/quran-service'

export const dynamic = 'force-dynamic'

// GET /api/quran/tafsir?surah=1&ayah=1
// Get tafsir for an ayah
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const surahParam = searchParams.get('surah')
    const ayahParam = searchParams.get('ayah')

    if (!surahParam || !ayahParam) {
      return NextResponse.json(
        { success: false, error: 'Both "surah" and "ayah" parameters are required' },
        { status: 400 }
      )
    }

    const surah = parseInt(surahParam, 10)
    const ayah = parseInt(ayahParam, 10)

    if (isNaN(surah) || surah < 1 || surah > 114) {
      return NextResponse.json(
        { success: false, error: 'Surah must be between 1 and 114' },
        { status: 400 }
      )
    }

    if (isNaN(ayah) || ayah < 1) {
      return NextResponse.json(
        { success: false, error: 'Ayah must be a positive number' },
        { status: 400 }
      )
    }

    const tafsir = await quranService.getTafsir(surah, ayah)

    return NextResponse.json({
      success: true,
      data: tafsir,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tafsir'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
