'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import HamburgerMenu from '@/components/Navigation/HamburgerMenu'
import Drawer from '@/components/Navigation/Drawer'
import RemixDrawer from '@/components/Navigation/RemixDrawer'
import { 
  useNav, 
  ScrollingScrambleText, 
  ScrollingTransitionText, 
  ScrollingPlainText,
  SCRAMBLE_TEXT_WIDTH_VW 
} from '@/hooks'
import { phrases, DEFAULT_SCROLLING_TEXT } from '@/utils/text'


interface NavLink {
  href: string
  name: string
}

const navLinks: NavLink[] = [
  { href: '/', name: 'Home' },
  { href: '/projects', name: 'Projects' },
  { href: '/about', name: 'About' },
  { href: '/gallery', name: 'Gallery' },
]

/**
 * Bottom Navigation Component
 * 
 * Replicates the bottom nav design from itsjay.us:
 * - Dark card with rounded corners
 * - Avatar on left
 * - Name and description in center
 * - Hamburger menu on right
 * - Drawer expands upward from the nav card
 */
export default function Nav() {
  const {
    isMenuOpen,
    isRemixing,
    isTransitioning,
    transitionFromText,
    currentScrambleText,
    isRemixDrawerOpen,
    remixDrawerHeight,
    navRef,
    left,
    x,
    y,
    setIsMenuOpen,
    handleTransitionComplete,
    setCurrentScrambleText,
    setIsRemixDrawerOpen,
    setRemixDrawerHeight,
  } = useNav()

  return (
    <motion.nav 
      ref={navRef} 
      className="fixed bottom-4 z-[99]"
      style={{
        left,
        x,
        y,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        // Smooth transition for Y axis (remix drawer reveal)
        y: {
          type: 'spring',
          stiffness: 400,
          damping: 35,
          mass: 0.8,
        },
      }}
    >

      {/* Combined Nav + Drawer Container - One continuous block */}
      <div className="relative">
        {/* Drawer Content - Expands upward, absolutely positioned */}
        <Drawer 
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          navLinks={navLinks}
        />

        {/* Remix Drawer - Reveals from below, only in remix mode */}
        {isRemixing && (
          <RemixDrawer 
            isOpen={isRemixDrawerOpen}
            onClose={() => setIsRemixDrawerOpen(false)}
            onHeightChange={setRemixDrawerHeight}
          />
        )}

        {/* Main Nav Card - Always visible, fixed position */}
        <div 
          className="bg-indigo-50 px-4 py-3 md:px-6 md:py-4 flex items-center gap-4 md:gap-6 overflow-hidden"
          style={{
            borderTopLeftRadius: isMenuOpen ? 0 : '1rem',
            borderTopRightRadius: isMenuOpen ? 0 : '1rem',
            borderBottomLeftRadius: isRemixDrawerOpen ? 0 : '1rem',
            borderBottomRightRadius: isRemixDrawerOpen ? 0 : '1rem',
          }}
        >
            {/* Avatar with play button overlay */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden relative group">
                <Image
                  src="/images/IMG_0418.jpeg"
                  alt="Enzo Villarama"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 48px, 56px"
                />
                {/* Play button overlay - only shows on hover when remix mode is enabled */}
                {isRemixing && (
                  <div
                    className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out"
                    onClick={(e) => {
                      e.stopPropagation()
                      const newState = !isRemixDrawerOpen
                      // If main drawer is open and we want to open remix drawer,
                      // close main drawer first, then open remix drawer after animation
                      if (isMenuOpen && newState) {
                        setIsMenuOpen(false)
                        // Wait for main drawer close animation to complete
                        setTimeout(() => {
                          setIsRemixDrawerOpen(true)
                        }, 400) // Match the main drawer close animation duration
                      } else {
                        setIsRemixDrawerOpen(newState)
                      }
                    }}
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform duration-200 ease-in-out">
                      {/* Play icon - triangle pointing right */}
                      <svg
                        className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Name and Description */}
            <div className="flex-1 min-w-0">
              <h2 className="text-indigo-800 text-sm md:text-base font-semibold uppercase tracking-wider whitespace-nowrap truncate">
                Enzo Villarama
              </h2>
              {/* Scrolling text container - fixed size to prevent navbar resizing */}
              <div 
                className="text-indigo-600 text-xs md:text-sm uppercase tracking-wider mt-0.5 h-5 overflow-hidden relative"
                style={{ width: `${SCRAMBLE_TEXT_WIDTH_VW}vw` }}
              >
                {isTransitioning ? (
                  <ScrollingTransitionText
                    key={`transition-${transitionFromText}`}
                    fromText={transitionFromText}
                    toText={DEFAULT_SCROLLING_TEXT}
                    onComplete={handleTransitionComplete}
                  />
                ) : isRemixing ? (
                  <ScrollingScrambleText
                    phrases={phrases}
                    infinite={true}
                    scrambleSpeed={60}
                    transitionInterval={2000}
                    onTextChange={setCurrentScrambleText}
                  />
                ) : (
                  <ScrollingPlainText text={DEFAULT_SCROLLING_TEXT} />
                )}
              </div>
            </div>

            {/* Hamburger Menu - Dark variant for light background */}
            <div className="flex-shrink-0">
              <HamburgerMenu 
                navLinks={navLinks} 
                isOpen={isMenuOpen}
                onMenuToggle={(newState) => {
                  // If remix drawer is open and user wants to open primary drawer,
                  // close remix drawer first, then open primary drawer after animation
                  if (isRemixDrawerOpen && newState) {
                    setIsRemixDrawerOpen(false)
                    // Wait for remix drawer close animation to complete before opening primary drawer
                    setTimeout(() => {
                      setIsMenuOpen(true)
                    }, 500) // Match the drawer close animation duration
                  } else {
                    // Normal toggle behavior
                    setIsMenuOpen(newState)
                  }
                }} 
                color="black" 
              />
            </div>
          </div>
        </div>
      </motion.nav>
  )
}
