'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Timer, Play, Pause, SkipForward, RotateCcw, Trophy, Zap, ChevronRight } from 'lucide-react'
import { ENHANCED_LETTERS, QURAN_VERSES_PER_BOOK } from './types'

interface IqraSpeedReadingProps {
  iqraBook: number
  playAudio: (text: string, id: string) => void
  addXp: (amount: number) => void
}

type Difficulty = 'perlahan' | 'biasa' | 'pantas'

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; labelMs: string; time: number; icon: string; desc: string }> = {
  perlahan: { label: 'Slow', labelMs: 'Perlahan', time: 60, icon: '🐢', desc: 'Huruf sahaja' },
  biasa: { label: 'Medium', labelMs: 'Biasa', time: 45, icon: '🚶', desc: 'Perkataan' },
  pantas: { label: 'Fast', labelMs: 'Pantas', time: 30, icon: '🚀', desc: 'Ayat Al-Quran' },
}

const LETTER_ITEMS = ENHANCED_LETTERS.slice(0, 15).map(l => l.letter)

const WORD_ITEMS = [
  'كِتَابٌ', 'بِسْمِ', 'ٱللَّهِ', 'رَبِّ', 'حَمْدُ', 'نَعْبُدُ', 'إِيَّاكَ', 'صِرَٰطَ',
  'مُسْتَقِيمَ', 'رَحْمَـٰنِ', 'رَحِيمِ', 'مَـٰلِكِ', 'دِينِ', 'نَسْتَعِينُ', 'أَعُوذُ',
  'أَحَدٌ', 'صَمَدُ', 'يَلِدْ', 'كُفُوًا', 'نَاسِ', 'خَلَقَ', 'عَلَّمَ',
]

function getVersesForBook(book: number): string[] {
  const bookVerses = QURAN_VERSES_PER_BOOK[book]
  if (bookVerses && bookVerses.length > 0) {
    return bookVerses.map(v => v.verse)
  }
  return QURAN_VERSES_PER_BOOK[1]?.map(v => v.verse) || []
}

