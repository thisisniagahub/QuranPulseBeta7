# QuranPulse — Architecture Document

> **System Architecture & Technical Design**
> *Malaysia's First AI-Powered Quran Learning App*

**Version:** 7.0  
**Last Updated:** March 2026  
**Repository:** [thisisniagahub/QuranPulseBeta7](https://github.com/thisisniagahub/QuranPulseBeta7)

---

## 1. System Overview

### High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Next.js 16 App Router                     │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │ │
│  │  │ HomeTab  │ │ QuranTab │ │UstazAITab│ │ IbadahTab│      │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │ │
│  │  ┌──────────┐                                               │ │
│  │  │ IqraTab  │     AppShell (Tab Navigation)                 │ │
│  │  └──────────┘                                               │ │
│  │  ┌─────────────────────────────────────────────────────┐    │ │
│  │  │          Zustand Store + localStorage Persist        │    │ │
│  │  └─────────────────────────────────────────────────────┘    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Caddy Gateway    │
                    │   (Port 443/80)    │
                    └─────────┬─────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                     │
    ┌────▼─────┐      ┌──────▼──────┐      ┌──────▼──────┐
    │ Next.js   │      │ OpenClaw    │      │  External   │
    │ API       │      │ Gateway     │      │  APIs       │
    │ (Port     │      │ (Port 3030) │      │             │
    │  3000)    │      │             │      │  • alquran  │
    │           │      │ Routes to   │      │  • waktusolat│
    │ /api/*    │      │ OpenClaw    │      │  • aladhan  │
    │           │      │ (Port 18789)│      │  • halal    │
    └────┬──────┘      └──────┬──────┘      └─────────────┘
         │                    │
    ┌────▼──────┐      ┌──────▼──────┐
    │ Supabase  │      │ OpenClaw    │
    │ (Cloud    │      │ Agents &    │
    │  PG+RLS)  │      │ Skills      │
    └───────────┘      └─────────────┘
```

---

## 2. Frontend Architecture

### 2.1 Next.js 16 App Router

QuranPulse uses a **single-page, tab-based architecture** powered by Next.js 16 App Router. There is only one route (`/`) — all navigation happens within the `AppShell` component.

```
app/
├── layout.tsx          → Root layout (metadata, fonts, Toaster)
├── page.tsx            → Entry point (SplashScreen → AppShell)
├── globals.css         → Theme variables, animations, utilities
└── api/                → Server-side API routes
```

**Key decisions:**
- **Standalone output** enabled for Vercel deployment
- **No SSR for tab content** — all tab components are `'use client'` 
- **Single route** — eliminates page navigation, instant tab switching
- **Mobile-first** — `max-w-[480px] mx-auto` viewport constraint

### 2.2 Component Hierarchy

```
RootLayout (layout.tsx)
  └── Page (page.tsx)
      ├── SplashScreen (2.5s animated splash)
      └── AppShell (main application)
          ├── Status Bar Spacer
          ├── Main Content Area
          │   └── AnimatePresence
          │       └── [ActiveTab Component]
          │           ├── HomeTab
          │           ├── QuranTab
          │           ├── UstazAITab
          │           ├── IbadahTab
          │           └── IqraTab
          └── Bottom Navigation (fixed)
              ├── Home
              ├── Quran
              ├── Ustaz AI (center, elevated)
              ├── Ibadah
              └── Iqra
```

### 2.3 State Management

**Zustand 5 + persist middleware** is the sole state management solution:

```typescript
// Store: /src/stores/quranpulse-store.ts
useQuranPulseStore (Zustand + persist)
  ├── Navigation: activeTab, setActiveTab
  ├── Profile: userName, xp, level, streak, addXp, incrementStreak
  ├── Bookmarks: bookmarkedVerses, bookmarkedSurahs, toggleVerseBookmark, toggleSurahBookmark
  ├── Reading: lastReadSurah, lastReadVerse, lastReadAyah, lastReadSurahName, fontSize, setLastRead
  ├── Tasbih: tasbihCount, tasbihTarget, tasbihTotal, incrementTasbih, resetTasbih
  ├── Tasbih Settings: tasbihVibration, tasbihSound, tasbihVibrationPattern, tasbihSessions
  ├── Iqra: iqraBook, iqraPage, setIqraBook, setIqraPage
  ├── Prayer Zone: selectedZone, prayerZone, setPrayerZone
  └── Hafazan: hafazanProgress, updateHafazanVerse, getHafazanVerse, getWeakVerses, getDailyReviewVerses
```

**Persistence strategy:**
- **localStorage** via Zustand `persist` + `createJSONStorage`
- **Partialize** — only essential fields persisted (not functions or transient state)
- **SSR-safe** — in-memory fallback when `window` is undefined
- **Storage key:** `quranpulse-storage`

### 2.4 Routing

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `page.tsx` → `AppShell` | Single entry point, tab-based navigation |

**Tab navigation** is handled entirely client-side:

```typescript
// Tab switching via Zustand store
const { activeTab, setActiveTab } = useQuranPulseStore()

// Available tabs
type TabId = 'home' | 'quran' | 'ustaz-ai' | 'ibadah' | 'iqra' | 'more'
```

### 2.5 Theme System

**Deep Blue + Gold** identity defined via CSS custom properties:

```css
/* Primary Colors */
--qp-navy: #1a1a4a      /* Background */
--qp-blue: #2a2a6a      /* Card backgrounds */
--qp-accent: #4a4aa6    /* Primary actions */
--qp-light: #6a6ab6    /* Secondary elements */
--qp-gold: #d4af37      /* Gold accents */

/* Utility Classes */
.qp-geometric-bg        /* Islamic geometric star pattern SVG */
.qp-card-shimmer        /* Animated card shimmer effect */
.qp-accent-glow         /* Blue glow for active elements */
.qp-gold-glow           /* Gold glow for premium elements */
.qp-scroll              /* Custom scrollbar styling */
.font-arabic            /* Amiri font for Arabic text */
```

---

## 3. Backend Architecture

### 3.1 API Routes (Next.js API Handlers)

All API routes follow the Next.js 16 Route Handler pattern:

```
src/app/api/
├── quran/
│   ├── surah/route.ts       GET  — Surah list or specific surah with ayahs
│   ├── search/route.ts      GET  — Search Quran text (ar/ms/en)
│   ├── juz/route.ts         GET  — Juz list or specific juz with ayahs
│   └── tafsir/route.ts      GET  — Tafsir for a specific ayah
├── jakim/
│   ├── solat/route.ts       GET  — JAKIM prayer times by zone
│   ├── zones/route.ts       GET  — List all 52 JAKIM zones
│   └── khutbah/route.ts     GET  — JAKIM khutbah entries
├── ustaz-ai/route.ts        POST — AI Islamic chatbot
├── tts/route.ts             POST — Text-to-speech synthesis
├── asr/route.ts             POST — Speech-to-text transcription
├── supabase/
│   ├── profile/route.ts     GET/POST — User profile sync
│   ├── bookmarks/route.ts   GET/POST — Bookmarks sync
│   ├── reading/route.ts     GET/POST — Reading progress sync
│   ├── xp/route.ts          GET/POST — XP/level sync
│   ├── tasbih/route.ts      GET/POST — Tasbih sessions sync
│   ├── iqra/route.ts        GET/POST — Iqra progress sync
│   └── chat/route.ts        GET/POST — Chat messages sync
└── openclaw/
    ├── status/route.ts      GET  — Gateway health check
    ├── chat/route.ts        POST — OpenAI-compatible chat
    ├── message/route.ts     POST — Send message to agent
    ├── skills/route.ts      GET  — List available skills
    ├── sessions/route.ts    GET  — List active sessions
    ├── cron/route.ts        GET  — List scheduled jobs
    ├── models/route.ts      GET  — List available AI models
    ├── generate/route.ts    POST — Generate media (image/video/music)
    ├── web-search/route.ts  POST — Web search via OpenClaw
    └── schedule-prayer/route.ts POST — Schedule prayer reminders
```

### 3.2 External API Integrations

#### alquran.cloud (Quran Data)
```
Base URL: https://api.alquran.cloud/v1
Endpoints used:
  GET /surah                    → All 114 surahs metadata
  GET /surah/{number}/quran-uthmani  → Arabic text
  GET /surah/{number}/ms.basmeih     → Malay translation
  GET /surah/{number}/en.sahih       → English translation
  GET /ayah/{number}/{edition}       → Single ayah
  GET /search/{query}/{edition}      → Text search
Cache: In-memory Map with 1-hour TTL
Fallback: Local SURAH_DATA array (114 surahs)
```

#### waktusolat.app (JAKIM Prayer Times)
```
Base URL: https://api.waktusolat.app
Endpoints used:
  GET /solat/{zone}/{year}/{month}/{day}  → Prayer times for zone+date
Cache: In-memory Map with 1-hour TTL (10min for fallback data)
Fallback: Hardcoded KL default times
```

#### aladhan.com (Islamic Calendar)
```
Base URL: https://api.aladhan.com/v1
Endpoints used:
  GET /hpiCalendarByHijriYear/{year}  → Full Hijri year calendar
Cache: In-memory Map with 30-day TTL
Fallback: Local calendar generation with notable days
```

#### halal.gov.my (JAKIM Halal)
```
Base URL: https://halal.gov.my/v2/api/v1
Endpoints used:
  GET /products/{code}  → Halal certification status
Cache: In-memory Map with 1-hour TTL (5min for unknown status)
Fallback: Return "unknown" status
```

### 3.3 AI Integration (z-ai-web-dev-sdk)

All AI capabilities are accessed server-side only via `z-ai-web-dev-sdk`:

| Capability | API Route | SDK Function | Use Case |
|-----------|-----------|-------------|----------|
| **LLM Chat** | `/api/ustaz-ai` | Chat completions | Ustaz AI responses |
| **TTS** | `/api/tts` | Text-to-speech | Verse audio, AI voice |
| **ASR** | `/api/asr` | Speech-to-text | Voice input for chat |
| **VLM** | — | Vision-language model | (Available for future use) |
| **Image Gen** | `/api/openclaw/generate` | Image generation | Islamic art |
| **Video Gen** | `/api/openclaw/generate` | Video generation | (Available for future use) |
| **Web Search** | `/api/openclaw/web-search` | Web search | Current Islamic events |

### 3.4 OpenClaw Agent Framework

The OpenClaw integration runs as a separate mini-service:

```
mini-services/openclaw-gateway/     (Port 3030)
  └── index.ts                      HTTP proxy to OpenClaw Gateway

openclaw-workspace/
  ├── openclaw.json                 5 agents, multi-channel, model config
  ├── AGENTS.md                     Agent directory & specializations
  ├── MEMORY.md                     User preferences (BM, KL timezone)
  ├── SOUL.md                       Behavioral guidelines (Bismillah, JAKIM)
  ├── HEARTBEAT.md                  Prayer reminder checklist
  └── skills/
      ├── quranpulse-ustaz-ai.md    Main Islamic knowledge assistant
      ├── quranpulse-quran-search.md Quran verse search + tafsir
      ├── quranpulse-prayer-ibadah.md Prayer times & ibadah guidance
      ├── quranpulse-islamic-art.md  Islamic art generation
      └── quranpulse-iqra-hafazan.md Iqra learning & hafazan method
```

**5 Specialized Agents:**

| Agent ID | Persona | Specialization |
|----------|---------|---------------|
| `ustaz-azhar` | Ustaz Azhar | Fiqh & Hukum |
| `ustazah-aishah` | Ustazah Aishah | Akidah & Akhlak |
| `ustaz-zak` | Ustaz Zak | Sirah & Sejarah |
| `iqra-teacher` | Cikgu Iqra | Iqra & Hafazan |
| `islamic-artist` | Seniman Islam | Khat & Islamic Art |

**Communication flow:**
```
Frontend (UstazAITab)
  → /api/openclaw/chat (POST, OpenAI-compatible)
  → OpenClaw Gateway (Port 3030)
  → OpenClaw Core (Port 18789)
  → Agent (persona-specific)
  → Skills + Tools (web search, media gen)
  → Response → Frontend
```

**Fallback when Gateway offline:**
```
Frontend (UstazAITab)
  → /api/ustaz-ai (POST)
  → z-ai-web-dev-sdk LLM
  → Response → Frontend
```

---

## 4. Data Architecture

### 4.1 Supabase (PostgreSQL with RLS)

9 database tables for cloud persistence:

```sql
-- User Profile
profiles (id, user_id, username, xp, level, streak, last_streak_date, font_size, created_at, updated_at)

-- Bookmarks
bookmarked_verses (id, user_id, surah_id, verse_number, created_at)
bookmarked_surahs (id, user_id, surah_id, created_at)

-- Reading Progress
reading_progress (id, user_id, surah_id, verse_number, surah_name, created_at, updated_at)

-- Tasbih
tasbih_sessions (id, user_id, count, target, total, dhikr_text, created_at, updated_at)

-- Iqra
iqra_progress (id, user_id, book_number, page_number, completed, created_at, updated_at)

-- Chat
chat_messages (id, user_id, role, content, created_at)

-- Gamification
xp_log (id, user_id, amount, source, created_at)

-- Anonymous Users
anonymous_sessions (id, session_id, data, created_at, updated_at)
```

**RLS Policies:**
- Users can only read/write their own data (`user_id = auth.uid()`)
- Anonymous sessions identified by `session_id` cookie
- Service role key used for API routes that need cross-user access

### 4.2 Local Persistence (Zustand persist → localStorage)

All user state is persisted locally for offline-first operation:

```typescript
// Persisted fields (quranpulse-storage key in localStorage)
{
  userName: string,
  xp: number,
  level: number,
  streak: number,
  bookmarkedVerses: BookmarkedVerse[],
  bookmarkedSurahs: BookmarkedSurah[],
  bookmarkedIds: string[],
  lastReadSurah: number | null,
  lastReadVerse: number | null,
  lastReadAyah: number,
  lastReadSurahName: string,
  fontSize: 'small' | 'medium' | 'large',
  tasbihTotal: number,
  tasbihVibration: boolean,
  tasbihSound: boolean,
  tasbihVibrationPattern: 'short' | 'medium' | 'long',
  tasbihSessions: TasbihSession[],
  iqraBook: number,
  iqraPage: number,
  selectedZone: string,
  prayerZone: string,
  hafazanProgress: HafazanVerseProgress[],
}
```

### 4.3 In-Memory Caching (TTL-based Map)

Both `QuranService` and `JakimService` use identical caching patterns:

```typescript
interface CacheEntry<T> {
  data: T
  expiry: number
}

const cache = new Map<string, CacheEntry<unknown>>()

// Cache TTLs
QuranService:   1 hour (3,600,000ms) for all data
JakimService:   1 hour for prayer times, 24h for khutbah, 30 days for calendar
                10 min for fallback prayer times, 5 min for unknown halal status
```

### 4.4 Prisma ORM (SQLite — Available but Unused)

Prisma is configured and available at `prisma/schema.prisma` with client at `src/lib/db.ts`. Currently, the app uses Supabase for cloud storage and Zustand for local storage. Prisma/SQLite remains available for future use cases requiring a local database.

---

## 5. Security Architecture

### 5.1 Supabase Row-Level Security (RLS)

All Supabase tables enforce RLS policies:
- **Authenticated users:** Can only access rows where `user_id` matches their auth ID
- **Anonymous users:** Identified by `session_id` cookie, can only access their own session data
- **Service role:** Used in API routes for administrative operations

### 5.2 API Route Protection

- **z-ai-web-dev-sdk keys** are only accessible server-side (API routes)
- **OpenClaw Gateway** runs on a separate port with its own authentication
- **Caddy gateway** handles TLS termination and request routing
- **XTransformPort** query parameter used for cross-service requests through Caddy

### 5.3 JAKIM Disclaimer for AI Responses

All AI-generated religious content includes a mandatory disclaimer:
- Visible at all times in the Ustaz AI chat interface
- Shield icon with text indicating AI-generated content
- Encourages users to consult certified scholars for important rulings
- Cannot be dismissed or hidden by the user

### 5.4 Input Sanitization

- All user text inputs are sanitized before being sent to AI APIs
- Prayer zone codes validated against the 52 known JAKIM zones
- Surah numbers validated (1-114) before API calls
- Search queries limited to reasonable length

---

## 6. Performance Architecture

### 6.1 API Response Caching

```
┌────────────────────────────────────────────────┐
│                Cache Strategy                   │
├──────────────────┬──────────┬──────────────────┤
│ Data Type        │ TTL      │ Fallback         │
├──────────────────┼──────────┼──────────────────┤
│ Surah list       │ 1 hour   │ Local 114 surahs │
│ Surah + ayahs    │ 1 hour   │ Surah info only  │
│ Quran search     │ 1 hour   │ Empty results    │
│ Prayer times     │ 1 hour   │ KL defaults      │
│ Zones list       │ No cache │ Local 52 zones   │
│ Khutbah          │ 24 hours │ Sample entries   │
│ Calendar         │ 30 days  │ Local generation │
│ Halal status     │ 1 hour   │ Unknown status   │
│ OpenClaw skills  │ No cache │ Empty array      │
│ OpenClaw status  │ 30s poll │ Offline state    │
└──────────────────┴──────────┴──────────────────┘
```

### 6.2 Verse Data Caching

- **alquran.cloud** responses cached in-memory with 1-hour TTL
- **Triple-fetch** for surah reading (Arabic + Malay + English) done in parallel
- **Local fallback** data embedded in `quran-service.ts` — 114 surahs always available
- **Audio URLs** constructed client-side (no API call needed): `cdn.islamic.network/quran/audio/128/{reciter}/{number}.mp3`

### 6.3 Audio Streaming from CDN

- Audio is streamed directly from `cdn.islamic.network` — no server proxy
- 128kbps MP3 format for mobile-optimized streaming
- Each ayah is a separate file enabling seek-by-ayah navigation
- 12 reciters available with pre-configured edition IDs

### 6.4 PWA Support

- **Service worker** pattern available (configured in next.config.ts)
- **Offline capability:** All static data (114 surahs, hadiths, tajwid rules) works offline
- **Cache-first strategy:** Previously loaded surahs available without network
- **Manifest:** PWA manifest with QuranPulse branding

---

## 7. Deployment Architecture

### 7.1 Vercel Deployment

```
GitHub (thisisniagahub/QuranPulseBeta7)
  → Vercel (auto-deploy on push)
    → Next.js 16 standalone build
      → Edge + Serverless Functions
        → API Routes (/api/*)
```

**Build configuration:**
- `output: 'standalone'` in `next.config.ts`
- Bun as package manager and runtime
- Static assets served from Vercel CDN

### 7.2 GitHub Repository

- **Repository:** `thisisniagahub/QuranPulseBeta7`
- **Main branch:** `main`
- **CI/CD:** Vercel auto-deployment on push

### 7.3 Environment Variables Management

```env
# Required for AI features
Z_AI_API_KEY=                    # z-ai-web-dev-sdk API key

# Required for cloud sync
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=       # Supabase service role key (server-only)

# Optional for OpenClaw integration
OPENCLAW_GATEWAY_URL=            # OpenClaw Gateway URL (default: http://localhost:18789)
```

### 7.4 Mini Services

| Service | Port | Description |
|---------|------|-------------|
| `openclaw-gateway` | 3030 | HTTP proxy to OpenClaw Gateway (18789) |
| `quranpulse` | — | Additional QuranPulse service |

Mini services are independent Bun projects with `bun --hot` for auto-restart.

---

## 8. Data Flow Diagrams

### 8.1 Quran Reading Flow

```
User taps surah in QuranTab
  │
  ├── Check Zustand store for cached surah
  │     └── If cached → Render immediately
  │
  └── Fetch from API
        │
        ├── GET /api/quran/surah?number={id}
        │     │
        │     ├── Check in-memory cache (1h TTL)
        │     │     └── If cached → Return cached data
        │     │
        │     └── Fetch from alquran.cloud
        │           ├── GET /v1/surah/{id}/quran-uthmani   (Arabic)
        │           ├── GET /v1/surah/{id}/ms.basmeih      (Malay)
        │           └── GET /v1/surah/{id}/en.sahih        (English)
        │
        │     Merge translations → Cache → Return JSON
        │
        └── QuranTab renders:
              ├── Surah header (name, ayah count, revelation type)
              ├── Bismillah (if applicable)
              ├── Ayah list (Arabic + Malay + English)
              ├── Audio button per ayah → CDN stream
              └── Bookmark/share buttons
```

### 8.2 Prayer Times Flow

```
User opens IbadahTab / HomeTab
  │
  ├── Read selectedZone from Zustand store
  │     (default: WPKL01 for Kuala Lumpur)
  │
  └── Fetch from API
        │
        ├── GET /api/jakim/solat?zone={zone}
        │     │
        │     ├── Check in-memory cache (1h TTL)
        │     │     └── If cached → Return cached data
        │     │
        │     └── Fetch from waktusolat.app
        │           │
        │           └── GET /solat/{zone}/{year}/{month}/{day}
        │                 │
        │                 ├── Success → Cache & return
        │                 └── Failure → Return KL defaults (cache 10min)
        │
        └── Component renders:
              ├── Current/next prayer highlight
              ├── Countdown timer (updates every 1s)
              ├── Circular progress ring
              └── Zone selector dropdown
```

### 8.3 AI Chat Flow

```
User sends message in UstazAITab
  │
  ├── Check OpenClaw Gateway status (useOpenClaw hook, 30s polling)
  │
  ├── Gateway ONLINE:
  │     │
  │     ├── POST /api/openclaw/chat
  │     │     │
  │     │     ├── Map persona → OpenClaw agentId
  │     │     │     (Ustaz Azhar → ustaz-azhar, etc.)
  │     │     │
  │     │     └── Proxy to OpenClaw Gateway (port 3030)
  │     │           │
  │     │           ├── /api/chat/completions (OpenAI-compat)
  │     │           ├── Agent applies skills & tools
  │     │           └── Response → Return to frontend
  │     │
  │     └── Frontend renders AI message with:
  │           ├── Voice playback button (TTS)
  │           ├── Copy button
  │           ├── Emoji reactions
  │           └── OpenClaw branding
  │
  └── Gateway OFFLINE:
        │
        ├── POST /api/ustaz-ai
        │     │
        │     └── z-ai-web-dev-sdk LLM chat completion
        │           ├── System prompt with JAKIM compliance
        │           ├── Persona-specific instructions
        │           └── Response → Return to frontend
        │
        └── Frontend renders AI message (Classic Chat mode)
```

### 8.4 Iqra Learning Flow

```
User opens IqraTab
  │
  ├── Read iqraBook & iqraPage from Zustand store
  │
  ├── Render content based on book number:
  │     ├── Iqra 1: Hijaiyah letters (29 per page)
  │     ├── Iqra 2: Harakat combinations
  │     ├── Iqra 3: Tanwin & Mad rules
  │     ├── Iqra 4: Advanced tajwid
  │     ├── Iqra 5: Waqaf & Ibtida
  │     └── Iqra 6: Complete surah reading
  │
  ├── Practice modes:
  │     ├── Flashcard: Flip cards → +5 XP per navigation
  │     ├── Quiz: 4-option MCQ → +10 XP per correct answer
  │     └── Matching: 6-pair grid → +15 XP on completion
  │
  ├── AI Tutor ("Tanya Cikgu"):
  │     ├── Bottom sheet chat interface
  │     ├── POST /api/ustaz-ai (iqra-teacher persona)
  │     └── Suggestion chips for quick questions
  │
  ├── Hafazan (Juz 30):
  │     ├── 20 short surahs with progress tracking
  │     ├── Spaced repetition: new → learning(4h) → review(1d) → mastered(7d)
  │     ├── Audio playback button
  │     ├── "Semak dengan AI" button
  │     └── +100 XP on surah completion
  │
  └── Progress Dashboard:
        ├── Overall progress across 6 books
        ├── Tajwid mastery (X/14 rules)
        └── Hafazan verse tracking
```

---

## 9. API Reference

### 9.1 Quran API Routes

#### `GET /api/quran/surah`
Fetch the list of all 114 surahs or a specific surah with complete ayahs.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `number` | integer | No | Surah number (1-114). If omitted, returns full list. |
| `edition` | string | No | Quran edition (default: `quran-uthmani`) |

**Response (list):**
```json
{
  "success": true,
  "data": [
    {
      "number": 1,
      "name": "الفاتحة",
      "englishName": "Al-Fatihah",
      "malayName": "Al-Fatihah",
      "numberOfAyahs": 7,
      "revelationType": "Meccan",
      "juz": [1]
    }
  ]
}
```

**Response (specific surah):**
```json
{
  "success": true,
  "data": {
    "surah": { "number": 1, "name": "الفاتحة", ... },
    "ayahs": [
      {
        "number": 1,
        "numberInSurah": 1,
        "text": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
        "translationMs": "Dengan nama Allah...",
        "translationEn": "In the name of Allah...",
        "audioUrl": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
        "sajda": false
      }
    ]
  }
}
```

---

#### `GET /api/quran/search`
Search Quran text across Arabic, Malay, and English.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query |
| `language` | string | No | `ar`, `ms`, or `en` (default: `ms`) |

---

#### `GET /api/quran/juz`
Fetch the list of all 30 juz or a specific juz.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `number` | integer | No | Juz number (1-30). If omitted, returns full list. |

---

#### `GET /api/quran/tafsir`
Get tafsir for a specific ayah.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `surah` | integer | Yes | Surah number (1-114) |
| `ayah` | integer | Yes | Ayah number in surah |

---

### 9.2 JAKIM API Routes

#### `GET /api/jakim/solat`
Fetch JAKIM prayer times for a specific zone and date.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `zone` | string | Yes | JAKIM zone code (e.g., `WPKL01`) |
| `date` | string | No | Date in YYYY-MM-DD format (default: today) |

**Response:**
```json
{
  "success": true,
  "data": {
    "zone": "WPKL01",
    "date": "2026-03-05",
    "hijriDate": "1447-08-04",
    "fajr": "05:48",
    "syuruk": "07:10",
    "dhuhr": "13:18",
    "asr": "16:32",
    "maghrib": "19:22",
    "isha": "20:35"
  }
}
```

---

#### `GET /api/jakim/zones`
List all 52 JAKIM zones grouped by state.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "code": "WPKL01",
      "name": "Kuala Lumpur",
      "nameMs": "Kuala Lumpur",
      "state": "Wilayah Persekutuan",
      "stateMs": "Wilayah Persekutuan"
    }
  ]
}
```

---

#### `GET /api/jakim/khutbah`
Fetch JAKIM Friday/Eid khutbah entries.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "sample-1",
      "title": "Keistimewaan Bulan Ramadan",
      "titleMs": "Keistimewaan Bulan Ramadan",
      "date": "2026-03-05",
      "type": "friday",
      "contentUrl": "https://www.islam.gov.my/khutbah",
      "source": "JAKIM e-Khutbah"
    }
  ]
}
```

---

### 9.3 Ustaz AI Route

#### `POST /api/ustaz-ai`
AI-powered Islamic chatbot endpoint.

**Request:**
```json
{
  "message": "Apakah hukum solat Dhuha?",
  "persona": "ustaz-azhar",
  "history": [
    { "role": "user", "content": "Assalamualaikum" },
    { "role": "assistant", "content": "Waalaikumussalam..." }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "Solat Dhuha adalah sunnat muakkad...",
  "persona": "ustaz-azhar",
  "disclaimer": "Jawapan ini dihasilkan oleh AI..."
}
```

---

### 9.4 ASR & TTS Routes

#### `POST /api/asr`
Speech-to-text transcription.

**Request:** `FormData` with audio file  
**Response:** `{ "success": true, "text": "transcribed text" }`

#### `POST /api/tts`
Text-to-speech synthesis.

**Request:**
```json
{
  "text": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
  "lang": "ar"
}
```

**Response:** Audio stream (MP3)

---

### 9.5 OpenClaw API Routes

#### `GET /api/openclaw/status`
Gateway health check.

**Response:**
```json
{
  "success": true,
  "online": true,
  "gateway": "http://localhost:18789",
  "uptime": 3600
}
```

#### `POST /api/openclaw/chat`
OpenAI-compatible chat completions through OpenClaw Gateway.

**Request:**
```json
{
  "messages": [
    { "role": "system", "content": "You are Ustaz Azhar..." },
    { "role": "user", "content": "Apakah hukum zakat?" }
  ],
  "agentId": "ustaz-azhar",
  "model": "default"
}
```

#### `POST /api/openclaw/message`
Send a message directly to an OpenClaw agent.

**Request:**
```json
{
  "message": "Generate Islamic geometric art",
  "agentId": "islamic-artist"
}
```

#### `GET /api/openclaw/skills`
List all available OpenClaw skills.

**Response:**
```json
{
  "success": true,
  "skills": [
    { "name": "quranpulse-ustaz-ai", "version": "1.0.0", "description": "..." },
    { "name": "quranpulse-quran-search", "version": "1.0.0", "description": "..." }
  ]
}
```

#### `GET /api/openclaw/sessions`
List active agent sessions.

#### `GET /api/openclaw/cron`
List scheduled cron jobs (prayer reminders).

#### `GET /api/openclaw/models`
List available AI models.

#### `POST /api/openclaw/generate`
Generate media content (image/video/music).

**Request:**
```json
{
  "type": "image",
  "prompt": "Islamic geometric pattern with blue and gold",
  "agentId": "islamic-artist"
}
```

#### `POST /api/openclaw/web-search`
Web search via OpenClaw.

**Request:**
```json
{
  "query": "JAKIM halal certification latest update"
}
```

#### `POST /api/openclaw/schedule-prayer`
Schedule a prayer reminder.

**Request:**
```json
{
  "prayer": "maghrib",
  "zone": "WPKL01",
  "reminderMinutes": 15
}
```

---

### 9.6 Supabase API Routes

All Supabase routes follow a consistent pattern for syncing local Zustand state to the cloud:

| Route | Method | Description |
|-------|--------|-------------|
| `/api/supabase/profile` | GET/POST | Fetch or update user profile (xp, level, streak, fontSize) |
| `/api/supabase/bookmarks` | GET/POST | Fetch or sync bookmarked verses and surahs |
| `/api/supabase/reading` | GET/POST | Fetch or update reading progress |
| `/api/supabase/xp` | GET/POST | Fetch XP history or log new XP event |
| `/api/supabase/tasbih` | GET/POST | Fetch tasbih history or save new session |
| `/api/supabase/iqra` | GET/POST | Fetch or update Iqra progress |
| `/api/supabase/chat` | GET/POST | Fetch chat history or save new message |

**General pattern:**
```json
// POST request
{
  "user_id": "uuid-or-session-id",
  "data": { /* entity-specific fields */ }
}

// GET response
{
  "success": true,
  "data": { /* entity data */ }
}
```

---

<div align="center">

**QuranPulse Architecture v7.0** — *Driving the Pulse of Faith in Malaysia* 🇲🇾

</div>
