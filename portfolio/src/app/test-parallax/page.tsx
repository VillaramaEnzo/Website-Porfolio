'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useTransform, useMotionValueEvent, useMotionValue } from 'motion/react'
import { ScrollProvider, useScrollContext } from '@/context/ScrollProvider'
import { useParallax, useSectionParallax, useElementInView, useCrossSectionParallax } from '@/hooks/useParallax'

// Example 1: Section-level parallax
function ParallaxSection({ 
  index, 
  sectionRef 
}: { 
  index: number
  sectionRef?: (el: HTMLElement | null) => void 
}) {
  const progress = useSectionParallax(index, 0, 1)
  
  const y = useTransform(progress, [0, 1], [100, -100])
  const opacity = useTransform(progress, [0, 0.5, 1], [0, 1, 0.8])
  const scale = useTransform(progress, [0, 1], [0.9, 1])
  
  return (
    <section
      ref={sectionRef}
      className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden"
    >
      {/* Apply transforms to inner content, not the section itself */}
      <motion.div
        style={{ y, opacity, scale }}
        className="text-center w-full"
      >
        <h2 className="text-4xl font-bold mb-4">Section {index + 1}</h2>
        <p className="text-lg text-gray-600">Section-level parallax effect</p>
      </motion.div>
    </section>
  )
}

// Example 2: Component-level parallax within a section
function ParallaxCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const progress = useParallax(cardRef, 0, 1)
  
  const cardY = useTransform(progress, [0, 1], [50, -50])
  const imageY = useTransform(progress, [0, 1], [100, -100])
  const textOpacity = useTransform(progress, [0, 0.3, 0.7, 1], [0, 0, 1, 1])
  const rotate = useTransform(progress, [0, 1], [0, 5])
  
  return (
    <motion.div
      ref={cardRef}
      style={{ y: cardY, rotate }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-auto relative z-10"
    >
      <motion.div
        style={{ y: imageY }}
        className="w-full h-48 bg-gradient-to-r from-pink-400 to-red-400 rounded-lg mb-4"
      />
      <motion.p style={{ opacity: textOpacity }} className="text-gray-700">
        This card has multiple parallax layers:
        <br />• Card moves up/down
        <br />• Image moves faster
        <br />• Text fades in
      </motion.p>
    </motion.div>
  )
}

// Example 3: Cross-section parallax
function CrossSectionExample() {
  const triggerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)
  const progress = useCrossSectionParallax(triggerRef, targetRef, 0, 1)
  
  const scale = useTransform(progress, [0, 1], [0.5, 1.2])
  const rotate = useTransform(progress, [0, 1], [0, 360])
  const opacity = useTransform(progress, [0, 0.5, 1], [0, 1, 0.8])
  
  return (
    <>
      {/* Trigger Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-100 relative">
        <div ref={triggerRef} className="text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">Scroll Here</h2>
          <p className="text-lg text-gray-600">This section triggers the animation below</p>
        </div>
      </section>
      
      {/* Animated Section */}
      <section className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100 relative">
        <motion.div
          ref={targetRef}
          style={{ scale, rotate, opacity }}
          className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold relative z-10"
        >
          <span className="text-sm text-center px-2">Animated by<br/>Section Above</span>
        </motion.div>
      </section>
    </>
  )
}

// Example 4: Scroll-triggered visibility
function FadeInOnScroll({ delay = 0 }: { delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useElementInView(ref, 0.1)
  const [isInView, setIsInView] = useState(false)
  
  useMotionValueEvent(isVisible, 'change', (value) => {
    setIsInView(value)
  })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 50
      }}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-lg shadow-lg p-6 mb-4"
    >
      <h3 className="text-xl font-bold mb-2">Fade In on Scroll</h3>
      <p className="text-gray-600">This element fades in when it enters the viewport</p>
    </motion.div>
  )
}

