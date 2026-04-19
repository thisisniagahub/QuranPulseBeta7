# QuranPulse — Product Requirements Document

> **Malaysia's First AI-Powered Quran Learning App**
> *App Mengaji AI Pertama Malaysia*

**Version:** 6.0  
**Last Updated:** March 2026  
**Status:** Active Development  
**Repository:** [thisisniagahub/QuranPulseBeta7](https://github.com/thisisniagahub/QuranPulseBeta7)  
**Product Owner:** QuranPulse Team  
**Document Owner:** Technical Writing & Design

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Target Market](#2-target-market)
3. [User Personas](#3-user-personas)
4. [Problem Statement](#4-problem-statement)
5. [Feature Requirements](#5-feature-requirements)
6. [User Stories](#6-user-stories)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Malaysian Islamic Compliance Requirements](#8-malaysian-islamic-compliance-requirements)
9. [Competitive Analysis](#9-competitive-analysis)
10. [Roadmap](#10-roadmap)
11. [Success Metrics](#11-success-metrics)
12. [Appendix](#12-appendix)

---

## 1. Product Vision

### 1.1 Vision Statement

QuranPulse aims to be the **#1 Islamic app for Malaysian Muslims** — combining the complete Al-Quran reading experience, AI-powered Islamic guidance through multiple Ustaz personas, a structured Iqra 1-6 digital learning system, and JAKIM-compliant ibadah tools in a single, beautifully designed mobile-first application.

### 1.2 Mission

To make Quran learning, Islamic education, and daily ibadah accessible, engaging, and authentically Malaysian for Muslims of all ages — from students learning Iqra to adults seeking daily spiritual guidance.

### 1.3 Tagline

**"Memacu Denyutan Iman Malaysia"** — Driving the Pulse of Faith in Malaysia

### 1.4 Product Goals

| # | Goal | Success Metric | Target |
|---|------|---------------|--------|
| G1 | Complete Quran reading experience | Surahs accessible with translations + audio | 114/114 surahs |
| G2 | AI-powered Islamic guidance | AI response accuracy & JAKIM compliance | 95%+ satisfaction |
| G3 | Structured Iqra learning system | Iqra book completion rate | 40% complete Book 1 |
| G4 | JAKIM-compliant ibadah tools | Prayer time accuracy vs e-solat.gov.my | ±2 minutes |
| G5 | Malaysian Islamic compliance | All content follows Syafie madhab | 100% compliance |
| G6 | Gamification-driven engagement | 7-day retention rate | 35%+ |
| G7 | Offline-first experience | Core features work without network | 90%+ offline capability |

### 1.5 Product Principles

| Principle | Description |
|-----------|-------------|
| **Malaysian-First** | JAKIM standards, Bahasa Melayu, Syafie madhab as defaults |
| **AI-Assisted, Scholar-Verified** | AI provides guidance, scholars provide authority |
| **Offline-Resilient** | All core features work without network connectivity |
| **Mobile-Native** | Designed for 480px smartphones, touch-first interaction |
| **Gamified Learning** | XP, streaks, levels make Islamic learning engaging |
| **Respectful Design** | No figurative imagery, Islamic geometric art only |

---

## 2. Target Market

### 2.1 Primary Market

**Malaysian Muslims**, ages 18-45, smartphone-first users.

### 2.2 Market Size

| Metric | Value |
|--------|-------|
| Malaysian population | ~33 million |
| Muslim population | ~20 million (61.3%) |
| Smartphone penetration | 95%+ |
| Target age group (18-45) | ~12 million |
| Addressable market | ~10 million Muslim smartphone users |

### 2.3 Demographics

| Attribute | Value |
|-----------|-------|
| **Language** | Bahasa Melayu (primary), Arabic (Quran text), English (secondary) |
| **Age Range** | 12-65 years (core: 18-45) |
| **Geography** | Malaysia (all 13 states + 3 federal territories) |
| **Fiqh School** | Syafie madhab (majority in Malaysia) |
| **Income Level** | All income brackets (free app) |
| **Digital Literacy** | Moderate to high (smartphone-first) |

### 2.4 Device Profile

| Attribute | Target |
|-----------|--------|
| **Primary Device** | Android smartphone (70%), iPhone (30%) |
| **Screen Size** | 5.5" - 6.7" (360px - 480px viewport) |
| **Network** | 4G/5G with intermittent connectivity |
| **Browser** | Chrome, Safari, Samsung Internet |
| **Usage Pattern** | 3-5 sessions/day, 5-15 minutes per session |

---

## 3. User Personas

### 3.1 Persona 1: Ustaz Ahmad (Religious Teacher)

```
┌─────────────────────────────────────────────────┐
│  👨‍🏫 USTAZ AHMAD                                 │
│  Age: 42 | Occupation: Religious teacher        │
│  Location: Kuala Lumpur | Zone: WPKL01           │
├─────────────────────────────────────────────────┤
│  Background:                                    │
│  • Teaches Iqra at a local madrasah             │
│  • Leads Friday prayers at neighbourhood mosque │
│  • Wants digital tools to supplement teaching   │
│                                                  │
│  Goals:                                          │
│  • Track student Iqra progress digitally        │
│  • Access JAKIM khutbah for reference           │
│  • Answer student questions with AI assistance  │
│                                                  │
│  Pain Points:                                    │
│  • Paper-based Iqra tracking is inefficient     │
│  • Hard to find JAKIM-certified answers quickly │
│  • Students lose motivation without gamification│
│                                                  │
│  Key Features Used:                              │
│  → Iqra Digital (Books 1-6)                     │
│  → Ustaz AI (Fiqh persona)                      │
│  → e-Khutbah Reader                              │
│  → Hadith Collection                             │
└─────────────────────────────────────────────────┘
```

**User Story Map:**
1. Opens Iqra Digital to track student progress
2. Uses Ustaz AI to prepare answers for student questions
3. Reads JAKIM khutbah for Friday sermon preparation
4. References hadith collection for lesson material

### 3.2 Persona 2: Aisyah (University Student)

```
┌─────────────────────────────────────────────────┐
│  👩‍🎓 AISYAH                                       │
│  Age: 21 | Occupation: University student        │
│  Location: Selangor | Zone: SGR03                │
├─────────────────────────────────────────────────┤
│  Background:                                    │
│  • Second-year university student               │
│  • Wants to maintain daily ibadah consistently  │
│  • Learning to improve Quran recitation         │
│                                                  │
│  Goals:                                          │
│  • Never miss a prayer (needs accurate times)   │
│  • Complete Juz 30 hafazan by year end          │
│  • Maintain daily streak for motivation         │
│                                                  │
│  Pain Points:                                    │
│  • Prayer times app is separate from Quran app  │
│  • No structured hafazan tracking               │
│  • Needs quick Islamic answers between classes  │
│                                                  │
│  Key Features Used:                              │
│  → Prayer Times + Countdown                      │
│  → Hafazan Juz 30 (spaced repetition)           │
│  → Ustaz AI (Akidah persona)                    │
│  → Daily Verse + Hadith                          │
│  → Gamification (XP, streaks)                    │
└─────────────────────────────────────────────────┘
```

**User Story Map:**
1. Checks prayer countdown on Home tab
2. Reads daily verse during commute
3. Practices hafazan during study breaks
4. Asks Ustaz AI quick questions between classes
5. Competes on weekly streak

### 3.3 Persona 3: Encik Razak (Parent)

```
┌─────────────────────────────────────────────────┐
│  👨‍👧 ENCIK RAZAK                                  │
│  Age: 38 | Occupation: IT Manager                │
│  Location: Johor Bahru | Zone: JHR01             │
├─────────────────────────────────────────────────┤
│  Background:                                    │
│  • Father of 3 children (ages 8, 11, 14)       │
│  • Wants children to learn Iqra properly        │
│  • Tech-savvy, uses smartphone extensively      │
│                                                  │
│  Goals:                                          │
│  • Teach children Iqra at home with digital aid │
│  • Track each child's Iqra progress             │
│  • Find halal restaurants when eating out       │
│                                                  │
│  Pain Points:                                    │
│  • Can't always send children to Iqra classes   │
│  • No AI tutor available for children's questions│
│  • Needs reliable JAKIM halal verification      │
│                                                  │
│  Key Features Used:                              │
│  → Iqra Digital (AI Tutor + Practice Modes)     │
│  → JAKIM Halal Checker                           │
│  → Qibla Compass                                  │
│  → Tasbih Counter                                 │
└─────────────────────────────────────────────────┘
```

**User Story Map:**
1. Opens Iqra Digital to teach children hijaiyah letters
2. Uses AI Tutor when children ask difficult questions
3. Checks halal status before dining out
4. Uses Qibla compass in unfamiliar locations

---

## 4. Problem Statement

Malaysian Muslims face significant fragmentation when it comes to Islamic digital tools:

| # | Problem | Impact | QuranPulse Solution |
|---|---------|--------|---------------------|
| P1 | **Fragmented Tools** — Quran reading, prayer times, Iqra learning, and Islamic Q&A each require separate apps | User fatigue, inconsistent experiences, 5+ apps needed | Single unified app with 5 integrated tabs |
| P2 | **No Unified Malaysian App** — Existing apps are generic and don't follow JAKIM standards for prayer times, halal certification, or khutbah | Inaccurate prayer times, no JAKIM compliance, non-Malaysian fiqh | JAKIM-specific prayer times (52 zones), e-Khutbah, Syafie madhab |
| P3 | **No AI-Powered Iqra** — No app combines structured Iqra 1-6 learning with AI tutoring and practice modes | Students cannot self-learn, no instant feedback, low completion rates | Iqra 1-6 digital + AI Tutor + 3 practice modes + gamification |
| P4 | **Language Gap** — Most Islamic apps prioritize English/Arabic; few offer full Bahasa Melayu experience | Malaysian users feel alienated, Arabic-only interfaces | Full BM interface, Basmeih translation, Malay hadiths |
| P5 | **Engagement Drop-off** — Traditional learning apps lack gamification, leading to low retention | Users start but don't continue, no daily habit formation | XP, levels, streaks, daily challenges, level-up animations |
| P6 | **No AI Islamic Guidance** — Muslims need quick answers but cannot always consult a scholar | Unanswered questions, reliance on unverified online sources | Ustaz AI with 3 personas, JAKIM disclaimer, web search |

---

## 5. Feature Requirements

### 5.1 Feature Priority Framework

| Priority | Label | Description |
|----------|-------|-------------|
| **P0** | Must Have | Required for launch, core value proposition |
| **P1** | Should Have | Important for differentiation, second iteration |
| **P2** | Nice to Have | Enhances experience, third iteration |
| **P3** | Future | Planned for future releases |

### 5.2 Home Dashboard

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| Islamic greeting | Time-based Malay greeting with Arabic salutation | P1 | ✅ Done |
| Prayer countdown | Live HH:MM:SS countdown with SVG progress ring | P0 | ✅ Done |
| Daily verse | Quran ayat with Arabic + Malay translation | P0 | ✅ Done |
| Verse audio (TTS) | Text-to-speech playback of daily verse | P1 | ✅ Done |
| Word-by-word toggle | Per-word Arabic display with index | P2 | ✅ Done |
| Hafaz ayat button | Bookmark verse for hafazan (+10 XP) | P1 | ✅ Done |
| Streak & XP cards | Glass morphism cards with animated numbers | P0 | ✅ Done |
| Weekly heatmap | 7-bar activity visualization | P2 | ✅ Done |
| Daily hadith | Rotating hadith from 15 authentic sources | P1 | ✅ Done |
| Quick actions grid | 6-button grid with haptic feedback (+2 XP) | P1 | ✅ Done |
| Daily challenges | 10 rotating challenges with XP rewards | P1 | ✅ Done |
| Continue reading | Last-read surah/ayah card | P1 | ✅ Done |
| Level-up animation | Full-screen confetti overlay (3s) | P2 | ✅ Done |

### 5.3 Quran Reader

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| 114 surah list | Full surah list with search and filter | P0 | ✅ Done |
| Triple translation | Arabic + Malay (Basmeih) + English (Sahih) | P0 | ✅ Done |
| Real audio recitation | CDN streaming from islamic.network | P0 | ✅ Done |
| 12 reciters | Mishary Alafasy, Abdul Basit, Al-Sudais, etc. | P1 | ✅ Done |
| 4 repeat modes | None, single ayah, surah, continuous | P1 | ✅ Done |
| Playback speed | 0.5x to 2.0x with real-time adjustment | P1 | ✅ Done |
| Tajwid rules reference | 10 rules with Malay descriptions | P1 | ✅ Done |
| Word-by-word breakdown | Per-word Arabic text with index | P2 | ✅ Done |
| A-B repeat | Select start/end ayahs for focused practice | P1 | ✅ Done |
| Tafsir Al-Muyassar | Verse-by-verse commentary | P1 | ✅ Done |
| Verse bookmarks | Per-verse bookmarking with persistence | P0 | ✅ Done |
| Surah bookmarks | Per-surah bookmarking with persistence | P0 | ✅ Done |
| Quran search | Search in Arabic, Malay, or English | P1 | ✅ Done |
| Juz navigation | 30 juz structure with surah/ayah mapping | P2 | ✅ Done |
| Sajda indicators | 14 sajda positions (9 recommended, 4 obligatory) | P2 | ✅ Done |
| Khatam progress | 604-page Mushaf tracking | P2 | ✅ Done |
| Night reading mode | Low-light reading mode | P2 | ✅ Done |
| Arabic font sizes | Small, Medium, Large, X-Large | P1 | ✅ Done |
| Recent searches | Last 10 search queries | P2 | ✅ Done |
| Sleep timer | Audio sleep timer (0/15/30/60 min) | P2 | ✅ Done |
| Mushaf page mode | 604-page traditional layout | P3 | 🔜 Planned |

### 5.4 Ustaz AI

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| 3 persona system | Ustaz Azhar (Fiqh), Ustazah Aishah (Akidah), Ustaz Zak (Sirah) | P0 | ✅ Done |
| JAKIM disclaimer | Permanent, non-dismissible disclaimer | P0 | ✅ Done |
| OpenClaw integration | 5 agents with OpenAI-compatible API | P1 | ✅ Done |
| Voice input (ASR) | 10-second auto-stop speech-to-text | P1 | ✅ Done |
| Voice output (TTS) | Text-to-speech on AI messages | P1 | ✅ Done |
| Web search | Real-time Islamic knowledge search | P2 | ✅ Done |
| Islamic art generation | Non-figurative geometric pattern images | P2 | ✅ Done |
| Video generation | Islamic content video generation | P3 | ✅ Done |
| Music generation | Nasheed and Islamic audio generation | P3 | ✅ Done |
| Message reactions | Emoji reactions on assistant messages | P2 | ✅ Done |
| Copy message | One-tap copy of AI responses | P1 | ✅ Done |
| Classic chat fallback | z-ai-web-dev-sdk LLM when Gateway offline | P0 | ✅ Done |
| Tools panel | 9 tool badges with activation states | P2 | ✅ Done |
| Quick actions | Suggestion chips for common queries | P1 | ✅ Done |
| Image display | Show generated Islamic art in chat | P2 | ✅ Done |
| Multi-channel support | WhatsApp, Telegram, Discord via OpenClaw | P3 | 🔜 Planned |
| Audio recording | Record user recitation for AI feedback | P2 | 🔜 Planned |

### 5.5 Ibadah Hub

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| JAKIM prayer times | 52 zones with live API data | P0 | ✅ Done |
| Zone selector | Dropdown with state-grouped zones | P0 | ✅ Done |
| Countdown timer | HH:MM:SS with circular progress ring | P0 | ✅ Done |
| Qibla compass | Real device orientation with iOS permission | P1 | ✅ Done |
| Tasbih counter | Circular counter with progress ring | P0 | ✅ Done |
| 4 dhikr categories | Azkar Pagi, Azkar Petang, Selepas Solat, Umum | P1 | ✅ Done |
| Vibration feedback | 3 patterns (10/30/60ms) | P1 | ✅ Done |
| Sound feedback | AudioContext (800Hz tap, 523Hz completion) | P2 | ✅ Done |
| Session history | Today's tasbih sessions with timestamps | P1 | ✅ Done |
| Hadith collection | 35 authentic hadiths in Bahasa Malaysia | P1 | ✅ Done |
| e-Khutbah reader | JAKIM Friday/Eid/Ramadan khutbah | P2 | ✅ Done |
| Islamic calendar | Hijri calendar with notable days | P2 | ✅ Done |
| JAKIM halal check | Product certification lookup | P2 | 🔜 Partial |
| Push notifications | Prayer time reminders | P2 | 🔜 Planned |
| Tarawih tracker | Ramadan-specific feature | P3 | 🔜 Planned |

### 5.6 Iqra Digital

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| Iqra 1-6 books | Complete 6-book digital learning system | P0 | ✅ Done |
| Iqra 1: Hijaiyah | 29 letters with per-page display | P0 | ✅ Done |
| Iqra 2: Harakat | Fathah, Kasrah, Dhammah combinations | P0 | ✅ Done |
| Iqra 3: Tanwin & Mad | 6 rules with symbols and examples | P1 | ✅ Done |
| Iqra 4: Tajwid Lanjutan | Advanced tajwid practice | P1 | ✅ Done |
| Iqra 5: Waqaf & Ibtida | Stopping/starting rules | P1 | ✅ Done |
| Iqra 6: Bacaan Al-Quran | Complete surah reading | P1 | ✅ Done |
| AI Tutor ("Tanya Cikgu") | Bottom sheet chat with iqra-teacher persona | P1 | ✅ Done |
| Flashcard mode | Flip cards: letter front → name back (+5 XP) | P1 | ✅ Done |
| Quiz mode | 4-option MCQ with scoring (+10 XP) | P1 | ✅ Done |
| Matching game | 6-pair grid matching (+15 XP) | P1 | ✅ Done |
| Hijaiyah reference | 29-letter modal with forms, harakat, tips | P1 | ✅ Done |
| Tajwid rules reference | 14 rules in 5 categories | P1 | ✅ Done |
| Hafazan Juz 30 | 20 short surahs with spaced repetition | P1 | ✅ Done |
| Progress dashboard | Overall + per-book + tajwid + hafazan | P1 | ✅ Done |
| Audio playback | Per-surah audio for hafazan practice | P1 | ✅ Done |
| AI hafazan check | "Semak dengan AI" button | P2 | ✅ Done |
| Mastery tracking | Per-rule "Tandai Dikuasai" button | P2 | ✅ Done |
| Letter detail modal | Forms, harakat examples, writing tip, audio | P2 | ✅ Done |

### 5.7 Gamification

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| XP system | Earned from all learning activities | P0 | ✅ Done |
| Level system | `level = Math.floor(xp / 500) + 1` | P0 | ✅ Done |
| Daily streak | Consecutive day tracking | P0 | ✅ Done |
| Daily challenges | 10 rotating challenges | P1 | ✅ Done |
| Level-up animation | Full-screen confetti (3s) | P2 | ✅ Done |
| Weekly heatmap | 7-bar activity visualization | P2 | ✅ Done |
| Achievement badges | Milestone rewards | P2 | 🔜 Planned |
| Leaderboard | Social comparison | P3 | 🔜 Planned |

---

## 6. User Stories

### 6.1 Quran Reading

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|-------------------|----------|
| Q-01 | As a user, I want to browse all 114 surahs with search and filter so I can find any surah quickly | List loads in <2s; search returns results within 500ms; Makkiyah/Madaniyyah filter works | P0 |
| Q-02 | As a user, I want to read Quran verses with Arabic, Malay, and English translations side by side | All 3 translations visible; Arabic uses Uthmani script with RTL direction; Malay uses Basmeih translation | P0 |
| Q-03 | As a user, I want to listen to audio recitation from multiple qaris while reading | Audio plays from CDN within 3s; 12 reciters available; playback speed 0.5x-2.0x | P1 |
| Q-04 | As a user, I want to bookmark individual verses and entire surahs for later reference | Bookmarks persist via Zustand localStorage; visual indicator on bookmarked items | P0 |
| Q-05 | As a user, I want to search Quran text in Arabic, Malay, or English | Search returns relevant results within 3s; language selector (ar/ms/en) | P1 |
| Q-06 | As a user, I want to read tafsir for any verse to understand its meaning | Tafsir loads from Al-Muyassar edition; attribution displayed | P1 |
| Q-07 | As a user, I want to navigate by Juz (30) and see my progress | 30 juz displayed with surah mapping; current position highlighted | P2 |
| Q-08 | As a user, I want A-B repeat to practice specific ayah ranges | Select start/end ayahs; loop between them until stopped | P1 |
| Q-09 | As a user, I want word-by-word breakdown to understand each word | Per-word display with Arabic text and word index | P2 |
| Q-10 | As a user, I want night reading mode for low-light environments | Toggle to dim background; reduce eye strain | P2 |

### 6.2 Ustaz AI

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|-------------------|----------|
| A-01 | As a user, I want to ask Islamic questions and receive accurate, JAKIM-compliant answers in Bahasa Melayu | AI responds in BM with proper Islamic terminology; JAKIM disclaimer visible | P0 |
| A-02 | As a user, I want to choose between 3 AI personas based on my question type | 3 selectable personas (Fiqh, Akidah, Sirah); persona affects system prompt | P1 |
| A-03 | As a user, I want to use voice input to ask questions hands-free | ASR captures speech for 10s; converts to text; sends as chat message | P1 |
| A-04 | As a user, I want to hear AI responses read aloud via TTS | Play button on AI messages; audio streams without download | P2 |
| A-05 | As a user, I want the AI to search the web for current Islamic events | Web search indicator shown; results cited in response | P2 |
| A-06 | As a user, I want to generate Islamic art (geometric patterns) through the AI | Non-figurative art only; image displayed in chat | P2 |
| A-07 | As a user, I want emoji reactions on AI messages | 5 emoji options (👍 ❤️ 🤲 ✨ 🕌); reaction persists in session | P2 |
| A-08 | As a user, I want the chat to work even when OpenClaw Gateway is offline | Fallback to z-ai-web-dev-sdk LLM; no visible error to user | P0 |

### 6.3 Ibadah Hub

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|-------------------|----------|
| I-01 | As a user, I want to see accurate JAKIM prayer times for my specific zone | Times match e-solat.gov.my within ±2 minutes; 52 zones available | P0 |
| I-02 | As a user, I want a countdown timer to the next prayer | Updates every second; circular progress ring; auto-advances to next prayer | P0 |
| I-03 | As a user, I want a Qibla compass pointing to the Kaabah | Device orientation supported; iOS 13+ permission handled; 292.5° KL fallback | P1 |
| I-04 | As a user, I want a digital tasbih counter with vibration feedback | Counter increments on tap; vibration pattern configurable; session tracking | P0 |
| I-05 | As a user, I want to read authentic hadiths in Bahasa Melayu daily | 35+ hadiths with source attribution; daily rotation | P1 |
| I-06 | As a user, I want to read JAKIM khutbah for Friday prayers | List + detail views; JAKIM source attribution; external link | P2 |
| I-07 | As a user, I want to see the Islamic (Hijri) calendar with important dates | Monthly calendar grid; notable days highlighted; month navigation | P2 |
| I-08 | As a user, I want 4 dhikr categories with pre-set targets | Azkar Pagi/Petang/Selepas Solat/Umum; auto-set targets | P1 |
| I-09 | As a user, I want sound feedback when completing a tasbih round | AudioContext 523Hz on completion; toggle on/off | P2 |

### 6.4 Iqra Digital

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|-------------------|----------|
| IQ-01 | As a student, I want to learn hijaiyah letters with visual display and audio | 29 letters per page; forms, harakat, writing tips; audio button | P0 |
| IQ-02 | As a student, I want to practice harakat (Fathah, Kasrah, Dhammah) | Letter combinations per page; clear visual layout | P0 |
| IQ-03 | As a student, I want to learn tanwin and madd rules in Iqra 3 | 6 rules with symbols and examples; practice content | P1 |
| IQ-04 | As a student, I want to practice tajwid rules across Iqra 4-6 | Advanced tajwid; waqaf & ibtida; complete surah reading | P1 |
| IQ-05 | As a student, I want an AI tutor to ask questions while learning | "Tanya Cikgu" FAB; bottom sheet chat; iqra-teacher persona | P1 |
| IQ-06 | As a student, I want 3 practice modes to test my knowledge | Flashcard (flip), Quiz (MCQ), Matching (grid); XP rewards | P1 |
| IQ-07 | As a student, I want to track my hafazan progress for Juz 30 | 20 short surahs; spaced repetition; progress tracking | P1 |
| IQ-08 | As a student, I want a tajwid rules reference by category | 14 rules in 5 categories; expandable cards; mastery tracking | P2 |
| IQ-09 | As a student, I want XP rewards for completing learning activities | Page +25, quiz +10, flashcard +5, matching +15, hafazan +100 | P1 |
| IQ-10 | As a student, I want a hijaiyah letter reference with details | 29 letters; forms, harakat, writing tips; filter by category | P1 |

### 6.5 Gamification & Engagement

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|-------------------|----------|
| G-01 | As a user, I want to earn XP for completing learning activities | XP awarded correctly; total displayed; level updates | P0 |
| G-02 | As a user, I want to see my current level and progress to the next | Level formula: floor(xp/500)+1; progress bar to next level | P0 |
| G-03 | As a user, I want to maintain a daily streak for continuous engagement | Streak increments on consecutive days; visual progress bar | P0 |
| G-04 | As a user, I want daily challenges with XP rewards | 10 rotating challenges; XP on completion | P1 |
| G-05 | As a user, I want a level-up animation when I advance | Full-screen confetti overlay; 3-second duration; spring animation | P2 |
| G-06 | As a user, I want a weekly activity heatmap | 7-bar chart; deterministic rendering; visual engagement indicator | P2 |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint (FCP) | < 2 seconds | Lighthouse |
| Time to Interactive (TTI) | < 3 seconds | Lighthouse |
| API response time (cached) | < 200ms | Server monitoring |
| API response time (uncached) | < 3 seconds | Server monitoring |
| App bundle size (gzipped) | < 500KB | Build analysis |
| Tab switching latency | < 100ms | User perception |
| Audio start time | < 3 seconds | CDN latency |
| Splash screen duration | 2.5 seconds | Timer |

### 7.2 Accessibility

| Requirement | Implementation | WCAG Level |
|------------|----------------|-----------|
| Arabic text rendering | RTL direction, Amiri font family | AA |
| Touch targets | Minimum 44px for all interactive elements | AA |
| Color contrast | White on #1a1a4a background (>12:1 ratio) | AAA |
| Screen reader support | Semantic HTML, ARIA labels on all controls | AA |
| Font size options | Small, Medium, Large, X-Large (Arabic) | AA |
| Keyboard navigation | Tab order, focus indicators | AA |
| Alt text | Descriptive alt on all images | A |

### 7.3 Offline Support

| Capability | Implementation |
|-----------|----------------|
| Static data available offline | 114 surah metadata, daily verses, 35 hadiths, 14 tajwid rules |
| Cached API data | Last-fetched prayer times, Quran text cached with 1-hour TTL |
| Graceful degradation | All features work with local fallback when APIs unavailable |
| State persistence | Zustand persist to localStorage for all user data |
| Audio | Requires network (CDN streaming); gracefully shows offline message |

### 7.4 Security

| Requirement | Implementation |
|------------|----------------|
| API key protection | z-ai-web-dev-sdk keys server-side only (API routes) |
| Supabase RLS | Row-Level Security on all 9 database tables |
| Input sanitization | All user inputs sanitized before API calls |
| JAKIM disclaimer | Mandatory, non-dismissible on all AI-generated religious content |
| No PII collection | Anonymous sessions supported; no personal data required |
| HTTPS only | All API calls over HTTPS |
| Zone validation | Prayer zone codes validated against 52 known JAKIM zones |
| Surah validation | Surah numbers validated (1-114) before API calls |

### 7.5 Reliability

| Metric | Target |
|--------|--------|
| Uptime (API) | 99.5% |
| Error rate (API) | < 1% |
| Graceful degradation | 100% of features work with local fallback |
| Cache hit rate | > 70% for repeated requests |
| Data integrity | Zustand persist never corrupts |

---

## 8. Malaysian Islamic Compliance Requirements

### 8.1 JAKIM Prayer Times (e-solat.gov.my)

| Requirement | Implementation |
|------------|----------------|
| **Mandatory source** | All prayer times sourced from JAKIM e-solat system |
| **API proxy** | waktusolat.app as proxy to e-solat.gov.my |
| **Zone coverage** | Complete 52 JAKIM zones across all Malaysian states |
| **Accuracy** | Prayer times must match JAKIM official within ±2 minutes |
| **Prayer names** | Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak (Malay) |
| **Fallback** | KL default times when API unavailable (cached 10 min) |

### 8.2 JAKIM Halal Certification

| Requirement | Implementation |
|------------|----------------|
| **Integration** | halal.gov.my API for product lookup |
| **Status codes** | Halal, Not Halal, Pending, Unknown |
| **Display** | Certificate expiry date and JAKIM source attribution |
| **Caching** | 1-hour cache for halal status, 5-minute cache for unknown |

### 8.3 JAKIM e-Khutbah

| Requirement | Implementation |
|------------|----------------|
| **Source** | islam.gov.my khutbah API |
| **Types** | Jumaat (Friday), Hari Raya (Eid), Ramadan |
| **Language** | Bahasa Melayu |
| **Attribution** | "Sumber: JAKIM e-Khutbah" displayed on all khutbah content |
| **External link** | Link to full khutbah on islam.gov.my |

### 8.4 Malaysian Fiqh (Syafie Madhab)

| Requirement | Implementation |
|------------|----------------|
| **School** | All fiqh rulings follow Imam Syafie's school |
| **AI responses** | Ustaz AI must reference Syafie positions as primary |
| **Disclaimer** | When alternative opinions exist, note them but emphasize Syafie |
| **Prayer method** | JAKIM method (similar to Shafi'i/MWL hybrid) |
| **System prompt** | AI personas instructed to follow Syafie madhab |

### 8.5 islam.gov.my Integration

| Requirement | Implementation |
|------------|----------------|
| **Calendar** | Islamic events and notable days from official Malaysian calendar |
| **Khutbah** | Official JAKIM khutbah content |
| **Data accuracy** | All Islamic dates verified against Malaysian official sources |
| **Notable days** | Awal Muharram, Asyura, Maulidur Rasul, Israk Mikraj, Nisfu Syaban, Ramadan, Lailatulqadar, Aidilfitri, Hari Arafah, Aidiladha |

### 8.6 Malay Language Primary

| Requirement | Implementation |
|------------|----------------|
| **UI** | All interface text in Bahasa Melayu |
| **Quran translation** | Basmeih translation (official Malaysian translation by Abdullah Basmeih) |
| **AI responses** | Bahasa Melayu as default, with Arabic quotes where appropriate |
| **Hadith** | Translated to Bahasa Melayu with Arabic references |
| **Tajwid descriptions** | Malay descriptions with Arabic terminology |
| **Prayer names** | Subuh, Syuruk, Zohor, Asar, Maghrib, Isyak |
| **Hijri months** | Malay names (Rabiulawal, Jumadilawal, Rejab, Sya'ban, etc.) |

### 8.7 Islamic Art Guidelines

| Requirement | Implementation |
|------------|----------------|
| **No figurative imagery** | All generated art must be non-figurative |
| **Geometric patterns** | Only Islamic geometric patterns and calligraphy |
| **AI prompt restriction** | System prompt prevents figurative generation |
| **Content filter** | Image generation prompts filtered for Islamic compliance |

---

## 9. Competitive Analysis

### 9.1 vs TARTEEL.AI

| Feature | QuranPulse | TARTEEL.AI | Advantage |
|---------|-----------|------------|-----------|
| Quran Reading | ✅ 114 surahs + 3 translations | ✅ Full Quran | Equal |
| AI Chat | ✅ 3 Islamic personas + OpenClaw | ✅ General AI | QuranPulse |
| Iqra Learning | ✅ Iqra 1-6 + AI tutor + practice | ❌ Not available | QuranPulse |
| Prayer Times | ✅ JAKIM 52 zones | ❌ No JAKIM support | QuranPulse |
| Malaysian Focus | ✅ Full Malay + JAKIM | ❌ English only | QuranPulse |
| Gamification | ✅ XP, levels, streaks | ❌ Limited | QuranPulse |
| Audio Recitation | ✅ 12 qaris + CDN | ✅ Multiple qaris | Equal |
| Hafazan | ✅ Spaced repetition | ✅ AI-powered | Equal |
| Open Source | ✅ GitHub (MIT) | ❌ Proprietary | QuranPulse |
| Price | ✅ Free | ⚠️ Freemium | QuranPulse |

**Key Differentiator:** QuranPulse is the only app with JAKIM-compliant prayer times, full Iqra 1-6 digital learning with AI tutoring, and Bahasa Melayu as primary language.

### 9.2 vs Muslim Pro

| Feature | QuranPulse | Muslim Pro | Advantage |
|---------|-----------|------------|-----------|
| Prayer Times | ✅ JAKIM specific (52 zones) | ✅ Generic methods | QuranPulse |
| Quran Reading | ✅ Full + tafsir + tajwid | ✅ Full Quran | QuranPulse |
| AI Features | ✅ Ustaz AI + OpenClaw | ❌ No AI | QuranPulse |
| Iqra Learning | ✅ Iqra 1-6 + AI tutor | ❌ Not available | QuranPulse |
| Malaysian Zones | ✅ 52 JAKIM zones | ⚠️ Limited zones | QuranPulse |
| Hadith | ✅ 35+ Malay hadiths | ✅ Hadith collection | Equal |
| Hafazan | ✅ Spaced repetition | ❌ Basic bookmarks | QuranPulse |
| Halal Checker | ✅ JAKIM halal | ✅ Generic | QuranPulse |
| Qibla | ✅ Device orientation | ✅ Basic compass | Equal |
| Price | ✅ Free | ⚠️ Freemium | QuranPulse |

**Key Differentiator:** QuranPulse offers AI-powered learning with JAKIM-specific compliance, while Muslim Pro is a generic global app without Malaysian optimization.

### 9.3 vs Al-Quran Malaysia (MyQuran)

| Feature | QuranPulse | Al-Quran Malaysia | Advantage |
|---------|-----------|-------------------|-----------|
| Quran Reading | ✅ 114 + audio + tafsir | ✅ Full Quran | Equal |
| AI Features | ✅ Ustaz AI (3 personas) | ❌ No AI | QuranPulse |
| Iqra Learning | ✅ Iqra 1-6 + AI tutor | ❌ Not available | QuranPulse |
| Prayer Times | ✅ JAKIM 52 zones | ✅ JAKIM zones | Equal |
| Gamification | ✅ XP, levels, streaks | ❌ None | QuranPulse |
| Audio Recitation | ✅ 12 qaris + CDN | ⚠️ Limited | QuranPulse |
| OpenClaw | ✅ Multi-agent AI | ❌ No agent system | QuranPulse |
| Practice Modes | ✅ 3 modes (Flashcard/Quiz/Match) | ❌ None | QuranPulse |

**Key Differentiator:** QuranPulse is the only app that integrates Iqra learning with AI tutoring, gamification, and a full Quran reader in one unified experience.

### 9.4 vs Iqra-Specific Apps

| Feature | QuranPulse | Iqra Digital | Belajar Iqra | Advantage |
|---------|-----------|-------------|--------------|-----------|
| Iqra Books | ✅ 1-6 complete | ⚠️ Partial | ⚠️ Books 1-3 | QuranPulse |
| AI Tutor | ✅ "Tanya Cikgu" | ❌ None | ❌ None | QuranPulse |
| Practice Modes | ✅ 3 modes | ⚠️ Basic quiz | ⚠️ Basic | QuranPulse |
| Tajwid Reference | ✅ 14 rules + mastery | ❌ None | ⚠️ Basic | QuranPulse |
| Hafazan | ✅ Juz 30 + spaced rep | ❌ None | ❌ None | QuranPulse |
| Quran Reading | ✅ Full 114 surahs | ❌ None | ❌ None | QuranPulse |
| Prayer Times | ✅ JAKIM | ❌ None | ❌ None | QuranPulse |
| Gamification | ✅ XP + streaks | ❌ None | ⚠️ Stars | QuranPulse |
| Price | ✅ Free | ⚠️ Freemium | ⚠️ Freemium | QuranPulse |

**Key Differentiator:** QuranPulse is the only app that integrates Iqra learning with a full Quran reader, AI tutoring, prayer times, and gamification in a single unified experience.

---

## 10. Roadmap

### Q1 2026 — Foundation ✅ (Current)

- [x] Core app shell with 5-tab navigation
- [x] Quran reader with 114 surahs + translations + audio
- [x] Ustaz AI with 3 personas + OpenClaw integration
- [x] JAKIM prayer times (52 zones) + countdown
- [x] Qibla compass with device orientation
- [x] Tasbih counter with 4 dhikr categories
- [x] Iqra 1-6 digital learning + AI tutor
- [x] Hafazan Juz 30 with spaced repetition
- [x] Gamification (XP, levels, streaks, daily challenges)
- [x] Deep Blue + Gold theme
- [x] OpenClaw agent framework (5 agents, 5 skills)
- [x] Hadith collection (35+ hadiths in BM)
- [x] JAKIM e-Khutbah reader
- [x] Hijri calendar with notable days

### Q2 2026 — Enhancement

- [ ] Supabase authentication (email + Google sign-in)
- [ ] Cloud sync for all user data (7 Supabase routes ready)
- [ ] Audio recording & AI hafazan checking
- [ ] Social features (leaderboard, sharing)
- [ ] PWA offline mode (service worker with cache-first)
- [ ] Push notifications for prayer times
- [ ] Multiple reciter audio selection UI enhancement
- [ ] Advanced tajwid highlighting in Quran text
- [ ] JAKIM halal checker UI
- [ ] Zakat calculator

### Q3 2026 — Growth

- [ ] Multi-language support (English, Arabic UI)
- [ ] Community features (study groups, forums)
- [ ] Ramadan special mode (tarawih tracker, iftar times, juz progress)
- [ ] Kids mode (simplified UI with parental controls)
- [ ] Islamic finance tools (zakat calculator, savings tracker)
- [ ] Hajj & Umrah guide module
- [ ] WhatsApp/Telegram bot integration via OpenClaw channels
- [ ] Family accounts with parent dashboard
- [ ] Mosque finder with prayer time verification

### Q4 2026 — Scale

- [ ] iOS and Android native apps (React Native / Expo)
- [ ] Advanced analytics dashboard for users
- [ ] Islamic course platform (certified ustadz courses)
- [ ] Premium subscription (ad-free, offline audio, advanced AI)
- [ ] API marketplace for Islamic data
- [ ] B2B mosque integration (prayer time displays)
- [ ] International expansion (Indonesia, Brunei, Singapore)

---

## 11. Success Metrics

### 11.1 Key Performance Indicators (KPIs)

| Metric | Definition | Target (6 months) | Target (12 months) |
|--------|-----------|-------------------|-------------------|
| **DAU** | Daily Active Users | 10,000 | 50,000 |
| **MAU** | Monthly Active Users | 100,000 | 500,000 |
| **Retention D7** | 7-day retention rate | 35% | 40% |
| **Retention D30** | 30-day retention rate | 20% | 25% |
| **Khatam Rate** | Users completing full Quran reading | 5% | 8% |
| **Hafazan Progress** | Juz 30 surahs memorized (avg) | 5 surahs | 10 surahs |
| **Iqra Completion** | Users completing Iqra Book 1 | 30% | 40% |
| **AI Chat Sessions** | Average AI conversations per user/week | 3 | 5 |
| **Prayer Time Usage** | Daily prayer time checks | 80% of DAU | 85% of DAU |
| **NPS** | Net Promoter Score | 50+ | 60+ |
| **App Rating** | App store rating | 4.5+ | 4.7+ |
| **Session Duration** | Average session length | 8 minutes | 10 minutes |

### 11.2 Feature Engagement Metrics

| Feature | Metric | Target |
|---------|--------|--------|
| Quran Reader | % of DAU reading at least 1 ayah | 60% |
| Ustaz AI | Messages per session | 4+ |
| Ibadah Hub | Prayer time checks per user/day | 3+ |
| Iqra Digital | Pages completed per week | 5+ |
| Tasbih | Sessions per week | 3+ |
| Hafazan | Reviews completed per day | 2+ |
| Daily Challenges | Completion rate | 40% |

### 11.3 Technical Metrics

| Metric | Target |
|--------|--------|
| API uptime | 99.5% |
| API p50 latency | < 200ms |
| API p99 latency | < 3s |
| Cache hit rate | > 70% |
| Error rate | < 1% |
| Crash rate | < 0.5% |

---

## 12. Appendix

### A. Glossary

| Term | Definition |
|------|-----------|
| **JAKIM** | Jabatan Kemajuan Islam Malaysia (Department of Islamic Development Malaysia) |
| **e-Solat** | JAKIM's official prayer time calculation system |
| **Basmeih** | Abdullah Basmeih — official Malaysian Quran translation |
| **Syafie** | Imam Syafie's school of Islamic jurisprudence (majority in Malaysia) |
| **Iqra** | "Read!" — structured Quran reading method (6 books) |
| **Hafazan** | Quran memorization |
| **Tajwid** | Rules of Quran recitation |
| **Harakat** | Vowel marks in Arabic script (Fathah, Kasrah, Dhammah) |
| **Tanwin** | Nunation marks in Arabic (double vowel marks) |
| **Waqaf** | Stopping rules in Quran recitation |
| **Ibtida** | Starting rules in Quran recitation |
| **Hijaiyah** | Arabic alphabet letters |
| **Dhikr** | Remembrance of Allah (tasbih phrases) |
| **Khutbah** | Islamic sermon (Friday, Eid) |
| **Madhab** | School of Islamic jurisprudence |
| **Sajda** | Prostration (14 sajda ayahs in Quran) |

### B. JAKIM Zone Codes (52 Zones)

```
WPKL01 (Kuala Lumpur)   WPS01 (Putrajaya)     WPL01 (Labuan)
JHR01 (Johor Bahru)     JHR02 (Kluang)        JHR03 (Batu Pahat)
JHR04 (Mersing)         KDH01 (Kota Setar)    KDH02 (Kuala Muda)
KDH03 (Padang Terap)    KDH04 (Baling)        KDH05 (Kubang Pasu)
KDH06 (Pendang)         KDH07 (Sik)           KTN01 (Kota Bharu)
KTN02 (Machang)         MLK01 (Melaka)        NSN01 (Seremban)
NSN02 (Jempol)          PHS01 (Kuantan)       PHS02 (Jerantut)
PNG01 (Pulau Pinang)    PRK01 (Ipoh)          PRK02 (Taiping)
PRK03 (Parit)           PRK04 (Teluk Intan)   PRK05 (Slim River)
PRK06 (Kuala Kangsar)   PRK07 (Lumut)         SBH01 (Kota Kinabalu)
SBH02 (Sandakan)        SBH03 (Lahad Datu)    SBH04 (Kudat)
SBH05 (Tawau)           SBH06 (Keningau)      SBH07 (Semporna)
SWK01 (Kuching)         SWK02 (Sri Aman)      SWK03 (Sibu)
SWK04 (Miri)            SWK05 (Bintulu)       SWK06 (Limbang)
SWK07 (Kapit)           SWK08 (Sarikei)       SWK09 (Betong)
SGR01 (Gombak)          SGR02 (Hulu Selangor) SGR03 (Petaling)
SGR04 (Sepang)          TRG01 (Kuala Terengganu) TRG02 (Kemaman)
PLS01 (Kangar)
```

### C. XP Reward Table

| Action | XP | Frequency |
|--------|-----|-----------|
| Quick action tap | +2 | Unlimited |
| Continue reading | +5 | Per session |
| Flashcard navigation | +5 | Per flip |
| Quiz correct answer | +10 | Per question |
| Hafazan verse memorized | +10 | Per verse |
| Daily challenge complete | +15 | Per challenge |
| Matching game complete | +15 | Per game |
| Iqra page completion | +25 | Per page |
| Hafazan surah complete | +100 | Per surah |

### D. Level Progression

| Level | XP Required | Cumulative XP |
|-------|------------|---------------|
| 1 | 0 | 0 |
| 2 | 500 | 500 |
| 3 | 1,000 | 1,000 |
| 5 | 2,000 | 2,000 |
| 10 | 4,500 | 4,500 |
| 20 | 9,500 | 9,500 |
| 50 | 24,500 | 24,500 |

Formula: `level = Math.floor(xp / 500) + 1`

---

<div align="center">

**QuranPulse PRD v6.0** — *Memacu Denyutan Iman Malaysia* 🇲🇾

</div>
