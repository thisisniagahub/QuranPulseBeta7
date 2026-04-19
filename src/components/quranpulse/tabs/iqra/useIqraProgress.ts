'use client'
import { useState, useCallback, useEffect } from 'react'
import {
  type LetterFilter,
  type BadgeCtx,
  IQRA_BOOKS,
  BADGES,
  LEARNING_PATH,
  DAILY_CHALLENGES,
  ENHANCED_LETTERS,
  HAFAZAN_SURAHS,
  TAJWID_CATEGORIES,
} from './types'

interface UseIqraProgressProps {
  iqraBook: number
  iqraPage: number
  streak: number
  xp: number
  addXp: (amount: number) => void
}

export function useIqraProgress({ iqraBook, iqraPage, streak, xp, addXp }: UseIqraProgressProps) {
  const [completedPages, setCompletedPages] = useState<Set<string>>(new Set())
  const [hafazanProgress, setHafazanProgress] = useState<Record<number, number>>({})
  const [tajwidMastered, setTajwidMastered] = useState<Set<string>>(new Set())
  const [letterFilter, setLetterFilter] = useState<LetterFilter>('all')
  const [learningMode, setLearningMode] = useState<'kids' | 'adult'>('kids')
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [challengeXp, setChallengeXp] = useState(0)
  const [writingLetter, setWritingLetter] = useState(0)
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null)

  // Assessment state
  const [assessmentActive, setAssessmentActive] = useState(false)
  const [assessmentIdx, setAssessmentIdx] = useState(0)
  const [assessmentScore, setAssessmentScore] = useState(0)
  const [assessmentLetters, setAssessmentLetters] = useState<typeof ENHANCED_LETTERS[number][]>([])
  const [assessmentDone, setAssessmentDone] = useState(false)
  const [assessmentOptions, setAssessmentOptions] = useState<string[][]>([])

  // Derived values
  const currentBook = IQRA_BOOKS.find(b => b.id === iqraBook) || IQRA_BOOKS[0]
  const pageKey = `${iqraBook}-${iqraPage}`
  const totalPagesCompleted = completedPages.size
  const overallProgress = Math.round((totalPagesCompleted / 168) * 100)

  const bookProgress = useCallback((bookId: number) => {
    const done = [...completedPages].filter(p => p.startsWith(`${bookId}-`)).length
    return Math.round((done / 28) * 100)
  }, [completedPages])

  const totalTajwidRules = TAJWID_CATEGORIES.reduce((s, c) => s + c.rules.length, 0)
  const totalHafazanVerses = HAFAZAN_SURAHS.reduce((s, v) => s + v.verses, 0)
  const hafazanVersesDone = Object.values(hafazanProgress).reduce((s, v) => s + v, 0)

  // Badge computation
  const completedLettersCount = [...completedPages].filter(p => p.startsWith('1-')).length >= 5 ? 29 : [...completedPages].filter(p => p.startsWith('1-')).length * 6
  const booksCompletedCount = IQRA_BOOKS.filter(b => bookProgress(b.id) === 100).length
  const surahsHafazCount = Object.entries(hafazanProgress).filter(([id, v]) => {
    const surah = HAFAZAN_SURAHS.find(s => s.id === Number(id))
    return surah && v >= surah.verses
  }).length

  const badgeCtx: BadgeCtx = {
    completedLetters: Math.min(29, completedLettersCount),
    harakaatMastered: bookProgress(2) >= 50 ? 3 : bookProgress(2) >= 20 ? 1 : 0,
    tajwidRules: tajwidMastered.size,
    surahsHafaz: surahsHafazCount,
    booksCompleted: booksCompletedCount,
    streak,
  }

  useEffect(() => {
    const earned = BADGES.filter(b => b.condition(badgeCtx)).map(b => b.id)
    setEarnedBadges(prev => {
      const newBadges = earned.filter(b => !prev.includes(b))
      if (newBadges.length > 0) newBadges.forEach(() => addXp(50))
      return earned
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badgeCtx.completedLetters, badgeCtx.harakaatMastered, badgeCtx.tajwidRules, badgeCtx.surahsHafaz, badgeCtx.booksCompleted, badgeCtx.streak])

  // Learning path progress
  const pathProgress = [
    Math.min(100, Math.round((completedLettersCount / 29) * 100)),
    bookProgress(2),
    bookProgress(3),
    Math.round((tajwidMastered.size / totalTajwidRules) * 100),
    Math.round(((bookProgress(4) + bookProgress(5) + bookProgress(6)) / 3)),
  ]

  // Daily challenge
  const dailySeed = Math.floor(Date.now() / 86400000)
  const dailyChallengeIdx = dailySeed % DAILY_CHALLENGES.length
  const dailyChallenge = DAILY_CHALLENGES[dailyChallengeIdx]
  const dailyItem = dailyChallenge.items[dailySeed % dailyChallenge.items.length]

  // JAKIM skill level
  const overallMastery = Math.round((overallProgress + (tajwidMastered.size / totalTajwidRules) * 100 + (hafazanVersesDone / totalHafazanVerses) * 100) / 3)
  const jakimLevel: { level: string; color: string } = overallMastery >= 75 ? { level: 'Lanjutan (Advanced)', color: '#d4af37' } : overallMastery >= 40 ? { level: 'Pertengahan (Intermediate)', color: '#4a4aa6' } : { level: 'Pemula (Beginner)', color: '#6a6ab6' }

  // Weekly activity (simulated from XP)
  const weeklyActivity = Array.from({ length: 7 }, (_, i) => {
    const dayOffset = (6 - i)
    const base = dayOffset === 0 ? xp % 50 : ((xp + dayOffset * 7) % 40) + 10
    return Math.min(100, base)
  })
  const dayNames = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab']

  // Strongest/weakest areas
  const areaScores = [
    { name: 'Huruf Hijaiyah', score: Math.min(100, Math.round((completedLettersCount / 29) * 100)) },
    { name: 'Harakat', score: bookProgress(2) },
    { name: 'Tanwin & Mad', score: bookProgress(3) },
    { name: 'Tajwid', score: Math.round((tajwidMastered.size / totalTajwidRules) * 100) },
    { name: 'Hafazan', score: Math.round((hafazanVersesDone / totalHafazanVerses) * 100) },
  ]
  const strongest = areaScores.reduce((a, b) => a.score >= b.score ? a : b)
  const weakest = areaScores.reduce((a, b) => a.score <= b.score ? a : b)

  // Derived: filtered letters
  const filteredLetters = letterFilter === 'harakat' || letterFilter === 'tanwin' || letterFilter === 'mad'
    ? []
    : ENHANCED_LETTERS.filter(() => {
        if (letterFilter === 'all' || letterFilter === 'hijaiyah') return true
        return false
      })

  // Handlers
  const markComplete = useCallback(() => {
    setCompletedPages(prev => new Set([...prev, pageKey]))
    addXp(25)
  }, [pageKey, addXp])

  const handleHarakatChallenge = useCallback((choice: string) => {
    const correct = dailyItem
    if (choice.includes(correct.charAt(0))) {
      setChallengeXp(prev => prev + 20)
      addXp(20)
    }
  }, [dailyItem, addXp])

  const startAssessment = useCallback(() => {
    const shuffled = [...ENHANCED_LETTERS].sort(() => Math.random() - 0.5)
    const picked = shuffled.slice(0, 5)
    setAssessmentLetters(picked)
    setAssessmentIdx(0)
    setAssessmentScore(0)
    setAssessmentDone(false)
    setAssessmentActive(true)
    const opts = picked.map(letter => {
      const correct = letter.name
      const options = [correct]
      while (options.length < 4) {
        const r = ENHANCED_LETTERS[Math.floor(Math.random() * ENHANCED_LETTERS.length)].name
        if (!options.includes(r)) options.push(r)
      }
      return options.sort(() => Math.random() - 0.5)
    })
    setAssessmentOptions(opts)
  }, [])

  return {
    // State
    completedPages, setCompletedPages,
    hafazanProgress, setHafazanProgress,
    tajwidMastered, setTajwidMastered,
    letterFilter, setLetterFilter,
    learningMode, setLearningMode,
    earnedBadges,
    challengeXp,
    writingLetter, setWritingLetter,
    writingFeedback, setWritingFeedback,
    assessmentActive, setAssessmentActive,
    assessmentIdx, setAssessmentIdx,
    assessmentScore, setAssessmentScore,
    assessmentLetters,
    assessmentDone, setAssessmentDone,
    assessmentOptions,

    // Derived
    currentBook,
    pageKey,
    totalPagesCompleted,
    overallProgress,
    bookProgress,
    totalTajwidRules,
    totalHafazanVerses,
    hafazanVersesDone,
    completedLettersCount,
    badgeCtx,
    pathProgress,
    dailyChallenge,
    dailyItem,
    overallMastery,
    jakimLevel,
    weeklyActivity,
    dayNames,
    strongest,
    weakest,
    filteredLetters,

    // Handlers
    markComplete,
    handleHarakatChallenge,
    startAssessment,
  }
}
