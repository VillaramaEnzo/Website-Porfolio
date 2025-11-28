import { useState, useEffect } from 'react'
import { useAnimate } from 'motion/react'

export function useFadeTransition() {
  const [scope, animate] = useAnimate()
  const [showInitialText, setShowInitialText] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialText(false)
    }, 2000) // Wait for HomeContent to fade in

    return () => clearTimeout(timer)
  }, [])

  return { scope, controls: animate, showInitialText }
} 