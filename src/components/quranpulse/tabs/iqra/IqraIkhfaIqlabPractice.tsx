'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, CheckCircle, XCircle, RotateCcw, Zap } from 'lucide-react'
import { IKHFA_LETTERS, IQLAB_DATA } from './types'

interface IqraIkhfaIqlabPracticeProps {
  addXp: (amount: number) => void
  playAudio: (text: string, id: string) => void
  playingAudio: string | null
}

type Tab = 'ikhfa' | 'iqlab'

const IKHFA_QUIZ_ITEMS = [
  { word: 'مِن تَحْتِهَا', answer: 'ikhfa' as const, highlight: 'ن ت' },
  { word: 'مِن جِهَنَّمَ', answer: 'ikhfa' as const, highlight: 'ن ج' },
  { word: 'مِن ذَٰلِكَ', answer: 'ikhfa' as const, highlight: 'ن ذ' },
  { word: 'مِن قَبْلُ', answer: 'ikhfa' as const, highlight: 'ن ق' },
  { word: 'مِن شَرِّ', answer: 'ikhfa' as const, highlight: 'ن ش' },
  { word: 'مِن صَلْصَالٍ', answer: 'ikhfa' as const, highlight: 'ن ص' },
  { word: 'مِن طِينٍ', answer: 'ikhfa' as const, highlight: 'ن ط' },
  { word: 'مِن ضَرُّ', answer: 'ikhfa' as const, highlight: 'ن ض' },
]

const IQLAB_QUIZ_ITEMS = [
  { word: 'مِن بَعْدِ', answer: 'iqlab' as const, highlight: 'ن ب' },
  { word: 'مِن بَيْنِ', answer: 'iqlab' as const, highlight: 'ن ب' },
  { word: 'أَنۢبَأَهُمْ', answer: 'iqlab' as const, highlight: 'نۢب' },
  { word: 'يُنۢبِتُ', answer: 'iqlab' as const, highlight: 'نۢب' },
]

// Non-ikhfa/iqlab examples for quiz (izhar)
const IZHAR_QUIZ_ITEMS = [
  { word: 'مِنْ أَجْلٍ', answer: 'izhar' as const, highlight: 'نْ أ' },
  { word: 'مِنْ عِلْمٍ', answer: 'izhar' as const, highlight: 'نْ ع' },
  { word: 'مِنْ حَكِيمٍ', answer: 'izhar' as const, highlight: 'نْ ح' },
]

type QuizAnswer = 'ikhfa' | 'iqlab' | 'izhar'

const ALL_QUIZ_ITEMS = [
  ...IKHFA_QUIZ_ITEMS.map(i => ({ ...i, answer: 'ikhfa' as QuizAnswer })),
  ...IQLAB_QUIZ_ITEMS.map(i => ({ ...i, answer: 'iqlab' as QuizAnswer })),
  ...IZHAR_QUIZ_ITEMS.map(i => ({ ...i, answer: 'izhar' as QuizAnswer })),
]

