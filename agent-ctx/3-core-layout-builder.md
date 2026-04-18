# Task 3 - core-layout-builder

## Task
Build core layout, stores, and app shell for QuranPulse

## Files Created
1. `/src/stores/quranpulse-store.ts` - Zustand store with full state management
2. `/src/lib/quran-data.ts` - Quran static data (114 surahs, 30 daily verses, prayer names, hijaiyah letters)
3. `/src/components/quranpulse/AppShell.tsx` - Main app shell with 5-tab bottom navigation
4. `/src/components/quranpulse/SplashScreen.tsx` - Animated splash screen component

## Files Updated
5. `/src/app/globals.css` - Added Raudhah theme CSS variables and custom scrollbar
6. `/next.config.ts` - Simplified config (removed SPA rewrites)
7. `/src/app/page.tsx` - Replaced iframe with AppShell + SplashScreen

## Files Removed
- `/src/components/quranpulse/tabs/QuranTab.tsx` (orphan from previous agent, incompatible imports)
- `/src/components/quranpulse/tabs/HomeTab.tsx` (orphan from previous agent, incompatible imports)

## Key Decisions
- Inline tab content in AppShell rather than separate files to avoid import issues
- All 114 surahs included with complete metadata
- 30 daily verses with Malay and English translations
- Ustaz AI tab has center position with glow animation effect
- Tasbih counter uses conic-gradient for circular progress
- Bottom nav has glass effect with backdrop-blur

## App Status
- Compiles successfully (GET / 200)
- All 5 tabs render with placeholder content
- Ready for next agents to build out tab content
