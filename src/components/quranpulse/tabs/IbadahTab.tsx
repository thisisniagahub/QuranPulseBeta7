'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { IbadahHeader } from './ibadah/IbadahHeader'
import { PrayerTimesView } from './ibadah/PrayerTimesView'
import { QiblaView } from './ibadah/QiblaView'
import { TasbihView } from './ibadah/TasbihView'
import { KalendarView } from './ibadah/KalendarView'
import { HadithView } from './ibadah/HadithView'
import type { IbadahView } from './ibadah/types'

export function IbadahTab() {
  const [activeView, setActiveView] = useState<IbadahView>('prayer')

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <IbadahHeader activeView={activeView} onViewChange={setActiveView} />

      <AnimatePresence mode="wait">
        {activeView === 'prayer' && <PrayerTimesView key="prayer" />}
        {activeView === 'qibla' && <QiblaView key="qibla" />}
        {activeView === 'tasbih' && <TasbihView key="tasbih" />}
        {activeView === 'kalendar' && <KalendarView key="kalendar" />}
        {activeView === 'hadith' && <HadithView key="hadith" />}
        {activeView === 'khutbah' && <KhutbahView key="khutbah" />}
      </AnimatePresence>
    </div>
  )
}

// KhutbahView placeholder — simple inline since it's small
function KhutbahView() {
  return (
    <div className="qp-scroll flex-1 overflow-y-auto px-4 pb-6">
      <div className="text-center py-12">
        <p className="text-sm" style={{ color: 'rgba(204,204,204,0.5)' }}>
          Khutbah Jumaat &amp; Hikmah akan datang tidak lama lagi
        </p>
        <p className="text-xs mt-2" style={{ color: 'rgba(204,204,204,0.3)' }}>
          Sumber: JAKIM Malaysia
        </p>
      </div>
    </div>
  )
}
