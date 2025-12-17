'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ReactNode } from 'react'
import { components, fade } from '@/utils/animations'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        {...fade.fadeUp}
        transition={components.page.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

