'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Lock, CheckCircle, ChevronRight, Layers,
} from 'lucide-react'
import { IQRA_BOOKS, QURAN_VERSES_PER_BOOK, LEARNING_PATH } from './types'

interface IqraBookNavigatorProps {
  bookProgress: (bookId: number) => number
  setIqraBook: (book: number) => void
  setIqraPage: (page: number) => void
  setView: (view: 'books' | 'reader' | 'letters' | 'tajwid' | 'combined') => void
}

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Pemula': { bg: 'rgba(106,106,182,0.12)', text: '#6a6ab6', border: 'rgba(106,106,182,0.25)' },
  'Asas': { bg: 'rgba(74,74,166,0.12)', text: '#4a4aa6', border: 'rgba(74,74,166,0.25)' },
  'Pertengahan': { bg: 'rgba(212,175,55,0.12)', text: '#d4af37', border: 'rgba(212,175,55,0.25)' },
  'Lanjutan': { bg: 'rgba(224,192,96,0.12)', text: '#e0c060', border: 'rgba(224,192,96,0.25)' },
  'Mahir': { bg: 'rgba(58,58,138,0.12)', text: '#6a6ab6', border: 'rgba(58,58,138,0.25)' },
  'Mumtaz': { bg: 'rgba(42,42,106,0.15)', text: '#ffffff', border: 'rgba(42,42,106,0.3)' },
}

