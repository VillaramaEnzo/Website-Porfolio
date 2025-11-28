'use client'

import { motion } from 'motion/react'
import { usePage } from '@/context/PageContext'

interface NavLink {
  id: 'home' | 'about' | 'projects' | 'contact'
  name: string
}

const navLinks: NavLink[] = [
  { id: 'home', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'projects', name: 'Projects' },
  { id: 'contact', name: 'Contact' },
]

export default function Nav() {
  const { currentPage, setCurrentPage } = usePage()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentPage('home')}
            className="text-xl font-light tracking-wider hover:opacity-70 transition-opacity"
          >
            Enzo Villarama
          </button>
          <div className="flex gap-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id
              return (
              <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                className="relative text-sm font-light tracking-wider transition-colors hover:text-gray-600"
              >
                  {link.name}
                  {isActive && (
                  <motion.div
                      layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
