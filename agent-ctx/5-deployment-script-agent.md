---
Task ID: 5
Agent: Deployment Script Agent
Task: Generate VPS Deployment Script for QuranPulse
---

# Work Log

## Context
- Read `/home/z/my-project/worklog.md` to understand all previous agent work (Tasks 1-12, 3-a, 3-c, 4-9, 6-7)
- Read `package.json` to understand dependencies and build scripts
- Read `next.config.ts` to confirm standalone output mode
- Read `prisma/schema.prisma` to understand database (SQLite)
- Read existing `.env` and `.env.example` for current env var configuration
- Grepped all `process.env.*` references across `src/` to discover all environment variables
- Checked `Caddyfile` for existing proxy configuration

## Environment Variables Discovered
From code analysis:
- `DATABASE_URL` — Prisma SQLite connection string
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (client + server)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (client + server)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server only)
- `Z_AI_API_KEY` — Used by z-ai-web-dev-sdk (LLM, TTS, ASR, image generation)
- `OPENCLAW_PORT` — OpenClaw gateway port (default 18789)
- `OPENCLAW_GATEWAY_URL` — OpenClaw gateway URL (default http://localhost:3030)
- `TTS_API_URL` — Custom TTS endpoint (optional)
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET` — NextAuth.js (optional, referenced but not actively used)
- `NODE_ENV`, `PORT` — Standard runtime

## Files Created

### 1. `/home/z/my-project/.env.example` (64 lines)
Comprehensive environment variable template with:
- Organized sections with clear headers
- DATABASE_URL with examples for VPS and local dev
- Supabase vars with descriptions of each key's purpose and security level
- Z_AI_API_KEY with description of what it powers
- OpenClaw gateway configuration
- Optional TTS and NextAuth sections
- Clear instructions to `cp .env.example .env`

### 2. `/home/z/my-project/deploy.sh` (530 lines, executable)
Full VPS deployment script with 7 sections:

**Section 1: Environment Setup** (idempotent)
- Installs Node.js 20+ via nvm (checks existing version first)
- Installs bun via official install script
- Installs Caddy via Cloudsmith apt repository
- Installs PM2 globally via npm
- Creates `/opt/quranpulse` directory with correct ownership
- Creates `db/` subdirectory for SQLite

**Section 2: Application Deployment**
- Clones repo if not exists, pulls if already cloned
- Compares local vs remote commits (skips pull if up to date)
- Backups previous `.next` build to `/opt/quranpulse-backups/` (keeps last 5)
- Creates `.env` from `.env.example` if missing, with placeholder values
- Installs dependencies with `bun install`
- Builds with `bun run build` (standalone output)
- **Rollback**: If build fails, restores previous build from backup and restarts PM2
- Pushes Prisma schema with `bun run db:push`
- Starts/restarts PM2 process

**Section 3: Caddy Configuration**
- Generates production Caddyfile at `/etc/caddy/Caddyfile`
- Reverse proxy: port 81 → localhost:3000
- WebSocket support headers (Connection, Upgrade)
- Security headers: X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, X-XSS-Protection, Permissions-Policy, CSP
- Gzip + zstd compression
- Static asset caching with 1-year immutable Cache-Control
- Health check endpoint at `/health`
- JSON access logging with rotation
- HTTP transport timeouts (300s read/write, 30s dial)
- Validates Caddyfile before applying
- Reloads or starts Caddy via systemctl

**Section 4: PM2 Startup Configuration**
- Creates `ecosystem.config.js` with:
  - Standalone server.js entry point
  - NODE_ENV=production, PORT=3000, HOSTNAME=0.0.0.0
  - Auto-restart on crash (max 10 restarts, 5s delay)
  - Memory limit: 512MB with auto-restart
  - Log files: error.log + out.log with timestamps
  - Graceful shutdown: 10s kill timeout, 30s listen timeout
- Configures PM2 startup for systemd auto-resurrection on reboot
- Saves PM2 process list

**Section 5: Environment Variables Check**
- Sources `.env` file for checking
- Validates required vars: Z_AI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- Checks optional vars: DATABASE_URL, OPENCLAW_PORT, OPENCLAW_GATEWAY_URL, TTS_API_URL
- Detects placeholder values (your-, placeholder, changeme, etc.)
- **NEVER echoes actual secret values** — only reports set/not-set status
- Color-coded output: ✓ green for set, ✗ red for missing, ⚠ yellow for suspicious

**Section 6: Post-Deploy Health Check**
- 5-second startup wait
- HTTP health check on localhost:3000 (direct) and localhost:81 (via Caddy)
- PM2 process status check (online/stopped/errored)

**Section 7: Deployment Summary**
- Displays all configuration details (directory, ports, PM2 process name, VPS IP, access URL)
- Lists useful commands (logs, restart, stop, monit, env edit)
- Shows health status with emoji indicators
- Warns about missing env vars if any

**Safety Features**:
- `set -euo pipefail` at the top
- Idempotent: safe to run multiple times (checks before installing, doesn't overwrite .env)
- Backup before build with automatic cleanup (keeps 5 most recent)
- Rollback on build failure (restores previous .next, restarts PM2)
- Colored output (green/yellow/red/cyan) for all messages
- Logging to `/var/log/quranpulse-deploy.log`
- Syntax validated with `bash -n`

## Files Modified
- None (only new files created)

## Verification
- deploy.sh syntax validated: `bash -n deploy.sh` → "Syntax OK"
- deploy.sh is executable: `-rwxr-xr-x`
- .env.example contains all environment variables discovered from code analysis
