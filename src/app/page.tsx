'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '@/components/quranpulse/AppShell'
import { SplashScreen } from '@/components/quranpulse/SplashScreen'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="qp-shell qp-geometric-bg" style={{ background: '#1a1a4a', minHeight: '100dvh' }}>
      <SplashScreen isVisible={showSplash} />
      <AppShell />
    </div>
  )
}
