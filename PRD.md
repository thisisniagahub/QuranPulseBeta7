# QuranPulse v6.0 — Product Requirements Document

> بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ

## 1. Product Vision

**QuranPulse** aims to be the world's most advanced and JAKIM-compliant Quran & Iqra learning application, purpose-built for Malaysian Muslims. By combining authentic Islamic scholarship with cutting-edge AI capabilities, QuranPulse delivers a holistic digital experience covering Quran reading, Iqra learning, AI-guided Islamic knowledge, daily ibadah tracking, and gamified engagement — all in Bahasa Melayu with Malaysian-specific data sources.

### Vision Statement

> *"Every Malaysian Muslim should have access to an intelligent, beautiful, and authentic Quran companion that understands their language, their timezone, and their faith."*

## 2. Target Audience

### Primary Users

| Segment | Age | Description | Key Needs |
|---------|-----|-------------|-----------|
| Students | 12-18 | Sekolah Agama / KAA students | Iqra learning, Tajwid, Hafazan tracking |
| Young Professionals | 19-35 | Urban working Muslims | Prayer reminders, quick Quran reading, AI Q&A |
| Parents | 30-50 | Family decision-makers | Iqra for children, family ibadah tracking |
| Elderly | 50-65 | Less tech-savvy Muslims | Large text, simple navigation, audio recitation |
| Mualaf | 18-60 | New Muslim converts | Basic Iqra learning, guided ibadah, AI Q&A |

### Secondary Users

- Islamic teachers (ustaz/ustazah) — content verification
- Mosque administrators — khutbah and prayer time data
- Islamic content creators — sharing features

## 3. Problem Statement

| Problem | Current State | QuranPulse Solution |
|---------|--------------|-------------------|
| No single app combines Quran, Iqra, AI, and Ibadah | Users juggle 3-4 apps | All-in-one platform |
| Most Quran apps not JAKIM-compliant | Generic prayer times, non-Malay tafsir | JAKIM zones, Abdullah Basmeih tafsir, BM language |
| Iqra learning is offline-only | Physical Iqra books, no progress tracking | Digital Iqra with AI tutor, XP, and mastery tracking |
| No AI that understands Islamic context | Generic chatbots give inaccurate fatwa | Multi-agent AI with JAKIM disclaimer, source citations |
| Hafazan tracking is manual | Paper-based, no spaced repetition | SM-2 algorithm, progress visualization, AI verification |
| No gamification for Islamic learning | Low engagement, drop-off after initial use | XP, streaks, badges, daily challenges, leaderboard |

## 4. Core Features

### 4.1 Al-Quran Reader

**Description**: Full-featured Quran reader with multiple reading modes and real-time audio recitation.

**Reading Modes**:

| Mode | Description | Priority |
|------|-------------|----------|
| Surah Mode | Browse 114 surahs, read by surah | P0 |
| Juz Mode | Read by 30 Juz divisions | P0 |
| Mushaf Mode | 604-page Mushaf format with khatam tracking | P1 |
| Hafazan Mode | Memorization mode with spaced repetition | P1 |
| Recite Mode | Voice-following recitation with AI feedback | P2 (2026) |

**Acceptance Criteria**:

- [x] Display all 114 surahs with Arabic (Uthmani), Malay (Basmeih), and English (Sahih) text
- [x] Real audio playback from CDN with 4 repeat modes
- [x] Playback speed control (0.5x - 2.0x) via `audio.playbackRate`
- [x] Surah search across Arabic, Malay, and English
- [x] Bookmark verses and surahs with persistence (Zustand + Supabase sync)
- [x] 14 sajda positions with recommended/obligatory classification
- [x] Khatam progress tracker (604-page format)
- [x] Night reading mode and adjustable font sizes
- [x] Audio sleep timer
- [x] Recent search history (last 10 queries)
- [ ] Word-by-word highlighting during audio playback (P1)
- [ ] Tajweed color-coding overlay (P2)

