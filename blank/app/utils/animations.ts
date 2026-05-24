import type { Variants } from 'motion/react'

const preloaderContainer: Variants = {
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  hidden: {
    opacity: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
}

export const components = {
  preloader: {
    container: preloaderContainer,
    text: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
    },
    dots: {
      opacity: [0, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse' as const,
      },
    },
  },
}
