'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { useScrollLock } from '@/hooks/useScrollLock'
import Drawer from './Drawer'
import { components } from '@/utils/animations'

interface HamburgerMenuProps {
  navLinks: Array<{ href: string; name: string }>
  onMenuToggle?: (isOpen: boolean) => void
}

export default function HamburgerMenu({ navLinks, onMenuToggle }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  useScrollLock(isOpen)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onMenuToggle?.(newState)
  }

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        onClick={toggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-10 h-10 flex items-center justify-center focus:outline-none group"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <motion.span
          className="absolute w-3.5 h-0.5 bg-black rounded-full"
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : -4,
            x: isOpen ? 0 : (isHovered ? 0 : 5), // Center on hover, off-center to right when closed
          }}
          transition={components.hamburger.lineTransition}
        />
        <motion.span
          className="absolute w-3.5 h-0.5 bg-black rounded-full"
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : 4,
            x: isOpen ? 0 : (isHovered ? 0 : -5), // Center on hover, off-center to left when closed
          }}
          transition={components.hamburger.lineTransition}
        />
      </motion.button>

      {/* Portal drawer to document.body */}
      {mounted && createPortal(
        <Drawer isOpen={isOpen} onClose={toggle} navLinks={navLinks} />,
        document.body
      )}
    </>
  )
}
