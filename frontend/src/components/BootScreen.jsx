import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const bootArt = [
  '  ===  =  =  =====  =====  =  =  =====  ====',
  '  =    =  =  =   =  =   =  == =  =   =  =   ',
  '  ===  ====  =====  =====  = ==  =   =  ===  ',
  '    =  =  =  =   =  =   =  =  =  =   =     = ',
  '  ===  =  =  =   =  =   =  =  =  =====  ==== ',
]

const bootLines = [
  { text: '', delay: 200 },
  ...bootArt.map(line => ({ text: '  ' + line, delay: 60, className: 'output-accent' })),
  { text: '', delay: 150 },
  { text: '  Booting ShaanOS v2.0...', delay: 400 },
  { text: '', delay: 100 },
  { text: '  [  OK  ] Loading kernel modules...', delay: 300 },
  { text: '  [  OK  ] Initializing terminal subsystem...', delay: 250 },
  { text: '  [  OK  ] Mounting portfolio filesystem...', delay: 350 },
  { text: '  [  OK  ] Starting Hyprland compositor...', delay: 200 },
  { text: '  [  OK  ] Loading glassmorphism shaders...', delay: 300 },
  { text: '  [  OK  ] Connecting to project database...', delay: 250 },
  { text: '  [  OK  ] Enabling matrix rain renderer...', delay: 200 },
  { text: '', delay: 100 },
  { text: '  * System ready. Welcome to ShaanOS.', delay: 400, className: 'output-success' },
  { text: '', delay: 200 },
]

export default function BootScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timeouts = []
    let totalDelay = 0

    bootLines.forEach((line, i) => {
      totalDelay += line.delay
      const t = setTimeout(() => {
        setVisibleLines(prev => [...prev, line])
        if (i === bootLines.length - 1) {
          const t2 = setTimeout(() => setDone(true), 600)
          timeouts.push(t2)
        }
      }, totalDelay)
      timeouts.push(t)
    })

    return () => timeouts.forEach(t => clearTimeout(t))
  }, [])

  useEffect(() => {
    if (done) {
      const t = setTimeout(onComplete, 400)
      return () => clearTimeout(t)
    }
  }, [done, onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="boot-screen"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {visibleLines.map((line, i) => (
            <motion.div
              key={i}
              className={`boot-line ${line.className || ''}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
            >
              {line.text}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
