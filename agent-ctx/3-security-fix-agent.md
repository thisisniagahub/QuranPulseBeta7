# Task 3 — Security Fix: Rate Limiting & Security Headers

**Agent**: Security Fix Agent
**Status**: ✅ Completed

## Summary

Added in-memory rate limiting to all OpenClaw and Supabase API routes, plus security headers in next.config.ts.

## Files Created

### `src/lib/rate-limit.ts`
- In-memory Map-based fixed-window rate limiter
- `rateLimit(key, limit, windowMs)` returns `{ success, remaining, resetAt }`
- Automatic cleanup of expired entries every 60 seconds via `setInterval` with `.unref()` to avoid blocking process exit

### `src/lib/api-auth.ts`
- `getRateLimitResponse(request, limit, windowMs)` helper
- Extracts client IP from `x-forwarded-for` / `x-real-ip` headers (behind Caddy proxy), falls back to `'unknown'`
- Returns `NextResponse` with status 429 and proper headers (`Retry-After`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`) if rate limited
- Returns `null` if the request is allowed to proceed

## Files Modified — OpenClaw Routes (10 routes)

| Route | Limit | Notes |
|---|---|---|
| `openclaw/message/route.ts` | 20/min | POST |
| `openclaw/chat/route.ts` | 20/min | POST |
| `openclaw/generate/route.ts` | 10/min | POST (expensive) |
| `openclaw/schedule-prayer/route.ts` | 5/min | POST |
| `openclaw/web-search/route.ts` | 15/min | POST |
| `openclaw/models/route.ts` | 30/min | GET |
| `openclaw/sessions/route.ts` | 30/min | GET |
| `openclaw/skills/route.ts` | 30/min | GET |
| `openclaw/cron/route.ts` | 30/min | GET |
| `openclaw/status/route.ts` | 60/min | GET (health check) |

## Files Modified — Supabase Routes (7 routes)

All set to 30/min. Each handler (GET, POST, PATCH, DELETE) independently rate-limited:

| Route | Handlers |
|---|---|
| `supabase/profile/route.ts` | GET, POST, PATCH |
| `supabase/bookmarks/route.ts` | GET, POST, DELETE |
| `supabase/reading/route.ts` | GET, POST |
| `supabase/iqra/route.ts` | GET, POST |
| `supabase/tasbih/route.ts` | GET, POST |
| `supabase/chat/route.ts` | GET, POST, DELETE |
| `supabase/xp/route.ts` | POST |

## Files Modified — Config

### `next.config.ts`
Added `async headers()` returning security headers for all routes and API-specific headers:

**All routes (`/(.*)`)**:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`

**API routes (`/api/(.*)`)**:
- `X-Content-Type-Options: nosniff`
- `Cache-Control: no-store`

## Lint Result

`bun run lint` — 0 errors, 139 warnings (all pre-existing, none from this task)

## Dev Server

Server restarted automatically after next.config.ts change. Running normally on port 3000.
