'use client'

import { motion, useTransform } from 'motion/react'
import { useState, useEffect } from 'react'
import LandingText from '@/components/widgets/LandingText'
import { AudienceProvider } from '@/context/AudienceProvider'
import { useScrollContext } from '@/context/ScrollProvider'

/**
 * Landing Section Component
 * 
 * Wraps the LandingText widget with AudienceProvider context.
 * The section wrapper is handled by the page component.
 * 
 * Applies scroll-based shrinking effect to content as you scroll through the section.
 */
export default function LandingSection() {
  const { scrollY, sectionRefs } = useScrollContext()
  const [bounds, setBounds] = useState<[number, number]>([0, 1000])
  // Calculate bounds for section 0
  useEffect(() => {
    const updateBounds = () => {
      const section = sectionRefs?.current?.[0]
      if (!section) {
        // Fallback if section not ready
        const fallbackStart = 0
        const fallbackEnd = window.innerHeight
        setBounds([fallbackStart, fallbackEnd])
        return
      }

      // Use offsetTop for absolute position (doesn't change with scroll)
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const viewportHeight = window.innerHeight

      // Progress 0 = when section first becomes visible (scrollY = 0 or when section enters viewport)
      // Progress 1 = when section bottom reaches viewport top (section fully scrolled past)
      // 
      // If section starts at top (sectionTop = 0 or very small), start = 0
      // If section starts below (sectionTop > 0), start = when section top reaches viewport top
      const start = Math.max(0, sectionTop - viewportHeight)  // When section enters viewport, clamped to 0
      const end = sectionTop + sectionHeight - viewportHeight  // When section bottom reaches viewport top
      
      // Ensure end > start (if section is shorter than viewport, use section height as range)
      const finalEnd = Math.max(start + sectionHeight, end)

      setBounds([start, finalEnd])
    }

    updateBounds()

    // Update on scroll and resize
    window.addEventListener('scroll', updateBounds, { passive: true })
    window.addEventListener('resize', updateBounds, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateBounds)
      window.removeEventListener('resize', updateBounds)
    }
  }, [sectionRefs])

  // Create transform based on scroll range
  const transform = useTransform(scrollY, bounds, [0, 1], {
    clamp: true
  })

  // Shrinking effect: scale from 1 to 0.8 as you scroll through the section
  const scale = useTransform(transform, [0, 0.3], [1, 0.3])
  
  // Optional: fade out slightly as it shrinks
  const opacity = useTransform(transform, [0, 0.7, 1], [1, 1, 0.7])
  
  // Optional: move up slightly as it shrinks
  const y = useTransform(transform, [0, 1], [0, -50])
  
  return (
    <AudienceProvider>
      {/* Inner wrapper with transforms - takes up full section space */}
      <motion.div 
        initial={{ x: '-100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ scale, opacity, y}}
        className="flex flex-col items-center justify-center w-full h-full border-2 border-red-500"
      >
        <LandingText />
      </motion.div>
    </AudienceProvider>
  )
}

