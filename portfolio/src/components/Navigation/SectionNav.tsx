"use client"

import { motion } from 'motion/react'
import { useSectionNav } from '@/hooks'

// Placeholder section names
const PLACEHOLDER_SECTIONS = [
  'Home',
  'About',
  'Projects',
  'Experience',
  'Contact'
]

interface SectionNavProps {
  spacing?: number // rem units
  activeLineWidth?: number // px units
  inactiveLineWidth?: number // px units
  sectionNames?: string[] // Optional: override placeholder sections
}

export default function SectionNav({
  spacing = 2,
  activeLineWidth = 30,
  inactiveLineWidth = 20,
  sectionNames = PLACEHOLDER_SECTIONS,
}: SectionNavProps) {
  const {
    activeSection,
    isExpanded,
    maxWidth,
    scrollToSection,
    setIsExpanded,
  } = useSectionNav({
    sectionNames,
    activeLineWidth,
  })

  return (
    <motion.nav
      initial={{ opacity: 0, x: 100, y: '-50%' }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: '-50%', 
        transition: { 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.2
        } 
      }}
      className={`fixed right-4 top-[50%] z-[99]
                flex flex-col items-end justify-between
                transition-all duration-300 ease-in-out
                ${isExpanded ? 'bg-indigo-100/50 backdrop-blur-md rounded-lg' : ''}`}
      style={{ 
        height: isExpanded 
          ? `${sectionNames.length * (spacing + 0.5)}rem` 
          : `${sectionNames.length * spacing}rem`,
        width: isExpanded ? maxWidth : 'auto',
        gap: `${spacing/4}rem`,
        paddingRight: isExpanded ? '0.75rem' : '0',
        paddingLeft: isExpanded ? '0.75rem' : '0',
        paddingTop: isExpanded ? '0.5rem' : '0',
        paddingBottom: isExpanded ? '0.5rem' : '0',
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {sectionNames.map((section, index) => (
        <button
          key={index}
          className={`flex items-center justify-end space-x-2 focus:outline-none
                      transition-all duration-200 ease-in-out
                      h-8 ${isExpanded ? 'w-full hover:bg-gray-100 rounded-md px-2' : ''}`}
          onClick={() => scrollToSection(index)}
        >
          <div className="flex items-center justify-end space-x-2">
            {isExpanded && (
              <span className={`text-sm mr-4 transition-all duration-200
                                ${index === activeSection 
                                  ? 'font-bold text-indigo-800' 
                                  : 'font-normal text-gray-600 hover:text-indigo-400'}`}>
                {section}
              </span>
            )}
            <div
              style={{
                width: index === activeSection ? `${activeLineWidth}px` : `${inactiveLineWidth}px`
              }}
              className={`h-0.5 transition-all duration-200
                          ${index === activeSection ? 'bg-indigo-800' : 'bg-gray-400'}`}
            />
          </div>
        </button>
      ))}
    </motion.nav>
  )
}

