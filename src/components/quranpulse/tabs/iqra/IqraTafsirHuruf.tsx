'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Sparkles, Tag, BookOpen } from 'lucide-react'
import { ENHANCED_LETTERS, TAFSIR_HURUF_FUNGSI, type TafsirHuruf } from './types'

interface IqraTafsirHurufProps {
  playingAudio: string | null
  playAudio: (text: string, id: string) => void
}

// Category color mapping
const CATEGORY_COLORS: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  qalqalah: { dot: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)', text: '#ef4444' },
  madd: { dot: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
  thick: { dot: '#d4af37', bg: 'rgba(212,175,55,0.08)', border: 'rgba(212,175,55,0.15)', text: '#d4af37' },
  syafawi: { dot: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)', text: '#22c55e' },
  qamariyyah: { dot: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.15)', text: '#8b5cf6' },
  syamsiyyah: { dot: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.15)', text: '#f97316' },
  halqi: { dot: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.15)', text: '#06b6d4' },
  lisan: { dot: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.15)', text: '#a855f7' },
  lin: { dot: '#14b8a6', bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.15)', text: '#14b8a6' },
  tafkhim: { dot: '#eab308', bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.15)', text: '#eab308' },
}

function getCategoryStyle(cat: string) {
  const lower = cat.toLowerCase()
  for (const key of Object.keys(CATEGORY_COLORS)) {
    if (lower.includes(key)) return CATEGORY_COLORS[key]
  }
  return { dot: '#6a6ab6', bg: 'rgba(106,106,182,0.08)', border: 'rgba(106,106,182,0.15)', text: '#6a6ab6' }
}

// Get dot color for a tafsir property
function getPropertyDotColor(th: TafsirHuruf): Array<{ color: string; emoji: string; label: string; active: boolean }> {
  return [
    { color: '#ef4444', emoji: '🔴', label: 'Qalqalah', active: th.isQalqalah },
    { color: '#3b82f6', emoji: '🔵', label: 'Madd', active: th.isMadd },
    { color: '#d4af37', emoji: '🟡', label: 'Tebal', active: th.isThick },
    { color: '#22c55e', emoji: '🟢', label: 'Syafawi', active: th.isSyafawi },
    { color: '#8b5cf6', emoji: '🟣', label: 'Qamariyyah', active: th.isQamariyyah },
    { color: '#f97316', emoji: '🟠', label: 'Syamsiyyah', active: th.isSyamsiyyah },
  ]
}

