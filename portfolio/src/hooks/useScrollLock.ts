import { useEffect } from 'react'
import { useScrollManager } from './useScrollManager'

export function useScrollLock(lock: boolean) {
  const { lenis } = useScrollManager()

  useEffect(() => {
    if (!lenis) return

    if (lock) {
      // Stop Lenis scrolling
      lenis.stop()
    } else {
      // Resume Lenis scrolling
      lenis.start()
    }

    return () => {
      // Always resume scrolling when component unmounts or lock changes
      if (lock) {
        lenis.start()
      }
    }
  }, [lock, lenis])
}
