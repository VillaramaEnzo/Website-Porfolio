'use client'

import { PageProvider } from '@/context/PageContext'
import { PreloaderProvider } from '@/context/PreloaderContext'
import Nav from '@/components/navigation/Nav'
import Preloader from '@/components/Preloader/Preloader'
import { preloaderTexts } from '@/utils/text'
import { AnimatePresence, motion } from 'motion/react'
import { usePage } from '@/context/PageContext'
import { usePreloaderContext } from '@/context/PreloaderContext'

function PreloaderWrapper() {
  const { currentPage } = usePage()
  const { showPreloader } = usePreloaderContext()

  // Only show preloader on home page
  if (currentPage !== 'home' || !showPreloader) return null

  return <Preloader />
}

function ClientContent({ children }: { children: React.ReactNode }) {
  const { isPreloaderDone, showPreloader } = usePreloaderContext()

  return (
    <>
      <Nav />
      <div className="pt-20 relative">
        <AnimatePresence>
          <PreloaderWrapper />
        </AnimatePresence>
        {/* Hide page content until preloader is done to prevent flash */}
        {(!showPreloader || isPreloaderDone) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
    <PageProvider>
      <PreloaderProvider preloaderTexts={preloaderTexts}>
        <ClientContent>
          {children}
        </ClientContent>
      </PreloaderProvider>
    </PageProvider>
  )
}
