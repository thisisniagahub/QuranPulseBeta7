import { NextRequest, NextResponse } from 'next/server'
import { quranService } from '@/lib/quran-service'

export const dynamic = 'force-dynamic'

// GET /api/quran/search?q=bismillah&language=ar
// Search Quran - search Arabic text and translations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = searchParams.get('q')
    const language = (searchParams.get('language') as 'ar' | 'ms' | 'en') || 'ar'

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query parameter "q" is required' },
        { status: 400 }
      )
    }

    if (query.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Search query too long (max 200 characters)' },
        { status: 400 }
      )
    }

    const results = await quranService.searchQuran(query, language)

    return NextResponse.json({
      success: true,
      query,
      language,
      count: results.length,
      data: results,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Search failed'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
