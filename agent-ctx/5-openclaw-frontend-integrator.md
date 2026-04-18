# Task 5: OpenClaw Frontend Integration

## Agent: openclaw-frontend-integrator

## Summary
Deeply integrated OpenClaw features into the QuranPulse frontend, enhancing the Ustaz AI tab with OpenClaw Agent mode, tools panel, voice I/O, web search, reactions, and graceful offline fallback.

## Files Created/Modified

### New Files
1. `src/app/api/openclaw/status/route.ts` - GET health check to OpenClaw Gateway
2. `src/app/api/openclaw/sessions/route.ts` - GET active sessions
3. `src/app/api/openclaw/skills/route.ts` - GET available skills
4. `src/app/api/openclaw/cron/route.ts` - GET scheduled cron jobs
5. `src/app/api/openclaw/message/route.ts` - POST message to gateway
6. `src/hooks/useOpenClaw.ts` - Custom React hook for OpenClaw state management

### Modified Files
1. `src/components/quranpulse/tabs/UstazAITab.tsx` - Complete rewrite with OpenClaw integration

## Key Design Decisions
- OpenClaw enhances, does NOT replace, existing classic LLM chat
- Graceful fallback: OpenClaw offline → Classic Chat (z-ai-web-dev-sdk)
- All API routes have 5-second timeouts to prevent hanging
- Auto-polling every 30 seconds for gateway status
- Deep Blue monochromatic theme (#1a1a4a bg, #4a4aa6 primary, #d4af37 gold) maintained throughout
- Voice input (ASR) with 10-second auto-stop for safety
- Voice output (TTS) with play/stop toggle per message
- Collapsible tools panel to keep chat area clean on mobile

## Verification
- All new files pass ESLint with zero errors
- Dev server compiles and serves (GET / 200)
- API routes return proper offline responses when Gateway not running
