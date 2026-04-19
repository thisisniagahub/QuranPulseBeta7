'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowLeftRight } from 'lucide-react'
import type { IslamicCalendarEntry, HijriDate } from './types'
import { jakimService } from '@/lib/jakim-service'

export function KalendarView() {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null)
  const [calendarData, setCalendarData] = useState<IslamicCalendarEntry[]>([])
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
    const hDate = jakimService.gregorianToHijri(today)
    setHijriDate(hDate)
    setSelectedMonth(hDate.month - 1)
  }, [])

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const data = await jakimService.getIslamicCalendar()
        setCalendarData(data)
      } catch {
        // Use fallback
      } finally {
        setLoading(false)
      }
    }
    fetchCalendar()
  }, [])

  const currentMonth = calendarData[selectedMonth]
  const notableDays = currentMonth?.notableDays || []
  const dayNames = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab']

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Current Hijri Date */}
      {hijriDate && (
        <motion.div
          className="rounded-xl p-5 mb-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(74,74,166,0.2), rgba(74,74,166,0.08))',
            border: '1px solid rgba(74,74,166,0.3)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-xs font-medium mb-1" style={{ color: '#4a4aa6' }}>
            Tarikh Hijri Hari Ini
          </div>
          <div className="text-2xl font-bold" style={{ color: '#ffffff' }}>
            {hijriDate.day} {hijriDate.monthNameMs} {hijriDate.year}H
          </div>
          <div className="text-xs mt-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
            {new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>
      )}

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          className="p-2 rounded-lg"
          style={{ background: 'rgba(42,42,106,0.3)', color: '#4a4aa6' }}
          onClick={() => setSelectedMonth(Math.max(0, selectedMonth - 1))}
          disabled={selectedMonth === 0}
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <div className="text-center">
          <div className="text-sm font-semibold" style={{ color: '#ffffff' }}>
            {currentMonth?.hijriMonthNameMs || '...'}
          </div>
          <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.4)' }}>
            {currentMonth?.hijriYear || ''}H
          </div>
        </div>
        <button
          className="p-2 rounded-lg"
          style={{ background: 'rgba(42,42,106,0.3)', color: '#4a4aa6' }}
          onClick={() => setSelectedMonth(Math.min(11, selectedMonth + 1))}
          disabled={selectedMonth === 11}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl p-3" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[10px] font-medium py-1" style={{ color: 'rgba(204,204,204,0.5)' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {loading ? (
            <div className="col-span-7 text-center py-8 text-xs" style={{ color: 'rgba(204,204,204,0.4)' }}>
              Memuatkan kalendar...
            </div>
          ) : (
            Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1
              const isToday = hijriDate && day === hijriDate.day && selectedMonth === hijriDate.month - 1
              const isNotable = notableDays.some(d => d.day === day)
              const notableDay = notableDays.find(d => d.day === day)

              return (
                <div
                  key={day}
                  className="flex flex-col items-center justify-center py-1.5 rounded-lg relative"
                  style={{
                    background: isToday
                      ? 'rgba(74,74,166,0.3)'
                      : isNotable
                      ? 'rgba(212,175,55,0.1)'
                      : 'transparent',
                    border: isToday ? '1px solid rgba(74,74,166,0.5)' : isNotable ? '1px solid rgba(212,175,55,0.2)' : 'none',
                  }}
                >
                  <span
                    className="text-xs"
                    style={{
                      color: isToday ? '#4a4aa6' : isNotable ? '#d4af37' : 'rgba(204,204,204,0.7)',
                      fontWeight: isToday || isNotable ? 700 : 400,
                    }}
                  >
                    {day}
                  </span>
                  {isNotable && (
                    <div className="absolute -bottom-0.5 w-1 h-1 rounded-full" style={{ background: '#d4af37' }} />
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Notable Days */}
      {notableDays.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold mb-2" style={{ color: '#d4af37' }}>
            Hari-hari Penting
          </div>
          <div className="space-y-2">
            {notableDays.map(day => (
              <motion.div
                key={day.day}
                className="flex items-center gap-3 rounded-xl p-3"
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.15)',
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)' }}>
                  <span className="text-xs font-bold" style={{ color: '#d4af37' }}>{day.day}</span>
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: '#ffffff' }}>{day.nameMs}</div>
                  <div className="text-[10px]" style={{ color: 'rgba(204,204,204,0.5)' }}>{day.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Islamic Date Converter ═══ */}
      <div className="mt-4 rounded-xl p-4" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.1)' }}>
        <div className="flex items-center gap-1.5 mb-2">
          <ArrowLeftRight className="h-3.5 w-3.5" style={{ color: '#d4af37' }} />
          <span className="text-xs font-semibold" style={{ color: '#d4af37' }}>Penukar Tarikh Islam</span>
        </div>
        {hijriDate && (
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(74,74,166,0.1)', border: '1px solid rgba(74,74,166,0.15)' }}>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Masihi</div>
              <div className="text-xs font-semibold" style={{ color: '#ffffff' }}>{new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
              <div className="text-[9px]" style={{ color: 'rgba(204,204,204,0.4)' }}>Hijri</div>
              <div className="text-xs font-semibold" style={{ color: '#d4af37' }}>{hijriDate.day} {hijriDate.monthNameMs} {hijriDate.year}H</div>
            </div>
          </div>
        )}
        <p className="text-[10px] mt-1.5 text-center" style={{ color: 'rgba(204,204,204,0.3)' }}>Penukaran anggaran. Rujuk takwim rasmi untuk ketepatan.</p>
      </div>

      {/* Month Quick Select */}
      <div className="mt-4">
        <div className="text-xs font-semibold mb-2" style={{ color: 'rgba(204,204,204,0.6)' }}>
          Pilih Bulan
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {calendarData.length > 0 ? calendarData.map((month, i) => (
            <button
              key={i}
              className="py-2 rounded-lg text-xs"
              style={{
                background: selectedMonth === i ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                color: selectedMonth === i ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                border: `1px solid ${selectedMonth === i ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.06)'}`,
                fontWeight: selectedMonth === i ? 600 : 400,
              }}
              onClick={() => setSelectedMonth(i)}
            >
              {month.hijriMonthNameMs}
            </button>
          )) : Array.from({ length: 12 }).map((_, i) => {
            const names = ['Muharram', 'Safar', 'Rabiulawal', 'Rabiulakhir', 'Jumadilawal', 'Jumadilakhir', 'Rejab', "Sya'ban", 'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijjah']
            return (
              <button
                key={i}
                className="py-2 rounded-lg text-xs"
                style={{
                  background: selectedMonth === i ? 'rgba(74,74,166,0.2)' : 'rgba(42,42,106,0.3)',
                  color: selectedMonth === i ? '#4a4aa6' : 'rgba(204,204,204,0.5)',
                  border: `1px solid ${selectedMonth === i ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.06)'}`,
                  fontWeight: selectedMonth === i ? 600 : 400,
                }}
                onClick={() => setSelectedMonth(i)}
              >
                {names[i]}
              </button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
