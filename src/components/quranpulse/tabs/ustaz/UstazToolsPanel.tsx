'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Clock, Zap, Cpu,
} from 'lucide-react'
import { OPENCLAW_TOOLS } from './types'

interface OpenClawSkill {
  name: string
  version?: string
  description?: string
  enabled?: boolean
}

interface OpenClawCronJob {
  id: string
  schedule: string
  task: string
  enabled: boolean
  nextRun?: string
}

interface UstazToolsPanelProps {
  isOpen: boolean
  isOnline: boolean
  isGatewayReachable: boolean
  skills: OpenClawSkill[]
  cronJobs: OpenClawCronJob[]
  webSearchEnabled: boolean
  onToggleWebSearch: () => void
}

export function UstazToolsPanel({
  isOpen,
  isOnline,
  isGatewayReachable,
  skills,
  cronJobs,
  webSearchEnabled,
  onToggleWebSearch,
}: UstazToolsPanelProps) {
  const prayerReminders = cronJobs
    .filter(j => j.enabled && j.task.toLowerCase().includes('solat'))
    .slice(0, 3)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
          style={{ borderBottom: '1px solid rgba(74,74,166,0.1)' }}
        >
          <div className="px-4 py-3 space-y-3" style={{ background: 'rgba(26,26,74,0.4)' }}>
            {/* Active Skills Badges */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="h-3 w-3" style={{ color: '#d4af37' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>
                  OpenClaw Skills ({skills.length > 0 ? skills.length : 5})
                </span>
                <span className="text-[10px]" style={{ color: isGatewayReachable ? '#22c55e' : '#ef4444' }}>
                  {isGatewayReachable ? '● Gateway Connected' : '● Gateway Offline'}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.length > 0 ? (
                  skills.map((skill, i) => (
                    <motion.span
                      key={skill.name || i}
                      className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                      style={{
                        background: 'rgba(74,74,166,0.15)',
                        border: '1px solid rgba(74,74,166,0.25)',
                        color: '#4a4aa6',
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      ⚡ {skill.name}
                    </motion.span>
                  ))
                ) : (
                  <>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                      style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                      ⚡ ustaz-ai
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                      style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                      ⚡ quran-search
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                      style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                      ⚡ prayer-ibadah
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                      style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                      ⚡ islamic-art
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium"
                      style={{ background: 'rgba(74,74,166,0.15)', border: '1px solid rgba(74,74,166,0.25)', color: '#4a4aa6' }}>
                      ⚡ iqra-hafazan
                    </span>
                  </>
                )}
                {!isOnline && (
                  <span className="px-2 py-0.5 rounded-full text-[9px]"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                    Offline
                  </span>
                )}
              </div>
            </div>

            {/* OpenClaw Tools Grid */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Cpu className="h-3 w-3" style={{ color: '#4a4aa6' }} />
                <span className="text-[10px] font-semibold" style={{ color: '#4a4aa6' }}>
                  Agent Tools
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {OPENCLAW_TOOLS.map(tool => (
                  <div
                    key={tool.id}
                    className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg"
                    style={{
                      background: 'rgba(42,42,106,0.4)',
                      border: '1px solid rgba(74,74,166,0.1)',
                    }}
                  >
                    <tool.icon className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
                    <span className="text-[10px] text-center font-medium" style={{ color: 'rgba(204,204,204,0.6)' }}>
                      {tool.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prayer Reminders from Cron */}
            {prayerReminders.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Clock className="h-3 w-3" style={{ color: '#d4af37' }} />
                  <span className="text-[10px] font-semibold" style={{ color: '#d4af37' }}>
                    Prayer Reminders
                  </span>
                </div>
                <div className="space-y-1">
                  {prayerReminders.map(job => (
                    <div key={job.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg"
                      style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)' }}>
                      <Clock className="h-3 w-3" style={{ color: '#d4af37' }} />
                      <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.6)' }}>
                        {job.schedule}
                      </span>
                      <span className="text-[9px] flex-1" style={{ color: '#d4af37' }}>
                        {job.task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Web Search Toggle */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" style={{ color: webSearchEnabled ? '#22c55e' : 'rgba(204,204,204,0.3)' }} />
                <span className="text-[10px] font-medium" style={{ color: webSearchEnabled ? '#22c55e' : 'rgba(204,204,204,0.4)' }}>
                  Web Search
                </span>
              </div>
              <button
                className="relative h-5 w-9 rounded-full transition-colors"
                style={{ background: webSearchEnabled ? 'rgba(34,197,94,0.3)' : 'rgba(42,42,106,0.5)' }}
                onClick={onToggleWebSearch}
              >
                <motion.div
                  className="absolute top-0.5 h-4 w-4 rounded-full"
                  style={{ background: webSearchEnabled ? '#22c55e' : 'rgba(204,204,204,0.3)' }}
                  animate={{ left: webSearchEnabled ? '18px' : '2px' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
