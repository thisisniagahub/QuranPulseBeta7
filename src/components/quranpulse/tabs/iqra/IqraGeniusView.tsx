'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronRight, Pause, Volume2, Star, CheckCircle,
  Award, Layers, Eye, Sparkles,
} from 'lucide-react'
import {
  IQRA_BOOKS, TAJWID_COLORS, HARAKAT_COLORS,
  QALQALAH_DETAIL, MAD_DETAIL,
} from './types'
import { IQRA_PAGE_CONTENT, getIqraBookPages } from './iqra-pages'

interface IqraGeniusViewProps {
  bookProgress: (bookId: number) => number
  setIqraBook: (book: number) => void
  setIqraPage: (page: number) => void
  playAudio: (text: string, id: string) => void
}

// === Tafsir Huruf Fungsi Data ===
const HURUF_FUNGSI = [
  { category: 'Qalqalah', letters: 'ق ط ب ج د', color: '#ef4444', desc: 'Bunyi pantulan — berdenting' },
  { category: 'Mad', letters: 'ا و ي', color: '#3b82f6', desc: 'Huruf elongasi — bunyi panjang' },
  { category: 'Halqi (Tekak)', letters: 'أ ه ع ح غ خ', color: '#9ca3af', desc: 'Keluar dari tekak — 6 huruf' },
  { category: 'Lisan (Lidah)', letters: 'ت ث ج د ذ ر ز س ش ص ض ط ظ ل ن', color: '#6a6ab6', desc: 'Keluar dari lidah — 14 huruf' },
  { category: 'Syafawi (Bibir)', letters: 'ب م و ف', color: '#22c55e', desc: 'Keluar dari bibir — 4 huruf' },
  { category: 'Tebal (Tafkhim)', letters: 'خ ص ض ط ظ ق غ', color: '#d4af37', desc: 'Bunyi tebal — mulut penuh' },
  { category: 'Al-Qamariyyah', letters: 'ا ب ج ح خ ع غ ف ق ك م ه و ي', color: '#8b5cf6', desc: 'Huruf bulan — dibaca jelas' },
  { category: 'As-Syamsiyyah', letters: 'ت ث د ذ ر ز س ش ص ض ط ظ ل ن', color: '#d4af37', desc: 'Huruf matahari — dimasukkan' },
]

