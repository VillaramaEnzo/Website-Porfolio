'use client'

import { useRef } from 'react'
import { ScrollProvider } from '@/context/ScrollProvider'
import { homeSections } from './pageConfigs/homeConfig'
import BackToTopButton from '@/components/navigation/BackToTopButton'

export default function Home() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const sectionNames = homeSections.map(section => section.name)

  return (
    <ScrollProvider sectionRefs={sectionRefs} sectionNames={sectionNames}>
      <div className="min-h-screen">
        {homeSections.map((section, index) => {
          const SectionComponent = section.component
          // Sections start at the top of the screen (100vh/100vw)
          // Navbar overlays on top with z-index
          return (
            <section
              key={section.id}
              id={section.id}
              ref={(el) => { sectionRefs.current[index] = el }}
              className={`${section.height || 'h-screen'} flex items-center justify-center`}
            >
              <SectionComponent />
            </section>
          )
        })}
        
        <BackToTopButton thresholdPercentage={20} />
      </div>
    </ScrollProvider>
  )
}
