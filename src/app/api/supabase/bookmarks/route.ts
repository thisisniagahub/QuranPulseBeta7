import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

// GET /api/supabase/bookmarks?user_id=xxx&type=verses|surahs
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')
    const type = request.nextUrl.searchParams.get('type') || 'verses'

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const table = type === 'surahs' ? 'bookmarked_surahs' : 'bookmarked_verses'

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ bookmarks: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/supabase/bookmarks — Add bookmark
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, type, surah_id, verse_number } = body

    if (!user_id || !type || !surah_id) {
      return NextResponse.json({ error: 'user_id, type, surah_id are required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()

    if (type === 'verses') {
      if (!verse_number) {
        return NextResponse.json({ error: 'verse_number is required for verse bookmarks' }, { status: 400 })
      }
      const { data, error } = await supabase
        .from('bookmarked_verses')
        .insert({ user_id, surah_id, verse_number })
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
        .insert({ user_id, surah_id })
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE /api/supabase/bookmarks — Remove bookmark
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, type, surah_id, verse_number } = body

    if (!user_id || !type || !surah_id) {
      return NextResponse.json({ error: 'user_id, type, surah_id are required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()

    if (type === 'verses') {
      const { error } = await supabase
        .from('bookmarked_verses')
        .delete()
        .eq('user_id', user_id)
        .eq('surah_id', surah_id)
        .eq('verse_number', verse_number)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    } else {
      const { error } = await supabase
        .from('bookmarked_surahs')
        .delete()
        .eq('user_id', user_id)
        .eq('surah_id', surah_id)

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
