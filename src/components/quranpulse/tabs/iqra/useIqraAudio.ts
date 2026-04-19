'use client'
import { useState, useCallback, useRef } from 'react'
import type { LetterFilter } from './types'
import { ENHANCED_LETTERS } from './types'

interface UseIqraAudioProps {
  letterFilter: LetterFilter
}

export function useIqraAudio({ letterFilter }: UseIqraAudioProps) {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Derived: filtered letters (needed for autoplay)
  const filteredLetters = letterFilter === 'harakat' || letterFilter === 'tanwin' || letterFilter === 'mad'
    ? []
    : ENHANCED_LETTERS.filter(() => {
        if (letterFilter === 'all' || letterFilter === 'hijaiyah') return true
        return false
      })

  const playAudio = useCallback(async (text: string, id: string, speed?: number) => {
    if (playingAudio === id) return
    setPlayingAudio(id)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'tongtong', speed: speed || audioSpeed }),
      })
      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.onended = () => { URL.revokeObjectURL(url); setPlayingAudio(null) }
        audio.onerror = () => { URL.revokeObjectURL(url); setPlayingAudio(null) }
        await audio.play()
      } else { setPlayingAudio(null) }
    } catch { setPlayingAudio(null) }
  }, [playingAudio, audioSpeed])

  const startAutoPlay = useCallback(() => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false)
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current)
      return
    }
    setIsAutoPlaying(true)
    let idx = 0
    const playNext = () => {
      if (idx >= filteredLetters.length) { setIsAutoPlaying(false); return }
      const letter = filteredLetters[idx]
      playAudio(letter.name, `auto-${letter.id}`)
      idx++
      autoPlayRef.current = setTimeout(playNext, 2500)
    }
    playNext()
  }, [isAutoPlaying, filteredLetters, playAudio])

  return {
    playingAudio,
    audioSpeed, setAudioSpeed,
    isAutoPlaying,
    playAudio,
    startAutoPlay,
    filteredLetters,
  }
}
