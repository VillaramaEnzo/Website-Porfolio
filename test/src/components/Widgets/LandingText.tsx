'use client'
import { motion, AnimatePresence } from 'motion/react'
import { useAudience } from '@/context/AudienceProvider'
import { audienceTexts } from '@/utils/text'

const splitChars = [";", '.', ':']

const splitText = (text: string) => {
  const pattern = new RegExp(`([${splitChars.join('')}])`, 'g')
  return text.split(pattern).reduce((acc: string[], curr, i, arr) => {
    if (i % 2 === 0) {
      if (arr[i + 1]) {
        acc.push(curr + arr[i + 1])
      } else {
        if (curr.trim()) acc.push(curr)
      }
    }
    return acc
  }, [])
}

export default function LandingText() {
  const {
    scope,
    handleMouseEnter,
    handleMouseLeave,
    resumeAnimation,
    selectIndex,
    currentIndex,
    previousIndex,
    currentAudience
  } = useAudience()
  
  const currentText = audienceTexts[currentIndex % audienceTexts.length].text

  return (
    <div 
      ref={scope}
      className="flex flex-col w-[80%]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          className="mb-8 flex justify-between"
          initial={{ opacity: 0, y: -20}}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {audienceTexts.map((text, index) => (
            <motion.button
            key={text.audience}
            onClick={() => selectIndex(index)}
            onDoubleClick={resumeAnimation}
            className={`text-xs transition-colors hover:text-grey-600
                      ${currentAudience === text.audience 
                        ? 'font-bold text-blue-400' 
                        : 'text-gray-400'}`}
            whileHover={{ scale: 1.05 }}
            animate={currentAudience === text.audience ? {
              scale: [1, 1.05, 1],
              transition: { duration: 0.5 }
            } : {}}
          >
            {text.audience}
          </motion.button>
        ))}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentText}
          className="text-2xl font-normal leading-tight mb-8"
          initial={{ opacity: 0, x: currentIndex >= previousIndex ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: currentIndex >= previousIndex ? -20 : 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {splitText(currentText).map((part, index) => (
            <motion.p key={index}>
              {part}
            </motion.p>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
