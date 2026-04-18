'use client'

import { create } from 'zustand'
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

  // Iqra
  iqraBook: number
  iqraPage: number
  setIqraBook: (book: number) => void
  setIqraPage: (page: number) => void

  // UI
  showTasbihModal: boolean
  setShowTasbihModal: (show: boolean) => void

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
}

export const useQuranPulseStore = create<QuranPulseState>((set, get) => ({
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

  // Iqra
  iqraBook: 1,
  iqraPage: 1,
  setIqraBook: (book) => set({ iqraBook: book }),
  setIqraPage: (page) => set({ iqraPage: page }),

  // UI
  showTasbihModal: false,
  setShowTasbihModal: (show) => set({ showTasbihModal: show }),

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
}))
