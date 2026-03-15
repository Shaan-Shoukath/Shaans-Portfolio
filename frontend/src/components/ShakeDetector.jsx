import { useEffect, useRef } from 'react'
import axios from 'axios'
import config from '../config'

const SHAKE_THRESHOLD = 30
const COOLDOWN_MS = 10000 // 10 second cooldown between triggers

let cachedShakeAudioUrl = null
let audioFetched = false

export default function ShakeDetector() {
  const lastTrigger = useRef(0)
  const lastAccel = useRef({ x: 0, y: 0, z: 0 })
  const audioRef = useRef(null)

  // Fetch shake audio URL from backend
  useEffect(() => {
    if (!audioFetched) {
      audioFetched = true
      axios.get(`${config.apiUrl}/api/content`)
        .then(res => {
          if (res.data.shakeAudioUrl) {
            cachedShakeAudioUrl = res.data.shakeAudioUrl
          }
        })
        .catch(() => {})
    }
  }, [])

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

          if (cachedShakeAudioUrl) {
            // Play the admin-configured MP3
            try {
              if (audioRef.current) {
                audioRef.current.pause()
              }
              audioRef.current = new Audio(cachedShakeAudioUrl)
              audioRef.current.play().catch(() => {})
            } catch {
              // Audio playback failed silently
            }
          } else {
            // Fallback: rickroll if no audio configured
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')
          }
        }
      }
    }

    // Request permission on iOS 13+
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
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
