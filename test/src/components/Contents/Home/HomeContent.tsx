'use client'
import { useRef } from 'react'
import { homeSections } from './homeConfig'
import { ScrollProvider, ScrollProviderProps } from '@/context/ScrollProvider'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const SectionNav = dynamic(() => import('@/components/Widgets/Navigation/SectionNav'), { 
  ssr: false,
  loading: () => null 
})

const BackToTopButton = dynamic(() => import('@/components/Widgets/Navigation/BackToTopButton'), { 
  ssr: false,
  loading: () => null 
})

export default function HomeContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  
  const sectionNames = homeSections.map(section => section.name)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="absolute inset-0"
    >
      <ScrollProvider 
        containerRef={containerRef} 
        sectionRefs={sectionRefs as ScrollProviderProps['sectionRefs']}
        sectionNames={sectionNames}
      >
        <div 
          className="relative h-screen overflow-y-scroll z-auto"
          ref={containerRef}
        >
          
          
          {homeSections.map((section, index) => (
            <section 
            key={section.name} 
            ref={(el) => { sectionRefs.current[index] = el }}
            className="relative"
            style={{ height: section.height }}
            >
              <section.component />
            </section>
          ))}
          
          <SectionNav/>
          <BackToTopButton thresholdPercentage={20} />
        
        </div>
      </ScrollProvider>
    </motion.div>
  )
}
