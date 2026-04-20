'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, BookOpen, Brain, Target, MessageCircle, Mic, X, Send,
  Zap, Flame, Volume2, Play, Pause, Star, CheckCircle,
  Award, Shield, ChevronLeft, ChevronRight, Lock, Calendar,
} from 'lucide-react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import {
  type IqraSubTab, type PracticeMode, type LetterFilter, type ChatMsg, type BadgeCtx,
  IQRA_BOOKS, ENHANCED_LETTERS, BADGES, DAILY_CHALLENGES,
  HAFAZAN_SURAHS, TAJWID_CATEGORIES,
  MAKHRAJ_DATA, SIFAT_HURUF, QURAN_VERSES_PER_BOOK,
  TAFSIR_HURUF_FUNGSI, HARAKAT_COLORS,
  HARAKAT_DATA, TANWIN_MAD_DATA, MAD_DETAIL,
} from './iqra/types'
import { IqraBookNavigator } from './iqra/IqraBookNavigator'
import { IqraTajwidExplorer } from './iqra/IqraTajwidExplorer'
import { IqraRecitationPractice } from './iqra/IqraRecitationPractice'
import { IqraWritingPractice } from './iqra/IqraWritingPractice'
import { IqraQalqalahPractice } from './iqra/IqraQalqalahPractice'
import { IqraSpeedReading } from './iqra/IqraSpeedReading'
import { IqraIkhfaIqlabPractice } from './iqra/IqraIkhfaIqlabPractice'
import { IqraLamJalalahPractice } from './iqra/IqraLamJalalahPractice'
import { IqraMakhrajDiagram } from './iqra/IqraMakhrajDiagram'
import { IqraConnectedForms } from './iqra/IqraConnectedForms'
import { IqraTafsirHuruf } from './iqra/IqraTafsirHuruf'
import { IqraTajwidReadingView } from './iqra/IqraTajwidReadingView'
import { IqraWeakAreaDashboard } from './iqra/IqraWeakAreaDashboard'
import { IqraGeniusView } from './iqra/IqraGeniusView'
import { IqraStrokeAnimation } from './iqra/IqraStrokeAnimation'
import { IQRA_PAGE_CONTENT } from './iqra/iqra-pages'

