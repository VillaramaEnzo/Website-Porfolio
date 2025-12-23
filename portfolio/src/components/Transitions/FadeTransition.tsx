'use client'

import { motion, AnimatePresence } from 'motion/react'

interface FadeTransitionProps {
  isTransitioning: boolean
  onComplete?: () => void
}

/**
 * Fade Transition Component
 * Simple fade in/out
 */
export default function FadeTransition({ 
  isTransitioning, 
  onComplete 
}: FadeTransitionProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isTransitioning && (
        <motion.div
          key="fade-overlay"
          className="fixed inset-0 bg-[#FAFAFA] z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      )}
    </AnimatePresence>
  )
}

