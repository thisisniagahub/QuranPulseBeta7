import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

// GET /api/supabase/reading?user_id=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')
    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ progress: data || null })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/supabase/reading — Save reading progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, surah_id, verse_number, surah_name } = body

    if (!user_id || !surah_id || !verse_number || !surah_name) {
      return NextResponse.json({ error: 'user_id, surah_id, verse_number, surah_name are required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id,
        surah_id,
        verse_number,
        surah_name,
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ progress: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
