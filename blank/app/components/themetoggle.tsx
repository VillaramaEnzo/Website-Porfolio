'use client'

import getIcon from '../utils/getIcon'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center rounded-full hover:cursor-pointer hover:scale-150 transition-transform duration-200 pointer-events-auto"
      aria-label="Toggle theme"
    >
      {isDark
        ? getIcon('moon', 'text-2xl lg:text-3xl 2xl:text-4xl')
        : getIcon('sun', 'text-2xl lg:text-3xl 2xl:text-4xl')}
    </button>
  )
}
