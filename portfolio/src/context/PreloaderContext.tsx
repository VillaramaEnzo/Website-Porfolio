'use client'

import { createContext, useContext, ReactNode, useEffect, useState, useRef } from 'react'
import { usePreloader } from '@/hooks/usePreloader'
import { usePage } from '@/context/PageContext'

interface PreloaderContextType {
  showPreloader: boolean
  setShowPreloader: (show: boolean) => void
  displayedTexts: string[]
  dots: string
  isFadingOut: boolean
  currentIndex: number
  isPreloaderDone: boolean
}

interface PreloaderProviderProps {
  children: ReactNode
  preloaderTexts: Array<{ text: string; duration: number }>
}

const PreloaderContext = createContext<PreloaderContextType | null>(null)

const PRELOADER_STORAGE_KEY = 'portfolio-preloader-shown'

// TESTING FLAG: Set to true to force preloader on every refresh
const FORCE_PRELOADER_ON_REFRESH = true

export function PreloaderProvider({ children, preloaderTexts }: PreloaderProviderProps) {
  const { currentPage } = usePage()
  const preloaderState = usePreloader(preloaderTexts)
  const [hasRunPreloader, setHasRunPreloader] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const hasInitiatedRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check if preloader should run
  const shouldRunPreloader = () => {
    if (!isMounted) return false

    // Only run on home page
    if (currentPage !== 'home') return false

    // TESTING: Force preloader on refresh if flag is enabled
    if (FORCE_PRELOADER_ON_REFRESH && typeof window !== 'undefined') {
      // Check if it's a refresh (no referrer or referrer is same origin)
      const isRefresh = !document.referrer || document.referrer.includes(window.location.origin)
      if (isRefresh) {
        return true
      }
    }

    // Check if it's already been shown (persisted in sessionStorage)
    if (typeof window !== 'undefined') {
      const hasShown = sessionStorage.getItem(PRELOADER_STORAGE_KEY) === 'true'
      if (hasShown && !FORCE_PRELOADER_ON_REFRESH) return false

      // Check if coming from another page (navigation, not refresh)
      if (document.referrer && document.referrer.includes(window.location.origin)) {
        return false
      }
    }

    // Check if it's already run in this session
    if (hasRunPreloader && !FORCE_PRELOADER_ON_REFRESH) return false

    return true
  }

  useEffect(() => {
    if (!isMounted) return

    // Prevent double initialization
    if (hasInitiatedRef.current) return

    const shouldRun = shouldRunPreloader()

    // Check if we should skip preloader
    if (!shouldRun) {
      const timer = setTimeout(() => {
        setHasRunPreloader(true)
        preloaderState.setShowPreloader(false)
        hasInitiatedRef.current = true
      }, 100)
      return () => clearTimeout(timer)
    }

    // If preloader should run, show it (only once)
    if (shouldRun && !preloaderState.showPreloader && !hasRunPreloader) {
      hasInitiatedRef.current = true
      preloaderState.setShowPreloader(true)
    }
  }, [isMounted, currentPage])

  // Separate effect to handle preloader completion
  useEffect(() => {
    if (preloaderState.isPreloaderDone && !hasRunPreloader) {
      setHasRunPreloader(true)
      // Persist in sessionStorage so it doesn't show again this session
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(PRELOADER_STORAGE_KEY, 'true')
      }
    }
  }, [preloaderState.isPreloaderDone, hasRunPreloader])

  return (
    <PreloaderContext.Provider value={preloaderState}>
      {children}
    </PreloaderContext.Provider>
  )
}

export function usePreloaderContext() {
  const context = useContext(PreloaderContext)
  if (!context) {
    throw new Error('usePreloaderContext must be used within PreloaderProvider')
  }
  return context
}

