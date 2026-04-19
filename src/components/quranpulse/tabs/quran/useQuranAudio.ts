'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { SURAH_LIST } from '@/lib/quran-data'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { getAbsoluteAyahNumber, type Reciter, type RepeatMode, type VerseData } from './types'

interface UseQuranAudioParams {
  selectedSurah: number
  setSelectedSurah: (id: number) => void
  verses: VerseData[]
  ayahRefs: React.RefObject<Record<number, HTMLDivElement | null>>
}

export function useQuranAudio({
  selectedSurah,
  setSelectedSurah,
  verses,
  ayahRefs,
}: UseQuranAudioParams) {
  const store = useQuranPulseStore()

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlayingAyah, setCurrentPlayingAyah] = useState<number | null>(null)
  const [reciter, setReciter] = useState<Reciter>('ar.alafasy')
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none')
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  // A-B Repeat
  const [abRepeatStart, setAbRepeatStart] = useState<number | null>(null)
  const [abRepeatEnd, setAbRepeatEnd] = useState<number | null>(null)

  // Voice following
  const [isVoiceFollowing, setIsVoiceFollowing] = useState(false)
  const [voiceFollowAyah, setVoiceFollowAyah] = useState<number | null>(null)

  // Word-by-word highlighting
  const [currentWordIndex, setCurrentWordIndex] = useState<number | null>(null)

  // AI Tajweed feedback
  const [aiTajweedFeedback, setAiTajweedFeedback] = useState<string | null>(null)
  const [isFetchingFeedback, setIsFetchingFeedback] = useState(false)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const voiceFollowRef = useRef<MediaRecorder | null>(null)
  const voiceFollowStreamRef = useRef<MediaStream | null>(null)
  const wordHighlightTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
        audio.currentTime = 0
        audio.play().catch(() => {
          setIsPlaying(false)
          setCurrentPlayingAyah(null)
        })
      } else if (repeatMode === 'ab-repeat' && abRepeatEnd !== null && abRepeatStart !== null) {
        if (ayahNum >= abRepeatEnd) {
          setCurrentPlayingAyah(abRepeatStart)
        } else if (ayahNum < surah.versesCount) {
          setCurrentPlayingAyah(ayahNum + 1)
        } else {
          setCurrentPlayingAyah(abRepeatStart)
        }
      } else if (ayahNum < surah.versesCount) {
        setCurrentPlayingAyah(ayahNum + 1)
      } else if (repeatMode === 'surah') {
        setCurrentPlayingAyah(1)
      } else if (repeatMode === 'continuous') {
        if (surahId < 114) {
          setSelectedSurah(surahId + 1)
          store.setLastRead(surahId + 1, 1)
          setCurrentPlayingAyah(1)
        } else {
          setIsPlaying(false)
          setCurrentPlayingAyah(null)
        }
      } else {
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
  }, [reciter, playbackSpeed, repeatMode, abRepeatEnd, abRepeatStart, setSelectedSurah, store])

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

  // Reset audio state (used by goBack)
  const resetAudio = useCallback(() => {
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
  }, [])

  // Auto-scroll to playing ayah
  useEffect(() => {
    if (currentPlayingAyah && ayahRefs.current[currentPlayingAyah]) {
      ayahRefs.current[currentPlayingAyah]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentPlayingAyah, ayahRefs])

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

  // ─── Voice-Following Recitation ─────────────────────────────
  const startVoiceFollowing = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      voiceFollowStreamRef.current = stream
      setIsVoiceFollowing(true)
      setVoiceFollowAyah(1)
      setCurrentWordIndex(null)

      const processChunk = async () => {
        if (!voiceFollowStreamRef.current) return
        const mediaRecorder = new MediaRecorder(voiceFollowStreamRef.current)
        const chunks: BlobPart[] = []
        mediaRecorder.ondataavailable = e => chunks.push(e.data)
        mediaRecorder.onstop = async () => {
          if (!isVoiceFollowing) return
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
                const transcribed = data.text.trim()
                for (let i = 0; i < verses.length; i++) {
                  const verseWords = verses[i].arabic.split(/\s+/).filter(Boolean)
                  const matchCount = verseWords.filter(w => transcribed.includes(w) || transcribed.includes(w.replace(/[\u064B-\u065F\u0670]/g, ''))).length
                  if (matchCount >= Math.ceil(verseWords.length * 0.3)) {
                    setVoiceFollowAyah(verses[i].verseNumber)
                    setCurrentPlayingAyah(verses[i].verseNumber)
                    break
                  }
                }
              }
            } catch { /* ASR failed, continue */ }
            if (voiceFollowStreamRef.current && isVoiceFollowing) {
              setTimeout(processChunk, 300)
            }
          }
          reader.readAsDataURL(blob)
        }
        mediaRecorder.start()
        setTimeout(() => { if (mediaRecorder.state === 'recording') mediaRecorder.stop() }, 4000)
      }
      processChunk()
    } catch {
      setIsVoiceFollowing(false)
    }
  }, [verses, isVoiceFollowing])

  const stopVoiceFollowing = useCallback(() => {
    setIsVoiceFollowing(false)
    setVoiceFollowAyah(null)
    if (voiceFollowStreamRef.current) {
      voiceFollowStreamRef.current.getTracks().forEach(t => t.stop())
      voiceFollowStreamRef.current = null
    }
    if (voiceFollowRef.current) {
      voiceFollowRef.current = null
    }
  }, [])

  // ─── Synchronized Word-by-Word Audio Highlighting ───────────
  useEffect(() => {
    if (wordHighlightTimerRef.current) {
      clearInterval(wordHighlightTimerRef.current)
      wordHighlightTimerRef.current = null
    }
    if (isPlaying && currentPlayingAyah && !isAudioLoading) {
      const verse = verses.find(v => v.verseNumber === currentPlayingAyah)
      if (!verse) return
      const words = verse.arabic.split(/\s+/).filter(Boolean)
      if (words.length === 0) return
      const estimatedDuration = 4000 / playbackSpeed
      const intervalPerWord = estimatedDuration / words.length
      let wordIdx = 0
      setCurrentWordIndex(0)
      wordHighlightTimerRef.current = setInterval(() => {
        wordIdx++
        if (wordIdx < words.length) {
          setCurrentWordIndex(wordIdx)
        } else {
          setCurrentWordIndex(null)
          if (wordHighlightTimerRef.current) clearInterval(wordHighlightTimerRef.current)
        }
      }, intervalPerWord)
    } else {
      setCurrentWordIndex(null)
    }
    return () => {
      if (wordHighlightTimerRef.current) clearInterval(wordHighlightTimerRef.current)
    }
  }, [isPlaying, currentPlayingAyah, isAudioLoading, verses, playbackSpeed])

  // Cleanup voice following on unmount
  useEffect(() => {
    return () => {
      if (voiceFollowStreamRef.current) {
        voiceFollowStreamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  // ─── AI Tajweed Feedback ────────────────────────────────────
  const fetchAiTajweedFeedback = useCallback(async (transcription: string, expectedText: string) => {
    setIsFetchingFeedback(true)
    setAiTajweedFeedback(null)
    try {
      const res = await fetch('/api/ustaz-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Sila analisis tajwid bacaan saya.\n\nAyat sebenar: ${expectedText}\nTranskripsi saya: ${transcription}\n\nBerikan analisis tajwid terperinci dalam Bahasa Melayu. Nyatakan kesilapan tajwid, sebutan yang perlu diperbaiki, dan cadangan penambahbaikan. Hadkan kepada 3-4 ayat.`,
          persona: 'ustaz-azhar',
        }),
      })
      const data = await res.json()
      if (data.success && data.response) {
        setAiTajweedFeedback(data.response)
      } else {
        setAiTajweedFeedback('Analisis tajwid tidak tersedia buat masa ini. Sila cuba lagi.')
      }
    } catch {
      setAiTajweedFeedback('Gagal menyambung ke Ustaz AI. Sila cuba lagi.')
    } finally {
      setIsFetchingFeedback(false)
    }
  }, [])

  return {
    // State
    isPlaying,
    currentPlayingAyah,
    reciter,
    setReciter,
    playbackSpeed,
    setPlaybackSpeed,
    repeatMode,
    setRepeatMode,
    showAudioSettings,
    setShowAudioSettings,
    isAudioLoading,
    audioError,
    abRepeatStart,
    setAbRepeatStart,
    abRepeatEnd,
    setAbRepeatEnd,
    isVoiceFollowing,
    voiceFollowAyah,
    currentWordIndex,
    aiTajweedFeedback,
    isFetchingFeedback,

    // Actions
    togglePlay,
    nextAyah,
    resetAudio,
    startVoiceFollowing,
    stopVoiceFollowing,
    fetchAiTajweedFeedback,
  }
}
