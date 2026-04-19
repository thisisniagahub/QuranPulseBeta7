'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Bookmark, ChevronLeft, ChevronRight, Mic, MicOff,
  BookMarked, Loader2, CheckCircle2, AlertCircle,
  Zap, Target, RefreshCw, Brain,
} from 'lucide-react'
import { SURAH_LIST, getSurahVerses, getSurahName } from '@/lib/quran-data'
import { useQuranPulseStore } from '@/stores/quranpulse-store'

// Sub-components and hooks
import { useQuranSearch } from './quran/useQuranSearch'
import { useQuranAudio } from './quran/useQuranAudio'
import { useQuranBookmarks } from './quran/useQuranBookmarks'
import { QuranHeader } from './quran/QuranHeader'
import { QuranSurahList } from './quran/QuranSurahList'
import { QuranVerseView } from './quran/QuranVerseView'
import { QuranSearchResults } from './quran/QuranSearchResults'
import {
  HAFAZAN_LEVEL_COLORS,
  type ReadingMode, type HafazanPhase, type VerseData, type ReciteResult,
} from './quran/types'

// ─── Main Component ───────────────────────────────────────────
export function QuranTab() {
  // Core state
  const [readingMode, setReadingMode] = useState<ReadingMode>('surah')
  const [view, setView] = useState<'list' | 'reader'>('list')
  const [selectedSurah, setSelectedSurah] = useState(1)

  // Mushaf state
  const [mushafPage, setMushafPage] = useState(1)

  // Juz state
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null)

  // Reader display state
  const [showTranslation, setShowTranslation] = useState(true)
  const [showEnTranslation, setShowEnTranslation] = useState(false)
  const [showTajwid, setShowTajwid] = useState(false)
  const [showWordByWord, setShowWordByWord] = useState(false)
  const [selectedWord, setSelectedWord] = useState<{ word: string; verseNum: number; wordIndex: number } | null>(null)

  // Hafazan state
  const [hafazanPhase, setHafazanPhase] = useState<HafazanPhase>('select')
  const [hafazanRevealLevel, setHafazanRevealLevel] = useState(0)
  const [hafazanHidden, setHafazanHidden] = useState<Set<number>>(new Set())

  // Recite state
  const [isRecording, setIsRecording] = useState(false)
  const [reciteVerseIdx, setReciteVerseIdx] = useState(0)
  const [reciteResult, setReciteResult] = useState<ReciteResult | null>(null)
  const [reciteTranscription, setReciteTranscription] = useState('')

  // Reading stats
  const [pagesReadToday, setPagesReadToday] = useState(0)
  const [dailyGoal, setDailyGoal] = useState<5 | 10 | 20 | 30>(10)
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0)

  // API verse fetching with cache
  const [apiVerses, setApiVerses] = useState<VerseData[]>([])
  const [isLoadingVerses, setIsLoadingVerses] = useState(false)
  const [verseCache, setVerseCache] = useState<Record<number, VerseData[]>>({})
  const [verseError, setVerseError] = useState(false)

  // Reading history
  const [readingHistory, setReadingHistory] = useState<number[]>([])

  // Hijri date
  const [hijriDate, setHijriDate] = useState('')

  // Refs
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const readerScrollRef = useRef<HTMLDivElement>(null)

  const store = useQuranPulseStore()

  // ─── Hooks ──────────────────────────────────────────────────
  const search = useQuranSearch()

  // ─── Verse fetching ──────────────────────────────────────────
  const localVerses: VerseData[] = useMemo(() => {
    const raw = getSurahVerses(selectedSurah)
    return raw.map(v => ({ ...v, translationEn: v.translation }))
  }, [selectedSurah])

  const verses: VerseData[] = useMemo(() => {
    if (apiVerses.length > 0) return apiVerses
    if (localVerses.length > 0) return localVerses
    return verseCache[selectedSurah] || []
  }, [apiVerses, localVerses, selectedSurah, verseCache])

  // Re-create bookmarks hook with actual verses
  const bookmarksWithVerses = useQuranBookmarks({ selectedSurah, verses })

  const fetchSurahFromApi = useCallback(async (surahId: number) => {
    setIsLoadingVerses(true)
    setVerseError(false)
    try {
      const res = await fetch(`/api/quran/surah?number=${surahId}`)
      const data = await res.json()
      if (data.success && data.data?.ayahs) {
        const mapped: VerseData[] = data.data.ayahs.map((a: { numberInSurah: number; text: string; translationMs: string; translationEn: string }) => ({
          verseNumber: a.numberInSurah,
          arabic: a.text,
          translation: a.translationMs || a.translationEn || '',
          translationEn: a.translationEn || '',
        }))
        setApiVerses(mapped)
        setVerseCache(prev => ({ ...prev, [surahId]: mapped }))
      } else {
        setVerseError(true)
      }
    } catch {
      setVerseError(true)
    } finally {
      setIsLoadingVerses(false)
    }
  }, [])

  useEffect(() => {
    if (localVerses.length > 0) {
      setApiVerses([])
      setIsLoadingVerses(false)
      if (!verseCache[selectedSurah]) {
        fetchSurahFromApi(selectedSurah)
      }
      return
    }
    if (verseCache[selectedSurah]) {
      setApiVerses(verseCache[selectedSurah])
      setIsLoadingVerses(false)
      return
    }
    fetchSurahFromApi(selectedSurah)
  }, [selectedSurah, localVerses.length, verseCache, fetchSurahFromApi])

  // ─── Audio hook ─────────────────────────────────────────────
  const audio = useQuranAudio({
    selectedSurah,
    setSelectedSurah,
    verses,
    ayahRefs,
  })

  // ─── Computed ───────────────────────────────────────────────
  const surahInfo = getSurahName(selectedSurah)

  // ─── Handlers ───────────────────────────────────────────────
  const openSurah = useCallback((id: number) => {
    setSelectedSurah(id)
    setView('reader')
    setReciteResult(null)
    setReciteVerseIdx(0)
    store.setLastRead(id, 1)
    store.addXp(5)
    setPagesReadToday(p => p + 1)
  }, [store])

  const goBack = useCallback(() => {
    audio.resetAudio()
    setView('list')
    setReciteResult(null)
  }, [audio])

  const navigateSurah = useCallback((direction: -1 | 1) => {
    const next = selectedSurah + direction
    if (next >= 1 && next <= 114) {
      setSelectedSurah(next)
      store.setLastRead(next, 1)
      setReciteResult(null)
      setReciteVerseIdx(0)
      readerScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedSurah, store])

  // ─── Juz surahs ─────────────────────────────────────────────
  const juzSurahs = useMemo(() => {
    if (selectedJuz === null) return null
    return SURAH_LIST.filter(s => s.juz.includes(selectedJuz))
  }, [selectedJuz])

  // ─── Daily goal progress tracking ───────────────────────────
  useEffect(() => {
    if (pagesReadToday > 0) {
      setDailyGoalProgress(Math.min(pagesReadToday, dailyGoal))
    }
  }, [pagesReadToday, dailyGoal])

  // ─── Hijri Date Calculation (client-only) ───────────────────
  useEffect(() => {
    const now = new Date()
    const jd = Math.floor((now.getTime() / 86400000) + 2440587.5)
    const l = jd - 1948440 + 10632
    const n = Math.floor((l - 1) / 10631)
    const lPrime = l - 10631 * n + 354
    const j = Math.floor((10985 - lPrime) / 5316) * Math.floor((50 * lPrime) / 17719) + Math.floor(lPrime / 5670) * Math.floor((43 * lPrime) / 15238)
    const lDPrime = lPrime - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29
    const m = Math.floor((24 * lDPrime) / 709)
    const d = lDPrime - Math.floor((709 * m) / 24)
    const y = 30 * n + j - 30
    const hijriMonths = ['Muharram', 'Safar', 'Rabi\'ul Awal', 'Rabi\'ul Akhir', 'Jumadil Awal', 'Jumadil Akhir', 'Rajab', 'Syaban', 'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijjah']
    const monthName = hijriMonths[m - 1] || ''
    setHijriDate(`${d} ${monthName} ${y}H`)
  }, [])

  // ─── Reading History Tracking ───────────────────────────────
  useEffect(() => {
    if (view === 'reader' && selectedSurah > 0) {
      setReadingHistory(prev => {
        const updated = [selectedSurah, ...prev.filter(id => id !== selectedSurah)]
        return updated.slice(0, 10)
      })
    }
  }, [view, selectedSurah])

  // ─── Recite Mode ────────────────────────────────────────────
  const startRecording = useCallback(() => {
    setIsRecording(true)
    setReciteResult(null)
    setReciteTranscription('')

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = e => chunks.push(e.data)
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const reader = new FileReader()
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1]
          try {
            const res = await fetch('/api/asr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64 }),
            })
            const data = await res.json()
            if (data.success && data.text) {
              setReciteTranscription(data.text)
              compareRecitation(data.text)
            }
          } catch {
            setReciteTranscription('Ralat transkripsi')
          }
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }
      mediaRecorder.start()
      setTimeout(() => {
        mediaRecorder.stop()
        setIsRecording(false)
      }, 10000)
    }).catch(() => {
      setIsRecording(false)
    })
  }, [selectedSurah, reciteVerseIdx, verses, compareRecitation])

  const compareRecitation = useCallback((transcribed: string) => {
    if (verses.length === 0) return
    const verse = verses[reciteVerseIdx]
    if (!verse) return

    const expectedWords = verse.arabic.split(/\s+/).filter(Boolean)
    const transcribedWords = transcribed.split(/\s+/).filter(Boolean)

    const matchedWords = expectedWords.map((expected, i) => {
      if (i < transcribedWords.length) {
        const tWord = transcribedWords[i] || ''
        return expected.includes(tWord) || tWord.includes(expected) || tWord.length > 0
      }
      return false
    })

    const correctCount = matchedWords.filter(Boolean).length
    const accuracy = expectedWords.length > 0 ? Math.round((correctCount / expectedWords.length) * 100) : 0
    const xpEarned = Math.floor(accuracy / 10) * 5
    if (xpEarned > 0) store.addXp(xpEarned)
    store.updateHafazanVerse(selectedSurah, verse.verseNumber, accuracy >= 70)

    setReciteResult({
      accuracy,
      expectedWords,
      transcribedWords,
      matchedWords,
      xpEarned,
    })
  }, [verses, reciteVerseIdx, selectedSurah, store])

  // ─── Render: Juz View ───────────────────────────────────────
  const renderJuzView = () => {
    if (selectedJuz !== null && juzSurahs) {
      return (
        <>
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center gap-1 text-sm" style={{ color: '#4a4aa6' }} onClick={() => setSelectedJuz(null)}>
              <ChevronLeft className="h-5 w-5" /> Semua Juz
            </button>
            <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>Juz {selectedJuz}</div>
            <div className="w-16" />
          </div>
          <div className="space-y-1.5">
            {juzSurahs.map(surah => (
              <div
                key={surah.id}
                className="flex items-center justify-between rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
                style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.08)' }}
                onClick={() => { setSelectedSurah(surah.id); setReadingMode('surah'); setView('reader'); store.setLastRead(surah.id, 1) }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 flex items-center justify-center rounded-lg text-xs font-bold" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>{surah.id}</div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#ffffff' }}>{surah.nameMs}</div>
                    <span className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>{surah.versesCount} ayat</span>
                  </div>
                </div>
                <span className="text-lg font-arabic" style={{ color: 'rgba(204,204,204,0.6)' }}>{surah.name}</span>
              </div>
            ))}
          </div>
        </>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => {
          const surahs = SURAH_LIST.filter(s => s.juz.includes(juz))
          const totalVerses = surahs.reduce((a, s) => a + s.versesCount, 0)
          const progress = bookmarksWithVerses.getJuzProgress(juz)
          return (
            <motion.div
              key={juz}
              className="rounded-xl p-3 cursor-pointer active:scale-[0.97] transition-transform"
              style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.08)' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: juz * 0.02 }}
              onClick={() => { setSelectedJuz(juz); store.addXp(3) }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>{juz}</div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>Juz {juz}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{totalVerses} ayat</div>
                </div>
              </div>
              <div className="text-[10px] line-clamp-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
                {surahs.slice(0, 3).map(s => s.nameMs).join(' · ')}
              </div>
              <div className="h-1 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(74,74,166,0.15)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} />
              </div>
            </motion.div>
          )
        })}
      </div>
    )
  }

  // ─── Render: Bookmarks View ─────────────────────────────────
  const renderBookmarksView = () => {
    const bookmarkedSurahs = SURAH_LIST.filter(s => store.isSurahBookmarked(s.id))
    const bookmarkedVersesList = store.bookmarkedVerses

    return (
      <div>
        <div className="mb-4">
          <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#d4af37' }}>
            <BookMarked className="h-3.5 w-3.5" /> Surah Ditanda ({bookmarkedSurahs.length})
          </h3>
          {bookmarkedSurahs.length === 0 ? (
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(42,42,106,0.3)' }}>
              <p className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>Belum ada surah ditanda</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {bookmarkedSurahs.map(surah => (
                <div
                  key={surah.id}
                  className="flex items-center justify-between rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
                  style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.08)' }}
                  onClick={() => { setSelectedSurah(surah.id); setReadingMode('surah'); setView('reader') }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>{surah.id}</div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#ffffff' }}>{surah.nameMs}</div>
                      <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{surah.versesCount} ayat</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); store.toggleSurahBookmark(surah.id) }}>
                    <Bookmark className="h-4 w-4" style={{ color: '#d4af37' }} fill="#d4af37" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: '#4a4aa6' }}>
            <Bookmark className="h-3.5 w-3.5" /> Ayat Ditanda ({bookmarkedVersesList.length})
          </h3>
          {bookmarkedVersesList.length === 0 ? (
            <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(42,42,106,0.3)' }}>
              <p className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>Belum ada ayat ditanda</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {bookmarkedVersesList.map((bv, i) => {
                const surah = SURAH_LIST.find(s => s.id === bv.surahId)
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
                    style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.08)' }}
                    onClick={() => { setSelectedSurah(bv.surahId); setReadingMode('surah'); setView('reader') }}
                  >
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#ffffff' }}>{surah?.nameMs} : {bv.verseNumber}</div>
                      <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Ayat {bv.verseNumber}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); store.toggleVerseBookmark(bv.surahId, bv.verseNumber) }}>
                      <Bookmark className="h-4 w-4" style={{ color: '#4a4aa6' }} fill="#4a4aa6" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── Render: Hafazan View ───────────────────────────────────
  const renderHafazanView = () => {
    const hafazanSurahs = SURAH_LIST.filter(s => s.versesCount <= 30).slice(0, 20)
    const weakVerses = store.getWeakVerses()
    const dailyReview = store.getDailyReviewVerses()
    const totalProgress = store.hafazanProgress.length
    const masteredCount = store.hafazanProgress.filter(p => p.level === 'mastered').length
    const learningCount = store.hafazanProgress.filter(p => p.level === 'learning').length
    const reviewCount = store.hafazanProgress.filter(p => p.level === 'review').length

    if (view === 'reader' && hafazanPhase === 'practice') {
      const currentVerse = verses[hafazanRevealLevel]
      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center gap-1 text-sm" style={{ color: '#4a4aa6' }} onClick={() => { setHafazanPhase('select'); setView('list') }}>
              <ChevronLeft className="h-5 w-5" /> Hafazan
            </button>
            <div className="text-xs font-medium" style={{ color: '#d4af37' }}>
              Ayat {hafazanRevealLevel + 1}/{verses.length}
            </div>
            <div className="w-12" />
          </div>

          <div className="rounded-xl p-6 text-center mb-3" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.15)' }}>
            <div className="text-xs mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>
              {surahInfo?.nameMs} : {currentVerse?.verseNumber}
            </div>
            {currentVerse && (
              <>
                <p className="text-2xl font-arabic leading-[2.5]" style={{ color: hafazanHidden.has(hafazanRevealLevel) ? 'rgba(204,204,204,0.15)' : '#ffffff', direction: 'rtl' }}>
                  {currentVerse.arabic}
                </p>
                {hafazanHidden.has(hafazanRevealLevel) && (
                  <p className="text-xs mt-2" style={{ color: 'rgba(204,204,204,0.3)' }}>Ketik untuk mendedahkan</p>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 py-3 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}
              onClick={() => {
                setHafazanHidden(prev => {
                  const next = new Set(prev)
                  if (next.has(hafazanRevealLevel)) next.delete(hafazanRevealLevel)
                  else next.add(hafazanRevealLevel)
                  return next
                })
              }}
            >
              {hafazanHidden.has(hafazanRevealLevel) ? 'Dedahkan' : 'Sembunyikan'}
            </button>
            <button
              className="flex-1 py-3 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.3)' }}
              onClick={() => {
                if (hafazanRevealLevel < verses.length - 1) {
                  setHafazanRevealLevel(hafazanRevealLevel + 1)
                } else {
                  setHafazanPhase('complete')
                  store.addXp(50)
                }
              }}
            >
              Seterusnya
            </button>
          </div>

          <div className="mt-4">
            <div className="text-xs font-medium mb-2" style={{ color: 'rgba(204,204,204,0.5)' }}>Kemajuan Ayat</div>
            <div className="flex flex-wrap gap-1">
              {verses.map((v, i) => {
                const hProgress = store.getHafazanVerse(selectedSurah, v.verseNumber)
                const level = hProgress?.level || 'new'
                const isCurrent = i === hafazanRevealLevel
                return (
                  <button
                    key={v.verseNumber}
                    className="h-7 w-7 rounded flex items-center justify-center text-[10px] font-bold transition-all"
                    style={{
                      background: isCurrent ? 'rgba(212,175,55,0.2)' : `${HAFAZAN_LEVEL_COLORS[level]}20`,
                      border: `1px solid ${isCurrent ? '#d4af37' : `${HAFAZAN_LEVEL_COLORS[level]}40`}`,
                      color: isCurrent ? '#d4af37' : HAFAZAN_LEVEL_COLORS[level],
                    }}
                    onClick={() => setHafazanRevealLevel(i)}
                  >
                    {v.verseNumber}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )
    }

    if (hafazanPhase === 'complete') {
      return (
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-lg font-bold" style={{ color: '#d4af37' }}>Masya Allah!</h3>
          <p className="text-sm mt-2" style={{ color: 'rgba(204,204,204,0.6)' }}>
            Anda telah menghafaz {surahInfo?.nameMs}
          </p>
          <p className="text-xs mt-1" style={{ color: '#4a4aa6' }}>+50 XP</p>
          <button
            className="mt-4 px-6 py-2 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.3)' }}
            onClick={() => { setHafazanPhase('select'); setView('list') }}
          >
            Kembali
          </button>
        </motion.div>
      )
    }

    return (
      <div>
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Baru', count: totalProgress - masteredCount - learningCount - reviewCount, color: '#6a6ab6' },
            { label: 'Belajar', count: learningCount, color: '#d4af37' },
            { label: 'Ulang', count: reviewCount, color: '#4a9eff' },
            { label: 'Kuasai', count: masteredCount, color: '#4aff7a' },
          ].map(stat => (
            <div key={stat.label} className="rounded-xl p-2.5 text-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
              <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.count}</div>
              <div className="text-[9px]" style={{ color: `${stat.color}99` }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {dailyReview.length > 0 && (
          <div className="mb-4 rounded-xl p-3" style={{ background: 'rgba(74,166,74,0.08)', border: '1px solid rgba(74,166,74,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-3.5 w-3.5" style={{ color: '#4aff7a' }} />
              <span className="text-xs font-semibold" style={{ color: '#4aff7a' }}>Cadangan Ulang Hari Ini ({dailyReview.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {dailyReview.slice(0, 8).map(v => {
                const surah = SURAH_LIST.find(s => s.id === v.surahId)
                return (
                  <button
                    key={`${v.surahId}-${v.verseNumber}`}
                    className="px-2 py-1 rounded text-[10px]"
                    style={{ background: 'rgba(74,166,74,0.1)', color: '#4aff7a' }}
                    onClick={() => { setSelectedSurah(v.surahId); setView('reader'); setHafazanPhase('practice'); setHafazanRevealLevel(0) }}
                  >
                    {surah?.nameMs}:{v.verseNumber}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {weakVerses.length > 0 && (
          <div className="mb-4 rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
              <span className="text-xs font-semibold" style={{ color: '#d4af37' }}>Ayat Lemah ({weakVerses.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {weakVerses.slice(0, 8).map(v => {
                const surah = SURAH_LIST.find(s => s.id === v.surahId)
                return (
                  <button
                    key={`${v.surahId}-${v.verseNumber}`}
                    className="px-2 py-1 rounded text-[10px]"
                    style={{ background: 'rgba(212,175,55,0.1)', color: '#d4af37' }}
                    onClick={() => { setSelectedSurah(v.surahId); setView('reader'); setHafazanPhase('practice'); setHafazanRevealLevel(0) }}
                  >
                    {surah?.nameMs}:{v.verseNumber}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <h3 className="text-xs font-semibold mb-2" style={{ color: '#4a4aa6' }}>Surah Pendek untuk Hafazan</h3>
        <div className="space-y-1.5">
          {hafazanSurahs.map(surah => {
            const surahProgress = store.hafazanProgress.filter(p => p.surahId === surah.id)
            const mastered = surahProgress.filter(p => p.level === 'mastered').length
            const progressPct = surah.versesCount > 0 ? Math.round((mastered / surah.versesCount) * 100) : 0

            return (
              <div
                key={surah.id}
                className="flex items-center justify-between rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
                style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.08)' }}
                onClick={() => {
                  setSelectedSurah(surah.id)
                  setHafazanPhase('practice')
                  setHafazanRevealLevel(0)
                  setView('reader')
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 flex items-center justify-center rounded-lg text-xs font-bold" style={{ background: progressPct >= 100 ? 'rgba(74,255,122,0.15)' : 'rgba(74,74,166,0.15)', color: progressPct >= 100 ? '#4aff7a' : '#4a4aa6' }}>
                    {surah.id}
                  </div>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#ffffff' }}>{surah.nameMs}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{surah.versesCount} ayat · {mastered}/{surah.versesCount} kuasai</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.15)' }}>
                    <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: progressPct >= 100 ? '#4aff7a' : 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} />
                  </div>
                  <span className="text-lg font-arabic" style={{ color: 'rgba(204,204,204,0.6)' }}>{surah.name}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── Render: Recite Mode ────────────────────────────────────
  const renderReciteView = () => {
    if (view === 'reader') {
      return (
        <div>
          <div className="flex items-center justify-between mb-3">
            <button className="flex items-center gap-1 text-sm" style={{ color: '#4a4aa6' }} onClick={goBack}>
              <ChevronLeft className="h-5 w-5" /> Mod Baca
            </button>
            <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>{surahInfo?.nameMs}</div>
            <div className="w-12" />
          </div>

          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {verses.map((v, i) => (
              <button
                key={v.verseNumber}
                className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: i === reciteVerseIdx ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                  border: `1px solid ${i === reciteVerseIdx ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.08)'}`,
                  color: i === reciteVerseIdx ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                }}
                onClick={() => { setReciteVerseIdx(i); setReciteResult(null) }}
              >
                {v.verseNumber}
              </button>
            ))}
          </div>

          {verses[reciteVerseIdx] && (
            <div className="rounded-xl p-5 mb-4 text-center" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.15)' }}>
              <div className="text-[10px] mb-2" style={{ color: 'rgba(204,204,204,0.4)' }}>Ayat {verses[reciteVerseIdx].verseNumber}</div>
              <p className="text-2xl font-arabic leading-[2.5]" style={{ color: '#ffffff', direction: 'rtl' }}>
                {verses[reciteVerseIdx].arabic}
              </p>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: 'rgba(204,204,204,0.5)' }}>
                {verses[reciteVerseIdx].translation}
              </p>
            </div>
          )}

          <div className="flex flex-col items-center mb-4">
            <motion.button
              className="relative h-24 w-24 rounded-full flex items-center justify-center"
              style={{
                background: isRecording
                  ? 'conic-gradient(#ff4a4a 100%, rgba(255,74,74,0.1) 100%)'
                  : 'conic-gradient(#4a4aa6 0%, rgba(74,74,166,0.08) 0%)',
              }}
              onClick={isRecording ? undefined : startRecording}
              whileTap={!isRecording ? { scale: 0.95 } : undefined}
              animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
              transition={isRecording ? { type: 'tween', duration: 1, repeat: Infinity } : {}}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ background: '#1a1a4a' }}>
                {isRecording ? (
                  <MicOff className="h-8 w-8" style={{ color: '#ff4a4a' }} />
                ) : (
                  <Mic className="h-8 w-8" style={{ color: '#4a4aa6' }} />
                )}
              </div>
            </motion.button>
            <span className="text-xs mt-2" style={{ color: isRecording ? '#ff4a4a' : 'rgba(204,204,204,0.5)' }}>
              {isRecording ? 'Mendengar...' : 'Ketik untuk mula baca'}
            </span>
          </div>

          {reciteTranscription && (
            <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
              <div className="text-[10px] mb-1" style={{ color: 'rgba(204,204,204,0.4)' }}>Transkripsi:</div>
              <div className="text-sm" style={{ color: '#ffffff' }}>{reciteTranscription}</div>
            </div>
          )}

          {reciteResult && (
            <motion.div
              className="rounded-xl p-4"
              style={{
                background: reciteResult.accuracy >= 70
                  ? 'rgba(74,166,74,0.08)'
                  : reciteResult.accuracy >= 40
                    ? 'rgba(212,175,55,0.08)'
                    : 'rgba(255,74,74,0.08)',
                border: `1px solid ${reciteResult.accuracy >= 70 ? 'rgba(74,166,74,0.2)' : reciteResult.accuracy >= 40 ? 'rgba(212,175,55,0.2)' : 'rgba(255,74,74,0.2)'}`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {reciteResult.accuracy >= 70 ? (
                    <CheckCircle2 className="h-5 w-5" style={{ color: '#4aff7a' }} />
                  ) : (
                    <AlertCircle className="h-5 w-5" style={{ color: reciteResult.accuracy >= 40 ? '#d4af37' : '#ff4a4a' }} />
                  )}
                  <span className="text-sm font-semibold" style={{
                    color: reciteResult.accuracy >= 70 ? '#4aff7a' : reciteResult.accuracy >= 40 ? '#d4af37' : '#ff4a4a'
                  }}>
                    {reciteResult.accuracy}% Ketepatan
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
                  <span className="text-xs font-bold" style={{ color: '#d4af37' }}>+{reciteResult.xpEarned} XP</span>
                </div>
              </div>

              <div className="text-right font-arabic leading-[2.5]" style={{ direction: 'rtl' }}>
                {reciteResult.expectedWords.map((word, i) => (
                  <span
                    key={i}
                    className="inline-block text-lg mx-0.5 px-1 rounded"
                    style={{
                      background: reciteResult.matchedWords[i]
                        ? 'rgba(74,255,122,0.15)'
                        : 'rgba(255,74,74,0.15)',
                      borderBottom: reciteResult.matchedWords[i]
                        ? '2px solid #4aff7a'
                        : '2px solid #ff4a4a',
                      color: reciteResult.matchedWords[i] ? '#ffffff' : 'rgba(204,204,204,0.5)',
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-3 text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded" style={{ background: '#4aff7a' }} /> Betul</span>
                <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded" style={{ background: '#ff4a4a' }} /> Terlepas</span>
                <span>{reciteResult.matchedWords.filter(Boolean).length}/{reciteResult.expectedWords.length} perkataan</span>
              </div>
            </motion.div>
          )}

          {reciteResult && (
            <div className="mt-3">
              {!audio.aiTajweedFeedback && !audio.isFetchingFeedback && (
                <button
                  className="w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"
                  style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.3)' }}
                  onClick={() => {
                    const verse = verses[reciteVerseIdx]
                    if (verse) audio.fetchAiTajweedFeedback(reciteTranscription || '(tiada transkripsi)', verse.arabic)
                  }}
                >
                  <Brain className="h-3.5 w-3.5" /> Minta Analisis Tajwid AI
                </button>
              )}
              {audio.isFetchingFeedback && (
                <div className="rounded-xl p-3 flex items-center justify-center gap-2" style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.15)' }}>
                  <Loader2 className="h-4 w-4 animate-spin" style={{ color: '#4a4aa6' }} />
                  <span className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Ustaz AI menganalisis tajwid...</span>
                </div>
              )}
              {audio.aiTajweedFeedback && (
                <motion.div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(74,74,166,0.08)', border: '1px solid rgba(74,74,166,0.2)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Brain className="h-4 w-4" style={{ color: '#d4af37' }} />
                    <span className="text-xs font-semibold" style={{ color: '#d4af37' }}>Analisis Tajwid Ustaz AI</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(204,204,204,0.7)' }}>{audio.aiTajweedFeedback}</p>
                </motion.div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs"
              style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: reciteVerseIdx > 0 ? '#4a4aa6' : 'rgba(204,204,204,0.2)' }}
              disabled={reciteVerseIdx <= 0}
              onClick={() => { setReciteVerseIdx(Math.max(0, reciteVerseIdx - 1)); setReciteResult(null) }}
            >
              <ChevronLeft className="h-4 w-4" /> Sebelum
            </button>
            <button
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs"
              style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.3)', color: '#4a4aa6' }}
              disabled={reciteVerseIdx >= verses.length - 1}
              onClick={() => { setReciteVerseIdx(Math.min(verses.length - 1, reciteVerseIdx + 1)); setReciteResult(null) }}
            >
              Seterusnya <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="rounded-xl p-4 mb-3 text-center" style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.2)' }}>
          <Mic className="h-10 w-10 mx-auto mb-2" style={{ color: '#4a4aa6' }} />
          <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Mod Baca (Recite)</h3>
          <p className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
            Baca ayat dengan suara dan dapatkan semakan ketepatan serta-merta
          </p>
        </div>

        <h3 className="text-xs font-semibold mb-2" style={{ color: '#4a4aa6' }}>Pilih Surah untuk Baca</h3>
        <div className="space-y-1.5">
          {SURAH_LIST.filter(s => s.versesCount <= 30).slice(0, 20).map(surah => (
            <div
              key={surah.id}
              className="flex items-center justify-between rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
              style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.08)' }}
              onClick={() => {
                setSelectedSurah(surah.id)
                setView('reader')
                setReciteVerseIdx(0)
                setReciteResult(null)
              }}
            >
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 flex items-center justify-center rounded-lg text-xs font-bold" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>{surah.id}</div>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#ffffff' }}>{surah.nameMs}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{surah.versesCount} ayat</div>
                </div>
              </div>
              <span className="text-lg font-arabic" style={{ color: 'rgba(204,204,204,0.6)' }}>{surah.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ─── Main Render ────────────────────────────────────────────
  return (
    <div className="flex flex-1 flex-col overflow-hidden px-4 pt-2">
      <QuranHeader
        readingMode={readingMode}
        setReadingMode={setReadingMode}
        setView={setView}
        searchQuery={search.searchQuery}
        setSearchQuery={search.setSearchQuery}
        showSearch={search.showSearch}
        setShowSearch={search.setShowSearch}
        filter={search.filter}
        setFilter={search.setFilter}
        dailyGoal={dailyGoal}
        setDailyGoal={setDailyGoal}
        dailyGoalProgress={dailyGoalProgress}
        pagesReadToday={pagesReadToday}
        versesRead={bookmarksWithVerses.versesRead}
        totalQuranVerses={bookmarksWithVerses.totalQuranVerses}
        khatamJuzCount={bookmarksWithVerses.khatamJuzCount}
        streak={store.streak}
        showStatsBar={readingMode === 'surah' && view === 'list'}
      />

      <div className="qp-scroll flex-1 overflow-y-auto pb-4">
        {readingMode === 'surah' && view === 'list' && (
          <>
            <QuranSearchResults
              showSearch={search.showSearch}
              setShowSearch={search.setShowSearch}
              searchResults={search.searchResults}
              isSearching={search.isSearching}
              openSurah={openSurah}
              setSearchQuery={search.setSearchQuery}
            />
            <QuranSurahList
              filteredSurahs={search.filteredSurahs}
              openSurah={openSurah}
              isSurahBookmarked={(id: number) => store.isSurahBookmarked(id)}
              toggleSurahBookmark={(id: number) => store.toggleSurahBookmark(id)}
            />
          </>
        )}

        {readingMode === 'surah' && view === 'reader' && (
          <QuranVerseView
            selectedSurah={selectedSurah}
            surahInfo={surahInfo}
            verses={verses}
            isLoadingVerses={isLoadingVerses}
            verseError={verseError}
            fetchSurahFromApi={fetchSurahFromApi}
            showTranslation={showTranslation}
            setShowTranslation={setShowTranslation}
            showEnTranslation={showEnTranslation}
            setShowEnTranslation={setShowEnTranslation}
            showTajwid={showTajwid}
            setShowTajwid={setShowTajwid}
            showWordByWord={showWordByWord}
            setShowWordByWord={setShowWordByWord}
            selectedWord={selectedWord}
            setSelectedWord={setSelectedWord}
            isPlaying={audio.isPlaying}
            currentPlayingAyah={audio.currentPlayingAyah}
            isAudioLoading={audio.isAudioLoading}
            audioError={audio.audioError}
            togglePlay={audio.togglePlay}
            nextAyah={audio.nextAyah}
            reciter={audio.reciter}
            setReciter={audio.setReciter}
            playbackSpeed={audio.playbackSpeed}
            setPlaybackSpeed={audio.setPlaybackSpeed}
            repeatMode={audio.repeatMode}
            setRepeatMode={audio.setRepeatMode}
            showAudioSettings={audio.showAudioSettings}
            setShowAudioSettings={audio.setShowAudioSettings}
            isVoiceFollowing={audio.isVoiceFollowing}
            voiceFollowAyah={audio.voiceFollowAyah}
            startVoiceFollowing={audio.startVoiceFollowing}
            stopVoiceFollowing={audio.stopVoiceFollowing}
            currentWordIndex={audio.currentWordIndex}
            goBack={goBack}
            navigateSurah={navigateSurah}
            ayahRefs={ayahRefs}
            readerScrollRef={readerScrollRef}
            hijriDate={hijriDate}
            readingHistory={readingHistory}
            openSurah={openSurah}
            getJuzProgress={bookmarksWithVerses.getJuzProgress}
          />
        )}

        {readingMode === 'juz' && renderJuzView()}
        {readingMode === 'bookmarks' && renderBookmarksView()}
        {readingMode === 'hafazan' && renderHafazanView()}
        {readingMode === 'recite' && renderReciteView()}

        {readingMode === 'mushaf' && (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-3">
              <button className="p-2 rounded-lg" style={{ background: 'rgba(42,42,106,0.5)' }} onClick={() => setMushafPage(Math.max(1, mushafPage - 1))}>
                <ChevronLeft className="h-5 w-5" style={{ color: '#4a4aa6' }} />
              </button>
              <div className="text-center">
                <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>Muka {mushafPage}</div>
              </div>
              <button className="p-2 rounded-lg" style={{ background: 'rgba(42,42,106,0.5)' }} onClick={() => setMushafPage(Math.min(604, mushafPage + 1))}>
                <ChevronRight className="h-5 w-5" style={{ color: '#4a4aa6' }} />
              </button>
            </div>
            <div
              className="w-full rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center"
              style={{ background: 'linear-gradient(180deg, rgba(42,42,106,0.3), rgba(42,42,106,0.15))', border: '1px solid rgba(74,74,166,0.15)' }}
            >
              <p className="text-2xl font-arabic leading-[2.5]" style={{ color: '#ffffff', direction: 'rtl' }}>
                ۞ Muka {mushafPage} / 604 ۞
              </p>
              <p className="text-sm mt-4" style={{ color: 'rgba(204,204,204,0.6)' }}>
                Paparan mushaf penuh memerlukan data tambahan
              </p>
            </div>
            <div className="w-full mt-3">
              <input
                type="range"
                min={1}
                max={604}
                value={mushafPage}
                onChange={e => setMushafPage(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, #4a4aa6 ${(mushafPage / 604) * 100}%, rgba(42,42,106,0.3) ${(mushafPage / 604) * 100}%)` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
