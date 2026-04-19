import { NextRequest, NextResponse } from 'next/server'
import { quranService } from '@/lib/quran-service'

export const dynamic = 'force-dynamic'

// GET /api/quran/surah?number=1&edition=quran-uthmani
// Fetch a complete surah with all ayahs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const numberParam = searchParams.get('number')
    const edition = searchParams.get('edition') || undefined

    if (!numberParam) {
      // If no number, return full surah list
      const surahList = await quranService.getSurahList()
      return NextResponse.json({
        success: true,
        data: surahList,
        cached: true,
      })
    }

    const surahNumber = parseInt(numberParam, 10)

    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { success: false, error: 'Surah number must be between 1 and 114' },
        { status: 400 }
      )
    }

    const result = await quranService.getSurah(surahNumber, edition)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch surah'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
