import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { getRateLimitResponse } from '@/lib/api-auth'

// GET /api/supabase/tasbih
export async function GET(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const { data, error } = await supabase
      .from('tasbih_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ session: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/supabase/tasbih — Save tasbih state
export async function POST(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const body = await request.json()
    const { count, target, total, dhikr_text } = body

    // Check if session exists
    const { data: existing } = await supabase
      .from('tasbih_sessions')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (existing) {
      const { data, error } = await supabase
        .from('tasbih_sessions')
        .update({ count, target, total, dhikr_text })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ session: data })
    } else {
      const { data, error } = await supabase
        .from('tasbih_sessions')
        .insert({ user_id: user.id, count, target, total, dhikr_text })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ session: data })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
