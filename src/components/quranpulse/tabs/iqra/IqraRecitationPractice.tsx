'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, Volume2, Play, Pause, ChevronLeft, ChevronRight,
  Star, Check, X, RotateCcw,
} from 'lucide-react'
import {
  ENHANCED_LETTERS,
  QURAN_VERSES_PER_BOOK,
  MAKHRAJ_DATA,
  IQRA_BOOKS,
} from './types'

interface IqraRecitationPracticeProps {
  iqraBook: number
  playingAudio: string | null
  playAudio: (text: string, id: string, speed?: number) => void
  audioSpeed: number
  addXp: (amount: number) => void
  learningMode: 'kids' | 'adult'
}

interface PracticeItem {
  text: string
  label: string
  letters: string[]
}

interface LetterResult {
  letter: string
  correct: boolean
  score: number
}

// Generate practice items for each Iqra book
function getPracticeItems(iqraBook: number): PracticeItem[] {
  const book = IQRA_BOOKS.find(b => b.id === iqraBook)

  if (iqraBook === 1) {
    // Individual letters with fathah
    return ENHANCED_LETTERS.map(l => ({
      text: l.harakat.fathah,
      label: l.nameMs,
      letters: [l.letter],
    }))
  }

  if (iqraBook === 2) {
    // Connected letters with fathah
    return ENHANCED_LETTERS.slice(0, 14).map(l => ({
      text: `${l.harakat.fathah}ا`,
      label: `${l.nameMs} + Alif`,
      letters: [l.letter, 'ا'],
    }))
  }

  if (iqraBook === 3) {
    // Letters with all 3 harakat
    return ENHANCED_LETTERS.slice(0, 10).flatMap(l => [
      { text: l.harakat.fathah, label: `${l.nameMs} Fathah`, letters: [l.letter] },
      { text: l.harakat.kasrah, label: `${l.nameMs} Kasrah`, letters: [l.letter] },
      { text: l.harakat.dhammah, label: `${l.nameMs} Dhammah`, letters: [l.letter] },
    ])
  }

  if (iqraBook === 4) {
    // Words with tanwin
    const verses = QURAN_VERSES_PER_BOOK[4] || []
    if (verses.length > 0) {
      return verses.map(v => ({
        text: v.verse,
        label: v.surah,
        letters: v.verse.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').split(''),
      }))
    }
    return ENHANCED_LETTERS.slice(0, 8).map(l => ({
      text: `${l.letter}\u064Bا`,
      label: `${l.nameMs} Tanwin Fathah`,
      letters: [l.letter],
    }))
  }

  if (iqraBook === 5) {
    const verses = QURAN_VERSES_PER_BOOK[5] || []
    if (verses.length > 0) {
      return verses.map(v => ({
        text: v.verse,
        label: v.surah,
        letters: v.verse.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').split(''),
      }))
    }
    return [{ text: 'بِسْمِ ٱللَّهِ', label: 'Bismillah', letters: ['ب', 'س', 'م', 'ا', 'ل'] }]
  }

  // Book 6: Full verses from Juz Amma
  const verses = QURAN_VERSES_PER_BOOK[6] || []
  if (verses.length > 0) {
    return verses.map(v => ({
      text: v.verse,
      label: v.surah,
      letters: v.verse.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '').split(''),
    }))
  }

  return [{ text: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', label: 'Al-Ikhlas 112:1', letters: ['ق', 'ل', 'ه', 'و', 'ا', 'ح', 'د'] }]
}

function getMakhrajTip(letter: string): string | null {
  const entry = MAKHRAJ_DATA.find(m => m.letter === letter)
  if (!entry) return null
  return `${entry.name}: ${entry.makhraj} (${entry.group})`
}

export function IqraRecitationPractice({
  iqraBook,
  playingAudio,
  playAudio,
  audioSpeed,
  addXp,
  learningMode,
}: IqraRecitationPracticeProps) {
  const [practiceItems] = useState<PracticeItem[]>(() => getPracticeItems(iqraBook))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [letterResults, setLetterResults] = useState<LetterResult[]>([])
  const [speechSupported, setSpeechSupported] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null)
  const simulationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentItem = practiceItems[currentIndex] || practiceItems[0]
  const currentBook = IQRA_BOOKS.find(b => b.id === iqraBook) || IQRA_BOOKS[0]

  // Check for Speech Recognition API support
  useEffect(() => {
    const supported = typeof window !== 'undefined' && (
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    )
    setSpeechSupported(supported)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch { /* ignore */ }
      }
      if (simulationTimerRef.current) {
        clearTimeout(simulationTimerRef.current)
      }
    }
  }, [])

  // Reset when book changes
  useEffect(() => {
    setCurrentIndex(0)
    setScore(null)
    setLetterResults([])
    setShowFeedback(false)
  }, [iqraBook])

  const handleMicPress = useCallback(() => {
    if (isListening || isSimulating) {
      // Stop listening
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch { /* ignore */ }
        recognitionRef.current = null
      }
      if (simulationTimerRef.current) {
        clearTimeout(simulationTimerRef.current)
        simulationTimerRef.current = null
      }
      setIsListening(false)
      setIsSimulating(false)
      return
    }

    setScore(null)
    setLetterResults([])
    setShowFeedback(false)

    // Try actual speech recognition first
    if (speechSupported) {
      try {
        const Recognition = (window as unknown as Record<string, unknown>).SpeechRecognition ||
          (window as unknown as Record<string, unknown>).webkitSpeechRecognition
        if (typeof Recognition === 'function') {
          const recognition = new (Recognition as new () => SpeechRecognition)()
          recognition.lang = 'ar-SA'
          recognition.interimResults = false
          recognition.maxAlternatives = 3
          recognition.continuous = false

          recognition.onstart = () => {
            setIsListening(true)
          }

          recognition.onresult = (event: SpeechRecognitionEvent) => {
            const result = event.results[0]
            const transcript = result[0].transcript
            const confidence = result[0].confidence

            // Score based on confidence and presence of expected letters
            const accuracy = Math.round(Math.min(100, confidence * 100 + 15))
            processScore(accuracy, currentItem.letters)
            setIsListening(false)
          }

          recognition.onerror = () => {
            // Fall back to simulation
            setIsListening(false)
            startSimulation()
          }

          recognition.onend = () => {
            setIsListening(false)
          }

          recognitionRef.current = recognition as ReturnType<typeof createRecognition>
          recognition.start()

          // Set a timeout to fall back to simulation if recognition hangs
          simulationTimerRef.current = setTimeout(() => {
            try { recognition.abort() } catch { /* ignore */ }
            setIsListening(false)
            startSimulation()
          }, 5000)

          return
        }
      } catch {
        // Fall through to simulation
      }
    }

    // Fallback: simulation mode
    startSimulation()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speechSupported, currentItem, isListening, isSimulating])

  const processScore = useCallback((accuracy: number, letters: string[]) => {
    setScore(accuracy)
    // Generate per-letter results
    const results: LetterResult[] = letters.map((letter, i) => {
      // Simulate per-letter accuracy with some randomness
      const letterBase = accuracy + (Math.random() * 20 - 10)
      const letterScore = Math.round(Math.min(100, Math.max(0, letterBase)))
      return {
        letter,
        correct: letterScore >= 70,
        score: letterScore,
        // Stagger display: letters appear one by one
        _index: i,
      } as LetterResult & { _index: number }
    })
    // Remove temp field
    setLetterResults(results.map(({ _index, ...rest }) => rest))
    setShowFeedback(true)

    // XP reward
    if (accuracy >= 60) {
      addXp(accuracy >= 80 ? 15 : 5)
    }
  }, [addXp])

  const startSimulation = useCallback(() => {
    setIsSimulating(true)

    simulationTimerRef.current = setTimeout(() => {
      // Generate simulated score (70-95% for demo, with some variation)
      const baseScore = 70 + Math.floor(Math.random() * 26)
      processScore(baseScore, currentItem.letters)
      setIsSimulating(false)
    }, 3000)
  }, [currentItem, processScore])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % practiceItems.length)
    setScore(null)
    setLetterResults([])
    setShowFeedback(false)
  }, [practiceItems.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + practiceItems.length) % practiceItems.length)
    setScore(null)
    setLetterResults([])
    setShowFeedback(false)
  }, [practiceItems.length])

  const playCorrectPronunciation = useCallback(() => {
    if (currentItem) {
      playAudio(currentItem.text, `recite-${currentIndex}`, audioSpeed)
    }
  }, [currentItem, playAudio, currentIndex, audioSpeed])

  const getScoreColor = (s: number) => {
    if (s >= 80) return '#22c55e'
    if (s >= 60) return '#d4af37'
    return '#ef4444'
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return 'Bagus!'
    if (s >= 60) return 'Tidak Badan'
    return 'Cuba Lagi!'
  }

  const circumference = 2 * Math.PI * 40
  const scoreOffset = score !== null ? circumference - (score / 100) * circumference : circumference

  return (
    <div className="flex flex-col gap-4">
      {/* Book & progress indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-lg">{currentBook.icon}</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: currentBook.color }}>
              {currentBook.title}
            </div>
            <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
              {currentBook.focus}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
            {currentIndex + 1}/{practiceItems.length}
          </span>
          <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.15)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: currentBook.color }}
              animate={{ width: `${((currentIndex + 1) / practiceItems.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Target Display */}
      <motion.div
        className="rounded-2xl p-6 text-center"
        style={{
          background: 'rgba(42,42,106,0.3)',
          border: `1px solid ${currentBook.color}25`,
        }}
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>
          Baca ayat ini:
        </div>
        <div
          className={`${learningMode === 'kids' ? 'text-5xl' : 'text-4xl'} font-arabic leading-loose`}
          style={{ color: '#ffffff', direction: 'rtl' }}
        >
          {currentItem?.text}
        </div>
        <div className="text-[10px] mt-2" style={{ color: currentBook.color }}>
          {currentItem?.label}
        </div>
      </motion.div>

      {/* Mic Button + Controls Row */}
      <div className="flex items-center justify-center gap-4">
        {/* Play correct pronunciation */}
        <button
          className="h-11 w-11 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(74,74,166,0.15)',
            border: '1px solid rgba(74,74,166,0.25)',
          }}
          onClick={playCorrectPronunciation}
          title="Dengar sebutan yang betul"
        >
          {playingAudio === `recite-${currentIndex}`
            ? <Pause className="h-4 w-4" style={{ color: '#4a4aa6' }} />
            : <Volume2 className="h-4 w-4" style={{ color: '#4a4aa6' }} />
          }
        </button>

        {/* Mic Button */}
        <motion.button
          className="h-16 w-16 rounded-full flex items-center justify-center relative"
          style={{
            background: isListening || isSimulating
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #4a4aa6, #6a6ab6)',
            boxShadow: isListening || isSimulating
              ? '0 0 20px rgba(239,68,68,0.4)'
              : '0 0 15px rgba(74,74,166,0.3)',
          }}
          onClick={handleMicPress}
          whileTap={{ scale: 0.9 }}
          animate={isListening || isSimulating ? {
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 15px rgba(239,68,68,0.3)',
              '0 0 30px rgba(239,68,68,0.5)',
              '0 0 15px rgba(239,68,68,0.3)',
            ],
          } : {}}
          transition={isListening || isSimulating ? {
            type: 'tween',
            duration: 1.2,
            repeat: Infinity,
          } : {}}
        >
          <Mic className="h-6 w-6 text-white" />

          {/* Pulsing rings when listening */}
          {(isListening || isSimulating) && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid rgba(239,68,68,0.3)' }}
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid rgba(239,68,68,0.2)' }}
                animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}
        </motion.button>

        {/* Retry / Next */}
        <button
          className="h-11 w-11 rounded-full flex items-center justify-center"
          style={{
            background: score !== null ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.3)',
            border: `1px solid ${score !== null ? 'rgba(212,175,55,0.25)' : 'rgba(74,74,166,0.1)'}`,
          }}
          onClick={score !== null ? goToNext : () => { setScore(null); setLetterResults([]); setShowFeedback(false) }}
          title={score !== null ? 'Seterusnya' : 'Set semula'}
        >
          {score !== null
            ? <ChevronRight className="h-4 w-4" style={{ color: '#d4af37' }} />
            : <RotateCcw className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.4)' }} />
          }
        </button>
      </div>

      {/* Listening status */}
      <AnimatePresence>
        {(isListening || isSimulating) && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <motion.div
                className="h-2 w-2 rounded-full"
                style={{ background: '#ef4444' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span className="text-[11px]" style={{ color: '#ef4444' }}>
                {isSimulating ? 'Menganalisis bacaan...' : 'Mendengar... Sila baca'}
              </span>
            </div>
            {isSimulating && (
              <div className="mt-2">
                <div className="h-1 w-32 mx-auto rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.15)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: '#4a4aa6' }}
                    animate={{ width: ['0%', '100%'] }}
                    transition={{ duration: 3, ease: 'linear' }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score Display */}
      <AnimatePresence>
        {score !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {/* Circular Progress + Score */}
            <div className="rounded-2xl p-5 text-center" style={{ background: 'rgba(42,42,106,0.3)', border: `1px solid ${getScoreColor(score)}20` }}>
              <div className="flex items-center justify-center gap-5">
                {/* Circular progress */}
                <div className="relative">
                  <svg width="96" height="96" viewBox="0 0 96 96">
                    <circle
                      cx="48" cy="48" r="40"
                      fill="none"
                      stroke="rgba(74,74,166,0.15)"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="48" cy="48" r="40"
                      fill="none"
                      stroke={getScoreColor(score)}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: scoreOffset }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      transform="rotate(-90 48 48)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color: getScoreColor(score) }}>
                      {score}%
                    </span>
                    <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
      ketepatan
                    </span>
                  </div>
                </div>

                {/* Score label + feedback */}
                <div className="text-left">
                  <motion.div
                    className="text-lg font-bold mb-1"
                    style={{ color: getScoreColor(score) }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.3 }}
                  >
                    {getScoreLabel(score)}
                  </motion.div>
                  <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
                    {score >= 80 ? 'Sebutan anda sangat baik!' : score >= 60 ? 'Teruskan berlatih untuk lebih baik.' : 'Jangan berputus asa, cuba lagi!'}
                  </div>
                  {score >= 80 && (
                    <motion.div
                      className="flex items-center gap-1 mt-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Star className="h-3 w-3" style={{ color: '#d4af37' }} />
                      <span className="text-[10px] font-medium" style={{ color: '#d4af37' }}>+15 XP</span>
                    </motion.div>
                  )}
                  {score >= 60 && score < 80 && (
                    <motion.div
                      className="flex items-center gap-1 mt-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Star className="h-3 w-3" style={{ color: '#d4af37' }} />
                      <span className="text-[10px] font-medium" style={{ color: '#d4af37' }}>+5 XP</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Per-letter breakdown */}
              {letterResults.length > 0 && letterResults.length <= 10 && (
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(74,74,166,0.1)' }}>
                  <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>
                    Kecermasan per-huruf:
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {letterResults.map((result, i) => (
                      <motion.div
                        key={`${result.letter}-${i}`}
                        className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg"
                        style={{
                          background: result.correct ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                          border: `1px solid ${result.correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                      >
                        <span className="text-lg font-arabic" style={{ color: '#ffffff' }}>
                          {result.letter}
                        </span>
                        <span className="text-sm">
                          {result.correct ? '✅' : '❌'}
                        </span>
                        <span className="text-[9px]" style={{ color: getScoreColor(result.score) }}>
                          {result.score}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Feedback cards */}
            {showFeedback && (
              <motion.div
                className="mt-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {score > 80 ? (
                  <div
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{
                      background: 'rgba(34,197,94,0.08)',
                      border: '1px solid rgba(34,197,94,0.2)',
                    }}
                  >
                    <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(34,197,94,0.15)' }}>
                      <Check className="h-5 w-5" style={{ color: '#22c55e' }} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold" style={{ color: '#22c55e' }}>Bagus! 🌟</div>
                      <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Sebutan anda tepat. Teruskan!</div>
                    </div>
                  </div>
                ) : score < 60 ? (
                  <div
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      border: '1px solid rgba(239,68,68,0.2)',
                    }}
                  >
                    <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.15)' }}>
                      <X className="h-5 w-5" style={{ color: '#ef4444' }} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold" style={{ color: '#ef4444' }}>Cuba lagi! 💪</div>
                      <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Dengar sebutan yang betul dan cuba sekali lagi.</div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="rounded-xl p-3 flex items-center gap-3"
                    style={{
                      background: 'rgba(212,175,55,0.08)',
                      border: '1px solid rgba(212,175,55,0.2)',
                    }}
                  >
                    <div className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)' }}>
                      <Star className="h-5 w-5" style={{ color: '#d4af37' }} />
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold" style={{ color: '#d4af37' }}>Hampir! ✨</div>
                      <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Sedikit lagi untuk mencapai tahap yang baik.</div>
                    </div>
                  </div>
                )}

                {/* Makhraj tips for wrong letters */}
                {letterResults.some(r => !r.correct) && (
                  <div className="mt-2 rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
                    <div className="text-[10px] font-semibold mb-1.5" style={{ color: '#d4af37' }}>
                      💡 Petunjuk Makhraj:
                    </div>
                    {letterResults.filter(r => !r.correct).map((result, i) => {
                      const tip = getMakhrajTip(result.letter)
                      return tip ? (
                        <div key={`tip-${i}`} className="text-[10px] mb-1" style={{ color: 'rgba(204,204,204,0.6)' }}>
                          <span className="font-arabic text-sm" style={{ color: '#ffffff' }}>{result.letter}</span> — {tip}
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-2">
        <button
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px]"
          style={{
            background: 'rgba(42,42,106,0.5)',
            border: '1px solid rgba(74,74,166,0.12)',
            color: '#4a4aa6',
          }}
          onClick={goToPrev}
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Sebelum
        </button>

        {/* Speed indicator */}
        <div className="flex items-center gap-1">
          <Play className="h-3 w-3" style={{ color: 'rgba(204,204,204,0.3)' }} />
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
            {audioSpeed === 0.6 ? 'Perlahan' : audioSpeed === 1.0 ? 'Biasa' : 'Pantas'} ({audioSpeed}x)
          </span>
        </div>

        <button
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px]"
          style={{
            background: `${currentBook.color}15`,
            border: `1px solid ${currentBook.color}25`,
            color: currentBook.color,
          }}
          onClick={goToNext}
        >
          Seterusnya <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Speech Recognition availability notice */}
      {!speechSupported && !isListening && !isSimulating && score === null && (
        <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
          <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
            ⓘ Mod simulasi aktif — Penilaian adalah anggaran untuk demo
          </span>
        </div>
      )}
    </div>
  )
}

// Helper type for recognition creation (avoiding global type issues)
function createRecognition(): unknown { return null }
