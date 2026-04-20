'use client'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3, Zap, BookOpen } from 'lucide-react'
import { TAJWID_CATEGORIES, IQRA_BOOKS } from './types'

// === Props ===
interface IqraWeakAreaDashboardProps {
  completedPages: Set<string>
  tajwidMastered: Set<string>
  bookProgress: (bookId: number) => number
  xp: number
  streak: number
}

// === Level labels ===
const LEVEL_LABELS = [
  { min: 0, max: 20, label: 'Pemula', color: '#6a6ab6' },
  { min: 20, max: 40, label: 'Pertengahan', color: '#4a4aa6' },
  { min: 40, max: 60, label: 'Lanjutan', color: '#d4af37' },
  { min: 60, max: 80, label: 'Mahir', color: '#22c55e' },
  { min: 80, max: 101, label: 'Mumtaz', color: '#d4af37' },
]

function getLevel(score: number) {
  return LEVEL_LABELS.find(l => score >= l.min && score < l.max) || LEVEL_LABELS[0]
}

// === Circular Progress SVG ===
function CircularProgress({ value, size = 80, strokeWidth = 6, color = '#4a4aa6' }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(74,74,166,0.12)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </svg>
  )
}

// === Area Score type ===
interface AreaScore {
  id: string
  name: string
  icon: React.ReactNode
  score: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  color: string
}

