'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HADITH_COLLECTION } from './types'

export function HadithView() {
  const [hadithIndex, setHadithIndex] = useState(0)

  useEffect(() => {
    // Rotate daily based on date
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    )
    const idx = dayOfYear % HADITH_COLLECTION.length
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHadithIndex(idx)
  }, [])

  const currentHadith = HADITH_COLLECTION[hadithIndex]

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="text-center mb-4">
        <div className="text-2xl mb-1">📜</div>
        <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Hadis Hari Ini</h3>
        <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Hadis sahih dalam Bahasa Melayu</p>
      </div>

      {/* Main Hadith Card */}
      <motion.div
        className="rounded-xl p-5 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(74,74,166,0.15), rgba(74,74,166,0.05))',
          border: '1px solid rgba(74,74,166,0.25)',
          borderLeft: '3px solid #d4af37',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute top-3 right-3 text-6xl opacity-5" style={{ color: '#d4af37' }}>
          ﷽
        </div>

        <div className="text-xs font-semibold mb-3 flex items-center gap-1.5" style={{ color: '#d4af37' }}>
          📖 Hadis #{currentHadith.id}
        </div>

        <p className="text-sm leading-relaxed" style={{ color: '#ffffff' }}>
          &ldquo;{currentHadith.text}&rdquo;
        </p>

        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(74,74,166,0.15)' }}>
          <div className="text-xs font-medium" style={{ color: '#4a4aa6' }}>
            {currentHadith.source}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: 'rgba(204,204,204,0.5)' }}>
            Perawi: {currentHadith.narrator}
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs transition-transform active:scale-95"
          style={{
            background: 'rgba(42,42,106,0.5)',
            color: '#4a4aa6',
            border: '1px solid rgba(74,74,166,0.2)',
          }}
          onClick={() => setHadithIndex(prev => (prev - 1 + HADITH_COLLECTION.length) % HADITH_COLLECTION.length)}
        >
          ← Sebelum
        </button>
        <span className="text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>
          {hadithIndex + 1} / {HADITH_COLLECTION.length}
        </span>
        <button
          className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs transition-transform active:scale-95"
          style={{
            background: 'rgba(42,42,106,0.5)',
            color: '#4a4aa6',
            border: '1px solid rgba(74,74,166,0.2)',
          }}
          onClick={() => setHadithIndex(prev => (prev + 1) % HADITH_COLLECTION.length)}
        >
          Seterusnya →
        </button>
      </div>

      {/* Random Button */}
      <button
        className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-transform active:scale-95"
        style={{
          background: 'rgba(74,74,166,0.15)',
          color: '#4a4aa6',
          border: '1px solid rgba(74,74,166,0.2)',
        }}
        onClick={() => setHadithIndex(Math.floor(Math.random() * HADITH_COLLECTION.length))}
      >
        🎲 Hadis Rawak
      </button>

      {/* All hadiths list */}
      <div className="mt-4">
        <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(204,204,204,0.6)' }}>
          Senarai Hadis
        </div>
        <div className="space-y-1.5 max-h-96 overflow-y-auto">
          {HADITH_COLLECTION.map((h, i) => (
            <button
              key={h.id}
              className="w-full text-left rounded-xl p-3 transition-all"
              style={{
                background: hadithIndex === i ? 'rgba(74,74,166,0.15)' : 'rgba(42,42,106,0.3)',
                border: `1px solid ${hadithIndex === i ? 'rgba(74,74,166,0.3)' : 'rgba(74,74,166,0.06)'}`,
              }}
              onClick={() => setHadithIndex(i)}
            >
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-bold mt-0.5 flex-shrink-0" style={{ color: hadithIndex === i ? '#4a4aa6' : 'rgba(204,204,204,0.3)' }}>
                  #{h.id}
                </span>
                <div>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: hadithIndex === i ? '#ffffff' : 'rgba(204,204,204,0.6)' }}>
                    {h.text}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(204,204,204,0.3)' }}>
                    {h.source}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
