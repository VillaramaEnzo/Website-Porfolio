'use client'

import { useState, useEffect } from 'react'

/**
 * Viewport Size Tooltip
 * 
 * Displays the current viewport dimensions in the bottom right corner.
 * Only shown in development mode unless explicitly enabled.
 */
export default function ViewportTooltip() {
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const [isMounted, setIsMounted] = useState(false)

  // Only show in development or if explicitly enabled
  const isEnabled = process.env.NODE_ENV === 'development' || 
    process.env.NEXT_PUBLIC_SHOW_VIEWPORT_TOOLTIP === 'true'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !isEnabled) return

    const updateViewportSize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    // Initial update
    updateViewportSize()

    // Update on resize
    window.addEventListener('resize', updateViewportSize)

    return () => {
      window.removeEventListener('resize', updateViewportSize)
    }
  }, [isMounted, isEnabled])

  if (!isMounted || !isEnabled) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-mono px-3 py-2 rounded pointer-events-none">
      {viewportSize.width} × {viewportSize.height}px
    </div>
  )
}

