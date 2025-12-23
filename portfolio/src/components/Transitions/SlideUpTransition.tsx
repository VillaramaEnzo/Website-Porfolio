'use client'

interface SlideUpTransitionProps {
  isTransitioning: boolean
  onComplete?: () => void
}

/**
 * Slide Up Transition Component
 * New page slides up from below and covers the current page
 * Note: This transition doesn't use an overlay - the page content itself slides up
 */
export default function SlideUpTransition({ 
  isTransitioning, 
  onComplete 
}: SlideUpTransitionProps) {
  // For slideUp, we don't render an overlay - the page content itself animates
  // The onComplete callback is handled by the page content animation in the main component
  return null
}

