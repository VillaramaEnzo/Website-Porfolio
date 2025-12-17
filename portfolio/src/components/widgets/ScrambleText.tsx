'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useScramble } from '@/hooks/useScramble'

interface ScrambleTextProps {
  phrases: string[]
  infinite?: boolean
  scrambleSpeed?: number
  className?: string
  onComplete?: () => void
  revealOnView?: boolean
  transitionInterval?: number
}

export default function ScrambleText(props: ScrambleTextProps) {
  const { displayText, ref, shouldShow } = useScramble(props.phrases, props)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref} 
        className={props.className}
        initial={{ opacity: 0 }}
        animate={{ opacity: shouldShow ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {shouldShow && displayText}
      </motion.div>
    </AnimatePresence>
  )
}

