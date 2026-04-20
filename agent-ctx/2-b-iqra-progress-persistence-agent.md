# Task 2-b: IQRA Progress Persistence Agent

## Task
Add IQRA Progress Persistence to Zustand Store — ensure `completedPages`, `tajwidMastered`, and `hafazanProgress` from IqraTab.tsx are persisted to localStorage via the Zustand store instead of being lost on page refresh.

## Work Done

### 1. Zustand Store (`/src/stores/quranpulse-store.ts`)
Added new fields and actions to the store interface and implementation:

**New State Fields:**
- `iqraCompletedPages: string[]` — Array of completed page keys (e.g., "1-3", "2-7"). Array instead of Set for JSON serialization.
- `iqraTajwidMastered: string[]` — Array of mastered tajwid rule IDs.
- `iqraHafazanProgress: Record<number, number>` — Surah ID → completed verse count mapping.

**New Actions:**
- `markIqraPageComplete(pageKey: string): void` — Adds pageKey to iqraCompletedPages if not already present.
- `isIqraPageComplete(pageKey: string): boolean` — Checks if pageKey is in iqraCompletedPages.
- `markTajwidRuleMastered(ruleId: string): void` — Adds ruleId to iqraTajwidMastered if not already present.
- `toggleTajwidRuleMastered(ruleId: string): void` — Toggles ruleId in iqraTajwidMastered (add if missing, remove if present). Supports the existing toggle UI in IqraTajwidExplorer.
- `isTajwidRuleMastered(ruleId: string): boolean` — Checks if ruleId is in iqraTajwidMastered.
- `updateIqraHafazanProgress(surahId: number, verses: number): void` — Updates the hafazan progress for a specific surah.

**Partialize Update:**
Added all three new fields to the `partialize` function so they get persisted to localStorage:
- `iqraCompletedPages: state.iqraCompletedPages`
- `iqraTajwidMastered: state.iqraTajwidMastered`
- `iqraHafazanProgress: state.iqraHafazanProgress`

### 2. IqraTab.tsx (`/src/components/quranpulse/tabs/IqraTab.tsx`)
Updated to use store-based state instead of local useState:

- **Removed**: `const [completedPages, setCompletedPages] = useState<Set<string>>(new Set())`
- **Removed**: `const [tajwidMastered, setTajwidMastered] = useState<Set<string>>(new Set())`
- **Removed**: `const [hafazanProgress, setHafazanProgress] = useState<Record<number, number>>({})`
- **Added**: Store destructuring for `iqraCompletedPages`, `markIqraPageComplete`, `iqraTajwidMastered`, `toggleTajwidRuleMastered`, `iqraHafazanProgress`, `updateIqraHafazanProgress`
- **Added**: `useMemo`-wrapped Set derivations:
  - `const completedPages = useMemo(() => new Set(iqraCompletedPages), [iqraCompletedPages])`
  - `const tajwidMastered = useMemo(() => new Set(iqraTajwidMastered), [iqraTajwidMastered])`
- **Updated**: `markComplete` callback to use `markIqraPageComplete(pageKey)` instead of `setCompletedPages`
- **Updated**: Hafazan "+1 Ayat" button to use `updateIqraHafazanProgress` instead of `setHafazanProgress`
- **Updated**: IqraTajwidExplorer prop from `setTajwidMastered` to `toggleTajwidMastery={toggleTajwidRuleMastered}`
- **Added**: `useMemo` to React imports

### 3. IqraTajwidExplorer.tsx (`/src/components/quranpulse/tabs/iqra/IqraTajwidExplorer.tsx`)
Updated prop interface and implementation:

- **Changed**: `setTajwidMastered: React.Dispatch<React.SetStateAction<Set<string>>>` → `toggleTajwidMastery: (ruleId: string) => void`
- **Updated**: `toggleMastery` function to use `toggleTajwidMastery(ruleId)` with XP check before calling

## Verification
- ESLint passes with zero new errors (only pre-existing warnings in IqraTab.tsx)
- Dev server compiles successfully (GET / 200)
- All Set-based usage in IqraTab.tsx preserved via useMemo derivation
- Progress data will now survive page refresh via localStorage persistence

## Files Changed
1. `/src/stores/quranpulse-store.ts` — Added 3 new state fields, 6 new actions, 3 partialize entries
2. `/src/components/quranpulse/tabs/IqraTab.tsx` — Replaced 3 local useState with store-derived state
3. `/src/components/quranpulse/tabs/iqra/IqraTajwidExplorer.tsx` — Updated prop type and toggle implementation
