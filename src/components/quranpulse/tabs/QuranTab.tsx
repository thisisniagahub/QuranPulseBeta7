'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Bookmark, ChevronLeft, ChevronRight, Share2, X, Filter } from 'lucide-react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { SURAH_LIST, getSurahVerses, getSurahName, type SurahInfo } from '@/lib/quran-data'

type FilterType = 'all' | 'meccan' | 'medinan'

export function QuranTab() {
  const [view, setView] = useState<'list' | 'reader'>('list')
  const [selectedSurah, setSelectedSurah] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const { isSurahBookmarked, toggleSurahBookmark, setLastRead, addXp } = useQuranPulseStore()

  const filteredSurahs = useMemo(() => {
    let list = SURAH_LIST
    if (filter === 'meccan') list = list.filter(s => s.revelationType === 'Meccan')
    if (filter === 'medinan') list = list.filter(s => s.revelationType === 'Medinan')
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(s =>
        s.name.includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.nameMs.toLowerCase().includes(q) ||
        s.id.toString() === q
      )
    }
    return list
  }, [filter, searchQuery])

  const verses = getSurahVerses(selectedSurah)
  const surahInfo = getSurahName(selectedSurah)

  const openSurah = (id: number) => {
    setSelectedSurah(id)
    setView('reader')
    setLastRead(id, 1)
    addXp(10)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            className="qp-scroll flex-1 overflow-y-auto px-4 pb-6 pt-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#F5F0E8' }}>Al-Quran</h2>
                <p className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>114 Surah · 30 Juz</p>
              </div>
              <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(27,107,90,0.15)' }}>
                <BookOpen className="h-4 w-4" style={{ color: '#1B6B5A' }} />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(245,240,232,0.3)' }} />
              <input
                type="text"
                placeholder="Cari surah..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none"
                style={{
                  background: 'rgba(10, 30, 61, 0.5)',
                  border: '1px solid rgba(27,107,90,0.15)',
                  color: '#F5F0E8',
                }}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" style={{ color: 'rgba(245,240,232,0.3)' }} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
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
                    background: filter === f.key ? 'rgba(27,107,90,0.2)' : 'rgba(10,30,61,0.3)',
                    color: filter === f.key ? '#1B6B5A' : 'rgba(245,240,232,0.5)',
                    border: `1px solid ${filter === f.key ? 'rgba(27,107,90,0.4)' : 'rgba(27,107,90,0.1)'}`,
                  }}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Surah List */}
            <div className="space-y-1.5">
              {filteredSurahs.map((surah, i) => (
                <motion.div
                  key={surah.id}
                  className="flex items-center justify-between rounded-xl p-3 cursor-pointer transition-transform active:scale-[0.98]"
                  style={{
                    background: 'rgba(10, 30, 61, 0.4)',
                    border: '1px solid rgba(27, 107, 90, 0.08)',
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  onClick={() => openSurah(surah.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold"
                      style={{ background: 'rgba(27,107,90,0.15)', color: '#1B6B5A' }}
                    >
                      {surah.id}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#F5F0E8' }}>
                        {surah.nameMs}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs" style={{ color: 'rgba(245,240,232,0.4)' }}>
                          {surah.versesCount} ayat
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                          background: surah.revelationType === 'Meccan' ? 'rgba(196,151,42,0.15)' : 'rgba(139,92,246,0.15)',
                          color: surah.revelationType === 'Meccan' ? '#C4972A' : '#8B5CF6',
                        }}>
                          {surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyyah'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-arabic" style={{ color: 'rgba(245,240,232,0.6)' }}>
                      {surah.name}
                    </span>
                    <button
                      className="p-1 rounded"
                      onClick={(e) => { e.stopPropagation(); toggleSurahBookmark(surah.id) }}
                    >
                      <Bookmark
                        className="h-4 w-4"
                        style={{ color: isSurahBookmarked(surah.id) ? '#C4972A' : 'rgba(245,240,232,0.2)' }}
                        fill={isSurahBookmarked(surah.id) ? '#C4972A' : 'none'}
                      />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredSurahs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: 'rgba(245,240,232,0.4)' }}>
                  Tiada surah ditemui
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            className="qp-scroll flex-1 overflow-y-auto px-4 pb-6 pt-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Reader Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                className="flex items-center gap-1 text-sm"
                style={{ color: '#1B6B5A' }}
                onClick={() => setView('list')}
              >
                <ChevronLeft className="h-5 w-5" /> Kembali
              </button>
              <div className="text-center">
                <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>
                  Surah {selectedSurah}
                </div>
                <div className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>
                  {surahInfo?.nameMs}
                </div>
              </div>
              <button
                className="p-2 rounded-lg"
                style={{ background: 'rgba(27,107,90,0.15)' }}
                onClick={() => toggleSurahBookmark(selectedSurah)}
              >
                <Bookmark
                  className="h-4 w-4"
                  style={{ color: isSurahBookmarked(selectedSurah) ? '#C4972A' : '#1B6B5A' }}
                  fill={isSurahBookmarked(selectedSurah) ? '#C4972A' : 'none'}
                />
              </button>
            </div>

            {/* Surah Info Banner */}
            <div
              className="rounded-xl p-4 mb-4 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(27,107,90,0.15), rgba(196,151,42,0.1))',
                border: '1px solid rgba(27,107,90,0.2)',
              }}
            >
              <div className="text-3xl font-arabic mb-1" style={{ color: '#F5F0E8' }}>
                {surahInfo?.name}
              </div>
              <div className="text-sm" style={{ color: 'rgba(245,240,232,0.7)' }}>
                {surahInfo?.nameEn} · {surahInfo?.versesCount} Ayat · {surahInfo?.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyyah'}
              </div>
            </div>

            {/* Bismillah */}
            {selectedSurah !== 9 && selectedSurah !== 1 && (
              <div className="text-center mb-4 py-3">
                <p className="text-2xl font-arabic" style={{ color: '#C4972A', direction: 'rtl' }}>
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                </p>
              </div>
            )}

            {/* Verses */}
            {verses.length > 0 ? (
              <div className="space-y-4">
                {verses.map((verse, i) => (
                  <motion.div
                    key={verse.verseNumber}
                    className="rounded-xl p-4"
                    style={{
                      background: 'rgba(10, 30, 61, 0.3)',
                      border: '1px solid rgba(27,107,90,0.08)',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'rgba(196,151,42,0.15)', color: '#C4972A' }}
                      >
                        {verse.verseNumber}
                      </div>
                      <div className="flex-1">
                        <p className="text-right text-xl leading-[2] font-arabic" style={{ color: '#F5F0E8', direction: 'rtl' }}>
                          {verse.arabic}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
                          {verse.translation}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-1 mt-2">
                      <button
                        className="p-1.5 rounded-lg text-xs"
                        style={{ background: 'rgba(27,107,90,0.1)' }}
                        onClick={() => addXp(2)}
                      >
                        <Bookmark className="h-3.5 w-3.5" style={{ color: '#1B6B5A' }} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-xs"
                        style={{ background: 'rgba(196,151,42,0.1)' }}
                      >
                        <Share2 className="h-3.5 w-3.5" style={{ color: '#C4972A' }} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-3" style={{ color: 'rgba(27,107,90,0.3)' }} />
                <p className="text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>
                  Ayat-ayat {surahInfo?.nameMs} akan dimuat turun...
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(245,240,232,0.3)' }}>
                  {surahInfo?.versesCount} ayat · Juz {surahInfo?.juz.join(', ')}
                </p>
              </div>
            )}

            {/* Surah Navigation */}
            <div className="flex justify-between mt-6">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs"
                style={{
                  background: 'rgba(10,30,61,0.5)',
                  border: '1px solid rgba(27,107,90,0.15)',
                  color: selectedSurah > 1 ? '#1B6B5A' : 'rgba(245,240,232,0.2)',
                }}
                disabled={selectedSurah <= 1}
                onClick={() => { setSelectedSurah(Math.max(1, selectedSurah - 1)); setLastRead(selectedSurah - 1, 1) }}
              >
                <ChevronLeft className="h-4 w-4" /> Sebelum
              </button>
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs"
                style={{
                  background: 'rgba(27,107,90,0.15)',
                  border: '1px solid rgba(27,107,90,0.3)',
                  color: '#1B6B5A',
                }}
                disabled={selectedSurah >= 114}
                onClick={() => { setSelectedSurah(Math.min(114, selectedSurah + 1)); setLastRead(selectedSurah + 1, 1) }}
              >
                Seterusnya <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
