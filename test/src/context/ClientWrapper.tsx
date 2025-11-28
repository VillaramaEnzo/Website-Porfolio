'use client'  

import HeaderProvider from "@/context/HeaderProvider";
import CommandCenter from "@/components/Widgets/CommandCenter";
import { motion, AnimatePresence } from 'framer-motion'
import Preloader from '@/components/Preloader/Preloader'
import { PreloaderProvider, PRELOADER_ROUTES } from '@/context/PreloaderContext'
import { preloaderTexts } from '@/utils/text'
import { usePathname } from 'next/navigation'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showPreloader = PRELOADER_ROUTES.includes(pathname || '')

  return (
    <PreloaderProvider preloaderTexts={preloaderTexts}>
      <AnimatePresence>
        {showPreloader && <Preloader />}
        <motion.div
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        > 
          <HeaderProvider />
          <CommandCenter />
          {children}
        </motion.div> 
      </AnimatePresence>
    </PreloaderProvider>
  )
}
