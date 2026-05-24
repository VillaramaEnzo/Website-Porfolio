'use client'

import { AnimatePresence, motion } from 'motion/react'
import { usePreloaderContext } from '@/app/context/PreloaderContext'
import MatrixRain from '@/app/components/widgets/MatrixRain'
import { components } from '@/app/utils/animations'

export default function Preloader() {
  const { displayedTexts, dots, isFadingOut, showPreloader } = usePreloaderContext()

  if (!showPreloader) return null

  return (
    <motion.div
      data-preloader-active="true"
      className="fixed inset-0 z-100 bg-white text-black pointer-events-none"
      initial="visible"
      animate={isFadingOut ? 'hidden' : 'visible'}
      variants={components.preloader.container}
    >
      <div className="relative flex h-full">
        <div className="relative z-10 flex w-full flex-col items-start justify-start px-6 py-4 md:relative md:w-[30%] md:px-12">
          <AnimatePresence mode="sync">
            {displayedTexts.map((text, index) => (
              <motion.div
                key={text}
                className="mb-1 text-base md:text-lg"
                {...components.preloader.text}
                transition={{
                  delay: index * 0.15,
                  ...components.preloader.text.transition,
                }}
              >
                {text}
                {index === displayedTexts.length - 1 && (
                  <motion.span
                    className="ml-1 inline-block w-6 text-xl"
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

        <div className="absolute inset-0 flex items-center justify-center md:relative md:w-[70%] md:z-0">
          <MatrixRain />
        </div>
      </div>
    </motion.div>
  )
}