// === Main Component ===
export function IqraWeakAreaDashboard({
  completedPages,
  tajwidMastered,
  bookProgress,
  xp,
  streak,
}: IqraWeakAreaDashboardProps) {
  // === Calculate scores ===
  const totalTajwidRules = TAJWID_CATEGORIES.reduce((s, c) => s + c.rules.length, 0)

  const hurufScore = useMemo(() => {
    const book1Pages = [...completedPages].filter(p => p.startsWith('1-')).length
    return Math.min(100, Math.round((book1Pages / 29) * 100))
  }, [completedPages])

  const harakatScore = useMemo(() => {
    return Math.min(100, Math.round((bookProgress(2) + bookProgress(3)) / 2))
  }, [bookProgress])

  const tanwinScore = useMemo(() => {
    return Math.min(100, Math.round((bookProgress(3) + bookProgress(4)) / 2))
  }, [bookProgress])

  const tajwidScore = useMemo(() => {
    return totalTajwidRules > 0 ? Math.round((tajwidMastered.size / totalTajwidRules) * 100) : 0
  }, [tajwidMastered, totalTajwidRules])

  const hafazanScore = 0 // No data

  const overallScore = useMemo(() => {
    const activeScores = [hurufScore, harakatScore, tanwinScore, tajwidScore].filter(s => s > 0)
    return activeScores.length > 0 ? Math.round(activeScores.reduce((a, b) => a + b, 0) / activeScores.length) : 0
  }, [hurufScore, harakatScore, tanwinScore, tajwidScore])

  const level = getLevel(overallScore)

  // === Area scores ===
  const areaScores: AreaScore[] = useMemo(() => [
    {
      id: 'huruf',
      name: 'Huruf Hijaiyah',
      icon: <span className="text-sm">🔤</span>,
      score: hurufScore,
      trend: hurufScore > 30 ? 'up' : 'stable',
      trendValue: 5,
      color: '#4a4aa6',
    },
    {
      id: 'harakat',
      name: 'Harakat',
      icon: <span className="text-sm">〰️</span>,
      score: harakatScore,
      trend: harakatScore > hurufScore ? 'up' : 'down',
      trendValue: 3,
      color: '#6a6ab6',
    },
    {
      id: 'tanwin',
      name: 'Tanwin & Mad',
      icon: <span className="text-sm">🎯</span>,
      score: tanwinScore,
      trend: tanwinScore > 20 ? 'up' : 'stable',
      trendValue: 2,
      color: '#d4af37',
    },
    {
      id: 'tajwid',
      name: 'Tajwid',
      icon: <span className="text-sm">📖</span>,
      score: tajwidScore,
      trend: tajwidScore > 15 ? 'up' : 'stable',
      trendValue: 4,
      color: '#22c55e',
    },
    {
      id: 'hafazan',
      name: 'Hafazan',
      icon: <span className="text-sm">🧠</span>,
      score: hafazanScore,
      trend: 'stable',
      trendValue: 0,
      color: '#9ca3af',
    },
  ], [hurufScore, harakatScore, tanwinScore, tajwidScore, hafazanScore])

  // === Weak areas (sorted by score ascending, skip 0 score hafazan) ===
  const weakAreas = useMemo(() => {
    return areaScores
      .filter(a => a.score < 60 && a.id !== 'hafazan')
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
  }, [areaScores])

  // === Recommendations ===
  const recommendations = useMemo(() => {
    const recs: Array<{ text: string; icon: React.ReactNode; xpReward: number }> = []

    if (hurufScore < 50) {
      recs.push({ text: 'Latih huruf hijaiyah di Iqra 1 — kenali semua 28 huruf', icon: <BookOpen className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />, xpReward: 50 })
    }
    if (harakatScore < 50) {
      recs.push({ text: 'Praktikkan harakat fathah, kasrah & dhammah di Iqra 2-3', icon: <Target className="h-3.5 w-3.5" style={{ color: '#6a6ab6' }} />, xpReward: 50 })
    }
    if (tajwidScore < 40) {
      const unmastered = TAJWID_CATEGORIES.flatMap(c => c.rules).filter(r => !tajwidMastered.has(r.id))
      if (unmastered.length > 0) {
        recs.push({ text: `Kuasai hukum ${unmastered[0].name} — ${unmastered[0].desc}`, icon: <AlertTriangle className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />, xpReward: 30 })
      }
    }
    if (tanwinScore < 50) {
      recs.push({ text: 'Pelajari tanwin dan mad di Iqra 3-4 untuk bacaan lebih lancar', icon: <Zap className="h-3.5 w-3.5" style={{ color: '#22c55e' }} />, xpReward: 40 })
    }

    // XP-based recommendations
    const lowestBook = IQRA_BOOKS.reduce((worst, b) => bookProgress(b.id) < bookProgress(worst.id) ? b : worst, IQRA_BOOKS[0])
    if (bookProgress(lowestBook.id) < 50) {
      const pagesLeft = Math.ceil((50 - bookProgress(lowestBook.id)) / 100 * lowestBook.pages)
      recs.push({ text: `Earn ${pagesLeft * 25} XP dengan lengkapkan ${pagesLeft} halaman ${lowestBook.title}`, icon: <Zap className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />, xpReward: pagesLeft * 25 })
    }

    return recs
  }, [hurufScore, harakatScore, tajwidScore, tanwinScore, tajwidMastered, bookProgress])

  // === Animation variants ===
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.35, ease: 'easeOut' },
    }),
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ===== 1. Overall Score Card ===== */}
      <motion.div
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl p-5 text-center"
        style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.12)' }}
      >
        <div className="flex items-center justify-center mb-3">
          <div className="relative">
            <CircularProgress value={overallScore} size={100} strokeWidth={8} color={level.color} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: '#ffffff' }}>{overallScore}%</span>
              <span className="text-[9px]" style={{ color: level.color }}>{level.label}</span>
            </div>
          </div>
        </div>
        <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>Skor Keseluruhan</div>
        <div className="text-[10px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
          {tajwidMastered.size} hukum dikuasai · {completedPages.size} halaman selesai · {streak} hari berturut
        </div>
        <div className="flex items-center justify-center gap-3 mt-3">
          <div className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-bold" style={{ color: '#d4af37' }}>{xp} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
            <span className="text-[10px] font-medium" style={{ color: '#4a4aa6' }}>Tahap: {level.label}</span>
          </div>
        </div>
      </motion.div>

      {/* ===== 2. Per-Area Score Cards ===== */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
          <span className="text-xs font-semibold" style={{ color: '#d4af37' }}>Skor Mengikut Kawasan</span>
        </div>
        {areaScores.map((area, i) => (
          <motion.div
            key={area.id}
            custom={i + 1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-xl p-3"
            style={{ background: 'rgba(42,42,106,0.25)', border: '1px solid rgba(74,74,166,0.08)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {area.icon}
                <span className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{area.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold" style={{ color: area.score >= 60 ? '#22c55e' : area.score >= 30 ? '#d4af37' : area.color }}>
                  {area.id === 'hafazan' ? 'Belum mula' : `${area.score}%`}
                </span>
                {area.trend === 'up' && <TrendingUp className="h-3 w-3" style={{ color: '#22c55e' }} />}
                {area.trend === 'down' && <TrendingDown className="h-3 w-3" style={{ color: '#ef4444' }} />}
              </div>
            </div>
            {area.id !== 'hafazan' ? (
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.12)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: area.score >= 60
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : area.score >= 30
                        ? 'linear-gradient(90deg, #d4af37, #fbbf24)'
                        : `linear-gradient(90deg, ${area.color}, ${area.color}88)`,
                  }}
                  animate={{ width: `${area.score}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            ) : (
              <div className="text-[9px] text-center py-1" style={{ color: 'rgba(204,204,204,0.4)' }}>
                Hafazan belum dimulakan — mulakan di tab Hafazan
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ===== 3. Weak Areas List ===== */}
      {weakAreas.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" style={{ color: '#f97316' }} />
            <span className="text-xs font-semibold" style={{ color: '#f97316' }}>Kawasan Perlu Latihan</span>
          </div>
          {weakAreas.map((area, i) => (
            <motion.div
              key={area.id}
              custom={i + 6}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-3"
              style={{
                background: 'rgba(249,115,22,0.06)',
                border: '1px solid rgba(249,115,22,0.12)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(249,115,22,0.12)' }}>
                    {area.icon}
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{area.name}</div>
                    <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Skor: {area.score}% — perlu latihan</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold" style={{ color: '#f97316' }}>{60 - area.score}% lagi</div>
                  <div className="text-[8px]" style={{ color: 'rgba(204,204,204,0.4)' }}>ke tahap lancar</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ===== 4. Book-by-Book Analysis ===== */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
          <span className="text-xs font-semibold" style={{ color: '#4a4aa6' }}>Analisis Per Buku</span>
        </div>
        {IQRA_BOOKS.map((book, i) => {
          const progress = bookProgress(book.id)
          const suggestion = progress === 100
            ? 'Selesai! 🎉'
            : progress >= 70
              ? 'Hampir siap — teruskan!'
              : progress >= 40
                ? `Lengkapkan ${book.title} untuk buku seterusnya`
                : progress > 0
                  ? `Latih ${book.focus.split(',')[0]}`
                  : 'Belum dimulakan'

          return (
            <motion.div
              key={book.id}
              custom={i + 9}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-3"
              style={{ background: 'rgba(42,42,106,0.25)', border: '1px solid rgba(74,74,166,0.08)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{book.icon}</span>
                  <div>
                    <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{book.title}</div>
                    <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{book.level}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {progress === 100 ? (
                    <CheckCircle className="h-3.5 w-3.5" style={{ color: '#22c55e' }} />
                  ) : (
                    <TrendingUp className="h-3.5 w-3.5" style={{ color: progress > 0 ? '#d4af37' : 'rgba(204,204,204,0.3)' }} />
                  )}
                  <span className="text-[11px] font-bold" style={{ color: progress === 100 ? '#22c55e' : progress > 0 ? '#d4af37' : 'rgba(204,204,204,0.4)' }}>
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.12)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: progress === 100
                      ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                      : progress > 0
                        ? `linear-gradient(90deg, ${book.color}, ${book.color}88)`
                        : 'rgba(74,74,166,0.2)',
                  }}
                  animate={{ width: `${Math.max(progress, 2)}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <div className="text-[9px] mt-1.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{suggestion}</div>
            </motion.div>
          )
        })}
      </div>

      {/* ===== 5. Tajwid Rule Breakdown ===== */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
          <span className="text-xs font-semibold" style={{ color: '#d4af37' }}>Penguasaan Tajwid Per-Hukum</span>
        </div>
        {TAJWID_CATEGORIES.map((cat, catIdx) => {
          const catMastered = cat.rules.filter(r => tajwidMastered.has(r.id)).length
          const catPct = Math.round((catMastered / cat.rules.length) * 100)

          return (
            <motion.div
              key={cat.id}
              custom={catIdx + 15}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-3"
              style={{ background: 'rgba(42,42,106,0.25)', border: '1px solid rgba(74,74,166,0.08)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[11px] font-semibold" style={{ color: '#ffffff' }}>{cat.name}</div>
                  <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)', direction: 'rtl' as const }}>{cat.nameAr}</div>
                </div>
                <span className="text-[10px] font-bold" style={{ color: catPct === 100 ? '#22c55e' : '#4a4aa6' }}>
                  {catMastered}/{cat.rules.length}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(74,74,166,0.12)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: catPct === 100 ? '#22c55e' : catPct > 0 ? '#4a4aa6' : 'rgba(74,74,166,0.2)' }}
                  animate={{ width: `${Math.max(catPct, 2)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {/* Individual rule scores */}
              <div className="flex flex-wrap gap-1 mt-2">
                {cat.rules.map(rule => {
                  const isMastered = tajwidMastered.has(rule.id)
                  return (
                    <div
                      key={rule.id}
                      className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px]"
                      style={{
                        background: isMastered ? 'rgba(34,197,94,0.12)' : 'rgba(42,42,106,0.5)',
                        border: `1px solid ${isMastered ? 'rgba(34,197,94,0.2)' : 'rgba(74,74,166,0.08)'}`,
                        color: isMastered ? '#22c55e' : 'rgba(204,204,204,0.5)',
                      }}
                    >
                      {isMastered ? <CheckCircle className="h-2.5 w-2.5" /> : <AlertTriangle className="h-2.5 w-2.5" style={{ color: 'rgba(249,115,22,0.5)' }} />}
                      {rule.name}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ===== 6. Recommended Actions ===== */}
      {recommendations.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" style={{ color: '#22c55e' }} />
            <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>Cadangan Tindakan</span>
          </div>
          {recommendations.map((rec, i) => (
            <motion.div
              key={i}
              custom={i + 21}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-3 flex items-start gap-2.5"
              style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.1)' }}
            >
              <div className="mt-0.5 shrink-0">{rec.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.8)' }}>{rec.text}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="h-2.5 w-2.5" style={{ color: '#d4af37' }} />
                  <span className="text-[8px] font-medium" style={{ color: '#d4af37' }}>+{rec.xpReward} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ===== 7. XP Recommendations ===== */}
      <motion.div
        custom={25}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="rounded-xl p-4"
        style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)' }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Cadangan XP</span>
        </div>
        <div className="space-y-1.5">
          {IQRA_BOOKS.filter(b => bookProgress(b.id) < 100).slice(0, 2).map(book => {
            const progress = bookProgress(book.id)
            const pagesLeft = Math.ceil(((100 - progress) / 100) * book.pages)
            const xpGain = pagesLeft * 25
            return (
              <div key={book.id} className="flex items-center justify-between px-2 py-1.5 rounded-lg" style={{ background: 'rgba(212,175,55,0.04)' }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{book.icon}</span>
                  <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.7)' }}>
                    Dapatkan <strong style={{ color: '#d4af37' }}>{xpGain} XP</strong> dengan lengkapkan {pagesLeft} halaman {book.title}
                  </span>
                </div>
              </div>
            )
          })}
          {tajwidMastered.size < totalTajwidRules && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: 'rgba(212,175,55,0.04)' }}>
              <span className="text-xs">📖</span>
              <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.7)' }}>
                Dapatkan <strong style={{ color: '#d4af37' }}>{(totalTajwidRules - tajwidMastered.size) * 15} XP</strong> dengan kuasai {totalTajwidRules - tajwidMastered.size} hukum tajwid lagi
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
