'use client'

import { useEffect, useState } from 'react'

interface PreloaderText {
  text: string
  duration: number
}

export function usePreloader(texts: PreloaderText[]) {
  const [showPreloader, setShowPreloader] = useState(false)
  const [displayedTexts, setDisplayedTexts] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dots, setDots] = useState('')
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [isPreloaderDone, setIsPreloaderDone] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (showPreloader && !hasStarted) {
      const resetTimer = setTimeout(() => {
        setDisplayedTexts([])
        setCurrentIndex(0)
        setIsFadingOut(false)
        setIsPreloaderDone(false)
        setHasStarted(true)
      }, 0)
      return () => clearTimeout(resetTimer)
    } else if (!showPreloader && hasStarted) {
      const stopTimer = setTimeout(() => {
        setHasStarted(false)
      }, 0)
      return () => clearTimeout(stopTimer)
    }
  }, [showPreloader, hasStarted])

  useEffect(() => {
    if (!showPreloader || !hasStarted || texts.length === 0) return

    if (currentIndex >= texts.length) {
      const finalTimer = setTimeout(() => {
        setIsFadingOut(true)

        setTimeout(() => {
          setShowPreloader(false)
          setIsFadingOut(false)
          setIsPreloaderDone(true)
        }, 1000)
      }, 1000)

      return () => clearTimeout(finalTimer)
    }

    if (currentIndex === 0) {
      const startTimer = setTimeout(() => {
        setDisplayedTexts([texts[0].text])
        setCurrentIndex(1)
      }, 0)
      return () => clearTimeout(startTimer)
    }

    if (currentIndex > 0 && currentIndex < texts.length) {
      const textTimer = setTimeout(() => {
        setDisplayedTexts((prev) => [...prev, texts[currentIndex].text])
        setCurrentIndex((prev) => prev + 1)
      }, texts[currentIndex - 1].duration)

      return () => clearTimeout(textTimer)
    }
  }, [currentIndex, texts, showPreloader, hasStarted])

  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : `${prev}.`))
    }, 200)

    return () => clearInterval(dotTimer)
  }, [])

  return {
    showPreloader,
    setShowPreloader,
    displayedTexts,
    dots,
    isFadingOut,
    currentIndex,
    isPreloaderDone,
    setIsPreloaderDone,
  }
}
