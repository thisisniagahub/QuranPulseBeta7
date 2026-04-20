'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Star, Zap, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import { QALQALAH_DETAIL } from './types'

interface IqraQalqalahPracticeProps {
  playingAudio: string | null
  playAudio: (text: string, id: string) => void
  addXp: (amount: number) => void
}

const QALQALAH_LETTERS = ['ق', 'ط', 'ب', 'ج', 'د']
const QALQALAH_NAMES: Record<string, string> = {
  'ق': 'Qof',
  'ط': 'Tho',
  'ب': 'Ba',
  'ج': 'Jim',
  'د': 'Dal',
}

const QUIZ_ITEMS = [
  { audio: 'قْ', letter: 'ق', name: 'Qof' },
  { audio: 'طْ', letter: 'ط', name: 'Tho' },
  { audio: 'بْ', letter: 'ب', name: 'Ba' },
  { audio: 'جْ', letter: 'ج', name: 'Jim' },
  { audio: 'دْ', letter: 'د', name: 'Dal' },
]

export function IqraQalqalahPractice({ playingAudio, playAudio, addXp }: IqraQalqalahPracticeProps) {
  const [bouncingLetter, setBouncingLetter] = useState<string | null>(null)
  const [showStar, setShowStar] = useState(false)
  const [quizMode, setQuizMode] = useState(false)
  const [quizQuestion, setQuizQuestion] = useState<typeof QUIZ_ITEMS[number] | null>(null)
  const [quizOptions, setQuizOptions] = useState<string[]>([])
  const [quizAnswered, setQuizAnswered] = useState<'correct' | 'wrong' | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizTotal, setQuizTotal] = useState(0)
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)

  const handleLetterTap = useCallback((letter: string) => {
    const sukunLetter = letter + '\u0652' // add sukun
    setBouncingLetter(letter)
    setSelectedLetter(letter)
    playAudio(sukunLetter, `qalqalah-${letter}`)

    setTimeout(() => setBouncingLetter(null), 600)
  }, [playAudio])

  const generateNewQuestion = useCallback(() => {
    const correctItem = QUIZ_ITEMS[Math.floor(Math.random() * QUIZ_ITEMS.length)]
    setQuizQuestion(correctItem)
    setQuizAnswered(null)

    const options = [correctItem.letter]
    while (options.length < 4) {
      const randomLetter = QALQALAH_LETTERS[Math.floor(Math.random() * QALQALAH_LETTERS.length)]
      if (!options.includes(randomLetter)) options.push(randomLetter)
    }
    setQuizOptions(options.sort(() => Math.random() - 0.5))
  }, [])

  const startQuiz = useCallback(() => {
    setQuizMode(true)
    setQuizScore(0)
    setQuizTotal(0)
    generateNewQuestion()
  }, [generateNewQuestion])

  const handleQuizAnswer = useCallback((letter: string) => {
    if (quizAnswered || !quizQuestion) return
    setQuizTotal(prev => prev + 1)

    if (letter === quizQuestion.letter) {
      setQuizAnswered('correct')
      setQuizScore(prev => prev + 1)
      addXp(10)
      setShowStar(true)
      setTimeout(() => setShowStar(false), 1200)
    } else {
      setQuizAnswered('wrong')
    }
  }, [quizAnswered, quizQuestion, addXp])

  const nextQuizQuestion = useCallback(() => {
    generateNewQuestion()
  }, [generateNewQuestion])

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
          <span className="text-lg">💥</span>
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: '#ffffff' }}>Qalqalah</h3>
          <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
            {QALQALAH_DETAIL.nameAr} — {QALQALAH_DETAIL.desc}
          </p>
        </div>
      </div>

      {/* Mnemonic */}
      <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="text-[9px] uppercase tracking-wide mb-1" style={{ color: 'rgba(204,204,204,0.4)' }}>Hafalan</div>
        <div className="text-xl font-arabic" style={{ color: '#d4af37' }}>قطب جد</div>
        <div className="text-[10px] mt-0.5" style={{ color: 'rgba(204,204,204,0.6)' }}>{QALQALAH_DETAIL.mnemonic}</div>
      </div>

      {/* 5 Qalqalah Letter Buttons */}
      <div className="grid grid-cols-5 gap-2">
        {QALQALAH_LETTERS.map(letter => (
          <motion.button
            key={letter}
            className="aspect-square rounded-xl flex flex-col items-center justify-center relative"
            style={{
              background: 'rgba(42,42,106,0.5)',
              border: playingAudio === `qalqalah-${letter}` ? '2px solid #d4af37' : '1px solid rgba(74,74,166,0.15)',
            }}
            animate={bouncingLetter === letter ? { scale: [1, 1.3, 0.9, 1.1, 1] } : { scale: 1 }}
            transition={bouncingLetter === letter ? { duration: 0.5, ease: 'easeInOut' } : { duration: 0.1 }}
            onClick={() => handleLetterTap(letter)}
          >
            <span className="text-2xl" style={{ color: '#ffffff' }}>{letter}</span>
            <span className="text-[8px] mt-0.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{QALQALAH_NAMES[letter]}</span>
            {playingAudio === `qalqalah-${letter}` && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ border: '2px solid rgba(212,175,55,0.4)' }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Selected letter detail */}
      {selectedLetter && !quizMode && (
        <motion.div
          className="rounded-xl p-3"
          style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-3xl font-arabic" style={{ color: '#d4af37' }}>{selectedLetter}\u0652</span>
              <div className="text-[10px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
                {QALQALAH_NAMES[selectedLetter]} dengan Sukun
              </div>
            </div>
            <button
              className="p-2 rounded-lg"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}
              onClick={() => playAudio(selectedLetter + '\u0652', `qalqalah-detail-${selectedLetter}`)}
            >
              <Volume2 className="h-4 w-4" style={{ color: '#d4af37' }} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Kubra vs Shugra Explanation */}
      <div className="grid grid-cols-2 gap-2">
        {QALQALAH_DETAIL.types.map((type) => (
          <div
            key={type.name}
            className="rounded-xl p-3"
            style={{
              background: `${type.color}08`,
              border: `1px solid ${type.color}25`,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className="h-2 w-2 rounded-full" style={{ background: type.color }} />
              <div className="text-[10px] font-semibold" style={{ color: type.color }}>{type.name}</div>
            </div>
            <div className="text-[9px] mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{type.desc}</div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(26,26,74,0.5)' }}>
              <div className="text-lg font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>{type.example}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Mode Toggle */}
      {!quizMode ? (
        <button
          className="w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
          style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.3)', color: '#4a4aa6' }}
          onClick={startQuiz}
        >
          <Zap className="h-4 w-4" />
          Mula Kuiz Qalqalah
        </button>
      ) : (
        <div className="space-y-3">
          {/* Quiz Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" style={{ color: '#4a4aa6' }} />
              <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>Kuiz Qalqalah</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                {quizScore}/{quizTotal}
              </span>
              <button
                className="p-1.5 rounded-lg"
                style={{ background: 'rgba(42,42,106,0.5)' }}
                onClick={() => { setQuizMode(false); setQuizQuestion(null) }}
              >
                <XIcon className="h-3 w-3" style={{ color: 'rgba(204,204,204,0.5)' }} />
              </button>
            </div>
          </div>

          {/* Quiz Question */}
          {quizQuestion && (
            <motion.div
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.15)' }}
              key={quizQuestion.letter}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>
                Dengar bunyi Qalqalah ini — huruf mana?
              </div>
              <div className="text-4xl font-arabic mb-3" style={{ color: '#d4af37' }}>
                {quizQuestion.audio}
              </div>
              <button
                className="px-4 py-2 rounded-lg text-[10px] flex items-center gap-1.5 mx-auto"
                style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#d4af37' }}
                onClick={() => playAudio(quizQuestion.audio, `qalqalah-quiz-play`)}
              >
                <Volume2 className="h-3.5 w-3.5" />
                Dengar Lagi
              </button>
            </motion.div>
          )}

          {/* Quiz Options */}
          <div className="grid grid-cols-2 gap-2">
            {quizOptions.map(letter => {
              const isCorrect = quizQuestion?.letter === letter
              const isSelected = quizAnswered !== null
              let bg = 'rgba(42,42,106,0.5)'
              let borderColor = 'rgba(74,74,166,0.15)'
              let textColor = '#ffffff'

              if (isSelected) {
                if (isCorrect && quizAnswered === 'correct') {
                  bg = 'rgba(34,197,94,0.12)'
                  borderColor = 'rgba(34,197,94,0.3)'
                  textColor = '#22c55e'
                } else if (!isCorrect) {
                  bg = 'rgba(239,68,68,0.08)'
                  borderColor = 'rgba(239,68,68,0.2)'
                  textColor = 'rgba(204,204,204,0.4)'
                }
              }

              return (
                <motion.button
                  key={letter}
                  className="rounded-xl p-4 flex flex-col items-center justify-center"
                  style={{ background: bg, border: `1px solid ${borderColor}` }}
                  onClick={() => handleQuizAnswer(letter)}
                  whileTap={!isSelected ? { scale: 0.95 } : undefined}
                  disabled={isSelected}
                >
                  <span className="text-3xl font-arabic" style={{ color: textColor }}>{letter}</span>
                  <span className="text-[9px] mt-0.5" style={{ color: textColor }}>{QALQALAH_NAMES[letter]}</span>
                  {isSelected && isCorrect && quizAnswered === 'correct' && (
                    <CheckCircle className="h-4 w-4 mt-1" style={{ color: '#22c55e' }} />
                  )}
                  {isSelected && !isCorrect && quizAnswered === 'wrong' && letter === quizQuestion?.letter && (
                    <CheckCircle className="h-4 w-4 mt-1" style={{ color: '#22c55e' }} />
                  )}
                </motion.button>
              )
            })}
          </div>

          {/* Quiz Feedback */}
          <AnimatePresence>
            {quizAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {quizAnswered === 'correct' ? (
                    <>
                      <CheckCircle className="h-4 w-4" style={{ color: '#22c55e' }} />
                      <span className="text-[11px] font-semibold" style={{ color: '#22c55e' }}>Betul! +10 XP</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
                      <span className="text-[11px] font-semibold" style={{ color: '#ef4444' }}>
                        Salah — jawapan: {quizQuestion?.letter} ({quizQuestion?.name})
                      </span>
                    </>
                  )}
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1"
                  style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.3)', color: '#4a4aa6' }}
                  onClick={nextQuizQuestion}
                >
                  Seterusnya <RotateCcw className="h-3 w-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Gold Star Animation */}
      <AnimatePresence>
        {showStar && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.5, 1.2, 1.4], rotate: [0, 10, -10, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <Star className="h-20 w-20" style={{ color: '#d4af37', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.6))' }} fill="#d4af37" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function XIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
