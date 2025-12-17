'use client'

import { createContext, useContext } from 'react'
import { useAudienceAnimation } from '@/hooks/useAudienceAnimation'
import { audienceTexts } from '@/utils/text'

type AudienceContextType = {
  scope: React.RefObject<HTMLDivElement>
  currentIndex: number
  previousIndex: number
  currentAudience: string
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  selectIndex: (index: number) => void
  resumeAnimation: () => void
}

const AudienceContext = createContext<AudienceContextType | null>(null)

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const audienceAnimation = useAudienceAnimation(4000)
  const currentAudience = audienceTexts[audienceAnimation.currentIndex % audienceTexts.length].audience

  const value = {
    ...audienceAnimation,
    currentAudience
  }

  return (
    <AudienceContext.Provider value={value}>
      {children}
    </AudienceContext.Provider>
  )
}

export function useAudience() {
  const context = useContext(AudienceContext)
  if (!context) {
    throw new Error('useAudience must be used within an AudienceProvider')
  }
  return context
}

