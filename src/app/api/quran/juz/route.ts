import { NextRequest, NextResponse } from 'next/server'
import { quranService } from '@/lib/quran-service'

export const dynamic = 'force-dynamic'

// GET /api/quran/juz?number=1
// Fetch juz data with all ayahs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const numberParam = searchParams.get('number')

    if (!numberParam) {
      // If no number, return full juz list
      const juzList = await quranService.getJuzList()
      return NextResponse.json({
        success: true,
        data: juzList,
      })
    }

    const juzNumber = parseInt(numberParam, 10)

    if (isNaN(juzNumber) || juzNumber < 1 || juzNumber > 30) {
      return NextResponse.json(
        { success: false, error: 'Juz number must be between 1 and 30' },
        { status: 400 }
      )
    }

    const result = await quranService.getJuz(juzNumber)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch juz'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
