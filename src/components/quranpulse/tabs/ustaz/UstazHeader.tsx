'use client'

import { motion } from 'framer-motion'
import {
  Bot, Trash2, ChevronDown, ChevronUp,
  MessageSquare, Cpu,
} from 'lucide-react'
import { PERSONAS, type ChatMode } from './types'

interface UstazHeaderProps {
  activePersona: string
  chatMode: ChatMode
  isOnline: boolean
  toolsPanelOpen: boolean
  hasMessages: boolean
  onClearChat: () => void
  onToggleToolsPanel: () => void
  onSetChatMode: (mode: ChatMode) => void
  onSetPersona: (id: string) => void
}

export function UstazHeader({
  activePersona,
  chatMode,
  isOnline,
  toolsPanelOpen,
  hasMessages,
  onClearChat,
  onToggleToolsPanel,
  onSetChatMode,
  onSetPersona,
}: UstazHeaderProps) {
  const activePersonaData = PERSONAS.find(p => p.id === activePersona) || PERSONAS[0]

  return (
    <div className="px-4 pt-2 pb-2" style={{ borderBottom: '1px solid rgba(74,74,166,0.1)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <motion.div
            className="h-11 w-11 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(74,74,166,0.3), rgba(212,175,55,0.15))',
              border: '1px solid rgba(74,74,166,0.3)',
            }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(74,74,166,0.2)',
                '0 0 25px rgba(74,74,166,0.4)',
                '0 0 10px rgba(74,74,166,0.2)',
              ],
            }}
            transition={{ type: 'tween', duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Bot className="h-5 w-5" style={{ color: '#4a4aa6' }} />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold" style={{ color: '#ffffff' }}>
                Ustaz AI
              </h3>
              {/* OpenClaw Status Indicator */}
              <div className="flex items-center gap-1">
                <motion.div
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: isOnline ? '#22c55e' : '#ef4444',
                  }}
                  animate={isOnline ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ type: 'tween', duration: 2, repeat: Infinity }}
                />
                <span className="text-[10px] font-medium" style={{ color: isOnline ? '#22c55e' : '#ef4444' }}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
            </div>
            <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
              {activePersonaData.emoji} {activePersonaData.label} · {activePersonaData.desc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {hasMessages && (
            <motion.button
              className="p-2 rounded-lg"
              style={{ background: 'rgba(212,175,55,0.1)' }}
              onClick={onClearChat}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="h-4 w-4" style={{ color: '#d4af37' }} />
            </motion.button>
          )}
          <motion.button
            className="p-2 rounded-lg"
            style={{ background: toolsPanelOpen ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)' }}
            onClick={onToggleToolsPanel}
            whileTap={{ scale: 0.9 }}
          >
            {toolsPanelOpen ? (
              <ChevronUp className="h-4 w-4" style={{ color: '#4a4aa6' }} />
            ) : (
              <ChevronDown className="h-4 w-4" style={{ color: 'rgba(204,204,204,0.4)' }} />
            )}
          </motion.button>
        </div>
      </div>

      {/* ─── Mode Toggle ──────────────────────────────────────────────────── */}
      <div className="flex mt-2.5 rounded-lg overflow-hidden" style={{ background: 'rgba(26,26,74,0.6)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <button
          className="flex-1 py-1.5 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
          style={{
            background: chatMode === 'classic' ? 'rgba(74,74,166,0.25)' : 'transparent',
            color: chatMode === 'classic' ? '#4a4aa6' : 'rgba(204,204,204,0.4)',
            borderBottom: chatMode === 'classic' ? '2px solid #4a4aa6' : '2px solid transparent',
          }}
          onClick={() => onSetChatMode('classic')}
        >
          <MessageSquare className="h-3 w-3" />
          Classic Chat
        </button>
        <button
          className="flex-1 py-1.5 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
          style={{
            background: chatMode === 'openclaw' ? 'rgba(212,175,55,0.15)' : 'transparent',
            color: chatMode === 'openclaw' ? '#d4af37' : 'rgba(204,204,204,0.4)',
            borderBottom: chatMode === 'openclaw' ? '2px solid #d4af37' : '2px solid transparent',
          }}
          onClick={() => onSetChatMode('openclaw')}
        >
          <Cpu className="h-3 w-3" />
          OpenClaw Agent
        </button>
      </div>

      {/* ─── Persona Selector (Avatar Cards) ──────────────────────────────── */}
      <div className="flex gap-2 mt-2.5">
        {PERSONAS.map(p => (
          <motion.button
            key={p.id}
            className="flex-1 py-2 px-2 rounded-xl text-center transition-all"
            style={{
              background: activePersona === p.id
                ? 'linear-gradient(135deg, rgba(74,74,166,0.2), rgba(212,175,55,0.08))'
                : 'rgba(42,42,106,0.3)',
              border: `1px solid ${activePersona === p.id ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.08)'}`,
            }}
            onClick={() => onSetPersona(p.id)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-lg mb-0.5">{p.emoji}</div>
            <div className="text-[9px] font-bold" style={{
              color: activePersona === p.id ? '#ffffff' : 'rgba(204,204,204,0.5)'
            }}>
              {p.label}
            </div>
            <div className="text-[10px]" style={{
              color: activePersona === p.id ? '#4a4aa6' : 'rgba(204,204,204,0.3)'
            }}>
              {p.desc}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
