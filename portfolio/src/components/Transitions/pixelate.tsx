'use client'

/* 
TODO: Fix this component
It's not working as intended
Is Broken 
*/ 

import { motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

const anim = {
  initial: { opacity: 0 },
  open: (i: number) => ({
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
      delay: i * 0.02, // Increased delay multiplier for more visible stagger
    },
  }),
  closed: (i: number) => ({
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
      delay: i * 0.02,
    },
  }),
}

const shuffle = (array: number[]): number[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface PixelateProps {
  isActive: boolean
  onComplete?: () => void
  blockSizeFactor?: number // Configurable block size (default: 0.015 = 1.5% of viewport width)
}

export default function Pixelate({ isActive, onComplete, blockSizeFactor = 0.015 }: PixelateProps) {
  const [dimensions, setDimensions] = useState<{
    blockSize: number
    columns: number
    rows: number
    maxDelay: number
  } | null>(null)

  // Calculate dimensions when component becomes active
  useEffect(() => {
    if (isActive && typeof window !== 'undefined' && !dimensions) {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const block = Math.max(4, vw * blockSizeFactor)
      const cols = Math.ceil(vw / block)
      const rs = Math.ceil(vh / block)
      const maxD = rs * 0.02 + 0.3 // Match delay multiplier (0.02) + duration (0.3)
      setDimensions({ blockSize: block, columns: cols, rows: rs, maxDelay: maxD })
    }
    if (!isActive) {
      setDimensions(null)
    }
  }, [isActive, blockSizeFactor, dimensions])

  // Precompute delays per column - only when dimensions are set
  const columnDelays = useMemo(() => {
    if (!dimensions || dimensions.columns === 0 || dimensions.rows === 0) return []
    return [...Array(dimensions.columns)].map(() => 
      shuffle([...Array(dimensions.rows)].map((_, i) => i))
    )
  }, [dimensions])

  // Call onComplete after animation finishes
  useEffect(() => {
    if (isActive && onComplete && dimensions && dimensions.maxDelay > 0) {
      const totalDuration = dimensions.maxDelay * 1000 // ms (already includes duration)
      const timer = setTimeout(onComplete, totalDuration)
      return () => clearTimeout(timer)
    }
  }, [isActive, dimensions, onComplete])

  // Don't render until we have valid dimensions
  if (!isActive || !dimensions || dimensions.columns === 0 || dimensions.rows === 0 || columnDelays.length === 0) {
    return null
  }

  const { blockSize } = dimensions

  return (
    <div className="fixed inset-0 z-[100] flex overflow-hidden pointer-events-none">
      {columnDelays.map((delays, colIdx) => (
        <div
          key={colIdx}
          className="h-full flex flex-col"
          style={{ width: `${blockSize}px` }}
        >
          {delays.map((randomDelay, rowIdx) => (
            <motion.div
              key={`${colIdx}-${rowIdx}`}
              variants={anim}
              initial="initial"
              animate="open"
              className="w-full bg-[#FAFAFA]"
              style={{ height: `${blockSize}px`, flexShrink: 0 }}
              custom={randomDelay}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
