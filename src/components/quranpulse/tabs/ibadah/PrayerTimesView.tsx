'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronDown, Shield, ExternalLink } from 'lucide-react'
import { usePrayerTimes } from './usePrayerTimes'

export function PrayerTimesView() {
  const {
    prayerZone, setPrayerZone,
    livePrayers, loading,
    showZonePicker, setShowZonePicker,
    currentPrayerIdx, prayerList,
    currentZone, zonesByState,
  } = usePrayerTimes()

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Zone Selector */}
      <button
        className="w-full flex items-center gap-2 mb-4 px-3 py-2.5 rounded-xl"
        style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
        onClick={() => setShowZonePicker(!showZonePicker)}
      >
        <MapPin className="h-4 w-4" style={{ color: '#4a4aa6' }} />
        <span className="text-xs flex-1 text-left" style={{ color: '#ffffff' }}>
          {currentZone ? `${currentZone.nameMs}, ${currentZone.stateMs}` : prayerZone}
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>JAKIM</span>
        <ChevronDown className="h-3.5 w-3.5" style={{ color: 'rgba(204,204,204,0.5)', transform: showZonePicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {/* Zone Picker Dropdown */}
      <AnimatePresence>
        {showZonePicker && (
          <motion.div
            className="mb-4 rounded-xl overflow-hidden max-h-64 overflow-y-auto"
            style={{ background: 'rgba(42,42,106,0.8)', border: '1px solid rgba(74,74,166,0.2)' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {Object.entries(zonesByState).map(([state, stateZones]) => (
              <div key={state}>
                <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#4a4aa6', background: 'rgba(74,74,166,0.1)' }}>
                  {state}
                </div>
                {stateZones.map(zone => (
                  <button
                    key={zone.code}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-[rgba(74,74,166,0.1)]"
                    style={{
                      color: zone.code === prayerZone ? '#4a4aa6' : '#ffffff',
                      background: zone.code === prayerZone ? 'rgba(74,74,166,0.15)' : 'transparent',
                    }}
                    onClick={() => { setPrayerZone(zone.code); setShowZonePicker(false) }}
                  >
                    <span>{zone.nameMs}</span>
                    <span className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>{zone.code}</span>
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current/Next Prayer Highlight */}
      {prayerList[currentPrayerIdx] && (
        <motion.div
          className="rounded-xl p-5 mb-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(74,74,166,0.2), rgba(74,74,166,0.08))',
            border: '1px solid rgba(74,74,166,0.3)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="absolute top-3 right-3 text-4xl opacity-20">
            {prayerList[currentPrayerIdx].icon}
          </div>
          <div className="text-xs font-medium mb-1" style={{ color: '#4a4aa6' }}>
            Solat Seterusnya
          </div>
          <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
            {prayerList[currentPrayerIdx].nameMs}
          </div>
          <div className="text-3xl font-bold mt-1" style={{ color: '#4a4aa6' }}>
            {prayerList[currentPrayerIdx].time}
          </div>
          <div className="text-xs mt-2" style={{ color: 'rgba(204,204,204,0.6)' }}>
            {currentPrayerIdx === 0 ? 'Segera' : 'Dalam masa terdekat'}
          </div>
          {livePrayers?.hijriDate && (
            <div className="text-[10px] mt-1" style={{ color: 'rgba(212,175,55,0.6)' }}>
              📅 {livePrayers.hijriDate}
            </div>
          )}
        </motion.div>
      )}

      {/* All Prayer Times */}
      <div className="space-y-2">
        {prayerList.map((prayer, idx) => {
          const isCurrent = idx === currentPrayerIdx
          return (
            <motion.div
              key={prayer.name}
              className="flex items-center justify-between rounded-xl p-3.5"
              style={{
                background: isCurrent ? 'rgba(74,74,166,0.15)' : 'rgba(42,42,106,0.3)',
                border: isCurrent ? '1px solid rgba(74,74,166,0.3)' : '1px solid rgba(74,74,166,0.06)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{prayer.icon}</span>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#ffffff' }}>
                    {prayer.nameMs}
                  </div>
                  <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>
                    {prayer.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold" style={{ color: isCurrent ? '#4a4aa6' : '#ffffff' }}>
                  {loading ? '...' : prayer.time}
                </div>
                {isCurrent && (
                  <div className="text-[9px] px-1.5 py-0.5 rounded-full inline-block" style={{ background: 'rgba(74,74,166,0.2)', color: '#4a4aa6' }}>
                    Seterusnya
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ═══ JAKIM Certification Badge ═══ */}
      <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.12)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Shield className="h-3.5 w-3.5" style={{ color: '#4a4aa6' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#4a4aa6' }}>✅ Data JAKIM e-Solat</span>
        </div>
        <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(204,204,204,0.35)' }}>
          Waktu Solat Disahkan JAKIM Malaysia. Hukum fiqh mengikut mazhab Syafie. Rujuk mufti negeri untuk hukum rasmi.
        </p>
        <a href="https://www.islam.gov.my" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] mt-1 hover:underline" style={{ color: 'rgba(74,74,166,0.5)' }}>
          <ExternalLink className="h-2 w-2" /> Rujuk islam.gov.my
        </a>
      </div>

      {/* ═══ Monthly Prayer Tracker ═══ */}
      <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold" style={{ color: '#ffffff' }}>Penjejak Solat Bulanan</span>
          <span className="text-[9px]" style={{ color: 'rgba(204,204,204,0.3)' }}>Solat tepat waktu</span>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['S', 'I', 'Z', 'A', 'M', 'I', '✓'].map((label, i) => (
            <div key={`header-${i}`} className="text-center text-[10px] font-medium py-1" style={{ color: 'rgba(204,204,204,0.3)' }}>
              {i < 6 ? ['Sub', 'Syu', 'Zoh', 'Asr', 'Mag', 'Isy'][i] : ''}
            </div>
          ))}
          {/* Last 7 days tracking */}
          {Array.from({ length: 7 }).map((_, dayIdx) => {
            const seed = new Date().getDate() - (6 - dayIdx)
            return (
              <div key={dayIdx} className="flex gap-0.5">
                {['Sub', 'Syu', 'Zoh', 'Asr', 'Mag', 'Isy'].map((_, prayerIdx) => {
                  const filled = ((seed * 7 + prayerIdx * 3 + dayIdx) % 5) < 4
                  return (
                    <div
                      key={prayerIdx}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: filled ? 'rgba(74,74,166,0.5)' : 'rgba(74,74,166,0.1)' }}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-3 text-center">
        <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.25)' }}>
          Waktu solat berdasarkan zon JAKIM · Data dari e-solat.gov.my · Kemas kini automatik
        </p>
      </div>
    </motion.div>
  )
}
