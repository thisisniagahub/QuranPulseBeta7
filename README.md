<div align="center">

# ☪️ QuranPulse

### App Mengaji AI Pertama Malaysia
**Malaysia's First AI-Powered Quran Learning App**

[![Next.js 16](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-A128CA?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

<img src="https://via.placeholder.com/800x400/1a1a4a/d4af37?text=QuranPulse" alt="QuranPulse Banner" width="800" />

*Belajar baca Al-Quran dengan AI Ustaz. Iqra 1-6 lengkap, waktu solat JAKIM, dan 15+ tool ibadah.*

</div>

---

## ✨ Features

### 📖 Al-Quran Complete
- **114 Surahs** with Arabic text, Malay (Basmeih) & English (Sahih) translations
- **Real audio recitation** from 12 renowned qaris (Mishary Alafasy, Abdul Basit, Al-Sudais, etc.)
- **Tajweed rules** reference with 10 rules and Malay descriptions
- **Word-by-word** breakdown and analysis
- **Tafsir Al-Muyassar** for verse-by-verse commentary
- **Mushaf mode** — 604-page traditional layout
- **30 Juz, 60 Hizb, 7 Manzil** structural divisions
- **14 Sajda** positions (9 recommended, 4 obligatory)

### 🤖 Ustaz AI
- **3 Persona System**: Ustaz Azhar (Fiqh), Ustazah Aishah (Akidah), Ustaz Zak (Sirah)
- **OpenClaw Agent Framework** with 5 specialized agents and 5 custom skills
- **Voice input** (ASR) and **voice output** (TTS) via z-ai-web-dev-sdk
- **Web search** for real-time Islamic knowledge
- **Islamic art generation** (non-figurative, geometric patterns only)
- **JAKIM disclaimer** on all AI-generated responses

### 🕌 Ibadah Hub
- **JAKIM Prayer Times** — 50+ zones across all Malaysian states
- **Qibla Compass** with real device orientation support
- **Tasbih Counter** with 4 dhikr categories (Azkar Pagi, Azkar Petang, Selepas Solat, Umum)
- **Hadith of the Day** — 35 authentic hadiths in Bahasa Malaysia
- **e-Khutbah** — JAKIM Friday and Eid khutbah reader
- **Islamic Calendar** — Hijri calendar with notable Islamic days

### 🎓 Iqra Digital
- **Iqra 1-6** complete digital learning system
  - Iqra 1: Hijaiyah Letters (29 letters)
  - Iqra 2: Harakat (Fathah, Kasrah, Dhammah)
  - Iqra 3: Tanwin & Mad
  - Iqra 4: Tajwid Lanjutan
  - Iqra 5: Waqaf & Ibtida
  - Iqra 6: Bacaan Al-Quran
- **Hijaiyah letter reference** with forms, harakat, and writing tips
- **14 Tajwid rules** organized in 5 categories
- **Hafazan Juz 30** — 20 short surahs with spaced repetition
- **AI Tutor** ("Tanya Cikgu") for instant guidance
- **3 Practice modes**: Flashcard, Quiz (MCQ), Matching Game

### 🏆 Gamification
- **XP system** with level progression (500 XP per level)
- **Daily streak** tracking with visual progress bars
- **Daily challenges** (10 rotating challenges with XP rewards)
- **Achievement badges** for milestones
- **Weekly activity heatmap** visualization
- **Level-up animations** with confetti effects

### 🇲🇾 Malaysian Islamic Compliance
- **JAKIM e-Solat** — Official prayer times from e-solat.gov.my via waktusolat.app
- **JAKIM Halal** — Certification lookup integration
- **JAKIM e-Khutbah** — Friday and Eid khutbah from islam.gov.my
- **Syafie Madhab** — Malaysian fiqh compliance (majority school)
- **Bahasa Melayu** — Primary interface language with full Malay translations
- **52 JAKIM Zones** — Complete coverage across all Malaysian states & territories

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend** | Next.js 16 (App Router) | React framework with server components |
| **Frontend** | React 19 | UI library |
| **Frontend** | TypeScript 5 | Type safety |
| **Frontend** | Tailwind CSS 4 | Utility-first styling |
| **Frontend** | shadcn/ui (New York) | Component library |
| **Frontend** | Framer Motion | Animations & transitions |
| **Frontend** | Lucide React | Icon library |
| **Backend** | Next.js API Routes | Serverless API handlers |
| **Backend** | z-ai-web-dev-sdk | AI capabilities (LLM, VLM, TTS, ASR, Image/Video Gen) |
| **Backend** | OpenClaw Gateway | Multi-agent AI framework |
| **Data** | Supabase (PostgreSQL) | Cloud database with RLS |
| **Data** | Zustand + persist | Client state management with localStorage |
| **Data** | In-memory Map cache | TTL-based API response caching |
| **State** | TanStack Query | Server state management (available) |
| **State** | Zustand 5 | Client state with persistence |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **npm**, **yarn**, or **bun** package manager
- **Supabase** account (for cloud sync)

### Installation

```bash
# Clone the repository
git clone https://github.com/thisisniagahub/QuranPulseBeta7.git
cd QuranPulseBeta7

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Supabase (required for cloud sync)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI SDK (required for Ustaz AI)
Z_AI_API_KEY=your-z-ai-api-key

# OpenClaw Gateway (optional, for agent features)
OPENCLAW_GATEWAY_URL=http://localhost:18789
```

### Running

```bash
# Development server
bun run dev

# Lint check
bun run lint

# Database push (Prisma)
bun run db:push
```

The app will be available at `http://localhost:3000`.

---

## 📁 Project Structure

```
quranpulse/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata & fonts
│   │   ├── page.tsx                # Main entry → SplashScreen + AppShell
│   │   ├── globals.css             # Theme variables & utilities
│   │   └── api/                    # API routes
│   │       ├── quran/              # Quran data endpoints
│   │       │   ├── surah/route.ts
│   │       │   ├── search/route.ts
│   │       │   ├── juz/route.ts
│   │       │   └── tafsir/route.ts
│   │       ├── jakim/              # JAKIM Malaysia endpoints
│   │       │   ├── solat/route.ts
│   │       │   ├── zones/route.ts
│   │       │   └── khutbah/route.ts
│   │       ├── ustaz-ai/route.ts   # AI chatbot endpoint
│   │       ├── tts/route.ts        # Text-to-speech endpoint
│   │       ├── asr/route.ts        # Speech-to-text endpoint
│   │       ├── supabase/           # Supabase sync endpoints
│   │       │   ├── profile/route.ts
│   │       │   ├── bookmarks/route.ts
│   │       │   ├── reading/route.ts
│   │       │   ├── xp/route.ts
│   │       │   ├── tasbih/route.ts
│   │       │   ├── iqra/route.ts
│   │       │   └── chat/route.ts
│   │       └── openclaw/           # OpenClaw agent endpoints
│   │           ├── status/route.ts
│   │           ├── chat/route.ts
│   │           ├── message/route.ts
│   │           ├── skills/route.ts
│   │           ├── sessions/route.ts
│   │           ├── cron/route.ts
│   │           ├── models/route.ts
│   │           ├── generate/route.ts
│   │           ├── web-search/route.ts
│   │           └── schedule-prayer/route.ts
│   ├── components/
│   │   ├── quranpulse/
│   │   │   ├── AppShell.tsx        # Main app shell with tab navigation
│   │   │   ├── SplashScreen.tsx    # Animated splash screen
│   │   │   └── tabs/
│   │   │       ├── HomeTab.tsx     # Dashboard with prayer times, daily verse
│   │   │       ├── QuranTab.tsx    # Quran reader with 114 surahs
│   │   │       ├── UstazAITab.tsx  # AI chatbot with OpenClaw integration
│   │   │       ├── IbadahTab.tsx   # Prayer times, Qibla, Tasbih, Hadith, Khutbah, Calendar
│   │   │       └── IqraTab.tsx     # Iqra 1-6 digital learning system
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   ├── quran-service.ts        # Quran data service (alquran.cloud API)
│   │   ├── quran-data.ts           # Static Quran data (114 surahs, daily verses)
│   │   ├── jakim-service.ts        # JAKIM Malaysia service (waktusolat.app API)
│   │   ├── db.ts                   # Prisma client
│   │   ├── utils.ts                # Utility functions
│   │   └── supabase/               # Supabase integration
│   │       ├── client.ts
│   │       ├── server.ts
│   │       ├── types.ts
│   │       ├── index.ts
│   │       ├── middleware.ts
│   │       └── useSupabaseSync.ts
│   ├── stores/
│   │   └── quranpulse-store.ts     # Zustand store with persist middleware
│   └── hooks/
│       ├── useOpenClaw.ts          # OpenClaw integration hook
│       ├── use-mobile.ts           # Mobile detection hook
│       └── use-toast.ts            # Toast notification hook
├── mini-services/
│   ├── openclaw-gateway/           # OpenClaw gateway service (port 3030)
│   └── quranpulse/                 # Additional mini-service
├── openclaw-workspace/             # OpenClaw agent configuration
│   ├── skills/                     # 5 custom SKILL.md files
│   ├── AGENTS.md                   # Agent personas
│   ├── MEMORY.md                   # User preferences
│   ├── SOUL.md                     # Behavioral guidelines
│   ├── HEARTBEAT.md                # Prayer reminder checklist
│   └── openclaw.json               # Gateway configuration
├── prisma/
│   └── schema.prisma               # Database schema
├── public/                         # Static assets
└── package.json
```

---

## 📡 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/quran/surah` | Fetch surah list or specific surah with ayahs |
| **GET** | `/api/quran/search` | Search Quran text (Arabic/Malay/English) |
| **GET** | `/api/quran/juz` | Fetch juz list or specific juz |
| **GET** | `/api/quran/tafsir` | Get tafsir for a specific ayah |
| **GET** | `/api/jakim/solat` | JAKIM prayer times by zone |
| **GET** | `/api/jakim/zones` | List all 52 JAKIM zones |
| **GET** | `/api/jakim/khutbah` | JAKIM Friday/Eid khutbah |
| **POST** | `/api/ustaz-ai` | AI Islamic chatbot (3 personas) |
| **POST** | `/api/tts` | Text-to-speech synthesis |
| **POST** | `/api/asr` | Speech-to-text transcription |
| **GET** | `/api/openclaw/status` | OpenClaw gateway health check |
| **POST** | `/api/openclaw/chat` | OpenAI-compatible chat completions |
| **POST** | `/api/openclaw/message` | Send message to OpenClaw agent |
| **GET** | `/api/openclaw/skills` | List available OpenClaw skills |
| **GET** | `/api/openclaw/sessions` | List active agent sessions |
| **GET** | `/api/openclaw/cron` | List scheduled prayer reminders |
| **GET** | `/api/openclaw/models` | List available AI models |
| **POST** | `/api/openclaw/generate` | Generate media (image/video/music) |
| **POST** | `/api/openclaw/web-search` | Web search via OpenClaw |
| **POST** | `/api/openclaw/schedule-prayer` | Schedule prayer reminders |
| **GET/POST** | `/api/supabase/profile` | User profile sync |
| **GET/POST** | `/api/supabase/bookmarks` | Bookmark sync |
| **GET/POST** | `/api/supabase/reading` | Reading progress sync |
| **GET/POST** | `/api/supabase/xp` | XP/level sync |
| **GET/POST** | `/api/supabase/tasbih` | Tasbih session sync |
| **GET/POST** | `/api/supabase/iqra` | Iqra progress sync |
| **GET/POST** | `/api/supabase/chat` | Chat message sync |

---

## 🏗 Architecture

### App Router (Next.js 16)
QuranPulse uses Next.js 16 App Router with a **single-page, tab-based architecture**. The `AppShell` component renders 5 tab views (`HomeTab`, `QuranTab`, `UstazAITab`, `IbadahTab`, `IqraTab`) with Framer Motion transitions, eliminating traditional page navigation.

### State Management (Zustand + Persist)
All client state is managed via a single Zustand store (`quranpulse-store.ts`) with `persist` middleware saving to `localStorage`. This includes:
- Navigation state (active tab)
- User profile (XP, level, streak)
- Bookmarks (verses, surahs)
- Reading progress
- Tasbih state & sessions
- Iqra book/page position
- Prayer zone selection
- Hafazan progress (spaced repetition)

### External APIs
- **[alquran.cloud](https://alquran.cloud)** — Quran text, translations, audio, search, tafsir
- **[waktusolat.app](https://waktusolat.app)** — JAKIM prayer times (proxy to e-solat.gov.my)
- **[aladhan.com](https://aladhan.com)** — Islamic calendar & Hijri date conversion
- **[z-ai-web-dev-sdk](https://z-ai.dev)** — LLM, VLM, TTS, ASR, Image/Video Generation

### OpenClaw Integration
5 specialized Islamic AI agents with 5 custom skills, running through the OpenClaw Gateway:
- **ustaz-azhar** (Fiqh & Hukum)
- **ustazah-aishah** (Akidah & Akhlak)
- **ustaz-zak** (Sirah & Sejarah)
- **iqra-teacher** (Iqra & Hafazan)
- **islamic-artist** (Khat & Islamic Art)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- Follow the existing code style (TypeScript, Tailwind CSS)
- Ensure all text is available in **Bahasa Melayu**
- Maintain JAKIM compliance for all religious content
- Add the JAKIM disclaimer to any AI-generated content
- Test thoroughly on mobile viewports (max-width: 480px)
- Run `bun run lint` before submitting

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **[alquran.cloud](https://alquran.cloud)** — Free Quran API with translations and audio
- **[JAKIM](https://www.islam.gov.my)** — Jabatan Kemajuan Islam Malaysia for official Islamic data
- **[waktusolat.app](https://waktusolat.app)** — Malaysian prayer time API
- **[OpenClaw](https://openclaw.ai)** — AI agent framework for multi-persona chat
- **[aladhan.com](https://aladhan.com)** — Islamic calendar API
- **[z-ai-web-dev-sdk](https://z-ai.dev)** — AI SDK for LLM, TTS, ASR, and media generation
- **[Supabase](https://supabase.com)** — Open-source Firebase alternative
- **[Next.js](https://nextjs.org)** — React framework for production

---

<div align="center">

**QuranPulse** — *Memacu Denyutan Iman Malaysia* 🇲🇾

Made with ❤️ for the Malaysian Muslim community

</div>
