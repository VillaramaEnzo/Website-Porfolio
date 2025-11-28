'use client'
import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { usePreloader } from '@/hooks/usePreloader'
import { usePathname } from 'next/navigation'

// Define routes that should show preloader
export const PRELOADER_ROUTES = ['/']; // Add routes as needed

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

export function PreloaderProvider({ children, preloaderTexts }: PreloaderProviderProps) {
  const pathname = usePathname()
  const preloaderState = usePreloader(preloaderTexts)
  // Initialize with false to ensure server/client consistency
  const [hasRunPreloader, setHasRunPreloader] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check if preloader should run (only after mount to avoid hydration issues)
  const shouldRunPreloader = () => {
    if (!isMounted) return false;
    
    // Only run on specified routes
    if (!PRELOADER_ROUTES.includes(pathname || '')) return false;

    // Check if coming from another route (navigation)
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (document.referrer.includes(window.location.origin)) return false;
    }

    // Check if it's already run in this session
    if (hasRunPreloader) return false;

    return true;
  }

  useEffect(() => {
    if (!isMounted) return;
    
    // Check if we should skip preloader on initial load
    if (!shouldRunPreloader()) {
      // Still trigger animations even when skipping preloader
      const timer = setTimeout(() => {
        setHasRunPreloader(true);
        preloaderState.setShowPreloader(false);
      }, 100); // Small delay to ensure proper state updates
      return () => clearTimeout(timer);
    }

    // If preloader should run, make sure it's shown and animation starts
    if (shouldRunPreloader() && !preloaderState.showPreloader && !hasRunPreloader) {
      preloaderState.setShowPreloader(true);
    }

    // Mark as run when preloader completes (use hook's isPreloaderDone)
    if (preloaderState.isPreloaderDone && !hasRunPreloader) {
      setHasRunPreloader(true);
    }
  }, [
    isMounted,
    preloaderState.currentIndex, 
    preloaderState.showPreloader, 
    preloaderState.isFadingOut,
    preloaderState.isPreloaderDone,
    preloaderTexts.length,
    pathname,
    hasRunPreloader
  ]);

  return (
    <PreloaderContext.Provider value={preloaderState}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloaderContext() {
  const context = useContext(PreloaderContext)
  if (!context) {
    throw new Error('usePreloaderContext must be used within a PreloaderProvider')
  }
  return context
} 