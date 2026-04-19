'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { DHIKR_CATEGORIES } from './types'

export function useTasbih() {
  const {
    tasbihCount, tasbihTarget, tasbihTotal,
    incrementTasbih, resetTasbih, setTasbihTarget,
    tasbihVibration, setTasbihVibration,
    tasbihSound, setTasbihSound,
    tasbihVibrationPattern, setTasbihVibrationPattern,
    tasbihSessions, addTasbihSession,
    addXp
  } = useQuranPulseStore()

  const [selectedDhikr, setSelectedDhikr] = useState(0)
  const [activeCategory, setActiveCategory] = useState('general')
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [adhanEnabled, setAdhanEnabled] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const progress = Math.min((tasbihCount / tasbihTarget) * 100, 100)
  const isComplete = tasbihCount >= tasbihTarget

  const currentCategoryDhikr = DHIKR_CATEGORIES.find(c => c.id === activeCategory)?.items || DHIKR_CATEGORIES[3].items

  const dhikrList = currentCategoryDhikr

  // Set target from dhikr item
  useEffect(() => {
    if (dhikrList[selectedDhikr]) {
      setTasbihTarget(dhikrList[selectedDhikr].target)
    }
  }, [selectedDhikr, activeCategory, dhikrList, setTasbihTarget])

  const vibrationPatterns = {
    short: 10,
    medium: 30,
    long: 60,
  }

  const playTapSound = useCallback(() => {
    if (!tasbihSound) return
    try {
      // Create a short click sound using AudioContext
      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gain.gain.value = 0.1
      oscillator.start()
      oscillator.stop(ctx.currentTime + 0.05)
    } catch {
      // Audio not available
    }
  }, [tasbihSound])

  const playCompleteSound = useCallback(() => {
    if (!tasbihSound) return
    try {
      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.frequency.value = 523.25
      oscillator.type = 'sine'
      gain.gain.value = 0.15
      oscillator.start()
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      oscillator.stop(ctx.currentTime + 0.5)
    } catch {
      // Audio not available
    }
  }, [tasbihSound])

  const handleTap = useCallback(() => {
    incrementTasbih()
    if (tasbihVibration && navigator.vibrate) {
      navigator.vibrate(vibrationPatterns[tasbihVibrationPattern])
    }
    playTapSound()

    if (tasbihCount + 1 >= tasbihTarget) {
      addXp(25)
      playCompleteSound()
      // Completion celebration
      setShowCelebration(true)
      if (navigator.vibrate) navigator.vibrate([50, 50, 50, 50, 100])
      setTimeout(() => setShowCelebration(false), 2500)
      addTasbihSession({
        id: Date.now().toString(),
        dhikr: dhikrList[selectedDhikr]?.malay || '',
        count: tasbihCount + 1,
        target: tasbihTarget,
        timestamp: Date.now(),
        category: activeCategory,
      })
    }
  }, [tasbihCount, tasbihTarget, tasbihVibration, tasbihVibrationPattern, tasbihSound, selectedDhikr, activeCategory, dhikrList, incrementTasbih, addXp, addTasbihSession, playTapSound, playCompleteSound, vibrationPatterns])

  // Today's sessions
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todaySessions = tasbihSessions.filter(s => s.timestamp >= todayStart.getTime())
  const todayTotal = todaySessions.reduce((sum, s) => sum + s.count, 0) + tasbihCount

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setSelectedDhikr(0)
    resetTasbih()
  }

  const handleDhikrChange = (index: number) => {
    setSelectedDhikr(index)
    resetTasbih()
  }

  return {
    // State from store
    tasbihCount, tasbihTarget, tasbihTotal,
    incrementTasbih, resetTasbih, setTasbihTarget,
    tasbihVibration, setTasbihVibration,
    tasbihSound, setTasbihSound,
    tasbihVibrationPattern, setTasbihVibrationPattern,
    tasbihSessions,
    // Local state
    selectedDhikr, activeCategory,
    showSettings, setShowSettings,
    showHistory, setShowHistory,
    showCelebration, setShowCelebration,
    adhanEnabled, setAdhanEnabled,
    audioRef,
    // Computed
    progress, isComplete,
    dhikrList,
    vibrationPatterns,
    // Handlers
    handleTap,
    handleCategoryChange,
    handleDhikrChange,
    playTapSound,
    playCompleteSound,
    // Session stats
    todaySessions, todayTotal,
  }
}
