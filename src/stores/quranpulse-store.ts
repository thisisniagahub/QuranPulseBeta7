'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SURAH_LIST } from '@/lib/quran-data'

export type TabId = 'home' | 'quran' | 'ustaz-ai' | 'ibadah' | 'iqra' | 'more'

// Alias for compatibility
export type ActiveTab = TabId

interface BookmarkedVerse {
  surahId: number
  verseNumber: number
}

interface BookmarkedSurah {
  surahId: number
}

export type HafazanLevel = 'new' | 'learning' | 'review' | 'mastered'

export interface HafazanVerseProgress {
  surahId: number
  verseNumber: number
  level: HafazanLevel
  lastReviewed: number // timestamp
  correctCount: number
  incorrectCount: number
  nextReview: number // timestamp
}

export interface TasbihSession {
  id: string
  dhikr: string
  count: number
  target: number
  timestamp: number
  category: string
}

type TasbihVibrationPattern = 'short' | 'medium' | 'long'

interface QuranPulseState {
  // Navigation
  activeTab: TabId
  setActiveTab: (tab: TabId) => void

  // User profile
  userName: string
  setUserName: (name: string) => void
  xp: number
  level: number
  streak: number
  addXp: (amount: number) => void
  incrementStreak: () => void

  // Bookmarks
  bookmarkedVerses: BookmarkedVerse[]
  bookmarkedSurahs: BookmarkedSurah[]

  // Reading state
  lastReadSurah: number | null
  lastReadVerse: number | null
  lastReadAyah: number
  lastReadSurahName: string
  fontSize: 'small' | 'medium' | 'large'

  // Tasbih
  tasbihCount: number
  tasbihTarget: number
  tasbihTotal: number
  incrementTasbih: () => void
  resetTasbih: () => void
  setTasbihTarget: (target: number) => void

  // Tasbih settings (was missing — caused runtime errors)
  tasbihVibration: boolean
  setTasbihVibration: (v: boolean) => void
  tasbihSound: boolean
  setTasbihSound: (v: boolean) => void
  tasbihVibrationPattern: TasbihVibrationPattern
  setTasbihVibrationPattern: (p: TasbihVibrationPattern) => void
  tasbihSessions: TasbihSession[]
  addTasbihSession: (session: TasbihSession) => void

  // Iqra
  iqraBook: number
  iqraPage: number
  setIqraBook: (book: number) => void
  setIqraPage: (page: number) => void

  // UI
  showTasbihModal: boolean
  setShowTasbihModal: (show: boolean) => void

  // Prayer zone (JAKIM) — aliased for IbadahTab compatibility
  selectedZone: string
  setSelectedZone: (zone: string) => void
  // Aliases used by IbadahTab
  prayerZone: string
  setPrayerZone: (zone: string) => void

  // Hafazan progress (spaced repetition)
  hafazanProgress: HafazanVerseProgress[]
  updateHafazanVerse: (surahId: number, verseNumber: number, correct: boolean) => void
  getHafazanVerse: (surahId: number, verseNumber: number) => HafazanVerseProgress | undefined
  getWeakVerses: () => HafazanVerseProgress[]
  getDailyReviewVerses: () => HafazanVerseProgress[]

  // Actions — Bookmarks
  toggleVerseBookmark: (surahId: number, verseNumber: number) => void
  isVerseBookmarked: (surahId: number, verseNumber: number) => boolean
  toggleSurahBookmark: (surahId: number) => void
  isSurahBookmarked: (surahId: number) => boolean
  toggleBookmark: (id: string) => void
  isBookmarked: (id: string) => boolean
  bookmarkedIds: string[]
  setLastRead: (surahId: number, verseNumber: number) => void
  setFontSize: (size: 'small' | 'medium' | 'large') => void

  // QuranTab 2026 features
  khatamPages: number[] // pages read (1-604)
  markPageRead: (page: number) => void
  isPageRead: (page: number) => boolean
  nightReadingMode: boolean
  setNightReadingMode: (v: boolean) => void
  arabicFontSize: 'small' | 'medium' | 'large' | 'x-large'
  setArabicFontSize: (size: 'small' | 'medium' | 'large' | 'x-large') => void
  recentSearches: string[]
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  audioSleepTimer: number // minutes, 0 = off
  setAudioSleepTimer: (minutes: number) => void
}

// Spaced repetition intervals in milliseconds
const SR_INTERVALS: Record<HafazanLevel, number> = {
  new: 0,
  learning: 4 * 60 * 60 * 1000,      // 4 hours
  review: 24 * 60 * 60 * 1000,        // 1 day
  mastered: 7 * 24 * 60 * 60 * 1000,  // 7 days
}

