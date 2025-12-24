"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValueEvent } from 'motion/react'
import { useScrollManager } from '@/hooks'

interface BackToTopButtonProps {
  thresholdPercentage?: number
  className?: string
}

export default function BackToTopButton({ 
  thresholdPercentage = 20,
  className = ""
}: BackToTopButtonProps) {
  const { scrollYMotion, scrollToTop } = useScrollManager()
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle scroll visibility
  useEffect(() => {
    if (!isMounted || !scrollYMotion) return
    
    const threshold = (window.innerHeight * thresholdPercentage) / 100
    
    // Check initial state
    setIsVisible(scrollYMotion.get() > threshold)
  }, [scrollYMotion, thresholdPercentage, isMounted])

  // Subscribe to scroll changes using Motion's hook (must be called unconditionally)
  useMotionValueEvent(scrollYMotion, 'change', (value) => {
    if (!isMounted || !scrollYMotion) return
    const threshold = (window.innerHeight * thresholdPercentage) / 100
    setIsVisible(value > threshold)
  })

  if (!isMounted) return null

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    scrollToTop()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleClick}
          className={`fixed bottom-4 right-4 bg-indigo-100/50 backdrop-blur-md hover:bg-indigo-100/70 text-indigo-900 font-semibold w-12 h-12 rounded-xl shadow-sm hover:shadow-md z-[101] flex items-center justify-center transition-colors ${className}`}
          aria-label="Back to top"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