export function IqraIkhfaIqlabPractice({ addXp, playAudio, playingAudio }: IqraIkhfaIqlabPracticeProps) {
  const [activeTab, setActiveTab] = useState<Tab>('ikhfa')
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [quizMode, setQuizMode] = useState(false)
  const [quizQuestion, setQuizQuestion] = useState<typeof ALL_QUIZ_ITEMS[number] | null>(null)
  const [quizAnswered, setQuizAnswered] = useState<QuizAnswer | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizTotal, setQuizTotal] = useState(0)

  const handleLetterTap = useCallback((letter: string) => {
    setSelectedLetter(letter)
    playAudio(letter, `ikhfa-letter-${letter}`)
  }, [playAudio])

  const generateQuizQuestion = useCallback(() => {
    const item = ALL_QUIZ_ITEMS[Math.floor(Math.random() * ALL_QUIZ_ITEMS.length)]
    setQuizQuestion(item)
    setQuizAnswered(null)
  }, [])

  const startQuiz = useCallback(() => {
    setQuizMode(true)
    setQuizScore(0)
    setQuizTotal(0)
    generateQuizQuestion()
  }, [generateQuizQuestion])

  const handleQuizAnswer = useCallback((answer: QuizAnswer) => {
    if (quizAnswered || !quizQuestion) return
    setQuizTotal(prev => prev + 1)
    setQuizAnswered(answer)

    if (answer === quizQuestion.answer) {
      setQuizScore(prev => prev + 1)
      addXp(10)
    }
  }, [quizAnswered, quizQuestion, addXp])

  const nextQuizQuestion = useCallback(() => {
    generateQuizQuestion()
  }, [generateQuizQuestion])

  const IKHFA_COLOR = '#22c55e'
  const IQLAB_COLOR = '#8b5cf6'

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `${activeTab === 'ikhfa' ? IKHFA_COLOR : IQLAB_COLOR}15` }}>
          <span className="text-lg">🫧</span>
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ color: '#ffffff' }}>Ikhfa&apos; &amp; Iqlab</h3>
          <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Hukum Nun Mati / Tanwin</p>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(42,42,106,0.4)' }}>
        {([['ikhfa', 'Ikhfa\'', IKHFA_COLOR] as const, ['iqlab', 'Iqlab', IQLAB_COLOR] as const]).map(([key, label, color]) => (
          <button
            key={key}
            className="flex-1 py-2 rounded-lg text-[11px] font-medium transition-all"
            style={{
              background: activeTab === key ? `${color}18` : 'transparent',
              color: activeTab === key ? color : 'rgba(204,204,204,0.5)',
              border: activeTab === key ? `1px solid ${color}35` : '1px solid transparent',
            }}
            onClick={() => { setActiveTab(key); setQuizMode(false) }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Ikhfa Tab */}
      {activeTab === 'ikhfa' && !quizMode && (
        <div className="space-y-3">
          {/* Description */}
          <div className="rounded-xl p-3" style={{ background: `${IKHFA_COLOR}08`, border: `1px solid ${IKHFA_COLOR}20` }}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: IKHFA_COLOR }} />
              <span className="text-[11px] font-semibold" style={{ color: IKHFA_COLOR }}>{IKHFA_LETTERS.name}</span>
              <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)', direction: 'rtl' as const }}>{IKHFA_LETTERS.nameAr}</span>
            </div>
            <p className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{IKHFA_LETTERS.desc}</p>
          </div>

          {/* 15 Ikhfa Letters Grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {IKHFA_LETTERS.letters.map((letter, i) => (
              <motion.button
                key={`${letter}-${i}`}
                className="aspect-square rounded-lg flex flex-col items-center justify-center"
                style={{
                  background: selectedLetter === letter ? `${IKHFA_COLOR}18` : 'rgba(42,42,106,0.5)',
                  border: selectedLetter === letter ? `1px solid ${IKHFA_COLOR}35` : '1px solid rgba(74,74,166,0.1)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => handleLetterTap(letter)}
              >
                <span className="text-lg font-arabic" style={{ color: selectedLetter === letter ? IKHFA_COLOR : '#ffffff' }}>{letter}</span>
              </motion.button>
            ))}
          </div>

          {/* Examples */}
          <div className="space-y-2">
            {IKHFA_LETTERS.examples.map((ex, i) => (
              <div key={i} className="rounded-lg p-3 flex items-center justify-between" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
                <div>
                  <div className="text-lg font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>{ex.from}</div>
                  <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{ex.desc}</div>
                </div>
                <button
                  className="p-1.5 rounded-lg"
                  style={{ background: `${IKHFA_COLOR}12`, border: `1px solid ${IKHFA_COLOR}25` }}
                  onClick={() => playAudio(ex.from, `ikhfa-ex-${i}`)}
                >
                  {playingAudio === `ikhfa-ex-${i}` ? (
                    <motion.span className="text-[10px]" style={{ color: IKHFA_COLOR }} animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}>♪</motion.span>
                  ) : (
                    <Volume2 className="h-3.5 w-3.5" style={{ color: IKHFA_COLOR }} />
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Start Quiz */}
          <button
            className="w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            style={{ background: `${IKHFA_COLOR}12`, border: `1px solid ${IKHFA_COLOR}25`, color: IKHFA_COLOR }}
            onClick={startQuiz}
          >
            <Zap className="h-4 w-4" />
            Mula Kuiz Ikhfa&apos;
          </button>
        </div>
      )}

      {/* Iqlab Tab */}
      {activeTab === 'iqlab' && !quizMode && (
        <div className="space-y-3">
          {/* Description */}
          <div className="rounded-xl p-3" style={{ background: `${IQLAB_COLOR}08`, border: `1px solid ${IQLAB_COLOR}20` }}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="h-2.5 w-2.5 rounded-full" style={{ background: IQLAB_COLOR }} />
              <span className="text-[11px] font-semibold" style={{ color: IQLAB_COLOR }}>{IQLAB_DATA.name}</span>
              <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)', direction: 'rtl' as const }}>{IQLAB_DATA.nameAr}</span>
            </div>
            <p className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{IQLAB_DATA.desc}</p>
          </div>

          {/* Single Iqlab Letter */}
          <div className="flex justify-center">
            <motion.button
              className="h-28 w-28 rounded-2xl flex flex-col items-center justify-center"
              style={{
                background: `${IQLAB_COLOR}12`,
                border: `2px solid ${IQLAB_COLOR}35`,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => playAudio(IQLAB_DATA.letter, 'iqlab-letter')}
            >
              <span className="text-5xl font-arabic" style={{ color: IQLAB_COLOR }}>{IQLAB_DATA.letter}</span>
              <span className="text-[9px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Huruf Iqlab sahaja</span>
            </motion.button>
          </div>

          {/* Iqlab Examples */}
          <div className="space-y-2">
            {IQLAB_DATA.examples.map((ex, i) => (
              <div key={i} className="rounded-lg p-3 flex items-center justify-between" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
                <div>
                  <div className="text-lg font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>{ex.from}</div>
                  <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{ex.desc}</div>
                  <div className="text-[9px]" style={{ color: IQLAB_COLOR }}>→ {ex.result}</div>
                </div>
                <button
                  className="p-1.5 rounded-lg"
                  style={{ background: `${IQLAB_COLOR}12`, border: `1px solid ${IQLAB_COLOR}25` }}
                  onClick={() => playAudio(ex.from, `iqlab-ex-${i}`)}
                >
                  <Volume2 className="h-3.5 w-3.5" style={{ color: IQLAB_COLOR }} />
                </button>
              </div>
            ))}
          </div>

          {/* Start Quiz */}
          <button
            className="w-full py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
            style={{ background: `${IQLAB_COLOR}12`, border: `1px solid ${IQLAB_COLOR}25`, color: IQLAB_COLOR }}
            onClick={startQuiz}
          >
            <Zap className="h-4 w-4" />
            Mula Kuiz Iqlab
          </button>
        </div>
      )}

      {/* Quiz Mode */}
      {quizMode && quizQuestion && (
        <div className="space-y-3">
          {/* Quiz Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" style={{ color: '#4a4aa6' }} />
              <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>
                Kuiz {activeTab === 'ikhfa' ? 'Ikhfa\'' : 'Iqlab'}
              </span>
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

          {/* Question */}
          <motion.div
            className="rounded-xl p-4 text-center"
            style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.15)' }}
            key={quizQuestion.word}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>
              Apakah hukum bagi perkataan ini?
            </div>
            <div className="text-2xl font-arabic mb-2" style={{ color: '#d4af37', direction: 'rtl' as const }}>
              {quizQuestion.word}
            </div>
            <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.3)' }}>
              Perhatikan: {quizQuestion.highlight}
            </div>
            <button
              className="mt-2 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 mx-auto"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: '#d4af37' }}
              onClick={() => playAudio(quizQuestion.word, 'ikhfa-iqlab-quiz-play')}
            >
              <Volume2 className="h-3 w-3" /> Dengar
            </button>
          </motion.div>

          {/* Answer Options */}
          <div className="grid grid-cols-3 gap-2">
            {([
              { key: 'ikhfa' as QuizAnswer, label: 'Ikhfa\'', color: IKHFA_COLOR },
              { key: 'iqlab' as QuizAnswer, label: 'Iqlab', color: IQLAB_COLOR },
              { key: 'izhar' as QuizAnswer, label: 'Izhar', color: '#9ca3af' },
            ]).map(opt => {
              const isCorrectAnswer = quizQuestion.answer === opt.key
              const isSelected = quizAnswered === opt.key
              let bg = 'rgba(42,42,106,0.5)'
              let borderColor = 'rgba(74,74,166,0.15)'

              if (quizAnswered) {
                if (isCorrectAnswer) {
                  bg = `${opt.color}12`
                  borderColor = `${opt.color}35`
                } else if (isSelected && !isCorrectAnswer) {
                  bg = 'rgba(239,68,68,0.08)'
                  borderColor = 'rgba(239,68,68,0.2)'
                }
              }

              return (
                <motion.button
                  key={opt.key}
                  className="rounded-xl p-3 text-center"
                  style={{ background: bg, border: `1px solid ${borderColor}` }}
                  onClick={() => handleQuizAnswer(opt.key)}
                  whileTap={!quizAnswered ? { scale: 0.95 } : undefined}
                  disabled={quizAnswered !== null}
                >
                  <div className="text-[10px] font-semibold" style={{ color: quizAnswered && isCorrectAnswer ? opt.color : quizAnswered && isSelected && !isCorrectAnswer ? '#ef4444' : '#ffffff' }}>
                    {opt.label}
                  </div>
                  {quizAnswered && isCorrectAnswer && <CheckCircle className="h-3.5 w-3.5 mx-auto mt-1" style={{ color: opt.color }} />}
                  {quizAnswered && isSelected && !isCorrectAnswer && <XCircle className="h-3.5 w-3.5 mx-auto mt-1" style={{ color: '#ef4444' }} />}
                </motion.button>
              )
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {quizAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {quizAnswered === quizQuestion.answer ? (
                    <>
                      <CheckCircle className="h-4 w-4" style={{ color: '#22c55e' }} />
                      <span className="text-[11px] font-semibold" style={{ color: '#22c55e' }}>Betul! +10 XP</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" style={{ color: '#ef4444' }} />
                      <span className="text-[11px] font-semibold" style={{ color: '#ef4444' }}>
                        Salah — {quizQuestion.answer === 'ikhfa' ? 'Ikhfa\'' : quizQuestion.answer === 'iqlab' ? 'Iqlab' : 'Izhar'}
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
