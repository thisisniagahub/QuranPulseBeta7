'use client'
import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pen, ChevronLeft, ChevronRight, Play, RotateCcw } from 'lucide-react'
import { ENHANCED_LETTERS } from './types'

interface IqraStrokeAnimationProps {
  writingLetter: number
  setWritingLetter: (idx: number) => void
}

// Stroke direction data for each letter
// Each stroke has: direction (rtl=ltr), start position hint, and order
const STROKE_DATA: Array<{
  strokes: number
  directions: string[]
  arrows: string[]
}> = [
  { strokes: 1, directions: ['top → bottom'], arrows: ['↓'] },       // Alif
  { strokes: 2, directions: ['right → left (curve)', 'dot below'], arrows: ['↰', '•'] }, // Ba
  { strokes: 2, directions: ['right → left (curve)', '2 dots above'], arrows: ['↰', '⋰'] }, // Ta
  { strokes: 2, directions: ['right → left (curve)', '3 dots above'], arrows: ['↰', '⋯'] }, // Tsa
  { strokes: 2, directions: ['right → left (hook)', 'dot inside'], arrows: ['↴', '•'] }, // Jim
  { strokes: 1, directions: ['right → left (circle)'], arrows: ['↺'] }, // Ha
  { strokes: 2, directions: ['right → left (circle)', 'dot above'], arrows: ['↺', '•'] }, // Kho
  { strokes: 1, directions: ['top → left curve'], arrows: ['↱'] },  // Dal
  { strokes: 2, directions: ['top → left curve', 'dot above'], arrows: ['↱', '•'] }, // Dzal
  { strokes: 1, directions: ['top → down curve'], arrows: ['↴'] },  // Ra
  { strokes: 2, directions: ['top → down curve', 'dot above'], arrows: ['↴', '•'] }, // Zai
  { strokes: 3, directions: ['tooth 1', 'tooth 2', 'tooth 3'], arrows: ['↓', '↓', '↓'] }, // Sin
  { strokes: 4, directions: ['tooth 1', 'tooth 2', 'tooth 3', '3 dots'], arrows: ['↓', '↓', '↓', '⋯'] }, // Syin
  { strokes: 3, directions: ['flat tooth 1', 'flat tooth 2', 'flat tooth 3'], arrows: ['→', '→', '→'] }, // Shod
  { strokes: 4, directions: ['flat tooth 1', 'flat tooth 2', 'flat tooth 3', 'dot above'], arrows: ['→', '→', '→', '•'] }, // Dhod
  { strokes: 4, directions: ['flat tooth 1', 'flat tooth 2', 'flat tooth 3', 'dot above'], arrows: ['→', '→', '→', '•'] }, // Tho
  { strokes: 4, directions: ['flat tooth 1', 'flat tooth 2', 'flat tooth 3', 'dot center'], arrows: ['→', '→', '→', '•'] }, // Zho
  { strokes: 2, directions: ['top → middle hook', 'bottom hook'], arrows: ['↴', '↱'] }, // Ain
  { strokes: 2, directions: ['top → middle hook', 'dot above'], arrows: ['↴', '•'] }, // Ghoin
  { strokes: 2, directions: ['ring + tail', 'dot above'], arrows: ['↺', '•'] }, // Fa
  { strokes: 2, directions: ['loop + tail', '2 dots above'], arrows: ['↺', '⋰'] }, // Qof
  { strokes: 2, directions: ['vertical + base', 'top bar'], arrows: ['↓', '→'] }, // Kaf
  { strokes: 1, directions: ['top → down + hook'], arrows: ['↓↱'] }, // Lam
  { strokes: 2, directions: ['circle', 'tail down'], arrows: ['↺', '↓'] }, // Mim
  { strokes: 2, directions: ['bowl curve', 'dot above'], arrows: ['↰', '•'] }, // Nun
  { strokes: 1, directions: ['wave shape'], arrows: ['∿'] },         // Ha
  { strokes: 2, directions: ['head circle', 'body line'], arrows: ['↺', '↓'] }, // Wau
  { strokes: 2, directions: ['hook curve', '2 dots below'], arrows: ['↰', '⋰'] }, // Ya
]