// ============ Main Component ============
export function IqraTab() {
  const { iqraBook, iqraPage, setIqraBook, setIqraPage, xp, streak, addXp } = useQuranPulseStore()
  const [subTab, setSubTab] = useState<IqraSubTab>('belajar')
  const [completedPages, setCompletedPages] = useState<Set<string>>(new Set())
  const [hafazanProgress, setHafazanProgress] = useState<Record<number, number>>({})
  const [tajwidMastered, setTajwidMastered] = useState<Set<string>>(new Set())
  const [letterFilter, setLetterFilter] = useState<LetterFilter>('all')
  const [showAITutor, setShowAITutor] = useState(false)
  const [showLetterDetail, setShowLetterDetail] = useState<number | null>(null)
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('flashcard')
  const [flashcardIdx, setFlashcardIdx] = useState(0)
  const [flashcardFlipped, setFlashcardFlipped] = useState(false)
  const [quizQuestion, setQuizQuestion] = useState<{ letter: string; answer: string; options: string[] } | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [matchingPairs, setMatchingPairs] = useState<Array<{ id: number; arabic: string; name: string; matched: boolean }>>([])
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const [matchScore, setMatchScore] = useState(0)
  const [aiMessages, setAiMessages] = useState<ChatMsg[]>([])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [challengeXp, setChallengeXp] = useState(0)
  const [writingLetter, setWritingLetter] = useState(0)
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null)
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [learningMode, setLearningMode] = useState<'kids' | 'adult'>('kids')
  const [assessmentActive, setAssessmentActive] = useState(false)
  const [assessmentIdx, setAssessmentIdx] = useState(0)
  const [assessmentScore, setAssessmentScore] = useState(0)
  const [assessmentLetters, setAssessmentLetters] = useState<typeof ENHANCED_LETTERS[number][]>([])
  const [assessmentDone, setAssessmentDone] = useState(false)
  const [assessmentOptions, setAssessmentOptions] = useState<string[][]>([])
  const [view, setView] = useState<'books' | 'reader' | 'letters' | 'tajwid' | 'combined' | 'makhraj' | 'connected' | 'tafsir' | 'genius' | 'stroke' | 'weak-area' | 'tajwid-reading'>('books')
  const [geniusMode, setGeniusMode] = useState(false)
  const [showMakhraj, setShowMakhraj] = useState<string | null>(null)
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // Weekly activity
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

  // Filtered letters
  const filteredLetters = letterFilter === 'harakat' || letterFilter === 'tanwin' || letterFilter === 'mad'
    ? []
    : ENHANCED_LETTERS.filter(() => letterFilter === 'all' || letterFilter === 'hijaiyah')

  // Audio playback
  const playAudio = useCallback(async (text: string, id: string, speed?: number) => {
    if (playingAudio === id) return
    setPlayingAudio(id)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'tongtong', speed: speed || audioSpeed }),
      })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.onended = () => { URL.revokeObjectURL(url); setPlayingAudio(null) }
        audio.onerror = () => { URL.revokeObjectURL(url); setPlayingAudio(null) }
        await audio.play()
      } else { setPlayingAudio(null) }
    } catch { setPlayingAudio(null) }
  }, [playingAudio, audioSpeed])

  // Auto-play
  const startAutoPlay = useCallback(() => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false)
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current)
      return
    }
    setIsAutoPlaying(true)
    let idx = 0
    const playNext = () => {
      if (idx >= filteredLetters.length) { setIsAutoPlaying(false); return }
      const letter = filteredLetters[idx]
      playAudio(letter.name, `auto-${letter.id}`)
      idx++
      autoPlayRef.current = setTimeout(playNext, 2500)
    }
    playNext()
  }, [isAutoPlaying, filteredLetters, playAudio])

  // Handlers
  const handleHarakatChallenge = useCallback((choice: string) => {
    const correct = dailyItem
    if (choice.includes(correct.charAt(0))) {
      setChallengeXp(prev => prev + 20)
      addXp(20)
    }
  }, [dailyItem, addXp])

  const markComplete = useCallback(() => {
    setCompletedPages(prev => new Set([...prev, pageKey]))
    addXp(25)
  }, [pageKey, addXp])

  const sendAI = useCallback(async () => {
    if (!aiInput.trim() || aiLoading) return
    const msg = aiInput.trim()
    setAiInput('')
    setAiMessages(prev => [...prev, { role: 'user', text: msg }])
    setAiLoading(true)
    try {
      const res = await fetch('/api/ustaz-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `[Guru Iqra] ${msg}`, persona: 'ustazah', history: aiMessages.slice(-6) }),
      })
      const data = await res.json()
      setAiMessages(prev => [...prev, { role: 'ai', text: data.response || 'Maaf, saya tidak dapat menjawab soalan itu sekarang.' }])
    } catch {
      setAiMessages(prev => [...prev, { role: 'ai', text: 'Maaf, guru AI tidak tersedia sekarang. Sila cuba lagi.' }])
    }
    setAiLoading(false)
  }, [aiInput, aiLoading, aiMessages])

  const generateQuiz = useCallback(() => {
    const idx = Math.floor(Math.random() * ENHANCED_LETTERS.length)
    const correct = ENHANCED_LETTERS[idx]
    const options = [correct.name]
    while (options.length < 4) {
      const r = ENHANCED_LETTERS[Math.floor(Math.random() * ENHANCED_LETTERS.length)].name
      if (!options.includes(r)) options.push(r)
    }
    options.sort(() => Math.random() - 0.5)
    setQuizQuestion({ letter: correct.letter, answer: correct.name, options })
  }, [])

  const initMatching = useCallback(() => {
    const subset = ENHANCED_LETTERS.slice(0, 6)
    const pairs = subset.map((l, i) => ({ id: i, arabic: l.letter, name: l.name, matched: false }))
    const shuffled = [...pairs].sort(() => Math.random() - 0.5)
    setMatchingPairs(shuffled)
    setSelectedMatch(null)
    setMatchScore(0)
  }, [])

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

  // Effects
  useEffect(() => { if (practiceMode === 'quiz' && !quizQuestion) generateQuiz() }, [practiceMode, quizQuestion, generateQuiz])
  useEffect(() => { if (practiceMode === 'matching' && matchingPairs.length === 0) initMatching() }, [practiceMode, matchingPairs.length, initMatching])
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [aiMessages])
  useEffect(() => {
    if (showLetterDetail !== null) {
      const l = ENHANCED_LETTERS[showLetterDetail]
      playAudio(l.name, `letter-auto-${l.id}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLetterDetail])

  const navigatePage = (delta: number) => {
    const newPage = Math.max(1, Math.min(currentBook.pages, iqraPage + delta))
    setIqraPage(newPage)
  }

  const SUB_TABS: { key: IqraSubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'belajar', label: 'Belajar', icon: <BookOpen className="h-4 w-4" /> },
    { key: 'latihan', label: 'Latihan', icon: <Brain className="h-4 w-4" /> },
    { key: 'tajwid', label: 'Tajwid', icon: <Target className="h-4 w-4" /> },
    { key: 'hafazan', label: 'Hafazan', icon: <GraduationCap className="h-4 w-4" /> },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-2 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>Iqra Digital</h2>
              {playingAudio && (
                <motion.span className="text-sm" style={{ color: '#d4af37' }} animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ type: 'tween', duration: 1.2, repeat: Infinity }}>♪</motion.span>
              )}
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.25)' }}>JAKIM</span>
            </div>
            <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Belajar membaca Al-Quran — Kaedah Iqra&rsquo; 1-6</p>
            {/* Learning Mode Toggle */}
            <div className="flex gap-1 mt-1">
              {(['kids', 'adult'] as const).map(mode => (
                <button
                  key={mode}
                  className="px-2.5 py-1.5 rounded-full text-[9px] font-medium transition-all"
                  style={{
                    background: learningMode === mode ? 'rgba(212,175,55,0.15)' : 'transparent',
                    color: learningMode === mode ? '#d4af37' : 'rgba(204,204,204,0.4)',
                    border: learningMode === mode ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                  }}
                  onClick={() => setLearningMode(mode)}
                >{mode === 'kids' ? '🧒 Kanak-kanak' : '👨 Dewasa'}</button>
              ))}
              <button
                className="px-2.5 py-1.5 rounded-full text-[9px] font-medium transition-all"
                style={{
                  background: geniusMode ? 'rgba(139,92,246,0.15)' : 'transparent',
                  color: geniusMode ? '#8b5cf6' : 'rgba(204,204,204,0.4)',
                  border: geniusMode ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                }}
                onClick={() => setGeniusMode(!geniusMode)}
              >🧬 Genius</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.12)' }}>
              <Flame className="h-3 w-3" style={{ color: '#d4af37' }} />
              <span className="text-[10px] font-bold" style={{ color: '#d4af37' }}>{streak}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(74,74,166,0.12)' }}>
              <Zap className="h-3 w-3" style={{ color: '#4a4aa6' }} />
              <span className="text-[10px] font-bold" style={{ color: '#4a4aa6' }}>{xp}</span>
            </div>
          </div>
          {/* Audio Speed */}
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Kelajuan:</span>
            {[{ label: '🐢', speed: 0.6 }, { label: '🔄', speed: 1.0 }, { label: '🚀', speed: 1.3 }].map(s => (
              <button
                key={s.speed}
                className="px-1.5 py-1.5 rounded text-[10px]"
                style={{
                  background: Math.abs(audioSpeed - s.speed) < 0.01 ? 'rgba(212,175,55,0.15)' : 'transparent',
                  border: Math.abs(audioSpeed - s.speed) < 0.01 ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                  color: Math.abs(audioSpeed - s.speed) < 0.01 ? '#d4af37' : 'rgba(204,204,204,0.4)',
                }}
                onClick={() => setAudioSpeed(s.speed)}
              >{s.label}</button>
            ))}
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(42,42,106,0.4)' }}>
          {SUB_TABS.map(tab => (
            <button
              key={tab.key}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-medium transition-all"
              style={{
                background: subTab === tab.key ? 'rgba(74,74,166,0.25)' : 'transparent',
                color: subTab === tab.key ? '#ffffff' : 'rgba(204,204,204,0.5)',
                border: subTab === tab.key ? '1px solid rgba(74,74,166,0.3)' : '1px solid transparent',
              }}
              onClick={() => { setSubTab(tab.key); setView('books') }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {subTab === 'belajar' && <BelajarView />}
          {subTab === 'latihan' && <LatihanView />}
          {subTab === 'tajwid' && <TajwidExplorerView />}
          {subTab === 'hafazan' && <HafazanView />}
        </motion.div>
      </AnimatePresence>

      {/* AI Tutor FAB */}
      <button
        className="fixed bottom-24 right-4 z-30 h-12 w-12 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'linear-gradient(135deg, #4a4aa6, #6a6ab6)', boxShadow: '0 4px 15px rgba(74,74,166,0.4)' }}
        onClick={() => setShowAITutor(true)}
      >
        <MessageCircle className="h-5 w-5 text-white" />
      </button>

      {/* AI Tutor Bottom Sheet */}
      <AnimatePresence>
        {showAITutor && (
          <motion.div className="fixed inset-0 z-50 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowAITutor(false)} />
            <motion.div
              className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl rounded-t-2xl flex flex-col"
              style={{ background: '#1a1a4a', border: '1px solid rgba(74,74,166,0.2)', maxHeight: '70vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
            >
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(74,74,166,0.1)' }}>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,74,166,0.2)' }}>
                    <GraduationCap className="h-4 w-4" style={{ color: '#4a4aa6' }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>Tanya Cikgu</div>
                    <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Guru Iqra AI</div>
                  </div>
                </div>
                <button onClick={() => setShowAITutor(false)}><X className="h-5 w-5" style={{ color: 'rgba(204,204,204,0.5)' }} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 qp-scroll" style={{ maxHeight: '40vh' }}>
                {aiMessages.length === 0 && (
                  <div className="text-center py-4">
                    <div className="text-2xl mb-2">🤲</div>
                    <div className="text-xs" style={{ color: 'rgba(204,204,204,0.6)' }}>Tanya apa-apa tentang tajwid, harakat, atau Iqra</div>
                    <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                      {['Apa itu Idgham?', 'Bila guna Mad Wajib?', 'Cara baca Tanwin', 'Apa itu Qalqalah?'].map(q => (
                        <button key={q} className="px-2.5 py-1 rounded-full text-[10px]" style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.2)' }} onClick={() => setAiInput(q)}>{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {aiMessages.map((msg, i) => (
                  <motion.div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="max-w-[80%] rounded-xl px-3 py-2 text-xs" style={{ background: msg.role === 'user' ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.6)', border: `1px solid ${msg.role === 'user' ? 'rgba(74,74,166,0.3)' : 'rgba(74,74,166,0.1)'}`, color: '#ffffff' }}>{msg.text}</div>
                  </motion.div>
                ))}
                {aiLoading && (
                  <div className="flex gap-1 px-3 py-2">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="h-2 w-2 rounded-full" style={{ background: '#4a4aa6' }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ type: 'tween', duration: 1, repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <div className="px-3 py-2 flex items-center gap-2" style={{ borderTop: '1px solid rgba(74,74,166,0.1)' }}>
                <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.12)' }} onClick={() => playAudio('Sila baca selepas ini', 'voice-input')}><Mic className="h-4 w-4" style={{ color: '#4a4aa6' }} /></button>
                <input className="flex-1 rounded-lg px-3 py-2 text-xs outline-none" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }} placeholder="Tanya soalan..." value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAI()} />
                <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.3)' }} onClick={sendAI} disabled={aiLoading}><Send className="h-4 w-4" style={{ color: '#4a4aa6' }} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter Detail Modal */}
      <AnimatePresence>
        {showLetterDetail !== null && ENHANCED_LETTERS[showLetterDetail] && (
          <LetterDetailModal
            letter={ENHANCED_LETTERS[showLetterDetail]}
            learningMode={learningMode}
            playingAudio={playingAudio}
            playAudio={playAudio}
            onClose={() => setShowLetterDetail(null)}
            onPrev={showLetterDetail > 0 ? () => setShowLetterDetail(showLetterDetail - 1) : undefined}
            onNext={showLetterDetail < ENHANCED_LETTERS.length - 1 ? () => setShowLetterDetail(showLetterDetail + 1) : undefined}
          />
        )}
      </AnimatePresence>
    </div>
  )

  // ============ Inline Views (kept from original, optimized) ============

  function BelajarView() {
    if (view === 'reader') {
      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center gap-1 text-xs" style={{ color: '#4a4aa6' }} onClick={() => setView('books')}><ChevronLeft className="h-4 w-4" /> Kembali</button>
            <div className="text-center">
              <div className="text-xs font-semibold" style={{ color: currentBook.color }}>Iqra {iqraBook}</div>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Halaman {iqraPage}/{currentBook.pages}</div>
            </div>
            <button className="p-1.5 rounded-lg" style={{ background: 'rgba(74,74,166,0.12)' }} onClick={markComplete}>
              {completedPages.has(pageKey) ? <CheckCircle className="h-4 w-4" style={{ color: '#4a4aa6' }} /> : <Star className="h-4 w-4" style={{ color: '#4a4aa6' }} />}
            </button>
          </div>
          <div className="h-1 rounded-full mb-3 overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
            <motion.div className="h-full rounded-full" style={{ background: currentBook.color }} animate={{ width: `${(iqraPage / currentBook.pages) * 100}%` }} />
          </div>
          <motion.div className="rounded-xl p-5 min-h-[350px] flex flex-col items-center justify-center" style={{ background: 'rgba(42,42,106,0.3)', border: `1px solid ${currentBook.color}20` }} key={pageKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {renderIqraContent(iqraBook, iqraPage, playAudio)}
            <button className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px]" style={{ background: `${currentBook.color}15`, color: currentBook.color, border: `1px solid ${currentBook.color}25` }} onClick={() => playAudio(getIqraAudioText(iqraBook, iqraPage), `iqra-${pageKey}`)}>
              {playingAudio === `iqra-${pageKey}` ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              Dengar Bacaan
            </button>
          </motion.div>
          <div className="flex justify-between mt-3">
            <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px]" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)', color: iqraPage > 1 ? '#4a4aa6' : 'rgba(204,204,204,0.3)' }} disabled={iqraPage <= 1} onClick={() => navigatePage(-1)}><ChevronLeft className="h-3.5 w-3.5" /> Sebelum</button>
            {completedPages.has(pageKey) && <span className="text-[10px] self-center" style={{ color: '#4a4aa6' }}>✓ Selesai</span>}
            <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px]" style={{ background: `${currentBook.color}15`, border: `1px solid ${currentBook.color}25`, color: currentBook.color }} disabled={iqraPage >= currentBook.pages} onClick={() => navigatePage(1)}>Seterusnya <ChevronRight className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      )
    }

    if (view === 'letters') {
      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center gap-1 text-xs" style={{ color: '#4a4aa6' }} onClick={() => setView('books')}><ChevronLeft className="h-4 w-4" /> Kembali</button>
            <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>Huruf Hijaiyah</span>
            <div style={{ width: 60 }} />
          </div>
          <div className="flex gap-1.5 mb-3 overflow-x-auto">
            {(['all', 'hijaiyah', 'harakat', 'tanwin', 'mad'] as LetterFilter[]).map(f => (
              <button key={f} className="px-3 py-1 rounded-full text-[10px] capitalize whitespace-nowrap" style={{ background: letterFilter === f ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.4)', color: letterFilter === f ? '#ffffff' : 'rgba(204,204,204,0.5)', border: `1px solid ${letterFilter === f ? 'rgba(74,74,166,0.3)' : 'transparent'}` }} onClick={() => setLetterFilter(f)}>{f === 'all' ? 'Semua' : f === 'hijaiyah' ? 'Huruf' : f === 'harakat' ? 'Baris' : f === 'tanwin' ? 'Tanwin' : 'Mad'}</button>
            ))}
            {(letterFilter === 'all' || letterFilter === 'hijaiyah') && filteredLetters.length > 0 && (
              <button className="px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap flex items-center gap-1" style={{ background: isAutoPlaying ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.4)', border: `1px solid ${isAutoPlaying ? 'rgba(212,175,55,0.3)' : 'transparent'}`, color: isAutoPlaying ? '#d4af37' : 'rgba(204,204,204,0.5)' }} onClick={startAutoPlay}>
                {isAutoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {isAutoPlaying ? 'Henti' : 'Auto'}
              </button>
            )}
          </div>
          {(letterFilter === 'all' || letterFilter === 'hijaiyah') && (
            <div className={`grid ${learningMode === 'kids' ? 'grid-cols-3' : 'grid-cols-5'} gap-2`}>
              {filteredLetters.map((letter, i) => {
                const tafsir = TAFSIR_HURUF_FUNGSI.find(t => t.letter === letter.letter)
                const isQalqalah = tafsir?.isQalqalah ?? false
                const isThick = tafsir?.isThick ?? false
                const isMadd = tafsir?.isMadd ?? false
                const dotColor = isQalqalah ? '#ef4444' : isThick ? '#d4af37' : isMadd ? '#3b82f6' : null
                return (
                  <motion.button key={letter.id} className="aspect-square rounded-xl flex flex-col items-center justify-center relative" style={{ background: 'rgba(42,42,106,0.5)', border: playingAudio === `letter-grid-${letter.id}` ? '2px solid #d4af37' : isThick && geniusMode ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(74,74,166,0.1)' }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.015 }} onClick={() => { setShowLetterDetail(i); playAudio(letter.name, `letter-grid-${letter.id}`) }}>
                    <span className={`${learningMode === 'kids' ? 'text-3xl' : 'text-lg'}`} style={{ color: isThick && geniusMode ? '#d4af37' : '#ffffff' }}>{letter.letter}</span>
                    <span className={`${learningMode === 'kids' ? 'text-[10px]' : 'text-[9px]'} mt-0.5`} style={{ color: 'rgba(204,204,204,0.5)' }}>{letter.name}</span>
                    {dotColor && geniusMode && <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />}
                    {geniusMode && tafsir && tafsir.categories.length > 0 && <span className="absolute bottom-0.5 left-0.5 text-[7px] px-0.5 rounded" style={{ background: 'rgba(139,92,246,0.2)', color: '#8b5cf6' }}>{tafsir.categories[0]}</span>}
                    {learningMode === 'kids' && !geniusMode && <span className="absolute bottom-1 right-1 text-[10px]" style={{ color: 'rgba(212,175,55,0.5)' }}>🔊</span>}
                  </motion.button>
                )
              })}
            </div>
          )}
          {letterFilter === 'harakat' && (
            <div className="grid grid-cols-2 gap-2.5">
              {[...HARAKAT_DATA, { id: 'sukun', name: 'Sukun', nameAr: 'سُكُون', symbol: 'ْ', desc: 'Tanpa baris — huruf mati', example: 'بْ (b)', color: HARAKAT_COLORS.sukun }, { id: 'shaddah', name: 'Syaddah', nameAr: 'شَدَّة', symbol: 'ّ', desc: 'Gandaan — bunyi berulang', example: 'بّ (bb)', color: HARAKAT_COLORS.shaddah }].map(h => {
                const hColor = h.id === 'fathah' ? HARAKAT_COLORS.fathah : h.id === 'kasrah' ? HARAKAT_COLORS.kasrah : h.id === 'dhammah' ? HARAKAT_COLORS.dhammah : (h as { color?: string }).color || '#d4af37'
                return (
                  <motion.button key={h.id} className="rounded-xl p-4 text-center" style={{ background: `${hColor}10`, border: `1px solid ${hColor}25` }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => playAudio(h.example.replace(/[()]/g, '').trim(), `harakat-${h.id}`, 0.7)}>
                    <div className="text-4xl font-arabic mb-1" style={{ color: hColor }}>{h.symbol}</div>
                    <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{h.name}</div>
                    <div className="text-2xl font-arabic my-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{h.nameAr}</div>
                    <div className="text-[9px] mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{h.desc}</div>
                    <div className="text-lg font-arabic" style={{ color: hColor }}>{h.example}</div>
                    <Volume2 className="h-3 w-3 mx-auto mt-1.5" style={{ color: `${hColor}80` }} />
                  </motion.button>
                )
              })}
            </div>
          )}
          {letterFilter === 'tanwin' && (
            <div className="space-y-2.5">
              {TANWIN_MAD_DATA.filter(t => t.id.startsWith('tanwin')).map((t, i) => {
                const tColor = t.id === 'tanwin-fath' ? HARAKAT_COLORS.tanwinFath : t.id === 'tanwin-kasr' ? HARAKAT_COLORS.tanwinKasr : HARAKAT_COLORS.tanwinDham
                return (
                  <motion.div key={t.id} className="rounded-xl p-4" style={{ background: `${tColor}10`, border: `1px solid ${tColor}25` }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                    <div className="flex items-center gap-3">
                      <div className="text-4xl font-arabic" style={{ color: tColor }}>{t.symbol}</div>
                      <div className="flex-1">
                        <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{t.name}</div>
                        <div className="text-xl font-arabic" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.nameAr}</div>
                        <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{t.desc}</div>
                      </div>
                      <div className="text-2xl font-arabic" style={{ color: tColor }}>{t.example}</div>
                    </div>
                    <button className="mt-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px]" style={{ background: `${tColor}15`, border: `1px solid ${tColor}25`, color: tColor }} onClick={() => playAudio(t.example.replace(/[()]/g, '').trim(), `tanwin-${t.id}`, 0.7)}>
                      <Volume2 className="h-3 w-3" /> Dengar
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )}
          {letterFilter === 'mad' && (
            <div className="space-y-2.5">
              {MAD_DETAIL.map((m, i) => (
                <motion.div key={m.id} className="rounded-xl p-3" style={{ background: `${m.color}08`, border: `1px solid ${m.color}20` }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: m.color }} />
                    <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{m.name}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)', direction: 'rtl' as const }}>{m.nameAr}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="rounded-lg p-2" style={{ background: 'rgba(42,42,106,0.4)' }}>
                      <div className="text-[8px] uppercase tracking-wide" style={{ color: 'rgba(204,204,204,0.4)' }}>Panjang</div>
                      <div className="text-[11px] font-semibold" style={{ color: m.color }}>{m.length}</div>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: 'rgba(42,42,106,0.4)' }}>
                      <div className="text-[8px] uppercase tracking-wide" style={{ color: 'rgba(204,204,204,0.4)' }}>Iqra&apos; Buku</div>
                      <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{m.book}</div>
                    </div>
                  </div>
                  <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(26,26,74,0.5)' }}>
                    <div className="text-lg font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>{m.example}</div>
                  </div>
                  <button className="mt-2 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px]" style={{ background: `${m.color}15`, border: `1px solid ${m.color}25`, color: m.color }} onClick={() => playAudio(m.example, `mad-${m.id}`)}>
                    <Volume2 className="h-3 w-3" /> Dengar
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )
    }

    // Default: Book grid + progress
    return (
      <div>
        {/* Book Navigator */}
        <IqraBookNavigator bookProgress={bookProgress} setIqraBook={setIqraBook} setIqraPage={setIqraPage} setView={setView} />

        {/* Quick access buttons */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }} onClick={() => setView('letters')}>
            <div className="text-lg">🔤</div>
            <div className="text-[9px] font-medium" style={{ color: '#ffffff' }}>Huruf</div>
          </button>
          <button className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }} onClick={() => setSubTab('latihan')}>
            <div className="text-lg">🧠</div>
            <div className="text-[9px] font-medium" style={{ color: '#ffffff' }}>Latihan</div>
          </button>
          <button className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }} onClick={() => setShowAITutor(true)}>
            <div className="text-lg">🙋</div>
            <div className="text-[9px] font-medium" style={{ color: '#ffffff' }}>Tanya Cikgu</div>
          </button>
        </div>

        {/* Progress summary */}
        <ProgressSummary />
      </div>
    )
  }

  function LatihanView() {
    return (
      <div>
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {(['flashcard', 'quiz', 'matching', 'tulis', 'sebut', 'qalqalah', 'speed', 'ikhfa-iqlab', 'lam-jalalah'] as const).map(mode => (
            <button key={mode} className="px-3 py-1.5 rounded-full text-[10px] capitalize whitespace-nowrap" style={{ background: practiceMode === mode ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.4)', color: practiceMode === mode ? '#ffffff' : 'rgba(204,204,204,0.5)', border: `1px solid ${practiceMode === mode ? 'rgba(74,74,166,0.3)' : 'transparent'}` }} onClick={() => setPracticeMode(mode)}>
              {mode === 'tulis' ? '✏️ Tulis' : mode === 'sebut' ? '🎤 Sebut' : mode === 'flashcard' ? '🃏 Kad' : mode === 'quiz' ? '❓ Kuiz' : mode === 'matching' ? '🔗 Padan' : mode === 'qalqalah' ? '💥 Qalqalah' : mode === 'speed' ? '⚡ Pantas' : mode === 'ikhfa-iqlab' ? '🫧 Ikhfa/Iqlab' : '🕌 Lam Jalalah'}
            </button>
          ))}
        </div>

        {practiceMode === 'sebut' && (
          <IqraRecitationPractice iqraBook={iqraBook} playingAudio={playingAudio} playAudio={playAudio} audioSpeed={audioSpeed} addXp={addXp} learningMode={learningMode} />
        )}

        {practiceMode === 'tulis' && (
          <IqraWritingPractice writingLetter={writingLetter} setWritingLetter={setWritingLetter} writingFeedback={writingFeedback} setWritingFeedback={setWritingFeedback} addXp={addXp} filteredLetters={filteredLetters.length > 0 ? filteredLetters : ENHANCED_LETTERS} />
        )}

        {practiceMode === 'qalqalah' && (
          <IqraQalqalahPractice playingAudio={playingAudio} playAudio={playAudio} addXp={addXp} />
        )}

        {practiceMode === 'speed' && (
          <IqraSpeedReading iqraBook={iqraBook} playAudio={playAudio} addXp={addXp} />
        )}

        {practiceMode === 'ikhfa-iqlab' && (
          <IqraIkhfaIqlabPractice addXp={addXp} playAudio={playAudio} playingAudio={playingAudio} />
        )}

        {practiceMode === 'lam-jalalah' && (
          <IqraLamJalalahPractice playAudio={playAudio} addXp={addXp} playingAudio={playingAudio} />
        )}

        {practiceMode === 'flashcard' && filteredLetters.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>{flashcardIdx + 1} / {filteredLetters.length}</div>
            <motion.div className="w-full max-w-[280px] aspect-[3/2] rounded-2xl flex flex-col items-center justify-center cursor-pointer" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.15)' }} onClick={() => setFlashcardFlipped(!flashcardFlipped)} layout>
              <AnimatePresence mode="wait">
                {!flashcardFlipped ? (
                  <motion.div key="front" className="flex flex-col items-center" initial={{ rotateY: 0 }} animate={{ rotateY: 0 }} exit={{ rotateY: 90 }} transition={{ duration: 0.15 }}>
                    <span className="text-5xl" style={{ color: '#ffffff' }}>{filteredLetters[flashcardIdx]?.letter}</span>
                  </motion.div>
                ) : (
                  <motion.div key="back" className="flex flex-col items-center gap-2" initial={{ rotateY: -90 }} animate={{ rotateY: 0 }} transition={{ duration: 0.15 }}>
                    <span className="text-2xl font-semibold" style={{ color: '#d4af37' }}>{filteredLetters[flashcardIdx]?.name}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{filteredLetters[flashcardIdx]?.nameMs}</span>
                    <button className="mt-2 p-2 rounded-full" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={(e) => { e.stopPropagation(); playAudio(filteredLetters[flashcardIdx]?.name || '', `fc-${flashcardIdx}`) }}><Volume2 className="h-4 w-4" style={{ color: '#4a4aa6' }} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            <div className="flex gap-3 mt-3">
              <button className="px-4 py-2 rounded-xl text-[11px]" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)', color: '#4a4aa6' }} onClick={() => { setFlashcardIdx(prev => (prev - 1 + filteredLetters.length) % filteredLetters.length); setFlashcardFlipped(false) }}>← Sebelum</button>
              <button className="px-4 py-2 rounded-xl text-[11px]" style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }} onClick={() => { setFlashcardIdx(prev => (prev + 1) % filteredLetters.length); setFlashcardFlipped(false) }}>Seterusnya →</button>
            </div>
          </div>
        )}

        {practiceMode === 'quiz' && quizQuestion && (
          <div className="flex flex-col items-center">
            <div className="text-5xl mb-4" style={{ color: '#ffffff' }}>{quizQuestion.letter}</div>
            <div className="text-[10px] mb-3" style={{ color: 'rgba(204,204,204,0.5)' }}>Apakah nama huruf ini?</div>
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-[320px]">
              {quizQuestion.options.map((opt, i) => (
                <motion.button key={i} className="py-3 rounded-xl text-[11px] font-medium" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }} whileTap={{ scale: 0.95 }} onClick={() => { if (opt === quizQuestion.answer) { setQuizScore(prev => prev + 1); addXp(10) } generateQuiz() }}>{opt}</motion.button>
              ))}
            </div>
            <div className="mt-3 text-[10px]" style={{ color: '#d4af37' }}>Skor: {quizScore}</div>
          </div>
        )}

        {practiceMode === 'matching' && matchingPairs.length > 0 && (
          <div>
            <div className="text-center mb-3"><span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Padankan huruf dengan nama — Skor: {matchScore}</span></div>
            <div className="grid grid-cols-3 gap-2">
              {matchingPairs.map(pair => (
                <motion.button key={pair.id} className="py-3 rounded-xl text-center" style={{ background: pair.matched ? 'rgba(34,197,94,0.1)' : selectedMatch === pair.id ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.5)', border: `1px solid ${pair.matched ? 'rgba(34,197,94,0.2)' : selectedMatch === pair.id ? 'rgba(212,175,55,0.3)' : 'rgba(74,74,166,0.1)'}`, opacity: pair.matched ? 0.5 : 1 }} disabled={pair.matched} onClick={() => {
                  if (selectedMatch === null) { setSelectedMatch(pair.id) }
                  else if (selectedMatch === pair.id) { setSelectedMatch(null) }
                  else {
                    const selected = matchingPairs.find(p => p.id === selectedMatch)
                    if (selected?.arabic === pair.arabic || selected?.name === pair.name) {
                      setMatchingPairs(prev => prev.map(p => p.id === selectedMatch || p.id === pair.id ? { ...p, matched: true } : p))
                      setMatchScore(prev => prev + 1)
                      addXp(5)
                    }
                    setSelectedMatch(null)
                  }
                }}>
                  <span className="text-xl" style={{ color: '#ffffff', direction: 'rtl' }}>{pair.arabic}</span>
                  <span className="text-[9px] block mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>{pair.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  function TajwidExplorerView() {
    return (
      <div>
        {/* Tajwid Sub-view Navigation */}
        <div className="flex gap-1 mb-3 overflow-x-auto pb-1">
          {([
            { key: 'explorer', label: '🧭 Hukum', viewKey: 'explorer' },
            { key: 'reading', label: '🎨 Bacaan', viewKey: 'tajwid-reading' },
            { key: 'weak', label: '📊 Analisis', viewKey: 'weak-area' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              className="px-3 py-1.5 rounded-full text-[10px] whitespace-nowrap font-medium transition-all"
              style={{
                background: view === tab.viewKey || (tab.key === 'explorer' && view === 'books') ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.4)',
                color: view === tab.viewKey || (tab.key === 'explorer' && view === 'books') ? '#ffffff' : 'rgba(204,204,204,0.5)',
                border: `1px solid ${view === tab.viewKey || (tab.key === 'explorer' && view === 'books') ? 'rgba(74,74,166,0.3)' : 'transparent'}`,
              }}
              onClick={() => setView(tab.viewKey)}
            >{tab.label}</button>
          ))}
        </div>

        {(view === 'books' || view === 'explorer') && (
          <IqraTajwidExplorer tajwidMastered={tajwidMastered} setTajwidMastered={setTajwidMastered} playingAudio={playingAudio} playAudio={playAudio} addXp={addXp} />
        )}
        {view === 'tajwid-reading' && (
          <IqraTajwidReadingView iqraBook={iqraBook} playingAudio={playingAudio} playAudio={playAudio} audioSpeed={audioSpeed} addXp={addXp} />
        )}
        {view === 'weak-area' && (
          <IqraWeakAreaDashboard completedPages={completedPages} tajwidMastered={tajwidMastered} bookProgress={bookProgress} xp={xp} streak={streak} />
        )}
      </div>
    )
  }

  function HafazanView() {
    return (
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <GraduationCap className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Hafazan Surah</span>
          <span className="text-[9px] ml-auto" style={{ color: 'rgba(204,204,204,0.4)' }}>{hafazanVersesDone}/{totalHafazanVerses} ayat</span>
        </div>
        <div className="space-y-2">
          {HAFAZAN_SURAHS.map(surah => {
            const progress = hafazanProgress[surah.id] || 0
            const isComplete = progress >= surah.verses
            return (
              <motion.div key={surah.id} className="rounded-xl p-3" style={{ background: isComplete ? 'rgba(34,197,94,0.06)' : 'rgba(42,42,106,0.3)', border: `1px solid ${isComplete ? 'rgba(34,197,94,0.15)' : 'rgba(74,74,166,0.1)'}` }} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-arabic" style={{ color: isComplete ? '#22c55e' : '#ffffff' }}>{surah.name}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{surah.nameMs}</span>
                  </div>
                  {isComplete && <CheckCircle className="h-3.5 w-3.5" style={{ color: '#22c55e' }} />}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
                    <motion.div className="h-full rounded-full" style={{ background: isComplete ? '#22c55e' : '#4a4aa6' }} animate={{ width: `${(progress / surah.verses) * 100}%` }} />
                  </div>
                  <span className="text-[9px]" style={{ color: isComplete ? '#22c55e' : 'rgba(204,204,204,0.4)' }}>{progress}/{surah.verses}</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  <button className="px-2 py-1 rounded-lg text-[9px]" style={{ background: 'rgba(74,74,166,0.1)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.15)' }} onClick={() => playAudio(surah.nameMs, `hafazan-${surah.id}`)}><Volume2 className="h-3 w-3 inline mr-1" />Dengar</button>
                  <button className="px-2 py-1 rounded-lg text-[9px]" style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.15)' }} onClick={() => { setHafazanProgress(prev => ({ ...prev, [surah.id]: Math.min(surah.verses, (prev[surah.id] || 0) + 1) })); addXp(15) }}>+1 Ayat</button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  function ProgressSummary() {
    return (
      <div className="mt-3 space-y-2.5">
        {/* Overall progress */}
        <div className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg, rgba(74,74,166,0.1), rgba(212,175,55,0.05))', border: '1px solid rgba(74,74,166,0.12)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium" style={{ color: '#ffffff' }}>Progres Keseluruhan</span>
            <span className="text-[10px]" style={{ color: '#4a4aa6' }}>{overallProgress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
            <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} animate={{ width: `${overallProgress}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <div className="text-center"><div className="text-xs font-bold" style={{ color: '#4a4aa6' }}>{totalPagesCompleted}</div><div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Halaman</div></div>
            <div className="text-center"><div className="text-xs font-bold" style={{ color: '#d4af37' }}>{tajwidMastered.size}/{totalTajwidRules}</div><div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Tajwid</div></div>
            <div className="text-center"><div className="text-xs font-bold" style={{ color: '#6a6ab6' }}>{hafazanVersesDone}/{totalHafazanVerses}</div><div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Hafazan</div></div>
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Award className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Pencapaian</span>
            <span className="text-[9px] ml-auto" style={{ color: 'rgba(204,204,204,0.4)' }}>{earnedBadges.length}/{BADGES.length}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {BADGES.map(badge => {
              const earned = earnedBadges.includes(badge.id)
              return (
                <div key={badge.id} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm" style={{ background: earned ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.5)', border: `2px solid ${earned ? '#d4af37' : 'rgba(74,74,166,0.15)'}`, boxShadow: earned ? '0 0 8px rgba(212,175,55,0.3)' : 'none' }}>
                    {earned ? badge.icon : <Lock className="h-3.5 w-3.5" style={{ color: 'rgba(204,204,204,0.25)' }} />}
                  </div>
                  <span className="text-[9px] text-center max-w-[64px]" style={{ color: earned ? '#d4af37' : 'rgba(204,204,204,0.3)' }}>{badge.name}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* JAKIM Skill Level */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.25)', border: '1px solid rgba(74,74,166,0.08)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Shield className="h-3.5 w-3.5" style={{ color: jakimLevel.color }} />
            <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Tahap Kemahiran JAKIM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
              <div className="h-full rounded-full" style={{ width: `${overallMastery}%`, background: jakimLevel.color }} />
            </div>
            <span className="text-[9px] font-semibold" style={{ color: jakimLevel.color }}>{jakimLevel.level}</span>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Cabaran Harian</span>
            <span className="text-[10px] ml-auto px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>+20 XP</span>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}>
            <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.6)' }}>{dailyChallenge.instruction}</div>
            {dailyChallenge.type === 'sebut' ? (
              <>
                <div className="text-5xl font-arabic mb-2" style={{ color: '#d4af37' }}>{dailyItem}</div>
                <button className="flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg text-[10px]" style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.2)' }} onClick={() => { playAudio(dailyItem, 'daily-challenge'); addXp(20) }}><Volume2 className="h-3 w-3" /> Sebut & Dengar</button>
              </>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {['فَتْحَة (a)', 'كَسْرَة (i)', 'ضَمَّة (u)'].map((opt, i) => (
                  <button key={i} className="py-2 rounded-lg text-[9px] font-medium" style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }} onClick={() => handleHarakatChallenge(opt)}>{opt}</button>
                ))}
              </div>
            )}
          </div>
          {challengeXp > 0 && <div className="text-[9px] mt-1.5 text-right" style={{ color: '#d4af37' }}>+{challengeXp} XP hari ini</div>}
        </div>

        <div className="text-center py-2" style={{ borderTop: '1px solid rgba(74,74,166,0.06)' }}>
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.3)' }}>Sumber: Kementerian Pendidikan Malaysia & JAKIM</span>
        </div>
      </div>
    )
  }
}

