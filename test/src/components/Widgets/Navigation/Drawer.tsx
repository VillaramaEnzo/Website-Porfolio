'use client'

import { useScrollLock } from '@/hooks/useScrollLock'
import { motion, AnimatePresence } from 'motion/react'
import Links from '@/components/Widgets/Header/Links'
import Link from 'next/link'


interface DrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  useScrollLock(isOpen)
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          />
          
          {/* Main Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed drawer flex flex-col justify-center items-center right-0 w-[30vw] z-[10000]"
          >
            <motion.button 
              onClick={onClose}
              className="absolute top-8 right-8 text-base uppercase tracking-wider"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              Close
            </motion.button>

            <div className="flex flex-col justify-center items-left">
              
              <Link href="/about" onClick={onClose}>About Me</Link> 
              <Link href="/projects" onClick={onClose}>Projects</Link> 
              <Link href="/blog" onClick={onClose}>Blog</Link> 
              <Link href="/contact" onClick={onClose}>Contact</Link>
              <Link href="/project:BLANK" onClick={onClose}>project:BLANK</Link> 

            </div>


            {/* Position Links at bottom right */}
            <div className="absolute bottom-4 left-8">
              <Links iconOnly={true}/>
            </div>
          
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 