**Audio System**:
- CDN URL format: `https://cdn.islamic.network/quran/audio/128/{reciter}/{absoluteAyahNumber}.mp3`
- 12 reciters: Mishary Alafasy, Abdul Basit, Al-Sudais, Al-Ghamdi, Al-Hudhaify, Al-Minshawi, Al-Husary, Maher Al Muaiqly, Ahmed Al-Ajamy, Abdullah Basfar, Ayman Suwayd, Fares Abbad
- Absolute ayah number calculation: `sum(surahs[1..n-1].ayahCount) + ayahInSurah`

### 4.2 Iqra Digital

**Description**: Complete digital Iqra learning system covering all 6 books with AI-powered tutoring.

**Book Structure**:

| Book | Content | Pages | Key Features |
|------|---------|-------|-------------|
| Iqra 1 | Hijaiyah Letters | ~30 | 29 letters with per-page display, audio |
| Iqra 2 | Harakat | ~30 | Fathah/Kasrah/Dhammah letter combinations |
| Iqra 3 | Tanwin & Mad | ~30 | 6 rules with symbols and examples |
| Iqra 4 | Tajwid Lanjutan | ~30 | Advanced tajwid practice |
| Iqra 5 | Waqaf & Ibtida | ~30 | Stopping/starting rules |
| Iqra 6 | Bacaan Al-Quran | ~30 | Complete surah reading practice |

**Interactive Practice Modes**:

| Mode | Description | XP |
|------|-------------|-----|
| Flashcard | Flip cards: letter front, name + harakat back | +5 per card |
| Quiz | "Which letter is this?" 4-option MCQ with audio hint | +10 per correct |
| Matching | 6 Arabic letter → name pairs grid | +15 on completion |

**Acceptance Criteria**:

- [x] 6-book selector with progress tracking per page
- [x] Enhanced hijaiyah letters (29 letters with forms, harakat, writing tips)
- [x] 14 tajwid rules across 5 categories with Quran examples
- [x] 3 practice modes (Flashcard, Quiz, Matching)
- [x] "Tanya Cikgu" AI tutor via `/api/ustaz-ai` (iqra-teacher persona)
- [x] Hafazan tracker for 20 short surahs (Juz 30)
- [x] Progress dashboard with per-book and overall stats
- [x] XP rewards on completion milestones
- [ ] Writing practice with canvas/stylus input (P2)
- [ ] AI pronunciation feedback via ASR (P2)

### 4.3 Ustaz AI

**Description**: Multi-agent AI assistant providing Islamic knowledge through specialized personas with OpenClaw integration.

**Agent Personas**:

| Agent | Specialization | Skills | Channel |
|-------|---------------|--------|---------|
| Ustaz Azhar | Fiqh & Hukum (Mazhab Syafie) | ustaz-ai, quran-search, prayer-ibadah | WebChat |
| Ustazah Aishah | Akidah & Akhlak | ustaz-ai, quran-search | WebChat |
| Ustaz Zak | Sirah & Sejarah Islam | ustaz-ai, quran-search | WebChat |
| Cikgu Iqra | Iqra & Hafazan | iqra-hafazan, ustaz-ai | WebChat |
| Islamic Artist | Khat & Islamic Art | islamic-art | WebChat |

**AI Capabilities**:

- OpenAI-compatible chat completions via `/api/openclaw/chat`
- Web search for real-time information via `/api/openclaw/web-search`
- Islamic art generation (non-figurative, geometric only) via `/api/openclaw/generate`
- Voice input via ASR (`/api/asr`) with 10-second auto-stop
- Voice output via TTS (`/api/tts`) on AI messages
- Emoji reactions (👍 ❤️ 🤲 ✨ 🕌) on assistant messages
- Message copy and audio playback per message
- Web search indicator during agent search
- Classic Chat fallback when OpenClaw Gateway is offline

**Acceptance Criteria**:

