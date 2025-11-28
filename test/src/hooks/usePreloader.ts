"use client"
import { useState, useEffect } from 'react'

interface PreloaderText {
  text: string
  duration: number
}

export function usePreloader(texts: PreloaderText[]) {
  // Initialize with false to ensure server/client consistency
  const [showPreloader, setShowPreloader] = useState(false)
  const [displayedTexts, setDisplayedTexts] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dots, setDots] = useState('')
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isPreloaderDone, setIsPreloaderDone] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  
  // Reset animation state when preloader is first shown
  useEffect(() => {
    if (showPreloader && !hasStarted) {
      setDisplayedTexts([])
      setCurrentIndex(0)
      setIsFadingOut(false)
      setIsPreloaderDone(false)
      setHasStarted(true)
    } else if (!showPreloader && hasStarted) {
      // Reset hasStarted when preloader is hidden
      setHasStarted(false)
    }
  }, [showPreloader, hasStarted])

  // Animation logic - only run when preloader is shown and started
  useEffect(() => {
    if (!showPreloader || !hasStarted || texts.length === 0) return;

    // All texts have been displayed, start fade out
    if (currentIndex >= texts.length) {
      const finalTimer = setTimeout(() => {
        setIsFadingOut(true)
        
        // Bundle state updates together
        setTimeout(() => {
          // Update all states in one batch
          setShowPreloader(false)
          setIsFadingOut(false)
          setIsPreloaderDone(true)
        }, 1000)
      }, 1000)

      return () => clearTimeout(finalTimer)
    }

    // Show first text immediately when starting
    if (currentIndex === 0) {
      setDisplayedTexts([texts[0].text])
      setCurrentIndex(1)
      return
    }

    // Continue showing subsequent texts with delay based on previous text's duration
    if (currentIndex > 0 && currentIndex < texts.length) {
      const textTimer = setTimeout(() => {
        setDisplayedTexts(prev => [...prev, texts[currentIndex].text])
        setCurrentIndex(prev => prev + 1)
      }, texts[currentIndex - 1].duration)

      return () => clearTimeout(textTimer)
    }
  }, [currentIndex, texts, showPreloader, hasStarted])

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 200)

    return () => clearInterval(dotTimer)
  }, [])

  useEffect(() => {
    console.log('State Update:', { showPreloader, isPreloaderDone, isFadingOut })
  }, [showPreloader, isPreloaderDone, isFadingOut])

  return { 
    showPreloader, 
    setShowPreloader,
    displayedTexts,
    dots,
    isFadingOut,
    currentIndex,
    isPreloaderDone
  }
}