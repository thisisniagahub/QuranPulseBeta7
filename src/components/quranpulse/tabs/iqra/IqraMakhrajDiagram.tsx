'use client'

import { motion } from 'framer-motion'
import { MAKHRAJ_DATA } from './types'
import { X, Volume2, MapPin, Tag } from 'lucide-react'

interface IqraMakhrajDiagramProps {
  letter: string
  onClose: () => void
  playAudio: (text: string, id: string) => void
  playingAudio: string | null
}

// === Articulation point positions on the SVG diagram ===
// Based on sagittal cross-section with viewBox="0 0 300 360"
// Right = front (lips), Left = back (throat)

type MakhrajPosition = {
  cx: number
  cy: number
  label: string
  description: string
}

const getArticulationPoint = (letter: string): MakhrajPosition => {
  const pointMap: Record<string, MakhrajPosition> = {
    // === HALQI (Throat) ===
    'ا': { cx: 62, cy: 295, label: 'Larynx', description: 'Bawah tekak (larynx)' },
    'ء': { cx: 62, cy: 295, label: 'Larynx', description: 'Bawah tekak (larynx)' },
    'ه': { cx: 58, cy: 235, label: 'Lower Pharynx', description: 'Bawah tekak (farinks bawah)' },
    'ع': { cx: 55, cy: 195, label: 'Mid Pharynx', description: 'Tengah tekak (farinks tengah)' },
    'ح': { cx: 55, cy: 195, label: 'Mid Pharynx', description: 'Tengah tekak (farinks tengah)' },
    'غ': { cx: 68, cy: 155, label: 'Upper Pharynx', description: 'Atas tekak (uvula)' },
    'خ': { cx: 68, cy: 155, label: 'Upper Pharynx', description: 'Atas tekak (uvula)' },

    // === SYAFAWI (Lips) ===
    'ب': { cx: 248, cy: 155, label: 'Bilateral Lips', description: 'Kedua-dua bibir' },
    'م': { cx: 248, cy: 155, label: 'Closed Lips', description: 'Bibir tertutup' },
    'و': { cx: 250, cy: 148, label: 'Rounded Lips', description: 'Bibir dibundarkan' },
    'ف': { cx: 238, cy: 142, label: 'Lower Lip + Upper Teeth', description: 'Bibir bawah + gigi atas' },

    // === LISAN (Tongue) - Tip + Gums ===
    'ت': { cx: 218, cy: 140, label: 'Tongue Tip + Alveolar', description: 'Hujung lidah + gusi atas' },
    'د': { cx: 218, cy: 140, label: 'Tongue Tip + Alveolar', description: 'Hujung lidah + gusi atas' },
    'ط': { cx: 215, cy: 137, label: 'Tongue Tip + Alveolar (thick)', description: 'Hujung lidah + gusi atas (tebal)' },
    'ل': { cx: 212, cy: 142, label: 'Tongue Tip + Alveolar', description: 'Hujung lidah + gusi atas' },
    'ن': { cx: 210, cy: 145, label: 'Tongue Tip + Alveolar (nasal)', description: 'Hujung lidah + gusi atas (hidung)' },
    'ر': { cx: 220, cy: 138, label: 'Tongue Tip Curled', description: 'Hujung lidah + gusi (gulung)' },

    // === LISAN (Tongue) - Tip + Teeth ===
    'ث': { cx: 232, cy: 150, label: 'Tongue Tip + Teeth', description: 'Hujung lidah + gigi atas' },
    'ذ': { cx: 232, cy: 150, label: 'Tongue Tip + Teeth', description: 'Hujung lidah + gigi atas' },
    'ظ': { cx: 230, cy: 148, label: 'Tongue Tip + Teeth (thick)', description: 'Hujung lidah + gigi atas (tebal)' },

    // === LISAN (Tongue) - Mid + Palate ===
    'ج': { cx: 165, cy: 112, label: 'Mid Tongue + Hard Palate', description: 'Tengah lidah + lelangit keras' },
    'ش': { cx: 168, cy: 115, label: 'Mid Tongue + Hard Palate', description: 'Tengah lidah + lelangit keras' },
    'ي': { cx: 170, cy: 118, label: 'Mid Tongue + Hard Palate', description: 'Tengah lidah + lelangit keras' },

    // === LISAN (Tongue) - Side ===
    'ض': { cx: 185, cy: 162, label: 'Side Tongue + Molars', description: 'Sisi lidah + gusi atas' },

    // === LISAN (Tongue) - Back ===
    'ق': { cx: 100, cy: 145, label: 'Back Tongue + Soft Palate', description: 'Belakang lidah + lelangit lembut' },
    'ك': { cx: 120, cy: 125, label: 'Back Tongue + Hard Palate', description: 'Belakang lidah + lelangit keras' },

    // === LISAN (Tongue) - Additional ===
    'س': { cx: 222, cy: 142, label: 'Tongue Tip + Alveolar', description: 'Hujung lidah + gusi atas' },
    'ص': { cx: 220, cy: 140, label: 'Tongue Tip + Alveolar (thick)', description: 'Hujung lidah + gusi atas (tebal)' },
    'ز': { cx: 230, cy: 148, label: 'Tongue Tip + Teeth', description: 'Hujung lidah + gigi atas' },
  }

  return pointMap[letter] || { cx: 180, cy: 160, label: 'Oral Cavity', description: 'Rongga mulut' }
}