- [x] Mode toggle: "Classic Chat" vs "OpenClaw Agent"
- [x] OpenClaw status indicator (green=online, red=offline)
- [x] Persona selector with avatars and specialization descriptions
- [x] Collapsible tools panel showing active skills and agent tools
- [x] JAKIM disclaimer always visible on AI responses
- [x] Graceful fallback to z-ai-web-dev-sdk LLM when Gateway offline
- [x] Voice input with real-time ASR
- [x] Voice output (TTS) on AI messages
- [x] Quick action chips ("Generate Islamic Art", "Search Quran", "Prayer Times")
- [ ] WhatsApp/Telegram channel integration (P1)
- [ ] Multi-turn conversation context with memory (P2)

### 4.4 Ibadah

**Description**: Comprehensive ibadah companion with JAKIM-compliant prayer times, Qibla, Tasbih, and more.

**Sub-features**:

| Feature | Description | Status |
|---------|-------------|--------|
| Prayer Times | JAKIM 52 zones, live countdown, next prayer highlight | ✅ |
| Qibla Compass | Device orientation API, 292.5° from KL fallback | ✅ |
| Tasbih Counter | 4 dhikr categories, vibration + sound, session tracking | ✅ |
| Hijri Calendar | Monthly view, notable Islamic days, month navigation | ✅ |
| Hadith of the Day | 35 authentic hadiths in BM, daily rotation | ✅ |
| e-Khutbah | JAKIM Friday/Eid/Ramadan khutbah reader | ✅ |
| Halal Checker | JAKIM halal certification lookup | ✅ (API) |

**JAKIM Zone Coverage**:

- Wilayah Persekutuan: WPKL01, WPS01, WPL01
- Johor: JHR01-04
- Kedah: KDH01-07
- Kelantan: KTN01-02
- Melaka: MLK01
- Negeri Sembilan: NSN01-02
- Pahang: PHS01-02
- Pulau Pinang: PNG01
- Perak: PRK01-07
- Sabah: SBH01-07
- Sarawak: SWK01-09
- Selangor: SGR01-04
- Terengganu: TRG01-02
- Perlis: PLS01

**Acceptance Criteria**:

- [x] Prayer times fetch from waktusolat.app API with fallback to hardcoded KL times
- [x] Zone selector with all 52 JAKIM zones grouped by state
- [x] Live countdown timer to next prayer (HH:MM:SS)
- [x] Circular SVG progress ring for prayer time progress
- [x] Qibla compass with device orientation and gentle sway animation
- [x] Tasbih with vibration patterns (short/medium/long) and AudioContext sound
- [x] Hijri calendar with notable days highlighting
- [x] 35 authentic hadiths with source references
- [x] Khutbah list and detail views with JAKIM source
- [ ] Push notification for prayer times (P1)
- [ ] Mosque finder (P2)

### 4.5 Gamification

**Description**: XP-based gamification system to drive daily engagement and learning consistency.

**XP Rewards**:

| Action | XP | Trigger |
|--------|-----|---------|
| Quick action tap | +2 | Home tab quick action buttons |
| Daily challenge | +5-25 | Random daily challenge completion |
| Iqra page complete | +25 | Complete an Iqra page |
| Quiz correct answer | +10 | Iqra quiz correct |
| Flashcard navigation | +5 | Navigate flashcard |
| Matching game complete | +15 | Complete letter matching |
| Hafazan verse memorize | +100 | Complete hafazan of a surah |
| Hafazan verse attempt | +10 | "Hafaz Ayat Ini" button |

**Level System**: `level = floor(xp / 500) + 1`

**Streak System**: Daily login tracking with increment on each day of use.

**Acceptance Criteria**:

- [x] XP accumulation with level calculation
- [x] Streak tracking and display
- [x] Level-up animation with confetti overlay
- [x] Weekly activity heatmap (7-bar chart)
- [x] Daily challenges (10 rotating by day of year)
- [ ] Badge system (P1)
- [ ] Leaderboard (P2)
- [ ] Social sharing of achievements (P2)

### 4.6 Malaysian Compliance

