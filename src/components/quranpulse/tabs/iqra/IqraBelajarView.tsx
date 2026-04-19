'use client'
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, ChevronRight, Volume2, Star, CheckCircle,
  Play, Pause,
} from 'lucide-react'
import {
  type IqraSubTab,
  type LetterFilter,
  type EnhancedLetter,
  ENHANCED_LETTERS,
  HARAKAT_DATA,
  TANWIN_MAD_DATA,
  TAJWID_CATEGORIES,
  HAFAZAN_SURAHS,
} from './types'
import { IqraProgressTracker } from './IqraProgressTracker'

interface IqraBelajarViewProps {
  // Store
  iqraBook: number
  iqraPage: number
  setIqraBook: (book: number) => void
  setIqraPage: (page: number) => void
  xp: number
  addXp: (amount: number) => void

  // Progress
  completedPages: Set<string>
  setCompletedPages: React.Dispatch<React.SetStateAction<Set<string>>>
  hafazanProgress: Record<number, number>
  hafazanVersesDone: number
  tajwidMastered: Set<string>
  totalTajwidRules: number
  totalHafazanVerses: number
  bookProgress: (bookId: number) => number
  markComplete: () => void
  earnedBadges: string[]
  pathProgress: number[]
  dailyChallenge: { type: string; instruction: string; items: string[] }
  dailyItem: string
  challengeXp: number
  handleHarakatChallenge: (choice: string) => void
  weeklyActivity: number[]
  dayNames: string[]
  strongest: { name: string; score: number }
  weakest: { name: string; score: number }
  overallProgress: number
  totalPagesCompleted: number
  overallMastery: number
  jakimLevel: { level: string; color: string }

  // Learning mode & assessment
  learningMode: 'kids' | 'adult'
  assessmentActive: boolean
  setAssessmentActive: React.Dispatch<React.SetStateAction<boolean>>
  assessmentDone: boolean
  setAssessmentDone: React.Dispatch<React.SetStateAction<boolean>>
  assessmentIdx: number
  setAssessmentIdx: React.Dispatch<React.SetStateAction<number>>
  assessmentScore: number
  setAssessmentScore: React.Dispatch<React.SetStateAction<number>>
  assessmentLetters: { id: number; letter: string; name: string; nameEn: string; audioRef: string; forms: { isolated: string; initial: string; medial: string; final: string }; nameMs: string; harakat: { fathah: string; kasrah: string; dhammah: string; sukun: string; shaddah: string }; writingTip: string }[]
  assessmentOptions: string[][]
  startAssessment: () => void

  // Letters
  letterFilter: LetterFilter
  setLetterFilter: (filter: LetterFilter) => void
  filteredLetters: EnhancedLetter[]

  // Audio
  playingAudio: string | null
  playAudio: (text: string, id: string, speed?: number) => void
  isAutoPlaying: boolean
  startAutoPlay: () => void

  // Letter detail
  showLetterDetail: number | null
  setShowLetterDetail: (idx: number | null) => void

  // Navigation helpers
  setSubTab: (tab: IqraSubTab) => void
  setShowAITutor: (show: boolean) => void
}

