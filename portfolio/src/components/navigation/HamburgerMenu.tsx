'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { useScrollLock, useScrollManager } from '@/hooks'
import { components } from '@/utils/animations'

interface HamburgerMenuProps {
  navLinks: Array<{ href: string; name: string }>
  isOpen?: boolean // Controlled prop
  onMenuToggle?: (isOpen: boolean) => void
  color?: 'black' | 'white' // Color variant for different backgrounds
}

export default function HamburgerMenu({ navLinks, isOpen = false, onMenuToggle, color = 'black' }: HamburgerMenuProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { lenis } = useScrollManager()
  
  useScrollLock(isOpen)

  const toggle = () => {
    // Stop Lenis immediately on click to prevent scroll interference
    if (lenis && !isOpen) {
      lenis.stop()
    }
    const newState = !isOpen
    onMenuToggle?.(newState)
  }
  
  // Stop Lenis on mouse down/touch start for even faster response
  const handlePointerDown = () => {
    if (lenis && !isOpen) {
      lenis.stop()
    }
  }

  return (
    <>
      {/* Hamburger Button */}
      <motion.button
        onClick={toggle}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-10 h-10 flex items-center justify-center focus:outline-none group"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <motion.span
          className={`absolute w-3.5 h-0.5 rounded-full ${color === 'white' ? 'bg-white' : 'bg-black'}`}
          animate={{
            rotate: isOpen ? -45 : 0,
            y: isOpen ? 0 : -4,
            x: isOpen ? 0 : (isHovered ? 0 : 5), // Center on hover, off-center to right when closed
          }}
          transition={components.hamburger.lineTransition}
        />
        <motion.span
          className={`absolute w-3.5 h-0.5 rounded-full ${color === 'white' ? 'bg-white' : 'bg-black'}`}
          animate={{
            rotate: isOpen ? 45 : 0,
            y: isOpen ? 0 : 4,
            x: isOpen ? 0 : (isHovered ? 0 : -5), // Center on hover, off-center to left when closed
          }}
          transition={components.hamburger.lineTransition}
        />
      </motion.button>

      {/* Drawer is now integrated into Nav component, no portal needed */}
    </>
  )
}
