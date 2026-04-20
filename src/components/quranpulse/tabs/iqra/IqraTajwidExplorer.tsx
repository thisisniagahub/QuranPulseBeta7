'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Volume2, CheckCircle, Circle, ChevronDown, ChevronUp, BookOpen, Shield } from 'lucide-react'
import {
  TAJWID_CATEGORIES, TAJWID_COLORS, AL_QAMARIYYAH, AL_SYAMSIYYAH,
  IDGHAM_DETAIL, IKHFA_LETTERS, IQLAB_DATA, QALQALAH_DETAIL, MAD_DETAIL,
  WAQAF_SIGNS, JAKIM_TAJWID_REFS,
} from './types'

interface IqraTajwidExplorerProps {
  tajwidMastered: Set<string>
  setTajwidMastered: React.Dispatch<React.SetStateAction<Set<string>>>
  playingAudio: string | null
  playAudio: (text: string, id: string) => void
  addXp: (amount: number) => void
}

export function IqraTajwidExplorer({
  tajwidMastered,
  setTajwidMastered,
  playingAudio,
  playAudio,
  addXp,
}: IqraTajwidExplorerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<'rules' | 'visual' | 'mad' | 'mastery'>('rules')

  const totalRules = TAJWID_CATEGORIES.reduce((sum, cat) => sum + cat.rules.length, 0)
  const masteredCount = tajwidMastered.size

  const toggleMastery = (ruleId: string) => {
    setTajwidMastered(prev => {
      const next = new Set(prev)
      if (next.has(ruleId)) {
        next.delete(ruleId)
      } else {
        next.add(ruleId)
        addXp(15)
      }
      return next
    })
  }

  const toggleCategory = (catId: string) => {
    setExpandedCategory(prev => prev === catId ? null : catId)
  }

  // Find the color for a rule from TAJWID_COLORS
  const getRuleColor = (ruleName: string): string => {
    for (const key of Object.keys(TAJWID_COLORS)) {
      const entry = TAJWID_COLORS[key as keyof typeof TAJWID_COLORS]
      if (entry.rules.some(r => ruleName.toLowerCase().includes(r.toLowerCase().replace(/['']/g, '')))) {
        return entry.color
      }
    }
    return '#4a4aa6'
  }

  const sections: { key: typeof activeSection; label: string; icon: React.ReactNode }[] = [
    { key: 'rules', label: 'Hukum', icon: <BookOpen className="h-3.5 w-3.5" /> },
    { key: 'visual', label: 'Rujukan', icon: <Target className="h-3.5 w-3.5" /> },
    { key: 'mad', label: 'Mad', icon: <span className="text-sm">〰️</span> },
    { key: 'mastery', label: 'Kuasai', icon: <Shield className="h-3.5 w-3.5" /> },
  ]

  return (
    <div className="flex flex-col gap-3">
      {/* Section Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(42,42,106,0.4)' }}>
        {sections.map(sec => (
          <button
            key={sec.key}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-medium transition-all"
            style={{
              background: activeSection === sec.key ? 'rgba(74,74,166,0.25)' : 'transparent',
              color: activeSection === sec.key ? '#ffffff' : 'rgba(204,204,204,0.5)',
              border: activeSection === sec.key ? '1px solid rgba(74,74,166,0.3)' : '1px solid transparent',
            }}
            onClick={() => setActiveSection(sec.key)}
          >
            {sec.icon}
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Mastery Bar */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium" style={{ color: '#d4af37' }}>Penguasaan Tajwid</span>
          <span className="text-[10px] font-bold" style={{ color: '#ffffff' }}>{masteredCount}/{totalRules}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.15)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #4a4aa6, #d4af37)' }}
            animate={{ width: `${totalRules > 0 ? (masteredCount / totalRules) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeSection === 'rules' && <RulesSection />}
          {activeSection === 'visual' && <VisualReferenceSection />}
          {activeSection === 'mad' && <MadTypesSection />}
          {activeSection === 'mastery' && <MasterySection />}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  // ==================== RULES SECTION ====================
  function RulesSection() {
    return (
      <div className="space-y-2">
        {TAJWID_CATEGORIES.map((cat, catIdx) => {
          const isExpanded = expandedCategory === cat.id
          const catMastered = cat.rules.filter(r => tajwidMastered.has(r.id)).length

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.05 }}
              className="rounded-xl overflow-hidden"
              style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}
            >
              {/* Category Header */}
              <button
                className="w-full flex items-center justify-between p-3"
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(74,74,166,0.15)' }}>
                    <Target className="h-4 w-4" style={{ color: '#4a4aa6' }} />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>{cat.name}</div>
                    <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)', direction: 'rtl' as const }}>{cat.nameAr}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: catMastered === cat.rules.length ? 'rgba(34,197,94,0.15)' : 'rgba(74,74,166,0.12)', color: catMastered === cat.rules.length ? '#22c55e' : '#4a4aa6' }}>
                    {catMastered}/{cat.rules.length}
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.5)' }} /> : <ChevronDown className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.5)' }} />}
                </div>
              </button>

              {/* Expanded Rules */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 space-y-2">
                      {cat.rules.map((rule, ruleIdx) => {
                        const isMastered = tajwidMastered.has(rule.id)
                        const ruleColor = getRuleColor(rule.name)

                        return (
                          <motion.div
                            key={rule.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: ruleIdx * 0.05 }}
                            className="rounded-lg p-3"
                            style={{
                              background: 'rgba(42,42,106,0.5)',
                              border: `1px solid ${isMastered ? 'rgba(34,197,94,0.2)' : 'rgba(74,74,166,0.08)'}`,
                            }}
                          >
                            <div className="flex items-start gap-2">
                              <div className="h-2 w-2 rounded-full mt-1.5 shrink-0" style={{ background: ruleColor }} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{rule.name}</span>
                                  <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)', direction: 'rtl' as const }}>{rule.nameAr}</span>
                                </div>
                                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(204,204,204,0.6)' }}>{rule.desc}</p>

                                {/* Example */}
                                <div className="mt-2 rounded-lg p-2" style={{ background: 'rgba(26,26,74,0.5)' }}>
                                  <div className="text-lg font-arabic text-center" style={{ color: '#d4af37', direction: 'rtl' as const }}>{rule.example}</div>
                                </div>

                                {/* Quran Reference */}
                                <div className="mt-1.5 flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" style={{ color: 'rgba(74,74,166,0.4)' }} />
                                  <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{rule.quranRef}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-medium transition-all"
                                    style={{
                                      background: isMastered ? 'rgba(34,197,94,0.12)' : 'rgba(74,74,166,0.1)',
                                      border: `1px solid ${isMastered ? 'rgba(34,197,94,0.2)' : 'rgba(74,74,166,0.15)'}`,
                                      color: isMastered ? '#22c55e' : '#4a4aa6',
                                    }}
                                    onClick={() => toggleMastery(rule.id)}
                                  >
                                    {isMastered ? <CheckCircle className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                                    {isMastered ? 'Dikuasai' : 'Tandai Kuasai'}
                                  </button>
                                  <button
                                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] transition-all"
                                    style={{
                                      background: playingAudio === `tajwid-${rule.id}` ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.4)',
                                      border: `1px solid ${playingAudio === `tajwid-${rule.id}` ? 'rgba(212,175,55,0.25)' : 'rgba(74,74,166,0.08)'}`,
                                      color: playingAudio === `tajwid-${rule.id}` ? '#d4af37' : 'rgba(204,204,204,0.5)',
                                    }}
                                    onClick={() => playAudio(rule.example, `tajwid-${rule.id}`)}
                                  >
                                    <Volume2 className="h-3 w-3" />
                                    Dengar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}

                      {/* JAKIM Reference */}
                      {JAKIM_TAJWID_REFS[cat.id] && (
                        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
                          <Shield className="h-3 w-3 shrink-0" style={{ color: '#d4af37' }} />
                          <span className="text-[9px]" style={{ color: 'rgba(212,175,55,0.7)' }}>{JAKIM_TAJWID_REFS[cat.id]}</span>
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
    )
  }

  // ==================== VISUAL REFERENCE SECTION ====================
  function VisualReferenceSection() {
    return (
      <div className="space-y-4">
        {/* Qalqalah Letters */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-2 w-2 rounded-full" style={{ background: '#ef4444' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Qalqalah — قطب جد</span>
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>({QALQALAH_DETAIL.mnemonic})</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {QALQALAH_DETAIL.letters.map((l, i) => (
              <motion.div
                key={i}
                className="rounded-lg p-2 text-center aspect-square flex flex-col items-center justify-center"
                style={{
                  background: QALQALAH_DETAIL.types[0] && i < 3 ? 'rgba(239,68,68,0.12)' : 'rgba(249,115,22,0.12)',
                  border: `1px solid ${i < 3 ? 'rgba(239,68,68,0.2)' : 'rgba(249,115,22,0.2)'}`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="text-2xl font-arabic" style={{ color: '#ffffff', direction: 'rtl' as const }}>{l.letter}</span>
                <span className="text-[8px] mt-0.5" style={{ color: i < 3 ? '#ef4444' : '#f97316' }}>{l.name}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2 mt-1.5">
            {QALQALAH_DETAIL.types.map((t, i) => (
              <div key={i} className="flex-1 rounded-lg p-2" style={{ background: `${t.color}10`, border: `1px solid ${t.color}20` }}>
                <div className="text-[10px] font-semibold" style={{ color: t.color }}>{t.name}</div>
                <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{t.desc}</div>
                <div className="text-sm font-arabic mt-0.5" style={{ color: '#ffffff', direction: 'rtl' as const }}>{t.example}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Idgham Bighunnah */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-2 w-2 rounded-full" style={{ background: '#22c55e' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Idgham Bighunnah — ينمو</span>
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>({IDGHAM_DETAIL.bighunnah.mnemonic})</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {IDGHAM_DETAIL.bighunnah.letters.map((l, i) => (
              <motion.div
                key={i}
                className="rounded-lg p-2 text-center aspect-square flex flex-col items-center justify-center"
                style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <span className="text-2xl font-arabic" style={{ color: '#ffffff', direction: 'rtl' as const }}>{l}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-1.5 space-y-1">
            {IDGHAM_DETAIL.bighunnah.examples.slice(0, 2).map((ex, i) => (
              <div key={i} className="rounded-lg px-2.5 py-1.5 flex items-center justify-between" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)' }}>
                <span className="text-sm font-arabic" style={{ color: '#22c55e', direction: 'rtl' as const }}>{ex.from}</span>
                <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.5)' }}>→ {ex.result}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Idgham Bilaghunnah */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-2 w-2 rounded-full" style={{ background: '#4a4aa6' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Idgham Bilaghunnah — ل ر</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {IDGHAM_DETAIL.bilaghunnah.letters.map((l, i) => (
              <motion.div
                key={i}
                className="rounded-lg p-3 text-center flex flex-col items-center justify-center"
                style={{ background: 'rgba(74,74,166,0.12)', border: '1px solid rgba(74,74,166,0.2)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="text-3xl font-arabic" style={{ color: '#ffffff', direction: 'rtl' as const }}>{l}</span>
              </motion.div>
            ))}
          </div>
          {IDGHAM_DETAIL.bilaghunnah.examples.map((ex, i) => (
            <div key={i} className="rounded-lg px-2.5 py-1.5 flex items-center justify-between mt-1.5" style={{ background: 'rgba(74,74,166,0.06)', border: '1px solid rgba(74,74,166,0.1)' }}>
              <span className="text-sm font-arabic" style={{ color: '#4a4aa6', direction: 'rtl' as const }}>{ex.from}</span>
              <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.5)' }}>→ {ex.result}</span>
            </div>
          ))}
        </div>

        {/* Ikhfa' 15 Letters */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-2 w-2 rounded-full" style={{ background: '#22c55e' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Ikhfa&apos; Haqiqi — 15 huruf</span>
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>({IKHFA_LETTERS.nameAr})</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {IKHFA_LETTERS.letters.map((l, i) => (
              <motion.div
                key={i}
                className="rounded-lg px-2.5 py-2 text-center shrink-0"
                style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.15)', minWidth: '36px' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <span className="text-lg font-arabic" style={{ color: '#ffffff', direction: 'rtl' as const }}>{l}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-1.5 space-y-1">
            {IKHFA_LETTERS.examples.map((ex, i) => (
              <div key={i} className="rounded-lg px-2.5 py-1.5 flex items-center justify-between" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.08)' }}>
                <span className="text-sm font-arabic" style={{ color: '#22c55e', direction: 'rtl' as const }}>{ex.from}</span>
                <span className="text-[8px]" style={{ color: 'rgba(204,204,204,0.5)' }}>→ {ex.result}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Iqlab */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-2 w-2 rounded-full" style={{ background: '#8b5cf6' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Iqlab — ب</span>
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>({IQLAB_DATA.nameAr})</span>
          </div>
          <div className="flex gap-2">
            <motion.div
              className="rounded-lg p-4 text-center flex-1"
              style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-4xl font-arabic" style={{ color: '#ffffff', direction: 'rtl' as const }}>{IQLAB_DATA.letter}</span>
              <div className="text-[9px] mt-1" style={{ color: 'rgba(139,92,246,0.8)' }}>Tukar nun → mim</div>
            </motion.div>
            <div className="flex-1 space-y-1">
              {IQLAB_DATA.examples.map((ex, i) => (
                <div key={i} className="rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.1)' }}>
                  <div className="text-sm font-arabic" style={{ color: '#8b5cf6', direction: 'rtl' as const }}>{ex.from}</div>
                  <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.5)' }}>→ {ex.result}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Al-Qamariyyah 14 Letters */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-2 w-2 rounded-full" style={{ background: AL_QAMARIYYAH.color }} />
            <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{AL_QAMARIYYAH.name} — 14 huruf</span>
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>({AL_QAMARIYYAH.nameAr})</span>
          </div>
          <p className="text-[9px] mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{AL_QAMARIYYAH.desc}</p>
          <div className="grid grid-cols-7 gap-1">
            {AL_QAMARIYYAH.letters.map((l, i) => (
              <motion.div
                key={i}
                className="rounded-lg p-1.5 text-center"
                style={{ background: 'rgba(106,106,182,0.12)', border: '1px solid rgba(106,106,182,0.2)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <span className="text-lg font-arabic" style={{ color: '#ffffff', direction: 'rtl' as const }}>{l}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-1.5 rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(106,106,182,0.06)', border: '1px solid rgba(106,106,182,0.1)' }}>
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Contoh: </span>
            <span className="text-sm font-arabic" style={{ color: '#6a6ab6', direction: 'rtl' as const }}>{AL_QAMARIYYAH.example}</span>
          </div>
        </div>

        {/* As-Syamsiyyah 14 Letters */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-2 w-2 rounded-full" style={{ background: AL_SYAMSIYYAH.color }} />
            <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{AL_SYAMSIYYAH.name} — 14 huruf</span>
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>({AL_SYAMSIYYAH.nameAr})</span>
          </div>
          <p className="text-[9px] mb-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{AL_SYAMSIYYAH.desc}</p>
          <div className="grid grid-cols-7 gap-1">
            {AL_SYAMSIYYAH.letters.map((l, i) => (
              <motion.div
                key={i}
                className="rounded-lg p-1.5 text-center"
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <span className="text-lg font-arabic" style={{ color: '#ffffff', direction: 'rtl' as const }}>{l}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-1.5 rounded-lg px-2.5 py-1.5" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Contoh: </span>
            <span className="text-sm font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>{AL_SYAMSIYYAH.example}</span>
          </div>
        </div>

        {/* Waqaf Signs */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="h-2 w-2 rounded-full" style={{ background: '#6b7280' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>Tanda Waqaf — {WAQAF_SIGNS.length} tanda</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {WAQAF_SIGNS.map((sign, i) => (
              <motion.div
                key={i}
                className="rounded-lg p-2.5"
                style={{ background: `${sign.color}10`, border: `1px solid ${sign.color}20` }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-arabic" style={{ color: sign.color, direction: 'rtl' as const }}>{sign.symbol}</span>
                  <div>
                    <div className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>{sign.name}</div>
                    <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{sign.nameAr}</div>
                  </div>
                </div>
                <div className="text-[8px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>{sign.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ==================== MAD TYPES SECTION ====================
  function MadTypesSection() {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>Hukum Mad — 6 Jenis</span>
        </div>
        {MAD_DETAIL.map((mad, i) => (
          <motion.div
            key={mad.id}
            className="rounded-xl p-3"
            style={{ background: `${mad.color}08`, border: `1px solid ${mad.color}20` }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: mad.color }} />
              <div>
                <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{mad.name}</div>
                <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)', direction: 'rtl' as const }}>{mad.nameAr}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="rounded-lg p-2" style={{ background: 'rgba(42,42,106,0.4)' }}>
                <div className="text-[8px] uppercase tracking-wide" style={{ color: 'rgba(204,204,204,0.4)' }}>Panjang</div>
                <div className="text-[11px] font-semibold" style={{ color: mad.color }}>{mad.length}</div>
              </div>
              <div className="rounded-lg p-2" style={{ background: 'rgba(42,42,106,0.4)' }}>
                <div className="text-[8px] uppercase tracking-wide" style={{ color: 'rgba(204,204,204,0.4)' }}>Iqra&apos; Buku</div>
                <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{mad.book}</div>
              </div>
            </div>
            <div className="rounded-lg p-2 mb-1.5" style={{ background: 'rgba(26,26,74,0.5)' }}>
              <div className="text-[8px] mb-0.5" style={{ color: 'rgba(204,204,204,0.4)' }}>Syarat</div>
              <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.7)' }}>{mad.condition}</div>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(26,26,74,0.5)' }}>
              <div className="text-lg font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>{mad.example}</div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] transition-all"
                style={{
                  background: playingAudio === `mad-${mad.id}` ? `${mad.color}20` : 'rgba(42,42,106,0.4)',
                  border: `1px solid ${playingAudio === `mad-${mad.id}` ? `${mad.color}30` : 'rgba(74,74,166,0.08)'}`,
                  color: playingAudio === `mad-${mad.id}` ? mad.color : 'rgba(204,204,204,0.5)',
                }}
                onClick={() => playAudio(mad.example, `mad-${mad.id}`)}
              >
                <Volume2 className="h-3 w-3" />
                Dengar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  // ==================== MASTERY SECTION ====================
  function MasterySection() {
    const masteryPct = totalRules > 0 ? Math.round((masteredCount / totalRules) * 100) : 0

    return (
      <div className="space-y-3">
        {/* Overall Progress */}
        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
          <div className="text-3xl font-bold mb-1" style={{ color: masteryPct >= 75 ? '#22c55e' : masteryPct >= 40 ? '#d4af37' : '#4a4aa6' }}>
            {masteryPct}%
          </div>
          <div className="text-xs" style={{ color: 'rgba(204,204,204,0.6)' }}>Penguasaan Tajwid</div>
          <div className="h-3 rounded-full overflow-hidden mt-3" style={{ background: 'rgba(74,74,166,0.15)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{
                background: masteryPct >= 75
                  ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                  : masteryPct >= 40
                    ? 'linear-gradient(90deg, #d4af37, #fbbf24)'
                    : 'linear-gradient(90deg, #4a4aa6, #6a6ab6)',
              }}
              animate={{ width: `${masteryPct}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{masteredCount} dikuasai</span>
            <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{totalRules - masteredCount} belum</span>
          </div>
        </div>

        {/* Per-Category Progress */}
        {TAJWID_CATEGORIES.map((cat, i) => {
          const catMastered = cat.rules.filter(r => tajwidMastered.has(r.id)).length
          const catPct = Math.round((catMastered / cat.rules.length) * 100)

          return (
            <motion.div
              key={cat.id}
              className="rounded-xl p-3"
              style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{cat.name}</span>
                  <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)', direction: 'rtl' as const }}>{cat.nameAr}</span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: catPct === 100 ? '#22c55e' : '#4a4aa6' }}>
                  {catMastered}/{cat.rules.length}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.12)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: catPct === 100 ? '#22c55e' : '#4a4aa6' }}
                  animate={{ width: `${catPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {cat.rules.map(rule => {
                  const isMastered = tajwidMastered.has(rule.id)
                  return (
                    <button
                      key={rule.id}
                      className="flex items-center gap-0.5 px-2 py-1 rounded-full text-[8px] transition-all"
                      style={{
                        background: isMastered ? 'rgba(34,197,94,0.12)' : 'rgba(42,42,106,0.5)',
                        border: `1px solid ${isMastered ? 'rgba(34,197,94,0.2)' : 'rgba(74,74,166,0.08)'}`,
                        color: isMastered ? '#22c55e' : 'rgba(204,204,204,0.5)',
                      }}
                      onClick={() => toggleMastery(rule.id)}
                    >
                      {isMastered ? <CheckCircle className="h-2.5 w-2.5" /> : <Circle className="h-2.5 w-2.5" />}
                      {rule.name}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )
        })}

        {/* JAKIM Certification Note */}
        <div className="rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Pensijilan JAKIM</span>
          </div>
          <p className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
            Semua rujukan tajwid berdasarkan Panduan Tilawah Al-Quran JAKIM (2019) dan Kaedah Tajwid KPM/JAKIM (2018). Lengkapkan semua hukum untuk mendapat sijil pencapaian.
          </p>
        </div>
      </div>
    )
  }
}
