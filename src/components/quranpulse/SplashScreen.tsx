'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface SplashScreenProps {
  isVisible: boolean
}

// ─── Precomputed geometry (rounded to avoid floating-point hydration mismatch)
const R = (n: number) => n.toFixed(4)
const STAR_LINES = [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => ({
  x2: R(100 + 80 * Math.cos((angle * Math.PI) / 180)),
  y2: R(100 + 80 * Math.sin((angle * Math.PI) / 180)),
}))
const INNER_OCT = [0, 45, 90, 135, 180, 225, 270, 315]
  .map((a) => `${R(100 + 40 * Math.cos((a * Math.PI) / 180))},${R(100 + 40 * Math.sin((a * Math.PI) / 180))}`)
  .join(' ')
const OUTER_OCT = [0, 45, 90, 135, 180, 225, 270, 315]
  .map((a) => `${R(100 + 70 * Math.cos((a * Math.PI) / 180))},${R(100 + 70 * Math.sin((a * Math.PI) / 180))}`)
  .join(' ')
const CROSS_LINES = [0, 90, 180, 270].map((angle) => ({
  x1: R(100 + 40 * Math.cos((angle * Math.PI) / 180)),
  y1: R(100 + 40 * Math.sin((angle * Math.PI) / 180)),
  x2: R(100 + 70 * Math.cos((angle * Math.PI) / 180)),
  y2: R(100 + 70 * Math.sin((angle * Math.PI) / 180)),
}))
const CORNER_LINES = [0, 60, 120, 180, 240, 300].map((angle) => ({
  x2: R(50 + 45 * Math.cos((angle * Math.PI) / 180)),
  y2: R(50 + 45 * Math.sin((angle * Math.PI) / 180)),
}))

// ─── Islamic Geometric Pattern ───────────────────────────────
function GeometricPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <motion.svg
        className="absolute"
        style={{
          width: '300px',
          height: '300px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        viewBox="0 0 200 200"
        initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 90, scale: 1, opacity: 1 }}
        transition={{ duration: 4, ease: 'easeInOut' }}
      >
        {/* 8-pointed star pattern */}
        {STAR_LINES.map((l, i) => (
          <motion.line
            key={i}
            x1="100"
            y1="100"
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(212,175,55,0.4)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
          />
        ))}
        {/* Inner octagon */}
        <motion.polygon
          points={INNER_OCT}
          fill="none"
          stroke="rgba(212,175,55,0.3)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
        />
        {/* Outer octagon */}
        <motion.polygon
          points={OUTER_OCT}
          fill="none"
          stroke="rgba(212,175,55,0.2)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.3 }}
        />
        {/* Connecting cross lines */}
        {CROSS_LINES.map((l, i) => (
          <motion.line
            key={`cross-${i}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(212,175,55,0.15)"
            strokeWidth="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 + i * 0.1 }}
          />
        ))}
        {/* Center diamond */}
        <motion.polygon
          points="100,90 110,100 100,110 90,100"
          fill="none"
          stroke="rgba(212,175,55,0.5)"
          strokeWidth="0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: 'spring', stiffness: 200 }}
        />
      </motion.svg>

      {/* Smaller rotating pattern in corner */}
      <motion.svg
        className="absolute"
        style={{
          width: '120px',
          height: '120px',
          top: '10%',
          right: '-20px',
        }}
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {CORNER_LINES.map((l, i) => (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={l.x2}
            y2={l.y2}
            stroke="rgba(74,74,166,0.15)"
            strokeWidth="0.3"
          />
        ))}
      </motion.svg>
    </div>
  )
}

export function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Splash background image */}
          <div className="absolute inset-0">
            <Image
              src="/icons/splash-bg.png"
              alt="Splash background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Dark overlay for better text readability */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(26, 26, 74, 0.4)' }}
          />

          {/* Islamic geometric pattern animation */}
          <GeometricPattern />

          {/* Decorative background circles */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(74,74,166,0.15) 0%, transparent 70%)',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute rounded-full"
              style={{
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
                top: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </div>

          {/* App Icon from generated image — with golden glow pulse */}
          <motion.div
            className="relative z-10"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Golden glow pulse ring around icon */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ margin: '-8px' }}
              animate={{
                boxShadow: [
                  '0 0 20px rgba(212,175,55,0.15), 0 0 40px rgba(212,175,55,0.08)',
                  '0 0 35px rgba(212,175,55,0.3), 0 0 60px rgba(212,175,55,0.15)',
                  '0 0 20px rgba(212,175,55,0.15), 0 0 40px rgba(212,175,55,0.08)',
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <Image
              src="/icons/icon-512.png"
              alt="QuranPulse"
              width={100}
              height={100}
              className="rounded-2xl"
              style={{
                border: '1px solid rgba(212, 175, 55, 0.25)',
                boxShadow: '0 0 30px rgba(74, 74, 166, 0.2), 0 0 60px rgba(212, 175, 55, 0.12)',
              }}
              priority
            />
          </motion.div>

          {/* Logo text */}
          <motion.h1
            className="relative z-10 mt-6 text-3xl font-bold tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 180, damping: 18 }}
          >
            <span style={{ color: '#4a4aa6' }}>QURAN</span>
            <span style={{ color: '#d4af37' }}>PULSE</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="relative z-10 mt-2 text-xs tracking-wider"
            style={{ color: 'rgba(204,204,204,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            App Mengaji AI Pertama Malaysia
          </motion.p>

          {/* Loading indicator */}
          <motion.div
            className="relative z-10 mt-10 flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <span
              className="text-sm"
              style={{ color: 'rgba(204,204,204,0.6)' }}
            >
              Memuatkan
            </span>
            <motion.span
              style={{ color: 'rgba(204,204,204,0.6)' }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            >
              .
            </motion.span>
            <motion.span
              style={{ color: 'rgba(204,204,204,0.6)' }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            >
              .
            </motion.span>
            <motion.span
              style={{ color: 'rgba(204,204,204,0.6)' }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            >
              .
            </motion.span>
          </motion.div>

          {/* Pulse dots — enhanced with gold center */}
          <div className="relative z-10 mt-4 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: i === 1 ? '#d4af37' : '#4a4aa6',
                  boxShadow: i === 1 ? '0 0 6px rgba(212,175,55,0.4)' : 'none',
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
