"use client"

import { useRef, RefObject, useEffect, useState } from 'react'
import { useTransform, MotionValue, useMotionValue, useMotionValueEvent } from 'motion/react'
import { useScrollContext } from '@/context'

/**
 * Hook for creating parallax effects on individual elements
 * Works with both window scroll and container scroll
 * 
 * @param elementRef - Reference to the element to track
 * @param offsetStart - When animation starts (0 = element enters viewport, 1 = element fully past viewport)
 * @param offsetEnd - When animation ends (0 = element enters viewport, 1 = element fully past viewport)
 * @returns MotionValue<number> - Progress from 0 to 1
 * 
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const progress = useParallax(ref, 0, 1) // Animate as element scrolls into view
 * 
 * return (
 *   <motion.div
 *     ref={ref}
 *     style={{ opacity: progress }}
 *   />
 * )
 * ```
 */
export function useParallax(
  elementRef: RefObject<HTMLElement>,
  offsetStart: number = 0,
  offsetEnd: number = 1
): MotionValue<number> {
  const { scrollY, containerRef } = useScrollContext()
  const [bounds, setBounds] = useState<[number, number]>([0, 1])
  const progress = useMotionValue(0)

  useEffect(() => {
    if (!elementRef?.current) {
      setBounds([0, 1])
      return
    }

    const updateBounds = () => {
      const element = elementRef.current
      if (!element) return

      const elementHeight = element.offsetHeight
      const viewportHeight = containerRef?.current
        ? containerRef.current.clientHeight
        : window.innerHeight

      const elementTop = containerRef?.current
        ? element.offsetTop
        : element.getBoundingClientRect().top + window.scrollY

      const start = elementTop - viewportHeight * offsetStart
      const end = elementTop + elementHeight - viewportHeight * offsetEnd

      setBounds([start, end])
    }

    updateBounds()

    // Update on resize
    const resizeObserver = new ResizeObserver(updateBounds)
    if (elementRef.current) {
      resizeObserver.observe(elementRef.current)
    }

    // Also update on scroll to handle dynamic positioning
    const handleScroll = () => {
      updateBounds()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [elementRef, containerRef, offsetStart, offsetEnd])

  // Always call useTransform at top level with current bounds
  const transform = useTransform(scrollY, bounds, [0, 1], {
    clamp: true
  })

  // Update progress when transform changes
  useMotionValueEvent(transform, 'change', (value) => {
    progress.set(value)
  })

  return progress
}

/**
 * Hook for creating parallax effects based on section scroll progress
 * 
 * @param sectionIndex - Index of the section to track
 * @param offsetStart - When animation starts (0-1)
 * @param offsetEnd - When animation ends (0-1)
 * @returns MotionValue<number> - Progress from 0 to 1
 * 
 * @example
 * ```tsx
 * const progress = useSectionParallax(0, 0, 1) // Track first section
 * 
 * return (
 *   <motion.div
 *     style={{ y: useTransform(progress, [0, 1], [0, -100]) }}
 *   />
 * )
 * ```
 */
export function useSectionParallax(
  sectionIndex: number,
  offsetStart: number = 0,
  offsetEnd: number = 1
): MotionValue<number> {
  const { scrollY, sectionRefs, containerRef } = useScrollContext()
  const [bounds, setBounds] = useState<[number, number]>([0, 1])
  const progress = useMotionValue(0)

  useEffect(() => {
    if (!sectionRefs?.current?.[sectionIndex]) {
      setBounds([0, 1])
      return
    }

    const updateBounds = () => {
      const section = sectionRefs.current?.[sectionIndex]
      if (!section) return

      const sectionHeight = section.offsetHeight
      const viewportHeight = containerRef?.current
        ? containerRef.current.clientHeight
        : window.innerHeight

      const sectionTop = containerRef?.current
        ? section.offsetTop
        : section.getBoundingClientRect().top + window.scrollY

      const start = sectionTop - viewportHeight * offsetStart
      const end = sectionTop + sectionHeight - viewportHeight * offsetEnd

      setBounds([start, end])
    }

    updateBounds()

    // Update on resize
    const resizeObserver = new ResizeObserver(updateBounds)
    if (sectionRefs.current[sectionIndex]) {
      resizeObserver.observe(sectionRefs.current[sectionIndex])
    }

    // Also update on scroll
    const handleScroll = () => {
      updateBounds()
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sectionRefs, sectionIndex, containerRef, offsetStart, offsetEnd])

  // Always call useTransform at top level
  const transform = useTransform(scrollY, bounds, [0, 1], {
    clamp: true
  })

  // Update progress when transform changes
  useMotionValueEvent(transform, 'change', (value) => {
    progress.set(value)
  })

  return progress
}

/**
 * Hook for checking if an element is in viewport
 * Useful for triggering animations when elements come into view
 * 
 * @param elementRef - Reference to the element to check
 * @param threshold - Percentage of element that must be visible (0-1)
 * @returns MotionValue<boolean> - True if element is in viewport
 * 
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const isVisible = useElementInView(ref, 0.1)
 * 
 * return (
 *   <motion.div
 *     ref={ref}
 *     animate={{ opacity: isVisible.get() ? 1 : 0 }}
 *   />
 * )
 * ```
 */
export function useElementInView(
  elementRef: RefObject<HTMLElement>,
  threshold: number = 0.1
): MotionValue<boolean> {
  const { scrollY, containerRef } = useScrollContext()
  const [elementInfo, setElementInfo] = useState<{
    height: number
    minVisible: number
    getTop: () => number
  } | null>(null)
  const isVisible = useMotionValue(false)

  useEffect(() => {
    if (!elementRef?.current) {
      setElementInfo(null)
      return
    }

    const element = elementRef.current
    const elementHeight = element.offsetHeight
    const viewportHeight = containerRef?.current
      ? containerRef.current.clientHeight
      : window.innerHeight

    const minVisible = elementHeight * threshold

    const getTop = () => {
      if (!elementRef.current) return 0
      return containerRef?.current
        ? elementRef.current.offsetTop
        : elementRef.current.getBoundingClientRect().top + window.scrollY
    }

    setElementInfo({
      height: elementHeight,
      minVisible,
      getTop
    })

    // Update on resize
    const resizeObserver = new ResizeObserver(() => {
      if (!elementRef.current) return
      setElementInfo({
        height: elementRef.current.offsetHeight,
        minVisible: elementRef.current.offsetHeight * threshold,
        getTop
      })
    })
    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [elementRef, containerRef, threshold])

  // Always call useTransform at top level
  const transform = useTransform(scrollY, (scrollPos) => {
    if (!elementInfo) return false

    const elementTop = elementInfo.getTop()
    const elementBottom = elementTop + elementInfo.height
    const viewportHeight = containerRef?.current
      ? containerRef.current.clientHeight
      : window.innerHeight
    const viewportTop = scrollPos
    const viewportBottom = scrollPos + viewportHeight

    const visibleTop = Math.max(elementTop, viewportTop)
    const visibleBottom = Math.min(elementBottom, viewportBottom)
    const visibleHeight = Math.max(0, visibleBottom - visibleTop)

    return visibleHeight >= elementInfo.minVisible
  })

  // Update isVisible when transform changes
  useMotionValueEvent(transform, 'change', (value) => {
    isVisible.set(value)
  })

  return isVisible
}

/**
 * Hook for creating parallax effects triggered by a different element's scroll position
 * Useful for cross-section animations
 * 
 * @param triggerRef - Reference to the element that triggers the animation
 * @param targetRef - Reference to the element to animate (optional, defaults to triggerRef)
 * @param offsetStart - When animation starts (0-1)
 * @param offsetEnd - When animation ends (0-1)
 * @returns MotionValue<number> - Progress from 0 to 1
 * 
 * @example
 * ```tsx
 * const triggerRef = useRef<HTMLDivElement>(null) // Element in section 1
 * const targetRef = useRef<HTMLDivElement>(null) // Element in section 2
 * const progress = useCrossSectionParallax(triggerRef, targetRef)
 * 
 * return (
 *   <>
 *     <div ref={triggerRef}>Section 1</div>
 *     <motion.div
 *       ref={targetRef}
 *       style={{ opacity: progress }}
 *     >
 *       Animated by Section 1's scroll
 *     </motion.div>
 *   </>
 * )
 * ```
 */
export function useCrossSectionParallax(
  triggerRef: RefObject<HTMLElement>,
  targetRef?: RefObject<HTMLElement>,
  offsetStart: number = 0,
  offsetEnd: number = 1
): MotionValue<number> {
  // Use trigger element for scroll calculation
  return useParallax(triggerRef, offsetStart, offsetEnd)
}
