'use client'

import { motion } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import type { SearchResult } from './types'

interface QuranSearchResultsProps {
  showSearch: boolean
  setShowSearch: (v: boolean) => void
  searchResults: SearchResult[]
  isSearching: boolean
  openSurah: (id: number) => void
  setSearchQuery: (q: string) => void
}

export function QuranSearchResults({
  showSearch,
  setShowSearch,
  searchResults,
  isSearching,
  openSurah,
  setSearchQuery,
}: QuranSearchResultsProps) {
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
      <div className="max-h-[70vh] overflow-y-auto qp-scroll">
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
