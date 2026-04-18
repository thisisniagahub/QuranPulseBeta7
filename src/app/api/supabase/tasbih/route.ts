import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

// GET /api/supabase/tasbih?user_id=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')
    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from('tasbih_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ session: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/supabase/tasbih — Save tasbih state
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, count, target, total, dhikr_text } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()

    // Check if session exists
    const { data: existing } = await supabase
      .from('tasbih_sessions')
      .select('id')
      .eq('user_id', user_id)
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
        .insert({ user_id, count, target, total, dhikr_text })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ session: data })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
