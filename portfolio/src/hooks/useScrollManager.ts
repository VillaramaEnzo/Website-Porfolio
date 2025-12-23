'use client'

import { useScrollContext } from '@/context'
import type Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Simple scroll management hook
 * Provides access to Lenis instance for scroll control
 */
export function useScrollManager() {
  const { lenis, scrollYMotion } = useScrollContext()

  const scrollTo = (
    target: number | string | HTMLElement,
    options?: Parameters<NonNullable<typeof lenis>['scrollTo']>[1]
  ) => {
    lenis?.scrollTo(target, options)
  }

  const scrollToTop = () => {
    if (!lenis) {
      console.warn('Lenis instance not available for scrollToTop')
      return
    }
    
    try {
      const duration = 1.4
      
      // Start smooth scroll to top
      // ScrollTrigger will automatically handle unpinning as we scroll backwards
      // through pinned sections, creating a natural "reverse" effect
      lenis.scrollTo(0, { 
        duration,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        immediate: false
      })
      
      // Continuously update ScrollTrigger during scroll animation
      // This ensures pinned sections unpin naturally as we scroll backwards
      let updateInterval: NodeJS.Timeout | null = null
      const startTime = Date.now()
      const updateDuration = duration * 1000 // Convert to ms
      
      const updateScrollTrigger = () => {
        const elapsed = Date.now() - startTime
        if (elapsed < updateDuration) {
          // Update ScrollTrigger so it can handle unpinning naturally
          ScrollTrigger.update()
          updateInterval = setTimeout(updateScrollTrigger, 16) // ~60fps updates
        } else {
          // Final refresh after scroll completes
          ScrollTrigger.refresh()
          if (updateInterval) clearTimeout(updateInterval)
        }
      }
      
      // Start updating ScrollTrigger during scroll
      updateScrollTrigger()
      
      // Fallback: ensure final refresh happens even if interval fails
      setTimeout(() => {
        ScrollTrigger.refresh()
        if (updateInterval) clearTimeout(updateInterval)
      }, updateDuration + 200)
    } catch (error) {
      console.error('Error scrolling to top:', error)
    }
  }

  return {
    lenis,
    scrollYMotion,
    scrollTo,
    scrollToTop,
  }
}
