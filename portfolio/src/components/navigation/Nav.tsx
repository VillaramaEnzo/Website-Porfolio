'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import ScrambleText from '@/components/widgets/ScrambleText'
import HamburgerMenu from '@/components/navigation/HamburgerMenu'
import { phrases } from '@/utils/text'
import { components } from '@/utils/animations'

interface NavLink {
  href: string
  name: string
}

const navLinks: NavLink[] = [
  { href: '/', name: 'Home' },
  { href: '/projects', name: 'Projects' },
  { href: '/about', name: 'About' },
  { href: '/contact', name: 'Contact' },
]

// Flag to show hamburger menu on all screen sizes (for testing)
// Set to false to show hamburger only on mobile (< md breakpoint)
const SHOW_HAMBURGER_ALWAYS = true

export default function Nav() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* Navbar - Fixed, stable z-index, always visible */}
      <nav className="fixed top-0 left-0 right-0 z-50 pt-4 bg-white/0 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Scramble Text Row */}
          <motion.div 
            className="hidden md:block py-0.5 sm:py-1 overflow-x-auto"
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            transition={components.nav.fade}
          >
            <ScrambleText
              phrases={phrases}
              infinite={true}
              scrambleSpeed={60}
              className="text-xs text-[#AAA] tracking-wider whitespace-nowrap"
              transitionInterval={2000}
            />
          </motion.div>

          {/* Main Nav Row - Stable layout, no animations */}
          <div className="grid grid-cols-2 md:grid-cols-3 items-center pb-0.5 md:pb-1 gap-4">
            {/* Left Column: Name */}
            <motion.div 
              className="flex items-center"
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
              transition={components.nav.fade}
            >
              <Link
                href="/"
                className="text-lg sm:text-xl font-light tracking-wider text-gray-800 whitespace-nowrap hover:opacity-70"
              >
                Enzo Villarama
              </Link>
            </motion.div>

            {/* Center Column: Navigation Links - Hidden on mobile, visible on desktop */}
            <motion.div 
              className="hidden md:flex items-center justify-center gap-4 md:gap-5"
              animate={{ opacity: isMenuOpen ? 0 : 1 }}
              transition={components.nav.fade}
              style={{ pointerEvents: isMenuOpen ? 'none' : 'auto' }}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-sm font-light tracking-wider text-gray-800 whitespace-nowrap hover:text-gray-600"
                  >
                    {link.name}
                    {isActive && !isMenuOpen && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                        initial={false}
                        transition={components.nav.activeLinkTransition}
                      />
                    )}
                  </Link>
                )
              })}
            </motion.div>

            {/* Right Column: Hamburger Menu - Always visible, stays in place */}
            <div className="flex items-center justify-end md:justify-end">
              <HamburgerMenu navLinks={navLinks} onMenuToggle={setIsMenuOpen} />
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
