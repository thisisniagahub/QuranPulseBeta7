import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

// POST /api/supabase/xp — Add XP and log it
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, amount, source } = body

    if (!user_id || !amount || !source) {
      return NextResponse.json({ error: 'user_id, amount, source are required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()

    // Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, level')
      .eq('user_id', user_id)
      .single()

    const currentXp = profile?.xp || 0
    const currentLevel = profile?.level || 1
    const newXp = currentXp + amount
    const newLevel = Math.floor(newXp / 500) + 1

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({ xp: newXp, level: newLevel })
      .eq('user_id', user_id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log XP
    await supabase
      .from('xp_log')
      .insert({ user_id, amount, source })

    return NextResponse.json({
      profile: data,
      xpAdded: amount,
      newLevel,
      leveledUp: newLevel > currentLevel,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
