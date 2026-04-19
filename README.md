<div align="center">

# ☪️ QuranPulse v6.0

### App Mengaji AI Pertama Malaysia
**Malaysia's First AI-Powered Quran Learning App**

[![Next.js 16](https://img.shields.io/badge/Next.js-16.1.3-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-Agent_Framework-FF6B35?logo=robot&logoColor=white)](https://openclaw.ai)
[![PWA](https://img.shields.io/badge/PWA-Ready-A128CA?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<img src="public/icons/icon-512.png" alt="QuranPulse Icon" width="120" height="120" style="border-radius: 24px; box-shadow: 0 4px 20px rgba(212,175,55,0.4);" />

*Belajar baca Al-Quran dengan AI Ustaz. Iqra 1-6 lengkap, waktu solat JAKIM, dan 15+ tool ibadah.*

**"Memacu Denyutan Iman Malaysia"** — Driving the Pulse of Faith in Malaysia 🇲🇾

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
  - [Home Dashboard](#-home-dashboard)
  - [Quran Reader](#-quran-reader)
  - [Ustaz AI](#-ustaz-ai)
  - [Ibadah Hub](#-ibadah-hub)
  - [Iqra Digital](#-iqra-digital)
  - [Gamification](#-gamification)
  - [Malaysian Islamic Compliance](#-malaysian-islamic-compliance)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [API Routes](#-api-routes)
- [Project Structure](#-project-structure)
- [Malaysian Compliance](#-malaysian-compliance)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🌙 Overview

**QuranPulse v6.0** is the definitive Islamic learning app for Malaysian Muslims — combining the complete Al-Quran reading experience, AI-powered Islamic guidance through multiple Ustaz personas, a structured Iqra 1-6 digital learning system, and JAKIM-compliant ibadah tools in a single, beautifully designed mobile-first PWA.

### Mission

To make Quran learning, Islamic education, and daily ibadah accessible, engaging, and authentically Malaysian for Muslims of all ages — from students learning Iqra to adults seeking daily spiritual guidance.

### Target Audience

| Segment | Age | Description | Primary Need |
|---------|-----|-------------|--------------|
| **Student Iqra** | 12-18 | Secondary school student learning Quran | Structured Iqra lessons, gamification, fun practice |
| **Young Professional** | 25-35 | Working adult seeking daily Islamic guidance | Prayer times, quick Quran reading, AI answers |
| **Parent** | 30-50 | Parent teaching children Quran | Iqra digital tools, hafazan tracking, family features |

### Design Identity

- **Deep Blue** `#1a1a4a` — Background, representing depth of knowledge
- **Medium Blue** `#2a2a6a` — Card surfaces, layering
- **Accent Blue** `#4a4aa6` — Primary actions, interactive elements
- **Light Blue** `#6a6ab6` — Secondary elements, highlights
- **Gold** `#d4af37` — Premium accents, Islamic heritage

---

## ✨ Features

### 🏠 Home Dashboard

The Home tab provides a personalized spiritual dashboard at a glance:

| Feature | Description |
|---------|-------------|
| **Islamic Greeting** | Time-based greeting (Selamat Pagi/Petang/Malam) with Arabic salutation |
| **Prayer Countdown** | Live countdown timer to next prayer with circular SVG progress ring |
| **Daily Verse** | Ayat of the day with Arabic text, Malay translation, and audio playback (TTS) |
| **Streak & XP Cards** | Glass morphism cards with animated number transitions and progress bars |
| **Daily Hadith** | Rotating hadith from 15 authentic sources with gold-themed cards |
| **Quick Actions** | 6-button grid (Quran, Ustaz AI, Solat, Iqra, Tasbih, Kiblat) with haptic feedback |
| **Daily Challenges** | 10 rotating Islamic challenges with XP rewards |
| **Continue Reading** | Resume where you left off with last-read surah/ayah tracking |
| **Weekly Heatmap** | 7-bar activity chart showing daily engagement |

### 📖 Quran Reader

Complete Al-Quran reading experience with professional features:

| Feature | Details |
|---------|---------|
| **114 Surahs** | Full surah list with Arabic name, English name, Malay name, ayah count, revelation type |
| **Search & Filter** | Text search + Makkiyah/Madaniyyah filter |
| **Triple Translation** | Arabic (Uthmani script) + Malay (Basmeih) + English (Sahih International) side by side |
| **Real Audio Recitation** | Streaming from `cdn.islamic.network` with 12 renowned qaris |
| **4 Repeat Modes** | None (stop), Single ayah repeat, Surah repeat, Continuous (auto-next surah) |
| **Playback Speed** | 0.5x to 2.0x with real-time adjustment |
| **Reciter Selection** | Mishary Alafasy, Abdul Basit, Al-Sudais, Al-Ghamdi, Al-Hudhaify, Al-Minshawi, Al-Husary, Maher Al Muaiqly, Ahmed Al-Ajamy, Abdullah Basfar, Ayman Suwayd, Fares Abbad |
| **Word-by-Word** | Per-word Arabic text display with index tracking |
| **A-B Repeat** | Select start and end ayahs for focused repetition practice |
| **Tafsir Al-Muyassar** | Verse-by-verse commentary from al-Muyassar edition |
| **Tajwid Rules** | 10 rules with Malay descriptions and Quran examples |
| **Bookmarks** | Per-verse and per-surah bookmarking with localStorage persistence |
| **30 Juz Navigation** | Complete juz structure with surah/ayah mapping |
| **14 Sajda Positions** | 9 recommended + 4 obligatory sajda indicators |
| **Khatam Progress** | 604-page Mushaf tracking with page-read markers |
| **Night Reading Mode** | Dedicated low-light reading mode |
| **Arabic Font Sizes** | Small, Medium, Large, X-Large options |
| **Recent Searches** | Last 10 search queries with clear option |
| **Sleep Timer** | Audio sleep timer (0/15/30/60 minutes) |

### 🤖 Ustaz AI

AI-powered Islamic guidance with multi-agent architecture:

| Feature | Details |
|---------|---------|
| **3 Persona System** | Ustaz Azhar (Fiqh & Hukum), Ustazah Aishah (Akidah & Akhlak), Ustaz Zak (Sirah & Sejarah) |
| **OpenClaw Integration** | 5 specialized agents with OpenAI-compatible API |
| **Voice Input (ASR)** | 10-second auto-stop speech-to-text via `z-ai-web-dev-sdk` |
| **Voice Output (TTS)** | Text-to-speech playback on AI messages |
| **Web Search** | Real-time Islamic knowledge search via OpenClaw |
| **Islamic Art Generation** | Non-figurative, geometric pattern image generation |
| **Video & Music Gen** | Nasheed and Islamic content video generation |
| **Message Reactions** | Emoji reactions (👍 ❤️ 🤲 ✨ 🕌) on assistant messages |
| **Copy Message** | One-tap copy of AI responses |
| **JAKIM Disclaimer** | Permanent, non-dismissible disclaimer on all AI content |
| **Classic Chat Fallback** | Graceful fallback to `z-ai-web-dev-sdk` LLM when Gateway offline |
| **Tools Panel** | 9 tool badges: Web Search, Islamic Art, Voice Output, Prayer Reminders, Quran Search, Prayer Times, Video Gen, Music Gen, PDF Tool |
| **Quick Actions** | "Generate Islamic Art", "Search Quran", "Prayer Times" suggestion chips |

**OpenClaw Agent Routing:**

| Agent ID | Persona | Specialization | Skill |
|----------|---------|---------------|-------|
| `ustaz-azhar` | Ustaz Azhar | Fiqh & Hukum | `quranpulse-ustaz-ai` |
| `ustazah-aishah` | Ustazah Aishah | Akidah & Akhlak | `quranpulse-ustaz-ai` |
| `ustaz-zak` | Ustaz Zak | Sirah & Sejarah | `quranpulse-ustaz-ai` |
| `iqra-teacher` | Cikgu Iqra | Iqra & Hafazan | `quranpulse-iqra-hafazan` |
| `islamic-artist` | Seniman Islam | Khat & Islamic Art | `quranpulse-islamic-art` |

### 🕌 Ibadah Hub

Comprehensive Islamic worship toolkit with 6 sub-tabs:

| Sub-Tab | Features |
|---------|----------|
| **Waktu Solat** | JAKIM prayer times for 52 zones, countdown timer, zone selector, current/next prayer highlighting |
| **Kiblat** | Qibla compass with real device orientation API, iOS 13+ permission handling, 292.5° KL fallback, tick marks |
| **Tasbih** | Digital counter with circular progress ring, 4 dhikr categories, vibration patterns (10/30/60ms), AudioContext sound, session history |
| **Hadis** | 35 authentic hadiths in Bahasa Malaysia from Bukhari, Muslim, At-Tirmidzi, Abu Daud with daily rotation |
| **Khutbah** | JAKIM e-Khutbah reader (Jumaat/Hari Raya/Ramadan), list + detail views, external link to islam.gov.my |
| **Kalendar** | Hijri calendar with month navigation, 12-month grid, notable Islamic days (Awal Muharram, Maulidur Rasul, Israk Mikraj, etc.) |

**JAKIM Zone Coverage (52 Zones):**

```
Wilayah Persekutuan: WPKL01 (KL), WPS01 (Putrajaya), WPL01 (Labuan)
Johor: JHR01-04 | Kedah: KDH01-07 | Kelantan: KTN01-02
Melaka: MLK01 | Negeri Sembilan: NSN01-02 | Pahang: PHS01-02
Pulau Pinang: PNG01 | Perak: PRK01-07 | Sabah: SBH01-07
Sarawak: SWK01-09 | Selangor: SGR01-04 | Terengganu: TRG01-02
Perlis: PLS01
```

### 🎓 Iqra Digital

Structured Iqra 1-6 digital learning system with AI tutoring:

| Book | Content | Focus |
|------|---------|-------|
| **Iqra 1** | 29 Hijaiyah letters | Letter recognition with forms, harakat, writing tips |
| **Iqra 2** | Harakat combinations | Fathah (َ), Kasrah (ِ), Dhammah (ُ) practice |
| **Iqra 3** | Tanwin & Madd | 6 rules with symbols and examples |
| **Iqra 4** | Tajwid Lanjutan | Advanced tajwid practice |
| **Iqra 5** | Waqaf & Ibtida | Stopping and starting rules |
| **Iqra 6** | Bacaan Al-Quran | Complete surah reading practice |

**Learning Features:**

| Feature | Description |
|---------|-------------|
| **AI Tutor** | "Tanya Cikgu" bottom sheet chat via `/api/ustaz-ai` (iqra-teacher persona) |
| **Flashcard Mode** | Flip cards: letter front → name + harakat back (+5 XP) |
| **Quiz Mode** | 4-option MCQ with scoring and audio hints (+10 XP per correct) |
| **Matching Game** | 6 Arabic letter → name pairs in grid (+15 XP on completion) |
| **Tajwid Reference** | 14 rules in 5 categories with expandable cards and mastery tracking |
| **Hafazan Juz 30** | 20 short surahs with spaced repetition (new → learning(4h) → review(1d) → mastered(7d)) |
| **Hijaiyah Letters** | 29-letter reference with filter (All/Hijaiyah/Harakat/Tanwin/Mad) |
| **Progress Dashboard** | Overall + per-book progress, tajwid mastery (X/14), hafazan tracking |
| **XP Rewards** | Page completion (+25), quiz (+10), flashcard (+5), matching (+15), hafazan surah (+100) |

### 🏆 Gamification

| System | Details |
|--------|---------|
| **XP Points** | Earned from all learning activities (2-100 XP per action) |
| **Level System** | `level = Math.floor(xp / 500) + 1` with persistent tracking |
| **Daily Streak** | Consecutive day tracking with visual progress bars |
| **Daily Challenges** | 10 rotating challenges based on day of year |
| **Level-Up Animation** | Full-screen confetti overlay with spring animation (3 seconds) |
| **Weekly Heatmap** | 7-bar engagement visualization |

**XP Reward Table:**

| Action | XP |
|--------|-----|
| Quick action tap | +2 |
| Continue reading | +5 |
| Flashcard navigation | +5 |
| Quiz correct answer | +10 |
| Hafazan verse | +10 |
| Page completion (Iqra) | +25 |
| Matching game complete | +15 |
| Hafazan surah complete | +100 |

### 🇲🇾 Malaysian Islamic Compliance

QuranPulse is built from the ground up for Malaysian Muslims:

- **JAKIM e-Solat** — Official prayer times from `e-solat.gov.my` via `waktusolat.app`
- **JAKIM Halal** — Certification lookup from `halal.gov.my`
- **JAKIM e-Khutbah** — Friday and Eid khutbah from `islam.gov.my`
- **Syafie Madhab** — All fiqh rulings follow Imam Syafie's school (majority in Malaysia)
- **Bahasa Melayu** — Primary interface language with full Malay translations
- **52 JAKIM Zones** — Complete coverage across all 13 states + 3 federal territories
- **Basmeih Translation** — Official Malaysian Quran translation (Abdullah Basmeih)
- **Malay Prayer Names** — Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak
- **Hijri Calendar** — Malaysian notable Islamic days with Malay names

---

## 🛠 Tech Stack

### Core Framework

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js (App Router) | 16.1.3 | React framework with server components & API routes |
| **UI Library** | React | 19.0.0 | Component-based UI |
| **Language** | TypeScript | 5.x | Type safety throughout |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS with custom properties |
| **Components** | shadcn/ui (New York) | Latest | Accessible, composable UI components |
| **Animations** | Framer Motion | 12.x | Tab transitions, micro-interactions, spring physics |

### Backend & Data

| Category | Technology | Purpose |
|----------|-----------|---------|
| **API Routes** | Next.js Route Handlers | Serverless API handlers (28 routes) |
| **AI SDK** | z-ai-web-dev-sdk | LLM, VLM, TTS, ASR, Image/Video Generation |
| **Agent Framework** | OpenClaw Gateway | Multi-agent AI with OpenAI-compatible API |
| **Database** | Supabase (PostgreSQL) | Cloud database with Row-Level Security |
| **ORM** | Prisma | SQLite client (available for future use) |
| **State** | Zustand 5 + persist | Client state with localStorage persistence |
| **Server State** | TanStack Query | Available for server state management |

### External APIs

| API | Purpose | Base URL |
|-----|---------|----------|
| **alquran.cloud** | Quran text, translations, audio, search, tafsir | `api.alquran.cloud/v1` |
| **waktusolat.app** | JAKIM prayer times (proxy to e-solat.gov.my) | `api.waktusolat.app` |
| **aladhan.com** | Islamic calendar & Hijri date conversion | `api.aladhan.com/v1` |
| **islam.gov.my** | JAKIM khutbah content | `islam.gov.my/api` |
| **halal.gov.my** | JAKIM halal certification lookup | `halal.gov.my/v2/api` |
| **CDN** | Islamic Network | Quran audio streaming (128kbps MP3) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **npm**, **yarn**, or **bun** package manager
- **Supabase** account (for cloud sync features)
- **z-ai-web-dev-sdk** API key (for Ustaz AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/thisisniagahub/QuranPulseBeta7.git
cd QuranPulseBeta7

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables

```env
# ─── Supabase (required for cloud sync) ───
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── AI SDK (required for Ustaz AI) ───
Z_AI_API_KEY=your-z-ai-api-key

# ─── OpenClaw Gateway (optional, for agent features) ───
OPENCLAW_GATEWAY_URL=http://localhost:18789
```

### Running

```bash
# Development server (port 3000)
bun run dev

# Lint check
bun run lint

# Database push (Prisma/SQLite)
bun run db:push

# Generate Prisma client
bun run db:generate
```

The app will be available at `http://localhost:3000`.

### Mini Services

```bash
# Start OpenClaw Gateway (port 3030)
cd mini-services/openclaw-gateway && bun run dev
```

---

## 🏗 Architecture

### High-Level System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                            │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Next.js 16 App Router                       │  │
│  │                                                                │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │  │
│  │  │ HomeTab  │ │ QuranTab │ │UstazAITab│ │ IbadahTab│        │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │  │
│  │  ┌──────────┐                                                 │  │
│  │  │ IqraTab  │     AppShell (5-Tab Bottom Navigation)         │  │
│  │  └──────────┘                                                 │  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐    │  │
│  │  │       Zustand Store + localStorage Persist              │    │  │
│  │  │  (Navigation, XP, Streak, Bookmarks, Tasbih, Hafazan)  │    │  │
│  │  └────────────────────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
                                │
                      ┌─────────┴─────────┐
                      │   Caddy Gateway    │
                      │   (Port 443/80)    │
                      └─────────┬─────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         │                      │                       │
    ┌────▼──────┐        ┌──────▼──────┐        ┌──────▼──────┐
    │ Next.js   │        │ OpenClaw    │        │  External   │
    │ API       │        │ Gateway     │        │  APIs       │
    │ (Port     │        │ (Port 3030) │        │             │
    │  3000)    │        │             │        │  • alquran  │
    │           │        │ Routes to   │        │  • waktusolat│
    │ /api/*    │        │ OpenClaw    │        │  • aladhan  │
    │ (28 routes│        │ (Port 18789)│        │  • halal    │
    │  total)   │        │             │        │  • islam    │
    └────┬──────┘        └──────┬──────┘        └─────────────┘
         │                      │
    ┌────▼──────┐        ┌──────▼──────┐
    │ Supabase  │        │ OpenClaw    │
    │ (Cloud    │        │ Agents &    │
    │  PG+RLS)  │        │ Skills      │
    │ 9 tables  │        │ 5 agents    │
    └───────────┘        │ 5 skills    │
                         └─────────────┘
```

### Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Single-page, tab-based** | Instant tab switching, no page navigation latency |
| **Zustand + persist** | Offline-first, localStorage persistence, no server dependency |
| **In-memory caching** | 1-hour TTL for API data, graceful offline fallback |
| **OpenClaw Gateway** | OpenAI-compatible API, multi-agent routing, skill system |
| **Supabase RLS** | Row-Level Security on all 9 tables, user data isolation |
| **CDN audio streaming** | Direct client-to-CDN streaming, no server proxy needed |

---

## 📡 API Routes

### Quran Data (4 routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/quran/surah` | Fetch surah list (114) or specific surah with ayahs (`?number=1`) |
| **GET** | `/api/quran/search` | Search Quran text in Arabic, Malay, or English (`?q=rahman&language=ms`) |
| **GET** | `/api/quran/juz` | Fetch juz list (30) or specific juz with ayahs (`?number=1`) |
| **GET** | `/api/quran/tafsir` | Get tafsir for a specific ayah (`?surah=1&ayah=1`) |

### JAKIM Malaysia (3 routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/jakim/solat` | JAKIM prayer times by zone (`?zone=WPKL01&date=2026-03-05`) |
| **GET** | `/api/jakim/zones` | List all 52 JAKIM zones grouped by state |
| **GET** | `/api/jakim/khutbah` | JAKIM Friday/Eid/Ramadan khutbah entries |

### AI & Media (3 routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/ustaz-ai` | AI Islamic chatbot (3 personas, JAKIM-compliant) |
| **POST** | `/api/tts` | Text-to-speech synthesis (Arabic, Malay, English) |
| **POST** | `/api/asr` | Speech-to-text transcription (voice input) |

### OpenClaw Agent Framework (10 routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/openclaw/status` | Gateway health check (online/offline status) |
| **POST** | `/api/openclaw/chat` | OpenAI-compatible chat completions |
| **POST** | `/api/openclaw/message` | Send message to specific OpenClaw agent |
| **GET** | `/api/openclaw/skills` | List available OpenClaw skills (5 custom skills) |
| **GET** | `/api/openclaw/sessions` | List active agent sessions |
| **GET** | `/api/openclaw/cron` | List scheduled prayer reminder jobs |
| **GET** | `/api/openclaw/models` | List available AI models |
| **POST** | `/api/openclaw/generate` | Generate media (image/video/music) |
| **POST** | `/api/openclaw/web-search` | Web search via OpenClaw agents |
| **POST** | `/api/openclaw/schedule-prayer` | Schedule prayer time reminders |

### Supabase Cloud Sync (7 routes)

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET/POST** | `/api/supabase/profile` | User profile sync (XP, level, streak, font size) |
| **GET/POST** | `/api/supabase/bookmarks` | Verse and surah bookmark sync |
| **GET/POST** | `/api/supabase/reading` | Reading progress sync (last surah/ayah) |
| **GET/POST** | `/api/supabase/xp` | XP history and event logging |
| **GET/POST** | `/api/supabase/tasbih` | Tasbih session history sync |
| **GET/POST** | `/api/supabase/iqra` | Iqra book/page progress sync |
| **GET/POST** | `/api/supabase/chat` | Chat message history sync |

---

## 📁 Project Structure

```
quranpulse/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout (metadata, fonts, Toaster)
│   │   ├── page.tsx                      # Entry: SplashScreen → AppShell
│   │   ├── globals.css                   # Deep Blue theme, animations, utilities
│   │   └── api/                          # 28 API routes
│   │       ├── quran/                    # Quran data (4 routes)
│   │       │   ├── surah/route.ts
│   │       │   ├── search/route.ts
│   │       │   ├── juz/route.ts
│   │       │   └── tafsir/route.ts
│   │       ├── jakim/                    # JAKIM Malaysia (3 routes)
│   │       │   ├── solat/route.ts
│   │       │   ├── zones/route.ts
│   │       │   └── khutbah/route.ts
│   │       ├── ustaz-ai/route.ts         # AI chatbot
│   │       ├── tts/route.ts              # Text-to-speech
│   │       ├── asr/route.ts              # Speech-to-text
│   │       ├── supabase/                 # Cloud sync (7 routes)
│   │       │   ├── profile/route.ts
│   │       │   ├── bookmarks/route.ts
│   │       │   ├── reading/route.ts
│   │       │   ├── xp/route.ts
│   │       │   ├── tasbih/route.ts
│   │       │   ├── iqra/route.ts
│   │       │   └── chat/route.ts
│   │       └── openclaw/                 # Agent framework (10 routes)
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
│   │   │   ├── AppShell.tsx              # Main shell: tab nav + AnimatePresence
│   │   │   ├── SplashScreen.tsx          # 2.5s animated splash with AI logo
│   │   │   └── tabs/
│   │   │       ├── HomeTab.tsx           # Dashboard: prayers, verse, streaks
│   │   │       ├── QuranTab.tsx          # Full Quran reader + audio
│   │   │       ├── UstazAITab.tsx        # AI chat with OpenClaw
│   │   │       ├── IbadahTab.tsx         # 6 sub-tabs: solat, kiblat, tasbih...
│   │   │       └── IqraTab.tsx           # Iqra 1-6 + AI tutor + practice
│   │   └── ui/                           # shadcn/ui (New York style)
│   ├── lib/
│   │   ├── quran-service.ts              # alquran.cloud API + 1h cache + fallback
│   │   ├── quran-data.ts                 # Static: 114 surahs, 30 verses, prayer names
│   │   ├── jakim-service.ts              # waktusolat.app API + 52 zones + halal
│   │   ├── db.ts                         # Prisma client (SQLite)
│   │   ├── utils.ts                      # Utility functions (cn, etc.)
│   │   └── supabase/                     # Supabase integration
│   │       ├── client.ts                 # Browser Supabase client
│   │       ├── server.ts                 # Server Supabase client
│   │       ├── types.ts                  # 9 database table types
│   │       ├── index.ts                  # Barrel exports
│   │       ├── middleware.ts             # Auth middleware
│   │       └── useSupabaseSync.ts        # React hook for cloud sync
│   ├── stores/
│   │   └── quranpulse-store.ts           # Zustand store (30+ fields, persist)
│   └── hooks/
│       ├── useOpenClaw.ts                # OpenClaw status, chat, generate, search
│       ├── use-mobile.ts                 # Mobile viewport detection
│       └── use-toast.ts                  # Toast notification hook
├── mini-services/
│   └── openclaw-gateway/                 # OpenClaw proxy (port 3030)
│       ├── package.json
│       └── index.ts
├── openclaw-workspace/                   # OpenClaw agent configuration
│   ├── openclaw.json                     # 5 agents, multi-channel config
│   ├── AGENTS.md                         # Agent directory
│   ├── MEMORY.md                         # User preferences (BM, KL timezone)
│   ├── SOUL.md                           # Behavioral guidelines
│   ├── HEARTBEAT.md                      # Prayer reminder checklist
│   └── skills/                           # 5 custom SKILL.md files
│       ├── quranpulse-ustaz-ai.md
│       ├── quranpulse-quran-search.md
│       ├── quranpulse-prayer-ibadah.md
│       ├── quranpulse-islamic-art.md
│       └── quranpulse-iqra-hafazan.md
├── prisma/
│   └── schema.prisma                     # Database schema
├── public/
│   └── icons/                            # App icons and splash images
├── package.json
├── README.md
├── PRD.md
├── ARCHITECTURE.md
└── Caddyfile                             # Gateway configuration
```

---

## 🇲🇾 Malaysian Compliance

QuranPulse adheres to Malaysian Islamic standards throughout:

### JAKIM e-Solat Integration
- **Source:** `e-solat.gov.my` via `waktusolat.app` API proxy
- **Zones:** Complete 52 JAKIM zones across all Malaysian states
- **Accuracy:** Prayer times verified against JAKIM official ±2 minutes
- **Names:** Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak (Malay)

### JAKIM Halal Certification
- **Source:** `halal.gov.my` API
- **Statuses:** Halal, Not Halal, Pending, Unknown
- **Display:** Certificate expiry date and JAKIM source attribution

### JAKIM e-Khutbah
- **Source:** `islam.gov.my` khutbah API
- **Types:** Jumaat (Friday), Hari Raya (Eid), Ramadan
- **Attribution:** "Sumber: JAKIM e-Khutbah" on all khutbah content

### Syafie Madhab Compliance
- **School:** All fiqh rulings follow Imam Syafie's school (Malaysian majority)
- **AI Responses:** Ustaz AI references Syafie positions as primary
- **Disclaimer:** When alternative opinions exist, they are noted but Syafie emphasized
- **Prayer Method:** JAKIM method (similar to Shafi'i/MWL hybrid)

### Bahasa Melayu Primary
- **UI:** All interface text in Bahasa Melayu
- **Quran Translation:** Basmeih (official Malaysian translation)
- **AI Responses:** Bahasa Melayu as default, with Arabic quotes
- **Hadith:** Translated to Bahasa Melayu with Arabic references
- **Tajwid:** Malay descriptions with Arabic terminology

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- **TypeScript** throughout — strict typing, no `any` types
- **Tailwind CSS** — use utility classes, follow Deep Blue + Gold theme
- **Bahasa Melayu** — all user-facing text must be available in Malay
- **JAKIM Compliance** — all religious content must follow JAKIM standards
- **JAKIM Disclaimer** — add the disclaimer to any AI-generated content
- **Mobile-first** — test on 480px viewport, minimum 44px touch targets
- **Run `bun run lint`** before submitting — zero errors required
- **No indigo/blue** — use the Deep Blue palette (#1a1a4a, #2a2a6a, #4a4aa6)

### Code Style

```typescript
// Use 'use client' for interactive components
'use client'

// Use Zustand store for state
import { useQuranPulseStore } from '@/stores/quranpulse-store'

// Use shadcn/ui components
import { Button } from '@/components/ui/button'

// Use Framer Motion for animations
import { motion, AnimatePresence } from 'framer-motion'
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 QuranPulse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgements

- **[alquran.cloud](https://alquran.cloud)** — Free Quran API with translations, audio, and search
- **[JAKIM](https://www.islam.gov.my)** — Jabatan Kemajuan Islam Malaysia for official Islamic data
- **[waktusolat.app](https://waktusolat.app)** — Malaysian prayer time API (proxy to e-solat.gov.my)
- **[OpenClaw](https://openclaw.ai)** — AI agent framework for multi-persona chat
- **[aladhan.com](https://aladhan.com)** — Islamic calendar and Hijri date conversion API
- **[z-ai-web-dev-sdk](https://z-ai.dev)** — AI SDK for LLM, TTS, ASR, and media generation
- **[Supabase](https://supabase.com)** — Open-source Firebase alternative with PostgreSQL + RLS
- **[Next.js](https://nextjs.org)** — React framework for production
- **[Islamic Network CDN](https://islamic.network)** — Quran audio CDN (128kbps MP3 per ayah)
- **[shadcn/ui](https://ui.shadcn.com)** — Beautifully designed, accessible UI components

---

<div align="center">

**QuranPulse v6.0** — *Memacu Denyutan Iman Malaysia* 🇲🇾

Made with ❤️ for the Malaysian Muslim community

</div>
