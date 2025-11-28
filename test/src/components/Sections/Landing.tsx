import LandingText from '@/components/Widgets/LandingText'
import { details } from '@/utils/text'
import Image from 'next/image'
import { silhouette, bridge } from '@/public/images'  
import { motion, AnimatePresence } from 'motion/react'
import { usePreloaderContext } from '@/context/PreloaderContext'
import { welcomeFadeIn } from '@/utils/animations'
import LandingVid from '@/components/Widgets/LandingVid'
import { AudienceProvider } from '@/context/AudienceProvider'

const exitAnimation = {
  duration: 1,
  ease: 'easeInOut',
  delay: 0.6
}

const InitialText = () => {
  return (
    <motion.div 
      className="w-[55%] h-full mt-[40vh] px-12"
      exit={{x: '155vw', transition: exitAnimation }}
    >
      <div className="flex flex-col uppercase">
        <span className="text-5xl font-extralight tracking-[0.4em] leading-tight">{details.firstName}</span>
        <span className="text-5xl font-extralight tracking-[0.4em] leading-tight">{details.lastName}</span>
        <p className="text-md font-extralight text-gray-500 my-2 tracking-[0.5em]">
          {details.title}
        </p>
      </div>
    </motion.div>
  )
}

const InitialImages = () => {
  return (
    <motion.div 
      className="w-[45%] h-full grid grid-cols-5"
      exit={{x: '-145vw', transition: exitAnimation }}
    >
      <div className="h-full col-span-2 relative">
        <Image 
          src={bridge} 
          alt="Enzo Villarama" 
          fill
          sizes="(max-width: 768px) 20vw, 45vw"
          className="object-cover opacity-50"
          quality={100}
          priority
        />
      </div>
      <div className="h-full col-span-3 relative">
        <Image 
          src={silhouette} 
          alt="Enzo Villarama" 
          fill
          sizes="(max-width: 768px) 30vw, 45vw"
          quality={100}
          className="object-cover"
          priority
        />
      </div>
    </motion.div>
  )
}


function LandingOverlay() {

  return (
    <>
      <div className="col-start-1 row-start-1 z-10 flex flex-col pointer-events-none mb-4 overflow-x-hidden">
        <LandingVid />
      </div>
            
      {/* Overlay components go here */}
      <div className="col-start-1 row-start-1 z-5 flex pointer-events-none">
      
      </div>
    </>
  )
}


function LeftColumn() {
  
  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center overflow-hidden">

      <div className="flex h-full w-full flex-col mb-[10vh] ml-[5vw]
        text-gray-100
        writing-vertical-rl 
        items-start 
        justify-start 
        rotate-180
        pointer-events-none
        "
        >
        <motion.span 
          initial={welcomeFadeIn.variants.initial}
          animate={welcomeFadeIn.variants.animate}
          exit={welcomeFadeIn.variants.exit}
          transition={welcomeFadeIn.transition}
          className="text-9xl"> Welcome! </motion.span>
        <motion.span 
          initial={welcomeFadeIn.variants.initial}
          animate={welcomeFadeIn.variants.animate}
          exit={welcomeFadeIn.variants.exit}
          transition={{ ...welcomeFadeIn.transition, delay: 0.2 }}
          className="text-2xl"> To my corner of the internet... </motion.span>
      </div>
    </div>
  )
}


function RightColumn() {
  return(
    <div className="flex-1 h-full items-center justify-center flex flex-col"> 

    </div>
  )
}



function LandingContent() {
    return (
        <AudienceProvider>
          <LandingOverlay />

          {/* Main content with flexbox */}
          <div className="z-10 col-start-1 row-start-1 w-full h-full flex">

            {/* Left Column */}
            <LeftColumn />
                

            {/* Main Column */}
            <div className="w-[50%] h-full flex flex-col">
              
              <div className="flex items-end justify-start h-[45%] w-full">

                <LandingText />

              </div>

              <div className="h-[55%] w-full opacity-50"></div>
              
            </div>
                
            {/* Right Column */}
            <RightColumn />
          </div>
        </AudienceProvider>
    );
}



// Main Component
export default function Landing() {

  const { isPreloaderDone } = usePreloaderContext()

  // Need to add additional logic to handle redirection back to home page. 
  // This the intial content should show before proceeding with the usual transition
  // The preloader should not be shown again.

  return (
    <div className="h-full w-full flex items-center relative section">
      <AnimatePresence mode="wait">
        {!isPreloaderDone ? (
          <motion.div 
            key="initial" 
            className="absolute inset-0 w-full h-full flex pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: exitAnimation }}
          >
            <InitialText />
            <InitialImages />
          </motion.div>
        ) : (
          <motion.div 
            key="landing"
            className="w-full h-full grid grid-cols-1 grid-rows-1 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut'}}
          >
            <LandingContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}





