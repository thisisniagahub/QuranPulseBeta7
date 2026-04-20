'use client'
import React, { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Pen, Eraser, Check, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { ENHANCED_LETTERS } from './types'
import type { EnhancedLetter } from './types'

interface IqraWritingPracticeProps {
  writingLetter: number
  setWritingLetter: React.Dispatch<React.SetStateAction<number>>
  writingFeedback: string | null
  setWritingFeedback: React.Dispatch<React.SetStateAction<string | null>>
  addXp: (amount: number) => void
  filteredLetters: EnhancedLetter[]
}

export function IqraWritingPractice({
  writingLetter,
  setWritingLetter,
  writingFeedback,
  setWritingFeedback,
  addXp,
  filteredLetters,
}: IqraWritingPracticeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokeCount, setStrokeCount] = useState(0)
  const [showGuide, setShowGuide] = useState(true)

  const currentLetter = filteredLetters[writingLetter] || ENHANCED_LETTERS[writingLetter] || ENHANCED_LETTERS[0]

  // Reset session state when changing letters
  const resetSession = useCallback(() => {
    setStrokeCount(0)
    setWritingFeedback(null)
  }, [setWritingFeedback])

  // Set canvas resolution higher than display for crisp drawing
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(2, 2)
  }, [writingLetter])

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    setIsDrawing(true)
    ctx.beginPath()
    const rect = canvas.getBoundingClientRect()
    let x: number, y: number
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }
    ctx.moveTo(x, y)
  }, [])

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if ('touches' in e) e.preventDefault()
    const rect = canvas.getBoundingClientRect()
    let x: number, y: number
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#d4af37'
    ctx.lineTo(x, y)
    ctx.stroke()
  }, [isDrawing])

  const stopDraw = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false)
      setStrokeCount(prev => prev + 1)
    }
  }, [isDrawing])

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setStrokeCount(0)
    setWritingFeedback(null)
  }, [setWritingFeedback])

  const checkWriting = useCallback(async () => {
    try {
      const res = await fetch('/api/ustaz-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Nilai tulisan huruf ${currentLetter.name} (${currentLetter.letter}). Beri nasihat singkat dalam Bahasa Melayu tentang cara menulis huruf ini dengan betul.`,
          persona: 'ustazah',
          history: [],
        }),
      })
      const data = await res.json()
      setWritingFeedback(data.response || 'Cuba lagi! Latihan menjadikan sempurna.')
    } catch {
      setWritingFeedback('Cuba lagi! Teruskan berlatih menulis. Semoga Allah memberkati usaha anda.')
    }
    addXp(10)
  }, [currentLetter, addXp, setWritingFeedback])

  const goNext = useCallback(() => {
    const maxIdx = filteredLetters.length > 0 ? filteredLetters.length - 1 : ENHANCED_LETTERS.length - 1
    setWritingLetter(prev => Math.min(prev + 1, maxIdx))
    resetSession()
  }, [filteredLetters.length, setWritingLetter, resetSession])

  const goPrev = useCallback(() => {
    setWritingLetter(prev => Math.max(prev - 1, 0))
    resetSession()
  }, [setWritingLetter, resetSession])

  const lettersToShow = filteredLetters.length > 0 ? filteredLetters : ENHANCED_LETTERS

  return (
    <div className="flex flex-col gap-3">
      {/* Target Letter Display */}
      <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Pen className="h-4 w-4" style={{ color: '#d4af37' }} />
          <span className="text-xs font-semibold" style={{ color: '#ffffff' }}>Latihan Menulis</span>
        </div>
        <div className="relative">
          <motion.div
            key={currentLetter.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="text-6xl font-arabic mb-1"
            style={{ color: '#d4af37', direction: 'rtl' as const }}
          >
            {currentLetter.letter}
          </motion.div>
          <div className="text-sm font-medium" style={{ color: '#ffffff' }}>{currentLetter.name}</div>
          <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{currentLetter.nameEn}</div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.95)', border: '2px solid rgba(212,175,55,0.3)' }}>
        {/* Ghost Guide */}
        {showGuide && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{ opacity: 0.1 }}
          >
            <span className="text-[180px] font-arabic" style={{ color: '#1a1a4a', direction: 'rtl' as const }}>
              {currentLetter.letter}
            </span>
          </div>
        )}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full touch-none"
          style={{ height: '250px', cursor: 'crosshair' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-2">
        <button
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-medium transition-all"
          style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.12)', color: '#ffffff' }}
          onClick={goPrev}
          disabled={writingLetter <= 0}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Sebelum</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Guide Toggle */}
          <button
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-[9px] transition-all"
            style={{
              background: showGuide ? 'rgba(212,175,55,0.15)' : 'rgba(42,42,106,0.5)',
              border: `1px solid ${showGuide ? 'rgba(212,175,55,0.25)' : 'rgba(74,74,166,0.08)'}`,
              color: showGuide ? '#d4af37' : 'rgba(204,204,204,0.5)',
            }}
            onClick={() => setShowGuide(prev => !prev)}
          >
            <Star className="h-3 w-3" />
            Panduan
          </button>

          {/* Clear */}
          <button
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-[9px] transition-all"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444' }}
            onClick={clearCanvas}
          >
            <Eraser className="h-3 w-3" />
            Padam
          </button>

          {/* Check */}
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-[9px] font-medium transition-all"
            style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}
            onClick={checkWriting}
          >
            <Check className="h-3 w-3" />
            Semak +10XP
          </button>
        </div>

        <button
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-medium transition-all"
          style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.2)', color: '#4a4aa6' }}
          onClick={goNext}
          disabled={writingLetter >= lettersToShow.length - 1}
        >
          <span>Seterusnya</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Writing Tip */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs">💡</span>
          <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>Petua Menulis</span>
        </div>
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.7)' }}>
          {currentLetter.writingTip}
        </p>
      </div>

      {/* Harakat Forms */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="text-[10px] font-semibold mb-2" style={{ color: '#ffffff' }}>Bentuk Harakat</div>
        <div className="grid grid-cols-5 gap-1.5">
          {Object.entries(currentLetter.harakat).map(([key, val]) => (
            <div
              key={key}
              className="rounded-lg p-2 text-center"
              style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.08)' }}
            >
              <div className="text-lg font-arabic" style={{ color: '#d4af37', direction: 'rtl' as const }}>{val}</div>
              <div className="text-[8px] capitalize mt-0.5" style={{ color: 'rgba(204,204,204,0.5)' }}>{key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Display */}
      {writingFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-3"
          style={{ background: 'rgba(74,74,166,0.12)', border: '1px solid rgba(74,74,166,0.2)' }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs">🤲</span>
            <span className="text-[10px] font-semibold" style={{ color: '#4a4aa6' }}>Nasihat Cikgu</span>
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.8)' }}>
            {writingFeedback}
          </p>
        </motion.div>
      )}

      {/* Stroke counter */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Strok: {strokeCount}</span>
        <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>|</span>
        <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
          Huruf {writingLetter + 1}/{lettersToShow.length}
        </span>
      </div>

      {/* Letter Selector */}
      <div className="rounded-xl p-2" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="text-[9px] font-semibold mb-1.5 text-center" style={{ color: 'rgba(204,204,204,0.4)' }}>Pilih Huruf</div>
        <div className="flex gap-1 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {lettersToShow.map((letter, idx) => (
            <button
              key={letter.id}
              className="shrink-0 rounded-lg px-2 py-1.5 text-center transition-all"
              style={{
                background: idx === writingLetter ? 'rgba(212,175,55,0.2)' : 'rgba(42,42,106,0.5)',
                border: `1px solid ${idx === writingLetter ? 'rgba(212,175,55,0.3)' : 'rgba(74,74,166,0.08)'}`,
                color: idx === writingLetter ? '#d4af37' : '#ffffff',
                boxShadow: idx === writingLetter ? '0 0 8px rgba(212,175,55,0.2)' : 'none',
              }}
              onClick={() => { setWritingLetter(idx); resetSession() }}
            >
              <span className="text-base font-arabic" style={{ direction: 'rtl' as const }}>{letter.letter}</span>
              <div className="text-[7px] mt-0.5" style={{ color: idx === writingLetter ? '#d4af37' : 'rgba(204,204,204,0.4)' }}>{letter.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
