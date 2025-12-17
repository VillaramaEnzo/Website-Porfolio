'use client'

import { PreloaderProvider } from '@/context/PreloaderContext'
import { AudienceProvider } from '@/context/AudienceProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import Nav from '@/components/navigation/Nav'
import Preloader from '@/components/Preloader/Preloader'
import { preloaderTexts } from '@/utils/text'
import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { usePreloaderContext } from '@/context/PreloaderContext'
import { transitions } from '@/utils/animations'

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
  
  // Hide navbar on easter egg/play pages
  const isEasterEggPage = pathname === '/play'
  const shouldShowNav = !isEasterEggPage

  return (
    <>
      {shouldShowNav && <Nav />}
      <div className="relative">
        <AnimatePresence>
          <PreloaderWrapper />
        </AnimatePresence>
        {/* Hide page content until preloader is done to prevent flash */}
        {(!showPreloader || isPreloaderDone) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={transitions.fast}
          >
            {children}
          </motion.div>
        )}
      </div>
    </>
  )
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PreloaderProvider preloaderTexts={preloaderTexts}>
        <AudienceProvider>
          <ClientContent>
            {children}
          </ClientContent>
        </AudienceProvider>
      </PreloaderProvider>
    </ThemeProvider>
  )
}
