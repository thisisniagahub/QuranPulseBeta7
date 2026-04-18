import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

// GET /api/supabase/iqra?user_id=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('user_id')
    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from('iqra_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ progress: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST /api/supabase/iqra — Update iqra progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, book_number, page_number, completed } = body

    if (!user_id || !book_number || !page_number) {
      return NextResponse.json({ error: 'user_id, book_number, page_number are required' }, { status: 400 })
    }

    const supabase = await createServiceRoleClient()
    const { data, error } = await supabase
      .from('iqra_progress')
      .upsert({
        user_id,
        book_number,
        page_number,
        completed: completed || false,
      }, { onConflict: 'user_id,book_number,page_number' })
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
