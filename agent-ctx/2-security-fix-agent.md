# Task 2: OpenClaw Gateway Security Fix

## Agent: Security Fix Agent
## Date: 2025-03-04

## Summary
Fixed critical command injection vulnerability in the OpenClaw gateway mini-service (`mini-services/openclaw-gateway/index.ts`).

## Changes Made

### 1. Replaced `execSync` with `spawnSync` (Command Injection Fix)
- **Before**: `execSync(`openclaw ${command} --json 2>&1`, { timeout })` — vulnerable to shell interpolation
- **After**: `spawnSync('openclaw', [...args, '--json'], { timeout, encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] })` — arguments passed as array, no shell involved
- Removed `import { execSync }` and replaced with `import { spawnSync }`
- Updated `runOpenClawCLI` signature from `(command: string, timeout)` to `(args: string[], timeout)`

### 2. Updated All `runOpenClawCLI` Callers
| Old Call | New Call |
|----------|----------|
| `runOpenClawCLI('gateway status')` | `runOpenClawCLI(['gateway', 'status'])` |
| `runOpenClawCLI('sessions list')` | `runOpenClawCLI(['sessions', 'list'])` |
| `runOpenClawCLI('cron list')` | `runOpenClawCLI(['cron', 'list'])` |
| `runOpenClawCLI('skills list')` | `runOpenClawCLI(['skills', 'list'])` |
| String-interpolated agent command | `['agent', '--message', message, ...]` as array |
| String-interpolated cron command | `['cron', 'add', '--schedule', cronExpr, '--task', taskDesc]` as array |

### 3. Input Validation — `/api/message` Endpoint
- **message**: Must be a non-empty string, max 2000 characters
- **channel** (optional): Must match `/^[a-z]{2,20}$/`
- **target** (optional): Must match `/^[a-zA-Z0-9_@.-]{1,50}$/`
- Returns HTTP 400 with descriptive error if validation fails

### 4. Input Validation — `/api/schedule-prayer` Endpoint
- **prayerName**: Must match `/^[A-Za-z\s]{2,30}$/`
- **time**: Must match `/^\d{1,2}:\d{2}$/`
- Returns HTTP 400 with descriptive error if validation fails
- Cron expression is now built from validated parts, not from string interpolation

### 5. CORS Fix
- **Before**: `Access-Control-Allow-Origin: *` (wildcard — allows any origin)
- **After**: Dynamic origin check using `isOriginAllowed()` function
  - Allows `http://localhost:3000` (development)
  - Allows origins ending in `.space.z.ai` (sandbox preview)
  - Rejects all other origins
  - Sets `Vary: Origin` header for proper caching

## Verification
- No `execSync` references remain in the codebase
- The mini-service continues to run on port 3030
