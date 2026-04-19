'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, BookOpen, Bot, Moon, GraduationCap, MessageCircle, Sparkles } from 'lucide-react'
import { useQuranPulseStore, type ActiveTab } from '@/stores/quranpulse-store'
import { HomeTab } from '@/components/quranpulse/tabs/HomeTab'
import { QuranTab } from '@/components/quranpulse/tabs/QuranTab'
import { UstazAITab } from '@/components/quranpulse/tabs/UstazAITab'
import { IbadahTab } from '@/components/quranpulse/tabs/IbadahTab'
import { IqraTab } from '@/components/quranpulse/tabs/IqraTab'
import { useSupabaseSync } from '@/lib/supabase/useSupabaseSync'
import { getDailyVerse } from '@/lib/quran-data'

interface TabConfig {
  key: ActiveTab
  label: string
  icon: React.ReactNode
  isCenter?: boolean
  badge?: number
}

const TABS: TabConfig[] = [
  { key: 'home', label: 'Home', icon: <Home className="h-5 w-5" />, badge: 1 },
  { key: 'quran', label: 'Quran', icon: <BookOpen className="h-5 w-5" /> },
  { key: 'ustaz-ai', label: 'Ustaz AI', icon: <Bot className="h-6 w-6" />, isCenter: true },
  { key: 'ibadah', label: 'Ibadah', icon: <Moon className="h-5 w-5" />, badge: 2 },
  { key: 'iqra', label: 'Iqra', icon: <GraduationCap className="h-5 w-5" /> },
]

// ─── Floating Particles Component ────────────────────────────
function FloatingParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 3,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
    }))
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: 'rgba(74,74,166,0.15)',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Bismillah Golden Particles ──────────────────────────────
function BismillahGoldenParticles() {
  const [goldParticles] = useState(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: 30 + Math.random() * 40, // cluster around center
      y: 30 + Math.random() * 40,
      size: 1 + Math.random() * 2,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 1.5,
      xDrift: (Math.random() - 0.5) * 60,
      yDrift: -20 - Math.random() * 40,
    }))
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {goldParticles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: '#d4af37',
            boxShadow: '0 0 4px rgba(212,175,55,0.5)',
          }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.8, 0.6, 0],
            x: [0, p.xDrift * 0.5, p.xDrift],
            y: [0, p.yDrift * 0.4, p.yDrift],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

