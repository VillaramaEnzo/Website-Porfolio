'use client'

import { PreloaderProvider, AudienceProvider, ThemeProvider, RemixProvider, ScrollProvider } from '@/context'
import Header from '@/components/navigation/Header'
import Preloader from '@/components/Preloader/Preloader'
import CommandCenter from '@/components/widgets/CommandCenter'
import { preloaderTexts } from '@/utils/text'
import { AnimatePresence } from 'motion/react'
import { usePathname } from 'next/navigation'
import { usePreloaderContext } from '@/context'

import BackToTopButton from '@/components/navigation/BackToTopButton'
import PageTransition from '@/components/Transitions/PageTransition'
import { getTransitionForRoute } from '@/utils/transitionConfig'

function PreloaderWrapper() {
  const pathname = usePathname()
  const { showPreloader } = usePreloaderContext()

  // Only show preloader on home page
  if (pathname !== '/' || !showPreloader) return null

  return <Preloader />
}

function ClientContent({ children }: { children: React.ReactNode }) {
  const { isPreloaderDone, showPreloader } = usePreloaderContext()
  const pathname = usePathname()

  // Determine if we should skip page transition
  // Skip only when: home page AND preloader is showing/not done
  const shouldSkipTransition = pathname === '/' && showPreloader && !isPreloaderDone

  // Get transition type for current route
  const transitionType = getTransitionForRoute(pathname)

  return (
    <>
      <Header />
      <CommandCenter key={pathname} />
      <BackToTopButton />
      <div className="relative">
        <AnimatePresence>
          <PreloaderWrapper />
        </AnimatePresence>
        {/* Hide page content until preloader is done to prevent flash */}
        {(!showPreloader || isPreloaderDone) && (
          <PageTransition 
            shouldSkipTransition={shouldSkipTransition}
            transitionType={transitionType}
          >
            {children}
          </PageTransition>
        )}
      </div>
    </>
  )
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
    <PreloaderProvider preloaderTexts={preloaderTexts}>
      <RemixProvider>
        <AudienceProvider>
            <ScrollProvider>
              <ClientContent>
                {children}
              </ClientContent>
            </ScrollProvider>
        </AudienceProvider>
      </RemixProvider>
    </PreloaderProvider>
    </ThemeProvider>
  )
}
