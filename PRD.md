# QuranPulse — Product Requirements Document

> **Malaysia's First AI-Powered Quran Learning App**
> *App Mengaji AI Pertama Malaysia*

**Version:** 7.0  
**Last Updated:** March 2026  
**Status:** Active Development  
**Repository:** [thisisniagahub/QuranPulseBeta7](https://github.com/thisisniagahub/QuranPulseBeta7)

---

## 1. Product Vision

### Vision Statement
QuranPulse aims to be the definitive Islamic learning app for Malaysian Muslims — combining the complete Al-Quran reading experience, AI-powered Islamic guidance, a structured Iqra learning system, and JAKIM-compliant ibadah tools in a single, beautifully designed mobile-first application.

### Mission
To make Quran learning, Islamic education, and daily ibadah accessible, engaging, and authentically Malaysian for Muslims of all ages — from students learning Iqra to adults seeking daily spiritual guidance.

### Tagline
**"Memacu Denyutan Iman Malaysia"** — Driving the Pulse of Faith in Malaysia

---

## 2. Target Users

### Primary Personas

| Persona | Age | Description | Key Needs |
|---------|-----|-------------|-----------|
| **Student Iqra** | 12-18 | Secondary school student learning to read Quran | Structured Iqra lessons, gamification, fun practice |
| **Young Professional** | 25-35 | Working adult seeking daily Islamic guidance | Prayer times, quick Quran reading, AI answers |
| **Parent** | 30-50 | Parent teaching children Quran | Iqra digital tools, hafazan tracking, family features |
| **Elderly User** | 50-65 | Senior citizen wanting accessible Quran tools | Large text, audio recitation, simple navigation |

### Demographics
- **Primary Market:** Malaysian Muslims
- **Language:** Bahasa Melayu (primary), Arabic (Quran text), English (secondary)
- **Age Range:** 12-65 years
- **Geography:** Malaysia (all 13 states + 3 federal territories)
- **Fiqh School:** Syafie madhab (majority in Malaysia)

---

## 3. Problem Statement

Malaysian Muslims face significant fragmentation when it comes to Islamic digital tools:

1. **Fragmented Tools** — Quran reading, prayer times, Iqra learning, and Islamic Q&A each require separate apps
2. **No Unified Malaysian App** — Existing apps are generic and don't follow JAKIM standards for prayer times, halal certification, or khutbah
3. **No AI-Powered Iqra** — No app combines structured Iqra 1-6 learning with AI tutoring and practice modes
4. **Language Gap** — Most Islamic apps prioritize English/Arabic; few offer full Bahasa Melayu experience
5. **Engagement Drop-off** — Traditional learning apps lack gamification, leading to low retention

---

## 4. Product Goals

| # | Goal | Success Metric | Target |
|---|------|---------------|--------|
| G1 | Complete Quran reading experience | Surahs accessible with translations + audio | 114/114 surahs |
| G2 | AI-powered Islamic guidance | AI response accuracy & JAKIM compliance | 95%+ satisfaction |
| G3 | Structured Iqra learning system | Iqra book completion rate | 40% complete Book 1 |
| G4 | JAKIM-compliant ibadah tools | Prayer time accuracy vs e-solat.gov.my | ±2 minutes |
| G5 | Malaysian Islamic compliance | All content follows Syafie madhab | 100% compliance |

---

## 5. User Stories

### 5.1 Quran Reading

| ID | User Story | Priority |
|----|-----------|----------|
| Q-01 | As a user, I want to browse all 114 surahs with search and filter (Makkiyah/Madaniyyah) so I can find any surah quickly | P0 |
| Q-02 | As a user, I want to read Quran verses with Arabic text, Malay translation, and English translation side by side | P0 |
| Q-03 | As a user, I want to listen to audio recitation from multiple qaris while reading | P1 |
| Q-04 | As a user, I want to bookmark individual verses and entire surahs for later reference | P0 |
| Q-05 | As a user, I want to search Quran text in Arabic, Malay, or English | P1 |
| Q-06 | As a user, I want to read tafsir for any verse to understand its meaning | P1 |
| Q-07 | As a user, I want to navigate by Juz (30) and see my progress | P2 |

### 5.2 Ustaz AI

| ID | User Story | Priority |
|----|-----------|----------|
| A-01 | As a user, I want to ask Islamic questions to an AI and receive accurate, JAKIM-compliant answers in Bahasa Melayu | P0 |
| A-02 | As a user, I want to choose between 3 AI personas (Fiqh, Akidah, Sirah specialists) based on my question | P1 |
| A-03 | As a user, I want to use voice input to ask questions hands-free | P1 |
| A-04 | As a user, I want to hear AI responses read aloud via TTS | P2 |
| A-05 | As a user, I want the AI to search the web for current Islamic events and rulings | P2 |
| A-06 | As a user, I want to generate Islamic art (geometric patterns) through the AI | P2 |

### 5.3 Ibadah Hub

| ID | User Story | Priority |
|----|-----------|----------|
| I-01 | As a user, I want to see accurate JAKIM prayer times for my specific zone | P0 |
| I-02 | As a user, I want a countdown timer to the next prayer | P0 |
| I-03 | As a user, I want a Qibla compass pointing to the Kaabah | P1 |
| I-04 | As a user, I want a digital tasbih counter with vibration feedback | P0 |
| I-05 | As a user, I want to read authentic hadiths in Bahasa Melayu daily | P1 |
| I-06 | As a user, I want to read JAKIM khutbah for Friday prayers | P2 |
| I-07 | As a user, I want to see the Islamic (Hijri) calendar with important dates | P2 |

### 5.4 Iqra Digital

| ID | User Story | Priority |
|----|-----------|----------|
| IQ-01 | As a student, I want to learn hijaiyah letters (Iqra 1) with visual display and audio | P0 |
| IQ-02 | As a student, I want to practice harakat (Fathah, Kasrah, Dhammah) in Iqra 2 | P0 |
| IQ-03 | As a student, I want to learn tanwin and madd rules in Iqra 3 | P1 |
| IQ-04 | As a student, I want to practice tajwid rules across Iqra 4-6 | P1 |
| IQ-05 | As a student, I want an AI tutor ("Tanya Cikgu") to ask questions while learning | P1 |
| IQ-06 | As a student, I want 3 practice modes (Flashcard, Quiz, Matching) to test my knowledge | P1 |
| IQ-07 | As a student, I want to track my hafazan progress for Juz 30 surahs | P1 |
| IQ-08 | As a student, I want a tajwid rules reference organized by category | P2 |

### 5.5 Gamification

| ID | User Story | Priority |
|----|-----------|----------|
| G-01 | As a user, I want to earn XP for completing learning activities | P0 |
| G-02 | As a user, I want to see my current level and progress to the next | P0 |
| G-03 | As a user, I want to maintain a daily streak for continuous engagement | P0 |
| G-04 | As a user, I want daily challenges with XP rewards | P1 |
| G-05 | As a user, I want to see a level-up animation when I advance | P2 |
| G-06 | As a user, I want a weekly activity heatmap showing my learning patterns | P2 |

---

## 6. Feature Specifications

### 6.1 Quran Reader

**Description:** Complete Al-Quran reading experience with Arabic text, translations, audio, tafsir, and search.

| Criterion | Acceptance Criteria |
|-----------|-------------------|
| AC-1 | All 114 surahs load with Arabic text, Malay (Basmeih) and English (Sahih) translations |
| AC-2 | Audio plays from CDN for each ayah with Mishary Alafasy as default reciter |
| AC-3 | Search returns relevant results in Arabic, Malay, or English within 3 seconds |
| AC-4 | Bookmarks persist across sessions via Zustand persist to localStorage |
| AC-5 | Surah list supports filtering by All/Makkiyah/Madaniyyah with text search |

**Priority:** P0  
**Technical Notes:**
- Uses alquran.cloud API v1 with in-memory 1-hour TTL cache
- Fallback to local SURAH_DATA when API unavailable
- Audio URLs: `cdn.islamic.network/quran/audio/128/{reciter}/{ayahNumber}.mp3`

---

### 6.2 Ustaz AI

**Description:** AI-powered Islamic chatbot with 3 specialized personas, voice I/O, and OpenClaw agent integration.

| Criterion | Acceptance Criteria |
|-----------|-------------------|
| AC-1 | AI responds in Bahasa Melayu with proper Islamic terminology |
| AC-2 | 3 personas available: Ustaz Azhar (Fiqh), Ustazah Aishah (Akidah), Ustaz Zak (Sirah) |
| AC-3 | JAKIM disclaimer is always visible during AI chat sessions |
| AC-4 | Voice input captures speech via ASR and sends as chat message |
| AC-5 | Graceful fallback to z-ai-web-dev-sdk LLM when OpenClaw Gateway is offline |

**Priority:** P0  
**Technical Notes:**
- Primary: OpenClaw Gateway (port 3030) with OpenAI-compatible API
- Fallback: z-ai-web-dev-sdk LLM chat completions
- ASR: 10-second auto-stop voice recording
- TTS: Audio playback on AI message cards
- System prompt enforces JAKIM compliance and Bahasa Melayu responses

---

### 6.3 Ibadah Hub

**Description:** Comprehensive Islamic worship toolkit with JAKIM prayer times, Qibla compass, tasbih counter, hadith reader, khutbah reader, and Islamic calendar.

| Criterion | Acceptance Criteria |
|-----------|-------------------|
| AC-1 | Prayer times match JAKIM e-solat.gov.my within ±2 minutes for all 52 zones |
| AC-2 | Countdown timer updates every second with circular progress visualization |
| AC-3 | Qibla compass supports device orientation API with iOS permission handling |
| AC-4 | Tasbih counter provides vibration feedback and tracks sessions with history |
| AC-5 | Hadith collection includes 35+ authentic hadiths with source attribution |

**Priority:** P0  
**Technical Notes:**
- Prayer API: waktusolat.app → e-solat.gov.my with 1-hour cache
- Qibla: Device orientation API with 292.5° KL fallback
- Tasbih: 4 dhikr categories, vibration patterns (10/30/60ms), AudioContext sound feedback
- Khutbah: islam.gov.my API with sample fallback
- Calendar: aladhan.com Hijri conversion with local fallback

---

### 6.4 Iqra Digital

**Description:** Structured Iqra 1-6 digital learning system with AI tutoring, 3 practice modes, tajwid reference, and hafazan tracking.

| Criterion | Acceptance Criteria |
|-----------|-------------------|
| AC-1 | 6 Iqra books display content appropriate to each level (letters → full reading) |
| AC-2 | AI tutor ("Tanya Cikgu") responds to Iqra-related questions within 5 seconds |
| AC-3 | Flashcard mode shows letter front/name back with flip animation |
| AC-4 | Quiz mode presents 4-option MCQ with scoring and audio hints |
| AC-5 | Hafazan tracking uses spaced repetition (4h → 1d → 7d intervals) |

**Priority:** P0  
**Technical Notes:**
- Iqra content structured per book with page-based navigation
- AI tutor uses /api/ustaz-ai with "iqra-teacher" persona
- Practice modes: Flashcard (+5 XP), Quiz (+10 XP), Matching (+15 XP)
- Hafazan: 20 Juz 30 surahs, XP +100 on completion
- Spaced repetition: `new → learning (4h) → review (1d) → mastered (7d)`

---

### 6.5 Gamification

**Description:** XP, levels, streaks, daily challenges, and achievements to maintain user engagement.

| Criterion | Acceptance Criteria |
|-----------|-------------------|
| AC-1 | XP is awarded for all learning activities with correct amounts |
| AC-2 | Level calculated as `Math.floor(xp / 500) + 1` and persists across sessions |
| AC-3 | Daily streak increments when user opens the app on consecutive days |
| AC-4 | Daily challenges rotate based on day of year (10 unique challenges) |
| AC-5 | Level-up animation displays for 3 seconds with confetti effect |

**Priority:** P1  
**Technical Notes:**
- XP rewards: Quick action (+2), Continue reading (+5), Flashcard (+5), Quiz correct (+10), Hafazan verse (+10), Page completion (+25), Matching game (+15), Hafazan surah (+100)
- Level formula: `level = Math.floor(xp / 500) + 1`
- Streak: Tracked via Zustand persist, visualized with progress bar
- Weekly heatmap: Seeded pseudo-random based on day of month for deterministic rendering

---

## 7. Malaysian Islamic Compliance Requirements

### 7.1 JAKIM Prayer Times (e-solat.gov.my)
- **Mandatory:** All prayer times sourced from JAKIM e-solat system
- **API:** waktusolat.app as proxy to e-solat.gov.my
- **Zones:** Complete 52 JAKIM zones across all Malaysian states
- **Accuracy:** Prayer times must match JAKIM official times within ±2 minutes
- **Prayer Names:** Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak (Malay)

### 7.2 JAKIM Halal Certification
- **Integration:** halal.gov.my API for product lookup
- **Status Codes:** Halal, Not Halal, Pending, Unknown
- **Display:** Show certificate expiry date and source attribution

### 7.3 JAKIM e-Khutbah
- **Source:** islam.gov.my khutbah API
- **Types:** Jumaat (Friday), Hari Raya (Eid), Ramadan
- **Language:** Bahasa Melayu
- **Attribution:** "Sumber: JAKIM e-Khutbah" displayed on all khutbah content

### 7.4 Malaysian Fiqh (Syafie Madhab)
- **School:** All fiqh rulings follow Imam Syafie's school
- **AI Responses:** Ustaz AI must reference Syafie positions as primary
- **Disclaimer:** When alternative opinions exist, note them but emphasize Syafie
- **Prayer Method:** JAKIM method (similar to Shafi'i/MWL hybrid)

### 7.5 islam.gov.my Integration
- **Calendar:** Islamic events and notable days from official Malaysian calendar
- **Khutbah:** Official JAKIM khutbah content
- **Data Accuracy:** All Islamic dates verified against Malaysian official sources

### 7.6 Malay Language Primary
- **UI:** All interface text in Bahasa Melayu
- **Quran Translation:** Basmeih translation (official Malaysian translation)
- **AI Responses:** Bahasa Melayu as default, with Arabic quotes
- **Hadith:** Translated to Bahasa Melayu with Arabic references

---

## 8. Non-Functional Requirements

### 8.1 Performance
| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 2 seconds |
| Time to Interactive (TTI) | < 3 seconds |
| API response time (cached) | < 200ms |
| API response time (uncached) | < 3 seconds |
| App bundle size | < 500KB (gzipped) |

### 8.2 Accessibility
| Requirement | Implementation |
|------------|----------------|
| Arabic text rendering | RTL direction, Amiri font family |
| Touch targets | Minimum 44px for all interactive elements |
| Color contrast | WCAG AA compliance (white on #1a1a4a) |
| Screen reader support | Semantic HTML, ARIA labels |
| Font size options | Small, Medium, Large (configurable) |

### 8.3 Offline Support
- **Static data:** 114 surah metadata, daily verses, hadiths, tajwid rules available offline
- **Cached data:** Last-fetched prayer times, Quran text cached with 1-hour TTL
- **Graceful degradation:** All features work with local fallback when APIs unavailable
- **State persistence:** Zustand persist to localStorage for all user data

### 8.4 Security
- **API key protection:** z-ai-web-dev-sdk keys server-side only
- **Supabase RLS:** Row-Level Security on all database tables
- **Input sanitization:** All user inputs sanitized before API calls
- **JAKIM disclaimer:** Mandatory disclaimer on all AI-generated religious content
- **No PII collection:** Anonymous sessions supported; no personal data required

---

## 9. Success Metrics

| Metric | Definition | Target (6 months) |
|--------|-----------|-------------------|
| **DAU** | Daily Active Users | 10,000 |
| **Retention D7** | 7-day retention rate | 35% |
| **Khatam Rate** | Users completing full Quran reading | 5% |
| **Hafazan Progress** | Juz 30 surahs memorized (avg per user) | 5 surahs |
| **Iqra Completion** | Users completing Iqra Book 1 | 30% |
| **AI Chat Sessions** | Average AI conversations per user per week | 3 |
| **Prayer Time Usage** | Daily prayer time checks | 80% of DAU |
| **NPS** | Net Promoter Score | 50+ |

---

## 10. Roadmap

### Q1 2026 — Foundation ✅
- [x] Core app shell with 5-tab navigation
- [x] Quran reader with 114 surahs + translations
- [x] Ustaz AI with 3 personas
- [x] JAKIM prayer times (52 zones)
- [x] Qibla compass with device orientation
- [x] Tasbih counter with dhikr categories
- [x] Iqra 1-6 digital learning
- [x] Gamification (XP, levels, streaks)
- [x] Deep Blue + Gold theme
- [x] OpenClaw agent integration

### Q2 2026 — Enhancement
- [ ] Supabase authentication (email + Google)
- [ ] Cloud sync for all user data
- [ ] Audio recording & AI hafazan checking
- [ ] Social features (leaderboard, sharing)
- [ ] PWA offline mode (service worker)
- [ ] Push notifications for prayer times
- [ ] Multiple reciter audio selection UI
- [ ] Advanced tajwid highlighting in Quran text

### Q3 2026 — Growth
- [ ] Multi-language support (English, Arabic UI)
- [ ] Community features (study groups, forums)
- [ ] Ramadan special mode (tarawih tracker, iftar times)
- [ ] Kids mode (simplified UI with parental controls)
- [ ] Islamic finance tools (zakat calculator)
- [ ] Hajj & Umrah guide module
- [ ] WhatsApp/Telegram bot integration via OpenClaw

### Q4 2026 — Scale
- [ ] iOS and Android native apps (React Native / Expo)
- [ ] Mosque finder with prayer time verification
- [ ] Islamic course platform (certified ustadz courses)
- [ ] Family accounts with parent dashboard
- [ ] Premium subscription (ad-free, offline audio, advanced AI)
- [ ] API marketplace for Islamic data

---

## 11. Competitive Analysis

### vs TARTEEL.AI

| Feature | QuranPulse | TARTEEL.AI |
|---------|-----------|------------|
| Quran Reading | ✅ 114 surahs + translations | ✅ Full Quran |
| AI Chat | ✅ 3 Islamic personas | ✅ General AI |
| Iqra Learning | ✅ Iqra 1-6 + practice modes | ❌ Not available |
| Prayer Times | ✅ JAKIM 52 zones | ❌ No JAKIM support |
| Malaysian Focus | ✅ Full Malay + JAKIM | ❌ English only |
| Gamification | ✅ XP, levels, streaks | ❌ Limited |
| Audio Recitation | ✅ 12 qaris | ✅ Multiple qaris |
| Open Source | ✅ GitHub | ❌ Proprietary |

**Key Differentiator:** QuranPulse is the only app with JAKIM-compliant prayer times, full Iqra 1-6 digital learning, and Bahasa Melayu as primary language.

### vs Muslim Pro

| Feature | QuranPulse | Muslim Pro |
|---------|-----------|------------|
| Prayer Times | ✅ JAKIM specific | ✅ Generic methods |
| Quran Reading | ✅ Full + tafsir | ✅ Full Quran |
| AI Features | ✅ Ustaz AI + OpenClaw | ❌ No AI |
| Iqra Learning | ✅ Iqra 1-6 + AI tutor | ❌ Not available |
| Malaysian Zones | ✅ 52 JAKIM zones | ⚠️ Limited zones |
| Hadith | ✅ 35+ Malay hadiths | ✅ Hadith collection |
| Hafazan | ✅ Spaced repetition | ❌ Basic bookmarks |
| Price | ✅ Free | ⚠️ Freemium |

**Key Differentiator:** QuranPulse offers AI-powered learning and specifically targets Malaysian Islamic compliance, while Muslim Pro is a generic global app.

### vs Iqra Apps (Iqra Digital, Belajar Iqra)

| Feature | QuranPulse | Iqra Digital | Belajar Iqra |
|---------|-----------|-------------|--------------|
| Iqra Books | ✅ 1-6 complete | ⚠️ Partial | ⚠️ Books 1-3 |
| AI Tutor | ✅ "Tanya Cikgu" | ❌ None | ❌ None |
| Practice Modes | ✅ 3 modes | ⚠️ Basic quiz | ⚠️ Basic |
| Tajwid Reference | ✅ 14 rules | ❌ None | ⚠️ Basic |
| Hafazan | ✅ Juz 30 + SR | ❌ None | ❌ None |
| Quran Reading | ✅ Full 114 surahs | ❌ None | ❌ None |
| Prayer Times | ✅ JAKIM | ❌ None | ❌ None |
| Gamification | ✅ XP + streaks | ❌ None | ⚠️ Stars |

**Key Differentiator:** QuranPulse is the only app that integrates Iqra learning with a full Quran reader, AI tutoring, prayer times, and gamification in a single unified experience.

---

<div align="center">

**QuranPulse PRD v7.0** — *Driving the Pulse of Faith in Malaysia* 🇲🇾

</div>