**Description**: Full JAKIM and Malaysian government data compliance.

**Requirements**:

| Requirement | Implementation | Status |
|-------------|---------------|--------|
| JAKIM prayer times | waktusolat.app API → e-solat.gov.my | ✅ |
| JAKIM halal data | halal.gov.my API | ✅ |
| JAKIM khutbah | islam.gov.my API | ✅ |
| Tafsir Abdullah Basmeih | alquran.cloud `ms.basmeih` edition | ✅ |
| Hijri calendar | aladhan.com API + approximate conversion | ✅ |
| Malaysian zone codes | 52 JAKIM zone codes | ✅ |
| Bahasa Melayu UI | All labels, descriptions, and content in BM | ✅ |
| JAKIM AI disclaimer | "Jawapan AI bukan fatwa rasmi JAKIM" always visible | ✅ |

## 5. 2026 Feature Roadmap

### Q1 2026 — Voice Following & AI Tajweed

| Feature | Description | Priority |
|---------|-------------|----------|
| Voice-Following Recitation | ASR tracks user's voice as they recite, auto-scrolls Quran text | P0 |
| AI Tajweed Correction | Real-time feedback on tajweed mistakes during recitation | P0 |
| Smart Review Scheduler | Spaced repetition for hafazan with optimal review timing | P1 |
| Writing Practice Canvas | Stylus/canvas input for Iqra letter writing practice | P1 |

### Q2 2026 — Social & Community

| Feature | Description | Priority |
|---------|-------------|----------|
| Study Groups | Create/join Quran study groups with shared progress | P1 |
| Khatam Celebrations | Share khatam completion with community | P1 |
| Leaderboard | Weekly/monthly XP and hafazan leaderboards | P2 |
| Family Accounts | Parent dashboard tracking children's Iqra/hafazan progress | P2 |

### Q3 2026 — Advanced AI

| Feature | Description | Priority |
|---------|-------------|----------|
| AI Fatwa Assistant | Context-aware fatwa lookup from JAKIM database | P1 |
| Smart Khutbah Generator | AI-generated khutbah outline based on current events | P2 |
| Quran Tafseer AI | Interactive tafsir exploration with follow-up questions | P1 |

### Q4 2026 — Multi-Platform & Offline

| Feature | Description | Priority |
|---------|-------------|----------|
| Full Offline Mode | Service worker caching for complete offline use | P0 |
| Desktop App | Electron/Tauri desktop application | P2 |
| Apple Watch Complication | Prayer time complications on watchOS | P2 |
| Android Widget | Home screen prayer time widget | P1 |

## 6. Non-Functional Requirements

### 6.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.0s | Lighthouse |
| API response time (cached) | < 200ms | Server timing |
| API response time (uncached) | < 2.0s | Server timing |
| Surah list load | < 500ms | Client timing |
| Audio start delay | < 2.0s | CDN latency |
| Memory usage (client) | < 150MB | Chrome DevTools |
| Bundle size (initial) | < 500KB | Next.js build |

**Caching Strategy**:
- In-memory cache with 1-hour TTL for Quran data (`quran-service.ts`)
- In-memory cache with 1-hour TTL for prayer times (`jakim-service.ts`)
- Zustand localStorage persistence for user state
- Next.js ISR for static pages
- Browser cache for audio files (CDN)

### 6.2 Accessibility

| Requirement | Implementation |
|-------------|---------------|
| Screen reader support | Semantic HTML, ARIA labels |
| Color contrast | WCAG AA minimum (gold on dark blue passes) |
| Font scaling | 3 sizes: small, medium, large (+ Arabic font sizes) |
| Keyboard navigation | Tab order, focus indicators |
| Touch targets | Minimum 44x44px for all interactive elements |
| Haptic feedback | `navigator.vibrate()` on tab switch and actions |

### 6.3 Security

