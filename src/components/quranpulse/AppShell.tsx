'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Home, BookOpen, Bot, Moon, GraduationCap } from 'lucide-react'
import { useQuranPulseStore, type ActiveTab } from '@/stores/quranpulse-store'
import { HomeTab } from '@/components/quranpulse/tabs/HomeTab'
import { QuranTab } from '@/components/quranpulse/tabs/QuranTab'
import { UstazAITab } from '@/components/quranpulse/tabs/UstazAITab'
import { IbadahTab } from '@/components/quranpulse/tabs/IbadahTab'
import { IqraTab } from '@/components/quranpulse/tabs/IqraTab'

interface TabConfig {
  key: ActiveTab
  label: string
  icon: React.ReactNode
  isCenter?: boolean
}

const TABS: TabConfig[] = [
  { key: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
  { key: 'quran', label: 'Quran', icon: <BookOpen className="h-5 w-5" /> },
  { key: 'ustaz-ai', label: 'Ustaz AI', icon: <Bot className="h-6 w-6" />, isCenter: true },
  { key: 'ibadah', label: 'Ibadah', icon: <Moon className="h-5 w-5" /> },
  { key: 'iqra', label: 'Iqra', icon: <GraduationCap className="h-5 w-5" /> },
]

export function AppShell() {
  const { activeTab, setActiveTab } = useQuranPulseStore()

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
      {/* Status bar spacer */}
      <div className="h-2" />

      {/* Main content area */}
      <main className="flex flex-1 flex-col overflow-hidden pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="flex flex-1 flex-col"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: 'rgba(26, 26, 74, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(74, 74, 166, 0.12)',
        }}
      >
        <div className="mx-auto flex max-w-[480px] items-center justify-around px-2 py-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key

            if (tab.isCenter) {
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
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
                              '0 0 20px rgba(74,74,166,0.4)',
                              '0 0 30px rgba(74,74,166,0.6)',
                              '0 0 20px rgba(74,74,166,0.4)',
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
                onClick={() => setActiveTab(tab.key)}
                className="flex flex-col items-center gap-0.5 py-2 transition-colors"
              >
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: isActive ? 'rgba(74, 74, 166, 0.15)' : 'transparent',
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  {tab.icon && (
                    <div style={{ color: isActive ? '#4a4aa6' : 'rgba(204,204,204,0.4)' }}>
                      {tab.icon}
                    </div>
                  )}
                </motion.div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: isActive ? '#4a4aa6' : 'rgba(204,204,204,0.4)' }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    className="h-0.5 w-4 rounded-full"
                    style={{ background: '#4a4aa6' }}
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
