'use client'

import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useRef } from 'react'

interface RemixDrawerProps {
  isOpen: boolean
  onClose: () => void
  onHeightChange?: (height: number) => void
}

/**
 * RemixDrawer Component
 * 
 * Secret compartment drawer that reveals from below the nav card.
 * Only visible in remix mode when play button is pressed.
 * The nav moves up to reveal this drawer.
 */
export default function RemixDrawer({ isOpen, onClose, onHeightChange }: RemixDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Track height changes for nav positioning
  useEffect(() => {
    if (isOpen && drawerRef.current && onHeightChange) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const height = entry.contentRect.height
          if (height > 0) {
            onHeightChange(height)
          }
        }
      })
      
      resizeObserver.observe(drawerRef.current)
      
      // Set initial height
      const height = drawerRef.current.scrollHeight
      if (height > 0) {
        onHeightChange(height)
      }
      
      return () => {
        resizeObserver.disconnect()
      }
    } else if (!isOpen && onHeightChange) {
      // Delay the reset to allow exit animation to complete
      const timeoutId = setTimeout(() => {
        onHeightChange(0)
      }, 400) // Match animation duration
      
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen, onHeightChange])

  // Click-outside and scroll handlers are now managed in useNav.tsx for centralized control

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={drawerRef}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute left-0 right-0 bg-red-500 overflow-hidden border border-white/20"
          style={{ 
            top: 'calc(100% - 1px)',
            maxHeight: 'calc(100vh - 200px)', 
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
          }}
        >
          <div ref={contentRef} className="px-6 py-6">
            {/* Placeholder spacer to make drawer visible - takes up 40vh */}
            <div className="h-[40vh] w-full flex items-center justify-center bg-red-400/20 rounded-lg border-2 border-dashed border-red-300">
              <div className="text-center">
                <div className="text-white text-base font-medium mb-2">
                  Remix Drawer Content
                </div>
                <div className="text-white/80 text-sm">
                  Placeholder - 40vh height
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

