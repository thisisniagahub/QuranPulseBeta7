'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '@/components/quranpulse/AppShell'
import { SplashScreen } from '@/components/quranpulse/SplashScreen'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    // Splash auto-dismisses after animation completes
    const timer = setTimeout(() => {
      setShowSplash(false)
      setAppReady(true)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="qp-shell qp-geometric-bg" style={{ background: '#1a1a4a', minHeight: '100dvh' }}>
      <SplashScreen isVisible={showSplash} />
      {appReady && <AppShell />}
    </div>
  )
}
