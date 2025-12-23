import { useState, useRef, useEffect, useCallback, type ReactElement } from 'react'
import { motion, useMotionValue, type MotionValue } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useScramble, useScrambleTransition } from '@/hooks'
import { useRemix } from '@/context'


// Easily adjustable scramble text width (viewport width percentage)
export const SCRAMBLE_TEXT_WIDTH_VW = 25 // Adjust this value to change width (e.g., 30 = 30vw, 50 = 50vw)

// Scrolling animation duration (lower = faster)
const SCROLL_DURATION = 15 // Adjust this to change scroll speed (lower = faster)

// Buffer segments to ensure seamless scrolling (extra segments beyond minimum needed)
const SEGMENT_BUFFER = 2

// Separator between repeated text instances for seamless looping
const TEXT_SEPARATOR = " • " // For plain text
const SCRAMBLE_SEPARATOR = " • " // For scramble text (full stop)

// Scrolling Scramble Text Component
export function ScrollingScrambleText({
  phrases,
  infinite,
  scrambleSpeed,
  transitionInterval,
  onTextChange,
}: {
  phrases: string[]
  infinite?: boolean
  scrambleSpeed?: number
  transitionInterval?: number
  onTextChange?: (text: string) => void
}): ReactElement {
  const { displayText } = useScramble(phrases, {
    infinite,
    scrambleSpeed,
    transitionInterval,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const segmentRef = useRef<HTMLSpanElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)
  const [segmentCount, setSegmentCount] = useState(4)

  // Notify parent of text changes
  useEffect(() => {
    if (onTextChange) {
      onTextChange(displayText)
    }
  }, [displayText, onTextChange])

  // Calculate dynamic segment count and scroll distance
  const calculateSegments = useCallback(() => {
    if (segmentRef.current && containerRef.current) {
      // Measure the width of one complete segment: displayText + separator
      const segmentWidth = segmentRef.current.offsetWidth
      if (segmentWidth > 0) {
        setScrollDistance(segmentWidth)

        // Get the parent container width (the div with the width style)
        const parentContainer = containerRef.current.parentElement
        const containerWidth = parentContainer?.offsetWidth || (window.innerWidth * SCRAMBLE_TEXT_WIDTH_VW / 100)
        
        // Calculate how many segments we need: (container width / segment width) + buffer
        // We need at least 2 segments for seamless scrolling, plus buffer for safety
        const minSegments = Math.ceil(containerWidth / segmentWidth) + SEGMENT_BUFFER
        setSegmentCount(Math.max(minSegments, 2)) // At least 2 segments
      }
    }
  }, [displayText])

  useEffect(() => {
    calculateSegments()
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateSegments)
    return () => window.removeEventListener('resize', calculateSegments)
  }, [calculateSegments])

  // Create one complete segment for measurement and display (using full stop separator)
  const segment = `${displayText}${SCRAMBLE_SEPARATOR}`

  return (
    <motion.div
      ref={containerRef}
      className="absolute whitespace-nowrap text-inherit"
      animate={{
        x: scrollDistance > 0 ? [0, -scrollDistance] : [0, 0],
      }}
      transition={{
        duration: SCROLL_DURATION,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {/* Measurement segment - positioned off-screen */}
      <span ref={segmentRef} className="absolute opacity-0 pointer-events-none">
        {segment}
      </span>
      {/* Repeating segments for seamless scrolling - dynamically calculated */}
      {Array.from({ length: segmentCount }, (_, i) => (
        <span key={i}>{segment}</span>
      ))}
    </motion.div>
  )
}

// Transition Component - Scrambles from current text to target text
export function ScrollingTransitionText({ 
  fromText, 
  toText,
  onComplete 
}: { 
  fromText: string
  toText: string
  onComplete: () => void
}): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const segmentRef = useRef<HTMLSpanElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)
  const [segmentCount, setSegmentCount] = useState(4)
  const { displayText } = useScrambleTransition(fromText, toText, onComplete)

  // Calculate dynamic segment count and scroll distance
  const calculateSegments = useCallback(() => {
    if (segmentRef.current && containerRef.current) {
      const segmentWidth = segmentRef.current.offsetWidth
      if (segmentWidth > 0) {
        setScrollDistance(segmentWidth)

        // Get the parent container width (the div with the width style)
        const parentContainer = containerRef.current.parentElement
        const containerWidth = parentContainer?.offsetWidth || (window.innerWidth * SCRAMBLE_TEXT_WIDTH_VW / 100)
        
        // Calculate how many segments we need: (container width / segment width) + buffer
        const minSegments = Math.ceil(containerWidth / segmentWidth) + SEGMENT_BUFFER
        setSegmentCount(Math.max(minSegments, 2)) // At least 2 segments
      }
    }
  }, [displayText])

  useEffect(() => {
    calculateSegments()
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateSegments)
    return () => window.removeEventListener('resize', calculateSegments)
  }, [calculateSegments])

  // Use comma separator for transition (since it's transitioning to plain text)
  const segment = `${displayText}${TEXT_SEPARATOR}`

  return (
    <motion.div
      ref={containerRef}
      className="absolute whitespace-nowrap text-inherit"
      animate={{
        x: scrollDistance > 0 ? [0, -scrollDistance] : [0, 0],
      }}
      transition={{
        duration: SCROLL_DURATION,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <span ref={segmentRef} className="absolute opacity-0 pointer-events-none">
        {segment}
      </span>
      {/* Repeating segments for seamless scrolling - dynamically calculated */}
      {Array.from({ length: segmentCount }, (_, i) => (
        <span key={i}>{segment}</span>
      ))}
    </motion.div>
  )
}

// Plain Scrolling Text Component (no scrambling)
export function ScrollingPlainText({ text }: { text: string }): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null)
  const segmentRef = useRef<HTMLSpanElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)
  const [segmentCount, setSegmentCount] = useState(4)

  // Calculate dynamic segment count and scroll distance
  const calculateSegments = useCallback(() => {
    if (segmentRef.current && containerRef.current) {
      // Measure the width of one complete segment: text + separator
      const segmentWidth = segmentRef.current.offsetWidth
      if (segmentWidth > 0) {
        setScrollDistance(segmentWidth)

        // Get the parent container width (the div with the width style)
        const parentContainer = containerRef.current.parentElement
        const containerWidth = parentContainer?.offsetWidth || (window.innerWidth * SCRAMBLE_TEXT_WIDTH_VW / 100)
        
        // Calculate how many segments we need: (container width / segment width) + buffer
        const minSegments = Math.ceil(containerWidth / segmentWidth) + SEGMENT_BUFFER
        setSegmentCount(Math.max(minSegments, 2)) // At least 2 segments
      }
    }
  }, [text])

  useEffect(() => {
    calculateSegments()
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateSegments)
    return () => window.removeEventListener('resize', calculateSegments)
  }, [calculateSegments])

  // Create one complete segment for measurement and display
  const segment = `${text}${TEXT_SEPARATOR}`

  return (
    <motion.div
      ref={containerRef}
      className="absolute whitespace-nowrap text-inherit"
      animate={{
        x: scrollDistance > 0 ? [0, -scrollDistance] : [0, 0],
      }}
      transition={{
        duration: SCROLL_DURATION,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {/* Measurement segment - positioned off-screen */}
      <span ref={segmentRef} className="absolute opacity-0 pointer-events-none">
        {segment}
      </span>
      {/* Repeating segments for seamless scrolling - dynamically calculated */}
      {Array.from({ length: segmentCount }, (_, i) => (
        <span key={i}>{segment}</span>
      ))}
    </motion.div>
  )
}

/**
 * useNav Hook
 * 
 * Manages all state and transition logic for the bottom navigation component.
 * Separates business logic from UI presentation.
 */
export function useNav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isRemixing, setIsRemixing } = useRemix() // Get remix mode from context
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionFromText, setTransitionFromText] = useState('')
  const [currentScrambleText, setCurrentScrambleText] = useState('')
  const [isRemixDrawerOpen, setIsRemixDrawerOpen] = useState(false)
  const [remixDrawerHeight, setRemixDrawerHeight] = useState(0)
  const prevIsRemixingRef = useRef(isRemixing)
  const currentScrambleTextRef = useRef('')
  const navRef = useRef<HTMLElement>(null)

  // Motion values for positioning
  const left = useMotionValue('50%')
  const x = useMotionValue('-50%')
  const y = useMotionValue(0) // For remix drawer reveal animation

  // Keep ref in sync with state
  useEffect(() => {
    currentScrambleTextRef.current = currentScrambleText
  }, [currentScrambleText])

  // Handle transition when toggling from ON to OFF
  useEffect(() => {
    if (prevIsRemixingRef.current === true && isRemixing === false) {
      // Toggling from ON to OFF - start transition
      // Capture the current scramble text at the moment of toggle (use ref to get latest value)
      const textToTransitionFrom = currentScrambleTextRef.current
      
      if (textToTransitionFrom && textToTransitionFrom.trim().length > 0) {
        setTransitionFromText(textToTransitionFrom)
        setIsTransitioning(true)
      } else {
        // If no scramble text, skip transition and go straight to plain text
        setIsTransitioning(false)
      }
    } else if (isRemixing === true) {
      // Toggling to ON - clear transition state
      setIsTransitioning(false)
      setTransitionFromText('')
    }
    prevIsRemixingRef.current = isRemixing
  }, [isRemixing])

  // Handle desktop/mobile positioning
  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 768 // md breakpoint
      
      if (desktop) {
        const lgDesktop = window.innerWidth >= 1024 // lg breakpoint
        left.set(lgDesktop ? '1.5rem' : '1rem')
        x.set('0px')
      } else {
        left.set('50%')
        x.set('-50%')
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [left, x])

  // Close remix drawer when remix mode is disabled
  useEffect(() => {
    if (!isRemixing) {
      setIsRemixDrawerOpen(false)
      setRemixDrawerHeight(0)
    }
  }, [isRemixing])

  // Update nav Y position when remix drawer opens/closes
  // Use smooth animation with spring physics for natural movement
  useEffect(() => {
    if (isRemixDrawerOpen && remixDrawerHeight > 0) {
      // Animate to negative height (move up)
      y.set(-remixDrawerHeight)
    } else if (!isRemixDrawerOpen) {
      // Animate back to 0 (original position) - animate smoothly with the drawer exit
      // Don't delay - let the spring animation handle it naturally
      y.set(0)
    }
  }, [isRemixDrawerOpen, remixDrawerHeight, y])

  // Close menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Close menu when clicking outside the nav
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    // Add event listener with a small delay to avoid immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  // Close menu when user actively scrolls (not from momentum)
  useEffect(() => {
    if (!isMenuOpen) return

    let isUserScrolling = false
    let scrollTimeout: NodeJS.Timeout

    // Track actual user input (wheel/touch)
    const handleWheel = () => {
      isUserScrolling = true
      clearTimeout(scrollTimeout)
      
      // Close menu after user scrolls
      scrollTimeout = setTimeout(() => {
        if (isUserScrolling) {
          setIsMenuOpen(false)
        }
        isUserScrolling = false
      }, 100)
    }

    const handleTouchStart = () => {
      isUserScrolling = true
    }

    const handleTouchEnd = () => {
      // Close menu if user was scrolling
      setTimeout(() => {
        if (isUserScrolling) {
          setIsMenuOpen(false)
        }
        isUserScrolling = false
      }, 100)
    }

    // Listen to actual user input, not scroll position changes
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMenuOpen])

  // Close remix drawer when clicking outside the nav
  useEffect(() => {
    if (!isRemixDrawerOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsRemixDrawerOpen(false)
      }
    }

    // Add event listener with a delay to ensure main drawer's handler is cleaned up first
    // Use longer delay if main drawer was just closed (during transition)
    const delay = isMenuOpen ? 500 : 100
    const timeoutId = setTimeout(() => {
      if (isRemixDrawerOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }
    }, delay)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isRemixDrawerOpen, isMenuOpen])

  // Close remix drawer when user actively scrolls (not from momentum)
  useEffect(() => {
    if (!isRemixDrawerOpen) return

    let isUserScrolling = false
    let scrollTimeout: NodeJS.Timeout

    const handleWheel = () => {
      isUserScrolling = true
      clearTimeout(scrollTimeout)
      
      // Close drawer after user scrolls
      scrollTimeout = setTimeout(() => {
        if (isUserScrolling) {
          setIsRemixDrawerOpen(false)
        }
        isUserScrolling = false
      }, 100)
    }

    const handleTouchStart = () => {
      isUserScrolling = true
    }

    const handleTouchEnd = () => {
      // Close drawer if user was scrolling
      setTimeout(() => {
        if (isUserScrolling) {
          setIsRemixDrawerOpen(false)
        }
        isUserScrolling = false
      }, 100)
    }

    // Listen to actual user input, not scroll position changes
    window.addEventListener('wheel', handleWheel, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      clearTimeout(scrollTimeout)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isRemixDrawerOpen])

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false)
    setTransitionFromText('')
  }, [])

  return {
    // State
    isMenuOpen,
    isRemixing,
    isTransitioning,
    transitionFromText,
    currentScrambleText,
    isRemixDrawerOpen,
    remixDrawerHeight,
    
    // Refs
    navRef,
    
    // Motion values
    left,
    x,
    y,
    
    // Handlers
    setIsMenuOpen,
    handleTransitionComplete,
    setCurrentScrambleText,
    setIsRemixDrawerOpen,
    setRemixDrawerHeight,
  }
}

