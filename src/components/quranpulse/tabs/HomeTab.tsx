'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Bot, GraduationCap, CircleDot, Compass, Clock, Share2, Bookmark, ChevronRight, Flame, Star, Volume2, Headphones, Brain, Zap, Target, Shield, ExternalLink, Award, Calendar, Sparkles } from 'lucide-react'
import { useQuranPulseStore, type ActiveTab } from '@/stores/quranpulse-store'
import { getDailyVerse, getIslamicGreeting, getDailyHikmah, PRAYER_TIMES_KL, getCurrentPrayerIndex, getSurahName, SURAH_LIST, type DailyVerse } from '@/lib/quran-data'
import type { PrayerTimes } from '@/lib/jakim-service'
import { jakimService } from '@/lib/jakim-service'

// ─── Hadith of the Day for HomeTab ─────────────────────────
const HOME_HADITHS = [
  { text: 'Sesungguhnya amalan itu bergantung kepada niatnya.', source: 'Riwayat Bukhari & Muslim' },
  { text: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain.', source: 'Riwayat Ahmad' },
  { text: 'Senyummu kepada saudaramu adalah sedekah.', source: 'Riwayat At-Tirmidzi' },
  { text: 'Harta tidak akan berkurang kerana sedekah.', source: 'Riwayat Muslim' },
  { text: 'Orang mukmin yang paling sempurna imannya ialah yang paling baik akhlaknya.', source: 'Riwayat Abu Daud' },
  { text: 'Sesungguhnya Allah itu indah dan mencintai keindahan.', source: 'Riwayat Muslim' },
  { text: 'Janganlah kamu marah. Janganlah kamu marah.', source: 'Riwayat Bukhari' },
  { text: 'Barangsiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan ke syurga.', source: 'Riwayat Muslim' },
  { text: 'Dua nikmat yang kebanyakan manusia tertipu padanya: nikmat sihat dan nikmat waktu lapang.', source: 'Riwayat Bukhari' },
  { text: 'Sesungguhnya Allah tidak melihat kepada rupa dan harta kamu, tetapi Dia melihat kepada hati dan amalan kamu.', source: 'Riwayat Muslim' },
  { text: 'Barangsiapa yang beriman kepada Allah dan hari akhirat, maka hendaklah ia berkata yang baik atau diam.', source: 'Riwayat Bukhari & Muslim' },
  { text: 'Cintailah untuk manusia apa yang kamu cintai untuk dirimu sendiri.', source: 'Riwayat Ibnu Majah' },
  { text: 'Sesungguhnya syurga itu dikelilingi oleh perkara-perkara yang dibenci, dan neraka itu dikelilingi oleh syahwat.', source: 'Riwayat Bukhari & Muslim' },
  { text: 'Tunduklah kamu kepada Allah yang telah memberi nikmat kepadamu, nescaya Dia akan menambah nikmat-Nya kepadamu.', source: 'Riwayat Abu Nu\'aim' },
  { text: 'Perbanyakkan mengingati penghancur kelezatan iaitu kematian.', source: 'Riwayat An-Nasai' },
]

// ─── Daily Challenges ──────────────────────────────────────
const DAILY_CHALLENGES = [
  { title: 'Baca 10 ayat Al-Quran', icon: '📖', xp: 30, type: 'quran' as const },
  { title: 'Sebarkan salam kepada 5 orang', icon: '🤝', xp: 20, type: 'social' as const },
  { title: 'Solat Dhuha 2 rakaat', icon: '🌅', xp: 25, type: 'prayer' as const },
  { title: 'Bertasbih 33 kali selepas solat', icon: '📿', xp: 15, type: 'dhikr' as const },
  { title: 'Baca Surah Al-Kahf', icon: '📗', xp: 50, type: 'quran' as const },
  { title: 'Bersedekah hari ini', icon: '💝', xp: 35, type: 'charity' as const },
  { title: 'Hafaz satu ayat baru', icon: '🧠', xp: 40, type: 'hafazan' as const },
  { title: 'Solat tahajjud 2 rakaat', icon: '🌙', xp: 45, type: 'prayer' as const },
  { title: 'Baca Asmaul Husna', icon: '✨', xp: 20, type: 'dhikr' as const },
  { title: 'Bantu seseorang hari ini', icon: '🤲', xp: 30, type: 'charity' as const },
]

// ─── Monthly Islamic Milestones ─────────────────────────────
const ISLAMIC_MILESTONES = [
  { id: 'solat-30', label: 'Solat 30 hari berturut', icon: '🕌', xp: 200 },
  { id: 'quran-juz', label: 'Selesaikan 1 Juz', icon: '📖', xp: 150 },
  { id: 'tasbih-1k', label: 'Tasbih 1,000 kali', icon: '📿', xp: 100 },
  { id: 'hafaz-surah', label: 'Hafaz surah baru', icon: '🧠', xp: 250 },
  { id: 'iqra-6', label: 'Selesaikan Iqra 6', icon: '🎓', xp: 500 },
  { id: 'dua-morning', label: 'Azkar Pagi 7 hari', icon: '🌅', xp: 75 },
]

// ─── Animated Number Component ─────────────────────────────
function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current === value) return
    const start = prevValue.current
    const end = value
    const duration = 500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * eased)
      setDisplayValue(current)
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        prevValue.current = value
      }
    }
    requestAnimationFrame(animate)
  }, [value])

  return <span className={className}>{displayValue.toLocaleString()}</span>
}

