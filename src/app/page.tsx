'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#051324',
            zIndex: 10,
            transition: 'opacity 0.5s ease',
            pointerEvents: isLoading ? 'auto' : 'none',
            opacity: isLoading ? 1 : 0,
          }}
        >
          <div
            style={{
              width: '5rem',
              height: '5rem',
              background: 'rgba(27, 107, 90, 0.1)',
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(27, 107, 90, 0.2)',
            }}
          >
            <span style={{ fontSize: '1.5rem', color: '#1B6B5A', fontWeight: 'bold' }}>QP</span>
          </div>
          <h2
            style={{
              marginTop: '1.5rem',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1B6B5A',
              letterSpacing: '0.1em',
            }}
          >
            QURAN<span style={{ color: '#C4972A' }}>PULSE</span>
          </h2>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
            Memuatkan...
          </p>
          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '1rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1B6B5A', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C4972A', animation: 'pulse 1.5s ease-in-out 0.2s infinite' }} />
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1B6B5A', animation: 'pulse 1.5s ease-in-out 0.4s infinite' }} />
          </div>
        </div>
      )}
      <iframe
        src="/quranpulse.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        title="QuranPulse - App Mengaji AI Pertama Malaysia"
        onLoad={() => {
          setTimeout(() => setIsLoading(false), 500)
        }}
      />
    </div>
  )
}
