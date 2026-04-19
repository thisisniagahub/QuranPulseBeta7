'use client'
import React from 'react'
import { motion } from 'framer-motion'
import {
  Award, Lock, TrendingUp, Target, Calendar, BarChart3,
  Clock, Shield, CheckCircle, Zap, Volume2,
} from 'lucide-react'
import {
  BADGES, LEARNING_PATH, IQRA_BOOKS,
} from './types'

interface IqraProgressTrackerProps {
  earnedBadges: string[]
  pathProgress: number[]
  dailyChallenge: { type: string; instruction: string; items: string[] }
  dailyItem: string
  challengeXp: number
  handleHarakatChallenge: (choice: string) => void
  playAudio: (text: string, id: string) => void
  addXp: (amount: number) => void
  weeklyActivity: number[]
  dayNames: string[]
  strongest: { name: string; score: number }
  weakest: { name: string; score: number }
  xp: number
  hafazanVersesDone: number
  jakimLevel: { level: string; color: string }
  overallMastery: number
  overallProgress: number
  totalPagesCompleted: number
  tajwidMastered: Set<string>
  totalTajwidRules: number
  totalHafazanVerses: number
  bookProgress: (bookId: number) => number
  completedPages: Set<string>
  setIqraBook: (book: number) => void
  setIqraPage: (page: number) => void
  setView: (view: 'books' | 'reader' | 'letters') => void
  setSubTab: (tab: 'belajar' | 'latihan' | 'tajwid' | 'hafazan') => void
  setShowAITutor: (show: boolean) => void
  assessmentActive: boolean
  assessmentDone: boolean
  assessmentLetters: { id: number; letter: string; name: string }[]
  assessmentScore: number
  assessmentIdx: number
  assessmentOptions: string[][]
  startAssessment: () => void
  setAssessmentScore: React.Dispatch<React.SetStateAction<number>>
  setAssessmentDone: React.Dispatch<React.SetStateAction<boolean>>
  setAssessmentActive: React.Dispatch<React.SetStateAction<boolean>>
  setAssessmentIdx: React.Dispatch<React.SetStateAction<number>>
  addXpFn: (amount: number) => void
  learningMode: 'kids' | 'adult'
}