export function IqraStrokeAnimation({ writingLetter, setWritingLetter }: IqraStrokeAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStroke, setCurrentStroke] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(1.0)
  const [revealProgress, setRevealProgress] = useState(0)

  const letter = ENHANCED_LETTERS[writingLetter]
  const strokeInfo = STROKE_DATA[writingLetter]
  const totalStrokes = strokeInfo?.strokes || 1

  // Reset animation when letter changes
  const [prevLetter, setPrevLetter] = useState(writingLetter)
  const needsReset = prevLetter !== writingLetter
  if (needsReset) {
    setPrevLetter(writingLetter)
    // These setState calls during render are intentional for prop synchronization
    // This is the recommended React pattern for "resetting state when prop changes"
    setIsPlaying(false)
    setCurrentStroke(0)
    setRevealProgress(0)
  }

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setRevealProgress(prev => {
        const next = prev + (0.02 * animationSpeed)
        if (next >= 1) {
          // Move to next stroke
          if (currentStroke < totalStrokes - 1) {
            setCurrentStroke(s => s + 1)
            return 0
          } else {
            setIsPlaying(false)
            return 1
          }
        }
        return next
      })
    }, 30)

    return () => clearInterval(interval)
  }, [isPlaying, currentStroke, totalStrokes, animationSpeed])

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    // If finished, restart
    if (revealProgress >= 1 && currentStroke >= totalStrokes - 1) {
      setCurrentStroke(0)
      setRevealProgress(0)
    }
    setIsPlaying(true)
  }, [isPlaying, revealProgress, currentStroke, totalStrokes])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStroke(0)
    setRevealProgress(0)
  }, [])

  const handlePrev = useCallback(() => {
    if (writingLetter > 0) {
      setWritingLetter(writingLetter - 1)
    }
  }, [writingLetter, setWritingLetter])

  const handleNext = useCallback(() => {
    if (writingLetter < ENHANCED_LETTERS.length - 1) {
      setWritingLetter(writingLetter + 1)
    }
  }, [writingLetter, setWritingLetter])

  // Overall animation progress (0-1 across all strokes)
  const overallProgress = (currentStroke + revealProgress) / totalStrokes

  return (
    <div className="space-y-4">
      {/* Letter Display Area */}
      <motion.div
        className="rounded-xl p-6 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,74,0.6), rgba(42,42,106,0.3))',
          border: '1px solid rgba(74,74,166,0.15)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={writingLetter}
      >
        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Writing baseline */}
        <div className="absolute left-4 right-4 opacity-20" style={{ top: '65%', height: '2px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />

        {/* Large Arabic Letter with reveal animation */}
        <div className="relative mb-4">
          {/* Shadow letter (full opacity, behind) */}
          <div
            className="text-[120px] leading-none font-arabic select-none"
            style={{ color: 'rgba(255,255,255,0.06)', direction: 'rtl' as const }}
          >
            {letter.letter}
          </div>

          {/* Animated letter (clip-path reveal) */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              clipPath: `inset(0 ${Math.max(0, 100 - overallProgress * 100)}% 0 0)`,
            }}
          >
            <span
              className="text-[120px] leading-none font-arabic select-none"
              style={{
                color: '#d4af37',
                direction: 'rtl' as const,
                textShadow: isPlaying ? '0 0 30px rgba(212,175,55,0.4)' : 'none',
              }}
            >
              {letter.letter}
            </span>
          </motion.div>

          {/* Stroke direction indicators */}
          <div className="absolute -top-2 -right-2 flex flex-col gap-1">
            {strokeInfo?.directions.map((dir, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                style={{
                  background: i === currentStroke ? 'rgba(212,175,55,0.2)' : 'rgba(74,74,166,0.1)',
                  border: `1px solid ${i === currentStroke ? 'rgba(212,175,55,0.4)' : 'rgba(74,74,166,0.15)'}`,
                }}
                animate={{
                  scale: i === currentStroke && isPlaying ? [1, 1.1, 1] : 1,
                  opacity: i <= currentStroke ? 1 : 0.4,
                }}
                transition={{ duration: 0.5, repeat: i === currentStroke && isPlaying ? Infinity : 0 }}
              >
                <span className="text-[10px] font-bold" style={{ color: i === currentStroke ? '#d4af37' : 'rgba(204,204,204,0.5)' }}>
                  {i + 1}
                </span>
                <span className="text-[8px]" style={{ color: i === currentStroke ? '#ffffff' : 'rgba(204,204,204,0.3)' }}>
                  {strokeInfo.arrows[i]}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Animated pen cursor */}
          {isPlaying && (
            <motion.div
              className="absolute"
              style={{
                top: '50%',
                right: `${overallProgress * 100}%`,
                transform: 'translate(50%, -50%)',
              }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <Pen className="h-5 w-5" style={{ color: '#d4af37' }} />
            </motion.div>
          )}
        </div>

        {/* Stroke order info */}
        <div className="text-center mt-2">
          <div className="text-lg font-bold font-arabic" style={{ color: '#ffffff', direction: 'rtl' as const }}>
            {letter.letter}
          </div>
          <div className="text-[11px] font-medium" style={{ color: '#d4af37' }}>{letter.name}</div>
          <div className="text-[9px] mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
            {letter.writingTip}
          </div>
        </div>

        {/* Current stroke indicator */}
        <div className="flex items-center gap-2 mt-3">
          {Array.from({ length: totalStrokes }).map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <motion.div
                className="h-2 w-2 rounded-full"
                style={{
                  background: i < currentStroke ? '#d4af37' : i === currentStroke ? '#d4af37' : 'rgba(74,74,166,0.3)',
                }}
                animate={i === currentStroke && isPlaying ? { scale: [1, 1.5, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              {i < totalStrokes - 1 && (
                <div className="h-px w-4" style={{ background: i < currentStroke ? 'rgba(212,175,55,0.5)' : 'rgba(74,74,166,0.15)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mt-2 overflow-hidden" style={{ background: 'rgba(74,74,166,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#d4af37' }}
            animate={{ width: `${overallProgress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Previous */}
        <button
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{
            background: writingLetter > 0 ? 'rgba(74,74,166,0.15)' : 'rgba(42,42,106,0.2)',
            border: '1px solid rgba(74,74,166,0.1)',
            color: writingLetter > 0 ? '#4a4aa6' : 'rgba(204,204,204,0.2)',
          }}
          disabled={writingLetter <= 0}
          onClick={handlePrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Play / Reset */}
        <div className="flex items-center gap-2">
          <button
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(42,42,106,0.3)',
              border: '1px solid rgba(74,74,166,0.1)',
              color: 'rgba(204,204,204,0.5)',
            }}
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <motion.button
            className="h-12 w-12 rounded-full flex items-center justify-center"
            style={{
              background: isPlaying ? 'rgba(212,175,55,0.2)' : 'linear-gradient(135deg, #d4af37, #b8941f)',
              boxShadow: isPlaying ? 'none' : '0 4px 15px rgba(212,175,55,0.3)',
              border: isPlaying ? '2px solid #d4af37' : 'none',
            }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
          >
            {isPlaying ? (
              <motion.div
                className="h-4 w-4 rounded-sm"
                style={{ background: '#d4af37' }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            ) : (
              <Play className="h-5 w-5 text-white ml-0.5" />
            )}
          </motion.button>

          {/* Speed Control */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(42,42,106,0.3)' }}>
            {[0.5, 1.0, 1.5, 2.0].map(speed => (
              <button
                key={speed}
                className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                style={{
                  background: Math.abs(animationSpeed - speed) < 0.01 ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: Math.abs(animationSpeed - speed) < 0.01 ? '#d4af37' : 'rgba(204,204,204,0.4)',
                  border: Math.abs(animationSpeed - speed) < 0.01 ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                }}
                onClick={() => setAnimationSpeed(speed)}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Next */}
        <button
          className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{
            background: writingLetter < ENHANCED_LETTERS.length - 1 ? 'rgba(74,74,166,0.15)' : 'rgba(42,42,106,0.2)',
            border: '1px solid rgba(74,74,166,0.1)',
            color: writingLetter < ENHANCED_LETTERS.length - 1 ? '#4a4aa6' : 'rgba(204,204,204,0.2)',
          }}
          disabled={writingLetter >= ENHANCED_LETTERS.length - 1}
          onClick={handleNext}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Letter Navigation Strip */}
      <div className="flex gap-1 overflow-x-auto pb-1 qp-scroll">
        {ENHANCED_LETTERS.map((l, i) => (
          <motion.button
            key={l.id}
            className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: i === writingLetter ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.3)',
              border: i === writingLetter ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(74,74,166,0.08)',
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setWritingLetter(i)}
          >
            <span
              className="text-base font-arabic"
              style={{ color: i === writingLetter ? '#d4af37' : 'rgba(255,255,255,0.5)' }}
            >
              {l.letter}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Stroke Details */}
      <AnimatePresence mode="wait">
        <motion.div
          key={writingLetter}
          className="rounded-xl p-4 space-y-2"
          style={{
            background: 'rgba(42,42,106,0.3)',
            border: '1px solid rgba(74,74,166,0.1)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Pen className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#d4af37' }}>
              Panduan Menulis — {letter.name} ({letter.nameEn})
            </span>
          </div>

          {strokeInfo?.directions.map((dir, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg"
              style={{
                background: i === currentStroke ? 'rgba(212,175,55,0.08)' : 'rgba(26,26,74,0.3)',
                border: `1px solid ${i === currentStroke ? 'rgba(212,175,55,0.2)' : 'rgba(74,74,166,0.05)'}`,
              }}
              animate={i === currentStroke && isPlaying ? { x: [0, 4, 0] } : {}}
              transition={{ duration: 0.5, repeat: i === currentStroke && isPlaying ? Infinity : 0 }}
            >
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{
                  background: i < currentStroke ? '#d4af37' : i === currentStroke ? 'rgba(212,175,55,0.2)' : 'rgba(74,74,166,0.15)',
                  color: i < currentStroke ? '#1a1a4a' : i === currentStroke ? '#d4af37' : 'rgba(204,204,204,0.4)',
                }}
              >
                {i < currentStroke ? '✓' : i + 1}
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-medium" style={{ color: i <= currentStroke ? '#ffffff' : 'rgba(204,204,204,0.4)' }}>
                  Langkah {i + 1}: {dir}
                </div>
              </div>
              <span className="text-lg" style={{ color: i <= currentStroke ? '#d4af37' : 'rgba(204,204,204,0.2)' }}>
                {strokeInfo.arrows[i]}
              </span>
            </motion.div>
          ))}

          {/* Writing tip */}
          <div className="mt-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(26,26,74,0.4)' }}>
            <div className="text-[9px] uppercase tracking-wide mb-1" style={{ color: 'rgba(204,204,204,0.3)' }}>Petua Menulis</div>
            <div className="text-[10px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.6)' }}>
              {letter.writingTip}
            </div>
          </div>

          {/* Connected Forms */}
          <div className="mt-2 grid grid-cols-4 gap-2">
            {Object.entries(letter.forms).map(([form, char]) => (
              <div key={form} className="text-center rounded-lg p-2" style={{ background: 'rgba(26,26,74,0.4)' }}>
                <div className="text-[8px] uppercase tracking-wide mb-1" style={{ color: 'rgba(204,204,204,0.3)' }}>{form}</div>
                <div className="text-xl font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>{char}</div>
              </div>
            ))}
          </div>

          {/* Harakat examples */}
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {Object.entries(letter.harakat).map(([h, char]) => (
              <div key={h} className="text-center rounded-lg p-1.5" style={{ background: 'rgba(26,26,74,0.4)' }}>
                <div className="text-[7px] capitalize" style={{ color: 'rgba(204,204,204,0.3)' }}>{h}</div>
                <div className="text-lg font-arabic" style={{ color: '#ffffff', direction: 'rtl' as const }}>{char}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
