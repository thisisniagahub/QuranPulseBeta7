'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Link2, Unlink, ChevronDown, Info } from 'lucide-react'
import { ENHANCED_LETTERS } from './types'

interface IqraConnectedFormsProps {
  playingAudio: string | null
  playAudio: (text: string, id: string, speed?: number) => void
}

// Letters that do NOT connect to the left (right-only connectors)
const RIGHT_ONLY_LETTERS = new Set(['ا', 'د', 'ذ', 'ر', 'ز', 'و'])

// Form labels in Malay
type FormKey = 'isolated' | 'initial' | 'medial' | 'final'

const FORM_LABELS: { key: FormKey; label: string; labelAr: string }[] = [
  { key: 'isolated', label: 'Tunggal', labelAr: 'معزول' },
  { key: 'initial', label: 'Awal', labelAr: 'أول' },
  { key: 'medial', label: 'Tengah', labelAr: 'وسط' },
  { key: 'final', label: 'Akhir', labelAr: 'آخر' },
]

export function IqraConnectedForms({ playingAudio, playAudio }: IqraConnectedFormsProps) {
  const [expandedLetter, setExpandedLetter] = useState<number | null>(null)
  const [activeGroup, setActiveGroup] = useState<'all' | 'full' | 'right-only'>('all')

  // Filter the 28 standard letters (exclude Hamzah ء which is id 28)
  const letters = ENHANCED_LETTERS.filter(l => l.letter !== 'ء')

  const fullConnectors = letters.filter(l => !RIGHT_ONLY_LETTERS.has(l.letter))
  const rightOnlyConnectors = letters.filter(l => RIGHT_ONLY_LETTERS.has(l.letter))

  const displayedLetters = activeGroup === 'full'
    ? fullConnectors
    : activeGroup === 'right-only'
      ? rightOnlyConnectors
      : letters

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)' }}>
            <Link2 className="h-4 w-4" style={{ color: '#d4af37' }} />
          </div>
          <div>
            <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>Bentuk Huruf Bersambung</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Bagaimana huruf berubah apabila disambung</div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div className="h-2 w-2 rounded-full" style={{ background: '#d4af37' }} />
            <span className="text-[9px]" style={{ color: '#d4af37' }}>Huruf = Emas</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(106,106,182,0.1)', border: '1px solid rgba(106,106,182,0.15)' }}>
            <div className="h-2 w-2 rounded-full" style={{ background: '#6a6ab6' }} />
            <span className="text-[9px]" style={{ color: '#6a6ab6' }}>Sambung = Biru</span>
          </div>
        </div>
      </div>

      {/* Group Filter */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(42,42,106,0.4)' }}>
        {([
          { key: 'all' as const, label: 'Semua', count: letters.length },
          { key: 'full' as const, label: 'Sambung Penuh', count: fullConnectors.length },
          { key: 'right-only' as const, label: 'Sambung Kanan', count: rightOnlyConnectors.length },
        ]).map(g => (
          <button
            key={g.key}
            className="flex-1 flex flex-col items-center py-2 rounded-lg text-[10px] font-medium transition-all"
            style={{
              background: activeGroup === g.key ? 'rgba(74,74,166,0.25)' : 'transparent',
              color: activeGroup === g.key ? '#ffffff' : 'rgba(204,204,204,0.5)',
              border: activeGroup === g.key ? '1px solid rgba(74,74,166,0.3)' : '1px solid transparent',
            }}
            onClick={() => setActiveGroup(g.key)}
          >
            <span>{g.label}</span>
            <span className="text-[8px] mt-0.5" style={{ color: activeGroup === g.key ? '#d4af37' : 'rgba(204,204,204,0.3)' }}>{g.count} huruf</span>
          </button>
        ))}
      </div>

      {/* Right-only connector note */}
      {activeGroup === 'right-only' && (
        <motion.div
          className="rounded-xl p-3 flex items-start gap-2"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Unlink className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
          <div>
            <div className="text-[10px] font-semibold" style={{ color: '#ef4444' }}>Tidak sambung ke kiri</div>
            <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.6)' }}>
              Huruf ا د ذ ر ز و hanya menyambung ke huruf sebelah kanan (sebelumnya). 
              Bentuk awal dan tengahnya sama dengan bentuk tunggal kerana ia tidak menyambung ke kiri.
            </div>
          </div>
        </motion.div>
      )}

      {/* Letters List */}
      <div className="max-h-96 overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(74,74,166,0.3) transparent' }}>
        {displayedLetters.map((letter, idx) => {
          const isRightOnly = RIGHT_ONLY_LETTERS.has(letter.letter)
          const isExpanded = expandedLetter === letter.id

          return (
            <motion.div
              key={letter.id}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(42,42,106,0.3)',
                border: `1px solid ${isRightOnly ? 'rgba(239,68,68,0.15)' : 'rgba(74,74,166,0.1)'}`,
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              {/* Letter Header */}
              <button
                className="w-full flex items-center justify-between p-3"
                onClick={() => setExpandedLetter(isExpanded ? null : letter.id)}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-10 w-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: isRightOnly ? 'rgba(239,68,68,0.1)' : 'rgba(212,175,55,0.1)',
                      border: `1px solid ${isRightOnly ? 'rgba(239,68,68,0.15)' : 'rgba(212,175,55,0.15)'}`,
                    }}
                  >
                    <span className="text-2xl font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>
                      {letter.letter}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>{letter.name}</span>
                      {isRightOnly && (
                        <span className="px-1.5 py-0.5 rounded-full text-[8px] font-medium" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' }}>
                          Tidak sambung ke kiri
                        </span>
                      )}
                    </div>
                    <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
                      {isRightOnly ? 'Sambung kanan sahaja' : 'Sambung kedua-dua belah'}
                    </div>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.5)' }} />
                </motion.div>
              </button>

              {/* Expanded Forms */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3">
                      {/* 4 Forms Grid */}
                      <div className="grid grid-cols-4 gap-1.5 mb-2">
                        {FORM_LABELS.map(form => {
                          const formText = letter.forms[form.key]
                          const audioId = `form-${letter.id}-${form.key}`
                          const isPlaying = playingAudio === audioId

                          return (
                            <motion.button
                              key={form.key}
                              className="rounded-lg p-2 flex flex-col items-center justify-center gap-1 min-h-[72px]"
                              style={{
                                background: isPlaying
                                  ? 'rgba(212,175,55,0.12)'
                                  : 'rgba(26,26,74,0.5)',
                                border: `1px solid ${isPlaying ? 'rgba(212,175,55,0.25)' : 'rgba(74,74,166,0.1)'}`,
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => playAudio(letter.name, audioId, 0.8)}
                            >
                              <span
                                className="text-xl font-arabic leading-none"
                                style={{
                                  color: '#d4af37',
                                  direction: 'rtl' as const,
                                  textShadow: '0 0 8px rgba(212,175,55,0.2)',
                                }}
                              >
                                {formText}
                              </span>
                              <span className="text-[8px] font-medium" style={{ color: 'rgba(204,204,204,0.6)' }}>
                                {form.label}
                              </span>
                              {isPlaying && (
                                <Volume2 className="h-2.5 w-2.5" style={{ color: '#d4af37' }} />
                              )}
                            </motion.button>
                          )
                        })}
                      </div>

                      {/* Connection Line Visualization */}
                      <div className="rounded-lg p-2.5" style={{ background: 'rgba(26,26,74,0.5)', border: '1px solid rgba(74,74,166,0.08)' }}>
                        <div className="text-[9px] font-medium mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>
                          Contoh sambungan:
                        </div>
                        {isRightOnly ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: 'rgba(239,68,68,0.7)' }}>Sebelum</span>
                              <div className="h-px flex-1" style={{ background: '#6a6ab6' }} />
                              <span className="text-sm font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>
                                {letter.forms.final}
                              </span>
                              <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(212,175,55,0.7)' }}>Akhir</span>
                            </div>
                            <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
                              Huruf ini TIDAK menyambung ke huruf selepasnya (ke kiri)
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>
                                {letter.forms.initial}
                              </span>
                              <div className="h-px flex-1" style={{ background: 'rgba(106,106,182,0.5)' }} />
                              <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(106,106,182,0.1)', color: 'rgba(106,106,182,0.7)' }}>Awal</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(106,106,182,0.1)', color: 'rgba(106,106,182,0.7)' }}>Sebelum</span>
                              <div className="h-px flex-1" style={{ background: 'rgba(106,106,182,0.5)' }} />
                              <span className="text-sm font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>
                                {letter.forms.medial}
                              </span>
                              <div className="h-px flex-1" style={{ background: 'rgba(106,106,182,0.5)' }} />
                              <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(106,106,182,0.1)', color: 'rgba(106,106,182,0.7)' }}>Selepas</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(106,106,182,0.1)', color: 'rgba(106,106,182,0.7)' }}>Sebelum</span>
                              <div className="h-px flex-1" style={{ background: 'rgba(106,106,182,0.5)' }} />
                              <span className="text-sm font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>
                                {letter.forms.final}
                              </span>
                              <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,175,55,0.1)', color: 'rgba(212,175,55,0.7)' }}>Akhir</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right-only warning */}
                      {isRightOnly && (
                        <div className="mt-2 flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
                          <Info className="h-3 w-3 shrink-0" style={{ color: '#ef4444' }} />
                          <span className="text-[9px]" style={{ color: 'rgba(239,68,68,0.8)' }}>
                            Tidak sambung ke kiri — bentuk awal dan tengah sama seperti tunggal
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Summary Card */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-2">
          <Info className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#4a4aa6' }}>Ringkasan Sambungan</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg p-2.5" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <div className="text-[10px] font-semibold mb-1" style={{ color: '#d4af37' }}>Sambung Penuh ({fullConnectors.length})</div>
            <div className="flex flex-wrap gap-0.5">
              {fullConnectors.map(l => (
                <span key={l.id} className="text-sm font-arabic" style={{ color: 'rgba(255,255,255,0.7)', direction: 'rtl' as const }}>{l.letter}</span>
              ))}
            </div>
            <div className="text-[8px] mt-1" style={{ color: 'rgba(204,204,204,0.4)' }}>4 bentuk berbeza</div>
          </div>
          <div className="rounded-lg p-2.5" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
            <div className="text-[10px] font-semibold mb-1" style={{ color: '#ef4444' }}>Sambung Kanan ({rightOnlyConnectors.length})</div>
            <div className="flex flex-wrap gap-0.5">
              {rightOnlyConnectors.map(l => (
                <span key={l.id} className="text-sm font-arabic" style={{ color: 'rgba(255,255,255,0.7)', direction: 'rtl' as const }}>{l.letter}</span>
              ))}
            </div>
            <div className="text-[8px] mt-1" style={{ color: 'rgba(204,204,204,0.4)' }}>Bentuk awal = tunggal</div>
          </div>
        </div>
      </div>
    </div>
  )
}
