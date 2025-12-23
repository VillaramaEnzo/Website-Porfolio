'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface RemixContextType {
  isRemixing: boolean
  setIsRemixing: (enabled: boolean) => void
  toggleIsRemixing: () => void
}

const RemixContext = createContext<RemixContextType | undefined>(undefined)

export function RemixProvider({ children }: { children: ReactNode }) {
  const [isRemixing, setIsRemixing] = useState(false)

  const toggleIsRemixing = () => {
    setIsRemixing(prev => !prev)
  }

  return (
    <RemixContext.Provider value={{ isRemixing, setIsRemixing, toggleIsRemixing }}>
      {children}
    </RemixContext.Provider>
  )
}

export function useRemix() {
  const context = useContext(RemixContext)
  if (context === undefined) {
    throw new Error('useRemix must be used within a RemixProvider')
  }
  return context
}

