'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check, RotateCcw, Volume2, VolumeX, Vibrate, VibrateOff, History, Minus, Bell, BellOff } from 'lucide-react'
import { DHIKR_CATEGORIES } from './types'
import { useTasbih } from './useTasbih'

export function TasbihView() {
  const {
    tasbihCount, tasbihTarget, tasbihTotal,
    resetTasbih, setTasbihTarget,
    tasbihVibration, setTasbihVibration,
    tasbihSound, setTasbihSound,
    tasbihVibrationPattern, setTasbihVibrationPattern,
    selectedDhikr, activeCategory,
    showSettings, setShowSettings,
    showHistory, setShowHistory,
    showCelebration, setShowCelebration,
    adhanEnabled, setAdhanEnabled,
    audioRef,
    progress, isComplete,
    dhikrList,
    handleTap,
    handleCategoryChange,
    handleDhikrChange,
    todaySessions, todayTotal,
  } = useTasbih()

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto flex flex-col items-center px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Category Tabs */}
      <div className="w-full overflow-x-auto mb-3 flex gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
        {DHIKR_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: activeCategory === cat.id ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
              color: activeCategory === cat.id ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
              border: `1px solid ${activeCategory === cat.id ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
            }}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Dhikr selector */}
      <div className="w-full overflow-x-auto mb-3 flex gap-2 pb-1" style={{ scrollbarWidth: 'none' }}>
        {dhikrList.map((dhikr, i) => (
          <button
            key={`${activeCategory}-${i}`}
            className="flex-shrink-0 px-3 py-2 rounded-xl text-center transition-transform active:scale-95"
            style={{
              background: selectedDhikr === i ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
              border: `1px solid ${selectedDhikr === i ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
              minWidth: '100px',
            }}
            onClick={() => handleDhikrChange(i)}
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
          {dhikrList[selectedDhikr]?.arabic}
        </p>
        <p className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.6)' }}>
          {dhikrList[selectedDhikr]?.meaning}
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

        {/* Stats row */}
        <div className="mt-3 flex gap-4 text-center">
          <div>
            <div className="text-sm font-bold" style={{ color: '#4a4aa6' }}>{tasbihTotal}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Jumlah</div>
          </div>
          <div className="w-px" style={{ background: 'rgba(74,74,166,0.2)' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: '#d4af37' }}>{todayTotal}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Hari Ini</div>
          </div>
          <div className="w-px" style={{ background: 'rgba(74,74,166,0.2)' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: '#ffffff' }}>{todaySessions.length}</div>
            <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>Sesi</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mt-3 flex-wrap justify-center">
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs transition-transform active:scale-95"
            style={{
              background: 'rgba(212,175,55,0.1)',
              color: '#d4af37',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
            onClick={resetTasbih}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Set Semula
          </button>
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs transition-transform active:scale-95"
            style={{
              background: tasbihVibration ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
              color: tasbihVibration ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
              border: `1px solid ${tasbihVibration ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
            }}
            onClick={() => setTasbihVibration(!tasbihVibration)}
          >
            {tasbihVibration ? <Vibrate className="h-3.5 w-3.5" /> : <VibrateOff className="h-3.5 w-3.5" />}
            {tasbihVibration ? 'Getar' : 'Senyap'}
          </button>
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs transition-transform active:scale-95"
            style={{
              background: tasbihSound ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
              color: tasbihSound ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
              border: `1px solid ${tasbihSound ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
            }}
            onClick={() => setTasbihSound(!tasbihSound)}
          >
            {tasbihSound ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            {tasbihSound ? 'Bunyi' : 'Mute'}
          </button>
        </div>

        {/* Settings row */}
        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs"
            style={{
              background: 'rgba(42,42,106,0.3)',
              color: 'rgba(204,204,204,0.6)',
              border: '1px solid rgba(74,74,166,0.1)',
            }}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Minus className="h-3 w-3" /> Tetapan
          </button>
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs"
            style={{
              background: 'rgba(42,42,106,0.3)',
              color: 'rgba(204,204,204,0.6)',
              border: '1px solid rgba(74,74,166,0.1)',
            }}
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-3 w-3" /> Sejarah
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
            <option value={1}>1x</option>
            <option value={3}>3x</option>
            <option value={33}>33x</option>
            <option value={99}>99x</option>
            <option value={100}>100x</option>
            <option value={500}>500x</option>
            <option value={1000}>1000x</option>
          </select>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="w-full mt-3 rounded-xl p-3"
              style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-xs font-semibold mb-2" style={{ color: '#4a4aa6' }}>Corak Getaran</div>
              <div className="flex gap-2">
                {(['short', 'medium', 'long'] as const).map(pattern => (
                  <button
                    key={pattern}
                    className="flex-1 py-2 rounded-lg text-xs"
                    style={{
                      background: tasbihVibrationPattern === pattern ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                      color: tasbihVibrationPattern === pattern ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                      border: `1px solid ${tasbihVibrationPattern === pattern ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
                    }}
                    onClick={() => setTasbihVibrationPattern(pattern)}
                  >
                    {pattern === 'short' ? 'Singkat' : pattern === 'medium' ? 'Sederhana' : 'Panjang'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              className="w-full mt-3 rounded-xl p-3 max-h-48 overflow-y-auto"
              style={{ background: 'rgba(42,42,106,0.5)', border: '1px solid rgba(74,74,166,0.1)' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-xs font-semibold mb-2" style={{ color: '#4a4aa6' }}>Sejarah Hari Ini</div>
              {todaySessions.length === 0 ? (
                <div className="text-xs text-center py-4" style={{ color: 'rgba(204,204,204,0.4)' }}>
                  Tiada sesi tasbih hari ini
                </div>
              ) : (
                <div className="space-y-1.5">
                  {todaySessions.map(session => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg"
                      style={{ background: 'rgba(42,42,106,0.3)' }}
                    >
                      <div>
                        <div className="text-xs font-medium" style={{ color: '#ffffff' }}>
                          {session.dhikr || 'Tasbih'}
                        </div>
                        <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
                          {new Date(session.timestamp).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="text-xs font-bold" style={{ color: '#d4af37' }}>
                        {session.count}/{session.target}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Adhan Toggle */}
      <div className="flex gap-2 mt-2 justify-center">
        <button
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs"
          style={{
            background: adhanEnabled ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
            color: adhanEnabled ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
            border: `1px solid ${adhanEnabled ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.1)'}`,
          }}
          onClick={() => setAdhanEnabled(!adhanEnabled)}
        >
          {adhanEnabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
          {adhanEnabled ? 'Azan Hidup' : 'Azan Mati'}
        </button>
      </div>

      {/* ═══ Completion Celebration ═══ */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1.3, 1], opacity: 1 }}
              transition={{ type: 'tween', duration: 0.5 }}
            >
              <motion.div
                className="text-5xl mb-2"
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ type: 'tween', duration: 0.6, repeat: 2 }}
              >
                🎉
              </motion.div>
              <div className="text-lg font-bold" style={{ color: '#d4af37' }}>Mabruk!</div>
              <div className="text-xs" style={{ color: 'rgba(204,204,204,0.7)' }}>Tasbih selesai +25 XP</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} />
    </motion.div>
  )
}
