import { useEffect } from 'react'

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    // Store initial scroll position and body styles
    const scrollY = window.scrollY
    const originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      height: document.body.style.height
    }

    if (lock) {
      // Lock scroll
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.height = '100vh'
    }

    return () => {
      // Restore original styles
      document.body.style.overflow = originalStyles.overflow
      document.body.style.position = originalStyles.position
      document.body.style.top = originalStyles.top
      document.body.style.width = originalStyles.width
      document.body.style.height = originalStyles.height
      
      // Restore scroll position when unlocking
      if (lock) {
        window.scrollTo(0, scrollY)
      }
    }
  }, [lock])
} 