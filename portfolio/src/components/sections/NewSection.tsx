'use client'

/**
 * New Section Scene Component
 * 
 * Bare bones - ready for scroll-based animations.
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { useRef } from 'react'
import { AudienceProvider } from '@/context'
import LandingText from '@/components/widgets/LandingText'

export default function NewSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const box2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ensure ScrollTrigger is registered (Lenis proxy uses document.body)
    gsap.registerPlugin(ScrollTrigger)

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        scroller: document.body, // align with Lenis scrollerProxy
        start: 'top top',
        end: () => `+=${window.innerHeight}`,
        scrub: true,
        markers: true,
        pin: true,
        pinSpacing: true,
      }
    })

   
    // Start small, expand to fill viewport and beyond
    tl.to(boxRef.current, {
      scale: 0.5, // Scale up significantly
      x: "100vw", // Center it
      y: 0,
      backgroundColor: '#AAA/40',
      zIndex: 100, // Ensure it's above everything
      ease: 'power2.out',
    }, "<")
    .to(box2Ref.current, {
      scale: 5,
      zIndex: 100,
      ease: 'power2.out',
    }, "<0.05")
    
    .to(boxRef.current, {
      y: "-100vh",
      ease: 'power2.out',
    })

    // Refresh after creating timeline to account for pin spacing
    ScrollTrigger.refresh()

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill()
      }
      tl.kill()
    }
  }, [])
  
  return (
    <AudienceProvider>

    <section ref={sectionRef} className="h-screen flex flex-col justify-center items-center relative overflow-visible">
        <div ref={boxRef} className="w-[100vw] h-[100vh] bg-white flex justify-center items-center text-sm text-black fixed z-50">
          <LandingText />
        </div>
        <div ref={box2Ref} className="w-[20vw] h-[20vh] bg-[#FFFAAA] flex  justify-center items-center text-sm text-black z-20">
          Hello
        </div>
    </section>
    </AudienceProvider>
      
  )
}

