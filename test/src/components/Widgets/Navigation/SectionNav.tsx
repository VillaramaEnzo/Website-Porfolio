"use client"

import React, { useState, useMemo } from 'react'
import { useScrollContext } from '@/context/ScrollProvider'
import SectionIndicator from './SectionIndicator'
import { motion } from 'motion/react'
import { usePreloaderContext } from '@/context/PreloaderContext'
import { intitialFadeIn } from '@/utils/animations'


interface SectionNavProps {
  showMenu?: boolean
  showIndicator?: boolean
  spacing?: number // rem units
  activeLineWidth?: number // px units
  inactiveLineWidth?: number // px units
}

function Nav({ spacing = 2, activeLineWidth = 24, inactiveLineWidth = 20 }) {
  const {activeSection, scrollToSection, sectionNames } = useScrollContext();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate the maximum width needed based on the longest section name
  const maxWidth = useMemo(() => {
    const longestSection = sectionNames.reduce((longest, current) => 
      current.length > longest.length ? current : longest
    );
    // Approximate width calculation:
    // 0.5rem (letter width) * longest name length + activeLineWidth + padding + margins
    return `${Math.max(longestSection.length * 0.5 + (activeLineWidth/16) + 3)}rem`;
  }, [sectionNames, activeLineWidth]);

  return (
    <motion.nav
        initial={{opacity: 0, x: 100, y: '-50%' }}
        animate={{opacity: 1, x: 0, y: '-50%', transition: intitialFadeIn}}
        className={`fixed right-4 top-[30%]
                  flex flex-col items-end justify-between
                  transition-all duration-300 ease-in-out
                  ${isExpanded ? 'bg-white shadow-lg rounded-lg' : ''}`}
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
                                  ? 'font-bold text-blue-400' 
                                  : 'font-normal text-gray-600 hover:text-blue-400'}`}>
                {section}
              </span>
            )}
            <div
              style={{
                width: index === activeSection ? `${activeLineWidth}px` : `${inactiveLineWidth}px`
              }}
              className={`h-0.5 transition-all duration-200
                          ${index === activeSection ? 'bg-blue-400' : 'bg-gray-400'}`}
            />
          </div>
        </button>
      ))}
    </motion.nav>
  )
}


export default function SectionNav({
  showMenu = true, 
  showIndicator = true,
  spacing = 2, // default spacing in rem
  activeLineWidth = 30, // default active line width in px
  inactiveLineWidth = 20, // default inactive line width in px
}: SectionNavProps) {
  const { isPreloaderDone } = usePreloaderContext()

  return (
    <>
      {isPreloaderDone ? (
        <div className="z-50">
          {showMenu && (
            <Nav 
              spacing={spacing} 
              activeLineWidth={activeLineWidth} 
              inactiveLineWidth={inactiveLineWidth} 
            />
          )}
          {showIndicator && <SectionIndicator />}
        </div>
      ) : null}
    </>
  );
}

