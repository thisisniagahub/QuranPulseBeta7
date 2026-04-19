'use client'

import { useState, useEffect } from 'react'

export function useQibla() {
  const [qiblaAngle] = useState(292.5)
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null)
  const [orientationSupported, setOrientationSupported] = useState(false)

  useEffect(() => {
    // Check for device orientation support
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // Use webkitCompassHeading for iOS, alpha for others
      const heading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ?? event.alpha
      if (heading !== null && heading !== undefined) {
        setDeviceHeading(heading)
        setOrientationSupported(true)
      }
    }

    // iOS 13+ requires permission
    const requestPermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as DeviceOrientationEvent & { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as DeviceOrientationEvent & { requestPermission: () => Promise<string> }).requestPermission()
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
          }
        } catch {
          // Permission denied
        }
      } else {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  // Calculate compass rotation: if we have device heading, offset the qibla arrow
  const compassRotation = deviceHeading !== null ? -deviceHeading : 0
  const effectiveAngle = qiblaAngle

  return {
    qiblaAngle,
    deviceHeading,
    orientationSupported,
    compassRotation,
    effectiveAngle,
  }
}
