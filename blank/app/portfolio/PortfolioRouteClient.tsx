'use client'

import { useState } from 'react'
import Preloader from '@/app/components/Preloader'
import { PreloaderProvider, usePreloaderContext } from '@/app/context/PreloaderContext'
import { PORTFOLIO_PRELOADER_HANDOFF_KEY, preloaderTexts } from '@/app/utils/preloader'

function PortfolioPageContent() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-6 text-center">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/70">Portfolio</p>
        <h1 className="text-3xl font-semibold md:text-5xl">Welcome to the full site</h1>
        <p className="text-base text-foreground/80 md:text-lg">
          This page is the handoff point for the richer portfolio experience and will eventually
          host transitions, preloaders, and expanded content.
        </p>
      </div>
    </main>
  )
}

function PreloaderGate() {
  const { showPreloader, isPreloaderDone } = usePreloaderContext()
  const shouldShowContent = !showPreloader || isPreloaderDone

  return (
    <>
      <Preloader />
      {shouldShowContent && <PortfolioPageContent />}
    </>
  )
}

export default function PortfolioRouteClient() {
  const [shouldRunPreloader] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false

    const hasPendingPreloader = sessionStorage.getItem(PORTFOLIO_PRELOADER_HANDOFF_KEY) === 'true'
    if (hasPendingPreloader) {
      sessionStorage.removeItem(PORTFOLIO_PRELOADER_HANDOFF_KEY)
    }
    return hasPendingPreloader
  })

  if (!shouldRunPreloader) return <PortfolioPageContent />

  return (
    <PreloaderProvider preloaderTexts={preloaderTexts} shouldRunPreloader={shouldRunPreloader}>
      <PreloaderGate />
    </PreloaderProvider>
  )
}