// ============ Helper Components ============

// HARAKAT_DATA is now imported from types.ts

function LetterDetailModal({ letter, learningMode, playingAudio, playAudio, onClose, onPrev, onNext }: {
  letter: typeof ENHANCED_LETTERS[number]
  learningMode: 'kids' | 'adult'
  playingAudio: string | null
  playAudio: (text: string, id: string, speed?: number) => void
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
}) {
  const makhraj = MAKHRAJ_DATA.find(m => m.letter === letter.letter)
  const sifat = SIFAT_HURUF.find(s => s.letter === letter.letter)
  const tafsir = TAFSIR_HURUF_FUNGSI.find(t => t.letter === letter.letter)

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div className="relative w-[90%] max-w-[420px] rounded-2xl p-5 max-h-[85vh] overflow-y-auto qp-scroll" style={{ background: '#1a1a4a', border: '1px solid rgba(74,74,166,0.25)' }} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
        <button className="absolute top-3 right-3" onClick={onClose}><X className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.5)' }} /></button>
        {onPrev && <button className="absolute top-3 left-3 p-1 rounded-lg" style={{ background: 'rgba(74,74,166,0.12)' }} onClick={onPrev}><ChevronLeft className="h-4 w-4" style={{ color: '#4a4aa6' }} /></button>}
        {onNext && <button className="absolute top-3 left-10 p-1 rounded-lg" style={{ background: 'rgba(74,74,166,0.12)' }} onClick={onNext}><ChevronRight className="h-4 w-4" style={{ color: '#4a4aa6' }} /></button>}

        {/* Letter display */}
        <div className="text-center mb-3">
          <div className={`${learningMode === 'kids' ? 'text-7xl' : 'text-5xl'} font-arabic`} style={{ color: sifat?.thick ? '#d4af37' : '#ffffff' }}>{letter.letter}</div>
          <div className="text-sm font-semibold mt-1" style={{ color: '#d4af37' }}>{letter.name}</div>
          {tafsir && <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
            {tafsir.categories.map((cat, i) => (
              <span key={i} className="px-1.5 py-0.5 rounded-full text-[7px] font-bold" style={{
                background: cat === 'Qalqalah' ? 'rgba(239,68,68,0.12)' : cat === 'Huruf Madd' || cat === 'Madd' ? 'rgba(59,130,246,0.12)' : cat === 'Syamsiyyah' ? 'rgba(212,175,55,0.12)' : cat === 'Qamariyyah' ? 'rgba(106,106,182,0.12)' : 'rgba(139,92,246,0.12)',
                color: cat === 'Qalqalah' ? '#ef4444' : cat === 'Huruf Madd' || cat === 'Madd' ? '#3b82f6' : cat === 'Syamsiyyah' ? '#d4af37' : cat === 'Qamariyyah' ? '#6a6ab6' : '#8b5cf6',
                border: `1px solid ${cat === 'Qalqalah' ? 'rgba(239,68,68,0.2)' : cat === 'Huruf Madd' || cat === 'Madd' ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)'}`
              }}>{cat}</span>
            ))}
          </div>}
        </div>

        {/* All 4 Letter Forms */}
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.12)' }}>
          <div className="text-[10px] font-semibold mb-2" style={{ color: '#8b5cf6' }}>📝 Bentuk Huruf</div>
          <div className="grid grid-cols-4 gap-1.5">
            {(['isolated', 'initial', 'medial', 'final'] as const).map(form => (
              <div key={form} className="rounded-lg p-2 text-center" style={{ background: 'rgba(26,26,74,0.5)', border: '1px solid rgba(74,74,166,0.08)' }}>
                <div className="text-2xl font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{letter.forms[form]}</div>
                <div className="text-[7px] mt-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>{form === 'isolated' ? 'Tunggal' : form === 'initial' ? 'Depan' : form === 'medial' ? 'Tengah' : 'Belakang'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Color-Coded Harakat grid */}
        <div className="grid grid-cols-5 gap-1.5 mb-3">
          {Object.entries(letter.harakat).map(([key, val]) => {
            const hColor = key === 'fathah' ? HARAKAT_COLORS.fathah : key === 'kasrah' ? HARAKAT_COLORS.kasrah : key === 'dhammah' ? HARAKAT_COLORS.dhammah : key === 'shaddah' ? HARAKAT_COLORS.shaddah : HARAKAT_COLORS.sukun
            return (
              <button key={key} className="rounded-xl p-2 text-center" style={{ background: `${hColor}10`, border: `1px solid ${hColor}25` }} onClick={() => playAudio(val, `${letter.id}-${key}`)}>
                <div className="text-2xl font-arabic" style={{ color: hColor }}>{val}</div>
                <div className="text-[7px] capitalize" style={{ color: hColor }}>{key === 'fathah' ? 'Atas' : key === 'kasrah' ? 'Bawah' : key === 'dhammah' ? 'Depan' : key === 'shaddah' ? 'Ganda' : 'Mati'}</div>
              </button>
            )
          })}
        </div>

        {/* Makhraj info */}
        {makhraj && (
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(74,74,166,0.08)', border: '1px solid rgba(74,74,166,0.15)' }}>
            <div className="text-[10px] font-semibold mb-1" style={{ color: '#4a4aa6' }}>🗣️ Makhraj</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.6)' }}>{makhraj.makhraj}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold" style={{ background: makhraj.group === 'Halqi' ? 'rgba(74,74,166,0.12)' : makhraj.group === 'Syafawi' ? 'rgba(34,197,94,0.12)' : 'rgba(128,90,182,0.12)', color: makhraj.group === 'Halqi' ? '#4a4aa6' : makhraj.group === 'Syafawi' ? '#22c55e' : '#6a6ab6' }}>{makhraj.group}</span>
              <span className="text-[9px] font-arabic" style={{ color: 'rgba(204,204,204,0.4)' }}>{makhraj.makhrajAr}</span>
            </div>
          </div>
        )}

        {/* Sifat info */}
        {sifat && (
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
            <div className="text-[10px] font-semibold mb-1" style={{ color: '#d4af37' }}>✨ Sifat</div>
            <div className="flex flex-wrap gap-1">
              {sifat.sifat.map((s, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded-full text-[8px]" style={{ background: 'rgba(212,175,55,0.08)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.15)' }}>{s}</span>
              ))}
              <span className="px-1.5 py-0.5 rounded-full text-[8px] font-bold" style={{ background: sifat.thick ? 'rgba(239,68,68,0.1)' : 'rgba(74,74,166,0.1)', color: sifat.thick ? '#ef4444' : '#4a4aa6', border: `1px solid ${sifat.thick ? 'rgba(239,68,68,0.2)' : 'rgba(74,74,166,0.2)'}` }}>{sifat.thick ? 'Tebal (Tafkhim)' : 'Nipis (Tarqiq)'}</span>
            </div>
          </div>
        )}

        {/* Writing tip */}
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.2)', border: '1px solid rgba(74,74,166,0.08)' }}>
          <div className="text-[10px] font-semibold mb-1" style={{ color: '#ffffff' }}>✏️ Cara Menulis</div>
          <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.6)' }}>{letter.writingTip}</div>
        </div>

        {/* Play all button */}
        <button className="w-full py-2.5 rounded-xl text-[11px] font-medium flex items-center justify-center gap-2" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.25)' }} onClick={() => {
          const entries = Object.entries(letter.harakat)
          entries.forEach(([key, val], i) => { setTimeout(() => playAudio(val, `${letter.id}-all-${key}`), i * 1500) })
        }}>
          <Volume2 className="h-3.5 w-3.5" /> Mainkan Semua Baris
        </button>
      </motion.div>
    </motion.div>
  )
}

