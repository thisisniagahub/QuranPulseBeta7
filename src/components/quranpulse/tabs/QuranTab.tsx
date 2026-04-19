'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, BookOpen, Bookmark, ChevronLeft, ChevronRight, Share2, X,
  Play, Pause, Mic, Eye, EyeOff,
  BookMarked, Loader2, Clock, Star, Trophy,
  Repeat, List, Grid3X3, Brain,
  MessageCircle, Sparkles, MicOff, CheckCircle2, AlertCircle,
  Zap, Target, BarChart3, RefreshCw, Volume2, VolumeX, SkipForward,
  Type, Sun, Moon, Copy, ExternalLink, Settings2, SkipBack, Gauge, Timer
} from 'lucide-react'
import { useQuranPulseStore, type HafazanLevel } from '@/stores/quranpulse-store'
import { SURAH_LIST, getSurahVerses, getSurahName, type SurahInfo } from '@/lib/quran-data'

// ─── Types ────────────────────────────────────────────────────
type ReadingMode = 'surah' | 'mushaf' | 'juz' | 'bookmarks' | 'hafazan' | 'recite'
type Reciter = 'ar.alafasy' | 'ar.abdurrahmaansudais' | 'ar.saaborimuneer' | 'ar.hudhaify'
type RepeatMode = 'none' | 'single' | 'surah' | 'continuous' | 'ab-repeat'
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

interface WordAnalysis {
  word: string
  transliteration: string
  translation: string
  root?: string
  grammar?: string
}

