import { useEffect, useRef } from 'react'

const SHAKE_THRESHOLD = 30
const COOLDOWN_MS = 10000 // 10 second cooldown between triggers

export default function ShakeDetector() {
  const lastTrigger = useRef(0)
  const lastAccel = useRef({ x: 0, y: 0, z: 0 })

  useEffect(() => {
    // Only works on devices with accelerometer (mobile)
    if (!window.DeviceMotionEvent) return

    const handleMotion = (event) => {
      const accel = event.accelerationIncludingGravity
      if (!accel || accel.x === null) return

      const deltaX = Math.abs(accel.x - lastAccel.current.x)
      const deltaY = Math.abs(accel.y - lastAccel.current.y)
      const deltaZ = Math.abs(accel.z - lastAccel.current.z)

      lastAccel.current = { x: accel.x, y: accel.y, z: accel.z }

      const totalAccel = deltaX + deltaY + deltaZ

      if (totalAccel > SHAKE_THRESHOLD) {
        const now = Date.now()
        if (now - lastTrigger.current > COOLDOWN_MS) {
          lastTrigger.current = now
          // Rickroll!
          window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
        }
      }
    }

    // Request permission on iOS 13+
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      // Permission will be requested on first user interaction
      const requestOnInteraction = () => {
        DeviceMotionEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              window.addEventListener('devicemotion', handleMotion)
            }
          })
          .catch(() => {})
        window.removeEventListener('touchstart', requestOnInteraction)
      }
      window.addEventListener('touchstart', requestOnInteraction, { once: true })
    } else {
      window.addEventListener('devicemotion', handleMotion)
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion)
    }
  }, [])

  // This component renders nothing — it's purely a side-effect hook
  return null
}
