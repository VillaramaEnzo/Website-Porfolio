'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Page = 'home' | 'about' | 'projects' | 'contact'

interface PageContextType {
  currentPage: Page
  setCurrentPage: (page: Page) => void
}

const PageContext = createContext<PageContextType | null>(null)

export function PageProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [isMounted, setIsMounted] = useState(false)

  // Sync with URL hash on mount and when hash changes
  useEffect(() => {
    setIsMounted(true)
    
    // Read initial page from URL hash
    const hash = window.location.hash.slice(1) // Remove #
    const validPages: Page[] = ['home', 'about', 'projects', 'contact']
    if (hash && validPages.includes(hash as Page)) {
      setCurrentPage(hash as Page)
    }

    // Listen for hash changes (browser back/forward)
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      if (hash && validPages.includes(hash as Page)) {
        setCurrentPage(hash as Page)
      } else {
        setCurrentPage('home')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Update URL hash when page changes (but don't trigger navigation)
  const handleSetCurrentPage = (page: Page) => {
    setCurrentPage(page)
    // Update URL hash without causing navigation
    if (page === 'home') {
      window.history.replaceState(null, '', '/')
    } else {
      window.history.replaceState(null, '', `/#${page}`)
    }
  }

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage: handleSetCurrentPage }}>
      {children}
    </PageContext.Provider>
  )
}

export function usePage() {
  const context = useContext(PageContext)
  if (!context) {
    throw new Error('usePage must be used within PageProvider')
  }
  return context
}
