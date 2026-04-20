# Task 2-c: ASR Integration Agent

## Task: Add ASR Pronunciation Feedback Integration to IQRA

## Summary
Integrated real ASR (Automatic Speech Recognition) into the IqraTab's "sebut" (pronunciation) practice mode, replacing the previous IqraRecitationPractice component that used browser SpeechRecognition API with simulation fallback.

## Changes Made

### File Modified: `/src/components/quranpulse/tabs/IqraTab.tsx`

1. **New imports**: Added `AlertCircle`, `RotateCcw`, `Check`, `MicOff` from lucide-react

2. **New state variables** (8 ASR-specific):
   - `asrRecording` — whether microphone is currently recording
   - `asrProcessing` — whether ASR API is being called
   - `asrResult` — the transcribed text from ASR
   - `asrScore` — object with correct count, total count, and per-letter details
   - `asrError` — error message string (in Malay)
   - `asrCurrentIdx` — index of current practice item
   - `asrMicPermission` — mic permission state ('unknown'|'granted'|'denied')
   - `asrMediaRecorderRef` / `asrChunksRef` — refs for MediaRecorder API

3. **New SebutView inline component** (~650 lines):
   - Practice items from `IQRA_PAGE_CONTENT` (first 10 pages) with `ENHANCED_LETTERS` fallback
   - `MediaRecorder` API for real microphone audio capture (webm/opus format)
   - `blobToBase64()` helper for audio conversion
   - `comparePronunciation()` algorithm: normalize Arabic → per-char + set-based matching
   - Circular SVG score display with "X/Y huruf betul"
   - Per-letter color-coded breakdown (green ✅ / red ❌)
   - ASR transcript display ("Anda sebut: ...")
   - Feedback cards with Malay messages
   - Makhraj tips for incorrect letters
   - XP rewards (+15 for ≥80%, +5 for ≥50%)
   - Mic permission handling with Malay error messages
   - Pulsing red dot recording indicator
   - Gold processing indicator
   - Auto-stop after 6 seconds
   - Framer Motion animations throughout

4. **Replaced** `IqraRecitationPractice` component with `SebutView` in LatihanView

5. **Removed** unused `IqraRecitationPractice` import

## API Integration
- POST `/api/asr` with `{ audioBase64: string }` → returns `{ success: true, text: string }`
- Audio captured via `navigator.mediaDevices.getUserMedia({ audio: true })`
- Converted from Blob → base64 → JSON body for ASR endpoint

## Theme Compliance
- Deep Blue: bg `#1a1a4a`, cards `rgba(42,42,106,0.3)`, text `#ffffff`, gold `#d4af37`, primary `#4a4aa6`
- HARAKAT_COLORS used for consistent color coding
- All Framer Motion animations follow existing patterns

## Testing
- ESLint: passes with zero errors (only pre-existing warnings)
- Dev server: compiles and serves successfully (GET / 200)
