import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

// GET /api/supabase/profile?user_id=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')
    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/supabase/profile — Create or update profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, username, xp, level, streak, font_size } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()

    // Upsert profile
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        user_id,
        username: username || 'Pengguna',
        xp: xp || 0,
        level: level || 1,
        streak: streak || 0,
        font_size: font_size || 'medium',
      }, { onConflict: 'user_id' })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH /api/supabase/profile — Update specific fields
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, ...updates } = body

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
