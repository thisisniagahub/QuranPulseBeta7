# Task 4: Safety Fix — Re-enable TypeScript/ESLint Guards Progressively

## Summary

Successfully completed all 4 subtasks with zero lint errors (118 warnings only, as expected).

## Changes Made

### 1. `eslint.config.mjs` — Progressive rule re-enabling

Re-enabled the following rules at **warn** level (not error, to avoid breaking existing code):
- `@typescript-eslint/no-explicit-any`: "warn"
- `@typescript-eslint/no-unused-vars`: "warn"
- `@typescript-eslint/ban-ts-comment`: "warn"
- `react-hooks/exhaustive-deps`: "warn"
- `no-console`: "warn"
- `no-empty`: "warn"
- `no-unreachable`: "warn"
- `prefer-const`: "warn"

Kept at **off** (too noisy to fix immediately):
- `@typescript-eslint/no-non-null-assertion`
- `react/no-unescaped-entities`
- `no-debugger`
- `no-irregular-whitespace`
- `no-case-declarations`
- `no-fallthrough`
- `no-mixed-spaces-and-tabs`
- `no-redeclare`
- `no-useless-escape`
- `no-undef` (TypeScript handles this)
- `no-unused-vars` (TS handles this)

### 2. `next.config.ts` — React strict mode + TypeScript comment

- Changed `reactStrictMode: false` → `reactStrictMode: true` with comment
- Added TODO comment about `ignoreBuildErrors: true` for gradual migration

### 3. Fixed `catch (error: any)` → `catch (error: unknown)` in all API routes

**Supabase routes** (7 files, 13 catch blocks):
- `reading/route.ts` (2 catch blocks)
- `iqra/route.ts` (2 catch blocks)
- `tasbih/route.ts` (2 catch blocks)
- `bookmarks/route.ts` (3 catch blocks)
- `xp/route.ts` (1 catch block)
- `chat/route.ts` (3 catch blocks)
- `profile/route.ts` (3 catch blocks)

**OpenClaw routes** (5 files, 5 catch blocks):
- `models/route.ts`
- `web-search/route.ts`
- `chat/route.ts`
- `schedule-prayer/route.ts`
- `generate/route.ts`

All catch blocks now use:
```ts
catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  // or 'Unknown error' for openclaw routes
  return NextResponse.json({ error: message }, { status: 500 })
}
```

### 4. Lint verification

`bun run lint` result: **0 errors, 118 warnings** — all warnings are expected and acceptable at this stage (unused vars, console statements, `any` types in non-API files, exhaustive-deps, etc.)
