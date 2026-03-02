'use client'

import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light')

  // Initialize theme
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null

    if (stored) {
      setTimeout(() => {
        setTheme(stored)
      }, 100)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTimeout(() => {
        setTheme(prefersDark ? 'dark' : 'light')
      }, 100)
    }
  }, [])

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement

    // Remove all known theme classes (future-proof)
    root.classList.remove('light', 'dark')

    root.classList.add(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return {
    theme,
    setTheme,    // important for future themes
    toggleTheme,
    isDark: theme === 'dark',
  }
}
