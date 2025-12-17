'use client'

import { motion, AnimatePresence } from 'motion/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { links } from '@/utils/text'
import getIcon from '@/utils/getIcon'
import { components } from '@/utils/animations'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  navLinks: Array<{ href: string; name: string }>
}

export default function Drawer({ isOpen, onClose, navLinks }: DrawerProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#f7f7f7] z-[45]"
          {...components.drawer.panel}
        >
          {/* Content */}
          <div className="h-full flex flex-col overflow-y-auto">
            {/* Links Section */}
            <div className="flex-1 flex items-center justify-center px-8 py-12">
              <div className="w-full max-w-md">
                <motion.div
                  {...components.drawer.content}
                  className="flex flex-col gap-6"
                >
                  {/* Navigation Links - Mobile only */}
                  <div className="md:hidden flex flex-col gap-4 pb-6 border-b border-gray-200">
                    {navLinks.map((link, index) => {
                      const isActive = pathname === link.href
                      return (
                        <motion.div
                          key={link.href}
                          {...components.drawer.navLink(index)}
                        >
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className={`text-lg font-light tracking-wider transition-colors ${
                              isActive 
                                ? 'text-black font-bold' 
                                : 'text-gray-600 hover:text-black'
                            }`}
                          >
                            {link.name}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Social Links */}
                  {links.map((link, index) => (
                    <motion.div
                      key={link.href}
                      {...components.drawer.link(index)}
                    >
                      <Link
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="flex items-center gap-4 text-gray-600 hover:text-black transition-colors group"
                      >
                        <span className="text-2xl">{getIcon(link.icon, '')}</span>
                        <div className="flex flex-col">
                          <span className="text-lg font-light tracking-wider">{link.label}</span>
                          <span className="text-sm text-gray-500">{link.subtext}</span>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