interface ReciteResult {
  accuracy: number
  expectedWords: string[]
  transcribedWords: string[]
  matchedWords: boolean[]
  xpEarned: number
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

const HAFAZAN_LEVEL_COLORS: Record<HafazanLevel, string> = {
  new: '#6a6ab6',
  learning: '#d4af37',
  review: '#4a9eff',
  mastered: '#4aff7a',
}

const HAFAZAN_LEVEL_MS: Record<HafazanLevel, string> = {
  new: 'Baru',
  learning: 'Belajar',
  review: 'Ulang',
  mastered: 'Kuasai',
}

// Simple Arabic word transliteration map
const TRANSLIT_MAP: Record<string, string> = {
  'بِسْمِ': 'Bismi', 'ٱللَّهِ': 'Allahi', 'ٱلرَّحْمَـٰنِ': 'Ar-Rahmani', 'ٱلرَّحِيمِ': 'Ar-Rahimi',
  'ٱلْحَمْدُ': 'Alhamdu', 'لِلَّهِ': 'Lillahi', 'رَبِّ': 'Rabbi', 'ٱلْعَـٰلَمِينَ': 'Al-\'Alamin',
  'مَـٰلِكِ': 'Maliki', 'يَوْمِ': 'Yawmi', 'ٱلدِّينِ': 'Ad-Din',
  'إِيَّاكَ': 'Iyyaka', 'نَعْبُدُ': 'Na\'budu', 'وَإِيَّاكَ': 'Wa Iyyaka', 'نَسْتَعِينُ': 'Nasta\'inu',
  'ٱهْدِنَا': 'Ihdina', 'ٱلصِّرَٰطَ': 'As-Sirata', 'ٱلْمُسْتَقِيمَ': 'Al-Mustaqima',
  'صِرَٰطَ': 'Sirata', 'ٱلَّذِينَ': 'Alladhina', 'أَنْعَمْتَ': 'An\'amta', 'عَلَيْهِمْ': 'Alayhim',
  'غَيْرِ': 'Ghayri', 'ٱلْمَغْضُوبِ': 'Al-Maghdubi', 'وَلَا': 'Wa La', 'ٱلضَّآلِّينَ': 'Ad-Dallin',
  'قُلْ': 'Qul', 'هُوَ': 'Huwa', 'أَحَدٌ': 'Ahad', 'ٱلصَّمَدُ': 'As-Samad',
  'لَمْ': 'Lam', 'يَلِدْ': 'Yalid', 'وَلَمْ': 'Wa Lam', 'يُولَدْ': 'Yulad',
  'وَلَمْ': 'Wa Lam', 'يَكُن': 'Yakun', 'لَّهُۥ': 'Lahu', 'كُفُوًا': 'Kufuwan', 'أَحَدٌ': 'Ahad',
}

// ─── Helper: Compute absolute ayah number (1-6236) ────────────
function getAbsoluteAyahNumber(surahId: number, ayahInSurah: number): number {
  let total = 0
  for (let i = 0; i < surahId - 1 && i < SURAH_LIST.length; i++) {
    total += SURAH_LIST[i].versesCount
  }
  return total + ayahInSurah
}

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
  const [showWordByWord, setShowWordByWord] = useState(false)
  const [selectedWord, setSelectedWord] = useState<{ word: string; verseNum: number; wordIndex: number } | null>(null)

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null)
  const [reciter, setReciter] = useState<Reciter>('ar.alafasy')
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none')
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

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

  // Recite state
  const [isRecording, setIsRecording] = useState(false)
  const [reciteVerseIdx, setReciteVerseIdx] = useState(0)
  const [reciteResult, setReciteResult] = useState<ReciteResult | null>(null)
  const [reciteTranscription, setReciteTranscription] = useState('')

  // Reading stats
  const [pagesReadToday, setPagesReadToday] = useState(0)

  // 2026 Features
  const [arabicFontSize, setArabicFontSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium')
  const [readingTheme, setReadingTheme] = useState<'dark' | 'bright'>('dark')
  const [showVerseActions, setShowVerseActions] = useState<number | null>(null)
  const [showReaderSettings, setShowReaderSettings] = useState(false)
  const [khatamMarkedVerses, setKhatamMarkedVerses] = useState<Set<string>>(new Set())

  // 2026: A-B Repeat
  const [abRepeatStart, setAbRepeatStart] = useState<number | null>(null)
  const [abRepeatEnd, setAbRepeatEnd] = useState<number | null>(null)

  // 2026: Daily Reading Goal
  const [dailyGoal, setDailyGoal] = useState<5 | 10 | 20 | 30>(10)
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0)

  // 2026: Tafsir Panel
  const [showTafsirPanel, setShowTafsirPanel] = useState(false)
  const [tafsirLoading, setTafsirLoading] = useState(false)
  const [tafsirText, setTafsirText] = useState('')

  // API verse fetching with cache
  const [apiVerses, setApiVerses] = useState<VerseData[]>([])
  const [isLoadingVerses, setIsLoadingVerses] = useState(false)
  const [verseCache, setVerseCache] = useState<Record<number, VerseData[]>>({})
  const [verseError, setVerseError] = useState(false)

  // Refs
  const ayahRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const readerScrollRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const store = useQuranPulseStore()

  // ─── Verse fetching ──────────────────────────────────────────
  // Get local sample verses (for surahs 1, 112, 113, 114)
  const localVerses: VerseData[] = useMemo(() => {
    const raw = getSurahVerses(selectedSurah)
    return raw.map(v => ({ ...v, translationEn: v.translation }))
  }, [selectedSurah])

  // Use API verses if available, otherwise local
  const verses: VerseData[] = useMemo(() => {
    if (apiVerses.length > 0) return apiVerses
    if (localVerses.length > 0) return localVerses
    return verseCache[selectedSurah] || []
  }, [apiVerses, localVerses, selectedSurah, verseCache])

  // Fetch verses from API when surah changes
  useEffect(() => {
    // If we have local data, show it immediately
    if (localVerses.length > 0) {
      setApiVerses([])
      setIsLoadingVerses(false)
      // Still fetch from API for enrichment
      if (!verseCache[selectedSurah]) {
        fetchSurahFromApi(selectedSurah)
      }
      return
    }

    // If cached, use cache
    if (verseCache[selectedSurah]) {
      setApiVerses(verseCache[selectedSurah])
      setIsLoadingVerses(false)
      return
    }

    // Otherwise fetch from API
    fetchSurahFromApi(selectedSurah)
  }, [selectedSurah, localVerses.length, verseCache])

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

  const surahInfo = getSurahName(selectedSurah)

  const totalQuranVerses = 6236
  const versesRead = useMemo(() => {
    return SURAH_LIST.slice(0, selectedSurah - 1).reduce((acc, s) => acc + s.versesCount, 0)
  }, [selectedSurah])

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
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeAttribute('src')
      audioRef.current.load()
      audioRef.current = null
    }
    setView('list')
    setIsPlaying(false)
    setCurrentPlayingAyah(null)
    setIsAudioLoading(false)
    setAudioError(null)
    setReciteResult(null)
  }, [])

  const navigateSurah = useCallback((direction: -1 | 1) => {
    const next = selectedSurah + direction
    if (next >= 1 && next <= 114) {
      setSelectedSurah(next)
      store.setLastRead(next, 1)
      setTafsirVerse(null)
      setReciteResult(null)
      setReciteVerseIdx(0)
      readerScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedSurah, store])

  // ─── Real Audio Playback ────────────────────────────────────
  const playAyahAudio = useCallback((surahId: number, ayahNum: number) => {
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.removeAttribute('src')
      audioRef.current.load()
    }

    const absoluteAyah = getAbsoluteAyahNumber(surahId, ayahNum)
    const url = `https://cdn.islamic.network/quran/audio/128/${reciter}/${absoluteAyah}.mp3`

    setAudioError(null)
    setIsAudioLoading(true)

    const audio = new Audio(url)
    audio.playbackRate = playbackSpeed
    audioRef.current = audio

    audio.oncanplaythrough = () => {
      setIsAudioLoading(false)
      audio.play().catch(() => {
        setAudioError('Gagal memainkan audio')
        setIsPlaying(false)
        setCurrentPlayingAyah(null)
        setIsAudioLoading(false)
      })
    }

    audio.onended = () => {
      // Handle repeat modes
      const surah = SURAH_LIST.find(s => s.id === surahId)
      if (!surah) return

      if (repeatMode === 'single') {
        // Replay same ayah
        audio.currentTime = 0
        audio.play().catch(() => {
          setIsPlaying(false)
          setCurrentPlayingAyah(null)
        })
      } else if (repeatMode === 'ab-repeat' && abRepeatEnd !== null && abRepeatStart !== null) {
        // A-B Repeat: loop between start and end
        if (ayahNum >= abRepeatEnd) {
          setCurrentPlayingAyah(abRepeatStart)
        } else if (ayahNum < surah.versesCount) {
          setCurrentPlayingAyah(ayahNum + 1)
        } else {
          setCurrentPlayingAyah(abRepeatStart)
        }
      } else if (ayahNum < surah.versesCount) {
        // Advance to next ayah
        setCurrentPlayingAyah(ayahNum + 1)
      } else if (repeatMode === 'surah') {
        // Restart surah
        setCurrentPlayingAyah(1)
      } else if (repeatMode === 'continuous') {
        // Move to next surah
        if (surahId < 114) {
          setSelectedSurah(surahId + 1)
          store.setLastRead(surahId + 1, 1)
          setCurrentPlayingAyah(1)
        } else {
          setIsPlaying(false)
          setCurrentPlayingAyah(null)
        }
      } else {
        // No repeat — stop
        setIsPlaying(false)
        setCurrentPlayingAyah(null)
      }
    }

    audio.onerror = () => {
      setAudioError('Gagal memuatkan audio')
      setIsAudioLoading(false)
      setIsPlaying(false)
      setCurrentPlayingAyah(null)
    }

    // Start loading
    audio.load()
  }, [reciter, playbackSpeed, repeatMode, store])

  const togglePlay = useCallback((ayah?: number) => {
    if (isPlaying) {
      // Pause/stop
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeAttribute('src')
        audioRef.current.load()
        audioRef.current = null
      }
      setIsPlaying(false)
      setCurrentPlayingAyah(null)
      setIsAudioLoading(false)
      setAudioError(null)
    } else {
      // Start playing
      const startAyah = ayah || 1
      setIsPlaying(true)
      setCurrentPlayingAyah(startAyah)
      setAudioError(null)
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
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setIsPlaying(false)
      setCurrentPlayingAyah(null)
    }
  }, [currentPlayingAyah, selectedSurah, repeatMode])

  // Auto-scroll to playing ayah
  useEffect(() => {
    if (currentPlayingAyah && ayahRefs.current[currentPlayingAyah]) {
      ayahRefs.current[currentPlayingAyah]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentPlayingAyah])

  // Play audio when currentPlayingAyah changes (and isPlaying is true)
  useEffect(() => {
    if (isPlaying && currentPlayingAyah) {
      playAyahAudio(selectedSurah, currentPlayingAyah)
    }
  }, [isPlaying, currentPlayingAyah, selectedSurah, playAyahAudio])

  // Update playback speed on existing audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed
    }
  }, [playbackSpeed])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

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

  // ─── Word-by-Word Analysis ────────────────────────────────
  const getWordAnalysis = useCallback((word: string, _verseNum: number, wordIndex: number): WordAnalysis => {
    const transliteration = TRANSLIT_MAP[word] || `kalimah_${wordIndex + 1}`
    return {
      word,
      transliteration,
      translation: `Perkataan ${wordIndex + 1}`,
      root: word.replace(/[\u064B-\u065F\u0670]/g, ''), // Remove diacritics for root
      grammar: wordIndex === 0 ? 'Permulaan' : 'Lain-lain',
    }
  }, [])

  // ─── Recite Mode ────────────────────────────────────────
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
  }, [selectedSurah, reciteVerseIdx, verses])

  const compareRecitation = useCallback((transcribed: string) => {
    if (verses.length === 0) return
    const verse = verses[reciteVerseIdx]
    if (!verse) return

    const expectedWords = verse.arabic.split(/\s+/).filter(Boolean)
    const transcribedWords = transcribed.split(/\s+/).filter(Boolean)

    // Simple comparison - match based on sequence
    const matchedWords = expectedWords.map((expected, i) => {
      if (i < transcribedWords.length) {
        // Check if transcribed word is similar (simple substring check)
        const tWord = transcribedWords[i] || ''
        return expected.includes(tWord) || tWord.includes(expected) || tWord.length > 0
      }
      return false
    })

    const correctCount = matchedWords.filter(Boolean).length
    const accuracy = expectedWords.length > 0 ? Math.round((correctCount / expectedWords.length) * 100) : 0

    const xpEarned = Math.floor(accuracy / 10) * 5
    if (xpEarned > 0) store.addXp(xpEarned)

    // Update hafazan progress
    store.updateHafazanVerse(selectedSurah, verse.verseNumber, accuracy >= 70)

    setReciteResult({
      accuracy,
      expectedWords,
      transcribedWords,
      matchedWords,
      xpEarned,
    })
  }, [verses, reciteVerseIdx, selectedSurah, store])

  // ─── Juz progress (deterministic) ───────────────────────
  const getJuzProgress = useCallback((juz: number) => {
    const bookmarkedInJuz = store.bookmarkedVerses.filter(v => {
      const surah = SURAH_LIST.find(s => s.id === v.surahId)
      return surah?.juz.includes(juz)
    })
    const surahs = SURAH_LIST.filter(s => s.juz.includes(juz))
    const totalVerses = surahs.reduce((a, s) => a + s.versesCount, 0)
    if (totalVerses === 0) return 0
    return Math.min(Math.round((bookmarkedInJuz.length / totalVerses) * 100), 100)
  }, [store.bookmarkedVerses])

  // ─── Juz surahs (moved out of render function for hooks rules) ─
  const juzSurahs = useMemo(() => {
    if (selectedJuz === null) return null
    return SURAH_LIST.filter(s => s.juz.includes(selectedJuz))
  }, [selectedJuz])

  // ─── 2026: Font Size Map ──────────────────────────────────────
  const FONT_SIZE_MAP = { small: 'text-xl', medium: 'text-2xl', large: 'text-3xl', xlarge: 'text-4xl' }

  // ─── 2026: Khatam Progress ──────────────────────────────────────
  const khatamProgress = useMemo(() => {
    const totalMarked = khatamMarkedVerses.size
    return Math.min(Math.round((totalMarked / totalQuranVerses) * 100), 100)
  }, [khatamMarkedVerses, totalQuranVerses])

  const markCurrentViewAsRead = useCallback(() => {
    if (verses.length === 0) return
    const newMarked = new Set(khatamMarkedVerses)
    verses.forEach(v => newMarked.add(`${selectedSurah}-${v.verseNumber}`))
    setKhatamMarkedVerses(newMarked)
    store.addXp(verses.length * 2)
  }, [verses, selectedSurah, khatamMarkedVerses, store])

  // ─── Reading Mode Tabs ──────────────────────────────────────
  const modeTabs: { key: ReadingMode; label: string; icon: React.ReactNode }[] = [
    { key: 'surah', label: 'Surah', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { key: 'juz', label: 'Juz', icon: <Grid3X3 className="h-3.5 w-3.5" /> },
    { key: 'bookmarks', label: 'Tanda', icon: <Bookmark className="h-3.5 w-3.5" /> },
    { key: 'hafazan', label: 'Hafazan', icon: <Brain className="h-3.5 w-3.5" /> },
    { key: 'recite', label: 'Baca', icon: <Mic className="h-3.5 w-3.5" /> },
  ]

  // 2026: Daily goal progress tracking
  useEffect(() => {
    if (pagesReadToday > 0) {
      setDailyGoalProgress(Math.min(pagesReadToday, dailyGoal))
    }
  }, [pagesReadToday, dailyGoal])

  // 2026: Fetch tafsir for selected verse
  const fetchTafsir = useCallback(async (surahId: number, verseNum: number) => {
    setTafsirLoading(true)
    setTafsirText('')
    try {
      const res = await fetch(`/api/quran/tafsir?surah=${surahId}&ayah=${verseNum}`)
      const data = await res.json()
      if (data.success && data.data) {
        setTafsirText(data.data.text || data.data.tafsir || 'Tafsir belum tersedia untuk ayat ini.')
      } else {
        setTafsirText('Tafsir belum tersedia. Sila rujuk Tafsir Abdullah Basmeih untuk huraian lengkap.')
      }
    } catch {
      setTafsirText('Gagal memuatkan tafsir. Sila cuba lagi.')
    } finally {
      setTafsirLoading(false)
    }
  }, [])

  // 2026: Khatam journey milestones
  const khatamJuzCompleted = useMemo(() => {
    const juzDone = new Set<number>()
    for (const key of khatamMarkedVerses) {
      const [sStr] = key.split('-')
      const sId = parseInt(sStr)
      const surah = SURAH_LIST.find(s => s.id === sId)
      if (surah) surah.juz.forEach(j => juzDone.add(j))
    }
    return juzDone
  }, [khatamMarkedVerses])

  const khatamJuzCount = khatamJuzCompleted.size

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
    <div className="space-y-2 mb-3">
      {/* Daily Reading Goal - 2026 Feature */}
      <div className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(212,175,55,0.08))', border: '1px solid rgba(74,74,166,0.2)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#d4af37' }}>Sasaran Harian</span>
          </div>
          <div className="flex items-center gap-1">
            {([5, 10, 20, 30] as const).map(g => (
              <button key={g} className="px-1.5 py-0.5 rounded text-[9px] font-medium transition-all"
                style={{
                  background: dailyGoal === g ? 'rgba(212,175,55,0.2)' : 'rgba(74,74,166,0.1)',
                  color: dailyGoal === g ? '#d4af37' : 'rgba(204,204,204,0.4)',
                  border: `1px solid ${dailyGoal === g ? 'rgba(212,175,55,0.3)' : 'transparent'}`
                }}
                onClick={() => setDailyGoal(g)}
              >{g}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.15)' }}>
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }}
                animate={{ width: `${Math.min((dailyGoalProgress / dailyGoal) * 100, 100)}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{dailyGoalProgress}/{dailyGoal} muka</span>
              <span className="text-[10px] font-medium" style={{ color: dailyGoalProgress >= dailyGoal ? '#4aff7a' : '#d4af37' }}>
                {dailyGoalProgress >= dailyGoal ? '✓ Tercapai!' : `${Math.round((dailyGoalProgress / dailyGoal) * 100)}%`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-xl p-2.5" style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy className="h-3 w-3" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-medium" style={{ color: '#d4af37' }}>Khatam</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.15)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((versesRead / totalQuranVerses) * 100)}%`, background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }} />
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>{khatamJuzCount}/30 Juz · {Math.round((versesRead / totalQuranVerses) * 100)}%</div>
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
            <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => setShowWordByWord(!showWordByWord)}>
              <Sparkles className="h-4 w-4" style={{ color: showWordByWord ? '#d4af37' : '#4a4aa6' }} />
            </button>
            <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => setShowTajwid(!showTajwid)}>
              <BookOpen className="h-4 w-4" style={{ color: showTajwid ? '#d4af37' : '#4a4aa6' }} />
            </button>
            <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => setShowTranslation(!showTranslation)}>
              {showTranslation ? <EyeOff className="h-4 w-4" style={{ color: '#4a4aa6' }} /> : <Eye className="h-4 w-4" style={{ color: '#4a4aa6' }} />}
            </button>
            <button className="p-2 rounded-lg" style={{ background: 'rgba(74,74,166,0.15)' }} onClick={() => store.toggleSurahBookmark(selectedSurah)}>
              <Bookmark className="h-4 w-4" style={{ color: store.isSurahBookmarked(selectedSurah) ? '#d4af37' : '#4a4aa6' }} fill={store.isSurahBookmarked(selectedSurah) ? '#d4af37' : 'none'} />
            </button>
          </div>
        </div>

        {/* Word-by-word indicator */}
        {showWordByWord && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <Sparkles className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[11px]" style={{ color: '#d4af37' }}>Mod Perkataan — Ketik perkataan untuk analisis</span>
          </div>
        )}

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

        {/* Loading skeleton */}
        {isLoadingVerses && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}>
                <div className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full animate-pulse" style={{ background: 'rgba(74,74,166,0.2)' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-3/4 animate-pulse rounded" style={{ background: 'rgba(74,74,166,0.15)' }} />
                    <div className="h-4 w-full animate-pulse rounded" style={{ background: 'rgba(74,74,166,0.1)' }} />
                    <div className="h-4 w-2/3 animate-pulse rounded" style={{ background: 'rgba(74,74,166,0.1)' }} />
                  </div>
                </div>
              </div>
            ))}
            <div className="text-center py-2">
              <Loader2 className="h-5 w-5 animate-spin mx-auto" style={{ color: '#4a4aa6' }} />
              <p className="text-xs mt-2" style={{ color: 'rgba(204,204,204,0.4)' }}>Memuatkan ayat...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {verseError && !isLoadingVerses && verses.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="h-10 w-10 mx-auto mb-3" style={{ color: 'rgba(74,74,166,0.3)' }} />
            <p className="text-sm" style={{ color: 'rgba(204,204,204,0.5)' }}>Gagal memuatkan ayat</p>
            <button
              className="mt-2 px-4 py-2 rounded-xl text-xs"
              style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.3)' }}
              onClick={() => fetchSurahFromApi(selectedSurah)}
            >
              Cuba Lagi
            </button>
          </div>
        )}

        {/* Verses */}
        {!isLoadingVerses && verses.length > 0 && (
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
                      {/* Arabic text - Word-by-Word or normal */}
                      {showWordByWord ? (
                        <p className="text-right text-xl leading-[2.5] font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>
                          {verse.arabic.split(/\s+/).filter(Boolean).map((word, wi) => (
                            <button
                              key={wi}
                              className="inline-block hover:bg-opacity-20 rounded px-0.5 transition-colors"
                              style={{
                                background: selectedWord?.verseNum === verse.verseNumber && selectedWord?.wordIndex === wi
                                  ? 'rgba(212,175,55,0.2)'
                                  : 'transparent',
                                borderBottom: selectedWord?.verseNum === verse.verseNumber && selectedWord?.wordIndex === wi
                                  ? '2px solid #d4af37'
                                  : '2px solid transparent',
                              }}
                              onClick={() => setSelectedWord({ word, verseNum: verse.verseNumber, wordIndex: wi })}
                            >
                              {word}
                            </button>
                          ))}
                        </p>
                      ) : (
                        <p className="text-right text-xl leading-[2.2] font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>
                          {verse.arabic}
                        </p>
                      )}

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
                        {isPlayingAyah && isAudioLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" style={{ color: '#4a4aa6' }} /> : isPlayingAyah ? <Pause className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} /> : <Play className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />}
                        <span className="text-[10px]" style={{ color: '#4a4aa6' }}>{isPlayingAyah && isAudioLoading ? 'Memuat...' : 'Dengar'}</span>
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
        )}

        {/* Empty state (no local data and no API data yet) */}
        {!isLoadingVerses && verses.length === 0 && !verseError && (
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

        {/* Word Analysis Popup */}
        <AnimatePresence>
          {selectedWord && showWordByWord && (
            <motion.div
              className="fixed inset-0 z-50 flex items-end justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedWord(null)} />
              <motion.div
                className="relative w-full max-w-[480px] rounded-t-2xl p-4"
                style={{ background: '#2a2a6a', border: '1px solid rgba(74,74,166,0.3)' }}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold" style={{ color: '#d4af37' }}>Analisis Perkataan</h4>
                  <button onClick={() => setSelectedWord(null)}>
                    <X className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.5)' }} />
                  </button>
                </div>
                {(() => {
                  const analysis = getWordAnalysis(selectedWord.word, selectedWord.verseNum, selectedWord.wordIndex)
                  return (
                    <div className="space-y-3">
                      <div className="text-center">
                        <p className="text-3xl font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{analysis.word}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(74,74,166,0.15)' }}>
                          <div className="text-[10px] mb-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Transliterasi</div>
                          <div className="text-xs font-medium" style={{ color: '#4a4aa6' }}>{analysis.transliteration}</div>
                        </div>
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(212,175,55,0.1)' }}>
                          <div className="text-[10px] mb-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Terjemahan</div>
                          <div className="text-xs font-medium" style={{ color: '#d4af37' }}>{analysis.translation}</div>
                        </div>
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(74,74,166,0.15)' }}>
                          <div className="text-[10px] mb-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Akar Kata</div>
                          <div className="text-sm font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{analysis.root}</div>
                        </div>
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(74,74,166,0.15)' }}>
                          <div className="text-[10px] mb-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Tatabahasa</div>
                          <div className="text-xs font-medium" style={{ color: '#6a6ab6' }}>{analysis.grammar}</div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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

  // ─── Render: Juz View (FIXED - no Math.random) ────────────
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
          const progress = getJuzProgress(juz)
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

  // ─── Render: Hafazan View (ENHANCED) ────────────────────────
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

          {/* Verse-level progress bars */}
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
        {/* Hafazan Stats */}
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

        {/* Daily Review Suggestions */}
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

        {/* Weak Verses */}
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

        {/* Surah list for hafazan */}
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
                  setHafazanSurah(surah.id)
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

          {/* Verse selector */}
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

          {/* Current verse display */}
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

          {/* Mic button */}
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
              transition={isRecording ? { duration: 1, repeat: Infinity } : {}}
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

          {/* Transcription */}
          {reciteTranscription && (
            <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
              <div className="text-[10px] mb-1" style={{ color: 'rgba(204,204,204,0.4)' }}>Transkripsi:</div>
              <div className="text-sm" style={{ color: '#ffffff' }}>{reciteTranscription}</div>
            </div>
          )}

          {/* Results */}
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

              {/* Word comparison */}
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

          {/* Navigation */}
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

    // Recite mode list view
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

  // ─── Audio Settings Modal ────────────────────────────────────
  const renderAudioSettings = () => (
    <AnimatePresence>
      {showAudioSettings && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAudioSettings(false)} />
          <motion.div
            className="relative w-full max-w-[480px] rounded-t-2xl p-4"
            style={{ background: '#2a2a6a' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
          >
            <h4 className="text-sm font-semibold mb-3" style={{ color: '#ffffff' }}>Tetapan Audio</h4>
            <div className="space-y-3">
              <div>
                <div className="text-xs mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Qari</div>
                <div className="grid grid-cols-2 gap-2">
                  {RECITERS.map(r => (
                    <button
                      key={r.id}
                      className="py-2 px-3 rounded-lg text-xs text-left flex items-center gap-2"
                      style={{
                        background: reciter === r.id ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                        color: reciter === r.id ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                        border: `1px solid ${reciter === r.id ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
                      }}
                      onClick={() => setReciter(r.id)}
                    >
                      <Volume2 className="h-3.5 w-3.5 flex-shrink-0" style={{ color: reciter === r.id ? '#4a4aa6' : 'rgba(204,204,204,0.3)' }} />
                      <div className="flex flex-col">
                        <span className="font-medium">{r.nameMs}</span>
                        <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{r.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Kelajuan: {playbackSpeed}x</div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  value={[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].indexOf(playbackSpeed)}
                  onChange={e => setPlaybackSpeed([0.5, 0.75, 1.0, 1.25, 1.5, 2.0][parseInt(e.target.value)] || 1.0)}
                  className="w-full"
                />
              </div>
              <div>
                <div className="text-xs mb-1" style={{ color: 'rgba(204,204,204,0.5)' }}>Ulangan</div>
                <div className="flex gap-2">
                  {(['none', 'single', 'surah', 'continuous'] as RepeatMode[]).map(mode => (
                    <button
                      key={mode}
                      className="flex-1 py-2 rounded-lg text-xs"
                      style={{
                        background: repeatMode === mode ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                        color: repeatMode === mode ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                        border: `1px solid ${repeatMode === mode ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
                      }}
                      onClick={() => setRepeatMode(mode)}
                    >
                      {mode === 'none' ? 'Tiada' : mode === 'single' ? 'Satu' : mode === 'surah' ? 'Surah' : 'Berterusan'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // ─── Main Render ────────────────────────────────────────────
  return (
    <div className="flex flex-1 flex-col overflow-hidden px-4 pt-2">
      {renderModeTabs()}

      <div className="qp-scroll flex-1 overflow-y-auto pb-4">
        {readingMode === 'surah' && view === 'list' && (
          <>
            {renderSearchBar()}
            {renderSearchResults()}
            {renderStatsBar()}
            {/* Filter buttons */}
            <div className="flex gap-2 mb-3">
              {(['all', 'meccan', 'medinan'] as FilterType[]).map(f => (
                <button
                  key={f}
                  className="px-3 py-1 rounded-lg text-xs"
                  style={{
                    background: filter === f ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                    color: filter === f ? '#4a4aa6' : 'rgba(204,204,204,0.4)',
                    border: `1px solid ${filter === f ? 'rgba(74,74,166,0.3)' : 'rgba(74,74,166,0.08)'}`,
                  }}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'Semua' : f === 'meccan' ? 'Makkiyah' : 'Madaniyyah'}
                </button>
              ))}
            </div>
            {renderSurahList()}
          </>
        )}

        {readingMode === 'surah' && view === 'reader' && renderSurahReader()}

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

      {/* Audio controls when reading */}
      {isPlaying && view === 'reader' && (
        <div className="flex items-center justify-between px-3 py-2 rounded-t-xl" style={{ background: 'rgba(42,42,106,0.8)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(74,74,166,0.2)' }}>
          <button className="p-1.5" onClick={() => {/* prev */}}>
            <ChevronLeft className="h-4 w-4" style={{ color: '#4a4aa6' }} />
          </button>
          <button className="p-2 rounded-full relative" style={{ background: 'rgba(74,74,166,0.2)' }} onClick={() => togglePlay()}>
            {isAudioLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" style={{ color: '#4a4aa6' }} />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" style={{ color: '#4a4aa6' }} />
            ) : (
              <Play className="h-5 w-5" style={{ color: '#4a4aa6' }} />
            )}
          </button>
          <button className="p-1.5" onClick={nextAyah}>
            <SkipForward className="h-4 w-4" style={{ color: '#4a4aa6' }} />
          </button>
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" style={{ color: isAudioLoading ? '#d4af37' : audioError ? '#ff4a4a' : 'rgba(204,204,204,0.4)' }} />
              <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{currentPlayingAyah}/{surahInfo?.versesCount || '?'}</span>
              {repeatMode !== 'none' && (
                <Repeat className="h-3 w-3" style={{ color: '#d4af37' }} />
              )}
            </div>
            {isAudioLoading && (
              <span className="text-[8px]" style={{ color: '#d4af37' }}>Memuatkan...</span>
            )}
            {audioError && (
              <span className="text-[8px]" style={{ color: '#ff4a4a' }}>Ralat audio</span>
            )}
          </div>
          <button className="p-1.5" onClick={() => setShowAudioSettings(true)}>
            <BarChart3 className="h-3.5 w-3.5" style={{ color: 'rgba(204,204,204,0.4)' }} />
          </button>
        </div>
      )}

      {renderAudioSettings()}
    </div>
  )
}
