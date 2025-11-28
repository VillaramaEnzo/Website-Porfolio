import { useState, useEffect, useRef } from 'react'
import { useAnimate } from 'motion/react'

export function useAudienceAnimation(intervalDuration: number = 5000) {
  const [scope] = useAnimate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const resumeTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isHovered || isPaused) return

    const interval = setInterval(() => {
      setPreviousIndex(currentIndex)
      setCurrentIndex((prev) => prev + 1)
    }, intervalDuration)

    return () => {
      clearInterval(interval)
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [intervalDuration, isHovered, isPaused, currentIndex])

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!isPaused) return
    
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, intervalDuration)
  }
  
  const selectIndex = (index: number) => {
    setIsPaused(true)
    setPreviousIndex(currentIndex)
    setCurrentIndex(index)
    
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    
    resumeTimeoutRef.current = setTimeout(() => {
      setIsPaused(false)
    }, intervalDuration / 2)
  }

  const resumeAnimation = () => setIsPaused(false)

  return {
    scope,
    currentIndex,
    previousIndex,
    handleMouseEnter,
    handleMouseLeave,
    selectIndex,
    resumeAnimation
  }
} 