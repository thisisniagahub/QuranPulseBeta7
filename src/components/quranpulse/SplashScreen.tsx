'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  isVisible: boolean
}

export function SplashScreen({ isVisible }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: '#1a1a4a' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
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
                background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
                top: '25%',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5,
              }}
            />
          </div>

          {/* Logo icon */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            style={{
              width: '80px',
              height: '80px',
              background: 'rgba(74, 74, 166, 0.1)',
              borderRadius: '1.25rem',
              border: '1px solid rgba(74, 74, 166, 0.3)',
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Islamic geometric star pattern */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 4L24 14H34L26 20L29 30L20 24L11 30L14 20L6 14H16L20 4Z"
                fill="#4a4aa6"
                opacity="0.9"
              />
              <circle cx="20" cy="20" r="6" fill="#d4af37" opacity="0.8" />
            </svg>
          </motion.div>

          {/* Logo text */}
          <motion.h1
            className="relative z-10 mt-6 text-3xl font-bold tracking-widest"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
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

          {/* Pulse dots */}
          <div className="relative z-10 mt-4 flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: i === 1 ? '#d4af37' : '#4a4aa6',
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