// ─── Circular Progress Ring ────────────────────────────────
function CircularProgressRing({ progress, size, strokeWidth, color }: { progress: number; size: number; strokeWidth: number; color: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(74,74,166,0.1)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  )
}

// ─── Shimmer Loading Component ──────────────────────────────
function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className || ''}`}
      style={{ background: 'rgba(74,74,166,0.08)' }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(74,74,166,0.06), transparent)',
          animation: 'shimmer 1.5s infinite',
        }}
      />
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}</style>
    </div>
  )
}

export function HomeTab() {
  const { streak, xp, level, lastReadSurah, lastReadAyah, lastReadSurahName, setActiveTab, addXp, selectedZone } = useQuranPulseStore()

  // Defer ALL date-dependent values to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)
  const [livePrayers, setLivePrayers] = useState<PrayerTimes | null>(null)
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showWordBreakdown, setShowWordBreakdown] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const prevLevel = useRef(level)

  // Compute date-dependent values via useMemo (avoids setState in effect)
  const greeting = useMemo(() => getIslamicGreeting(), [])
  const currentPrayerIdx = useMemo(() => getCurrentPrayerIndex(), [])
  const dailyVerse = useMemo(() => getDailyVerse(new Date().getDate()), [])
  const hikmah = useMemo(() => getDailyHikmah(), [])
  const dayOfYear = useMemo(() => Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  ), [])
  const hadith = HOME_HADITHS[dayOfYear % HOME_HADITHS.length]
  const challenge = DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length]
  const hijriDate = useMemo(() => {
    const now = new Date()
    const hijri = jakimService.gregorianToHijri(now)
    return `${hijri.day} ${hijri.monthNameMs} ${hijri.year}H`
  }, [])
  const gregorianDate = useMemo(() =>
    new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  , [])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch live prayer times
  useEffect(() => {
    async function fetchPrayers() {
      try {
        const res = await fetch(`/api/jakim/solat?zone=${selectedZone}`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setLivePrayers(data.data)
          }
        }
      } catch {
        // Fallback
      }
    }
    fetchPrayers()
  }, [selectedZone])

  // Level up animation
  useEffect(() => {
    if (mounted && level > prevLevel.current) {
      // Use setTimeout to defer state update and avoid synchronous re-render in effect
      const showTimer = setTimeout(() => setShowLevelUp(true), 0)
      const hideTimer = setTimeout(() => setShowLevelUp(false), 3000)
      return () => {
        clearTimeout(showTimer)
        clearTimeout(hideTimer)
      }
    }
    prevLevel.current = level
  }, [level, mounted])

  // Countdown timer to next prayer
  useEffect(() => {
    if (!mounted) return

    const prayerList = livePrayers
      ? [
          { name: 'Subuh', time: livePrayers.fajr },
          { name: 'Syuruk', time: livePrayers.syuruk },
          { name: 'Zohor', time: livePrayers.dhuhr },
          { name: 'Asar', time: livePrayers.asr },
          { name: 'Maghrib', time: livePrayers.maghrib },
          { name: 'Isyak', time: livePrayers.isha },
        ]
      : PRAYER_TIMES_KL.map(p => ({ name: p.nameMs, time: p.time }))

    const updateCountdown = () => {
      const now = new Date()
      const currentTotal = now.getHours() * 60 + now.getMinutes()

      let nextPrayerIdx = 0
      for (let i = 0; i < prayerList.length; i++) {
        const parts = prayerList[i].time.split(':')
        const h = parseInt(parts[0] || '0')
        const m = parseInt(parts[1] || '0')
        if (currentTotal < h * 60 + m) {
          nextPrayerIdx = i
          break
        }
        if (i === prayerList.length - 1) nextPrayerIdx = 0
      }

      const nextParts = prayerList[nextPrayerIdx].time.split(':')
      const nextH = parseInt(nextParts[0] || '0')
      const nextM = parseInt(nextParts[1] || '0')

      let diffMinutes = nextH * 60 + nextM - currentTotal
      if (diffMinutes < 0) diffMinutes += 24 * 60

      const hours = Math.floor(diffMinutes / 60)
      const minutes = diffMinutes % 60
      const seconds = 60 - now.getSeconds()

      setCountdown({ hours, minutes, seconds: seconds >= 60 ? 0 : seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [mounted, livePrayers])

  const quickActions = [
    { icon: <BookOpen className="h-5 w-5" />, label: 'Baca Quran', tab: 'quran' as ActiveTab, color: '#4a4aa6' },
    { icon: <Bot className="h-5 w-5" />, label: 'Ustaz AI', tab: 'ustaz-ai' as ActiveTab, color: '#d4af37' },
    { icon: <Clock className="h-5 w-5" />, label: 'Waktu Solat', tab: 'ibadah' as ActiveTab, color: '#6a6ab6' },
    { icon: <GraduationCap className="h-5 w-5" />, label: 'Iqra Digital', tab: 'iqra' as ActiveTab, color: '#d4af37' },
    { icon: <CircleDot className="h-5 w-5" />, label: 'Tasbih', tab: 'ibadah' as ActiveTab, color: '#4a4aa6' },
    { icon: <Compass className="h-5 w-5" />, label: 'Kiblat', tab: 'ibadah' as ActiveTab, color: '#e0c060' },
  ]

  // Weekly activity heatmap (deterministic — no Math.random in render)
  const [activityData, setActivityData] = useState<Array<{ day: string; level: number; active: boolean }>>([])

  useEffect(() => {
    // Only compute if not already initialized
    if (activityData.length > 0) return
    const weekDays = ['Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab', 'Ahd']
    const dayOfWeek = new Date().getDay()
    // Seeded pseudo-random based on date for consistent values per day
    const seed = new Date().getDate()
    const seededRand = (i: number) => ((seed * (i + 1) * 7 + 13) % 4) + 1
    const data = Array.from({ length: 7 }).map((_, i) => {
      const adjustedIdx = (i + 1) % 7
      const isActive = adjustedIdx <= dayOfWeek || adjustedIdx === 0
      return {
        day: weekDays[i],
        level: isActive ? seededRand(i) : 0,
        active: isActive,
      }
    })
    setActivityData(data)
  }, [])

  const prayerProgress = countdown.hours * 60 + countdown.minutes > 0
    ? Math.max(0, 100 - ((countdown.hours * 60 + countdown.minutes) / 180) * 100)
    : 0

  const nextPrayerName = (() => {
    if (!mounted) return 'Subuh'
    const prayerList = livePrayers
      ? [
          { name: 'Subuh', time: livePrayers.fajr },
          { name: 'Syuruk', time: livePrayers.syuruk },
          { name: 'Zohor', time: livePrayers.dhuhr },
          { name: 'Asar', time: livePrayers.asr },
          { name: 'Maghrib', time: livePrayers.maghrib },
          { name: 'Isyak', time: livePrayers.isha },
        ]
      : PRAYER_TIMES_KL.map(p => ({ name: p.nameMs, time: p.time }))

    const now = new Date()
    const currentTotal = now.getHours() * 60 + now.getMinutes()
    for (let i = 0; i < prayerList.length; i++) {
      const parts = prayerList[i].time.split(':')
      const h = parseInt(parts[0] || '0')
      const m = parseInt(parts[1] || '0')
      if (currentTotal < h * 60 + m) return prayerList[i].name
    }
    return 'Subuh'
  })()

  return (
    <div className="qp-scroll flex-1 overflow-y-auto px-4 pb-6 pt-2">
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
              transition={{ type: 'tween', duration: 0.5 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ type: 'tween', duration: 0.5, repeat: 3 }}
              >
                🎉
              </motion.div>
              <div className="text-3xl font-bold" style={{ color: '#d4af37' }}>
                Level Up!
              </div>
              <div className="text-xl font-bold mt-2" style={{ color: '#ffffff' }}>
                Level {level}
              </div>
              <div className="text-sm mt-1" style={{ color: 'rgba(204,204,204,0.7)' }}>
                Tahniah! Anda naik level!
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Bismillah Greeting Card ═══ */}
      <motion.div
        className="rounded-xl p-4 mb-3 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(74,74,166,0.08))',
          border: '1px solid rgba(212,175,55,0.2)',
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center font-arabic text-2xl"
          style={{ color: '#d4af37', direction: 'rtl' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        >
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </motion.div>
        <motion.div
          className="text-center text-[10px] mt-1"
          style={{ color: 'rgba(212,175,55,0.6)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Dengan nama Allah Yang Maha Pemurah Lagi Maha Penyayang
        </motion.div>
      </motion.div>

      {/* ═══ Hijri + Gregorian Date Display ═══ */}
      {mounted && (
        <motion.div
          className="flex items-center justify-center gap-2 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <Calendar className="h-3 w-3" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>{hijriDate}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.2)' }}>
            <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.6)' }}>{gregorianDate}</span>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>
              {mounted ? greeting : 'Assalamualaikum'} 👋
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(204,204,204,0.6)' }}>
              Mari teruskan perjalanan Quran anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.3)' }}>
              <Star className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
              <span className="text-xs font-semibold" style={{ color: '#d4af37' }}>Lv.{level}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Streak & XP Cards with Glass Morphism */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <motion.div
          className="rounded-xl p-4 relative overflow-hidden backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(74,74,166,0.25), rgba(74,74,166,0.08))',
            border: '1px solid rgba(74,74,166,0.3)',
            backdropFilter: 'blur(10px)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="absolute top-2 right-2 opacity-20">
            <Flame className="h-12 w-12" style={{ color: '#4a4aa6' }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: '#ffffff' }}>
            <AnimatedNumber value={streak} />
          </div>
          <div className="text-xs text-white/80 mt-1">Hari Berturut-turut</div>
          <div className="mt-2 h-1 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'rgba(74,74,166,0.6)' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
        </motion.div>
        <motion.div
          className="rounded-xl p-4 relative overflow-hidden backdrop-blur-sm"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
            border: '1px solid rgba(212,175,55,0.3)',
            backdropFilter: 'blur(10px)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="absolute top-2 right-2 opacity-20">
            <Star className="h-12 w-12" style={{ color: '#d4af37' }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: '#ffffff' }}>
            <AnimatedNumber value={xp} />
          </div>
          <div className="text-xs text-white/80 mt-1">XP · Level {level}</div>
          <div className="mt-2 h-1 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'rgba(212,175,55,0.6)' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((xp % 500) / 500 * 100, 100)}%` }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Weekly Activity Heatmap */}
      <motion.div
        className="mt-4 rounded-xl p-4"
        style={{
          background: 'rgba(42,42,106,0.3)',
          border: '1px solid rgba(74,74,166,0.1)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>Aktiviti Mingguan</span>
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Ibadah harian</span>
        </div>
        <div className="flex gap-1.5 items-end justify-between">
          {activityData.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-8 rounded-sm transition-all"
                style={{
                  height: `${Math.max(8, day.level * 10)}px`,
                  background: day.level === 0
                    ? 'rgba(74,74,166,0.08)'
                    : day.level === 1
                    ? 'rgba(74,74,166,0.2)'
                    : day.level === 2
                    ? 'rgba(74,74,166,0.35)'
                    : day.level === 3
                    ? 'rgba(74,74,166,0.5)'
                    : 'rgba(74,74,166,0.7)',
                }}
              />
              <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{day.day}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ═══ Monthly Challenge Tracker ═══ */}
      <motion.div
        className="mt-4 rounded-xl p-4"
        style={{
          background: 'rgba(42,42,106,0.3)',
          border: '1px solid rgba(74,74,166,0.12)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.33, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>Cabaran Bulanan</span>
          </div>
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Milestones Islam</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {ISLAMIC_MILESTONES.map((milestone, i) => (
            <motion.button
              key={milestone.id}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-transform active:scale-95"
              style={{
                background: 'rgba(74,74,166,0.08)',
                border: '1px solid rgba(74,74,166,0.12)',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.04 }}
              onClick={() => {
                addXp(5)
                if (navigator.vibrate) navigator.vibrate(5)
              }}
              whileTap={{ scale: 0.92 }}
            >
              <span className="text-lg">{milestone.icon}</span>
              <span className="text-[8px] text-center leading-tight" style={{ color: 'rgba(204,204,204,0.7)' }}>{milestone.label}</span>
              <span className="text-[8px] font-semibold" style={{ color: '#d4af37' }}>+{milestone.xp}XP</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Smart Prayer Countdown */}
      {mounted ? (
        <motion.div
          className="mt-4 rounded-xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(74,74,166,0.05))',
            border: '1px solid rgba(74,74,166,0.2)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium" style={{ color: '#4a4aa6' }}>
                  Solat Seterusnya
                </span>
                {/* JAKIM Verified Badge */}
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.2)' }}>
                  <Shield className="h-2.5 w-2.5" style={{ color: '#4a4aa6' }} />
                  <span className="text-[7px] font-semibold" style={{ color: '#4a4aa6' }}>JAKIM</span>
                </div>
              </div>
              <div className="text-xl font-bold mt-1" style={{ color: '#ffffff' }}>
                {nextPrayerName}
              </div>
              <div className="text-2xl font-bold mt-1 font-mono" style={{ color: '#d4af37' }}>
                <motion.span key={countdown.hours} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
                  {String(countdown.hours).padStart(2, '0')}
                </motion.span>
                :
                <motion.span key={`m-${countdown.minutes}`} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
                  {String(countdown.minutes).padStart(2, '0')}
                </motion.span>
                :
                <motion.span key={`s-${countdown.seconds}`} initial={{ y: -5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.15 }}>
                  {String(countdown.seconds).padStart(2, '0')}
                </motion.span>
              </div>
              <div className="text-[10px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
                lagi sehingga waktu solat
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <CircularProgressRing
                progress={prayerProgress}
                size={80}
                strokeWidth={4}
                color="#4a4aa6"
              />
              <div className="absolute flex flex-col items-center justify-center">
                <Clock className="h-5 w-5" style={{ color: '#4a4aa6' }} />
              </div>
            </div>
          </div>
          <button
            className="mt-3 flex items-center gap-1 text-xs"
            style={{ color: '#4a4aa6' }}
            onClick={() => setActiveTab('ibadah')}
          >
            Lihat semua waktu solat <ChevronRight className="h-3 w-3" />
          </button>
        </motion.div>
      ) : (
        <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(74,74,166,0.08)', border: '1px solid rgba(74,74,166,0.2)' }}>
          <ShimmerBlock className="h-3 w-24 rounded mb-3" />
          <ShimmerBlock className="h-6 w-32 rounded mb-2" />
          <ShimmerBlock className="h-8 w-40 rounded" />
        </div>
      )}

      {/* Daily Verse Card */}
      {mounted && dailyVerse ? (
        <motion.div
          className="mt-4 rounded-xl p-5 relative overflow-hidden"
          style={{
            background: 'rgba(74, 74, 166, 0.08)',
            border: '1px solid rgba(74, 74, 166, 0.2)',
            borderLeft: '3px solid #d4af37',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {/* Decorative sparkle */}
          <div className="absolute top-3 right-3 opacity-15">
            <Sparkles className="h-8 w-8" style={{ color: '#d4af37' }} />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#4a4aa6' }}>
              📖 Ayat Hari Ini
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
              {dailyVerse.reference}
            </span>
          </div>
          <motion.p
            className="text-right text-2xl leading-[2.2] font-arabic"
            style={{ color: '#ffffff', direction: 'rtl' }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {dailyVerse.arabic}
          </motion.p>
          <motion.p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'rgba(204,204,204,0.7)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            {dailyVerse.translationMs}
          </motion.p>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-transform active:scale-95"
              style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.2)' }}
              onClick={() => {
                setIsPlayingAudio(!isPlayingAudio)
                // TTS playback
                if (!isPlayingAudio) {
                  fetch('/api/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: dailyVerse.arabic, lang: 'ar' }),
                  }).catch(() => {})
                }
                setTimeout(() => setIsPlayingAudio(false), 5000)
              }}
            >
              {isPlayingAudio ? <Headphones className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              {isPlayingAudio ? 'Bermain...' : 'Dengar'}
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-transform active:scale-95"
              style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.2)' }}
              onClick={() => setShowWordBreakdown(!showWordBreakdown)}
            >
              <Brain className="h-3 w-3" /> {showWordBreakdown ? 'Sembunyi' : 'Perkataan'}
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-transform active:scale-95"
              style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6', border: '1px solid rgba(74,74,166,0.2)' }}
            >
              <Bookmark className="h-3 w-3" /> Simpan
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-transform active:scale-95"
              style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.2)' }}
            >
              <Share2 className="h-3 w-3" /> Kongsi
            </button>
          </div>

          {/* Word-by-word breakdown */}
          <AnimatePresence>
            {showWordBreakdown && (
              <motion.div
                className="mt-3 pt-3"
                style={{ borderTop: '1px solid rgba(74,74,166,0.15)' }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="text-[10px] font-semibold mb-2" style={{ color: '#4a4aa6' }}>
                  Terjemahan Perkataan
                </div>
                <div className="flex flex-wrap gap-2">
                  {dailyVerse.arabic.split(' ').map((word, i) => (
                    <div
                      key={i}
                      className="px-2 py-1 rounded-lg text-center"
                      style={{ background: 'rgba(42,42,106,0.4)', border: '1px solid rgba(74,74,166,0.1)' }}
                    >
                      <div className="font-arabic text-sm" style={{ color: '#ffffff', direction: 'rtl' }}>{word}</div>
                      <div className="text-[8px] mt-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>perkataan {i + 1}</div>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium"
                  style={{
                    background: 'rgba(212,175,55,0.1)',
                    color: '#d4af37',
                    border: '1px solid rgba(212,175,55,0.2)',
                  }}
                  onClick={() => {
                    addXp(10)
                  }}
                >
                  <Target className="h-3.5 w-3.5" /> Hafaz Ayat Ini (+10 XP)
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rujuk islam.gov.my link */}
          <div className="mt-3 pt-2" style={{ borderTop: '1px solid rgba(74,74,166,0.08)' }}>
            <a
              href="https://www.islam.gov.my"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[9px] hover:underline"
              style={{ color: 'rgba(204,204,204,0.4)' }}
            >
              <ExternalLink className="h-2.5 w-2.5" /> Rujuk islam.gov.my untuk tafsir rasmi
            </a>
          </div>
        </motion.div>
      ) : (
        <div className="mt-4 rounded-xl p-5 relative overflow-hidden" style={{ background: 'rgba(74, 74, 166, 0.08)', border: '1px solid rgba(74, 74, 166, 0.2)', borderLeft: '3px solid #d4af37' }}>
          <ShimmerBlock className="h-3 w-24 rounded mb-3" />
          <ShimmerBlock className="mt-3 h-8 w-3/4 rounded mb-2" />
          <ShimmerBlock className="mt-3 h-4 w-full rounded" />
        </div>
      )}

      {/* Hadith of the Day */}
      {mounted ? (
        <motion.div
          className="mt-4 rounded-xl p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))',
            border: '1px solid rgba(212,175,55,0.15)',
            borderLeft: '3px solid #d4af37',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#d4af37' }}>
              📜 Hadis Hari Ini
            </span>
            <button
              className="text-[10px]"
              style={{ color: 'rgba(204,204,204,0.4)' }}
              onClick={() => setActiveTab('ibadah')}
            >
              Lihat semua →
            </button>
          </div>
          <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(204,204,204,0.8)' }}>
            &ldquo;{hadith.text}&rdquo;
          </p>
          <p className="text-[10px] mt-2" style={{ color: 'rgba(204,204,204,0.4)' }}>
            — {hadith.source}
          </p>
        </motion.div>
      ) : (
        <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
          <ShimmerBlock className="h-3 w-20 rounded mb-3" />
          <ShimmerBlock className="h-4 w-full rounded mb-1" />
          <ShimmerBlock className="h-4 w-3/4 rounded" />
        </div>
      )}

      {/* Quick Actions Grid */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ffffff' }}>
          Aksi Pantas
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              className="flex flex-col items-center gap-2 rounded-xl p-3 transition-transform active:scale-95"
              style={{
                background: 'rgba(42, 42, 106, 0.5)',
                border: '1px solid rgba(74, 74, 166, 0.12)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.05 }}
              onClick={() => {
                setActiveTab(action.tab)
                addXp(2)
                if (navigator.vibrate) navigator.vibrate(5)
              }}
              whileTap={{ scale: 0.92 }}
            >
              <motion.div
                className="h-9 w-9 rounded-lg flex items-center justify-center"
                style={{ background: `${action.color}20` }}
                whileTap={{ scale: 0.85, rotate: 5 }}
              >
                <div style={{ color: action.color }}>{action.icon}</div>
              </motion.div>
              <span className="text-[11px] font-medium" style={{ color: 'rgba(204,204,204,0.7)' }}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Continue Reading + Daily Challenge Row */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Continue Reading */}
        {lastReadSurah && (
          <motion.div
            className="rounded-xl p-3 cursor-pointer transition-transform active:scale-[0.98]"
            style={{
              background: 'rgba(42, 42, 106, 0.5)',
              border: '1px solid rgba(74, 74, 166, 0.15)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            onClick={() => {
              setActiveTab('quran')
              addXp(5)
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <BookOpen className="h-3 w-3" style={{ color: '#4a4aa6' }} />
              <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Sambung Baca</div>
            </div>
            <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>
              {lastReadSurahName}
            </div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
              Ayat {lastReadAyah}
            </div>
          </motion.div>
        )}

        {/* Daily Challenge */}
        <motion.div
          className="rounded-xl p-3 cursor-pointer transition-transform active:scale-[0.98]"
          style={{
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          onClick={() => addXp(5)}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="h-3 w-3" style={{ color: '#d4af37' }} />
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Cabaran Hari Ini</div>
          </div>
          <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>
            {challenge.icon} {challenge.title}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: '#d4af37' }}>
            +{challenge.xp} XP
          </div>
        </motion.div>
      </div>

      {/* Daily Hikmah */}
      <motion.div
        className="mt-4 mb-2 rounded-xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(74,74,166,0.1), rgba(212,175,55,0.08))',
          border: '1px solid rgba(212,175,55,0.15)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <div className="text-xs font-semibold mb-2" style={{ color: '#d4af37' }}>💡 Hikmah Hari Ini</div>
        <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(204,204,204,0.7)' }}>
          {hikmah}
        </p>
      </motion.div>

      {/* ═══ Malaysian Islamic Compliance Footer ═══ */}
      <motion.div
        className="mt-4 mb-2 rounded-xl p-3"
        style={{
          background: 'rgba(42,42,106,0.2)',
          border: '1px solid rgba(74,74,166,0.08)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <Shield className="h-3 w-3" style={{ color: '#4a4aa6' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#4a4aa6' }}>Disahkan Oleh JAKIM Malaysia</span>
        </div>
        <p className="text-[8px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.35)' }}>
          Waktu solat berdasarkan data JAKIM e-Solat. Hukum fiqh mengikut mazhab Syafie. Rujuk mufti negeri untuk hukum rasmi.
        </p>
        <a
          href="https://www.islam.gov.my"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[8px] mt-1 hover:underline"
          style={{ color: 'rgba(74,74,166,0.5)' }}
        >
          <ExternalLink className="h-2 w-2" /> Rujuk islam.gov.my
        </a>
      </motion.div>
    </div>
  )
}