export function IqraGeniusView({ bookProgress, setIqraBook, setIqraPage, playAudio }: IqraGeniusViewProps) {
  const [expandedBook, setExpandedBook] = useState<number | null>(1)
  const [showTafsir, setShowTafsir] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const handlePlayAudio = async (text: string, id: string) => {
    if (playingId === id) return
    setPlayingId(id)
    playAudio(text, id)
    setTimeout(() => setPlayingId(null), 2000)
  }

  const openBook = (bookId: number, page: number = 1) => {
    setIqraBook(bookId)
    setIqraPage(page)
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <motion.div
        className="rounded-xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(74,74,166,0.15))',
          border: '1px solid rgba(139,92,246,0.2)',
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5" style={{ color: '#8b5cf6' }} />
          <h3 className="text-sm font-bold" style={{ color: '#ffffff' }}>IQRA&apos; Genius — Panduan Warna Tajwid</h3>
        </div>
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.6)' }}>
          Semua 6 buku Iqra&apos; dalam satu paparan. Setiap halaman berkod warna mengikut hukum tajwid — seperti buku IQRA&apos; Genius yang berwarna-warni!
        </p>

        {/* Tajwid Color Legend */}
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {Object.entries(TAJWID_COLORS).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: `${val.color}10` }}>
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: val.color }} />
              <span className="text-[9px] font-medium" style={{ color: val.color }}>{val.label}</span>
            </div>
          ))}
        </div>

        {/* Harakat Color Legend */}
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {Object.entries(HARAKAT_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1 px-1.5 py-1 rounded-lg" style={{ background: `${color}10` }}>
              <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-[8px] font-medium capitalize" style={{ color }}>{key === 'tanwinFath' ? 'TN Fath' : key === 'tanwinKasr' ? 'TN Kasr' : key === 'tanwinDham' ? 'TN Dham' : key}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Tafsir Huruf Fungsi Toggle */}
      <button
        className="w-full rounded-xl p-3 flex items-center justify-between"
        style={{
          background: showTafsir ? 'rgba(212,175,55,0.1)' : 'rgba(42,42,106,0.4)',
          border: `1px solid ${showTafsir ? 'rgba(212,175,55,0.2)' : 'rgba(74,74,166,0.1)'}`,
        }}
        onClick={() => setShowTafsir(!showTafsir)}
      >
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" style={{ color: '#d4af37' }} />
          <span className="text-[11px] font-semibold" style={{ color: '#d4af37' }}>Tafsir Huruf Fungsi</span>
        </div>
        <ChevronRight
          className="h-4 w-4 transition-transform"
          style={{ color: 'rgba(204,204,204,0.4)', transform: showTafsir ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>

      <AnimatePresence>
        {showTafsir && (
          <motion.div
            className="space-y-2 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {HURUF_FUNGSI.map((h, i) => (
              <motion.div
                key={h.category}
                className="rounded-xl p-3"
                style={{
                  background: `${h.color}08`,
                  border: `1px solid ${h.color}20`,
                  borderLeft: `3px solid ${h.color}`,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: h.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{h.category}</span>
                </div>
                <div className="text-lg font-arabic mb-1" style={{ color: h.color, direction: 'rtl' as const, letterSpacing: '0.15em' }}>
                  {h.letters}
                </div>
                <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{h.desc}</div>
              </motion.div>
            ))}

            {/* Special categories */}
            <div className="rounded-xl p-3" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderLeft: '3px solid #ef4444' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444' }} />
                <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Qalqalah — قطب جد</span>
              </div>
              <div className="text-lg font-arabic mb-1" style={{ color: '#ef4444', direction: 'rtl' as const }}>
                {QALQALAH_DETAIL.letters.map(l => l.letter).join(' ')}
              </div>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{QALQALAH_DETAIL.desc}</div>
            </div>

            <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderLeft: '3px solid #3b82f6' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#3b82f6' }} />
                <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Hukum Mad — 6 Jenis</span>
              </div>
              <div className="space-y-1 mt-1">
                {MAD_DETAIL.map(m => (
                  <div key={m.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
                    <span className="text-[9px]" style={{ color: m.color }}>{m.name}</span>
                    <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>— {m.length}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6 IQRA Books */}
      <div className="space-y-2">
        {IQRA_BOOKS.map((book, bookIdx) => {
          const progress = bookProgress(book.id)
          const pages = getIqraBookPages(book.id)
          const isExpanded = expandedBook === book.id
          const bookColor = book.color

          // Get tajwid rules for this book
          const bookRules = getBookRules(book.id)

          return (
            <motion.div
              key={book.id}
              className="rounded-xl overflow-hidden"
              style={{
                borderLeft: `4px solid ${bookColor}`,
                background: 'rgba(42,42,106,0.3)',
                border: `1px solid ${bookColor}20`,
                borderLeft: `4px solid ${bookColor}`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: bookIdx * 0.06 }}
            >
              {/* Book Header */}
              <button
                className="w-full p-3 flex items-center gap-3 text-left"
                onClick={() => setExpandedBook(isExpanded ? null : book.id)}
              >
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: `${bookColor}15` }}>
                  {book.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-bold" style={{ color: bookColor }}>{book.title}</span>
                    {progress === 100 && <CheckCircle className="h-3.5 w-3.5" style={{ color: '#22c55e' }} />}
                  </div>
                  <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{book.desc}</div>
                  <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.3)' }}>{book.level} • {book.pages} halaman</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold" style={{ color: bookColor }}>{progress}%</span>
                    {progress > 0 && progress < 100 && <Star className="h-3 w-3" style={{ color: '#d4af37' }} />}
                  </div>
                  <ChevronRight
                    className="h-4 w-4 transition-transform"
                    style={{ color: 'rgba(204,204,204,0.3)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  />
                </div>
              </button>

              {/* Progress Bar */}
              <div className="h-1 mx-3 rounded-full overflow-hidden" style={{ background: `${bookColor}15` }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: bookColor }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Book-specific Tajwid Legend */}
              <div className="px-3 py-2 flex flex-wrap gap-1">
                {bookRules.map(rule => (
                  <span
                    key={rule.name}
                    className="px-1.5 py-0.5 rounded text-[8px] font-medium"
                    style={{ background: `${rule.color}10`, color: rule.color, border: `1px solid ${rule.color}20` }}
                  >
                    {rule.name}
                  </span>
                ))}
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 max-h-80 overflow-y-auto qp-scroll space-y-1.5">
                      {/* Key pages preview */}
                      {pages.map((page, pageIdx) => {
                        const pageKey = `${book.id}-${page.page}`
                        const pageData = IQRA_PAGE_CONTENT[pageKey]
                        if (!pageData) return null

                        // Show page type badge
                        const typeBadge = getPageTypeBadge(page.type)
                        const previewItems = pageData.items.slice(0, 3)

                        return (
                          <motion.button
                            key={pageKey}
                            className="w-full rounded-lg p-2.5 flex items-center gap-2 text-left"
                            style={{
                              background: 'rgba(26,26,74,0.4)',
                              border: '1px solid rgba(74,74,166,0.08)',
                            }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: pageIdx * 0.02 }}
                            onClick={() => openBook(book.id, page.page)}
                          >
                            {/* Page Number */}
                            <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${bookColor}10` }}>
                              <span className="text-[9px] font-bold" style={{ color: bookColor }}>{page.page}</span>
                            </div>

                            {/* Page Content Preview */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[10px] font-medium" style={{ color: '#ffffff' }}>{page.titleMs}</span>
                                <span className="px-1 py-0.5 rounded text-[7px]" style={{ background: `${typeBadge.color}15`, color: typeBadge.color }}>{typeBadge.label}</span>
                                {page.ruleFocus && (
                                  <span className="px-1 py-0.5 rounded text-[7px]" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>{page.ruleFocus}</span>
                                )}
                              </div>
                              <div className="text-sm font-arabic truncate" style={{ color: 'rgba(255,255,255,0.6)', direction: 'rtl' as const }}>
                                {previewItems.map(item => item.display).join(' ')}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                className="p-1.5 rounded-lg"
                                style={{ background: 'rgba(74,74,166,0.1)' }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePlayAudio(previewItems.map(i => i.transliteration || i.display).join(' '), `genius-${pageKey}`)
                                }}
                              >
                                {playingId === `genius-${pageKey}` ? (
                                  <Pause className="h-3 w-3" style={{ color: '#d4af37' }} />
                                ) : (
                                  <Volume2 className="h-3 w-3" style={{ color: 'rgba(204,204,204,0.4)' }} />
                                )}
                              </button>
                              <Eye className="h-3 w-3" style={{ color: 'rgba(204,204,204,0.2)' }} />
                            </div>
                          </motion.button>
                        )
                      })}

                      {/* Open Book Button */}
                      <button
                        className="w-full rounded-lg p-2.5 flex items-center justify-center gap-2 mt-2"
                        style={{
                          background: `${bookColor}10`,
                          border: `1px solid ${bookColor}20`,
                          color: bookColor,
                        }}
                        onClick={() => openBook(book.id)}
                      >
                        <BookOpen className="h-4 w-4" />
                        <span className="text-[11px] font-semibold">Buka {book.title}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Summary Card */}
      <motion.div
        className="rounded-xl p-4"
        style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(74,74,166,0.08))',
          border: '1px solid rgba(212,175,55,0.15)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Award className="h-4 w-4" style={{ color: '#d4af37' }} />
          <span className="text-[11px] font-bold" style={{ color: '#d4af37' }}>Ringkasan 6 Siri IQRA&apos;</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {IQRA_BOOKS.map(b => (
            <div key={b.id} className="text-center rounded-lg p-2" style={{ background: `${b.color}08` }}>
              <div className="text-[10px] font-bold" style={{ color: b.color }}>{b.title}</div>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{b.pages} hlm</div>
              <div className="h-1 rounded-full mt-1 overflow-hidden" style={{ background: `${b.color}15` }}>
                <div className="h-full rounded-full" style={{ background: b.color, width: `${bookProgress(b.id)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
            Jumlah: 169 halaman • {Object.values(TAJWID_COLORS).flatMap(v => v.rules).length} hukum tajwid
          </span>
        </div>
      </motion.div>
    </div>
  )
}

// Helper: Get tajwid rules relevant to each book
function getBookRules(book: { id: number }): Array<{ name: string; color: string }> {
  const rules: Array<{ name: string; color: string }> = []
  switch (book.id) {
    case 1:
      rules.push({ name: 'Fathah', color: HARAKAT_COLORS.fathah })
      break
    case 2:
      rules.push({ name: 'Fathah Sambung', color: HARAKAT_COLORS.fathah })
      rules.push({ name: 'Mad Asli', color: '#3b82f6' })
      break
    case 3:
      rules.push({ name: 'Kasrah', color: HARAKAT_COLORS.kasrah })
      rules.push({ name: 'Dhammah', color: HARAKAT_COLORS.dhammah })
      rules.push({ name: 'Mad Ya', color: '#3b82f6' })
      rules.push({ name: 'Mad Waw', color: '#3b82f6' })
      break
    case 4:
      rules.push({ name: 'Tanwin', color: '#f97316' })
      rules.push({ name: 'Qalqalah', color: '#ef4444' })
      rules.push({ name: 'Izhar', color: '#9ca3af' })
      rules.push({ name: 'Sukun', color: '#6b7280' })
      rules.push({ name: 'Tasydid', color: '#d4af37' })
      break
    case 5:
      rules.push({ name: 'Qamariyyah', color: '#6a6ab6' })
      rules.push({ name: 'Syamsiyyah', color: '#d4af37' })
      rules.push({ name: 'Waqaf', color: '#6b7280' })
      rules.push({ name: 'Mad Far\'i', color: '#3b82f6' })
      rules.push({ name: 'Lam Jalalah', color: '#8b5cf6' })
      rules.push({ name: 'Idgham', color: '#22c55e' })
      break
    case 6:
      rules.push({ name: 'Ikhfa\'', color: '#22c55e' })
      rules.push({ name: 'Iqlab', color: '#8b5cf6' })
      rules.push({ name: 'Tajwid Lengkap', color: '#ef4444' })
      rules.push({ name: 'Juz Amma', color: '#d4af37' })
      break
  }
  return rules
}

// Helper: Page type badge
function getPageTypeBadge(type: string): { label: string; color: string } {
  switch (type) {
    case 'letters': return { label: 'Huruf', color: '#4a4aa6' }
    case 'harakat': return { label: 'Harakat', color: '#ef4444' }
    case 'words': return { label: 'Perkataan', color: '#22c55e' }
    case 'verses': return { label: 'Ayat', color: '#d4af37' }
    case 'rules': return { label: 'Hukum', color: '#8b5cf6' }
    case 'practice': return { label: 'Latihan', color: '#f97316' }
    case 'review': return { label: 'Ulangan', color: '#6a6ab6' }
    default: return { label: type, color: '#6b7280' }
  }
}


