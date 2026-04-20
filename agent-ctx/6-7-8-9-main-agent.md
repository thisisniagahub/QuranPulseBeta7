# Task 6-7-8-9: Create FOUR Interactive Practice Components for IQRA Tab

## Summary
Created 4 new interactive practice components for the IQRA tab's LatihanView, all using the Deep Blue + Gold theme.

## Files Created
1. `/src/components/quranpulse/tabs/iqra/IqraQalqalahPractice.tsx` - Qalqalah bounce practice with quiz mode
2. `/src/components/quranpulse/tabs/iqra/IqraSpeedReading.tsx` - Timed fluency exercises with 3 difficulty levels
3. `/src/components/quranpulse/tabs/iqra/IqraIkhfaIqlabPractice.tsx` - Ikhfa' (15 letters) and Iqlab (ب) practice with dual tabs and quiz
4. `/src/components/quranpulse/tabs/iqra/IqraLamJalalahPractice.tsx` - Lam Jalalah pronunciation practice (thick vs thin)

## Files Modified
1. `/src/components/quranpulse/tabs/iqra/types.ts` - Extended PracticeMode union type
2. `/src/components/quranpulse/tabs/IqraTab.tsx` - Added imports, extended LatihanView with 4 new practice modes

## Key Details
- All components are 'use client' with proper TypeScript typing
- All use Deep Blue + Gold theme: bg #1a1a4a, cards rgba(42,42,106,0.3), gold #d4af37, white text, #4a4aa6 primary
- All accept playAudio/addXp/playingAudio props as specified
- Qalqalah: Framer Motion bounce [1, 1.3, 0.9, 1.1, 1], gold star animation on correct answer
- Speed Reading: 3 difficulty levels (Perlahan/Biasa/Pantas), WPM tracking, +5 XP/word +20 bonus
- Ikhfa/Iqlab: Color coded (green/purple), 3-option quiz (Ikhfa'/Iqlab/Izhar)
- Lam Jalalah: Gold (thick) vs Blue (thin) color coding, 5-question rounds with explanations
- 0 lint errors after fixes (reordered useCallback, removed unused imports, added playingAudio usage)
