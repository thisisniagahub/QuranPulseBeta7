'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Compass, CircleDot, RotateCcw, Check, Navigation, MapPin, Clock } from 'lucide-react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { PRAYER_TIMES_KL, getCurrentPrayerIndex } from '@/lib/quran-data'

type IbadahView = 'prayer' | 'qibla' | 'tasbih'

export function IbadahTab() {
  const [activeView, setActiveView] = useState<IbadahView>('prayer')
  const currentPrayerIdx = getCurrentPrayerIndex()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-2 pb-2">
        <h2 className="text-lg font-bold" style={{ color: '#ffffff' }}>Ibadah</h2>
        <p className="text-xs" style={{ color: 'rgba(204,204,204,0.6)' }}>Solat, Kiblat & Tasbih</p>
      </div>

      {/* Sub-tab navigation */}
      <div className="px-4 mb-3">
        <div className="flex gap-2">
          {[
            { key: 'prayer' as IbadahView, label: 'Waktu Solat', icon: <Clock className="h-3.5 w-3.5" /> },
            { key: 'qibla' as IbadahView, label: 'Kiblat', icon: <Compass className="h-3.5 w-3.5" /> },
            { key: 'tasbih' as IbadahView, label: 'Tasbih', icon: <CircleDot className="h-3.5 w-3.5" /> },
          ].map(tab => (
            <button
              key={tab.key}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: activeView === tab.key ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                color: activeView === tab.key ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                border: `1px solid ${activeView === tab.key ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
              }}
              onClick={() => setActiveView(tab.key)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeView === 'prayer' && <PrayerTimesView key="prayer" currentPrayerIdx={currentPrayerIdx} />}
        {activeView === 'qibla' && <QiblaView key="qibla" />}
        {activeView === 'tasbih' && <TasbihView key="tasbih" />}
      </AnimatePresence>
    </div>
  )
}

function PrayerTimesView({ currentPrayerIdx }: { currentPrayerIdx: number }) {
  const prayerGradients = [
    'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
    'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
    'linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))',
    'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))',
    'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
    'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))',
  ]

  const prayerIcons = ['🌅', '☀️', '🌞', '🌤️', '🌅', '🌙']

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Zone Selector */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <MapPin className="h-4 w-4" style={{ color: '#4a4aa6' }} />
        <span className="text-xs" style={{ color: '#ffffff' }}>Wilayah Persekutuan Kuala Lumpur</span>
        <span className="text-[10px] ml-auto px-2 py-0.5 rounded-full" style={{ background: 'rgba(74,74,166,0.15)', color: '#4a4aa6' }}>JAKIM</span>
      </div>

      {/* Current/Next Prayer Highlight */}
      {PRAYER_TIMES_KL[currentPrayerIdx] && (
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
            {prayerIcons[currentPrayerIdx]}
          </div>
          <div className="text-xs font-medium mb-1" style={{ color: '#4a4aa6' }}>
            Solat Seterusnya
          </div>
          <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
            {PRAYER_TIMES_KL[currentPrayerIdx].nameMs}
          </div>
          <div className="text-3xl font-bold mt-1" style={{ color: '#4a4aa6' }}>
            {PRAYER_TIMES_KL[currentPrayerIdx].time}
          </div>
          <div className="text-xs mt-2" style={{ color: 'rgba(204,204,204,0.6)' }}>
            {currentPrayerIdx === 0 ? 'Segera' : 'Dalam masa terdekat'}
          </div>
        </motion.div>
      )}

      {/* All Prayer Times */}
      <div className="space-y-2">
        {PRAYER_TIMES_KL.map((prayer, idx) => {
          const isCurrent = idx === currentPrayerIdx
          return (
            <motion.div
              key={prayer.name}
              className="flex items-center justify-between rounded-xl p-3.5"
              style={{
                background: isCurrent ? prayerGradients[idx] : 'rgba(42,42,106,0.3)',
                border: isCurrent ? '1px solid rgba(74,74,166,0.3)' : '1px solid rgba(74,74,166,0.06)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{prayerIcons[idx]}</span>
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
                  {prayer.time}
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

      {/* Prayer logging hint */}
      <div className="mt-4 text-center">
        <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.25)' }}>
          Waktu solat berdasarkan zon JAKIM WPKL · Kemas kini automatik
        </p>
      </div>
    </motion.div>
  )
}

function QiblaView() {
  const [qiblaAngle] = useState(292.5) // KL to Mecca

  return (
    <motion.div
      className="flex-1 flex flex-col items-center justify-center px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Arah Kiblat</h3>
        <p className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Kaabah, Makkah Al-Mukarramah</p>
      </div>

      {/* Compass */}
      <motion.div
        className="relative h-64 w-64 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(74,74,166,0.1) 0%, rgba(26,26,74,0.5) 70%)',
          border: '2px solid rgba(74,74,166,0.2)',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Direction markers */}
        {['U', 'T', 'S', 'B'].map((dir, i) => (
          <div
            key={dir}
            className="absolute text-xs font-bold"
            style={{
              color: dir === 'U' ? '#4a4aa6' : 'rgba(204,204,204,0.3)',
              top: i === 0 ? '8px' : 'auto',
              bottom: i === 2 ? '8px' : 'auto',
              left: i === 3 ? '8px' : 'auto',
              right: i === 1 ? '8px' : 'auto',
              transform: i === 1 || i === 3 ? 'translateY(-50%)' : 'none',
            }}
          >
            {dir}
          </div>
        ))}

        {/* Qibla Arrow */}
        <motion.div
          className="absolute"
          style={{ transform: `rotate(${qiblaAngle}deg)` }}
          animate={{ rotate: [qiblaAngle - 2, qiblaAngle + 2, qiblaAngle - 2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-24 w-0.5 mx-auto" style={{ background: 'linear-gradient(to top, transparent, #4a4aa6)' }} />
          <div
            className="h-3 w-3 mx-auto -mt-0.5"
            style={{
              background: '#d4af37',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </motion.div>

        {/* Center dot */}
        <div
          className="absolute h-4 w-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, #4a4aa6, rgba(74,74,166,0.3))',
            boxShadow: '0 0 10px rgba(74,74,166,0.5)',
          }}
        />
      </motion.div>

      {/* Degree info */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold" style={{ color: '#4a4aa6' }}>
          {qiblaAngle}°
        </div>
        <p className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
          Dari utara mengikut arah jam
        </p>
      </div>

      {/* Info */}
      <div className="mt-4 rounded-xl p-3 w-full" style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4" style={{ color: '#4a4aa6' }} />
          <div>
            <div className="text-xs font-medium" style={{ color: '#ffffff' }}>Lokasi: Kuala Lumpur</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>3.1390° N, 101.6869° E</div>
          </div>
        </div>
      </div>

      <p className="text-[9px] mt-3 text-center" style={{ color: 'rgba(204,204,204,0.25)' }}>
        * Arah kiblat adalah anggaran. Untuk ketepatan, sila rujuk kompas kiblat di masjid.
      </p>
    </motion.div>
  )
}

function TasbihView() {
  const { tasbihCount, tasbihTarget, tasbihTotal, incrementTasbih, resetTasbih, setTasbihTarget, addXp } = useQuranPulseStore()
  const [selectedDhikr, setSelectedDhikr] = useState(0)

  const progress = Math.min((tasbihCount / tasbihTarget) * 100, 100)
  const isComplete = tasbihCount >= tasbihTarget

  const dhikrList = [
    { arabic: 'سُبْحَانَ اللهِ', malay: 'Subhanallah', meaning: 'Maha Suci Allah' },
    { arabic: 'الْحَمْدُ لِلَّهِ', malay: 'Alhamdulillah', meaning: 'Segala puji bagi Allah' },
    { arabic: 'اللهُ أَكْبَرُ', malay: 'Allahu Akbar', meaning: 'Allah Maha Besar' },
    { arabic: 'لَا إِلَهَ إِلَّا اللهُ', malay: 'La ilaha illallah', meaning: 'Tiada Tuhan melainkan Allah' },
    { arabic: 'أَسْتَغْفِرُ اللهَ', malay: 'Astaghfirullah', meaning: 'Aku memohon ampun kepada Allah' },
  ]

  const handleTap = () => {
    incrementTasbih()
    if (tasbihCount + 1 >= tasbihTarget) {
      addXp(25)
    }
    // Vibrate on mobile
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  return (
    <motion.div
      className="flex-1 flex flex-col items-center px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Dhikr selector */}
      <div className="w-full overflow-x-auto mb-4 flex gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
        {dhikrList.map((dhikr, i) => (
          <button
            key={i}
            className="flex-shrink-0 px-3 py-2 rounded-xl text-center transition-transform active:scale-95"
            style={{
              background: selectedDhikr === i ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
              border: `1px solid ${selectedDhikr === i ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
              minWidth: '100px',
            }}
            onClick={() => { setSelectedDhikr(i); resetTasbih() }}
          >
            <div className="text-lg font-arabic" style={{ color: '#ffffff', direction: 'rtl' }}>{dhikr.arabic}</div>
            <div className="text-[10px] mt-0.5" style={{ color: selectedDhikr === i ? '#4a4aa6' : 'rgba(204,204,204,0.5)' }}>
              {dhikr.malay}
            </div>
          </button>
        ))}
      </div>

      {/* Current Dhikr Display */}
      <div className="text-center mb-2">
        <p className="text-2xl font-arabic" style={{ color: '#d4af37', direction: 'rtl' }}>
          {dhikrList[selectedDhikr].arabic}
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.6)' }}>
          {dhikrList[selectedDhikr].meaning}
        </p>
      </div>

      {/* Tasbih Counter Button */}
      <motion.div
        className="flex flex-col items-center mt-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <motion.button
          className="relative flex h-48 w-48 items-center justify-center rounded-full transition-transform"
          style={{
            background: isComplete
              ? 'conic-gradient(#d4af37 100%, rgba(212,175,55,0.1) 100%)'
              : `conic-gradient(#4a4aa6 ${progress}%, rgba(74,74,166,0.08) ${progress}%)`,
          }}
          onClick={handleTap}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className="flex h-40 w-40 flex-col items-center justify-center rounded-full"
            style={{
              background: isComplete
                ? 'radial-gradient(circle, rgba(212,175,55,0.1), #1a1a4a)'
                : '#1a1a4a',
            }}
          >
            {isComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Check className="h-12 w-12" style={{ color: '#d4af37' }} />
              </motion.div>
            ) : (
              <>
                <motion.span
                  className="text-5xl font-bold"
                  style={{ color: '#4a4aa6' }}
                  key={tasbihCount}
                  initial={{ scale: 1.2, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {tasbihCount}
                </motion.span>
                <span className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.6)' }}>
                  / {tasbihTarget}
                </span>
              </>
            )}
          </div>
        </motion.button>

        {/* Total count */}
        <div className="mt-3 text-center">
          <span className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>
            Jumlah: {tasbihTotal} kali
          </span>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mt-3">
          <button
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs transition-transform active:scale-95"
            style={{
              background: 'rgba(212,175,55,0.1)',
              color: '#d4af37',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
            onClick={resetTasbih}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Set Semula
          </button>
          <select
            className="px-3 py-2 rounded-xl text-xs outline-none"
            style={{
              background: 'rgba(42,42,106,0.5)',
              border: '1px solid rgba(74,74,166,0.15)',
              color: '#ffffff',
            }}
            value={tasbihTarget}
            onChange={e => setTasbihTarget(Number(e.target.value))}
          >
            <option value={33}>33x</option>
            <option value={99}>99x</option>
            <option value={100}>100x</option>
            <option value={500}>500x</option>
            <option value={1000}>1000x</option>
          </select>
        </div>
      </motion.div>
    </motion.div>
  )
}
