"use client"

import { useRef } from 'react'
import { projectsSections } from './projectsConfig'
import { ScrollProvider, ScrollProviderProps } from '@/context/ScrollProvider'


export default function ProjectsContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  const sectionNames = projectsSections.map(section => section.name)

  return (
    <ScrollProvider 
      containerRef={containerRef} 
      sectionRefs={sectionRefs as ScrollProviderProps['sectionRefs']}
      sectionNames={sectionNames}
    >
      <div 
        ref={containerRef} 
        className="h-screen overflow-y-scroll
        scrollbar-hide scroll-smooth relative
        webkit-overflow-scrolling-touch border
        "
      >
        {projectsSections.map((section, index) => (
          <section 
            key={section.name}
            ref={(el) => { sectionRefs.current[index] = el }}
            className="relative"
            style={{ height: section.height }}
          >
              <section.component/>
          </section>
        ))}
      </div>
    </ScrollProvider>
  );
}
