'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, BookOpen, Eye, Palette, ChevronDown, ChevronUp, Star, CheckCircle, Zap } from 'lucide-react'
import { QURAN_VERSES_PER_BOOK, TAJWID_COLORS, IQRA_BOOKS } from './types'

// === Props ===
interface IqraTajwidReadingViewProps {
  iqraBook: number
  playingAudio: string | null
  playAudio: (text: string, id: string, speed?: number) => void
  audioSpeed: number
  addXp: (amount: number) => void
}

// === Rule name mapping for tooltips ===
const RULE_LABELS: Record<string, string> = {
  fathah: 'Fathah (baris atas)',
  kasrah: 'Kasrah (baris bawah)',
  dhammah: 'Dhammah (baris hadapan)',
  lamJalalah: 'Lam Jalalah (الله)',
  mad: 'Mad (Elongasi)',
  qalqalah: 'Qalqalah (Pantulan)',
  syamsiyyah: 'As-Syamsiyyah (huruf matahari)',
  qamariyyah: 'Al-Qamariyyah (huruf bulan)',
  tasydid: 'Tasydid (Gandaan)',
  izhar: 'Izhar (Jelas)',
  dengung: 'Dengung (Ghunnah)',
  wakaf: 'Wakaf (Berhenti)',
}

// === Color legend items ===
const LEGEND_ITEMS = [
  { key: 'dengung', emoji: '🟢', color: TAJWID_COLORS.dengung.color, label: 'Dengung (Ghunnah)', desc: 'Idgham, Ikhfa\', Iqlab' },
  { key: 'qalqalah', emoji: '🔴', color: TAJWID_COLORS.qalqalah.color, label: 'Qalqalah', desc: 'Pantulan' },
  { key: 'mad', emoji: '🔵', color: TAJWID_COLORS.mad.color, label: 'Mad (Elongasi)', desc: 'Panjang bacaan' },
  { key: 'tasydid', emoji: '🟡', color: TAJWID_COLORS.tasydid.color, label: 'Tasydid (Gandaan)', desc: 'Shaddah' },
  { key: 'lamJalalah', emoji: '🟣', color: TAJWID_COLORS.lamJalalah.color, label: 'Lam Jalalah', desc: 'اللّٰه' },
  { key: 'izhar', emoji: '⚪', color: TAJWID_COLORS.izhar.color, label: 'Izhar (Jelas)', desc: 'Sebutan jelas' },
] as const

// === Render colored verse with individual character coloring ===
function renderColoredVerse(
  verse: string,
  highlights: Array<{ from: number; to: number; rule: string; color?: string }>,
  onCharTap: (rule: string) => void
) {
  const chars = [...verse]
  return chars.map((char, i) => {
    const highlight = highlights.find(h => i >= h.from && i < h.to)
    const color = highlight?.color || '#ffffff'
    const rule = highlight?.rule || ''
    return (
      <span
        key={i}
        style={{ color, transition: 'color 0.2s', cursor: highlight ? 'pointer' : 'default' }}
        onClick={() => highlight && onCharTap(rule)}
        title={highlight ? RULE_LABELS[rule] || rule : undefined}
      >
        {char}
      </span>
    )
  })
}