export function IqraSpeedReading({ iqraBook, playAudio, addXp }: IqraSpeedReadingProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('biasa')
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(45)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wordsRead, setWordsRead] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const items = difficulty === 'perlahan'
    ? LETTER_ITEMS
    : difficulty === 'biasa'
      ? WORD_ITEMS
      : getVersesForBook(iqraBook)

  const totalTime = DIFFICULTY_CONFIG[difficulty].time

  // Timer logic
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0 && isRunning) {
        endSession()
      }
      return
    }
    timerRef.current = setTimeout(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, timeLeft])

  const startSession = useCallback(() => {
    setIsRunning(true)
    setTimeLeft(totalTime)
    setCurrentIndex(0)
    setWordsRead(0)
    setStartTime(Date.now())
    setShowResults(false)

    // Auto-play first item
    const shuffledItems = [...items].sort(() => Math.random() - 0.5)
    if (shuffledItems.length > 0) {
      playAudio(shuffledItems[0], 'speed-reading-0')
    }
  }, [totalTime, items, playAudio])

  const handleNext = useCallback(() => {
    const nextIdx = currentIndex + 1
    setWordsRead(prev => prev + 1)
    setCurrentIndex(nextIdx)

    if (nextIdx < items.length && isRunning) {
      playAudio(items[nextIdx % items.length], `speed-reading-${nextIdx}`)
    }
  }, [currentIndex, items, isRunning, playAudio])

  const endSession = useCallback(() => {
    setIsRunning(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    setShowResults(true)

    // Calculate XP
    const xpPerWord = 5
    const bonusThreshold = 10
    const earnedXp = wordsRead * xpPerWord + (wordsRead > bonusThreshold ? 20 : 0)
    if (earnedXp > 0) addXp(earnedXp)
  }, [wordsRead, addXp])

  const resetSession = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(totalTime)
    setCurrentIndex(0)
    setWordsRead(0)
    setStartTime(null)
    setShowResults(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [totalTime])

  const currentWord = items[currentIndex % items.length]
  const elapsedSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : 0
  const wpm = elapsedSeconds > 0 ? Math.round((wordsRead / elapsedSeconds) * 60) : 0
  const progressPercent = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  const earnedXp = wordsRead * 5 + (wordsRead > 10 ? 20 : 0)

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,74,166,0.15)' }}>
          <Timer className="h-4 w-4" style={{ color: '#4a4aa6' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: '#ffffff' }}>Bacaan Pantas</h3>
          <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Latihan kelancaran membaca Arab</p>
        </div>
      </div>

      {/* Difficulty Selection */}
      {!isRunning && !showResults && (
        <div className="grid grid-cols-3 gap-2">
          {(Object.entries(DIFFICULTY_CONFIG) as [Difficulty, typeof DIFFICULTY_CONFIG[Difficulty]][]).map(([key, config]) => (
            <button
              key={key}
              className="rounded-xl p-3 text-center transition-all"
              style={{
                background: difficulty === key ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.4)',
                border: difficulty === key ? '1px solid rgba(74,74,166,0.4)' : '1px solid rgba(74,74,166,0.1)',
              }}
              onClick={() => setDifficulty(key)}
            >
              <div className="text-lg">{config.icon}</div>
              <div className="text-[10px] font-semibold" style={{ color: difficulty === key ? '#ffffff' : 'rgba(204,204,204,0.5)' }}>{config.labelMs}</div>
              <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{config.desc}</div>
              <div className="text-[9px] mt-1" style={{ color: '#d4af37' }}>{config.time}s</div>
            </button>
          ))}
        </div>
      )}

      {/* Active Session */}
      {isRunning && (
        <div className="space-y-3">
          {/* Timer Bar */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5" style={{ color: timeLeft <= 10 ? '#ef4444' : '#d4af37' }} />
              <span className="text-sm font-bold tabular-nums" style={{ color: timeLeft <= 10 ? '#ef4444' : '#ffffff' }}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6' }}>
                {wordsRead} dibaca
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: '#d4af37' }}>
                ~{wpm} wpm
              </span>
            </div>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(42,42,106,0.5)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: timeLeft <= 10 ? '#ef4444' : '#d4af37' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Current Word Display */}
          <motion.div
            className="rounded-xl p-6 text-center min-h-[160px] flex flex-col items-center justify-center"
            style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.15)' }}
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-[9px] uppercase tracking-wide mb-2" style={{ color: 'rgba(204,204,204,0.4)' }}>
              {difficulty === 'perlahan' ? 'Huruf' : difficulty === 'biasa' ? 'Perkataan' : 'Ayat'}
            </div>
            <div
              className={`${difficulty === 'pantas' ? 'text-xl' : 'text-4xl'} font-arabic leading-relaxed`}
              style={{ color: '#d4af37', direction: 'rtl' as const }}
            >
              {currentWord}
            </div>
            <div className="text-[9px] mt-2" style={{ color: 'rgba(204,204,204,0.3)' }}>
              #{currentIndex + 1} daripada {items.length}
            </div>
          </motion.div>

          {/* Next Button */}
          <div className="flex gap-2">
            <button
              className="flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.3)', color: '#4a4aa6' }}
              onClick={() => setIsRunning(false)}
            >
              <Pause className="h-4 w-4" />
              Jeda
            </button>
            <button
              className="flex-[2] py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#d4af37' }}
              onClick={handleNext}
            >
              <SkipForward className="h-4 w-4" />
              Seterusnya
            </button>
          </div>
        </div>
      )}

      {/* Paused State */}
      {!isRunning && !showResults && startTime !== null && timeLeft > 0 && (
        <div className="space-y-3">
          <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
            <div className="text-sm" style={{ color: 'rgba(204,204,204,0.6)' }}>Dijeda</div>
            <div className="text-lg font-bold" style={{ color: '#ffffff' }}>{wordsRead} perkataan dibaca</div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.3)', color: '#4a4aa6' }}
              onClick={() => setIsRunning(true)}
            >
              <Play className="h-4 w-4" />
              Sambung
            </button>
            <button
              className="py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}
              onClick={endSession}
            >
              Tamat
            </button>
          </div>
        </div>
      )}

      {/* Results Screen */}
      {showResults && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-6 w-6" style={{ color: '#d4af37' }} />
              <span className="text-sm font-bold" style={{ color: '#d4af37' }}>Keputusan</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="rounded-lg p-2" style={{ background: 'rgba(26,26,74,0.5)' }}>
                <div className="text-[8px] uppercase tracking-wide" style={{ color: 'rgba(204,204,204,0.4)' }}>WPM</div>
                <div className="text-lg font-bold" style={{ color: '#d4af37' }}>{wpm}</div>
              </div>
              <div className="rounded-lg p-2" style={{ background: 'rgba(26,26,74,0.5)' }}>
                <div className="text-[8px] uppercase tracking-wide" style={{ color: 'rgba(204,204,204,0.4)' }}>Dibaca</div>
                <div className="text-lg font-bold" style={{ color: '#ffffff' }}>{wordsRead}</div>
              </div>
              <div className="rounded-lg p-2" style={{ background: 'rgba(26,26,74,0.5)' }}>
                <div className="text-[8px] uppercase tracking-wide" style={{ color: 'rgba(204,204,204,0.4)' }}>Masa</div>
                <div className="text-lg font-bold" style={{ color: '#4a4aa6' }}>{totalTime - timeLeft}s</div>
              </div>
            </div>

            {/* Accuracy Estimate */}
            <div className="mt-3 rounded-lg p-2" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Anggaran Ketepatan</div>
              <div className="text-sm font-bold" style={{ color: '#22c55e' }}>
                {wpm >= 30 ? 'Cemerlang 🌟' : wpm >= 15 ? 'Baik ✅' : 'Perlu Latihan 💪'}
              </div>
            </div>

            {/* XP Earned */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <Zap className="h-4 w-4" style={{ color: '#d4af37' }} />
              <span className="text-sm font-bold" style={{ color: '#d4af37' }}>+{earnedXp} XP</span>
              {wordsRead > 10 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
                  +20 Bonus!
                </span>
              )}
            </div>
          </div>

          <button
            className="w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.3)', color: '#4a4aa6' }}
            onClick={resetSession}
          >
            <RotateCcw className="h-4 w-4" />
            Cuba Lagi
          </button>
        </motion.div>
      )}

      {/* Start Button (initial) */}
      {!isRunning && !showResults && startTime === null && (
        <button
          className="w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
          style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#d4af37' }}
          onClick={startSession}
        >
          <Play className="h-4 w-4" />
          Mula Bacaan Pantas
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
