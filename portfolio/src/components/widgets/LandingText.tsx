'use client'
import { motion, AnimatePresence } from 'motion/react'
import { useAudience } from '@/context/AudienceProvider'
import { audienceTexts } from '@/utils/text'
import { components } from '@/utils/animations'

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
      className="flex flex-col w-full md:w-[80%] px-4 md:px-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mobile: Multi-line wrap, Desktop: Single row */}
      <div className="mb-6 md:mb-8 flex flex-wrap md:flex-nowrap gap-3 md:gap-4">
          {audienceTexts.map((text, index) => (
            <motion.button
            key={text.audience}
            onClick={() => selectIndex(index)}
            onDoubleClick={resumeAnimation}
            className={`text-sm md:text-md py-0 md:py-0 transition-colors whitespace-nowrap touch-manipulation
                      ${currentAudience === text.audience 
                        ? 'font-bold text-blue-400' 
                        : 'text-gray-400 hover:text-gray-600'}`}
            whileHover={components.landingText.buttonHover}
            whileTap={components.landingText.buttonTap}
            animate={currentAudience === text.audience ? components.landingText.buttonActive : {}}
          >
            {text.audience}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentText}
          className="text-lg md:text-2xl font-normal leading-relaxed md:leading-tight mb-8 min-h-[5.5rem] md:min-h-[4rem]"
          {...components.landingText.textFade}
        >
          {splitText(currentText).map((part, index) => (
            <motion.p key={index} className="mb-2 md:mb-0">
              {part}
            </motion.p>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

