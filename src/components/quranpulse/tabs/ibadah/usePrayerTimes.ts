'use client'

import { useState, useEffect } from 'react'
import { useQuranPulseStore } from '@/stores/quranpulse-store'
import { PRAYER_TIMES_KL, getCurrentPrayerIndex } from '@/lib/quran-data'
import type { PrayerTimes, JakimZone } from './types'
import { jakimService } from '@/lib/jakim-service'

export function usePrayerTimes() {
  const { prayerZone, setPrayerZone } = useQuranPulseStore()
  const [livePrayers, setLivePrayers] = useState<PrayerTimes | null>(null)
  const [loading, setLoading] = useState(true)
  const [zones, setZones] = useState<JakimZone[]>([])
  const [showZonePicker, setShowZonePicker] = useState(false)
  const [currentPrayerIdx, setCurrentPrayerIdx] = useState(0)

  useEffect(() => {
    const idx = getCurrentPrayerIndex()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPrayerIdx(idx)
  }, [])

  useEffect(() => {
    const z = jakimService.getZones()
    setZones(z)
  }, [])

  useEffect(() => {
    async function fetchPrayers() {
      setLoading(true)
      try {
        const res = await fetch(`/api/jakim/solat?zone=${prayerZone}`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setLivePrayers(data.data)
          }
        }
      } catch {
        // Fallback to static data
      } finally {
        setLoading(false)
      }
    }
    fetchPrayers()
  }, [prayerZone])

  const prayerList = livePrayers ? [
    { name: 'Subuh', nameMs: 'Subuh', time: livePrayers.fajr, icon: '🌅' },
    { name: 'Syuruk', nameMs: 'Syuruk', time: livePrayers.syuruk, icon: '☀️' },
    { name: 'Zohor', nameMs: 'Zohor', time: livePrayers.dhuhr, icon: '🌞' },
    { name: 'Asar', nameMs: 'Asar', time: livePrayers.asr, icon: '🌤️' },
    { name: 'Maghrib', nameMs: 'Maghrib', time: livePrayers.maghrib, icon: '🌅' },
    { name: 'Isyak', nameMs: 'Isyak', time: livePrayers.isha, icon: '🌙' },
  ] : PRAYER_TIMES_KL.map(p => ({ name: p.name, nameMs: p.nameMs, time: p.time, icon: p.icon }))

  const currentZone = zones.find(z => z.code === prayerZone)
  const zonesByState = zones.reduce<Record<string, JakimZone[]>>((acc, z) => {
    if (!acc[z.stateMs]) acc[z.stateMs] = []
    acc[z.stateMs].push(z)
    return acc
  }, {})

  return {
    prayerZone,
    setPrayerZone,
    livePrayers,
    loading,
    zones,
    showZonePicker,
    setShowZonePicker,
    currentPrayerIdx,
    prayerList,
    currentZone,
    zonesByState,
  }
}
