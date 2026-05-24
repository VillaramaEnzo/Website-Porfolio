'use client'

import Link from 'next/link'
import getIcon from '../utils/getIcon'
import { PORTFOLIO_PRELOADER_HANDOFF_KEY } from '../utils/preloader'

interface ArrowProps {
  size?: string
  className?: string
  href?: string
}

export default function Arrow({ 
  size = 'text-6xl', 
  className = '',
  href = '/portfolio'
}: ArrowProps) {
  const handleClick = () => {
    if (href !== '/portfolio' || typeof window === 'undefined') return
    sessionStorage.setItem(PORTFOLIO_PRELOADER_HANDOFF_KEY, 'true')
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`
        flex items-start 
        animate-breathe
        hover:animate-none
        hover:scale-125 
        transition-transform 
        duration-300 
        cursor-pointer
        ${className}
      `}
    >
      {getIcon('arrow-up-right', size)}
    </Link>
  )
}
