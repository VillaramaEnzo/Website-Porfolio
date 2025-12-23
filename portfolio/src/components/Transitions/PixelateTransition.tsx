'use client'

import Pixelate from './pixelate'

interface PixelateTransitionProps {
  isTransitioning: boolean
  onComplete?: () => void
}

/**
 * Pixelate Transition Component
 * Uses the pixelate component for page transitions
 */
export default function PixelateTransition({ 
  isTransitioning, 
  onComplete 
}: PixelateTransitionProps) {
  return (
    <Pixelate isActive={isTransitioning} onComplete={onComplete} />
  )
}

