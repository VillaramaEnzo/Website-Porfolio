'use client'
import { motion, AnimatePresence } from 'motion/react'
import { usePreloaderContext } from '@/context/PreloaderContext'
import MatrixRain from '@/components/Widgets/MatrixRain'

export default function Preloader() {
  const { 
    displayedTexts, 
    dots, 
    isFadingOut,
    showPreloader
  } = usePreloaderContext()

  if (!showPreloader) return null

  const containerVariants = {
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeInOut' }
    },
    hidden: {
      opacity: 0,
      transition: { duration: 0.5, ease: 'easeInOut' }
    }
  }

  const textVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.div 
      className="fixed inset-0 z-100 bg-white text-black pointer-events-none"
      initial="visible"
      animate={isFadingOut ? "hidden" : "visible"}
      variants={containerVariants}
    >
      <div className="h-full flex">
        <div className="flex flex-col w-[30%] items-start justify-start px-12 py-4 z-10">
          <AnimatePresence mode="sync">
            {displayedTexts.map((text, index) => (
              <motion.div 
                key={text}
                className="mb-1 text-lg"
                variants={textVariants}
                initial="initial"
                animate="animate"
                transition={{
                  delay: index * 0.15
                }}
              >
                {text}
                {index === displayedTexts.length - 1 && (
                  <motion.span 
                    className="inline-block text-xl w-6 ml-1"
                    animate={{ opacity: [0, 1] }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {dots}
                  </motion.span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center w-[70%]">
          <MatrixRain />
        </div>
      </div>
    </motion.div>
  )
}
