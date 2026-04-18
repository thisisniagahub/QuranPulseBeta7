'use client'

import { motion } from 'framer-motion'
import { BookOpen, Bot, Moon, GraduationCap, CircleDot, Compass, Clock, Share2, Bookmark, ChevronRight, Flame, Star } from 'lucide-react'
import { useQuranPulseStore, type ActiveTab } from '@/stores/quranpulse-store'
import { getDailyVerse, getIslamicGreeting, getDailyHikmah, PRAYER_TIMES_KL, getCurrentPrayerIndex, getSurahName, SURAH_LIST } from '@/lib/quran-data'

export function HomeTab() {
  const { streak, xp, level, lastReadSurah, lastReadAyah, lastReadSurahName, setActiveTab, addXp } = useQuranPulseStore()
  const dailyVerse = getDailyVerse(new Date().getDate())
  const greeting = getIslamicGreeting()
  const hikmah = getDailyHikmah()
  const currentPrayerIdx = getCurrentPrayerIndex()

  const quickActions = [
    { icon: <BookOpen className="h-5 w-5" />, label: 'Baca Quran', tab: 'quran' as ActiveTab, color: '#1B6B5A' },
    { icon: <Bot className="h-5 w-5" />, label: 'Ustaz AI', tab: 'ustaz-ai' as ActiveTab, color: '#C4972A' },
    { icon: <Clock className="h-5 w-5" />, label: 'Waktu Solat', tab: 'ibadah' as ActiveTab, color: '#8B5CF6' },
    { icon: <GraduationCap className="h-5 w-5" />, label: 'Iqra Digital', tab: 'iqra' as ActiveTab, color: '#EC4899' },
    { icon: <CircleDot className="h-5 w-5" />, label: 'Tasbih', tab: 'ibadah' as ActiveTab, color: '#10B981' },
    { icon: <Compass className="h-5 w-5" />, label: 'Kiblat', tab: 'ibadah' as ActiveTab, color: '#F59E0B' },
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
            <h2 className="text-xl font-bold" style={{ color: '#F5F0E8' }}>
              {greeting} 👋
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(245,240,232,0.5)' }}>
              Mari teruskan perjalanan Quran anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(27,107,90,0.15)', border: '1px solid rgba(27,107,90,0.3)' }}>
              <Star className="h-3.5 w-3.5" style={{ color: '#C4972A' }} />
              <span className="text-xs font-semibold" style={{ color: '#C4972A' }}>Lv.{level}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Streak & XP Cards */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <motion.div
          className="rounded-xl p-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1B6B5A 0%, #2A8B74 100%)' }}
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
          style={{ background: 'linear-gradient(135deg, #C4972A 0%, #D4A84A 100%)' }}
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
          <h3 className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>Waktu Solat</h3>
          <button
            className="text-xs flex items-center gap-1"
            style={{ color: '#1B6B5A' }}
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
                    ? 'linear-gradient(135deg, rgba(27,107,90,0.3), rgba(27,107,90,0.15))'
                    : 'rgba(10, 30, 61, 0.5)',
                  border: isNext ? '1px solid rgba(27,107,90,0.5)' : '1px solid rgba(27,107,90,0.1)',
                  ringColor: '#1B6B5A',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + idx * 0.05 }}
              >
                <div className="text-center">
                  <span className="text-lg">{prayer.icon}</span>
                  <div className="text-[10px] mt-1 font-medium" style={{ color: isNext ? '#1B6B5A' : 'rgba(245,240,232,0.5)' }}>
                    {prayer.nameMs}
                  </div>
                  <div className="text-sm font-bold mt-0.5" style={{ color: isNext ? '#1B6B5A' : '#F5F0E8' }}>
                    {prayer.time}
                  </div>
                  {isNext && (
                    <div className="text-[9px] mt-1 px-1.5 py-0.5 rounded-full inline-block" style={{ background: 'rgba(27,107,90,0.2)', color: '#1B6B5A' }}>
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
      <motion.div
        className="mt-4 rounded-xl p-5 relative overflow-hidden"
        style={{
          background: 'rgba(27, 107, 90, 0.08)',
          border: '1px solid rgba(27, 107, 90, 0.2)',
          borderLeft: '3px solid #C4972A',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: '#1B6B5A' }}>
            📖 Ayat Hari Ini
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(196,151,42,0.15)', color: '#C4972A' }}>
            {dailyVerse.reference}
          </span>
        </div>
        <p className="text-right text-2xl leading-[2.2] font-arabic" style={{ color: '#F5F0E8', direction: 'rtl' }}>
          {dailyVerse.arabic}
        </p>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.7)' }}>
          {dailyVerse.translationMs}
        </p>
        <div className="flex gap-2 mt-3">
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-transform active:scale-95"
            style={{ background: 'rgba(27,107,90,0.15)', color: '#1B6B5A', border: '1px solid rgba(27,107,90,0.2)' }}
          >
            <Bookmark className="h-3 w-3" /> Simpan
          </button>
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-transform active:scale-95"
            style={{ background: 'rgba(196,151,42,0.15)', color: '#C4972A', border: '1px solid rgba(196,151,42,0.2)' }}
          >
            <Share2 className="h-3 w-3" /> Kongsi
          </button>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#F5F0E8' }}>
          Aksi Pantas
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              className="flex flex-col items-center gap-2 rounded-xl p-3 transition-transform active:scale-95"
              style={{
                background: 'rgba(10, 30, 61, 0.5)',
                border: '1px solid rgba(27, 107, 90, 0.12)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.05 }}
              onClick={() => setActiveTab(action.tab)}
            >
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: `${action.color}20` }}>
                <div style={{ color: action.color }}>{action.icon}</div>
              </div>
              <span className="text-[11px] font-medium" style={{ color: 'rgba(245,240,232,0.7)' }}>
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
              background: 'rgba(10, 30, 61, 0.5)',
              border: '1px solid rgba(27, 107, 90, 0.15)',
            }}
            onClick={() => {
              setActiveTab('quran')
              addXp(5)
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Sambung Baca</div>
                <div className="text-sm font-semibold mt-1" style={{ color: '#F5F0E8' }}>
                  {lastReadSurahName} · Ayat {lastReadAyah}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" style={{ color: '#1B6B5A' }} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Daily Hikmah */}
      <motion.div
        className="mt-4 mb-2 rounded-xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(27,107,90,0.1), rgba(196,151,42,0.08))',
          border: '1px solid rgba(196,151,42,0.15)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <div className="text-xs font-semibold mb-2" style={{ color: '#C4972A' }}>💡 Hikmah Hari Ini</div>
        <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(245,240,232,0.7)' }}>
          {hikmah}
        </p>
      </motion.div>
    </div>
  )
}
