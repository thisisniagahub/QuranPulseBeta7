import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { getRateLimitResponse } from '@/lib/api-auth'

// GET /api/supabase/chat?limit=50
export async function GET(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const rawLimit = parseInt(request.nextUrl.searchParams.get('limit') || '50')
    // Cap limit to max 200
    const limit = Math.min(Math.max(1, rawLimit), 200)

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ messages: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/supabase/chat — Save chat message
export async function POST(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const body = await request.json()
    const { role, content } = body

    if (!role || !content) {
      return NextResponse.json({ error: 'role, content are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({ user_id: user.id, role, content })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE /api/supabase/chat — Clear chat history
export async function DELETE(request: NextRequest) {
  const rateLimitResponse = getRateLimitResponse(request, 30, 60000)
  if (rateLimitResponse) return rateLimitResponse

  try {
    const { user, error: authError, supabase } = await getAuthenticatedUser(request)
    if (authError || !user || !supabase) {
      return NextResponse.json({ error: authError!.message }, { status: authError!.status })
    }

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
