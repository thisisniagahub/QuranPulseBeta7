'use client'

import { motion } from 'framer-motion'
import { Navigation, Shield } from 'lucide-react'
import { useQibla } from './useQibla'

export function QiblaView() {
  const {
    qiblaAngle, deviceHeading, orientationSupported,
    compassRotation, effectiveAngle,
  } = useQibla()

  return (
    <motion.div
      className="qp-scroll flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold" style={{ color: '#ffffff' }}>Arah Kiblat</h3>
        <p className="text-xs" style={{ color: 'rgba(204,204,204,0.5)' }}>Kaabah, Makkah Al-Mukarramah</p>
        {orientationSupported && (
          <div className="flex items-center justify-center gap-1 mt-1">
            <Navigation className="h-3 w-3" style={{ color: '#4a4aa6' }} />
            <span className="text-[10px]" style={{ color: '#4a4aa6' }}>Kompas Aktif</span>
          </div>
        )}
      </div>

      {/* Compass */}
      <motion.div
        className="relative h-64 w-64 rounded-full flex items-center justify-center"
        style={{
          background: 'radial-gradient(circle, rgba(74,74,166,0.1) 0%, rgba(26,26,74,0.5) 70%)',
          border: '2px solid rgba(74,74,166,0.2)',
          transform: `rotate(${compassRotation}deg)`,
          transition: deviceHeading !== null ? 'transform 0.1s ease-out' : 'none',
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Direction markers */}
        {[
          { label: 'U', style: { top: '8px', left: '50%', transform: 'translateX(-50%)' } },
          { label: 'T', style: { bottom: '8px', left: '50%', transform: 'translateX(-50%)' } },
          { label: 'S', style: { right: '8px', top: '50%', transform: 'translateY(-50%)' } },
          { label: 'B', style: { left: '8px', top: '50%', transform: 'translateY(-50%)' } },
        ].map(dir => (
          <div
            key={dir.label}
            className="absolute text-xs font-bold"
            style={{
              color: dir.label === 'U' ? '#4a4aa6' : 'rgba(204,204,204,0.3)',
              ...dir.style,
            }}
          >
            {dir.label}
          </div>
        ))}

        {/* Tick marks */}
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0"
            style={{
              transform: `rotate(${i * 10}deg)`,
              transformOrigin: '0 128px',
              width: i % 9 === 0 ? '2px' : '1px',
              height: i % 9 === 0 ? '10px' : '5px',
              background: i % 9 === 0 ? 'rgba(74,74,166,0.4)' : 'rgba(74,74,166,0.15)',
              marginLeft: '-0.5px',
            }}
          />
        ))}

        {/* Qibla Arrow */}
        <motion.div
          className="absolute"
          style={{ transform: `rotate(${effectiveAngle}deg)` }}
          animate={!orientationSupported ? { rotate: [effectiveAngle - 2, effectiveAngle + 2, effectiveAngle - 2] } : {}}
          transition={{ type: 'tween', duration: 4, repeat: Infinity, ease: 'easeInOut' }}
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
        {deviceHeading !== null && (
          <p className="text-[10px] mt-1" style={{ color: 'rgba(74,74,166,0.7)' }}>
            Arah peranti: {Math.round(deviceHeading)}°
          </p>
        )}
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

      {/* Improved info card */}
      <div className="mt-3 rounded-xl p-3 w-full" style={{ background: 'rgba(42,42,106,0.3)', border: '1px solid rgba(74,74,166,0.08)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-3 w-3" style={{ color: '#4a4aa6' }} />
          <span className="text-[9px] font-semibold" style={{ color: '#4a4aa6' }}>Ketepatan JAKIM</span>
        </div>
        <p className="text-[10px]" style={{ color: 'rgba(204,204,204,0.35)' }}>
          * Arah kiblat adalah anggaran berdasarkan koordinat. Untuk ketepatan, rujuk kompas kiblat di masjid. Kaedah Syafie digunakan.
        </p>
      </div>
    </motion.div>
  )
}
