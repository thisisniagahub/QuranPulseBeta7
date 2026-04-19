# Task 1 - Security Fix: Supabase Auth

## Summary
Fixed critical security vulnerability where all 7 Supabase API routes used `createServiceRoleClient()` (bypasses RLS) and accepted `user_id` from request body/query without verifying identity.

## Changes Made

### New File
- **`src/lib/supabase/auth.ts`** — Created `getAuthenticatedUser(request)` helper that:
  - Checks `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured (returns 503 if not)
  - Uses `createServerSupabaseClient()` (anon key + cookies, respects RLS)
  - Calls `supabase.auth.getUser()` to verify session
  - Returns `{ user, supabase, error }` — 401 if no valid session

### Updated Files

- **`src/lib/supabase/server.ts`** — Added JSDoc `@danger` warning on `createServiceRoleClient()`
- **`src/lib/supabase/index.ts`** — Added export for `getAuthenticatedUser` from auth.ts

### 7 API Routes Updated
All routes replaced `createServiceRoleClient` + raw `user_id` with `getAuthenticatedUser()`:

1. **`profile/route.ts`** — PATCH now has field whitelist: `username`, `xp`, `level`, `streak`, `font_size` only
2. **`bookmarks/route.ts`** — Removed `user_id` from required params in POST/DELETE
3. **`reading/route.ts`** — Removed `user_id` from required params in POST
4. **`iqra/route.ts`** — Removed `user_id` from required params in POST
5. **`tasbih/route.ts`** — Uses `user.id` from auth session
6. **`chat/route.ts`** — GET `limit` capped to max 200
7. **`xp/route.ts`** — `amount` validated as positive number 1-100; `source` validated as non-empty string max 100 chars

## Lint Result
`bun run lint` — passes with no errors.
