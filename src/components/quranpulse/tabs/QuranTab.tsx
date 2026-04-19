'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, BookOpen, Bookmark, ChevronLeft, ChevronRight, Share2, X,
  Play, Pause, SkipBack, SkipForward, Mic, Settings, Eye, EyeOff,
  BookMarked, Loader2, Volume2, Clock, Star, Trophy, ChevronDown,
  Repeat, RotateCcw, Grip, List, Grid3X3, Library, Brain,
  MessageCircle, CheckCircle2, Circle, Sparkles
} from 'lucide-react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { SURAH_LIST, getSurahVerses, getSurahName, type SurahInfo } from '@/lib/quran-data'

// ─── Types ────────────────────────────────────────────────────
type ReadingMode = 'surah' | 'mushaf' | 'juz' | 'bookmarks' | 'hafazan'
type Reciter = 'ar.alafasy' | 'ar.abdurrahmaansudais' | 'ar.saaborimuneer' | 'ar.hudhaify'
type RepeatMode = 'none' | 'single' | 'surah' | 'continuous'
type FilterType = 'all' | 'meccan' | 'medinan'
type HafazanPhase = 'select' | 'reveal' | 'practice' | 'complete'

interface VerseData {
  verseNumber: number
  arabic: string
  translation: string
  translationEn?: string
}

interface SearchResult {
  type: 'surah' | 'verse'
  surahId: number
  surahName: string
  surahNameMs: string
  verseNumber?: number
  text?: string
  highlight?: string
}

// ─── Constants ────────────────────────────────────────────────
const RECITERS: { id: Reciter; name: string; nameMs: string }[] = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy', nameMs: 'Mishary' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahman Sudais', nameMs: 'Sudais' },
  { id: 'ar.saaborimuneer', name: 'Saabor Imuneer', nameMs: 'Saabor' },
  { id: 'ar.hudhaify', name: 'Ali Hudhaify', nameMs: 'Hudhaify' },
]

const SAJDA_AYAHS: Record<number, { ayahs: number[]; types: Record<number, 'sunnah' | 'wajib'> }> = {
  7: { ayahs: [206], types: { 206: 'sunnah' } },
  13: { ayahs: [15], types: { 15: 'sunnah' } },
  16: { ayahs: [50], types: { 50: 'sunnah' } },
  17: { ayahs: [109], types: { 109: 'sunnah' } },
  19: { ayahs: [58], types: { 58: 'sunnah' } },
  22: { ayahs: [18, 77], types: { 18: 'sunnah', 77: 'sunnah' } },
  25: { ayahs: [60], types: { 60: 'sunnah' } },
  27: { ayahs: [26], types: { 26: 'sunnah' } },
  32: { ayahs: [15], types: { 15: 'wajib' } },
  38: { ayahs: [24], types: { 24: 'wajib' } },
  41: { ayahs: [38], types: { 38: 'wajib' } },
  53: { ayahs: [62], types: { 62: 'wajib' } },
  84: { ayahs: [21], types: { 21: 'wajib' } },
  96: { ayahs: [19], types: { 19: 'wajib' } },
}

const TAJWID_COLORS: Record<string, string> = {
  idgham: '#4a9eff',
  ikhfa: '#4aff7a',
  iqlab: '#ff9a4a',
  izhar: '#ff4a4a',
  qalqalah: '#b44aff',
  mad: '#ffe04a',
}

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]