export function IqraProgressTracker({
  earnedBadges,
  pathProgress,
  dailyChallenge,
  dailyItem,
  challengeXp,
  handleHarakatChallenge,
  playAudio,
  addXp,
  weeklyActivity,
  dayNames,
  strongest,
  weakest,
  xp,
  hafazanVersesDone,
  jakimLevel,
  overallMastery,
  overallProgress,
  totalPagesCompleted,
  tajwidMastered,
  totalTajwidRules,
  totalHafazanVerses,
  bookProgress,
  completedPages,
  setIqraBook,
  setIqraPage,
  setView,
  setSubTab,
  setShowAITutor,
  assessmentActive,
  assessmentDone,
  assessmentLetters,
  assessmentScore,
  assessmentIdx,
  assessmentOptions,
  startAssessment,
  setAssessmentScore,
  setAssessmentDone,
  setAssessmentActive,
  setAssessmentIdx,
  addXpFn,
  learningMode,
}: IqraProgressTrackerProps) {
  return (
    <div>
      {/* Adult: Quick Assessment */}
      {learningMode === 'adult' && !assessmentActive && (
        <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(74,74,166,0.08)', border: '1px solid rgba(74,74,166,0.15)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Penilaian Pantas</span>
          </div>
          <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.6)' }}>Uji tahap anda untuk melangkau kandungan yang sudah dikuasai</div>
          {assessmentDone && assessmentLetters.length > 0 && (
            <div className="rounded-lg p-2.5 mb-2" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <div className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>
                Anda mengenali {assessmentScore}/5 huruf. Tahap: {assessmentScore >= 4 ? 'Lanjutan' : assessmentScore >= 2 ? 'Pertengahan' : 'Pemula'}
              </div>
              <div className="text-[9px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
                Cadangan: Mula dari {assessmentScore >= 4 ? 'Iqra 3 (Tanwin & Mad)' : assessmentScore >= 2 ? 'Iqra 2 (Harakat)' : 'Iqra 1 (Hijaiyah)'}
              </div>
            </div>
          )}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium"
            style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.25)' }}
            onClick={startAssessment}
          >
            <Zap className="h-3 w-3" /> Mula Penilaian
          </button>
        </div>
      )}

      {/* Adult: Assessment In-Progress */}
      {learningMode === 'adult' && assessmentActive && assessmentLetters.length > 0 && (
        <div className="rounded-xl p-4 mb-3" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Penilaian Pantas</span>
            <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{assessmentIdx + 1}/5</span>
          </div>
          {assessmentIdx < 5 ? (
            <>
              <div className="text-center mb-3">
                <div className="text-[10px] mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Huruf apakah ini?</div>
                <div className="text-6xl font-arabic" style={{ color: '#4a4aa6' }}>{assessmentLetters[assessmentIdx].letter}</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(assessmentOptions[assessmentIdx] || []).map((opt, i) => (
                  <motion.button
                    key={i}
                    className="py-2.5 rounded-xl text-[11px] font-medium"
                    style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (opt === assessmentLetters[assessmentIdx].name) {
                        setAssessmentScore(s => s + 1)
                      }
                      if (assessmentIdx + 1 >= 5) {
                        setAssessmentDone(true)
                        setAssessmentActive(false)
                        addXpFn(25)
                      } else {
                        setAssessmentIdx(assessmentIdx + 1)
                      }
                    }}
                  >{opt}</motion.button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Achievement Badges */}
      <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-2">
          <Award className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Pencapaian</span>
          <span className="text-[9px] ml-auto" style={{ color: 'rgba(204,204,204,0.4)' }}>{earnedBadges.length}/{BADGES.length}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {BADGES.map(badge => {
            const earned = earnedBadges.includes(badge.id)
            return (
              <motion.div
                key={badge.id}
                className="flex flex-col items-center gap-1 flex-shrink-0"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm"
                  style={{
                    background: earned ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.5)',
                    border: `2px solid ${earned ? '#d4af37' : 'rgba(74,74,166,0.15)'}`,
                    boxShadow: earned ? '0 0 8px rgba(212,175,55,0.3)' : 'none',
                  }}
                >
                  {earned ? badge.icon : <Lock className="h-3.5 w-3.5" style={{ color: 'rgba(204,204,204,0.25)' }} />}
                </div>
                <span className="text-[9px] text-center max-w-[64px]" style={{ color: earned ? '#d4af37' : 'rgba(204,204,204,0.3)' }}>{badge.name}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Learning Path */}
      <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-2.5">
          <TrendingUp className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Laluan Pembelajaran</span>
        </div>
        <div className="flex items-start gap-1">
          {LEARNING_PATH.map((step, i) => {
            const prog = pathProgress[i]
            const unlocked = i === 0 || pathProgress[i - 1] >= 50
            const isComplete = prog >= 100
            return (
              <div key={step.step} className="flex-1 flex flex-col items-center relative">
                {i < LEARNING_PATH.length - 1 && (
                  <div className="absolute top-3 left-1/2 w-full h-0.5" style={{ background: isComplete ? '#d4af37' : 'rgba(74,74,166,0.15)' }} />
                )}
                <div
                  className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] z-10 mb-1"
                  style={{
                    background: isComplete ? 'rgba(212,175,55,0.2)' : unlocked ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.4)',
                    border: `2px solid ${isComplete ? '#d4af37' : unlocked ? '#4a4aa6' : 'rgba(74,74,166,0.15)'}`,
                    color: isComplete ? '#d4af37' : unlocked ? '#ffffff' : 'rgba(204,204,204,0.3)',
                  }}
                >
                  {isComplete ? '\u2713' : step.step}
                </div>
                <span className="text-[9px] text-center leading-tight" style={{ color: unlocked ? '#ffffff' : 'rgba(204,204,204,0.3)' }}>{step.name}</span>
                <span className="text-[9px]" style={{ color: isComplete ? '#d4af37' : 'rgba(204,204,204,0.4)' }}>{prog}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
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
              <button
                className="flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg text-[10px]"
                style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.2)' }}
                onClick={() => { playAudio(dailyItem, 'daily-challenge'); addXp(20) }}
              >
                <Volume2 className="h-3 w-3" /> Sebut & Dengar
              </button>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
              {['\u0641\u064E\u062A\u0652\u062D\u064E\u0629 (a)', '\u0643\u064E\u0633\u0652\u0631\u064E\u0629 (i)', '\u0636\u064E\u0645\u0651\u064E\u0629 (u)'].map((opt, i) => (
                <button
                  key={i}
                  className="py-2 rounded-lg text-[9px] font-medium"
                  style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }}
                  onClick={() => handleHarakatChallenge(opt)}
                >{opt}</button>
              ))}
            </div>
          )}
        </div>
        {challengeXp > 0 && <div className="text-[9px] mt-1.5 text-right" style={{ color: '#d4af37' }}>+{challengeXp} XP hari ini</div>}
      </div>

      {/* Progress Analytics */}
      <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-2.5">
          <BarChart3 className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Analisis Progres</span>
        </div>
        {/* Weekly activity bars */}
        <div className="flex items-end gap-1.5 mb-3 h-16">
          {weeklyActivity.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <motion.div
                className="w-full rounded-t"
                style={{ background: i === 6 ? '#d4af37' : 'rgba(74,74,166,0.4)', minHeight: 2 }}
                animate={{ height: `${Math.max(4, (val / 100) * 48)}px` }}
              />
              <span className="text-[9px]" style={{ color: i === 6 ? '#d4af37' : 'rgba(204,204,204,0.35)' }}>{dayNames[i]}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2" style={{ background: 'rgba(74,74,166,0.06)', border: '1px solid rgba(74,74,166,0.08)' }}>
            <div className="flex items-center gap-1 mb-0.5">
              <TrendingUp className="h-2.5 w-2.5" style={{ color: '#4a4aa6' }} />
              <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Terkuat</span>
            </div>
            <div className="text-[10px] font-medium" style={{ color: '#4a4aa6' }}>{strongest.name}</div>
            <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{strongest.score}%</div>
          </div>
          <div className="rounded-lg p-2" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.08)' }}>
            <div className="flex items-center gap-1 mb-0.5">
              <Target className="h-2.5 w-2.5" style={{ color: '#d4af37' }} />
              <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Perlu Latihan</span>
            </div>
            <div className="text-[10px] font-medium" style={{ color: '#d4af37' }}>{weakest.name}</div>
            <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{weakest.score}%</div>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" style={{ color: 'rgba(204,204,204,0.3)' }} />
            <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Masa belajar: ~{Math.max(1, Math.round(xp / 50))} jam</span>
          </div>
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Kadar: ~{Math.max(1, Math.round(hafazanVersesDone / Math.max(1, Math.round(xp / 50))))} ayat/jam</span>
        </div>
      </div>

      {/* JAKIM Skill Level */}
      <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.25)', border: '1px solid rgba(74,74,166,0.08)' }}>
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

      {/* Progress Overview */}
      <div
        className="rounded-xl p-3 mb-3"
        style={{ background: 'linear-gradient(135deg, rgba(74,74,166,0.1), rgba(212,175,55,0.05))', border: '1px solid rgba(74,74,166,0.12)' }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium" style={{ color: '#ffffff' }}>Progres Keseluruhan</span>
          <span className="text-[10px]" style={{ color: '#4a4aa6' }}>{overallProgress}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} animate={{ width: `${overallProgress}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <div className="text-center">
            <div className="text-xs font-bold" style={{ color: '#4a4aa6' }}>{totalPagesCompleted}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Halaman</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold" style={{ color: '#d4af37' }}>{tajwidMastered.size}/{totalTajwidRules}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Tajwid</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold" style={{ color: '#6a6ab6' }}>{hafazanVersesDone}/{totalHafazanVerses}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Hafazan</div>
          </div>
        </div>
      </div>

      {/* Iqra Book Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {IQRA_BOOKS.map((book, i) => {
          const prog = bookProgress(book.id)
          return (
            <motion.button
              key={book.id}
              className="rounded-xl p-3 text-left transition-transform active:scale-[0.97]"
              style={{ background: `linear-gradient(135deg, ${book.color}15, ${book.color}05)`, border: `1px solid ${book.color}25` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => { setIqraBook(book.id); setIqraPage(1); setView('reader') }}
            >
              <div className="flex items-center justify-between">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center text-sm" style={{ background: `${book.color}20`, color: book.color }}>
                  {book.icon}
                </div>
                {prog > 0 && (prog === 100 ? <CheckCircle className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} /> : <span className="text-[9px] font-bold" style={{ color: book.color }}>{prog}%</span>)}
              </div>
              <div className="mt-1.5">
                <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{book.title}</div>
                <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{book.desc}</div>
              </div>
              {prog > 0 && prog < 100 && (
                <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ background: `${book.color}12` }}>
                  <div className="h-full rounded-full" style={{ width: `${prog}%`, background: book.color }} />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <button
          className="rounded-xl p-2.5 text-center"
          style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
          onClick={() => setView('letters')}
        >
          <div className="text-lg">{'\uD83D\uDD24'}</div>
          <div className="text-[9px] font-medium" style={{ color: '#ffffff' }}>Huruf</div>
        </button>
        <button
          className="rounded-xl p-2.5 text-center"
          style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
          onClick={() => setSubTab('latihan')}
        >
          <div className="text-lg">{'\uD83E\uDDE0'}</div>
          <div className="text-[9px] font-medium" style={{ color: '#ffffff' }}>Latihan</div>
        </button>
        <button
          className="rounded-xl p-2.5 text-center"
          style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
          onClick={() => setShowAITutor(true)}
        >
          <div className="text-lg">{'\uD83D\uDE4B'}</div>
          <div className="text-[9px] font-medium" style={{ color: '#ffffff' }}>Tanya Cikgu</div>
        </button>
      </div>

      {/* JAKIM Footer */}
      <div className="mt-3 text-center py-2" style={{ borderTop: '1px solid rgba(74,74,166,0.06)' }}>
        <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.3)' }}>Sumber: Kementerian Pendidikan Malaysia & JAKIM</span>
      </div>
    </div>
  )
}


