'use client'

// Sync up animation with preloader
// Header is mounted while preloader is shown causing the animation to start early

import Links from '@/components/Widgets/Header/Links'
import Logo from '@/components/Widgets/Header/Logo'
import { motion } from 'motion/react'
import ScrambleText from '@/components/Widgets/ScrambleText'
import LiveClock from './LiveClock'
import { phrases, details } from '@/utils/text'
import { usePreloaderContext } from '@/context/PreloaderContext'  
import StatusDisplay from '@/components/Widgets/Header/StatusDisplay'
import Nav from '@/components/Widgets/Navigation/Nav'
import Drawer from '@/components/Widgets/Navigation/Drawer'
import { useState } from 'react'


export default function Header() {
  
  const showStatus = false
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { isPreloaderDone } = usePreloaderContext()

  const clockProps = {
    location: "Auckland, NZ",
    showSeconds: true,
    use24Hour: true,
    className: "flex-1 text-xs text-[#AAA] tracking-wider text-right"
  }

  // Need check for if initial Landing Section is active
  // If so, delay the animation

  return (
    <>
    <motion.header 
      className="fixed top-0 z-50 mt-4 px-12 w-full"
      initial={false}
      animate={{ opacity: isPreloaderDone ? 1 : 0 }}
      transition={{ duration: 1.8, ease: "easeInOut", delay: 1.2 }}
    >
      <motion.nav 
        className="max-w-[1440px] mx-auto flex flex-col gap-2"
        layout="preserve-aspect"
        layoutRoot
      >
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ x: "-20vw"}}
            animate={{ x: ["-20vw", "2vw", 0] }}
            transition={{ duration: 1.8, ease: "easeInOut"}}
          >
            <ScrambleText
              phrases={phrases}
              infinite={true}
              scrambleSpeed={60}
            className="flex-1 text-xs text-[#AAA] tracking-wider whitespace-nowrap overflow-hidden text-ellipsis"
              transitionInterval={2000}
            />
          </motion.div>

          <motion.div 
            initial={{ x: "20vw"}}
            animate={{ x: ["20vw", "-2vw", 0] }}
            transition={{ duration: 1.8, ease: "easeInOut"}}
            className = "flex items-center gap-1 text-xs text-[#AAA] tracking-wider"
          >
            <span> {details.title} | Based in {details.currentLocation} | </span> 
            {showStatus ? <StatusDisplay /> : <LiveClock {...clockProps}/> }
          </motion.div>
        </div>

        <div className="flex justify-between items-start gap-4">

          
          <motion.div 
            initial={{ x: "-20vw"}}
            animate={{ x: ["-20vw", "2vw", 0] }}
            transition={{ duration: 1.8, ease: "easeInOut"}}
            className="w-[15vw]" 
            layout="position"
          >
            <Logo />
          </motion.div>


          <motion.div 
            className="flex items-start gap-8 ml-auto text-[#AAA]"
            initial={{ x: "100vw"}}
            animate={{ x: ["100vw", "-2vw", 0] }}
            transition={{ duration: 1.8, ease: "easeInOut"}}
          >
            <Links />
            <Nav toggleDrawer={() => setIsDrawerOpen(true)} />
          </motion.div>
        </div>
      </motion.nav>
      </motion.header>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}