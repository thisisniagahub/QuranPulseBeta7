'use client'

import { useState, useMemo, useCallback } from 'react'
import { SURAH_LIST } from '@/lib/quran-data'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import type { VerseData } from './types'

interface UseQuranBookmarksParams {
  selectedSurah: number
  verses: VerseData[]
}

export function useQuranBookmarks({ selectedSurah, verses }: UseQuranBookmarksParams) {
  const store = useQuranPulseStore()

  // Khatam tracking
  const [khatamMarkedVerses, setKhatamMarkedVerses] = useState<Set<string>>(new Set())

  const totalQuranVerses = 6236

  // Khatam progress
  const khatamProgress = useMemo(() => {
    const totalMarked = khatamMarkedVerses.size
    return Math.min(Math.round((totalMarked / totalQuranVerses) * 100), 100)
  }, [khatamMarkedVerses, totalQuranVerses])

  const markCurrentViewAsRead = useCallback(() => {
    if (verses.length === 0) return
    const newMarked = new Set(khatamMarkedVerses)
    verses.forEach(v => newMarked.add(`${selectedSurah}-${v.verseNumber}`))
    setKhatamMarkedVerses(newMarked)
    store.addXp(verses.length * 2)
  }, [verses, selectedSurah, khatamMarkedVerses, store])

  // Khatam journey milestones
  const khatamJuzCompleted = useMemo(() => {
    const juzDone = new Set<number>()
    for (const key of khatamMarkedVerses) {
      const [sStr] = key.split('-')
      const sId = parseInt(sStr)
      const surah = SURAH_LIST.find(s => s.id === sId)
      if (surah) surah.juz.forEach(j => juzDone.add(j))
    }
    return juzDone
  }, [khatamMarkedVerses])

  const khatamJuzCount = khatamJuzCompleted.size

  // Juz progress (deterministic)
  const getJuzProgress = useCallback((juz: number) => {
    const bookmarkedInJuz = store.bookmarkedVerses.filter(v => {
      const surah = SURAH_LIST.find(s => s.id === v.surahId)
      return surah?.juz.includes(juz)
    })
    const surahs = SURAH_LIST.filter(s => s.juz.includes(juz))
    const totalVerses = surahs.reduce((a, s) => a + s.versesCount, 0)
    if (totalVerses === 0) return 0
    return Math.min(Math.round((bookmarkedInJuz.length / totalVerses) * 100), 100)
  }, [store.bookmarkedVerses])

  // Verses read count
  const versesRead = useMemo(() => {
    return SURAH_LIST.slice(0, selectedSurah - 1).reduce((acc, s) => acc + s.versesCount, 0)
  }, [selectedSurah])

  return {
    khatamMarkedVerses,
    khatamProgress,
    markCurrentViewAsRead,
    khatamJuzCount,
    getJuzProgress,
    totalQuranVerses,
    versesRead,
  }
}
