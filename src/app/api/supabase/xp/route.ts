import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { getRateLimitResponse } from '@/lib/api-auth'

// POST /api/supabase/xp — Add XP and log it
export async function POST(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const body = await request.json()
    const { amount, source } = body

    // Validate amount is a positive number between 1-100
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 1 || amount > 100) {
      return NextResponse.json({ error: 'amount must be a positive number between 1 and 100' }, { status: 400 })
    }

    // Validate source is a non-empty string max 100 chars
    if (typeof source !== 'string' || source.trim().length === 0 || source.length > 100) {
      return NextResponse.json({ error: 'source must be a non-empty string (max 100 characters)' }, { status: 400 })
    }

    // Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp, level')
      .eq('user_id', user.id)
      .single()

    const currentXp = profile?.xp || 0
    const currentLevel = profile?.level || 1
    const newXp = currentXp + amount
    const newLevel = Math.floor(newXp / 500) + 1

    // Update profile
    const { data, error } = await supabase
      .from('profiles')
      .update({ xp: newXp, level: newLevel })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log XP
    await supabase
      .from('xp_log')
      .insert({ user_id: user.id, amount, source })

    return NextResponse.json({
      profile: data,
      xpAdded: amount,
      newLevel,
      leveledUp: newLevel > currentLevel,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