function getNextLevel(current: HafazanLevel, correct: boolean): HafazanLevel {
  if (correct) {
    if (current === 'new') return 'learning'
    if (current === 'learning') return 'review'
    if (current === 'review') return 'mastered'
    return 'mastered'
  } else {
    if (current === 'mastered') return 'review'
    if (current === 'review') return 'learning'
    return 'learning'
  }
}

export const useQuranPulseStore = create<QuranPulseState>()(
  persist(
    (set, get) => ({
      // Navigation
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // User profile
      userName: 'Pengguna',
      setUserName: (name) => set({ userName: name }),
      xp: 1250,
      level: 5,
      streak: 7,
      addXp: (amount) =>
        set((state) => {
          const newXp = state.xp + amount
          const newLevel = Math.floor(newXp / 500) + 1
          return { xp: newXp, level: newLevel }
        }),
      incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),

      // Bookmarks
      bookmarkedVerses: [],
      bookmarkedSurahs: [],

      // Reading state
      lastReadSurah: null,
      lastReadVerse: null,
      lastReadAyah: 1,
      lastReadSurahName: 'Al-Fatihah',
      fontSize: 'medium',

      // Tasbih
      tasbihCount: 0,
      tasbihTarget: 33,
      tasbihTotal: 0,
      incrementTasbih: () =>
        set((state) => {
          const newCount = state.tasbihCount + 1
          const newTotal = state.tasbihTotal + 1
          if (newCount >= state.tasbihTarget) {
            return { tasbihCount: 0, tasbihTotal: newTotal }
          }
          return { tasbihCount: newCount, tasbihTotal: newTotal }
        }),
      resetTasbih: () => set({ tasbihCount: 0 }),
      setTasbihTarget: (target) => set({ tasbihTarget: target }),

      // Tasbih settings
      tasbihVibration: true,
      setTasbihVibration: (v) => set({ tasbihVibration: v }),
      tasbihSound: false,
      setTasbihSound: (v) => set({ tasbihSound: v }),
      tasbihVibrationPattern: 'medium' as TasbihVibrationPattern,
      setTasbihVibrationPattern: (p) => set({ tasbihVibrationPattern: p }),
      tasbihSessions: [] as TasbihSession[],
      addTasbihSession: (session) =>
        set((state) => ({ tasbihSessions: [...state.tasbihSessions, session] })),

      // Iqra
      iqraBook: 1,
      iqraPage: 1,
      setIqraBook: (book) => set({ iqraBook: book }),
      setIqraPage: (page) => set({ iqraPage: page }),

      // UI
      showTasbihModal: false,
      setShowTasbihModal: (show) => set({ showTasbihModal: show }),

      // Prayer zone (JAKIM) — with aliases
      selectedZone: 'WPKL01',
      setSelectedZone: (zone) => set({ selectedZone: zone, prayerZone: zone }),
      prayerZone: 'WPKL01',
      setPrayerZone: (zone) => set({ selectedZone: zone, prayerZone: zone }),

      // Hafazan progress (spaced repetition)
      hafazanProgress: [],
      updateHafazanVerse: (surahId, verseNumber, correct) => {
        const { hafazanProgress } = get()
        const existing = hafazanProgress.find(
          (p) => p.surahId === surahId && p.verseNumber === verseNumber
        )
        const now = Date.now()
        const currentLevel = existing?.level || 'new'
        const newLevel = getNextLevel(currentLevel, correct)
        const nextReview = now + SR_INTERVALS[newLevel]

        const updated: HafazanVerseProgress = {
          surahId,
          verseNumber,
          level: newLevel,
          lastReviewed: now,
          correctCount: (existing?.correctCount || 0) + (correct ? 1 : 0),
          incorrectCount: (existing?.incorrectCount || 0) + (correct ? 0 : 1),
          nextReview,
        }

        if (existing) {
          set({
            hafazanProgress: hafazanProgress.map((p) =>
              p.surahId === surahId && p.verseNumber === verseNumber ? updated : p
            ),
          })
        } else {
          set({
            hafazanProgress: [...hafazanProgress, updated],
          })
        }
      },
      getHafazanVerse: (surahId, verseNumber) => {
        return get().hafazanProgress.find(
          (p) => p.surahId === surahId && p.verseNumber === verseNumber
        )
      },
      getWeakVerses: () => {
        const { hafazanProgress } = get()
        return hafazanProgress.filter(
          (p) => p.level === 'learning' || p.incorrectCount > p.correctCount
        )
      },
      getDailyReviewVerses: () => {
        const now = Date.now()
        const { hafazanProgress } = get()
        return hafazanProgress.filter(
          (p) => p.level !== 'mastered' && p.nextReview <= now
        )
      },

      // Actions — Bookmarks
      toggleVerseBookmark: (surahId, verseNumber) => {
        const { bookmarkedVerses } = get()
        const existing = bookmarkedVerses.find(
          (b) => b.surahId === surahId && b.verseNumber === verseNumber
        )
        if (existing) {
          set({
            bookmarkedVerses: bookmarkedVerses.filter(
              (b) => !(b.surahId === surahId && b.verseNumber === verseNumber)
            ),
          })
        } else {
          set({
            bookmarkedVerses: [...bookmarkedVerses, { surahId, verseNumber }],
          })
        }
      },

      isVerseBookmarked: (surahId, verseNumber) => {
        return get().bookmarkedVerses.some(
          (b) => b.surahId === surahId && b.verseNumber === verseNumber
        )
      },

      toggleSurahBookmark: (surahId) => {
        const { bookmarkedSurahs } = get()
        const existing = bookmarkedSurahs.find((b) => b.surahId === surahId)
        if (existing) {
          set({
            bookmarkedSurahs: bookmarkedSurahs.filter((b) => b.surahId !== surahId),
          })
        } else {
          set({
            bookmarkedSurahs: [...bookmarkedSurahs, { surahId }],
          })
        }
      },

      isSurahBookmarked: (surahId) => {
        return get().bookmarkedSurahs.some((b) => b.surahId === surahId)
      },

      toggleBookmark: (id) => {
        const { bookmarkedIds } = get()
        if (bookmarkedIds.includes(id)) {
          set({ bookmarkedIds: bookmarkedIds.filter((b) => b !== id) })
        } else {
          set({ bookmarkedIds: [...bookmarkedIds, id] })
        }
      },

      isBookmarked: (id) => {
        return get().bookmarkedIds.includes(id)
      },

      bookmarkedIds: [] as string[],

      setLastRead: (surahId, verseNumber) => {
        const surah = SURAH_LIST.find((s) => s.id === surahId)
        set({
          lastReadSurah: surahId,
          lastReadVerse: verseNumber,
          lastReadAyah: verseNumber,
          lastReadSurahName: surah?.nameMs || '',
        })
      },

      setFontSize: (size) => {
        set({ fontSize: size })
      },

      // QuranTab 2026 features
      khatamPages: [] as number[],
      markPageRead: (page) => {
        const { khatamPages } = get()
        if (!khatamPages.includes(page)) {
          set({ khatamPages: [...khatamPages, page] })
        }
      },
      isPageRead: (page) => {
        return get().khatamPages.includes(page)
      },
      nightReadingMode: false,
      setNightReadingMode: (v) => set({ nightReadingMode: v }),
      arabicFontSize: 'medium' as 'small' | 'medium' | 'large' | 'x-large',
      setArabicFontSize: (size) => set({ arabicFontSize: size }),
      recentSearches: [] as string[],
      addRecentSearch: (query) => {
        const { recentSearches } = get()
        const filtered = recentSearches.filter(s => s !== query).slice(0, 9)
        set({ recentSearches: [query, ...filtered] })
      },
      clearRecentSearches: () => set({ recentSearches: [] }),
      audioSleepTimer: 0,
      setAudioSleepTimer: (minutes) => set({ audioSleepTimer: minutes }),
    }),
    {
      name: 'quranpulse-storage',
      storage: createJSONStorage(() => {
        // Use localStorage if available, otherwise in-memory
        if (typeof window !== 'undefined') {
          return localStorage
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({
        // Persist these fields to localStorage
        userName: state.userName,
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        bookmarkedVerses: state.bookmarkedVerses,
        bookmarkedSurahs: state.bookmarkedSurahs,
        bookmarkedIds: state.bookmarkedIds,
        lastReadSurah: state.lastReadSurah,
        lastReadVerse: state.lastReadVerse,
        lastReadAyah: state.lastReadAyah,
        lastReadSurahName: state.lastReadSurahName,
        fontSize: state.fontSize,
        tasbihTotal: state.tasbihTotal,
        tasbihVibration: state.tasbihVibration,
        tasbihSound: state.tasbihSound,
        tasbihVibrationPattern: state.tasbihVibrationPattern,
        tasbihSessions: state.tasbihSessions,
        iqraBook: state.iqraBook,
        iqraPage: state.iqraPage,
        selectedZone: state.selectedZone,
        prayerZone: state.prayerZone,
        hafazanProgress: state.hafazanProgress,
        khatamPages: state.khatamPages,
        nightReadingMode: state.nightReadingMode,
        arabicFontSize: state.arabicFontSize,
        recentSearches: state.recentSearches,
        audioSleepTimer: state.audioSleepTimer,
      }),
    }
  )
)
