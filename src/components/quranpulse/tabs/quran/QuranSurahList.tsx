'use client'

import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { type SurahInfo } from '@/lib/quran-data'

interface QuranSurahListProps {
  filteredSurahs: SurahInfo[]
  openSurah: (id: number) => void
  isSurahBookmarked: (id: number) => boolean
  toggleSurahBookmark: (id: number) => void
}

export function QuranSurahList({
  filteredSurahs,
  openSurah,
  isSurahBookmarked,
  toggleSurahBookmark,
}: QuranSurahListProps) {
  return (
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
                <span className="text-[10px] px-1.5 py-1.5 rounded" style={{
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
            <button className="p-1 rounded" onClick={(e) => { e.stopPropagation(); toggleSurahBookmark(surah.id) }}>
              <Bookmark className="h-4 w-4" style={{ color: isSurahBookmarked(surah.id) ? '#d4af37' : 'rgba(204,204,204,0.2)' }} fill={isSurahBookmarked(surah.id) ? '#d4af37' : 'none'} />
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
}