// Example 5: Advanced custom parallax (page-based)
function CustomParallax() {
  const { scrollY, scrollYProgress } = useScrollContext()
  
  const parallaxY = useTransform(
    scrollY,
    [0, 2000],
    [0, -300]
  )
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1, 0.8, 0.8, 0.3]
  )
  
  const rotate = useTransform(
    scrollY,
    [0, 2000],
    [0, 180]
  )
  
  return (
    <motion.div
      style={{ y: parallaxY, opacity, rotate }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-center z-10"
    >
      Custom<br/>Parallax
    </motion.div>
  )
}

// Example 5b: Section-based custom parallax
function SectionCustomParallax({ sectionIndex }: { sectionIndex: number }) {
  const progress = useSectionParallax(sectionIndex, 0, 1)
  
  // Custom transforms based on section scroll progress (0-1)
  const parallaxY = useTransform(
    progress,
    [0, 1],
    [150, -150]  // Move up as section scrolls
  )
  
  const opacity = useTransform(
    progress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0.5]  // Fade in, then fade out slightly
  )
  
  const rotate = useTransform(
    progress,
    [0, 1],
    [0, 360]  // Full rotation as section scrolls
  )
  
  const scale = useTransform(
    progress,
    [0, 0.5, 1],
    [0.5, 1.2, 0.8]  // Scale up in middle, then down
  )
  
  return (
    <motion.div
      style={{ y: parallaxY, opacity, rotate, scale }}
      className="w-64 h-64 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-center relative z-10"
    >
      Section<br/>Custom<br/>Parallax
    </motion.div>
  )
}

// Example 5c: Multi-section parallax (spans multiple sections)
function MultiSectionParallax({ 
  startSectionIndex, 
  endSectionIndex 
}: { 
  startSectionIndex: number
  endSectionIndex: number 
}) {
  const { scrollY, sectionRefs, containerRef } = useScrollContext()
  const [scrollRange, setScrollRange] = useState<[number, number]>([0, 1000])
  const progress = useMotionValue(0)

  useEffect(() => {
    const updateRange = () => {
      const startSection = sectionRefs?.current?.[startSectionIndex]
      const endSection = sectionRefs?.current?.[endSectionIndex]
      
      if (!startSection || !endSection) {
        // Fallback: use window height as range if sections not ready
        const fallbackStart = window.innerHeight * startSectionIndex
        const fallbackEnd = window.innerHeight * (endSectionIndex + 1)
        setScrollRange([fallbackStart, fallbackEnd])
        return
      }

      // Start when first section enters viewport
      const start = containerRef?.current
        ? startSection.offsetTop
        : startSection.getBoundingClientRect().top + window.scrollY

      // End when second section exits viewport  
      const end = containerRef?.current
        ? endSection.offsetTop + endSection.offsetHeight
        : endSection.getBoundingClientRect().top + window.scrollY + endSection.offsetHeight

      setScrollRange([start, end])
    }

    // Initial update
    updateRange()

    // Update on resize and scroll
    const startSection = sectionRefs?.current?.[startSectionIndex]
    const endSection = sectionRefs?.current?.[endSectionIndex]
    
    const resizeObserver = new ResizeObserver(updateRange)
    if (startSection) resizeObserver.observe(startSection)
    if (endSection) resizeObserver.observe(endSection)

    const handleScroll = () => updateRange()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sectionRefs, startSectionIndex, endSectionIndex, containerRef, scrollY])

  // Create transform based on scroll range
  const transform = useTransform(scrollY, scrollRange, [0, 1], {
    clamp: true
  })

  // Update progress when transform changes
  useMotionValueEvent(transform, 'change', (value) => {
    progress.set(value)
  })

  // Custom transforms - make sure opacity starts visible for debugging
  const parallaxY = useTransform(progress, [0, 1], [200, -200])
  const rotate = useTransform(progress, [0, 1], [0, 720])
  const scale = useTransform(progress, [0, 0.5, 1], [0.5, 1.5, 0.7])
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [0.5, 1, 1, 0.5]) // Start visible

  return (
    <motion.div
      style={{ y: parallaxY, opacity, rotate, scale }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-center z-50 pointer-events-none"
    >
      Multi<br/>Section
    </motion.div>
  )
}

