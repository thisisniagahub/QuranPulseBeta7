'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Search, BookOpen, Bookmark, Mic, X,
  Clock, Star, Trophy, Target, Grid3X3, Brain,
} from 'lucide-react'
import type { ReadingMode, FilterType } from './types'

interface QuranHeaderProps {
  readingMode: ReadingMode
  setReadingMode: (mode: ReadingMode) => void
  setView: (view: 'list' | 'reader') => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  showSearch: boolean
  setShowSearch: (v: boolean) => void
  filter: FilterType
  setFilter: (f: FilterType) => void
  dailyGoal: 5 | 10 | 20 | 30
  setDailyGoal: (g: 5 | 10 | 20 | 30) => void
  dailyGoalProgress: number
  pagesReadToday: number
  versesRead: number
  totalQuranVerses: number
  khatamJuzCount: number
  streak: number
  showStatsBar: boolean
}

const MODE_TABS: { key: ReadingMode; label: string; icon: React.ReactNode }[] = [
  { key: 'surah', label: 'Surah', icon: <BookOpen className="h-3.5 w-3.5" /> },
  { key: 'juz', label: 'Juz', icon: <Grid3X3 className="h-3.5 w-3.5" /> },
  { key: 'bookmarks', label: 'Tanda', icon: <Bookmark className="h-3.5 w-3.5" /> },
  { key: 'hafazan', label: 'Hafazan', icon: <Brain className="h-3.5 w-3.5" /> },
  { key: 'recite', label: 'Baca', icon: <Mic className="h-3.5 w-3.5" /> },
]

export function QuranHeader({
  readingMode,
  setReadingMode,
  setView,
  searchQuery,
  setSearchQuery,
  setShowSearch,
  filter,
  setFilter,
  dailyGoal,
  setDailyGoal,
  dailyGoalProgress,
  pagesReadToday,
  versesRead,
  totalQuranVerses,
  khatamJuzCount,
  streak,
  showStatsBar,
}: QuranHeaderProps) {
  return (
    <>
      {/* Mode Tabs */}
      <div className="flex gap-1 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {MODE_TABS.map(tab => (
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

      {/* Search Bar */}
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

      {/* Stats Bar */}
      {showStatsBar && (
        <div className="space-y-2 mb-3">
          {/* Daily Reading Goal */}
          <div className="rounded-xl p-3" style={{ background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(212,175,55,0.08))', border: '1px solid rgba(74,74,166,0.2)' }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
                <span className="text-[11px] font-semibold" style={{ color: '#d4af37' }}>Sasaran Harian</span>
              </div>
              <div className="flex items-center gap-1">
                {([5, 10, 20, 30] as const).map(g => (
                  <button key={g} className="px-1.5 py-1.5 rounded text-[9px] font-medium transition-all"
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
              <div className="text-sm font-bold" style={{ color: '#ffffff' }}>{streak}🔥</div>
              <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>hari berturut</div>
            </div>
          </div>
        </div>
      )}

      {/* Filter buttons */}
      {showStatsBar && (
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
      )}
    </>
  )
}
