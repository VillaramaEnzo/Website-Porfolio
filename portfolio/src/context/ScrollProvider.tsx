'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionValue, type MotionValue } from 'motion/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollContextValue {
  lenis: Lenis | null
  scrollYMotion: MotionValue<number>
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export const useScrollContext = () => {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScrollContext must be used within ScrollProvider')
  }
  return context
}

interface ScrollProviderProps {
  children: ReactNode
  options?: ConstructorParameters<typeof Lenis>[0]
}

export function ScrollProvider({ children, options }: ScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const scrollYMotion = useMotionValue(0)
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis
    const lenisInstance = new Lenis({
      smoothWheel: true,
      lerp: 0.1,
      ...options,
    })

    lenisRef.current = lenisInstance
    setLenis(lenisInstance)

    let scrollY = 0

    // RAF loop
    function raf(time: number) {
      lenisInstance.raf(time)
      rafIdRef.current = requestAnimationFrame(raf)
    }
    rafIdRef.current = requestAnimationFrame(raf)

    // Track scroll position for ScrollTrigger and MotionValues
    lenisInstance.on('scroll', ({ scroll }) => {
      scrollY = scroll
      scrollYMotion.set(scroll)
      ScrollTrigger.update()
    })

    // Proxy ScrollTrigger to Lenis
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        if (value !== undefined) {
          lenisInstance.scrollTo(value, { immediate: true })
        }
        return scrollY
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
      pinType: document.body.style.transform ? 'transform' : 'fixed',
    })

    // Initial refresh
    ScrollTrigger.refresh()

    // Recalculate height after content loads
    const resizeTimeout = setTimeout(() => {
      lenisInstance.resize()
      ScrollTrigger.refresh()
    }, 100)

    // Handle window resize
    const handleResize = () => {
      lenisInstance.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
      lenisInstance.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
      setLenis(null)
    }
  }, [options, scrollYMotion])

  return (
    <ScrollContext.Provider value={{ lenis, scrollYMotion }}>
      {children}
    </ScrollContext.Provider>
  )
}
