# Task 6-7: UPGRADE IBADAHTAB and HOMETAB

## Agent: Main Agent
## Status: COMPLETED

## Summary
Upgraded IbadahTab from 3 sub-views to 6 sub-views and enhanced HomeTab with advanced UI/UX features including animated stats, live prayer countdown, and hadith of the day.

## Files Modified
- `src/stores/quranpulse-store.ts` - Added prayerZone, tasbihVibration, tasbihSound, tasbihVibrationPattern, tasbihSessions
- `src/components/quranpulse/tabs/IbadahTab.tsx` - Complete rewrite with 6 sub-views
- `src/components/quranpulse/tabs/HomeTab.tsx` - Complete rewrite with enhanced features
- `src/app/api/jakim/khutbah/route.ts` - New API endpoint

## New Features
### IbadahTab (6 sub-views)
1. **Solat** - JAKIM zone selector with 52 zones, live prayer times
2. **Kiblat** - Device orientation API, rotating compass, tick marks
3. **Tasbih** - 4 dhikr categories, vibration patterns, sound, history
4. **Kalendar** - Hijri calendar grid, notable Islamic dates, month navigation
5. **Hadis** - 35 hadiths in Malay, daily rotation, navigation
6. **Khutbah** - e-Khutbah reader with list/detail views

### HomeTab Enhancements
1. Glass morphism stats cards with animated number transitions
2. Weekly activity heatmap
3. Level Up animation overlay
4. Live prayer countdown with circular progress ring
5. Quick actions with haptic feedback + animated icons
6. Continue reading + daily challenge cards
7. Daily verse with audio playback, word-by-word breakdown, hafazan button
8. Hadith of the day section

## Lint Status
- Zero errors in src/ files
- App compiles and serves successfully at localhost:3000