// ─── Main Component ───────────────────────────────────────────
export function QuranTab() {
  // Core state
  const [readingMode, setReadingMode] = useState<ReadingMode>('surah')
  const [view, setView] = useState<'list' | 'reader'>('list')
  const [selectedSurah, setSelectedSurah] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  // Mushaf state
  const [mushafPage, setMushafPage] = useState(1)

  // Juz state
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null)

  // Reader state
  const [showTranslation, setShowTranslation] = useState(true)
  const [showEnTranslation, setShowEnTranslation] = useState(false)
  const [showTajwid, setShowTajwid] = useState(false)
  const [tafsirVerse, setTafsirVerse] = useState<number | null>(null)

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null)
  const [reciter, setReciter] = useState<Reciter>('ar.alafasy')
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none')
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Search state
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  // Hafazan state
  const [hafazanPhase, setHafazanPhase] = useState<HafazanPhase>('select')
  const [hafazanSurah, setHafazanSurah] = useState(1)
  const [hafazanStart, setHafazanStart] = useState(1)
  const [hafazanEnd, setHafazanEnd] = useState(7)
  const [hafazanRevealLevel, setHafazanRevealLevel] = useState(0)
  const [hafazanHidden, setHafazanHidden] = useState<Set<number>>(new Set())

  // Reading stats
  const [pagesReadToday, setPagesReadToday] = useState(0)
  const [khatamProgress, setKhatamProgress] = useState(0)

  // Refs
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const readerScrollRef = useRef<HTMLDivElement>(null)

  const store = useQuranPulseStore()

  // ─── Computed ───────────────────────────────────────────────
  const filteredSurahs = useMemo(() => {
    let list = SURAH_LIST
    if (filter === 'meccan') list = list.filter(s => s.revelationType === 'Meccan')
    if (filter === 'medinan') list = list.filter(s => s.revelationType === 'Medinan')
    if (searchQuery && !showSearch) {
      const q = searchQuery.toLowerCase()
      list = list.filter(s =>
        s.name.includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.nameMs.toLowerCase().includes(q) ||
        s.id.toString() === q
      )
    }
    return list
  }, [filter, searchQuery, showSearch])

  const verses: VerseData[] = useMemo(() => {
    const raw = getSurahVerses(selectedSurah)
    return raw.map(v => ({ ...v, translationEn: v.translation }))
  }, [selectedSurah])

  const surahInfo = getSurahName(selectedSurah)

  const totalQuranVerses = 6236
  const versesRead = useMemo(() => {
    return SURAH_LIST.slice(0, selectedSurah - 1).reduce((acc, s) => acc + s.versesCount, 0)
  }, [selectedSurah])

  // ─── Handlers ───────────────────────────────────────────────
  const openSurah = useCallback((id: number) => {
    setSelectedSurah(id)
    setView('reader')
    store.setLastRead(id, 1)
    store.addXp(5)
    setPagesReadToday(p => p + 1)
  }, [store])

  const goBack = useCallback(() => {
    setView('list')
    setIsPlaying(false)
    setCurrentPlayingAyah(null)
  }, [])

  const navigateSurah = useCallback((direction: -1 | 1) => {
    const next = selectedSurah + direction
    if (next >= 1 && next <= 114) {
      setSelectedSurah(next)
      store.setLastRead(next, 1)
      setTafsirVerse(null)
      readerScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedSurah, store])

  const togglePlay = useCallback((ayah?: number) => {
    if (isPlaying) {
      setIsPlaying(false)
      setCurrentPlayingAyah(null)
    } else {
      setIsPlaying(true)
      setCurrentPlayingAyah(ayah || 1)
      store.addXp(2)
    }
  }, [isPlaying, store])

  const nextAyah = useCallback(() => {
    if (!currentPlayingAyah) return
    const surah = SURAH_LIST.find(s => s.id === selectedSurah)
    if (!surah) return
    if (currentPlayingAyah < surah.versesCount) {
      setCurrentPlayingAyah(currentPlayingAyah + 1)
    } else if (repeatMode === 'surah' || repeatMode === 'continuous') {
      setCurrentPlayingAyah(1)
    } else {
      setIsPlaying(false)
      setCurrentPlayingAyah(null)
    }
  }, [currentPlayingAyah, selectedSurah, repeatMode])

  const prevAyah = useCallback(() => {
    if (!currentPlayingAyah) return
    setCurrentPlayingAyah(Math.max(1, currentPlayingAyah - 1))
  }, [currentPlayingAyah])

  // Auto-scroll to playing ayah
  useEffect(() => {
    if (currentPlayingAyah && ayahRefs.current[currentPlayingAyah]) {
      ayahRefs.current[currentPlayingAyah]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentPlayingAyah])

  // Simulate audio advancement
  useEffect(() => {
    if (!isPlaying || !currentPlayingAyah) return
    const timer = setTimeout(nextAyah, 4000 / playbackSpeed)
    return () => clearTimeout(timer)
  }, [isPlaying, currentPlayingAyah, playbackSpeed, nextAyah])

  // Search handler
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || searchQuery.length < 2) return
    setIsSearching(true)
    try {
      const res = await fetch(`/api/quran/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      if (data.success) {
        setSearchResults(data.results)
      }
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery])

  useEffect(() => {
    if (showSearch && searchQuery.length >= 2) {
      const timer = setTimeout(handleSearch, 500)
      return () => clearTimeout(timer)
    }
  }, [showSearch, searchQuery, handleSearch])

  // ─── Reading Mode Tabs ──────────────────────────────────────
  const modeTabs: { key: ReadingMode; label: string; icon: React.ReactNode }[] = [
    { key: 'surah', label: 'Surah', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { key: 'mushaf', label: 'Mushaf', icon: <List className="h-3.5 w-3.5" /> },
    { key: 'juz', label: 'Juz', icon: <Grid3X3 className="h-3.5 w-3.5" /> },
    { key: 'bookmarks', label: 'Tanda', icon: <Bookmark className="h-3.5 w-3.5" /> },
    { key: 'hafazan', label: 'Hafazan', icon: <Brain className="h-3.5 w-3.5" /> },
  ]

  // ─── Render: Mode Tabs ──────────────────────────────────────
  const renderModeTabs = () => (
    <div className="flex gap-1 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {modeTabs.map(tab => (
        <button
          key={tab.key}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
          style={{
            background: readingMode === tab.key ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
            color: readingMode === tab.key ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
            border: `1px solid ${readingMode === tab.key ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
          }}
          onClick={() => { setReadingMode(tab.key); setView('list') }}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  )

  // ─── Render: Reading Stats Bar ──────────────────────────────
  const renderStatsBar = () => (
    <div className="flex gap-2 mb-3">
      <div className="flex-1 rounded-xl p-2.5" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <Trophy className="h-3 w-3" style={{ color: '#d4af37' }} />
          <span className="text-[10px] font-medium" style={{ color: '#d4af37' }}>Khatam</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.15)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((versesRead / totalQuranVerses) * 100)}%`, background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} />
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>{Math.round((versesRead / totalQuranVerses) * 100)}%</div>
      </div>
      <div className="flex-1 rounded-xl p-2.5" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <Star className="h-3 w-3" style={{ color: '#6a6ab6' }} />
          <span className="text-[10px] font-medium" style={{ color: '#6a6ab6' }}>Hari Ini</span>
        </div>
        <div className="text-sm font-bold" style={{ color: '#ffffff' }}>{pagesReadToday}</div>
        <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>muka dibaca</div>
      </div>
      <div className="flex-1 rounded-xl p-2.5" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <Clock className="h-3 w-3" style={{ color: '#4a4aa6' }} />
          <span className="text-[10px] font-medium" style={{ color: '#4a4aa6' }}>Streak</span>
        </div>
        <div className="text-sm font-bold" style={{ color: '#ffffff' }}>{store.streak}🔥</div>
        <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>hari berturut</div>
      </div>
    </div>
  )

  // ─── Render: Search Bar ─────────────────────────────────────
  const renderSearchBar = () => (
    <div className="relative mb-3">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(204,204,204,0.3)' }} />
      <input
        type="text"
        placeholder="Cari ayat, surah, terjemahan..."
        value={searchQuery}
        onChange={e => { setSearchQuery(e.target.value); if (e.target.value.length >= 2) setShowSearch(true) }}
        onFocus={() => { if (searchQuery.length >= 2) setShowSearch(true) }}
        className="w-full rounded-xl pl-9 pr-16 py-2.5 text-sm outline-none"
        style={{
          background: 'rgba(42, 42, 106, 0.5)',
          border: '1px solid rgba(74,74,166,0.15)',
          color: '#ffffff',
        }}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <button
          className="p-1.5 rounded-lg"
          style={{ background: 'rgba(74,74,166,0.15)' }}
          onClick={async () => {
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
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
                    if (data.success && data.text) setSearchQuery(data.text)
                  } catch { /* ignore */ }
                }
                reader.readAsDataURL(blob)
                stream.getTracks().forEach(t => t.stop())
              }
              mediaRecorder.start()
              setTimeout(() => mediaRecorder.stop(), 5000)
            } catch { /* mic not available */ }
          }}
        >
          <Mic className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
        </button>
        {searchQuery && (
          <button onClick={() => { setSearchQuery(''); setShowSearch(false) }}>
            <X className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.3)' }} />
          </button>
        )}
      </div>
    </div>
  )

  // ─── Render: Search Results ─────────────────────────────────
  const renderSearchResults = () => {
    if (!showSearch) return null
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-3 rounded-xl overflow-hidden"
        style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)' }}
      >
        <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(74,74,166,0.1)' }}>
          <span className="text-xs font-medium" style={{ color: '#4a4aa6' }}>
            {isSearching ? 'Mencari...' : `${searchResults.length} keputusan`}
          </span>
          <button onClick={() => setShowSearch(false)}>
            <X className="h-3.5 w-3.5" style={{ color: 'rgba(204,204,204,0.4)' }} />
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto qp-scroll">
          {isSearching ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#4a4aa6' }} />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>Tiada keputusan ditemui</p>
            </div>
          ) : (
            searchResults.map((result, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2.5 flex items-start gap-2 transition-colors"
                style={{ borderBottom: '1px solid rgba(74,74,106,0.08)' }}
                onClick={() => {
                  openSurah(result.surahId)
                  setShowSearch(false)
                  setSearchQuery('')
                }}
              >
                <div className="flex-shrink-0 h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold mt-0.5" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>
                  {result.type === 'surah' ? result.surahId : result.verseNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium" style={{ color: '#ffffff' }}>{result.surahNameMs}</div>
                  <p className="text-[11px] line-clamp-2 mt-0.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{result.text}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    )
  }

  // ─── Render: Surah List ─────────────────────────────────────
  const renderSurahList = () => (
    <div className="space-y-1.5">
      {filteredSurahs.map((surah, i) => (
        <motion.div
          key={surah.id}
          className="flex items-center justify-between rounded-xl p-3 cursor-pointer transition-transform active:scale-[0.98]"
          style={{ background: 'rgba(42, 42, 106, 0.4)', border: '1px solid rgba(74, 74, 166, 0.08)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: Math.min(i * 0.015, 0.4) }}
          onClick={() => openSurah(surah.id)}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>
              {surah.id}
            </div>
            <div>
              <div className="text-sm font-medium" style={{ color: '#ffffff' }}>{surah.nameMs}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>{surah.versesCount} ayat</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                  background: surah.revelationType === 'Meccan' ? 'rgba(212,175,55,0.15)' : 'rgba(106,106,182,0.15)',
                  color: surah.revelationType === 'Meccan' ? '#d4af37' : '#6a6ab6',
                }}>
                  {surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyyah'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-arabic" style={{ color: 'rgba(204,204,204,0.6)' }}>{surah.name}</span>
            <button className="p-1 rounded" onClick={(e) => { e.stopPropagation(); store.toggleSurahBookmark(surah.id) }}>
              <Bookmark className="h-4 w-4" style={{ color: store.isSurahBookmarked(surah.id) ? '#d4af37' : 'rgba(204,204,204,0.2)' }} fill={store.isSurahBookmarked(surah.id) ? '#d4af37' : 'none'} />
            </button>
          </div>
        </motion.div>
      ))}
      {filteredSurahs.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: 'rgba(204,204,204,0.4)' }}>Tiada surah ditemui</p>
        </div>
      )}
    </div>
  )

  // ─── Render: Surah Reader ───────────────────────────────────
  const renderSurahReader = () => {
    const sajdaData = SAJDA_AYAHS[selectedSurah]
    return (
      <>
        {/* Reader Header */}
        <div className="flex items-center justify-between mb-3">
          <button className="flex items-center gap-1 text-sm" style={{ color: '#4a4aa6' }} onClick={goBack}>
            <ChevronLeft className="h-5 w-5" /> Kembali
          </button>
          <div className="text-center">
            <div className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Surah {selectedSurah}</div>
            <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>{surahInfo?.nameMs}</div>
          </div>
          <div className="flex gap-1">
            <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => setShowTajwid(!showTajwid)}>
              <Sparkles className="h-4 w-4" style={{ color: showTajwid ? '#d4af37' : '#4a4aa6' }} />
            </button>
            <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => setShowTranslation(!showTranslation)}>
              {showTranslation ? <EyeOff className="h-4 w-4" style={{ color: '#4a4aa6' }} /> : <Eye className="h-4 w-4" style={{ color: '#4a4aa6' }} />}
            </button>
            <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => store.toggleSurahBookmark(selectedSurah)}>
              <Bookmark className="h-4 w-4" style={{ color: store.isSurahBookmarked(selectedSurah) ? '#d4af37' : '#4a4aa6' }} fill={store.isSurahBookmarked(selectedSurah) ? '#d4af37' : 'none'} />
            </button>
          </div>
        </div>

        {/* Surah Info Banner */}
        <div className="rounded-xl p-4 mb-3 text-center" style={{ background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(212,175,55,0.1))', border: '1px solid rgba(74,74,166,0.2)' }}>
          <div className="text-3xl font-arabic mb-1" style={{ color: '#ffffff' }}>{surahInfo?.name}</div>
          <div className="text-sm" style={{ color: 'rgba(204,204,204,0.7)' }}>
            {surahInfo?.nameEn} · {surahInfo?.versesCount} Ayat · {surahInfo?.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyyah'} · Juz {surahInfo?.juz.join(', ')}
          </div>
        </div>

        {/* Bismillah */}
        {selectedSurah !== 9 && selectedSurah !== 1 && (
          <div className="text-center mb-3 py-3">
            <p className="text-2xl font-arabic" style={{ color: '#d4af37', direction: 'rtl' }}>
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
          </div>
        )}

        {/* Tajwid Legend */}
        {showTajwid && (
          <div className="flex flex-wrap gap-2 mb-3 p-2 rounded-lg" style={{ background: 'rgba(42,42,106,0.4)' }}>
            {Object.entries(TAJWID_COLORS).map(([rule, color]) => (
              <div key={rule} className="flex items-center gap-1">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                <span className="text-[10px] capitalize" style={{ color: 'rgba(204,204,204,0.6)' }}>{rule}</span>
              </div>
            ))}
          </div>
        )}

        {/* Verses */}
        {verses.length > 0 ? (
          <div className="space-y-3">
            {verses.map((verse) => {
              const isPlayingAyah = currentPlayingAyah === verse.verseNumber
              const isSajda = sajdaData?.ayahs.includes(verse.verseNumber)
              const sajdaType = sajdaData?.types[verse.verseNumber]
              const isBookmarked = store.isVerseBookmarked(selectedSurah, verse.verseNumber)

              return (
                <motion.div
                  key={verse.verseNumber}
                  ref={el => { ayahRefs.current[verse.verseNumber] = el }}
                  className="rounded-xl p-4 transition-all"
                  style={{
                    background: isPlayingAyah ? 'rgba(74,74,166,0.2)' : 'rgba(42, 42, 106, 0.3)',
                    border: `1px solid ${isPlayingAyah ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.08)'}`,
                    boxShadow: isPlayingAyah ? '0 0 15px rgba(74,74,166,0.15)' : 'none',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(verse.verseNumber * 0.02, 0.5) }}
                >
                  <div className="flex items-start gap-3">
                    {/* Verse number badge */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
                        {verse.verseNumber}
                      </div>
                      {isSajda && (
                        <div className="flex flex-col items-center" title={`Sajda ${sajdaType}`}>
                          <span className="text-sm">🕌</span>
                          <span className="text-[8px]" style={{ color: sajdaType === 'wajib' ? '#ff4a4a' : '#4aff7a' }}>
                            {sajdaType === 'wajib' ? 'Wajib' : 'Sunnah'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      {/* Arabic text */}
                      <p className="text-right text-xl leading-[2.2] font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>
                        {verse.arabic}
                      </p>

                      {/* Malay translation */}
                      {showTranslation && (
                        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(204,204,204,0.6)' }}>
                          {verse.translation}
                        </p>
                      )}

                      {/* English translation */}
                      {showEnTranslation && verse.translationEn && (
                        <p className="mt-1 text-xs leading-relaxed italic" style={{ color: 'rgba(204,204,204,0.4)' }}>
                          {verse.translationEn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg text-xs flex items-center gap-1" style={{ background: 'rgba(74,74,166,0.1)' }} onClick={() => togglePlay(verse.verseNumber)}>
                        {isPlayingAyah ? <Pause className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} /> : <Play className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />}
                        <span className="text-[10px]" style={{ color: '#4a4aa6' }}>Dengar</span>
                      </button>
                      <button className="p-1.5 rounded-lg text-xs" style={{ background: 'rgba(212,175,55,0.1)' }} onClick={() => setTafsirVerse(verse.verseNumber)}>
                        <MessageCircle className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
                      </button>
                      <button className="p-1.5 rounded-lg" style={{ background: isBookmarked ? 'rgba(212,175,55,0.15)' : 'rgba(74,74,166,0.1)' }} onClick={() => store.toggleVerseBookmark(selectedSurah, verse.verseNumber)}>
                        <Bookmark className="h-3.5 w-3.5" style={{ color: isBookmarked ? '#d4af37' : '#4a4aa6' }} fill={isBookmarked ? '#d4af37' : 'none'} />
                      </button>
                      <button className="p-1.5 rounded-lg" style={{ background: 'rgba(74,74,166,0.1)' }}>
                        <Share2 className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
                      </button>
                    </div>
                    <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.3)' }}>
                      Juz {surahInfo?.juz[0] || '?'}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-3" style={{ color: 'rgba(74,74,166,0.3)' }} />
            <p className="text-sm" style={{ color: 'rgba(204,204,204,0.5)' }}>
              Ayat-ayat {surahInfo?.nameMs} akan dimuat turun...
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.3)' }}>
              {surahInfo?.versesCount} ayat · Juz {surahInfo?.juz.join(', ')}
            </p>
          </div>
        )}

        {/* Surah Navigation */}
        <div className="flex justify-between mt-4">
          <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs" style={{
            background: 'rgba(42,42,106,0.5)',
            border: '1px solid rgba(74,74,166,0.15)',
            color: selectedSurah > 1 ? '#4a4aa6' : 'rgba(204,204,204,0.2)',
          }} disabled={selectedSurah <= 1} onClick={() => navigateSurah(-1)}>
            <ChevronLeft className="h-4 w-4" /> Sebelum
          </button>
          <button className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs" style={{
            background: 'rgba(74,74,166,0.15)',
            border: '1px solid rgba(74,74,166,0.3)',
            color: '#4a4aa6',
          }} disabled={selectedSurah >= 114} onClick={() => navigateSurah(1)}>
            Seterusnya <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </>
    )
  }

  // ─── Render: Mushaf Page View ───────────────────────────────
  const renderMushafView = () => {
    const mushafPageInfo = useMemo(() => {
      const page = mushafPage
      const surah = SURAH_LIST.find(s => {
        const startPage = Math.floor(((s.id - 1) / 114) * 604) + 1
        const endPage = startPage + Math.ceil(s.versesCount / 15)
        return page >= startPage && page <= endPage
      })
      const juz = Math.ceil(page / 20.13)
      const hizb = Math.ceil(page / 10.07)
      return { surah: surah?.nameMs || '', juz, hizb }
    }, [mushafPage])

    return (
      <div className="flex flex-col items-center">
        {/* Page navigation */}
        <div className="flex items-center justify-between w-full mb-3">
          <button className="p-2 rounded-lg" style={{ background: 'rgba(42,42,106,0.5)' }} onClick={() => setMushafPage(Math.max(1, mushafPage - 1))}>
            <ChevronLeft className="h-5 w-5" style={{ color: '#4a4aa6' }} />
          </button>
          <div className="text-center">
            <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>Muka {mushafPage}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
              {mushafPageInfo.surah} · Juz {mushafPageInfo.juz} · Hizb {mushafPageInfo.hizb}
            </div>
          </div>
          <button className="p-2 rounded-lg" style={{ background: 'rgba(42,42,106,0.5)' }} onClick={() => setMushafPage(Math.min(604, mushafPage + 1))}>
            <ChevronRight className="h-5 w-5" style={{ color: '#4a4aa6' }} />
          </button>
        </div>

        {/* Page display */}
        <div
          className="w-full rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(180deg, rgba(42,42,106,0.3), rgba(42,42,106,0.15))',
            border: '1px solid rgba(74,74,166,0.15)',
          }}
          onTouchStart={e => {
            const touch = e.touches[0]
            const startX = touch.clientX
            const el = e.currentTarget
            const handler = (ev: TouchEvent) => {
              const endX = ev.changedTouches[0].clientX
              const diff = startX - endX
              if (Math.abs(diff) > 50) {
                if (diff > 0) setMushafPage(Math.min(604, mushafPage + 1))
                else setMushafPage(Math.max(1, mushafPage - 1))
              }
              el.removeEventListener('touchend', handler)
            }
            el.addEventListener('touchend', handler)
          }}
        >
          <div className="text-center mb-4">
            <p className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-arabic leading-[2.5]" style={{ color: '#ffffff', direction: 'rtl' }}>
              ۞ Muka {mushafPage} / 604 ۞
            </p>
            <p className="text-sm mt-4 font-arabic" style={{ color: 'rgba(204,204,204,0.6)', direction: 'rtl' }}>
              Paparan mushaf penuh memerlukan data tambahan
            </p>
          </div>
        </div>

        {/* Page slider */}
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
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Muka 1</span>
            <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Muka 604</span>
          </div>
        </div>
      </div>
    )
  }

  // ─── Render: Juz View ──────────────────────────────────────
  const renderJuzView = () => {
    const juzSurahs = useMemo(() => {
      if (selectedJuz === null) return null
      return SURAH_LIST.filter(s => s.juz.includes(selectedJuz))
    }, [selectedJuz])

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
                <div className="h-full rounded-full" style={{ width: `${Math.random() * 80 + 20}%`, background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} />
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
        {/* Bookmarked Surahs */}
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

        {/* Bookmarked Verses */}
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
                    key={`${bv.surahId}-${bv.verseNumber}-${i}`}
                    className="flex items-center justify-between rounded-xl p-3 cursor-pointer active:scale-[0.98] transition-transform"
                    style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.08)' }}
                    onClick={() => { setSelectedSurah(bv.surahId); setReadingMode('surah'); setView('reader') }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>
                        {bv.verseNumber}
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: '#ffffff' }}>{surah?.nameMs}</div>
                        <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Ayat {bv.verseNumber}</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); store.toggleVerseBookmark(bv.surahId, bv.verseNumber) }}>
                      <X className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.4)' }} />
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

  // ─── Render: Hafazan Mode ──────────────────────────────────
  const renderHafazanView = () => {
    const hafazanVerses = getSurahVerses(hafazanSurah)
    const surah = SURAH_LIST.find(s => s.id === hafazanSurah)
    const selectedVerses = hafazanVerses.filter(v => v.verseNumber >= hafazanStart && v.verseNumber <= hafazanEnd)

    const getRevealedText = (text: string, level: number) => {
      if (level === 0) return text
      const words = text.split(' ')
      const visibleCount = Math.max(0, words.length - level * 2)
      if (visibleCount <= 0) return '▓'.repeat(words.length)
      return words.slice(0, visibleCount).join(' ') + ' ' + '▓'.repeat(words.length - visibleCount)
    }

    if (hafazanPhase === 'select') {
      return (
        <div>
          <div className="rounded-xl p-4 mb-3" style={{ background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(212,175,55,0.1))', border: '1px solid rgba(74,74,166,0.2)' }}>
            <h3 className="text-sm font-semibold mb-1 flex items-center gap-2" style={{ color: '#ffffff' }}>
              <Brain className="h-4 w-4" style={{ color: '#d4af37' }} /> Mod Hafazan
            </h3>
            <p className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Pilih surah dan julat ayat untuk dihafaz</p>
          </div>

          {/* Surah selector */}
          <div className="mb-3">
            <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(204,204,204,0.6)' }}>Surah</label>
            <select
              value={hafazanSurah}
              onChange={e => { setHafazanSurah(parseInt(e.target.value)); setHafazanStart(1); setHafazanEnd(Math.min(7, SURAH_LIST.find(s => s.id === parseInt(e.target.value))?.versesCount || 7)) }}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }}
            >
              {SURAH_LIST.map(s => (
                <option key={s.id} value={s.id} style={{ background: '#2a2a6a' }}>{s.id}. {s.nameMs} ({s.versesCount} ayat)</option>
              ))}
            </select>
          </div>

          {/* Verse range */}
          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(204,204,204,0.6)' }}>Dari Ayat</label>
              <input
                type="number"
                min={1}
                value={hafazanStart}
                onChange={e => setHafazanStart(parseInt(e.target.value) || 1)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium mb-1 block" style={{ color: 'rgba(204,204,204,0.6)' }}>Hingga Ayat</label>
              <input
                type="number"
                min={hafazanStart}
                max={surah?.versesCount}
                value={hafazanEnd}
                onChange={e => setHafazanEnd(parseInt(e.target.value) || hafazanStart)}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.15)', color: '#ffffff' }}
              />
            </div>
          </div>

          <button
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg, #4a4aa6, #d4af37)', color: '#ffffff' }}
            onClick={() => { setHafazanPhase('reveal'); setHafazanRevealLevel(0); setHafazanHidden(new Set()) }}
          >
            Mula Hafazan 🕌
          </button>
        </div>
      )
    }

    // Reveal / Practice phase
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <button className="flex items-center gap-1 text-sm" style={{ color: '#4a4aa6' }} onClick={() => setHafazanPhase('select')}>
            <ChevronLeft className="h-5 w-5" /> Pilih
          </button>
          <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>
            {surah?.nameMs} ({hafazanStart}-{hafazanEnd})
          </div>
          <div className="flex gap-1">
            {['reveal', 'practice', 'complete'].map(phase => (
              <div key={phase} className="h-1.5 w-6 rounded-full" style={{
                background: hafazanPhase === phase ? '#d4af37' : 'rgba(74,74,166,0.2)',
              }} />
            ))}
          </div>
        </div>

        {/* Phase controls */}
        {hafazanPhase === 'reveal' && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Tahap:</span>
            {[0, 1, 2, 3, 4].map(level => (
              <button
                key={level}
                className="h-7 px-2 rounded-lg text-[10px] font-medium"
                style={{
                  background: hafazanRevealLevel === level ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                  color: hafazanRevealLevel === level ? '#4a4aa6' : 'rgba(204,204,204,0.4)',
                  border: `1px solid ${hafazanRevealLevel === level ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
                }}
                onClick={() => setHafazanRevealLevel(level)}
              >
                {level === 0 ? 'Penuh' : `Tahap ${level}`}
              </button>
            ))}
            <button
              className="ml-auto h-7 px-3 rounded-lg text-[10px] font-medium"
              style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}
              onClick={() => { setHafazanPhase('practice'); setHafazanHidden(new Set(selectedVerses.map(v => v.verseNumber))) }}
            >
              Latihan →
            </button>
          </div>
        )}

        {hafazanPhase === 'practice' && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Semak hafazan anda</span>
            <button
              className="ml-auto h-7 px-3 rounded-lg text-[10px] font-medium"
              style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.3)' }}
              onClick={() => { setHafazanPhase('complete'); store.addXp(20) }}
            >
              Selesai ✓
            </button>
          </div>
        )}

        {hafazanPhase === 'complete' && (
          <div className="rounded-xl p-4 mb-3 text-center" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(74,74,166,0.1))', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="text-3xl mb-2">🎉</div>
            <div className="text-sm font-semibold" style={{ color: '#d4af37' }}>MasyaAllah!</div>
            <p className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.6)' }}>Anda telah melengkapkan sesi hafazan</p>
            <p className="text-xs mt-1" style={{ color: '#4a4aa6' }}>+20 XP</p>
            <button
              className="mt-3 px-4 py-2 rounded-xl text-xs font-medium"
              style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.3)' }}
              onClick={() => setHafazanPhase('select')}
            >
              Sesi Baru
            </button>
          </div>
        )}

        {/* Verses */}
        <div className="space-y-2">
          {selectedVerses.length > 0 ? selectedVerses.map(verse => {
            const isHidden = hafazanHidden.has(verse.verseNumber)
            const displayText = hafazanPhase === 'reveal'
              ? getRevealedText(verse.arabic, hafazanRevealLevel)
              : isHidden
                ? '▓'.repeat(verse.arabic.split(' ').length)
                : verse.arabic

            return (
              <div
                key={verse.verseNumber}
                className="rounded-xl p-3"
                style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}
              >
                <div className="flex items-start gap-2">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
                    {verse.verseNumber}
                  </div>
                  <div className="flex-1">
                    <p className="text-right text-lg leading-[2] font-arabic" style={{ color: isHidden ? 'rgba(74,74,166,0.3)' : '#ffffff', direction: 'rtl' }}>
                      {displayText}
                    </p>
                    {!isHidden && hafazanPhase !== 'complete' && (
                      <p className="text-[11px] mt-1" style={{ color: 'rgba(204,204,204,0.4)' }}>{verse.translation}</p>
                    )}
                  </div>
                </div>
                {hafazanPhase === 'practice' && (
                  <div className="flex justify-end mt-1">
                    <button
                      className="px-2 py-1 rounded-lg text-[10px]"
                      style={{ background: 'rgba(74,74,166,0.1)', color: '#4a4aa6' }}
                      onClick={() => {
                        const newHidden = new Set(hafazanHidden)
                        if (isHidden) newHidden.delete(verse.verseNumber)
                        else newHidden.add(verse.verseNumber)
                        setHafazanHidden(newHidden)
                      }}
                    >
                      {isHidden ? <><Eye className="h-3 w-3 inline" /> Dedah</> : <><EyeOff className="h-3 w-3 inline" /> Sembunyi</>}
                    </button>
                  </div>
                )}
              </div>
            )
          }) : (
            <div className="text-center py-8">
              <p className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>Tiada data ayat untuk surah ini</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── Render: Audio Player Bar ───────────────────────────────
  const renderAudioPlayer = () => {
    if (!isPlaying && !currentPlayingAyah) return null
    const surah = SURAH_LIST.find(s => s.id === selectedSurah)
    const progress = surah && currentPlayingAyah ? (currentPlayingAyah / surah.versesCount) * 100 : 0

    return (
      <motion.div
        className="fixed bottom-20 left-0 right-0 z-30 px-4"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
      >
        <div className="mx-auto max-w-[480px] rounded-2xl overflow-hidden" style={{ background: 'rgba(26,26,74,0.95)', border: '1px solid rgba(74,74,166,0.3)', backdropFilter: 'blur(20px)' }}>
          {/* Progress bar */}
          <div className="h-0.5" style={{ background: 'rgba(74,74,166,0.2)' }}>
            <div className="h-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} />
          </div>

          <div className="px-4 py-2.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0 mr-3">
                <div className="text-xs font-medium truncate" style={{ color: '#ffffff' }}>
                  {surah?.nameMs} · Ayat {currentPlayingAyah}
                </div>
                <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
                  {RECITERS.find(r => r.id === reciter)?.nameMs || 'Mishary'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prevAyah} className="p-1.5">
                  <SkipBack className="h-4 w-4" style={{ color: '#4a4aa6' }} />
                </button>
                <button
                  className="h-9 w-9 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #4a4aa6, #6a6ab6)' }}
                  onClick={() => togglePlay(currentPlayingAyah || 1)}
                >
                  {isPlaying ? <Pause className="h-4 w-4" style={{ color: '#ffffff' }} /> : <Play className="h-4 w-4 ml-0.5" style={{ color: '#ffffff' }} />}
                </button>
                <button onClick={nextAyah} className="p-1.5">
                  <SkipForward className="h-4 w-4" style={{ color: '#4a4aa6' }} />
                </button>
                <button onClick={() => setShowAudioSettings(!showAudioSettings)} className="p-1.5">
                  <Settings className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.4)' }} />
                </button>
              </div>
            </div>

            {/* Audio settings panel */}
            <AnimatePresence>
              {showAudioSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                  style={{ borderTop: '1px solid rgba(74,74,166,0.1)' }}
                >
                  <div className="pt-2 space-y-2">
                    {/* Reciter selector */}
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
                      <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Qari:</span>
                      <div className="flex gap-1 flex-1 overflow-x-auto">
                        {RECITERS.map(r => (
                          <button
                            key={r.id}
                            className="px-2 py-0.5 rounded text-[10px] whitespace-nowrap"
                            style={{
                              background: reciter === r.id ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                              color: reciter === r.id ? '#4a4aa6' : 'rgba(204,204,204,0.4)',
                              border: `1px solid ${reciter === r.id ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
                            }}
                            onClick={() => setReciter(r.id)}
                          >
                            {r.nameMs}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Speed control */}
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
                      <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Kelajuan:</span>
                      <div className="flex gap-1">
                        {SPEED_OPTIONS.map(speed => (
                          <button
                            key={speed}
                            className="px-1.5 py-0.5 rounded text-[10px]"
                            style={{
                              background: playbackSpeed === speed ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                              color: playbackSpeed === speed ? '#4a4aa6' : 'rgba(204,204,204,0.4)',
                            }}
                            onClick={() => setPlaybackSpeed(speed)}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Repeat mode */}
                    <div className="flex items-center gap-2">
                      <Repeat className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
                      <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Ulang:</span>
                      <div className="flex gap-1">
                        {([
                          { mode: 'none' as RepeatMode, label: 'Tiada' },
                          { mode: 'single' as RepeatMode, label: 'Ayat' },
                          { mode: 'surah' as RepeatMode, label: 'Surah' },
                          { mode: 'continuous' as RepeatMode, label: 'Semua' },
                        ]).map(rm => (
                          <button
                            key={rm.mode}
                            className="px-2 py-0.5 rounded text-[10px]"
                            style={{
                              background: repeatMode === rm.mode ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                              color: repeatMode === rm.mode ? '#4a4aa6' : 'rgba(204,204,204,0.4)',
                            }}
                            onClick={() => setRepeatMode(rm.mode)}
                          >
                            {rm.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    )
  }

  // ─── Render: Tafsir Bottom Sheet ────────────────────────────
  const renderTafsirSheet = () => {
    if (tafsirVerse === null) return null
    const verse = verses.find(v => v.verseNumber === tafsirVerse)

    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setTafsirVerse(null)} />
        <motion.div
          className="relative w-full max-w-[480px] rounded-t-2xl max-h-[70vh] overflow-y-auto qp-scroll"
          style={{ background: '#1a1a4a', border: '1px solid rgba(74,74,166,0.2)' }}
          initial={{ y: 300 }}
          animate={{ y: 0 }}
          exit={{ y: 300 }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: '#d4af37' }}>
                <MessageCircle className="h-4 w-4" /> Tafsir JAKIM
              </h3>
              <button onClick={() => setTafsirVerse(null)}>
                <X className="h-5 w-5" style={{ color: 'rgba(204,204,204,0.4)' }} />
              </button>
            </div>
            <div className="mb-3 p-3 rounded-xl" style={{ background: 'rgba(42,42,106,0.3)' }}>
              <p className="text-right text-lg font-arabic leading-[2]" style={{ color: '#ffffff', direction: 'rtl' }}>
                {verse?.arabic}
              </p>
            </div>
            <div className="mb-2">
              <div className="text-xs font-medium mb-1" style={{ color: '#4a4aa6' }}>Terjemahan Malay:</div>
              <p className="text-sm" style={{ color: 'rgba(204,204,204,0.7)' }}>{verse?.translation}</p>
            </div>
            <div className="mb-2">
              <div className="text-xs font-medium mb-1" style={{ color: '#d4af37' }}>Tafsir:</div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(204,204,204,0.6)' }}>
                Tafsir lengkap JAKIM untuk Surah {surahInfo?.nameMs} Ayat {tafsirVerse} akan dimuat turun.
                Sila rujuk laman web rasmi JAKIM untuk tafsir penuh dan konteks ayat ini.
              </p>
            </div>
            <div className="p-2 rounded-lg mt-2" style={{ background: 'rgba(74,74,166,0.1)' }}>
              <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.3)' }}>
                ℹ️ Tafsir berdasarkan Tafsir Pembangunan Jubli Masjid (JAKIM). Rujuk ulama untuk tafsir lengkap.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // ─── Main Render ────────────────────────────────────────────
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            className="qp-scroll flex-1 overflow-y-auto px-4 pb-24 pt-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>Al-Quran</h2>
                <p className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>114 Surah · 30 Juz · 604 Muka</p>
              </div>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,74,166,0.15)' }}>
                <BookOpen className="h-4 w-4" style={{ color: '#4a4aa6' }} />
              </div>
            </div>

            {/* Stats Bar */}
            {renderStatsBar()}

            {/* Mode Tabs */}
            {renderModeTabs()}

            {/* Search (Surah mode only) */}
            {readingMode === 'surah' && renderSearchBar()}
            {readingMode === 'surah' && renderSearchResults()}

            {/* Filter tabs (Surah mode) */}
            {readingMode === 'surah' && (
              <div className="flex gap-2 mb-3">
                {[
                  { key: 'all' as FilterType, label: 'Semua' },
                  { key: 'meccan' as FilterType, label: 'Makkiyah' },
                  { key: 'medinan' as FilterType, label: 'Madaniyyah' },
                ].map(f => (
                  <button
                    key={f.key}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: filter === f.key ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                      color: filter === f.key ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                      border: `1px solid ${filter === f.key ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
                    }}
                    onClick={() => setFilter(f.key)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}

            {/* Content based on mode */}
            {readingMode === 'surah' && renderSurahList()}
            {readingMode === 'mushaf' && renderMushafView()}
            {readingMode === 'juz' && renderJuzView()}
            {readingMode === 'bookmarks' && renderBookmarksView()}
            {readingMode === 'hafazan' && renderHafazanView()}
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            ref={readerScrollRef}
            className="qp-scroll flex-1 overflow-y-auto px-4 pb-32 pt-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {readingMode === 'surah' && renderSurahReader()}
            {readingMode !== 'surah' && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-3" style={{ color: 'rgba(74,74,166,0.3)' }} />
                <p className="text-sm" style={{ color: 'rgba(204,204,204,0.5)' }}>Mod bacaan {readingMode}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player Bar */}
      {renderAudioPlayer()}

      {/* Tafsir Bottom Sheet */}
      <AnimatePresence>
        {tafsirVerse !== null && renderTafsirSheet()}
      </AnimatePresence>
    </div>
  )
}
