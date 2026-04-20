'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, CheckCircle, XCircle, RotateCcw, Zap, Star } from 'lucide-react'

interface IqraLamJalalahPracticeProps {
  playAudio: (text: string, id: string) => void
  addXp: (amount: number) => void
  playingAudio: string | null
}

type LamJalalahType = 'tebal' | 'nipis'

interface LamJalalahExample {
  text: string
  type: LamJalalahType
  reason: string
  color: string
}

const LAM_JALALAH_EXAMPLES: LamJalalahExample[] = [
  { text: 'اَللَّهُ', type: 'tebal', reason: 'Selepas Fathah', color: '#d4af37' },
  { text: 'اَللَّهِ', type: 'nipis', reason: 'Selepas Kasrah', color: '#4a4aa6' },
  { text: 'اَللَّهُمَ', type: 'tebal', reason: 'Selepas Dhammah', color: '#d4af37' },
]

const QUIZ_QUESTIONS = [
  { word: 'بِسْمِ ٱللَّهِ', answer: 'nipis' as LamJalalahType, explanation: 'Kasrah sebelum Lam Jalalah → nipis' },
  { word: 'قُلْ هُوَ ٱللَّهُ', answer: 'tebal' as LamJalalahType, explanation: 'Dhammah sebelum Lam Jalalah → tebal' },
  { word: 'وَلِلَّهِ', answer: 'nipis' as LamJalalahType, explanation: 'Kasrah sebelum Lam Jalalah → nipis' },
  { word: 'ٱللَّهُ لَآ إِلَـٰهَ', answer: 'tebal' as LamJalalahType, explanation: 'Fathah sebelum Lam Jalalah → tebal' },
  { word: 'رَبِّ ٱللَّهِ', answer: 'nipis' as LamJalalahType, explanation: 'Kasrah sebelum Lam Jalalah → nipis' },
  { word: 'أَلَا بِذِكْرِ ٱللَّهِ', answer: 'nipis' as LamJalalahType, explanation: 'Kasrah sebelum Lam Jalalah → nipis' },
  { word: 'اَللَّهُمَ', answer: 'tebal' as LamJalalahType, explanation: 'Dhammah sebelum Mim → tebal' },
  { word: 'لِلَّهِ ٱلْحَمْدُ', answer: 'nipis' as LamJalalahType, explanation: 'Kasrah sebelum Lam Jalalah → nipis' },
  { word: 'حَبْلُ ٱللَّهِ', answer: 'nipis' as LamJalalahType, explanation: 'Kasrah sebelum Lam Jalalah → nipis' },
  { word: 'وَٱللَّهُ غَفُورٌ', answer: 'tebal' as LamJalalahType, explanation: 'Dhammah sebelum Lam Jalalah → tebal' },
]

