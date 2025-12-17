"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useScrollContext } from '@/context/ScrollProvider'

interface BackToTopButtonProps {
  thresholdPercentage?: number
  className?: string
}

export default function BackToTopButton({ 
  thresholdPercentage = 20,
  className = ""
}: BackToTopButtonProps) {
  const { scrollY, scrollToTop } = useScrollContext()
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle mounting
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle scroll visibility
  useEffect(() => {
    if (!isMounted) return
    
    const threshold = (window.innerHeight * thresholdPercentage) / 100
    
    // Check initial state
    setIsVisible(scrollY.get() > threshold)
    
    // Subscribe to scroll changes
    const unsubscribe = scrollY.on('change', (value) => {
      setIsVisible(value > threshold)
    })

    return () => {
      unsubscribe()
    }
  }, [scrollY, thresholdPercentage, isMounted])

  if (!isMounted) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className={`fixed bottom-4 right-4 bg-black hover:bg-gray-800 text-white font-bold w-12 h-12 rounded-full shadow-lg z-50 flex items-center justify-center transition-colors ${className}`}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

