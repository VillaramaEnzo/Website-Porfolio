'use client'

import { motion, AnimatePresence } from 'motion/react'

interface ScaleTransitionProps {
  isTransitioning: boolean
  onComplete?: () => void
}

/**
 * Scale Transition Component
 * Scales from center
 */
export default function ScaleTransition({ 
  isTransitioning, 
  onComplete 
}: ScaleTransitionProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isTransitioning && (
        <motion.div
          key="scale-overlay"
          className="fixed inset-0 bg-[#FAFAFA] z-[100] pointer-events-none origin-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
    </AnimatePresence>
  )
}

