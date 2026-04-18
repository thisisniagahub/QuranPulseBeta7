'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, ChevronLeft, ChevronRight, Volume2, RotateCcw, Star, CheckCircle, Play } from 'lucide-react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { HIJAIYAH_LETTERS } from '@/lib/quran-data'

const IQRA_BOOKS = [
  { id: 1, title: 'Iqra 1', desc: 'Hijaiyah & Harakat', color: '#1B6B5A', pages: 28 },
  { id: 2, title: 'Iqra 2', desc: 'Gabungan Huruf', color: '#2A8B74', pages: 28 },
  { id: 3, title: 'Iqra 3', desc: 'Kasrah & Dhammah', color: '#C4972A', pages: 28 },
  { id: 4, title: 'Iqra 4', desc: 'Tanwin & Mad', color: '#D4A84A', pages: 28 },
  { id: 5, title: 'Iqra 5', desc: 'Tajwid Asas', color: '#8B5CF6', pages: 28 },
  { id: 6, title: 'Iqra 6', desc: 'Tajwid Lanjutan', color: '#EC4899', pages: 28 },
]

export function IqraTab() {
  const { iqraBook, iqraPage, setIqraBook, setIqraPage, addXp } = useQuranPulseStore()
  const [view, setView] = useState<'books' | 'reader' | 'letters'>('books')
  const [completedPages, setCompletedPages] = useState<Set<string>>(new Set())
  const [showLetters, setShowLetters] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null)

  const currentBook = IQRA_BOOKS.find(b => b.id === iqraBook) || IQRA_BOOKS[0]
  const pageKey = `${iqraBook}-${iqraPage}`

  const markComplete = () => {
    setCompletedPages(prev => new Set([...prev, pageKey]))
    addXp(20)
  }

  const navigatePage = (delta: number) => {
    const newPage = Math.max(1, Math.min(currentBook.pages, iqraPage + delta))
    setIqraPage(newPage)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {view === 'books' ? (
          <motion.div
            key="books"
            className="qp-scroll flex-1 overflow-y-auto px-4 pb-6 pt-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#F5F0E8' }}>Iqra Digital</h2>
                <p className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Belajar membaca Al-Quran</p>
              </div>
              <button
                className="px-3 py-1.5 rounded-xl text-xs flex items-center gap-1"
                style={{ background: 'rgba(27,107,90,0.15)', color: '#1B6B5A', border: '1px solid rgba(27,107,90,0.2)' }}
                onClick={() => setShowLetters(true)}
              >
                📝 Huruf Hijaiyah
              </button>
            </div>

            {/* Progress Overview */}
            <div
              className="rounded-xl p-4 mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(27,107,90,0.1), rgba(196,151,42,0.05))',
                border: '1px solid rgba(27,107,90,0.15)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: '#F5F0E8' }}>Keseluruhan Progres</span>
                <span className="text-xs" style={{ color: '#1B6B5A' }}>{completedPages.size} halaman selesai</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(27,107,90,0.1)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #1B6B5A, #2A8B74)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((completedPages.size / 168) * 100, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Iqra Book Grid */}
            <div className="grid grid-cols-2 gap-3">
              {IQRA_BOOKS.map((book, i) => {
                const bookCompleted = [...completedPages].filter(p => p.startsWith(`${book.id}-`)).length
                const progress = Math.round((bookCompleted / book.pages) * 100)

                return (
                  <motion.button
                    key={book.id}
                    className="rounded-xl p-4 text-left transition-transform active:scale-[0.97]"
                    style={{
                      background: `linear-gradient(135deg, ${book.color}20, ${book.color}08)`,
                      border: `1px solid ${book.color}30`,
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setIqraBook(book.id)
                      setIqraPage(1)
                      setView('reader')
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold"
                        style={{ background: `${book.color}25`, color: book.color }}
                      >
                        {book.id}
                      </div>
                      {progress > 0 && (
                        <div className="flex items-center gap-1">
                          {progress === 100 ? (
                            <CheckCircle className="h-4 w-4" style={{ color: '#10B981' }} />
                          ) : (
                            <span className="text-[10px] font-bold" style={{ color: book.color }}>{progress}%</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>{book.title}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'rgba(245,240,232,0.4)' }}>{book.desc}</div>
                    </div>
                    {progress > 0 && progress < 100 && (
                      <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: `${book.color}15` }}>
                        <div className="h-full rounded-full" style={{ width: `${progress}%`, background: book.color }} />
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Quick Practice Section */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2" style={{ color: '#F5F0E8' }}>Latihan Pantas</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  className="rounded-xl p-3 text-left"
                  style={{ background: 'rgba(10,30,61,0.5)', border: '1px solid rgba(27,107,90,0.1)' }}
                  onClick={() => setShowLetters(true)}
                >
                  <div className="text-xl mb-1">🔤</div>
                  <div className="text-xs font-medium" style={{ color: '#F5F0E8' }}>Hafalan Huruf</div>
                  <div className="text-[10px]" style={{ color: 'rgba(245,240,232,0.4)' }}>29 huruf hijaiyah</div>
                </button>
                <button
                  className="rounded-xl p-3 text-left"
                  style={{ background: 'rgba(10,30,61,0.5)', border: '1px solid rgba(27,107,90,0.1)' }}
                  onClick={() => { setIqraBook(1); setIqraPage(1); setView('reader') }}
                >
                  <div className="text-xl mb-1">📖</div>
                  <div className="text-xs font-medium" style={{ color: '#F5F0E8' }}>Baca Iqra</div>
                  <div className="text-[10px]" style={{ color: 'rgba(245,240,232,0.4)' }}>Mula dari Iqra 1</div>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            className="qp-scroll flex-1 overflow-y-auto px-4 pb-6 pt-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Reader Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                className="flex items-center gap-1 text-sm"
                style={{ color: '#1B6B5A' }}
                onClick={() => setView('books')}
              >
                <ChevronLeft className="h-5 w-5" /> Kembali
              </button>
              <div className="text-center">
                <div className="text-sm font-semibold" style={{ color: currentBook.color }}>
                  Iqra {iqraBook}
                </div>
                <div className="text-[10px]" style={{ color: 'rgba(245,240,232,0.4)' }}>
                  Halaman {iqraPage}/{currentBook.pages}
                </div>
              </div>
              <button
                className="p-2 rounded-lg"
                style={{ background: 'rgba(27,107,90,0.15)' }}
                onClick={markComplete}
              >
                {completedPages.has(pageKey) ? (
                  <CheckCircle className="h-4 w-4" style={{ color: '#10B981' }} />
                ) : (
                  <Star className="h-4 w-4" style={{ color: '#1B6B5A' }} />
                )}
              </button>
            </div>

            {/* Page Progress Bar */}
            <div className="h-1 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(27,107,90,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: currentBook.color }}
                animate={{ width: `${(iqraPage / currentBook.pages) * 100}%` }}
              />
            </div>

            {/* Page Content */}
            <motion.div
              className="rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center"
              style={{
                background: 'rgba(10,30,61,0.3)',
                border: `1px solid ${currentBook.color}20`,
              }}
              key={pageKey}
              initial={{ opacity: 0, x: deltaToDirection(iqraPage > 1 ? 1 : 0) }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Iqra content placeholder - shows letters/symbols based on book */}
              {iqraBook === 1 && (
                <IqraBook1Content page={iqraPage} />
              )}
              {iqraBook === 2 && (
                <IqraBook2Content page={iqraPage} />
              )}
              {iqraBook >= 3 && (
                <IqraGenericContent book={iqraBook} page={iqraPage} color={currentBook.color} />
              )}

              {/* Audio button */}
              <button
                className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl text-xs"
                style={{ background: `${currentBook.color}15`, color: currentBook.color, border: `1px solid ${currentBook.color}25` }}
              >
                <Volume2 className="h-4 w-4" /> Dengar Bacaan
              </button>
            </motion.div>

            {/* Page Navigation */}
            <div className="flex justify-between mt-4">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs"
                style={{
                  background: 'rgba(10,30,61,0.5)',
                  border: '1px solid rgba(27,107,90,0.15)',
                  color: iqraPage > 1 ? '#1B6B5A' : 'rgba(245,240,232,0.2)',
                }}
                disabled={iqraPage <= 1}
                onClick={() => navigatePage(-1)}
              >
                <ChevronLeft className="h-4 w-4" /> Sebelum
              </button>
              {completedPages.has(pageKey) && (
                <span className="text-xs self-center" style={{ color: '#10B981' }}>✓ Selesai</span>
              )}
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs"
                style={{
                  background: `${currentBook.color}15`,
                  border: `1px solid ${currentBook.color}25`,
                  color: currentBook.color,
                }}
                disabled={iqraPage >= currentBook.pages}
                onClick={() => navigatePage(1)}
              >
                Seterusnya <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hijaiyah Letters Modal */}
      <AnimatePresence>
        {showLetters && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowLetters(false)} />
            <motion.div
              className="relative w-full max-w-[480px] rounded-t-2xl max-h-[70vh] overflow-hidden flex flex-col"
              style={{ background: '#051324', border: '1px solid rgba(27,107,90,0.2)' }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(27,107,90,0.1)' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#F5F0E8' }}>Huruf Hijaiyah</h3>
                <button onClick={() => setShowLetters(false)} className="text-xs" style={{ color: 'rgba(245,240,232,0.4)' }}>Tutup</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 qp-scroll">
                <div className="grid grid-cols-5 gap-2">
                  {HIJAIYAH_LETTERS.map((letter, i) => (
                    <motion.button
                      key={letter.id}
                      className="aspect-square rounded-xl flex flex-col items-center justify-center"
                      style={{
                        background: selectedLetter === i ? 'rgba(27,107,90,0.2)' : 'rgba(10,30,61,0.5)',
                        border: `1px solid ${selectedLetter === i ? 'rgba(27,107,90,0.4)' : 'rgba(27,107,90,0.1)'}`,
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => setSelectedLetter(selectedLetter === i ? null : i)}
                    >
                      <span className="text-xl" style={{ color: '#F5F0E8' }}>{letter.letter}</span>
                      <span className="text-[8px] mt-0.5" style={{ color: 'rgba(245,240,232,0.4)' }}>{letter.name}</span>
                    </motion.button>
                  ))}
                </div>
                {selectedLetter !== null && (
                  <motion.div
                    className="mt-4 rounded-xl p-4 text-center"
                    style={{ background: 'rgba(27,107,90,0.1)', border: '1px solid rgba(27,107,90,0.2)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="text-5xl font-arabic" style={{ color: '#1B6B5A' }}>
                      {HIJAIYAH_LETTERS[selectedLetter].letter}
                    </div>
                    <div className="text-sm mt-2 font-medium" style={{ color: '#F5F0E8' }}>
                      {HIJAIYAH_LETTERS[selectedLetter].name}
                    </div>
                    <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>
                      {HIJAIYAH_LETTERS[selectedLetter].nameEn}
                    </div>
                    <button
                      className="mt-3 flex items-center gap-1.5 mx-auto px-4 py-2 rounded-xl text-xs"
                      style={{ background: 'rgba(27,107,90,0.2)', color: '#1B6B5A', border: '1px solid rgba(27,107,90,0.3)' }}
                    >
                      <Volume2 className="h-3.5 w-3.5" /> Dengar Sebutan
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function deltaToDirection(delta: number): number {
  return delta > 0 ? 20 : delta < 0 ? -20 : 0
}

function IqraBook1Content({ page }: { page: number }) {
  // Show hijaiyah letters for Iqra Book 1
  const lettersPerPage = 6
  const startIdx = ((page - 1) * lettersPerPage) % HIJAIYAH_LETTERS.length
  const pageLetters = Array.from({ length: lettersPerPage }, (_, i) =>
    HIJAIYAH_LETTERS[(startIdx + i) % HIJAIYAH_LETTERS.length]
  )

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(27,107,90,0.15)', color: '#1B6B5A' }}>
          Pengenalan Huruf Hijaiyah
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {pageLetters.map(letter => (
          <div
            key={letter.id}
            className="aspect-square rounded-xl flex flex-col items-center justify-center"
            style={{ background: 'rgba(27,107,90,0.08)', border: '1px solid rgba(27,107,90,0.15)' }}
          >
            <span className="text-4xl" style={{ color: '#F5F0E8' }}>{letter.letter}</span>
            <span className="text-[10px] mt-2" style={{ color: 'rgba(245,240,232,0.5)' }}>{letter.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function IqraBook2Content({ page }: { page: number }) {
  // Show letter combinations for Iqra Book 2
  const combinations = [
    'بَا', 'بِي', 'بُو', 'تَا', 'تِي', 'تُو',
    'ثَا', 'ثِي', 'ثُو', 'جَا', 'جِي', 'جُو',
  ]
  const perPage = 6
  const start = ((page - 1) * perPage) % combinations.length
  const pageCombos = Array.from({ length: perPage }, (_, i) =>
    combinations[(start + i) % combinations.length]
  )

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(42,139,116,0.15)', color: '#2A8B74' }}>
          Gabungan Huruf
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {pageCombos.map((combo, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(42,139,116,0.08)', border: '1px solid rgba(42,139,116,0.15)' }}
          >
            <span className="text-3xl" style={{ color: '#F5F0E8', direction: 'rtl' }}>{combo}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function IqraGenericContent({ book, page, color }: { book: number; page: number; color: string }) {
  const labels: Record<number, string> = {
    3: 'Fathah, Kasrah & Dhammah',
    4: 'Tanwin & Mad',
    5: 'Tajwid Asas',
    6: 'Tajwid Lanjutan',
  }

  // Generate some sample Arabic text for practice
  const practiceLines = [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
    'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ',
    'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
    'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ',
  ]

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${color}15`, color }}>
          {labels[book] || 'Latihan'}
        </span>
      </div>
      <div className="space-y-4">
        {practiceLines.map((line, i) => (
          <div
            key={i}
            className="rounded-xl p-4 text-center"
            style={{ background: `${color}08`, border: `1px solid ${color}15` }}
          >
            <p className="text-2xl leading-loose" style={{ color: '#F5F0E8', direction: 'rtl' }}>
              {line}
            </p>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <span className="text-[10px]" style={{ color: 'rgba(245,240,232,0.3)' }}>
          Halaman {page} · Iqra {book}
        </span>
      </div>
    </div>
  )
}