export function IqraTafsirHuruf({ playingAudio, playAudio }: IqraTafsirHurufProps) {
  const [expandedLetter, setExpandedLetter] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  // Filter letters by category
  const filteredLetters = filterCategory
    ? TAFSIR_HURUF_FUNGSI.filter(th => th.categories.some(c => c.toLowerCase().includes(filterCategory.toLowerCase())))
    : TAFSIR_HURUF_FUNGSI

  // Get unique categories from all letters
  const allCategories = Array.from(new Set(TAFSIR_HURUF_FUNGSI.flatMap(th => th.categories))).sort()

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
            <Sparkles className="h-4 w-4" style={{ color: '#d4af37' }} />
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>Tafsir Huruf Fungsi</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Analisis fungsi setiap huruf dalam tajwid</div>
          </div>
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-1.5">
          {getPropertyDotColor(TAFSIR_HURUF_FUNGSI[0]).map(dot => (
            <div key={dot.label} className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: `${dot.color}10`, border: `1px solid ${dot.color}20` }}>
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: dot.color }} />
              <span className="text-[8px]" style={{ color: dot.color }}>{dot.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        <button
          className="shrink-0 px-2.5 py-1 rounded-full text-[9px] font-medium transition-all"
          style={{
            background: filterCategory === null ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.4)',
            border: `1px solid ${filterCategory === null ? 'rgba(212,175,55,0.25)' : 'transparent'}`,
            color: filterCategory === null ? '#d4af37' : 'rgba(204,204,204,0.5)',
          }}
          onClick={() => setFilterCategory(null)}
        >
          Semua ({TAFSIR_HURUF_FUNGSI.length})
        </button>
        {allCategories.map(cat => {
          const count = TAFSIR_HURUF_FUNGSI.filter(th => th.categories.includes(cat)).length
          const style = getCategoryStyle(cat)
          return (
            <button
              key={cat}
              className="shrink-0 px-2.5 py-1 rounded-full text-[9px] font-medium transition-all flex items-center gap-1"
              style={{
                background: filterCategory === cat ? style.bg : 'rgba(42,42,106,0.4)',
                border: `1px solid ${filterCategory === cat ? style.border : 'transparent'}`,
                color: filterCategory === cat ? style.text : 'rgba(204,204,204,0.5)',
              }}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
            >
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: style.dot }} />
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Letter Cards Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {filteredLetters.map((th, idx) => {
          const isExpanded = expandedLetter === th.letter
          const dots = getPropertyDotColor(th).filter(d => d.active)

          return (
            <motion.button
              key={th.letter}
              className="rounded-xl p-2 flex flex-col items-center justify-center gap-1 min-h-[80px] relative"
              style={{
                background: isExpanded ? 'rgba(212,175,55,0.1)' : 'rgba(42,42,106,0.3)',
                border: `1px solid ${isExpanded ? 'rgba(212,175,55,0.25)' : 'rgba(74,74,166,0.1)'}`,
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.015 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setExpandedLetter(isExpanded ? null : th.letter)}
            >
              <span
                className="text-2xl font-arabic leading-none"
                style={{
                  color: '#d4af37',
                  direction: 'rtl' as const,
                  textShadow: '0 0 10px rgba(212,175,55,0.2)',
                }}
              >
                {th.letter}
              </span>
              <span className="text-[8px] font-medium" style={{ color: 'rgba(204,204,204,0.6)' }}>
                {th.name}
              </span>
              {/* Dots row */}
              <div className="flex gap-0.5 mt-0.5">
                {dots.map((d, i) => (
                  <div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: d.color }}
                    title={d.label}
                  />
                ))}
              </div>
              {/* Category tags (show max 2) */}
              <div className="flex flex-wrap gap-0.5 justify-center mt-0.5">
                {th.categories.slice(0, 2).map((cat, i) => {
                  const style = getCategoryStyle(cat)
                  return (
                    <span
                      key={i}
                      className="text-[6px] px-1 py-0 rounded-full leading-tight"
                      style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                    >
                      {cat}
                    </span>
                  )
                })}
                {th.categories.length > 2 && (
                  <span className="text-[6px] px-1" style={{ color: 'rgba(204,204,204,0.4)' }}>
                    +{th.categories.length - 2}
                  </span>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Expanded Detail Panel */}
      <AnimatePresence>
        {expandedLetter && (() => {
          const th = TAFSIR_HURUF_FUNGSI.find(t => t.letter === expandedLetter)
          if (!th) return null
          const enhancedLetter = ENHANCED_LETTERS.find(el => el.letter === th.letter)
          const dots = getPropertyDotColor(th)

          return (
            <motion.div
              key={`detail-${th.letter}`}
              className="rounded-xl p-4"
              style={{
                background: 'rgba(42,42,106,0.3)',
                border: '1px solid rgba(212,175,55,0.15)',
              }}
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Letter Header */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="h-14 w-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid rgba(212,175,55,0.2)',
                  }}
                >
                  <span
                    className="text-4xl font-arabic leading-none"
                    style={{
                      color: '#d4af37',
                      direction: 'rtl' as const,
                      textShadow: '0 0 15px rgba(212,175,55,0.3)',
                    }}
                  >
                    {th.letter}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>{th.name}</div>
                  {enhancedLetter && (
                    <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{enhancedLetter.nameEn}</div>
                  )}
                  {/* Active dots */}
                  <div className="flex gap-1 mt-1">
                    {dots.map(d => (
                      <div
                        key={d.label}
                        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                        style={{
                          background: d.active ? d.color + '15' : 'rgba(42,42,106,0.3)',
                          border: `1px solid ${d.active ? d.color + '25' : 'rgba(74,74,166,0.08)'}`,
                          opacity: d.active ? 1 : 0.3,
                        }}
                      >
                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: d.active ? d.color : 'rgba(204,204,204,0.3)' }} />
                        <span className="text-[7px]" style={{ color: d.active ? d.color : 'rgba(204,204,204,0.3)' }}>{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Categories Detail */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Tag className="h-3 w-3" style={{ color: '#d4af37' }} />
                  <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Kategori</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {th.categories.map((cat, i) => {
                    const style = getCategoryStyle(cat)
                    return (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-lg text-[9px] font-medium"
                        style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
                      >
                        {cat}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <PropertyRow label="Qamariyyah" value={th.isQamariyyah} color="#8b5cf6" />
                <PropertyRow label="Syamsiyyah" value={th.isSyamsiyyah} color="#f97316" />
                <PropertyRow label="Qalqalah" value={th.isQalqalah} color="#ef4444" />
                <PropertyRow label="Madd" value={th.isMadd} color="#3b82f6" />
                <PropertyRow label="Lin" value={th.isLin} color="#14b8a6" />
                <PropertyRow label="Syafawi" value={th.isSyafawi} color="#22c55e" />
                <PropertyRow label="Tebal (Tafkhim)" value={th.isThick} color="#d4af37" />
                <PropertyRow label="Halqi" value={th.isHalqi} color="#06b6d4" />
              </div>

              {/* Pronunciation Guide */}
              {th.isThick && (
                <div className="rounded-lg p-2.5 mb-2" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <BookOpen className="h-3 w-3" style={{ color: '#d4af37' }} />
                    <span className="text-[9px] font-semibold" style={{ color: '#d4af37' }}>Sebutan Tebal (Tafkhim)</span>
                  </div>
                  <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.6)' }}>
                    Huruf {th.name} disebut dengan suara tebal dan padat. Mulut dibuka lebih luas dan suara dari dada.
                  </div>
                </div>
              )}
              {!th.isThick && !th.isQalqalah && !th.isMadd && (
                <div className="rounded-lg p-2.5 mb-2" style={{ background: 'rgba(106,106,182,0.06)', border: '1px solid rgba(106,106,182,0.12)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <BookOpen className="h-3 w-3" style={{ color: '#6a6ab6' }} />
                    <span className="text-[9px] font-semibold" style={{ color: '#6a6ab6' }}>Sebutan Nipis (Tarqiq)</span>
                  </div>
                  <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.6)' }}>
                    Huruf {th.name} disebut dengan suara nipis dan lembut.
                  </div>
                </div>
              )}

              {/* Dengar Button */}
              <button
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-medium transition-all"
                style={{
                  background: playingAudio === `tafsir-${th.letter}`
                    ? 'rgba(212,175,55,0.15)'
                    : 'rgba(212,175,55,0.08)',
                  border: `1px solid ${playingAudio === `tafsir-${th.letter}` ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.12)'}`,
                  color: playingAudio === `tafsir-${th.letter}` ? '#d4af37' : 'rgba(212,175,55,0.8)',
                }}
                onClick={() => playAudio(th.name, `tafsir-${th.letter}`)}
              >
                <Volume2 className="h-4 w-4" />
                Dengar sebutan {th.name}
              </button>
            </motion.div>
          )
        })()}
      </AnimatePresence>

      {/* IQRA Genius Footer */}
      <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <Sparkles className="h-3 w-3" style={{ color: '#d4af37' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>IQRA Genius</span>
        </div>
        <p className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
          Ketik mana-mana huruf untuk melihat analisis fungsi lengkap dalam tajwid.
          Setiap huruf mempunyai peranan unik dalam hukum tajwid Al-Quran.
        </p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#d4af37' }}>{TAFSIR_HURUF_FUNGSI.length}</div>
            <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Huruf</div>
          </div>
          <div className="h-6 w-px" style={{ background: 'rgba(74,74,166,0.2)' }} />
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#4a4aa6' }}>{allCategories.length}</div>
            <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Kategori</div>
          </div>
          <div className="h-6 w-px" style={{ background: 'rgba(74,74,166,0.2)' }} />
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#22c55e' }}>
              {TAFSIR_HURUF_FUNGSI.filter(t => t.isQalqalah).length}
            </div>
            <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Qalqalah</div>
          </div>
          <div className="h-6 w-px" style={{ background: 'rgba(74,74,166,0.2)' }} />
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: '#3b82f6' }}>
              {TAFSIR_HURUF_FUNGSI.filter(t => t.isMadd).length}
            </div>
            <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Madd</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Property row component
function PropertyRow({ label, value, color }: { label: string; value: boolean; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-2.5 py-2 rounded-lg"
      style={{
        background: value ? `${color}10` : 'rgba(26,26,74,0.5)',
        border: `1px solid ${value ? `${color}20` : 'rgba(74,74,166,0.06)'}`,
      }}
    >
      <div
        className="h-3 w-3 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: value ? color : 'rgba(204,204,204,0.15)',
          border: value ? 'none' : '1px solid rgba(204,204,204,0.2)',
        }}
      >
        {value && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span
        className="text-[9px] font-medium"
        style={{ color: value ? color : 'rgba(204,204,204,0.3)' }}
      >
        {label}
      </span>
    </div>
  )
}