export function IqraBookNavigator({
  bookProgress,
  setIqraBook,
  setIqraPage,
  setView,
}: IqraBookNavigatorProps) {
  const [showCombined, setShowCombined] = useState(false)

  const isBookLocked = (bookId: number): boolean => {
    if (bookId === 1) return false
    return bookProgress(bookId - 1) < 50
  }

  const handleBookTap = (bookId: number) => {
    if (isBookLocked(bookId)) return
    setIqraBook(bookId)
    setIqraPage(1)
    setView('reader')
  }

  if (showCombined) {
    return (
      <div>
        {/* Combined View Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            className="flex items-center gap-1 text-xs"
            style={{ color: '#4a4aa6' }}
            onClick={() => setShowCombined(false)}
          >
            ← Kembali
          </button>
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#d4af37' }}>Paparan Gabungan</span>
          </div>
          <div style={{ width: 60 }} />
        </div>

        {/* Combined Siri — all 6 books in one scroll */}
        <div className="space-y-4">
          {IQRA_BOOKS.map((book, bookIdx) => {
            const prog = bookProgress(book.id)
            const path = LEARNING_PATH[bookIdx]
            return (
              <motion.div
                key={book.id}
                className="rounded-xl p-3"
                style={{
                  background: `linear-gradient(135deg, ${book.color}10, ${book.color}05)`,
                  border: `1px solid ${book.color}20`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: bookIdx * 0.05 }}
              >
                {/* Book header */}
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: `${book.color}20` }}
                  >
                    {book.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{book.title}</div>
                    <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{book.desc}</div>
                  </div>
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[8px] font-bold"
                    style={{
                      background: LEVEL_COLORS[book.level]?.bg || 'rgba(74,74,166,0.12)',
                      color: LEVEL_COLORS[book.level]?.text || '#4a4aa6',
                      border: `1px solid ${LEVEL_COLORS[book.level]?.border || 'rgba(74,74,166,0.2)'}`,
                    }}
                  >
                    {book.level}
                  </span>
                </div>

                {/* Focus */}
                <div className="text-[9px] mb-2" style={{ color: 'rgba(204,204,204,0.6)' }}>
                  🎯 {book.focus}
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: `${book.color}12` }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: book.color }}
                      animate={{ width: `${prog}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-bold" style={{ color: book.color }}>{prog}%</span>
                </div>

                {/* Quran verses preview */}
                {QURAN_VERSES_PER_BOOK[book.id] && (
                  <div className="mt-2 space-y-1.5">
                    {QURAN_VERSES_PER_BOOK[book.id].slice(0, 2).map((v, vi) => (
                      <div
                        key={vi}
                        className="rounded-lg p-2"
                        style={{ background: `${book.color}06`, border: `1px solid ${book.color}10` }}
                      >
                        <p className="text-sm leading-relaxed" style={{ color: '#ffffff', direction: 'rtl' }}>
                          {v.verse}
                        </p>
                        <p className="text-[9px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
                          {v.translation}
                        </p>
                        <p className="text-[8px] mt-0.5" style={{ color: 'rgba(204,204,204,0.3)' }}>
                          {v.surah}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Learning path step */}
                {path && (
                  <div className="mt-2 flex items-center gap-1">
                    <span
                      className="h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ background: `${book.color}15`, color: book.color, border: `1px solid ${book.color}25` }}
                    >
                      {path.step}
                    </span>
                    <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{path.desc}</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Pilih Buku Iqra</span>
        </div>
        {/* Combined View button */}
        <button
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-medium"
          style={{
            background: 'rgba(212,175,55,0.1)',
            color: '#d4af37',
            border: '1px solid rgba(212,175,55,0.2)',
          }}
          onClick={() => setShowCombined(true)}
        >
          <Layers className="h-3 w-3" />
          Gabungan
        </button>
      </div>

      {/* 2-column book grid */}
      <div className="grid grid-cols-2 gap-3">
        {IQRA_BOOKS.map((book, i) => {
          const prog = bookProgress(book.id)
          const locked = isBookLocked(book.id)
          const complete = prog >= 100

          return (
            <motion.button
              key={book.id}
              className="rounded-xl p-3 text-left relative overflow-hidden transition-transform active:scale-[0.97]"
              style={{
                background: `linear-gradient(135deg, ${book.color}12, ${book.color}05)`,
                border: `1px solid ${book.color}${locked ? '10' : '25'}`,
                opacity: locked ? 0.55 : 1,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: locked ? 0.55 : 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleBookTap(book.id)}
              disabled={locked}
            >
              {/* Lock overlay */}
              {locked && (
                <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: 'rgba(26,26,74,0.4)' }}>
                  <div className="flex flex-col items-center gap-1">
                    <Lock className="h-5 w-5" style={{ color: 'rgba(204,204,204,0.4)' }} />
                    <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Selesaikan Buku {book.id - 1}</span>
                  </div>
                </div>
              )}

              {/* Book icon + completion */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: `${book.color}20` }}
                >
                  {book.icon}
                </div>
                {complete ? (
                  <CheckCircle className="h-4 w-4" style={{ color: '#22c55e' }} />
                ) : prog > 0 ? (
                  <span className="text-[10px] font-bold" style={{ color: book.color }}>{prog}%</span>
                ) : null}
              </div>

              {/* Title & Description */}
              <div className="text-[11px] font-semibold mb-0.5" style={{ color: '#ffffff' }}>{book.title}</div>
              <div className="text-[9px] mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{book.desc}</div>

              {/* Level badge */}
              <div className="mb-2">
                <span
                  className="px-1.5 py-0.5 rounded-full text-[8px] font-bold"
                  style={{
                    background: LEVEL_COLORS[book.level]?.bg || 'rgba(74,74,166,0.12)',
                    color: LEVEL_COLORS[book.level]?.text || '#4a4aa6',
                    border: `1px solid ${LEVEL_COLORS[book.level]?.border || 'rgba(74,74,166,0.2)'}`,
                  }}
                >
                  {book.level}
                </span>
              </div>

              {/* Focus description */}
              <div className="text-[8px] leading-snug mb-2" style={{ color: 'rgba(204,204,204,0.4)' }}>
                🎯 {book.focus}
              </div>

              {/* Progress bar */}
              {prog > 0 && (
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${book.color}12` }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: complete ? '#22c55e' : book.color }}
                    animate={{ width: `${prog}%` }}
                  />
                </div>
              )}

              {/* Arrow if unlocked */}
              {!locked && !complete && (
                <div className="absolute bottom-2 right-2">
                  <ChevronRight className="h-3.5 w-3.5" style={{ color: `${book.color}60` }} />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Combined View button (larger) */}
      <button
        className="w-full mt-3 rounded-xl p-3 flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(74,74,166,0.08))',
          border: '1px solid rgba(212,175,55,0.15)',
        }}
        onClick={() => setShowCombined(true)}
      >
        <Layers className="h-4 w-4" style={{ color: '#d4af37' }} />
        <span className="text-[10px] font-medium" style={{ color: '#d4af37' }}>Paparan Gabungan — Semua 6 Siri</span>
      </button>

      {/* Unlock hint */}
      <div className="mt-2 text-center">
        <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.3)' }}>
          🔒 Buku seterusnya dibuka apabila buku sebelumnya mencapai 50%
        </span>
      </div>
    </div>
  )
}
