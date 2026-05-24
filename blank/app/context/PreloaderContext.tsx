'use client'

import { createContext, type ReactNode, useContext, useEffect, useRef } from 'react'
import { usePreloader } from '../hooks/usePreloader'

interface PreloaderContextType {
  showPreloader: boolean
  setShowPreloader: (show: boolean) => void
  displayedTexts: string[]
  dots: string
  isFadingOut: boolean
  currentIndex: number
  isPreloaderDone: boolean
  setIsPreloaderDone: (done: boolean) => void
}

interface PreloaderProviderProps {
  children: ReactNode
  preloaderTexts: Array<{ text: string; duration: number }>
  shouldRunPreloader: boolean
}

const PreloaderContext = createContext<PreloaderContextType | null>(null)

export function PreloaderProvider({
  children,
  preloaderTexts,
  shouldRunPreloader,
}: PreloaderProviderProps) {
  const preloaderState = usePreloader(preloaderTexts)
  const hasInitiatedRef = useRef(false)

  useEffect(() => {
    if (hasInitiatedRef.current) return

    if (!shouldRunPreloader) {
      preloaderState.setShowPreloader(false)
      preloaderState.setIsPreloaderDone(true)
      hasInitiatedRef.current = true
      return
    }

    preloaderState.setShowPreloader(true)
    hasInitiatedRef.current = true
  }, [shouldRunPreloader, preloaderState])

  return <PreloaderContext.Provider value={preloaderState}>{children}</PreloaderContext.Provider>
}

export function usePreloaderContext() {
  const context = useContext(PreloaderContext)
  if (!context) {
    throw new Error('usePreloaderContext must be used within PreloaderProvider')
  }
  return context
}

export function useOptionalPreloaderContext() {
  return useContext(PreloaderContext)
}
