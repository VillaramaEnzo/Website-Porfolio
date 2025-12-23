'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { links } from '@/utils/text'
import getIcon from '@/utils/getIcon'
import { useRemix } from '@/context'

interface NavLink {
  href: string
  name: string
}

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  navLinks: NavLink[]
}

/**
 * Drawer Component
 * 
 * Expands upward from the nav card with glassmorphism effect.
 * Contains navigation links and social media links.
 */
export default function Drawer({ isOpen, onClose, navLinks }: DrawerProps) {
  const pathname = usePathname()
  const { isRemixing } = useRemix()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute left-0 right-0 bg-white/10 backdrop-blur-xl overflow-hidden border border-white/20"
          style={{ 
            bottom: 'calc(100% - 1px)',
            maxHeight: 'calc(100vh - 120px)', 
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '1rem',
            borderBottomLeftRadius: 0, 
            borderBottomRightRadius: 0,
          }}
        >
          <div className="px-6 py-6 border-b border-gray-300/50">
            {/* Navigation Links Section */}
            <div className="flex flex-col gap-3 mb-6">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-900'
                          : 'text-gray-700 hover:bg-gray-200/60 hover:text-gray-900'
                      }`}
                    >
                      {/* Icon/Thumbnail placeholder */}
                      <div className="w-12 h-12 bg-indigo-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-800 text-lg font-bold">
                          {link.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-base font-medium tracking-wide uppercase">
                        {link.name}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Social Links and Enable Fun Toggle */}
            <div className="pt-6 border-t border-gray-300/50">
              {/* Mobile: Stack vertically, Desktop: Horizontal row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Social Icons */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {links
                    .filter(link => {
                      // Hide TikTok in basic mode (when isRemixing is false)
                      if (link.icon === 'tiktok' && !isRemixing) {
                        return false
                      }
                      return true
                    })
                    .map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (navLinks.length * 0.08) + (index * 0.05) + 0.2, duration: 0.2 }}
                      className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-100 hover:bg-indigo-200 rounded-lg flex items-center justify-center text-indigo-700 transition-colors flex-shrink-0"
                      title={link.label}
                    >
                      {getIcon(link.icon, 'text-lg sm:text-xl')}
                    </motion.a>
                  ))}
                </div>

                {/* Placeholder for Theme Switch Button */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