export function IqraLamJalalahPractice({ playAudio, addXp, playingAudio }: IqraLamJalalahPracticeProps) {
  const [quizMode, setQuizMode] = useState(false)
  const [quizQuestion, setQuizQuestion] = useState<typeof QUIZ_QUESTIONS[number] | null>(null)
  const [quizAnswered, setQuizAnswered] = useState<LamJalalahType | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizTotal, setQuizTotal] = useState(0)
  const [showStar, setShowStar] = useState(false)
  const [questionNumber, setQuestionNumber] = useState(0)
  const QUESTIONS_PER_ROUND = 5

  const generateQuizQuestion = useCallback(() => {
    const item = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)]
    setQuizQuestion(item)
    setQuizAnswered(null)
  }, [])

  const startQuiz = useCallback(() => {
    setQuizMode(true)
    setQuizScore(0)
    setQuizTotal(0)
    setQuestionNumber(0)
    generateQuizQuestion()
  }, [generateQuizQuestion])

  const handleQuizAnswer = useCallback((answer: LamJalalahType) => {
    if (quizAnswered || !quizQuestion) return
    setQuizTotal(prev => prev + 1)
    setQuestionNumber(prev => prev + 1)
    setQuizAnswered(answer)

    if (answer === quizQuestion.answer) {
      setQuizScore(prev => prev + 1)
      addXp(10)
      setShowStar(true)
      setTimeout(() => setShowStar(false), 1000)
    }
  }, [quizAnswered, quizQuestion, addXp])

  const nextQuizQuestion = useCallback(() => {
    if (questionNumber >= QUESTIONS_PER_ROUND) {
      setQuizMode(false)
      return
    }
    generateQuizQuestion()
  }, [questionNumber, generateQuizQuestion])

  const TEBAL_COLOR = '#d4af37'
  const NIPIS_COLOR = '#4a4aa6'

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
          <span className="text-lg">🕌</span>
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: '#ffffff' }}>Lam Jalalah</h3>
          <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Sebutan &quot;Allah&quot; — Tebal atau Nipis</p>
        </div>
      </div>

      {/* Large "Allah" Display with Color Coding */}
      {!quizMode && (
        <>
          <div className="space-y-2">
            {LAM_JALALAH_EXAMPLES.map((ex, i) => (
              <motion.button
                key={i}
                className="w-full rounded-xl p-4 text-center"
                style={{
                  background: `${ex.color}08`,
                  border: `1px solid ${ex.color}25`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => playAudio(ex.text, `lam-jalalah-ex-${i}`)}
              >
                <div className="text-4xl font-arabic mb-1" style={{ color: ex.color, direction: 'rtl' as const }}>
                  {ex.text}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: ex.type === 'tebal' ? `${TEBAL_COLOR}15` : `${NIPIS_COLOR}15`,
                      color: ex.color,
                      border: `1px solid ${ex.color}30`,
                    }}
                  >
                    {ex.type === 'tebal' ? 'Tebal (Thick)' : 'Nipis (Thin)'}
                  </span>
                  <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{ex.reason}</span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Volume2 className="h-3.5 w-3.5" style={{ color: ex.color }} />
                  <span className="text-[9px]" style={{ color: ex.color }}>Dengar</span>
                  {playingAudio === `lam-jalalah-ex-${i}` && (
                    <motion.span
                      className="text-[10px]"
                      style={{ color: ex.color }}
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ♪ Bermain...
                    </motion.span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Explanation Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl p-3" style={{ background: `${TEBAL_COLOR}08`, border: `1px solid ${TEBAL_COLOR}20` }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: TEBAL_COLOR }} />
                <span className="text-[10px] font-semibold" style={{ color: TEBAL_COLOR }}>Tebal (Thick)</span>
              </div>
              <p className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
                Selepas Fathah atau Dhammah
              </p>
              <div className="text-lg font-arabic mt-1" style={{ color: TEBAL_COLOR, direction: 'rtl' as const }}>اَللَّهُ</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: `${NIPIS_COLOR}08`, border: `1px solid ${NIPIS_COLOR}20` }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: NIPIS_COLOR }} />
                <span className="text-[10px] font-semibold" style={{ color: NIPIS_COLOR }}>Nipis (Thin)</span>
              </div>
              <p className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
                Selepas Kasrah
              </p>
              <div className="text-lg font-arabic mt-1" style={{ color: NIPIS_COLOR, direction: 'rtl' as const }}>اَللَّهِ</div>
            </div>
          </div>

          {/* Rule Summary */}
          <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
            <div className="text-[9px] uppercase tracking-wide mb-1.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Peraturan Ringkas</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: TEBAL_COLOR }} />
                <span className="text-[10px]" style={{ color: '#ffffff' }}>Fathah/Dhammah sebelum &quot;Allah&quot; → <strong style={{ color: TEBAL_COLOR }}>Tebal</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: NIPIS_COLOR }} />
                <span className="text-[10px]" style={{ color: '#ffffff' }}>Kasrah sebelum &quot;Allah&quot; → <strong style={{ color: NIPIS_COLOR }}>Nipis</strong></span>
              </div>
            </div>
          </div>

          {/* Start Quiz */}
          <button
            className="w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#8b5cf6' }}
            onClick={startQuiz}
          >
            <Zap className="h-4 w-4" />
            Mula Kuiz Lam Jalalah ({QUESTIONS_PER_ROUND} soalan)
          </button>
        </>
      )}

      {/* Quiz Mode */}
      {quizMode && quizQuestion && (
        <div className="space-y-3">
          {/* Quiz Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" style={{ color: '#8b5cf6' }} />
              <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>Kuiz Lam Jalalah</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
                {quizScore}/{quizTotal}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>
                {questionNumber}/{QUESTIONS_PER_ROUND}
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

          {/* Progress bar */}
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(42,42,106,0.5)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#8b5cf6' }}
              animate={{ width: `${(questionNumber / QUESTIONS_PER_ROUND) * 100}%` }}
            />
          </div>

          {/* Question */}
          <motion.div
            className="rounded-xl p-5 text-center"
            style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.15)' }}
            key={quizQuestion.word}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>
              Apakah sebutan Lam Jalalah di sini?
            </div>
            <div className="text-3xl font-arabic mb-2" style={{ color: '#d4af37', direction: 'rtl' as const }}>
              {quizQuestion.word}
            </div>
            <button
              className="px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 mx-auto"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#d4af37' }}
              onClick={() => playAudio(quizQuestion.word, 'lam-jalalah-quiz-play')}
            >
              <Volume2 className="h-3 w-3" /> Dengar
            </button>
          </motion.div>

          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              className="rounded-xl p-4 text-center"
              style={{
                background: quizAnswered
                  ? (quizQuestion.answer === 'tebal' ? `${TEBAL_COLOR}15` : quizAnswered === 'tebal' ? 'rgba(239,68,68,0.08)' : 'rgba(42,42,106,0.3)')
                  : `${TEBAL_COLOR}08`,
                border: `1px solid ${quizAnswered
                  ? (quizQuestion.answer === 'tebal' ? `${TEBAL_COLOR}35` : quizAnswered === 'tebal' ? 'rgba(239,68,68,0.2)' : 'rgba(74,74,166,0.1)')
                  : `${TEBAL_COLOR}20`}`,
              }}
              onClick={() => handleQuizAnswer('tebal')}
              whileTap={!quizAnswered ? { scale: 0.95 } : undefined}
              disabled={quizAnswered !== null}
            >
              <div className="text-2xl mb-1">💪</div>
              <div className="text-[11px] font-semibold" style={{ color: TEBAL_COLOR }}>Tebal</div>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Thick — Fathah/Dhammah</div>
              {quizAnswered && quizQuestion.answer === 'tebal' && <CheckCircle className="h-4 w-4 mx-auto mt-1" style={{ color: TEBAL_COLOR }} />}
            </motion.button>

            <motion.button
              className="rounded-xl p-4 text-center"
              style={{
                background: quizAnswered
                  ? (quizQuestion.answer === 'nipis' ? `${NIPIS_COLOR}15` : quizAnswered === 'nipis' ? 'rgba(239,68,68,0.08)' : 'rgba(42,42,106,0.3)')
                  : `${NIPIS_COLOR}08`,
                border: `1px solid ${quizAnswered
                  ? (quizQuestion.answer === 'nipis' ? `${NIPIS_COLOR}35` : quizAnswered === 'nipis' ? 'rgba(239,68,68,0.2)' : 'rgba(74,74,166,0.1)')
                  : `${NIPIS_COLOR}20`}`,
              }}
              onClick={() => handleQuizAnswer('nipis')}
              whileTap={!quizAnswered ? { scale: 0.95 } : undefined}
              disabled={quizAnswered !== null}
            >
              <div className="text-2xl mb-1">🪶</div>
              <div className="text-[11px] font-semibold" style={{ color: NIPIS_COLOR }}>Nipis</div>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Thin — Kasrah</div>
              {quizAnswered && quizQuestion.answer === 'nipis' && <CheckCircle className="h-4 w-4 mx-auto mt-1" style={{ color: NIPIS_COLOR }} />}
            </motion.button>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {quizAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl p-3"
                style={{
                  background: quizAnswered === quizQuestion.answer ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${quizAnswered === quizQuestion.answer ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {quizAnswered === quizQuestion.answer ? (
                    <>
                      <CheckCircle className="h-4 w-4" style={{ color: '#22c55e' }} />
                      <span className="text-[11px] font-semibold" style={{ color: '#22c55e' }}>Betul! +10 XP</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
                      <span className="text-[11px] font-semibold" style={{ color: '#ef4444' }}>Salah</span>
                    </>
                  )}
                </div>
                <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{quizQuestion.explanation}</div>
                <button
                  className="mt-2 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1"
                  style={{
                    background: questionNumber >= QUESTIONS_PER_ROUND ? 'rgba(139,92,246,0.15)' : 'rgba(74,74,166,0.15)',
                    border: `1px solid ${questionNumber >= QUESTIONS_PER_ROUND ? 'rgba(139,92,246,0.3)' : 'rgba(74,74,166,0.3)'}`,
                    color: questionNumber >= QUESTIONS_PER_ROUND ? '#8b5cf6' : '#4a4aa6',
                  }}
                  onClick={nextQuizQuestion}
                >
                  {questionNumber >= QUESTIONS_PER_ROUND ? (
                    <>
                      <Star className="h-3 w-3" /> Lihat Keputusan
                    </>
                  ) : (
                    <>
                      Seterusnya <RotateCcw className="h-3 w-3" />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Round Complete (shown when quizMode becomes false after completing) */}
      {!quizMode && quizTotal >= QUESTIONS_PER_ROUND && (
        <motion.div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Trophy className="h-8 w-8 mx-auto mb-2" style={{ color: '#d4af37' }} />
          <div className="text-sm font-bold mb-1" style={{ color: '#ffffff' }}>Pusingan Selesai!</div>
          <div className="text-[11px]" style={{ color: 'rgba(204,204,204,0.6)' }}>
            Skor: <span style={{ color: '#22c55e' }}>{quizScore}</span>/{quizTotal} betul
          </div>
          <div className="text-[11px] mt-1" style={{ color: '#d4af37' }}>
            +{quizScore * 10} XP diperolehi
          </div>
          <button
            className="mt-3 px-4 py-2 rounded-xl text-[10px] font-semibold"
            style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#8b5cf6' }}
            onClick={() => { setQuizTotal(0); setQuizScore(0); startQuiz() }}
          >
            Cuba Lagi
          </button>
        </motion.div>
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

function Trophy({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}
