import { type NextRequest } from 'next/server'
import { createServerSupabaseClient } from './server'

interface AuthResult {
  user: NonNullable<Awaited<ReturnType<Awaited<ReturnType<typeof createServerSupabaseClient>>['auth']['getUser']>>['data']['user']>
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>
  error: null
}

interface AuthError {
  user: null
  supabase: null
  error: { message: string; status: number }
}

type AuthResponse = AuthResult | AuthError

/**
 * Verifies the authenticated user from the request session cookie.
 * Uses the server Supabase client (anon key + cookies) which respects RLS.
 * Returns the authenticated user, the server client, and no error — or nulls with error info.
 */
export async function getAuthenticatedUser(
  _request?: NextRequest
): Promise<AuthResponse> {
  // Check that Supabase credentials are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === 'your-supabase-url' ||
    !supabaseUrl.startsWith('https://')
  ) {
    return {
      user: null,
      supabase: null,
      error: {
        message: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
        status: 503,
      },
    }
  }

  const supabase = await createServerSupabaseClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return {
      user: null,
      supabase: null,
      error: {
        message: 'Authentication required. Please sign in.',
        status: 401,
      },
    }
  }

  return {
    user: data.user,
    supabase,
    error: null,
  }
}
