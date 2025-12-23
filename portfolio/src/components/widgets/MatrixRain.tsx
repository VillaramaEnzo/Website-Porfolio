'use client'

import { useRef } from 'react'
import { motion } from 'motion/react'
import { useMatrixRain } from '@/hooks'

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasSize = useMatrixRain(canvasRef, {
    speed: 33
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut"
      }}
      className="w-full h-full relative"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="absolute inset-0"
      />
    </motion.div>
  )
}

