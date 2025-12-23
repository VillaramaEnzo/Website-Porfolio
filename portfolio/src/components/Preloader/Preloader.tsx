'use client'
import { motion, AnimatePresence } from 'motion/react'
import { usePreloaderContext } from '@/context'
import MatrixRain from '@/components/widgets/MatrixRain'
import { components } from '@/utils/animations'

export default function Preloader() {
  const { 
    displayedTexts, 
    dots, 
    isFadingOut,
    showPreloader
  } = usePreloaderContext()

  if (!showPreloader) return null

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-white text-black pointer-events-none"
      initial="visible"
      animate={isFadingOut ? "hidden" : "visible"}
      variants={components.preloader.container}
    >
      {/* Mobile: Overlapping layout, Desktop: Side-by-side */}
      <div className="h-full flex relative">
        {/* Text - Full width on mobile (overlays), 30% on desktop (left side) */}
        <div className="flex flex-col w-full md:w-[30%] items-start justify-start px-6 md:px-12 py-4 z-10 relative md:relative">
          <AnimatePresence mode="sync">
            {displayedTexts.map((text, index) => (
              <motion.div 
                key={text}
                className="mb-1 text-base md:text-lg"
                {...components.preloader.text}
                transition={{
                  delay: index * 0.15,
                  ...components.preloader.text.transition
                }}
              >
                {text}
                {index === displayedTexts.length - 1 && (
                  <motion.span 
                    className="inline-block text-xl w-6 ml-1"
                    animate={components.preloader.dots}
                    transition={components.preloader.dots.transition}
                  >
                    {dots}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Matrix Rain - Full screen on mobile (behind text), 70% on desktop (right side) */}
        <div className="absolute inset-0 md:relative md:w-[70%] flex items-center justify-center md:z-0">
          <MatrixRain />
        </div>
      </div>
    </motion.div>
  )
}