export function IqraBelajarView({
  iqraBook, iqraPage, setIqraBook, setIqraPage, xp, addXp,
  completedPages, setCompletedPages,
  hafazanProgress, hafazanVersesDone,
  tajwidMastered, totalTajwidRules, totalHafazanVerses,
  bookProgress, markComplete, earnedBadges, pathProgress,
  dailyChallenge, dailyItem, challengeXp, handleHarakatChallenge,
  weeklyActivity, dayNames, strongest, weakest,
  overallProgress, totalPagesCompleted, overallMastery, jakimLevel,
  learningMode,
  assessmentActive, setAssessmentActive,
  assessmentDone, setAssessmentDone,
  assessmentIdx, setAssessmentIdx,
  assessmentScore, setAssessmentScore,
  assessmentLetters, assessmentOptions,
  startAssessment,
  letterFilter, setLetterFilter, filteredLetters,
  playingAudio, playAudio, isAutoPlaying, startAutoPlay,
  showLetterDetail, setShowLetterDetail,
  setSubTab, setShowAITutor,
}: IqraBelajarViewProps) {
  const [view, setView] = useState<'books' | 'reader' | 'letters'>('books')

  const currentBook = ([
    { id: 1, title: 'Iqra 1', desc: 'Huruf Hijaiyah', icon: '🔤', color: '#4a4aa6', pages: 28, letters: 29 },
    { id: 2, title: 'Iqra 2', desc: 'Harakat (Baris)', icon: '📌', color: '#6a6ab6', pages: 28, letters: 0 },
    { id: 3, title: 'Iqra 3', desc: 'Tanwin & Mad', icon: '〰️', color: '#d4af37', pages: 28, letters: 0 },
    { id: 4, title: 'Iqra 4', desc: 'Tajwid Lanjutan', icon: '🎯', color: '#e0c060', pages: 28, letters: 0 },
    { id: 5, title: 'Iqra 5', desc: 'Waqaf & Ibtida', icon: '🛑', color: '#3a3a8a', pages: 28, letters: 0 },
    { id: 6, title: 'Iqra 6', desc: 'Bacaan Al-Quran', icon: '📖', color: '#2a2a6a', pages: 28, letters: 0 },
  ]).find(b => b.id === iqraBook) || { id: 1, title: 'Iqra 1', desc: 'Huruf Hijaiyah', icon: '🔤', color: '#4a4aa6', pages: 28, letters: 29 }
  const pageKey = `${iqraBook}-${iqraPage}`

  const navigatePage = useCallback((delta: number) => {
    const newPage = Math.max(1, Math.min(currentBook.pages, iqraPage + delta))
    setIqraPage(newPage)
  }, [currentBook.pages, iqraPage, setIqraPage])

  if (view === 'reader') {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <button className="flex items-center gap-1 text-xs" style={{ color: '#4a4aa6' }} onClick={() => setView('books')}>
            <ChevronLeft className="h-4 w-4" /> Kembali
          </button>
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
        <motion.div
          className="rounded-xl p-5 min-h-[350px] flex flex-col items-center justify-center"
          style={{ background: 'rgba(42,42,106,0.3)', border: `1px solid ${currentBook.color}20` }}
          key={pageKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {renderIqraContent(iqraBook, iqraPage, currentBook, playAudio)}
          <button
            className="mt-5 flex items-center gap-2 px-4 py-2 rounded-xl text-[11px]"
            style={{ background: `${currentBook.color}15`, color: currentBook.color, border: `1px solid ${currentBook.color}25` }}
            onClick={() => playAudio(getIqraAudioText(iqraBook, iqraPage), `iqra-${pageKey}`)}
          >
            {playingAudio === `iqra-${pageKey}` ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            Dengar Bacaan
          </button>
        </motion.div>
        <div className="flex justify-between mt-3">
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px]"
            style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)', color: iqraPage > 1 ? '#4a4aa6' : 'rgba(204,204,204,0.3)' }}
            disabled={iqraPage <= 1} onClick={() => navigatePage(-1)}
          ><ChevronLeft className="h-3.5 w-3.5" /> Sebelum</button>
          {completedPages.has(pageKey) && <span className="text-[10px] self-center" style={{ color: '#4a4aa6' }}>✓ Selesai</span>}
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-[11px]"
            style={{ background: `${currentBook.color}15`, border: `1px solid ${currentBook.color}25`, color: currentBook.color }}
            disabled={iqraPage >= currentBook.pages} onClick={() => navigatePage(1)}
          >Seterusnya <ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    )
  }

  if (view === 'letters') {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <button className="flex items-center gap-1 text-xs" style={{ color: '#4a4aa6' }} onClick={() => setView('books')}>
            <ChevronLeft className="h-4 w-4" /> Kembali
          </button>
          <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>Huruf Hijaiyah</span>
          <div style={{ width: 60 }} />
        </div>
        <div className="flex gap-1.5 mb-3 overflow-x-auto">
          {(['all', 'hijaiyah', 'harakat', 'tanwin', 'mad'] as LetterFilter[]).map(f => (
            <button
              key={f}
              className="px-3 py-1 rounded-full text-[10px] capitalize whitespace-nowrap"
              style={{
                background: letterFilter === f ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.4)',
                color: letterFilter === f ? '#ffffff' : 'rgba(204,204,204,0.5)',
                border: `1px solid ${letterFilter === f ? 'rgba(74,74,166,0.3)' : 'transparent'}`,
              }}
              onClick={() => setLetterFilter(f)}
            >{f === 'all' ? 'Semua' : f === 'hijaiyah' ? 'Huruf' : f === 'harakat' ? 'Baris' : f === 'tanwin' ? 'Tanwin' : 'Mad'}</button>
          ))}
          {/* Auto-play button */}
          {(letterFilter === 'all' || letterFilter === 'hijaiyah') && filteredLetters.length > 0 && (
            <button
              className="px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap flex items-center gap-1"
              style={{
                background: isAutoPlaying ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.4)',
                border: `1px solid ${isAutoPlaying ? 'rgba(212,175,55,0.3)' : 'transparent'}`,
                color: isAutoPlaying ? '#d4af37' : 'rgba(204,204,204,0.5)',
              }}
              onClick={startAutoPlay}
            >
              {isAutoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              {isAutoPlaying ? 'Henti' : 'Auto'}
            </button>
          )}
        </div>
        {(letterFilter === 'all' || letterFilter === 'hijaiyah') && (
        <div className={`grid ${learningMode === 'kids' ? 'grid-cols-3' : 'grid-cols-5'} gap-2`}>
          {filteredLetters.map((letter, i) => (
            <motion.button
              key={letter.id}
              className="aspect-square rounded-xl flex flex-col items-center justify-center relative"
              style={{
                background: 'rgba(42,42,106,0.5)',
                border: playingAudio === `letter-grid-${letter.id}`
                  ? '2px solid #d4af37'
                  : '1px solid rgba(74,74,166,0.1)',
                boxShadow: learningMode === 'kids'
                  ? '0 0 12px rgba(212,175,55,0.08)'
                  : playingAudio === `letter-grid-${letter.id}`
                    ? '0 0 8px rgba(212,175,55,0.3)'
                    : 'none',
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                ...(playingAudio === `letter-grid-${letter.id}` ? { scale: [1, 1.05, 1] } : {}),
              }}
              transition={{ delay: i * 0.015, ...(playingAudio === `letter-grid-${letter.id}` ? { type: 'tween' as const, repeat: Infinity, duration: 1 } : {}) }}
              onClick={() => { setShowLetterDetail(i); playAudio(letter.name, `letter-grid-${letter.id}`) }}
            >
              <span className={`${learningMode === 'kids' ? 'text-3xl' : 'text-lg'}`} style={{ color: '#ffffff' }}>{letter.letter}</span>
              <span className={`${learningMode === 'kids' ? 'text-[10px]' : 'text-[9px]'} mt-0.5`} style={{ color: 'rgba(204,204,204,0.5)' }}>{letter.name}</span>
              {learningMode === 'kids' && (
                <span className="absolute bottom-1 right-1 text-[10px]" style={{ color: 'rgba(212,175,55,0.5)' }}>🔊</span>
              )}
            </motion.button>
          ))}
        </div>
        )}
        {learningMode === 'kids' && (letterFilter === 'all' || letterFilter === 'hijaiyah') && (
          <div className="text-center mt-2">
            <span className="text-[10px]" style={{ color: 'rgba(212,175,55,0.6)' }}>Ketik untuk dengar! 🔊</span>
          </div>
        )}
        {letterFilter === 'harakat' && (
          <div className="grid grid-cols-2 gap-2.5">
            {[...HARAKAT_DATA,
              { id: 'sukun', name: 'Sukun', nameAr: 'سُكُون', symbol: 'ْ', desc: 'Tanpa baris — huruf mati', example: 'بْ (b)' },
              { id: 'shaddah', name: 'Syaddah', nameAr: 'شَدَّة', symbol: 'ّ', desc: 'Gandaan — bunyi berulang', example: 'بّ (bb)' },
            ].map(h => (
              <motion.button
                key={h.id}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => playAudio(h.example.replace(/[()]/g, '').trim(), `harakat-${h.id}`, 0.7)}
              >
                <div className="text-4xl font-arabic mb-1" style={{ color: '#d4af37' }}>{h.symbol}</div>
                <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{h.name}</div>
                <div className="text-2xl font-arabic my-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{h.nameAr}</div>
                <div className="text-[9px] mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{h.desc}</div>
                <div className="text-lg font-arabic" style={{ color: '#4a4aa6' }}>{h.example}</div>
                <Volume2 className="h-3 w-3 mx-auto mt-1.5" style={{ color: 'rgba(74,74,166,0.4)' }} />
              </motion.button>
            ))}
          </div>
        )}
        {letterFilter === 'tanwin' && (
          <div className="grid grid-cols-2 gap-2.5">
            {TANWIN_MAD_DATA.filter(t => t.id.startsWith('tanwin')).map(t => (
              <motion.button
                key={t.id}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => playAudio(t.example.replace(/[()]/g, '').trim(), `tanwin-${t.id}`, 0.7)}
              >
                <div className="text-4xl font-arabic mb-1" style={{ color: '#d4af37' }}>{t.symbol}</div>
                <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{t.name}</div>
                <div className="text-2xl font-arabic my-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.nameAr}</div>
                <div className="text-[9px] mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{t.desc}</div>
                <div className="text-lg font-arabic" style={{ color: '#4a4aa6' }}>{t.example}</div>
                <Volume2 className="h-3 w-3 mx-auto mt-1.5" style={{ color: 'rgba(74,74,166,0.4)' }} />
              </motion.button>
            ))}
          </div>
        )}
        {letterFilter === 'mad' && (
          <div className="grid grid-cols-1 gap-2.5">
            {TANWIN_MAD_DATA.filter(t => t.id.startsWith('mad')).map(t => (
              <motion.button
                key={t.id}
                className="rounded-xl p-4 text-center"
                style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => playAudio(t.example.replace(/[()]/g, '').trim(), `mad-${t.id}`, 0.7)}
              >
                <div className="text-[11px] font-semibold mb-1" style={{ color: '#d4af37' }}>{t.name}</div>
                <div className="text-3xl font-arabic my-1" style={{ color: '#ffffff' }}>{t.nameAr}</div>
                <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>{t.desc}</div>
                <div className="text-xl font-arabic" style={{ color: '#4a4aa6' }}>{t.example}</div>
                <Volume2 className="h-3 w-3 mx-auto mt-2" style={{ color: 'rgba(74,74,166,0.4)' }} />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <IqraProgressTracker
        earnedBadges={earnedBadges}
        pathProgress={pathProgress}
        dailyChallenge={dailyChallenge}
        dailyItem={dailyItem}
        challengeXp={challengeXp}
        handleHarakatChallenge={handleHarakatChallenge}
        playAudio={playAudio}
        addXp={addXp}
        weeklyActivity={weeklyActivity}
        dayNames={dayNames}
        strongest={strongest}
        weakest={weakest}
        xp={xp}
        hafazanVersesDone={hafazanVersesDone}
        jakimLevel={jakimLevel}
        overallMastery={overallMastery}
        overallProgress={overallProgress}
        totalPagesCompleted={totalPagesCompleted}
        tajwidMastered={tajwidMastered}
        totalTajwidRules={totalTajwidRules}
        totalHafazanVerses={totalHafazanVerses}
        bookProgress={bookProgress}
        completedPages={completedPages}
        setIqraBook={setIqraBook}
        setIqraPage={setIqraPage}
        setView={setView}
        setSubTab={setSubTab}
        setShowAITutor={setShowAITutor}
        assessmentActive={assessmentActive}
        assessmentDone={assessmentDone}
        assessmentLetters={assessmentLetters}
        assessmentScore={assessmentScore}
        assessmentIdx={assessmentIdx}
        assessmentOptions={assessmentOptions}
        startAssessment={startAssessment}
        setAssessmentScore={setAssessmentScore}
        setAssessmentDone={setAssessmentDone}
        setAssessmentActive={setAssessmentActive}
        setAssessmentIdx={setAssessmentIdx}
        addXpFn={addXp}
        learningMode={learningMode}
      />
    </div>
  )
}

function renderIqraContent(
  iqraBook: number,
  iqraPage: number,
  currentBook: { id: number; title: string; desc: string; icon: string; color: string; pages: number; letters: number },
  playAudio: (text: string, id: string) => void,
) {
  if (iqraBook === 1) {
    const perPage = 6
    const start = ((iqraPage - 1) * perPage) % ENHANCED_LETTERS.length
    const pageLetters = Array.from({ length: perPage }, (_, i) => ENHANCED_LETTERS[(start + i) % ENHANCED_LETTERS.length])
    return (
      <div className="w-full">
        <div className="text-center mb-3">
          <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(74,74,166,0.12)', color: '#4a4aa6' }}>
            Pengenalan Huruf Hijaiyah
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {pageLetters.map(l => (
            <div
              key={l.id}
              className="aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer"
              style={{ background: 'rgba(74,74,166,0.06)', border: '1px solid rgba(74,74,166,0.1)' }}
              onClick={() => playAudio(l.name, `iqra-letter-${l.id}`)}
            >
              <span className="text-3xl" style={{ color: '#ffffff' }}>{l.letter}</span>
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
        <div className="text-center mb-3">
          <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(106,106,182,0.12)', color: '#6a6ab6' }}>
            Harakat: Fathah, Kasrah, Dhammah
          </span>
        </div>
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
        <div className="text-center mb-3">
          <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>Tanwin & Mad</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TANWIN_MAD_DATA.map(item => (
            <div key={item.id} className="rounded-xl p-2.5 text-center" style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)' }}>
              <div className="text-xl font-arabic" style={{ color: '#ffffff' }}>{item.symbol}</div>
              <div className="text-[9px] font-medium mt-1" style={{ color: '#d4af37' }}>{item.name}</div>
              <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  // Iqra 4-6: Practice verses
  const verses = [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ',
    'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ',
  ]
  const labels: Record<number, string> = { 4: 'Tajwid Lanjutan', 5: 'Waqaf & Ibtida', 6: 'Bacaan Al-Quran' }
  return (
    <div className="w-full">
      <div className="text-center mb-3">
        <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: `${currentBook.color}12`, color: currentBook.color }}>
          {labels[iqraBook] || 'Latihan'}
        </span>
      </div>
      <div className="space-y-2">
        {verses.map((v, i) => (
          <div key={i} className="rounded-xl p-3 text-center" style={{ background: `${currentBook.color}06`, border: `1px solid ${currentBook.color}12` }}>
            <p className="text-xl leading-loose font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{v}</p>
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