// === Main Component ===
export function IqraTajwidReadingView({
  iqraBook,
  playingAudio,
  playAudio,
  audioSpeed,
  addXp,
}: IqraTajwidReadingViewProps) {
  const [showLegend, setShowLegend] = useState(true)
  const [practicedVerses, setPracticedVerses] = useState<Set<string>>(new Set())
  const [tooltipRule, setTooltipRule] = useState<string | null>(null)
  // Tooltip position state removed (using fixed position)

  const verses = QURAN_VERSES_PER_BOOK[iqraBook] || []
  const bookInfo = IQRA_BOOKS.find(b => b.id === iqraBook)

  // Handle character tap for tooltip
  const handleCharTap = (rule: string) => {
    setTooltipRule(rule)
    setTimeout(() => setTooltipRule(null), 2000)
  }

  // Mark verse as practiced
  const togglePracticed = (verseKey: string) => {
    setPracticedVerses(prev => {
      const next = new Set(prev)
      if (next.has(verseKey)) {
        next.delete(verseKey)
      } else {
        next.add(verseKey)
        addXp(10)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,74,166,0.15)' }}>
            <Eye className="h-4 w-4" style={{ color: '#4a4aa6' }} />
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>Bacaan Tajwid Berwarna</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{bookInfo?.title} — {bookInfo?.desc}</div>
          </div>
        </div>
        <button
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all"
          style={{
            background: showLegend ? 'rgba(212,175,55,0.12)' : 'rgba(42,42,106,0.4)',
            border: `1px solid ${showLegend ? 'rgba(212,175,55,0.2)' : 'rgba(74,74,166,0.08)'}`,
            color: showLegend ? '#d4af37' : 'rgba(204,204,204,0.5)',
          }}
          onClick={() => setShowLegend(!showLegend)}
        >
          <Palette className="h-3.5 w-3.5" />
          Tajwid Legend
          {showLegend ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Active Tooltip */}
      <AnimatePresence>
        {tooltipRule && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-medium shadow-lg"
            style={{ background: 'rgba(42,42,106,0.95)', border: '1px solid rgba(74,74,166,0.3)', color: '#ffffff' }}
          >
            <span style={{ color: '#d4af37' }}>Hukum:</span> {RULE_LABELS[tooltipRule] || tooltipRule}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color Legend */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Palette className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Panduan Warna Tajwid</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LEGEND_ITEMS.map(item => (
                  <div key={item.key} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                    <div className="h-3 w-3 rounded-full shrink-0" style={{ background: item.color }} />
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold truncate" style={{ color: item.color }}>{item.emoji} {item.label}</div>
                      <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[9px] text-center" style={{ color: 'rgba(204,204,204,0.4)' }}>
                Ketik huruf berwarna untuk lihat hukum tajwid
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verses */}
      <div className="space-y-3">
        {verses.map((v, idx) => {
          const verseKey = `${iqraBook}-${idx}`
          const isPracticed = practicedVerses.has(verseKey)
          const isPlaying = playingAudio === `tajwid-reading-${verseKey}`

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-xl p-4"
              style={{
                background: 'rgba(42,42,106,0.25)',
                border: `1px solid ${isPracticed ? 'rgba(34,197,94,0.2)' : 'rgba(74,74,166,0.1)'}`,
              }}
            >
              {/* Verse number & Surah ref */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>
                    {idx + 1}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" style={{ color: 'rgba(204,204,204,0.4)' }} />
                    <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{v.surah}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Practiced button */}
                  <button
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] transition-all"
                    style={{
                      background: isPracticed ? 'rgba(34,197,94,0.12)' : 'rgba(42,42,106,0.4)',
                      border: `1px solid ${isPracticed ? 'rgba(34,197,94,0.2)' : 'rgba(74,74,166,0.08)'}`,
                      color: isPracticed ? '#22c55e' : 'rgba(204,204,204,0.5)',
                    }}
                    onClick={() => togglePracticed(verseKey)}
                  >
                    {isPracticed ? <CheckCircle className="h-3 w-3" /> : <Star className="h-3 w-3" />}
                    {isPracticed ? 'Dilatih' : 'Tandai Latih'}
                  </button>
                  {/* Listen button */}
                  <button
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] transition-all"
                    style={{
                      background: isPlaying ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.4)',
                      border: `1px solid ${isPlaying ? 'rgba(212,175,55,0.25)' : 'rgba(74,74,166,0.08)'}`,
                      color: isPlaying ? '#d4af37' : 'rgba(204,204,204,0.5)',
                    }}
                    onClick={() => playAudio(v.verse, `tajwid-reading-${verseKey}`, audioSpeed)}
                  >
                    <Volume2 className="h-3 w-3" />
                    Dengar
                  </button>
                </div>
              </div>

              {/* Arabic text with color-coded tajwid */}
              <div className="rounded-lg p-3 text-center mb-3" style={{ background: 'rgba(26,26,74,0.5)', direction: 'rtl' as const }}>
                <div className="text-2xl leading-loose font-arabic">
                  {v.tajwidHighlight
                    ? renderColoredVerse(v.verse, v.tajwidHighlight, handleCharTap)
                    : <span style={{ color: '#ffffff' }}>{v.verse}</span>
                  }
                </div>
              </div>

              {/* Translation */}
              <div className="px-1">
                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.7)' }}>
                  {v.translation}
                </p>
              </div>

              {/* Tajwid rules found in this verse */}
              {v.tajwidHighlight && v.tajwidHighlight.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(74,74,166,0.08)' }}>
                  <span className="text-[8px] uppercase tracking-wide mr-1" style={{ color: 'rgba(204,204,204,0.3)' }}>Hukum:</span>
                  {[...new Set(v.tajwidHighlight.map(h => h.rule))].map((rule, rIdx) => {
                    const ruleColor = v.tajwidHighlight?.find(h => h.rule === rule)?.color || '#4a4aa6'
                    return (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 rounded-full text-[8px] font-medium"
                        style={{ background: `${ruleColor}15`, border: `1px solid ${ruleColor}25`, color: ruleColor }}
                      >
                        {RULE_LABELS[rule] || rule}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* XP indicator for practiced */}
              {isPracticed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1 mt-2"
                >
                  <Zap className="h-3 w-3" style={{ color: '#d4af37' }} />
                  <span className="text-[9px] font-medium" style={{ color: '#d4af37' }}>+10 XP</span>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Empty state */}
      {verses.length === 0 && (
        <div className="rounded-xl p-8 text-center" style={{ background: 'rgba(42,42,106,0.2)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <BookOpen className="h-8 w-8 mx-auto mb-2" style={{ color: 'rgba(74,74,166,0.3)' }} />
          <p className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Tiada ayat untuk buku ini</p>
        </div>
      )}
    </div>
  )
}


