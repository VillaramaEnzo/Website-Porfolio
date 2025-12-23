'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { SlideTransition, FadeTransition, ScaleTransition, SlideUpTransition, PixelateTransition } from '.'

export type TransitionType = 'slide' | 'pixelate' | 'fade' | 'scale' | 'slideUp'

interface PageTransitionProps {
  children: ReactNode
  shouldSkipTransition?: boolean
  transitionType?: TransitionType // Specify which transition to use
}

export default function PageTransition({ 
  children, 
  shouldSkipTransition = false,
  transitionType = 'slideUp'
}: PageTransitionProps) {
  const pathname = usePathname()
  const prevPathname = useRef<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(true)
  const isInitialMount = useRef(true)
  const transitionCompleteRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Skip transition if explicitly told to (home page with preloader)
    if (shouldSkipTransition) {
      isInitialMount.current = false
      prevPathname.current = pathname
      return
    }

    // On initial mount, check if we should show transition
    if (isInitialMount.current) {
      isInitialMount.current = false
      // If it's home page on initial mount, don't transition (preloader will show)
      // If it's any other page on initial mount (refresh), show transition
      if (pathname === '/') {
        prevPathname.current = pathname
        return
      } else {
        // Refresh on non-home page - show transition
        setIsTransitioning(true)
        setDisplayChildren(false) // Start with children hidden
        
        // For pixelate and slideUp, start animation immediately
        if (transitionType === 'pixelate' || transitionType === 'slideUp') {
          // Use double requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              // For pixelate, keep children hidden until animation completes
              // For slideUp, show children immediately
              if (transitionType !== 'pixelate') {
                setDisplayChildren(true)
              }
            })
          })
          
          // For pixelate, use longer duration (calculated in component, ~2-3s)
          // For slideUp, use 600ms
          const duration = transitionType === 'pixelate' ? 3000 : 600
          
          const timer = setTimeout(() => {
            prevPathname.current = pathname
            // For pixelate, show new content after animation
            if (transitionType === 'pixelate') {
              setDisplayChildren(true)
            }
            setIsTransitioning(false)
          }, duration)
          
          return () => clearTimeout(timer)
        } else {
          // For other transitions, use the overlay approach
          setDisplayChildren(false)
          
          const timer1 = setTimeout(() => {
            prevPathname.current = pathname
            setDisplayChildren(true)
          }, 500)

          const timer2 = setTimeout(() => {
            setIsTransitioning(false)
          }, 1000)

          return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
          }
        }
      }
    }

    // Only trigger if pathname actually changed
    if (prevPathname.current === pathname) {
      return
    }

    // Route change - start transition
    setIsTransitioning(true)
    setDisplayChildren(false) // Keep children hidden initially

    // For pixelate and slideUp, start animation immediately without delay
    if (transitionType === 'pixelate' || transitionType === 'slideUp') {
      // Use double requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // For pixelate, keep children hidden until animation completes
          // For slideUp, show children immediately
          if (transitionType !== 'pixelate') {
            setDisplayChildren(true)
          }
        })
      })
      
      // For pixelate, use longer duration (calculated in component, ~2-3s)
      // For slideUp, use 600ms
      const duration = transitionType === 'pixelate' ? 3000 : 600
      
      const timer = setTimeout(() => {
        prevPathname.current = pathname
        // For pixelate, show new content after animation
        if (transitionType === 'pixelate') {
          setDisplayChildren(true)
        }
        setIsTransitioning(false)
      }, duration)
      
      return () => clearTimeout(timer)
    } else {
      // For other transitions, use the overlay approach with delay
      setDisplayChildren(false)

      const timer1 = setTimeout(() => {
        prevPathname.current = pathname
        setDisplayChildren(true)
      }, 500)

      const timer2 = setTimeout(() => {
        setIsTransitioning(false)
      }, 1000)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [pathname, shouldSkipTransition, transitionType])

  // Handle transition completion callback
  const handleTransitionComplete = () => {
    // This can be used for cleanup or additional logic
  }

  // Render the selected transition type
  const renderTransition = () => {
    switch (transitionType) {
      case 'pixelate':
        return (
          <PixelateTransition 
            isTransitioning={isTransitioning} 
            onComplete={handleTransitionComplete}
          />
        )
      case 'fade':
        return (
          <FadeTransition 
            isTransitioning={isTransitioning} 
            onComplete={handleTransitionComplete}
          />
        )
      case 'scale':
        return (
          <ScaleTransition 
            isTransitioning={isTransitioning} 
            onComplete={handleTransitionComplete}
          />
        )
      case 'slideUp':
        return (
          <SlideUpTransition 
            isTransitioning={isTransitioning} 
            onComplete={handleTransitionComplete}
          />
        )
      case 'slide':
      default:
        return (
          <SlideTransition 
            isTransitioning={isTransitioning} 
            onComplete={handleTransitionComplete}
          />
        )
    }
  }

  return (
    <>
      {/* Transition overlay - type determined by transitionType prop */}
      {renderTransition()}

      {/* Page content - only shows when not transitioning or after transition starts */}
      {displayChildren && (
        <motion.div
          key={pathname}
          initial={
            isTransitioning && transitionType === 'slideUp'
              ? { y: '100vh' }
              : isTransitioning
              ? { opacity: 0 }
              : false
          }
          animate={
            transitionType === 'slideUp'
              ? { y: 0 }
              : { opacity: 1 }
          }
          transition={
            transitionType === 'slideUp'
              ? { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
              : { duration: 0.4, ease: 'easeOut' }
          }
          className={transitionType === 'slideUp' ? 'relative z-[1] bg-[#FAFAFA]' : ''}
          onAnimationComplete={() => {
            if (transitionType === 'slideUp' && isTransitioning) {
              handleTransitionComplete()
            }
          }}
        >
          {children}
        </motion.div>
      )}
    </>
  )
}
