'use client'

import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'

export default function PageTransition() {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      className="fixed inset-0 bg-gray-100 z-[99999]"
      initial={{ y: '-100%' }}
      animate={{
        y: ['-100%', '0%', '0%', '100%']
      }}
      transition={{
        duration: 1.5,
        times: [0, 0.3, 0.7, 1],
        ease: "easeInOut"
      }}
    />
  )
} 