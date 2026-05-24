'use client'

import type { ReactNode } from 'react'
import { PreloaderProvider } from '@/app/context/PreloaderContext'
import { preloaderTexts } from '@/app/utils/preloader'

interface AppProvidersProps {
  children: ReactNode
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <PreloaderProvider preloaderTexts={preloaderTexts} shouldRunPreloader={false}>
      {children}
    </PreloaderProvider>
  )
}