// === Group color mapping ===
const getGroupColor = (group: string): string => {
  switch (group) {
    case 'Halqi': return '#ef4444'
    case 'Syafawi': return '#3b82f6'
    case 'Lisan': return '#22c55e'
    default: return '#d4af37'
  }
}

const getGroupLabel = (group: string): string => {
  switch (group) {
    case 'Halqi': return 'حلقي (Tekak)'
    case 'Syafawi': return 'شفتاني (Bibir)'
    case 'Lisan': return 'لساني (Lidah)'
    default: return group
  }
}

export default function IqraMakhrajDiagram({ letter, onClose, playAudio, playingAudio }: IqraMakhrajDiagramProps) {
  const makhrajEntry = MAKHRAJ_DATA.find(m => m.letter === letter)
  const articulationPoint = getArticulationPoint(letter)

  if (!makhrajEntry) return null

  const groupColor = getGroupColor(makhrajEntry.group)
  const isPlaying = playingAudio === `makhraj-${letter}`
  const audioId = `makhraj-${letter}`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a4a 0%, #2a2a6a 100%)',
          border: '1px solid rgba(74,74,166,0.3)',
          boxShadow: `0 0 40px rgba(74,74,166,0.2), 0 0 80px ${groupColor}22`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(74,74,166,0.2)' }}>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(212,175,55,0.15)',
                border: '2px solid rgba(212,175,55,0.4)',
              }}
            >
              <span className="text-3xl font-bold" style={{ color: '#d4af37', fontFamily: "'Amiri', serif" }}>
                {letter}
              </span>
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-white">{makhrajEntry.name}</h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${groupColor}22`, color: groupColor, border: `1px solid ${groupColor}44` }}
              >
                {getGroupLabel(makhrajEntry.group)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* SVG Diagram */}
        <div className="px-4 pt-4 pb-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <svg
              viewBox="0 0 300 310"
              className="w-full"
              style={{ maxHeight: '280px' }}
            >
              {/* === Background === */}
              <defs>
                {/* Glow filter for articulation point */}
                <filter id="pointGlow" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Gradient for the oral cavity fill */}
                <linearGradient id="cavityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(74,74,166,0.08)" />
                  <stop offset="100%" stopColor="rgba(74,74,166,0.15)" />
                </linearGradient>
                {/* Pharynx gradient */}
                <linearGradient id="pharynxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(74,74,166,0.1)" />
                  <stop offset="100%" stopColor="rgba(74,74,166,0.2)" />
                </linearGradient>
                {/* Tongue gradient */}
                <linearGradient id="tongueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(180,140,100,0.2)" />
                  <stop offset="100%" stopColor="rgba(180,140,100,0.35)" />
                </linearGradient>
                {/* Pulse animation for the dot */}
                <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
                  <stop offset="60%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* === PHARYNX (Throat) - Back Wall === */}
              <path
                d="M 40,85 C 35,100 30,150 30,200 C 30,240 35,270 40,295 L 50,295 C 45,270 42,240 42,200 C 42,150 46,100 50,85 Z"
                fill="url(#pharynxGrad)"
                stroke="#4a4aa6"
                strokeWidth="1.5"
                strokeOpacity="0.5"
              />

              {/* === LARYNX (Voice Box) === */}
              <path
                d="M 42,270 C 42,280 50,300 65,305 C 80,310 95,305 100,295 L 95,290 C 90,298 80,302 68,298 C 56,294 50,285 50,275 Z"
                fill="rgba(74,74,166,0.12)"
                stroke="#4a4aa6"
                strokeWidth="1.2"
                strokeOpacity="0.5"
              />
              <text x="65" y="296" fontSize="7" fill="#6a6ab6" textAnchor="middle" opacity="0.8">
                Larynx
              </text>

              {/* === NASAL CAVITY === */}
              <path
                d="M 95,55 L 260,55 L 260,75 C 230,78 180,82 140,78 C 120,75 105,70 95,65 Z"
                fill="rgba(74,74,166,0.06)"
                stroke="#4a4aa6"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              <text x="175" y="67" fontSize="7" fill="#6a6ab6" textAnchor="middle" opacity="0.6">
                Rongga Hidung
              </text>

              {/* === HARD PALATE (Roof of mouth) === */}
              <path
                d="M 95,82 C 120,72 170,68 220,82 L 220,90 C 170,78 120,80 95,90 Z"
                fill="rgba(74,74,166,0.1)"
                stroke="#4a4aa6"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              <text x="155" y="84" fontSize="7" fill="#8a8ac6" textAnchor="middle" opacity="0.7">
                Lelangit Keras
              </text>

              {/* === SOFT PALATE (Velum) === */}
              <path
                d="M 60,82 C 70,75 82,76 95,82 L 95,90 C 82,85 70,84 63,90 Z"
                fill="rgba(74,74,166,0.12)"
                stroke="#4a4aa6"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              <text x="78" y="86" fontSize="6" fill="#8a8ac6" textAnchor="middle" opacity="0.7">
                Lelangit Lembut
              </text>

              {/* === UVULA === */}
              <ellipse
                cx="62"
                cy="108"
                rx="7"
                ry="14"
                fill="rgba(74,74,166,0.15)"
                stroke="#4a4aa6"
                strokeWidth="1.2"
                strokeOpacity="0.5"
              />
              <text x="62" y="132" fontSize="6" fill="#8a8ac6" textAnchor="middle" opacity="0.6">
                Uvula
              </text>

              {/* === UPPER TEETH === */}
              <path
                d="M 220,82 L 225,82 L 225,108 C 225,112 230,112 230,108 L 230,82 L 235,82 L 235,105 C 235,109 240,109 240,105 L 240,82 L 245,82 L 245,108 C 245,112 250,112 250,108 L 250,82 L 252,82"
                fill="rgba(255,255,255,0.15)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />
              <text x="236" y="78" fontSize="6" fill="#aaaacc" textAnchor="middle" opacity="0.6">
                Gigi Atas
              </text>

              {/* === GUMS / ALVEOLAR RIDGE === */}
              <path
                d="M 215,82 C 218,75 222,72 228,72 C 234,72 238,75 240,82 L 240,85 C 236,80 232,78 228,78 C 222,78 218,80 215,85 Z"
                fill="rgba(200,120,120,0.12)"
                stroke="rgba(200,120,120,0.4)"
                strokeWidth="1"
              />
              <text x="228" y="68" fontSize="6" fill="#cc8888" textAnchor="middle" opacity="0.7">
                Gusi
              </text>

              {/* === TONGUE === */}
              <path
                d="M 90,260 C 100,240 130,220 160,200 C 180,190 210,178 225,170 L 225,165 C 210,172 180,185 155,198 C 125,215 100,235 88,255 Z"
                fill="url(#tongueGrad)"
                stroke="#b48c64"
                strokeWidth="1.8"
                strokeOpacity="0.5"
              />
              {/* Tongue tip detail */}
              <path
                d="M 225,170 C 230,168 234,165 236,160 L 238,158 C 236,163 232,167 228,170 Z"
                fill="rgba(180,140,100,0.3)"
                stroke="#b48c64"
                strokeWidth="1"
                strokeOpacity="0.4"
              />
              {/* Tongue surface line */}
              <path
                d="M 95,258 C 110,240 140,222 170,205 C 195,192 218,180 230,170"
                fill="none"
                stroke="#b48c64"
                strokeWidth="0.8"
                strokeOpacity="0.3"
                strokeDasharray="3,3"
              />
              <text x="150" y="240" fontSize="7" fill="#b48c64" textAnchor="middle" opacity="0.6">
                Lidah
              </text>

              {/* === LOWER TEETH === */}
              <path
                d="M 220,192 L 225,192 L 225,175 C 225,171 230,171 230,175 L 230,192 L 235,192 L 235,178 C 235,174 240,174 240,178 L 240,192 L 245,192 L 245,175 C 245,171 250,171 250,175 L 250,192 L 252,192"
                fill="rgba(255,255,255,0.15)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1"
              />

              {/* === LIPS === */}
              {/* Upper lip */}
              <path
                d="M 252,82 C 256,90 260,110 260,130 C 260,142 258,150 255,156"
                fill="none"
                stroke="#b48c64"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeOpacity="0.6"
              />
              {/* Lower lip */}
              <path
                d="M 252,192 C 256,188 260,175 260,162 C 260,155 258,152 255,156"
                fill="none"
                stroke="#b48c64"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeOpacity="0.6"
              />
              {/* Lip fill area */}
              <path
                d="M 252,82 C 262,95 265,120 262,145 C 260,155 258,158 255,160 C 258,152 260,142 260,130 C 260,110 256,90 252,82"
                fill="rgba(180,120,120,0.1)"
                stroke="none"
              />
              <text x="270" y="145" fontSize="6" fill="#cc8888" textAnchor="start" opacity="0.7">
                Bibir
              </text>

              {/* === PHARYNX LABEL === */}
              <text x="20" y="200" fontSize="7" fill="#6a6ab6" textAnchor="middle" opacity="0.7"
                transform="rotate(-90, 20, 200)">
                Farinks (Tekak)
              </text>

              {/* === EPIGLOTTIS === */}
              <path
                d="M 55,255 C 50,248 52,238 58,235 C 64,232 68,238 65,245 Z"
                fill="rgba(74,74,166,0.1)"
                stroke="#4a4aa6"
                strokeWidth="1"
                strokeOpacity="0.4"
              />

              {/* === ORAL CAVITY OUTLINE (connecting everything) === */}
              <path
                d="M 255,82 C 250,82 240,82 220,82 C 170,68 120,72 95,82 C 82,76 70,75 60,82 C 50,90 45,110 42,135 C 38,170 38,210 42,250 C 44,265 48,280 55,295"
                fill="none"
                stroke="#4a4aa6"
                strokeWidth="1.5"
                strokeOpacity="0.3"
                strokeDasharray="5,5"
              />
              <path
                d="M 255,192 C 245,210 230,220 200,230 C 160,245 120,258 90,268 C 70,275 58,285 55,295"
                fill="none"
                stroke="#4a4aa6"
                strokeWidth="1.5"
                strokeOpacity="0.3"
                strokeDasharray="5,5"
              />

              {/* === AREA LABELS === */}
              {/* Throat areas */}
              <text x="85" y="290" fontSize="6" fill="#6a6ab6" textAnchor="middle" opacity="0.5">
                Bawah
              </text>
              <text x="85" y="230" fontSize="6" fill="#6a6ab6" textAnchor="middle" opacity="0.5">
                Tengah
              </text>
              <text x="80" y="168" fontSize="6" fill="#6a6ab6" textAnchor="middle" opacity="0.5">
                Atas
              </text>

              {/* === ARTICULATION POINT (Glowing Dot) === */}
              {/* Outer glow pulse */}
              <motion.circle
                cx={articulationPoint.cx}
                cy={articulationPoint.cy}
                r="18"
                fill={groupColor}
                opacity={0.15}
                animate={{
                  r: [18, 24, 18],
                  opacity: [0.15, 0.05, 0.15],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* Mid glow */}
              <motion.circle
                cx={articulationPoint.cx}
                cy={articulationPoint.cy}
                r="12"
                fill={groupColor}
                opacity={0.25}
                animate={{
                  r: [12, 16, 12],
                  opacity: [0.25, 0.1, 0.25],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.2,
                }}
              />
              {/* Core dot */}
              <motion.circle
                cx={articulationPoint.cx}
                cy={articulationPoint.cy}
                r="6"
                fill="#ef4444"
                stroke="white"
                strokeWidth="1.5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 400 }}
                filter="url(#pointGlow)"
              />
              {/* Inner bright dot */}
              <circle
                cx={articulationPoint.cx}
                cy={articulationPoint.cy}
                r="2.5"
                fill="white"
                opacity="0.8"
              />

              {/* === POINT LABEL LINE === */}
              {(() => {
                const px = articulationPoint.cx
                const py = articulationPoint.cy
                // Determine label position based on where the dot is
                let labelX: number, labelY: number, lineEndX: number, lineEndY: number

                if (px > 180) {
                  // Front of mouth - label goes to the right
                  labelX = 280
                  labelY = py < 130 ? 52 : 280
                  lineEndX = 270
                  lineEndY = labelY
                } else if (px < 80) {
                  // Throat area - label goes to the left
                  labelX = 10
                  labelY = py
                  lineEndX = 22
                  lineEndY = py
                } else {
                  // Middle - label goes up
                  labelX = px
                  labelY = 42
                  lineEndX = px
                  lineEndY = 52
                }

                return (
                  <>
                    <line
                      x1={px}
                      y1={py}
                      x2={lineEndX}
                      y2={lineEndY}
                      stroke="white"
                      strokeWidth="0.8"
                      strokeOpacity="0.4"
                      strokeDasharray="3,2"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      fontSize="7.5"
                      fill="white"
                      textAnchor={px > 180 ? 'end' : px < 80 ? 'start' : 'middle'}
                      opacity="0.85"
                      fontWeight="600"
                    >
                      {articulationPoint.label}
                    </text>
                  </>
                )
              })()}

              {/* === GROUP ZONE HIGHLIGHTING === */}
              {makhrajEntry.group === 'Halqi' && (
                <motion.ellipse
                  cx="50"
                  cy="210"
                  rx="25"
                  ry="100"
                  fill="rgba(239,68,68,0.06)"
                  stroke="rgba(239,68,68,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4,3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                />
              )}
              {makhrajEntry.group === 'Syafawi' && (
                <motion.ellipse
                  cx="252"
                  cy="140"
                  rx="18"
                  ry="30"
                  fill="rgba(59,130,246,0.06)"
                  stroke="rgba(59,130,246,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4,3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                />
              )}
              {makhrajEntry.group === 'Lisan' && (
                <motion.ellipse
                  cx="170"
                  cy="185"
                  rx="75"
                  ry="50"
                  fill="rgba(34,197,94,0.04)"
                  stroke="rgba(34,197,94,0.15)"
                  strokeWidth="1"
                  strokeDasharray="4,3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                />
              )}
            </svg>
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="px-4 pb-2 space-y-2">
          {/* Makhraj Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-2 gap-2"
          >
            {/* Makhraj Name */}
            <div
              className="p-3 rounded-xl"
              style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.2)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <MapPin className="w-3 h-3" style={{ color: groupColor }} />
                <span className="text-[10px] uppercase tracking-wider" style={{ color: '#8a8ac6' }}>
                  Makhraj
                </span>
              </div>
              <p className="text-sm text-white font-medium leading-tight">{makhrajEntry.makhraj}</p>
              <p className="text-xs mt-0.5" style={{ color: '#d4af37', fontFamily: "'Amiri', serif" }}>
                {makhrajEntry.makhrajAr}
              </p>
            </div>

            {/* Group */}
            <div
              className="p-3 rounded-xl"
              style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.2)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Tag className="w-3 h-3" style={{ color: groupColor }} />
                <span className="text-[10px] uppercase tracking-wider" style={{ color: '#8a8ac6' }}>
                  Kumpulan
                </span>
              </div>
              <p className="text-sm text-white font-medium">{makhrajEntry.group}</p>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full mt-0.5 inline-block"
                style={{ background: `${groupColor}22`, color: groupColor }}
              >
                {makhrajEntry.group === 'Halqi' ? '7 huruf' : makhrajEntry.group === 'Syafawi' ? '4 huruf' : '17 huruf'}
              </span>
            </div>
          </motion.div>

          {/* Articulation Detail */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="p-3 rounded-xl"
            style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.2)' }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8a8ac6' }}>
              Titik Sebutan
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }}
              />
              <p className="text-sm text-white">{articulationPoint.description}</p>
            </div>
          </motion.div>

          {/* Same Group Letters */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-3 rounded-xl"
            style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.2)' }}
          >
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8a8ac6' }}>
              Huruf {makhrajEntry.group} Lain
            </p>
            <div className="flex flex-wrap gap-1.5">
              {MAKHRAJ_DATA.filter(m => m.group === makhrajEntry.group).map(m => (
                <button
                  key={m.letter}
                  onClick={() => playAudio(m.letter, `makhraj-${m.letter}`)}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: m.letter === letter ? `${groupColor}33` : 'rgba(74,74,166,0.15)',
                    border: m.letter === letter ? `1.5px solid ${groupColor}` : '1px solid rgba(74,74,166,0.2)',
                    fontFamily: "'Amiri', serif",
                    color: m.letter === letter ? groupColor : '#ccccee',
                  }}
                >
                  <span className="text-base">{m.letter}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Action Bar */}
        <div
          className="p-4 flex gap-3"
          style={{ borderTop: '1px solid rgba(74,74,166,0.2)' }}
        >
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => playAudio(makhrajEntry.letter, audioId)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all"
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.15))'
                : 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))',
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#d4af37',
            }}
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
            {isPlaying ? 'Bermain...' : 'Dengar'}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-medium text-sm text-white transition-all"
            style={{
              background: 'rgba(74,74,166,0.2)',
              border: '1px solid rgba(74,74,166,0.3)',
            }}
          >
            Tutup
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