// ============ Iqra Content Renderers ============

function renderIqraContent(iqraBook: number, iqraPage: number, playAudio: (text: string, id: string) => void) {
  if (iqraBook === 1) {
    const perPage = 6
    const start = ((iqraPage - 1) * perPage) % ENHANCED_LETTERS.length
    const pageLetters = Array.from({ length: perPage }, (_, i) => ENHANCED_LETTERS[(start + i) % ENHANCED_LETTERS.length])
    return (
      <div className="w-full">
        <div className="text-center mb-3"><span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6' }}>Pengenalan Huruf Hijaiyah + Fathah</span></div>
        <div className="grid grid-cols-3 gap-2">
          {pageLetters.map(l => (
            <div key={l.id} className="aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer" style={{ background: 'rgba(74,74,166,0.06)', border: '1px solid rgba(74,74,166,0.1)' }} onClick={() => playAudio(l.name, `iqra-letter-${l.id}`)}>
              <span className="text-3xl" style={{ color: '#ffffff' }}>{l.harakat.fathah}</span>
              <span className="text-[9px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>{l.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (iqraBook === 2) {
    const combos = ['بَا', 'بِي', 'بُو', 'تَا', 'تِي', 'تُو', 'ثَا', 'ثِي', 'ثُو', 'جَا', 'جِي', 'جُو']
    const perPage = 6
    const start = ((iqraPage - 1) * perPage) % combos.length
    const pageItems = Array.from({ length: perPage }, (_, i) => combos[(start + i) % combos.length])
    return (
      <div className="w-full">
        <div className="text-center mb-3"><span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(106,106,182,0.12)', color: '#6a6ab6' }}>Huruf Bersambung + Mad Asli</span></div>
        <div className="grid grid-cols-3 gap-2">
          {pageItems.map((c, i) => (
            <div key={i} className="aspect-square rounded-xl flex items-center justify-center" style={{ background: 'rgba(106,106,182,0.06)', border: '1px solid rgba(106,106,182,0.1)' }}>
              <span className="text-2xl" style={{ color: '#ffffff', direction: 'rtl' }}>{c}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (iqraBook === 3) {
    return (
      <div className="w-full">
        <div className="text-center mb-3"><span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>Kasrah, Dhammah & Mad</span></div>
        <div className="grid grid-cols-3 gap-2">
          {ENHANCED_LETTERS.slice(0, 9).map(l => (
            <div key={l.id} className="rounded-xl p-2 text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <div className="text-xl font-arabic" style={{ color: '#ffffff' }}>{l.harakat.fathah} {l.harakat.kasrah} {l.harakat.dhammah}</div>
              <div className="text-[9px]" style={{ color: '#d4af37' }}>{l.name}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  // Books 4-6: Quran verses with Tajwid
  const verses = QURAN_VERSES_PER_BOOK[iqraBook] || [
    { verse: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ', translation: 'Dengan nama Allah Yang Maha Pemurah Lagi Maha Penyayang', surah: 'Al-Fatihah 1:1' },
    { verse: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translation: 'Katakanlah: Dialah Allah Yang Maha Esa', surah: 'Al-Ikhlas 112:1' },
    { verse: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا', translation: 'Sesungguhnya bersama kesulitan ada kemudahan', surah: 'Al-Insyirah 94:6' },
  ]
  const labels: Record<number, string> = { 4: 'Tanwin, Qalqalah & Izhar', 5: 'Qamariyyah, Syamsiyyah & Idgham', 6: 'Tajwid Lengkap & Bacaan Quran' }
  return (
    <div className="w-full">
      <div className="text-center mb-3"><span className="text-[10px] px-2 py-1 rounded-full" style={{ background: `${currentBook.color}12`, color: currentBook.color }}>{labels[iqraBook] || 'Latihan'}</span></div>
      <div className="space-y-2">
        {verses.map((v, i) => (
          <div key={i} className="rounded-xl p-3 text-center" style={{ background: `${currentBook.color}06`, border: `1px solid ${currentBook.color}12` }}>
            <p className="text-xl leading-loose font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{v.verse}</p>
            <p className="text-[10px] mt-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{v.translation}</p>
            <p className="text-[9px]" style={{ color: 'rgba(204,204,204,0.3)' }}>{v.surah}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function getIqraAudioText(iqraBook: number, iqraPage: number): string {
  if (iqraBook === 1) {
    const perPage = 6
    const start = ((iqraPage - 1) * perPage) % ENHANCED_LETTERS.length
    return Array.from({ length: perPage }, (_, i) => ENHANCED_LETTERS[(start + i) % ENHANCED_LETTERS.length].name).join(', ')
  }
  return `Iqra ${iqraBook}, halaman ${iqraPage}`
}

const currentBook = IQRA_BOOKS[0] // fallback only
