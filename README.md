<div align="center">

# بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

# QuranPulse v6.0

### App Mengaji AI Pertama Malaysia

*Malaysia's First AI-Powered Quran & Iqra Digital Learning App*

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com/)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Agent-6366f1)](https://docs.openclaw.ai/)
[![JAKIM Compliant](https://img.shields.io/badge/JAKIM-Compliant-d4af37)](https://www.islam.gov.my/)

</div>

---

## Overview

QuranPulse is a full-featured Al-Quran & Iqra digital application built specifically for Malaysian Muslims. It combines authentic JAKIM-compliant Islamic content with modern AI capabilities to deliver a comprehensive learning and ibadah experience. The app features Deep Blue + Gold theming inspired by Islamic geometric art, with a mobile-first PWA design optimized for the Malaysian Muslim community.

## Features

### 📖 Al-Quran Reader
- **114 Surahs** with Arabic Uthmani script, Malay (Abdullah Basmeih) & English (Sahih International) translations
- **Real audio recitation** from CDN (Mishary Alafasy, Abdul Basit, Al-Sudais, Al-Hudhaify + 8 more)
- **4 repeat modes**: None, Single Ayah, Whole Surah, Continuous
- **Playback speed** control (0.5x - 2.0x)
- **Word-by-word** breakdown with translation
- **Tafsir Abdullah Basmeih** (Malay) integration
- **Surah/Juz/Mushaf/Hafazan/Recite** reading modes
- **Search** across Arabic, Malay, and English text
- **Bookmark** verses and surahs with persistence
- **Khatam progress tracker** (604-page Mushaf format)
- **Night reading mode** and adjustable Arabic font sizes
- **Audio sleep timer** for bedtime listening
- **14 Sajda positions** with type classification (recommended/obligatory)

### 🎓 Iqra Digital
- **6 Iqra books** with progressive learning system
  - Iqra 1: Hijaiyah Letters (29 letters)
  - Iqra 2: Harakat (Fathah, Kasrah, Dhammah)
  - Iqra 3: Tanwin & Mad
  - Iqra 4: Tajwid Lanjutan
  - Iqra 5: Waqaf & Ibtida
  - Iqra 6: Bacaan Al-Quran
- **Interactive practice**: Flashcards, Quiz, Matching game
- **Tajwid rules reference**: 14 rules across 5 categories with Quran examples
- **Hafazan tracker**: 20 short surahs with spaced repetition (SM-2 algorithm)
- **AI tutor** ("Tanya Cikgu") for real-time questions
- **XP rewards** on page completion (+25), quiz correct (+10), matching (+15), hafazan (+100)

### 🤖 Ustaz AI
- **Multi-agent AI** with 5 specialized personas:
  - Ustaz Azhar — Fiqh & Hukum (Mazhab Syafie)
  - Ustazah Aishah — Akidah & Akhlak
  - Ustaz Zak — Sirah & Sejarah Islam
  - Cikgu Iqra — Iqra & Hafazan guidance
  - Islamic Art Generator — Khat & Islamic art
- **OpenClaw integration** with OpenAI-compatible API
- **Multi-channel**: WebChat, WhatsApp, Telegram, Discord
- **Voice input/output** via ASR/TTS
- **Web search** for real-time information
- **Islamic art generation** (non-figurative, geometric patterns)
- **JAKIM disclaimer** always visible on AI responses

### 🕌 Ibadah
- **JAKIM prayer times** with 52 Malaysian zones across all 14 states
- **Live countdown** to next prayer with circular progress ring
- **Qibla compass** with device orientation API support (iOS 13+ permission)
- **Tasbih counter** with:
  - 4 dhikr categories (Azkar Pagi, Azkar Petang, Selepas Solat, Umum)
  - Vibration & sound feedback
  - Session history and statistics
  - Customizable targets (1x - 1000x)
- **Hijri calendar** with notable Islamic days
- **Hadith of the Day** — 35 authentic hadiths in Bahasa Malaysia
- **e-Khutbah reader** — JAKIM Friday/Eid/Ramadan khutbah
- **Halal status checker** — JAKIM certification lookup

### 🏠 Home Dashboard
- **Islamic greeting** based on time of day
- **Streak & XP cards** with glass morphism and animated numbers
- **Weekly activity heatmap** (7-bar contribution chart)
- **Prayer countdown** with live timer
- **Daily verse** with audio playback and word-by-word toggle
- **Daily Hikmah** (Islamic wisdom quotes)
- **Quick actions** grid with haptic feedback (+2 XP per tap)
- **Daily challenges** with XP rewards
- **Continue reading** card
- **Level-up animation** with confetti overlay

### 🇲🇾 Malaysian Compliance
- **JAKIM-certified** prayer times (e-Solat data via waktusolat.app)
- **Tafsir Abdullah Basmeih** — official Malay tafsir
- **52 JAKIM zones** covering all Malaysian states and territories
- **Hijri calendar** with Malaysian notable days (Maulidur Rasul, Israk Mikraj, etc.)
- **e-Khutbah** from JAKIM (islam.gov.my)
- **Bahasa Melayu** as primary language throughout
- **Halal certification** lookup via JAKIM portal

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.x |
| **Language** | TypeScript | 5.x |
| **UI Library** | React | 19.x |
| **Styling** | Tailwind CSS | 4.x |
| **Components** | shadcn/ui + Radix UI | Latest |
| **Animation** | Framer Motion | 12.x |
| **State** | Zustand (persist) | 5.x |
| **Database** | Supabase (PostgreSQL) | - |
| **Auth** | Supabase Auth + NextAuth | 4.x |
| **ORM** | Prisma | 6.x |
| **AI SDK** | z-ai-web-dev-sdk | 0.0.17 |
| **Agents** | OpenClaw Gateway | 6.0 |
| **Icons** | Lucide React | 0.525+ |
| **Forms** | React Hook Form + Zod | Latest |
| **Charts** | Recharts | 2.x |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.x
- npm, yarn, pnpm, or bun
- Supabase account (for cloud database)
- OpenClaw CLI (optional, for agent features)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/QuranPulse-v6.0.git
cd QuranPulse-v6.0

# Install dependencies
npm install
# or
bun install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Prisma)
DATABASE_URL=file:./dev.db

# AI (z-ai-web-dev-sdk)
Z_AI_API_KEY=your-z-ai-api-key

# OpenClaw Gateway (optional)
OPENCLAW_GATEWAY_URL=http://localhost:18789
OPENCLAW_AUTH_TOKEN=your-shared-secret
```

### Database Setup

```bash
# Run Supabase schema migration
# Copy the SQL from supabase/schema.sql into your Supabase SQL Editor

# Or use Prisma with SQLite for local development
npx prisma db push
npx prisma generate
```

### Development

```bash
# Start the Next.js dev server
npm run dev
# App available at http://localhost:3000

# Start OpenClaw Gateway (optional, in another terminal)
cd mini-services/openclaw-gateway
bun --hot index.ts
# Gateway available at http://localhost:3030

# Start Caddy reverse proxy (optional)
caddy run
# Proxy available at http://localhost:81
```

## Project Structure

```
QuranPulse-v6.0/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes
│   │   │   ├── quran/                # Quran data endpoints
│   │   │   │   ├── surah/route.ts    # GET surah list / single surah
│   │   │   │   ├── search/route.ts   # GET search Quran text
│   │   │   │   ├── juz/route.ts      # GET juz list / single juz
│   │   │   │   └── tafsir/route.ts   # GET tafsir for ayah
│   │   │   ├── jakim/                # JAKIM Malaysia endpoints
│   │   │   │   ├── solat/route.ts    # GET prayer times by zone
│   │   │   │   ├── zones/route.ts    # GET all 52 JAKIM zones
│   │   │   │   └── khutbah/route.ts  # GET Friday/Eid khutbah
│   │   │   ├── openclaw/             # OpenClaw agent endpoints
│   │   │   │   ├── status/route.ts   # GET gateway health
│   │   │   │   ├── chat/route.ts     # POST OpenAI-compat chat
│   │   │   │   ├── message/route.ts  # POST send message
│   │   │   │   ├── generate/route.ts # POST media generation
│   │   │   │   ├── web-search/route.ts # GET web search
│   │   │   │   ├── models/route.ts   # GET available models
│   │   │   │   ├── skills/route.ts   # GET agent skills
│   │   │   │   ├── sessions/route.ts # GET active sessions
│   │   │   │   ├── cron/route.ts     # GET scheduled jobs
│   │   │   │   └── schedule-prayer/route.ts # POST prayer schedule
│   │   │   ├── supabase/             # Supabase CRUD endpoints
│   │   │   │   ├── profile/route.ts  # GET/PUT user profile
│   │   │   │   ├── bookmarks/route.ts # GET/POST/DELETE bookmarks
│   │   │   │   ├── reading/route.ts  # GET/PUT reading progress
│   │   │   │   ├── chat/route.ts     # GET/POST/DELETE chat messages
│   │   │   │   ├── tasbih/route.ts   # GET/POST tasbih sessions
│   │   │   │   ├── iqra/route.ts     # GET/PUT iqra progress
│   │   │   │   └── xp/route.ts       # GET/POST XP log
│   │   │   ├── ustaz-ai/route.ts     # POST AI chatbot (classic)
│   │   │   ├── tts/route.ts          # POST text-to-speech
│   │   │   └── asr/route.ts          # POST speech-to-text
│   │   ├── globals.css               # Global styles + QuranPulse theme
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main page (AppShell + SplashScreen)
│   ├── components/
│   │   ├── quranpulse/               # Core app components
│   │   │   ├── AppShell.tsx          # 5-tab app shell with bottom nav
│   │   │   ├── SplashScreen.tsx      # Animated splash with Bismillah
│   │   │   └── tabs/                 # Tab content components
│   │   │       ├── HomeTab.tsx       # Dashboard, stats, daily verse
│   │   │       ├── QuranTab.tsx      # Quran reader with audio
│   │   │       ├── UstazAITab.tsx    # AI chat with OpenClaw
│   │   │       ├── IbadahTab.tsx     # Prayer, Qibla, Tasbih, Calendar
│   │   │       └── IqraTab.tsx       # Iqra learning system
│   │   └── ui/                       # shadcn/ui components (45+)
│   ├── lib/
│   │   ├── quran-service.ts          # Quran API service (alquran.cloud)
│   │   ├── quran-data.ts             # Static Quran data (114 surahs, daily verses)
│   │   ├── jakim-service.ts          # JAKIM Malaysia service (prayer, halal, khutbah)
│   │   ├── db.ts                     # Prisma client
│   │   ├── utils.ts                  # Utility functions
│   │   └── supabase/                 # Supabase integration
│   │       ├── client.ts             # Browser client
│   │       ├── server.ts             # Server client
│   │       ├── middleware.ts         # Auth middleware
│   │       ├── useSupabaseSync.ts    # State sync hook
│   │       ├── types.ts              # Database types
│   │       └── index.ts              # Re-exports
│   ├── stores/
│   │   └── quranpulse-store.ts       # Zustand store (persisted)
│   ├── hooks/
│   │   ├── useOpenClaw.ts            # OpenClaw integration hook
│   │   ├── use-mobile.ts             # Mobile detection hook
│   │   └── use-toast.ts              # Toast notification hook
│   └── middleware.ts                  # Next.js middleware (auth)
├── supabase/
│   └── schema.sql                    # Full database schema (9 tables + RLS)
├── openclaw-workspace/
│   ├── openclaw.json                 # OpenClaw configuration
│   ├── AGENTS.md                     # Agent directory
│   └── skills/                       # 5 SKILL.md files
│       ├── quranpulse-ustaz-ai.md
│       ├── quranpulse-quran-search.md
│       ├── quranpulse-prayer-ibadah.md
│       ├── quranpulse-islamic-art.md
│       └── quranpulse-iqra-hafazan.md
├── mini-services/
│   ├── openclaw-gateway/             # OpenClaw gateway bridge
│   │   ├── index.ts                  # HTTP API server (port 3030)
│   │   └── package.json
│   └── quranpulse/                   # QuranPulse mini-service
│       ├── index.ts
│       └── package.json
├── prisma/
│   └── schema.prisma                 # Prisma schema (SQLite)
├── public/                           # Static assets
│   ├── icons/                        # App icons and logos
│   ├── audio/hijaiyah/               # 29 hijaiyah letter audio files
│   ├── iqra_json/                    # Iqra book data (JSON)
│   ├── books/                        # Iqra PDF books (1-6)
│   └── assets/                       # Images, backgrounds, patterns
├── Caddyfile                         # Caddy reverse proxy config
└── package.json
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/quran/surah` | GET | Fetch surah list or complete surah with ayahs |
| `/api/quran/search` | GET | Search Quran text (ar/ms/en) |
| `/api/quran/juz` | GET | Fetch juz list or specific juz |
| `/api/quran/tafsir` | GET | Get tafsir for an ayah |
| `/api/jakim/solat` | GET | JAKIM prayer times by zone & date |
| `/api/jakim/zones` | GET | All 52 JAKIM zones grouped by state |
| `/api/jakim/khutbah` | GET | JAKIM Friday/Eid/Ramadan khutbah |
| `/api/ustaz-ai` | POST | Classic AI chatbot (LLM) |
| `/api/tts` | POST | Text-to-speech |
| `/api/asr` | POST | Speech-to-text |
| `/api/openclaw/status` | GET | Gateway health check |
| `/api/openclaw/chat` | POST | OpenAI-compatible chat completions |
| `/api/openclaw/message` | POST | Send message to OpenClaw agent |
| `/api/openclaw/generate` | POST | Media generation (image/video/music) |
| `/api/openclaw/web-search` | GET | Web search via OpenClaw |
| `/api/openclaw/models` | GET | Available AI models |
| `/api/openclaw/skills` | GET | Agent skills list |
| `/api/openclaw/sessions` | GET | Active sessions |
| `/api/openclaw/cron` | GET | Scheduled cron jobs |
| `/api/openclaw/schedule-prayer` | POST | Schedule prayer reminders |
| `/api/supabase/profile` | GET/PUT | User profile CRUD |
| `/api/supabase/bookmarks` | GET/POST/DELETE | Verse & surah bookmarks |
| `/api/supabase/reading` | GET/PUT | Reading progress |
| `/api/supabase/chat` | GET/POST/DELETE | Chat history |
| `/api/supabase/tasbih` | GET/POST | Tasbih session log |
| `/api/supabase/iqra` | GET/PUT | Iqra progress |
| `/api/supabase/xp` | GET/POST | XP log |

## Supabase Schema

The database consists of **9 tables** with Row Level Security (RLS):

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profiles (XP, level, streak, font) | Owner only |
| `bookmarked_verses` | Verse bookmarks | Owner only |
| `bookmarked_surahs` | Surah bookmarks | Owner only |
| `reading_progress` | Last read position | Owner only |
| `tasbih_sessions` | Tasbih counter sessions | Owner only |
| `iqra_progress` | Iqra book progress per page | Owner only |
| `chat_messages` | Ustaz AI chat history | Owner only |
| `xp_log` | XP gain audit trail | Owner only |
| `anonymous_sessions` | Non-auth user data (JSONB) | Public |

Key database features:
- Auto-profile creation on signup (trigger: `handle_new_user`)
- Auto-updating `updated_at` timestamps (trigger: `update_updated_at`)
- Full RLS with `auth.uid()` policy on all user-scoped tables
- Anonymous sessions for non-authenticated usage

## OpenClaw Integration

QuranPulse integrates with [OpenClaw](https://docs.openclaw.ai/) for multi-agent AI capabilities:

- **5 Specialized Agents**: Ustaz Azhar (Fiqh), Ustazah Aishah (Akidah), Ustaz Zak (Sirah), Cikgu Iqra (Iqra/Hafazan), Islamic Art Generator
- **5 Custom Skills**: quranpulse-ustaz-ai, quranpulse-quran-search, quranpulse-prayer-ibadah, quranpulse-islamic-art, quranpulse-iqra-hafazan
- **OpenAI-Compatible API**: Drop-in replacement for any OpenAI client via `/api/openclaw/chat`
- **Multi-Channel Support**: WebChat (enabled), WhatsApp, Telegram, Discord (configurable)
- **Graceful Fallback**: All features work in Classic Chat mode when Gateway is offline
- **Gateway Bridge**: `mini-services/openclaw-gateway/` proxies requests to OpenClaw Gateway (port 18789)

## Theme — Deep Blue + Gold

The app uses a monochromatic deep blue palette with gold accents, inspired by Islamic geometric art:

| Variable | Color | Usage |
|----------|-------|-------|
| `--qp-bg-deep` | `#1a1a4a` | Background |
| `--qp-bg-medium` | `#2a2a6a` | Cards, surfaces |
| `--qp-accent` | `#4a4aa6` | Primary accent, active states |
| `--qp-accent-light` | `#6a6ab6` | Lighter accent, gradients |
| `--qp-gold` | `#d4af37` | Gold highlights, badges, CTAs |
| `--qp-gold-light` | `#e0c060` | Lighter gold, hover states |
| `--qp-text` | `#ffffff` | Primary text |
| `--qp-text-secondary` | `#cccccc` | Secondary text |
| `--qp-text-muted` | `#8888aa` | Muted text |

Custom CSS utilities: `.qp-geometric-bg` (Islamic star pattern), `.qp-card-shimmer`, `.qp-accent-glow`, `.qp-gold-glow`, `.qp-scroll` (custom scrollbar).

## State Management

The Zustand store (`src/stores/quranpulse-store.ts`) manages all client state with localStorage persistence:

```typescript
// Key state slices
interface QuranPulseState {
  // Navigation
  activeTab: TabId

  // User profile
  xp: number          // Experience points
  level: number       // Calculated: floor(xp / 500) + 1
  streak: number      // Daily login streak

  // Reading
  lastReadSurah: number | null
  lastReadVerse: number | null
  khatamPages: number[]  // 1-604 pages read

  // Bookmarks
  bookmarkedVerses: BookmarkedVerse[]
  bookmarkedSurahs: BookmarkedSurah[]

  // Ibadah
  prayerZone: string  // JAKIM zone code (e.g., 'WPKL01')
  tasbihCount: number
  tasbihSessions: TasbihSession[]

  // Iqra
  iqraBook: number    // 1-6
  iqraPage: number

  // Hafazan (spaced repetition)
  hafazanProgress: HafazanVerseProgress[]
}
```

Persistence uses `zustand/middleware/persist` with `createJSONStorage` for SSR-safe localStorage.

## Contributing

We welcome contributions from the community! Please follow these guidelines:

1. **Fork** the repository and create a feature branch
2. **Follow** the Deep Blue + Gold theme consistently
3. **Maintain** JAKIM compliance for all religious content
4. **Write** in Bahasa Melayu for UI text, English for code
5. **Add** XP rewards for new gamification features
6. **Test** all API routes with proper error handling
7. **Ensure** graceful fallback when external APIs are unavailable
8. **Submit** a pull request with a clear description

### Code Style

- TypeScript strict mode enabled
- `'use client'` directive for all interactive components
- Framer Motion for animations (no CSS animations for interactive elements)
- Zustand for state (no React Context for app state)
- API routes with 5-10 second timeouts and graceful error handling

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **JABATAN KEMAJUAN ISLAM MALAYSIA (JAKIM)** — for e-Solat prayer time data, e-Khutbah, and Halal certification data
- **[alquran.cloud API](https://alquran.cloud/)** — for Quran Arabic text, translations, audio, and tafsir
- **[waktusolat.app](https://waktusolat.app/)** — for JAKIM prayer time API proxy
- **Tafsir Abdullah Basmeih** — the official Malay tafsir of Al-Quran
- **[OpenClaw](https://openclaw.ai/)** — for multi-agent AI framework and gateway
- **[Supabase](https://supabase.com/)** — for authentication, database, and real-time features
- **Islamic geometric art** — for the design inspiration behind our Deep Blue + Gold theme

---

<div align="center">

*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ*

**QuranPulse** — Mengaji, Beribadah, Bertanya. Semua dalam satu app.

</div>
