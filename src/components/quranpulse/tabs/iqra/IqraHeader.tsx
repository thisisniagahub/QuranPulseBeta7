'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Target, GraduationCap, Flame, Zap, Volume2, Play, Pause } from 'lucide-react'
import type { IqraSubTab } from './types'

interface IqraHeaderProps {
  subTab: IqraSubTab
  setSubTab: (tab: IqraSubTab) => void
  learningMode: 'kids' | 'adult'
  setLearningMode: (mode: 'kids' | 'adult') => void
  streak: number
  xp: number
  playingAudio: string | null
  audioSpeed: number
  setAudioSpeed: (speed: number) => void
}

const SUB_TABS: { key: IqraSubTab; label: string; icon: React.ReactNode }[] = [
  { key: 'belajar', label: 'Belajar', icon: <BookOpen className="h-4 w-4" /> },
  { key: 'latihan', label: 'Latihan', icon: <Brain className="h-4 w-4" /> },
  { key: 'tajwid', label: 'Tajwid', icon: <Target className="h-4 w-4" /> },
  { key: 'hafazan', label: 'Hafazan', icon: <GraduationCap className="h-4 w-4" /> },
]

export function IqraHeader({
  subTab, setSubTab,
  learningMode, setLearningMode,
  streak, xp,
  playingAudio,
  audioSpeed, setAudioSpeed,
}: IqraHeaderProps) {
  return (
    <div className="px-4 pt-2 pb-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>Iqra Digital</h2>
            {playingAudio && (
              <motion.span
                className="text-sm"
                style={{ color: '#d4af37' }}
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
                transition={{ type: 'tween', duration: 1.2, repeat: Infinity }}
              >&curren;</motion.span>
            )}
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: 'rgba(212,175,55,0.15)', color: '#d4af37', border: '1px solid rgba(212,175,55,0.25)' }}>JAKIM</span>
          </div>
          <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Belajar membaca Al-Quran</p>
          {/* Learning Mode Toggle */}
          <div className="flex gap-1 mt-1">
            <button
              className="px-2.5 py-1.5 rounded-full text-[9px] font-medium transition-all"
              style={{
                background: learningMode === 'kids' ? 'rgba(212,175,55,0.15)' : 'transparent',
                color: learningMode === 'kids' ? '#d4af37' : 'rgba(204,204,204,0.4)',
                border: learningMode === 'kids' ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
              }}
              onClick={() => setLearningMode('kids')}
            >{'\uD83E\uDDD2'} Kanak-kanak</button>
            <button
              className="px-2.5 py-1.5 rounded-full text-[9px] font-medium transition-all"
              style={{
                background: learningMode === 'adult' ? 'rgba(212,175,55,0.15)' : 'transparent',
                color: learningMode === 'adult' ? '#d4af37' : 'rgba(204,204,204,0.4)',
                border: learningMode === 'adult' ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
              }}
              onClick={() => setLearningMode('adult')}
            >{'\uD83D\uDC68'} Dewasa</button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(212,175,55,0.12)' }}>
            <Flame className="h-3 w-3" style={{ color: '#d4af37' }} />
            <span className="text-[10px] font-bold" style={{ color: '#d4af37' }}>{streak}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(74,74,166,0.12)' }}>
            <Zap className="h-3 w-3" style={{ color: '#4a4aa6' }} />
            <span className="text-[10px] font-bold" style={{ color: '#4a4aa6' }}>{xp}</span>
          </div>
        </div>
        {/* Audio Speed Control */}
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Kelajuan:</span>
          {[
            { label: '\uD83D\uDC22', speed: 0.6, tip: 'Perlahan (kanak-kanak)' },
            { label: '\uD83D\uDD04', speed: 1.0, tip: 'Biasa' },
            { label: '\uD83D\uDE80', speed: 1.3, tip: 'Pantas' },
          ].map(s => (
            <button
              key={s.speed}
              className="px-1.5 py-1.5 rounded text-[10px]"
              style={{
                background: Math.abs(audioSpeed - s.speed) < 0.01 ? 'rgba(212,175,55,0.15)' : 'transparent',
                border: Math.abs(audioSpeed - s.speed) < 0.01 ? '1px solid rgba(212,175,55,0.3)' : '1px solid transparent',
                color: Math.abs(audioSpeed - s.speed) < 0.01 ? '#d4af37' : 'rgba(204,204,204,0.4)',
              }}
              onClick={() => setAudioSpeed(s.speed)}
              title={s.tip}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(42,42,106,0.4)' }}>
        {SUB_TABS.map(tab => (
          <button
            key={tab.key}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-medium transition-all"
            style={{
              background: subTab === tab.key ? 'rgba(74,74,166,0.25)' : 'transparent',
              color: subTab === tab.key ? '#ffffff' : 'rgba(204,204,204,0.5)',
              border: subTab === tab.key ? '1px solid rgba(74,74,166,0.3)' : '1px solid transparent',
            }}
            onClick={() => setSubTab(tab.key)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
