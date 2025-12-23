'use client'

import { motion, AnimatePresence } from 'motion/react'

interface SlideTransitionProps {
  isTransitioning: boolean
  onComplete?: () => void
}

/**
 * Slide Transition Component
 * Slides down, covers screen, then slides up
 */
export default function SlideTransition({ 
  isTransitioning, 
  onComplete 
}: SlideTransitionProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isTransitioning && (
        <motion.div
          key="slide-overlay"
          className="fixed inset-0 bg-[#FAFAFA] z-[100] pointer-events-none"
          initial={{ y: '-100%' }}
          animate={{
            y: ['-100%', '0%', '0%', '100%']
          }}
          exit={{ y: '100%' }}
          transition={{
            duration: 1.0,
            times: [0, 0.25, 0.75, 1],
            ease: [0.4, 0, 0.2, 1]
          }}
        />
      )}
    </AnimatePresence>
  )
}