export function AppShell() {
  const { activeTab, setActiveTab } = useQuranPulseStore()
  const [showBismillah, setShowBismillah] = useState(true)
  const [showFAB, setShowFAB] = useState(false)

  // Sync state to Supabase in the background
  useSupabaseSync()

  // Bismillah animation on app launch
  useEffect(() => {
    const timer = setTimeout(() => setShowBismillah(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  // Show FAB after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowFAB(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Daily verse preview for FAB — computed via useMemo to avoid setState in effect
  const dailyVersePreview = useMemo(() => {
    const verse = getDailyVerse(new Date().getDate())
    return verse?.translationMs ?? null
  }, [])

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />
      case 'quran': return <QuranTab />
      case 'ustaz-ai': return <UstazAITab />
      case 'ibadah': return <IbadahTab />
      case 'iqra': return <IqraTab />
      default: return <HomeTab />
    }
  }

  return (
    <div
      className="relative mx-auto flex min-h-screen max-w-[480px] flex-col"
      style={{ background: '#1a1a4a' }}
    >
      {/* ═══ Bismillah Launch Animation with Golden Particles ═══ */}
      <AnimatePresence>
        {showBismillah && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            style={{ background: '#1a1a4a' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Golden particle effect */}
            <BismillahGoldenParticles />
            {/* Subtle radial glow behind text */}
            <motion.div
              className="absolute"
              style={{
                width: 280,
                height: 280,
                background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="text-center relative z-10"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
            >
              <motion.div
                className="font-arabic text-3xl mb-3"
                style={{ color: '#d4af37', direction: 'rtl', textShadow: '0 0 20px rgba(212,175,55,0.3)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </motion.div>
              <motion.div
                className="text-xs"
                style={{ color: 'rgba(212,175,55,0.5)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                QuranPulse
              </motion.div>
              <motion.div
                className="flex justify-center gap-1 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: '#d4af37' }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle particle background */}
      <FloatingParticles />

      {/* Status bar spacer */}
      <div className="h-2" style={{ position: 'relative', zIndex: 1 }} />

      {/* Main content area */}
      <main className="flex flex-1 flex-col overflow-hidden pb-20" style={{ position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="flex flex-1 flex-col"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.8 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ═══ Floating Action Button (Daily Verse Quick Access) ═══ */}
      <AnimatePresence>
        {showFAB && activeTab !== 'quran' && (
          <motion.button
            className="fixed z-30 flex items-center gap-1.5 px-4 py-2.5 rounded-full shadow-lg"
            style={{
              bottom: '90px',
              right: 'max(calc((100vw - 480px) / 2 + 16px), 16px)',
              background: 'linear-gradient(135deg, #4a4aa6, #6a6ab6)',
              boxShadow: '0 4px 20px rgba(74,74,166,0.4)',
              maxWidth: '200px',
            }}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setActiveTab('quran')
              if (navigator.vibrate) navigator.vibrate(5)
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-medium truncate" style={{ color: '#ffffff' }}>
              {dailyVersePreview ? dailyVersePreview.slice(0, 25) + '...' : 'Ayat Hari Ini'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Navigation — Enhanced Glassmorphism 2026 */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: 'rgba(26, 26, 74, 0.82)',
          backdropFilter: 'blur(40px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
          borderTop: '1px solid rgba(74, 74, 166, 0.15)',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
        }}
      >
        <div className="mx-auto flex max-w-[480px] items-center justify-around px-2 py-1" style={{ paddingBottom: 'max(4px, env(safe-area-inset-bottom))' }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key

            if (tab.isCenter) {
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key)
                    if (navigator.vibrate) navigator.vibrate(3)
                  }}
                  className="relative -mt-6 flex flex-col items-center"
                >
                  <motion.div
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, #4a4aa6, #6a6ab6)'
                        : 'rgba(74, 74, 166, 0.2)',
                      boxShadow: isActive
                        ? '0 0 20px rgba(74, 74, 166, 0.4), 0 0 40px rgba(74, 74, 166, 0.2)'
                        : 'none',
                    }}
                    whileTap={{ scale: 0.9 }}
                    animate={
                      isActive
                        ? {
                            boxShadow: [
                              '0 0 20px rgba(74,74,166,0.4), 0 0 40px rgba(74,74,166,0.2)',
                              '0 0 30px rgba(74,74,166,0.6), 0 0 50px rgba(74,74,166,0.3)',
                              '0 0 20px rgba(74,74,166,0.4), 0 0 40px rgba(74,74,166,0.2)',
                            ],
                          }
                        : {}
                    }
                    transition={
                      isActive
                        ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.15 }
                    }
                  >
                    <Bot
                      className="h-6 w-6"
                      style={{ color: isActive ? '#FFFFFF' : '#4a4aa6' }}
                    />
                    {/* Pulse glow ring */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: '2px solid rgba(74,74,166,0.3)' }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    )}
                  </motion.div>
                  <span
                    className="mt-0.5 text-[10px] font-medium"
                    style={{ color: isActive ? '#4a4aa6' : 'rgba(204,204,204,0.4)' }}
                  >
                    Ustaz AI
                  </span>
                </button>
              )
            }

            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  if (navigator.vibrate) navigator.vibrate(3)
                }}
                className="flex flex-col items-center gap-0.5 py-2 transition-colors relative"
              >
                <motion.div
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: isActive ? 'rgba(74, 74, 166, 0.15)' : 'transparent',
                    boxShadow: isActive ? '0 0 12px rgba(74, 74, 166, 0.25)' : 'none',
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {tab.icon && (
                    <div style={{ color: isActive ? '#4a4aa6' : 'rgba(204,204,204,0.4)' }}>
                      {tab.icon}
                    </div>
                  )}
                  {/* Active tab glow ring — 2026 enhancement */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{ border: '1.5px solid rgba(74,74,166,0.3)' }}
                      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  {/* Notification badge — gold with pulse */}
                  {tab.badge && tab.badge > 0 && !isActive && (
                    <motion.div
                      className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center"
                      style={{ background: '#d4af37', boxShadow: '0 0 8px rgba(212,175,55,0.5)' }}
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ scale: { type: 'spring', stiffness: 400 }, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <span className="text-[8px] font-bold" style={{ color: '#1a1a4a' }}>{tab.badge}</span>
                    </motion.div>
                  )}
                </motion.div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? '#d4af37' : 'rgba(204,204,204,0.4)' }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    className="h-0.5 w-4 rounded-full"
                    style={{ background: '#d4af37' }}
                    layoutId="activeTabIndicator"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
        {/* Safe area bottom */}
        <div className="h-safe-area-inset-bottom" style={{ minHeight: 'env(safe-area-inset-bottom, 0px)' }} />
      </nav>
    </div>
  )
}
