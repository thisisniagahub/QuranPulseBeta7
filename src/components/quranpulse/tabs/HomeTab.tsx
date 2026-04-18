'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Bot, Moon, GraduationCap, CircleDot, Compass, Clock, Share2, Bookmark, ChevronRight, Flame, Star } from 'lucide-react'
import { useQuranPulseStore, type ActiveTab } from '@/stores/quranpulse-store'
import { getDailyVerse, getIslamicGreeting, getDailyHikmah, PRAYER_TIMES_KL, getCurrentPrayerIndex, getSurahName, SURAH_LIST, type DailyVerse } from '@/lib/quran-data'

export function HomeTab() {
  const { streak, xp, level, lastReadSurah, lastReadAyah, lastReadSurahName, setActiveTab, addXp } = useQuranPulseStore()

  // Defer ALL date-dependent values to avoid hydration mismatch
  // (server and client may be in different timezones)
  const [greeting, setGreeting] = useState('Assalamualaikum')
  const [currentPrayerIdx, setCurrentPrayerIdx] = useState(0)
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null)
  const [hikmah, setHikmah] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setGreeting(getIslamicGreeting())
    setCurrentPrayerIdx(getCurrentPrayerIndex())
    setDailyVerse(getDailyVerse(new Date().getDate()))
    setHikmah(getDailyHikmah())
    setMounted(true)
  }, [])

  const quickActions = [
    { icon: <BookOpen className="h-5 w-5" />, label: 'Baca Quran', tab: 'quran' as ActiveTab, color: '#4a4aa6' },
    { icon: <Bot className="h-5 w-5" />, label: 'Ustaz AI', tab: 'ustaz-ai' as ActiveTab, color: '#d4af37' },
    { icon: <Clock className="h-5 w-5" />, label: 'Waktu Solat', tab: 'ibadah' as ActiveTab, color: '#6a6ab6' },
    { icon: <GraduationCap className="h-5 w-5" />, label: 'Iqra Digital', tab: 'iqra' as ActiveTab, color: '#d4af37' },
    { icon: <CircleDot className="h-5 w-5" />, label: 'Tasbih', tab: 'ibadah' as ActiveTab, color: '#4a4aa6' },
    { icon: <Compass className="h-5 w-5" />, label: 'Kiblat', tab: 'ibadah' as ActiveTab, color: '#e0c060' },
  ]

  return (
    <div className="qp-scroll flex-1 overflow-y-auto px-4 pb-6 pt-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#ffffff' }}>
              {greeting} 👋
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

      {/* Streak & XP Cards */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <motion.div
          className="rounded-xl p-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #4a4aa6 0%, #6a6ab6 100%)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="absolute top-2 right-2 opacity-20">
            <Flame className="h-12 w-12 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{streak}</div>
          <div className="text-xs text-white/80 mt-1">Hari Berturut-turut</div>
          <div className="mt-2 h-1 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white/60"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </div>
        </motion.div>
        <motion.div
          className="rounded-xl p-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #d4af37 0%, #e0c060 100%)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="absolute top-2 right-2 opacity-20">
            <Star className="h-12 w-12 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{xp.toLocaleString()}</div>
          <div className="text-xs text-white/80 mt-1">XP · Level {level}</div>
          <div className="mt-2 h-1 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-white/60"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((xp % 500) / 500 * 100, 100)}%` }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Prayer Times Strip */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Waktu Solat</h3>
          <button
            className="text-xs flex items-center gap-1"
            style={{ color: '#4a4aa6' }}
            onClick={() => setActiveTab('ibadah')}
          >
            Lihat semua <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {PRAYER_TIMES_KL.map((prayer, idx) => {
            const isNext = idx === currentPrayerIdx
            return (
              <motion.div
                key={prayer.name}
                className={`flex-shrink-0 rounded-xl p-3 min-w-[80px] ${isNext ? 'ring-1' : ''}`}
                style={{
                  background: isNext
                    ? 'linear-gradient(135deg, rgba(74,74,166,0.3), rgba(74,74,166,0.15))'
                    : 'rgba(42, 42, 106, 0.5)',
                  border: isNext ? '1px solid rgba(74,74,166,0.5)' : '1px solid rgba(74,74,166,0.1)',
                  ringColor: '#4a4aa6',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.05 }}
              >
                <div className="text-center">
                  <span className="text-lg">{prayer.icon}</span>
                  <div className="text-[10px] mt-1 font-medium" style={{ color: isNext ? '#4a4aa6' : 'rgba(204,204,204,0.5)' }}>
                    {prayer.nameMs}
                  </div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: isNext ? '#4a4aa6' : '#ffffff' }}>
                    {prayer.time}
                  </div>
                  {isNext && (
                    <div className="text-[9px] mt-1 px-1.5 py-0.5 rounded-full inline-block" style={{ background: 'rgba(74,74,166,0.2)', color: '#4a4aa6' }}>
                      Seterusnya
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

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
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#4a4aa6' }}>
              📖 Ayat Hari Ini
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37' }}>
              {dailyVerse.reference}
            </span>
          </div>
          <p className="text-right text-2xl leading-[2.2] font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>
            {dailyVerse.arabic}
          </p>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(204,204,204,0.7)' }}>
            {dailyVerse.translationMs}
          </p>
          <div className="flex gap-2 mt-3">
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
        </motion.div>
      ) : (
        <div
          className="mt-4 rounded-xl p-5 relative overflow-hidden animate-pulse"
          style={{
            background: 'rgba(74, 74, 166, 0.08)',
            border: '1px solid rgba(74, 74, 166, 0.2)',
            borderLeft: '3px solid #d4af37',
          }}
        >
          <div className="h-3 w-24 rounded" style={{ background: 'rgba(74,74,166,0.2)' }} />
          <div className="mt-3 h-8 w-3/4 rounded" style={{ background: 'rgba(74,74,166,0.15)' }} />
          <div className="mt-3 h-4 w-full rounded" style={{ background: 'rgba(74,74,166,0.1)' }} />
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
              onClick={() => setActiveTab(action.tab)}
            >
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: `${action.color}20` }}>
                <div style={{ color: action.color }}>{action.icon}</div>
              </div>
              <span className="text-[11px] font-medium" style={{ color: 'rgba(204,204,204,0.7)' }}>
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Continue Reading */}
      {lastReadSurah && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <div
            className="rounded-xl p-4 cursor-pointer transition-transform active:scale-[0.98]"
            style={{
              background: 'rgba(42, 42, 106, 0.5)',
              border: '1px solid rgba(74, 74, 166, 0.15)',
            }}
            onClick={() => {
              setActiveTab('quran')
              addXp(5)
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Sambung Baca</div>
                <div className="text-sm font-semibold mt-1" style={{ color: '#ffffff' }}>
                  {lastReadSurahName} · Ayat {lastReadAyah}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" style={{ color: '#4a4aa6' }} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
    </div>
  )
}