| Layer | Implementation |
|-------|---------------|
| Authentication | Supabase Auth (JWT) + NextAuth |
| Database access | Row Level Security (RLS) on all tables |
| API protection | `auth.uid()` check on all user-scoped queries |
| Input validation | Zod schemas on all API inputs |
| API key protection | Server-side only (no client exposure) |
| XSS prevention | React auto-escaping, CSP headers |
| CSRF protection | SameSite cookies, CSRF tokens |

### 6.4 PWA

| Requirement | Implementation |
|-------------|---------------|
| Installable | `manifest.webmanifest` with icons |
| Offline-capable | Service worker with precache |
| Push notifications | Planned (Q1 2026) |
| Background sync | Planned (Q4 2026) |
| App icons | 192x192, 512x512, maskable variants |

## 7. Success Metrics

### Key Performance Indicators

| Metric | 6-Month Target | 12-Month Target |
|--------|---------------|-----------------|
| Daily Active Users (DAU) | 10,000 | 50,000 |
| Monthly Active Users (MAU) | 50,000 | 250,000 |
| Day-7 Retention | 35% | 45% |
| Day-30 Retention | 20% | 30% |
| Khatam Completion Rate | 5% | 10% |
| Hafazan Surahs Completed | 50,000 total | 200,000 total |
| Iqra Book Completion | 10,000 total | 50,000 total |
| Ustaz AI Queries/Day | 5,000 | 25,000 |
| Average Session Duration | 8 minutes | 12 minutes |
| Streak > 7 Days | 20% of users | 30% of users |

### Quality Metrics

| Metric | Target |
|--------|--------|
| App Store Rating | > 4.5 stars |
| Crash Rate | < 0.5% |
| API Error Rate | < 1% |
| JAKIM Data Accuracy | 100% |
| AI Response Satisfaction | > 80% positive reactions |

## 8. Competitive Analysis

| Feature | QuranPulse | Tarteel.AI | Muslim Pro | Al-Quran Malaysia |
|---------|-----------|------------|------------|-------------------|
| **Quran Audio** | ✅ 12 reciters, 4 repeat modes | ✅ Voice-following | ✅ Multiple reciters | ✅ Basic |
| **Malay Tafsir** | ✅ Abdullah Basmeih | ❌ | ❌ | ✅ Abdullah Basmeih |
| **JAKIM Prayer Times** | ✅ 52 zones | ❌ | ✅ Basic | ✅ JAKIM zones |
| **Iqra Digital** | ✅ 6 books + AI tutor | ❌ | ❌ | ❌ Basic |
| **AI Assistant** | ✅ 5 agents, multi-channel | ✅ Voice recitation AI | ❌ | ❌ |
| **Hafazan Tracker** | ✅ Spaced repetition | ✅ Basic | ❌ | ❌ |
| **Tasbih Counter** | ✅ 4 categories + history | ❌ | ✅ Basic | ✅ Basic |
| **Gamification** | ✅ XP + streaks + challenges | ❌ | ❌ | ❌ |
| **OpenClaw Agents** | ✅ Multi-agent framework | ❌ | ❌ | ❌ |
| **Offline Mode** | 🟡 Planned | ✅ | ✅ | ✅ |
| **PWA** | ✅ | ❌ | ✅ Native | ❌ |
| **Malaysian Focus** | ✅ Full | ❌ | 🟡 Partial | ✅ Full |
| **Price** | Free | Freemium | Freemium | Free |

### Competitive Advantages

1. **JAKIM-First**: Only app with complete 52-zone JAKIM data, e-Khutbah, and halal checker
2. **AI-Powered Iqra**: Only app with AI tutor for Iqra learning
3. **Multi-Agent AI**: Only app with specialized Islamic knowledge agents
4. **Malaysian Localization**: Full Bahasa Melayu, Malaysian Hijri calendar, local Islamic days
5. **OpenClaw Integration**: Extensible agent framework for future AI capabilities
6. **Gamification**: Only Quran app with comprehensive XP/streak/challenge system

---

*Document Version: 1.0 | Last Updated: 2025-07-27*
