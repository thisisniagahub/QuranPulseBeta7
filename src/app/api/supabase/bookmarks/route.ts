import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { getRateLimitResponse } from '@/lib/api-auth'

// GET /api/supabase/bookmarks?type=verses|surahs
export async function GET(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const type = request.nextUrl.searchParams.get('type') || 'verses'
    const table = type === 'surahs' ? 'bookmarked_surahs' : 'bookmarked_verses'

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookmarks: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/supabase/bookmarks — Add bookmark
export async function POST(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const body = await request.json()
    const { type, surah_id, verse_number } = body

    if (!type || !surah_id) {
      return NextResponse.json({ error: 'type, surah_id are required' }, { status: 400 })
    }

    if (type === 'verses') {
      if (!verse_number) {
        return NextResponse.json({ error: 'verse_number is required for verse bookmarks' }, { status: 400 })
      }
      const { data, error } = await supabase
        .from('bookmarked_verses')
        .insert({ user_id: user.id, surah_id, verse_number })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Already bookmarked' }, { status: 409 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ bookmark: data })
    } else {
      const { data, error } = await supabase
        .from('bookmarked_surahs')
        .insert({ user_id: user.id, surah_id })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Already bookmarked' }, { status: 409 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ bookmark: data })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/supabase/bookmarks — Remove bookmark
export async function DELETE(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const body = await request.json()
    const { type, surah_id, verse_number } = body

    if (!type || !surah_id) {
      return NextResponse.json({ error: 'type, surah_id are required' }, { status: 400 })
    }

    if (type === 'verses') {
      const { error } = await supabase
        .from('bookmarked_verses')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_id', surah_id)
        .eq('verse_number', verse_number)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else {
      const { error } = await supabase
        .from('bookmarked_surahs')
        .delete()
        .eq('user_id', user.id)
        .eq('surah_id', surah_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