// Example 6: Staggered animations
function StaggeredCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progress = useParallax(containerRef, 0, 1)
  
  const cards = [0, 1, 2, 3]
  
  return (
    <div ref={containerRef} className="py-20 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Staggered Cards</h2>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, index) => {
          const cardProgress = useTransform(
            progress,
            [index * 0.2, (index * 0.2) + 0.3],
            [0, 1],
            { clamp: true }
          )
          
          const y = useTransform(cardProgress, [0, 1], [50, 0])
          const opacity = useTransform(cardProgress, [0, 1], [0, 1])
          const scale = useTransform(cardProgress, [0, 1], [0.8, 1])
          
          return (
            <motion.div
              key={card}
              style={{ y, opacity, scale }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="w-full h-32 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg mb-4" />
              <h3 className="text-xl font-bold mb-2">Card {card + 1}</h3>
              <p className="text-gray-600">Staggered animation effect</p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}


export default function TestParallaxPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const sectionNames = [
    'Section Parallax 1',
    'Section Parallax 2',
    'Component Parallax',
    'Fade In Examples',
    'Page Custom Parallax',
    'Section Custom Parallax',
    'Staggered Cards'
  ]

  return (
    <ScrollProvider sectionRefs={sectionRefs} sectionNames={sectionNames}>
      <div className="min-h-screen overflow-x-hidden">
        {/* Example 1: Section-level parallax */}
        <ParallaxSection 
          index={0} 
          sectionRef={(el) => { sectionRefs.current[0] = el }} 
        />

        <ParallaxSection 
          index={1} 
          sectionRef={(el) => { sectionRefs.current[1] = el }} 
        />

        {/* Example 2: Component-level parallax */}
        <section
          ref={(el) => { sectionRefs.current[2] = el }}
          className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 relative"
        >
          <ParallaxCard />
        </section>

        {/* Example 3: Cross-section parallax */}
        <CrossSectionExample />

        {/* Example 4: Scroll-triggered visibility */}
        <section
          ref={(el) => { sectionRefs.current[3] = el }}
          className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-100 to-gray-200"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Fade In on Scroll</h2>
            <FadeInOnScroll delay={0} />
            <FadeInOnScroll delay={0.1} />
            <FadeInOnScroll delay={0.2} />
            <FadeInOnScroll delay={0.3} />
          </div>
        </section>

        {/* Example 5: Advanced custom parallax */}
        {/* Example 5: Advanced custom parallax (page-based) */}
        <section
          ref={(el) => { sectionRefs.current[4] = el }}
          className="h-screen relative bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden"
        >
          <div className="h-full flex items-center justify-center">
            <div className="text-center z-10">
              <h2 className="text-4xl font-bold mb-4">Custom Parallax (Page-based)</h2>
              <p className="text-lg text-gray-600">Fixed element with custom scroll effects tied to overall page scroll</p>
            </div>
          </div>
          <CustomParallax />
        </section>

        {/* Example 5b: Section-based custom parallax */}
        <section
          ref={(el) => { sectionRefs.current[5] = el }}
          className="h-screen relative bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden flex items-center justify-center"
        >
          <div className="text-center mb-8 relative z-10">
            <h2 className="text-4xl font-bold mb-4">Custom Parallax (Section-based)</h2>
            <p className="text-lg text-gray-600">Element with custom effects tied to this section's scroll progress</p>
          </div>
          <SectionCustomParallax sectionIndex={5} />
        </section>

        {/* Example 6: Staggered animations */}
        <section
          ref={(el) => { sectionRefs.current[6] = el }}
          className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-100"
        >
          <StaggeredCards />
        </section>

        {/* Info Panel */}
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm max-w-xs z-50">
          <p className="font-bold mb-2">Parallax Test Page</p>
          <p className="text-xs text-gray-300">
            Scroll to see different parallax effects:
            <br />• Section parallax
            <br />• Component parallax
            <br />• Cross-section animation
            <br />• Fade-in on scroll
            <br />• Custom effects
            <br />• Staggered animations
          </p>
        </div>
      </div>
    </ScrollProvider>
  )
}

