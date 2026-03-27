'use client'

import getIcon from '../utils/getIcon'

interface ArrowProps {
  size?: string
  className?: string
  mailto?: string
}

export default function Arrow({ 
  size = 'text-6xl', 
  className = '',
  mailto = 'mailto:ienzovillarama@gmail.com'
}: ArrowProps) {
  return (
    <a
      href={mailto}
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
    </a>
  )
}
