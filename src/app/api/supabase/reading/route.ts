import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { getRateLimitResponse } from '@/lib/api-auth'

// GET /api/supabase/reading
export async function GET(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const { data, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ progress: data || null })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/supabase/reading — Save reading progress
export async function POST(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const body = await request.json()
    const { surah_id, verse_number, surah_name } = body

    if (!surah_id || !verse_number || !surah_name) {
      return NextResponse.json({ error: 'surah_id, verse_number, surah_name are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reading_progress')
      .upsert({
        user_id: user.id,
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
