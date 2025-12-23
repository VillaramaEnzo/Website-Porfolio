/**
 * useScramble Hook
 * 
 * Customization Points:
 * 1. Character Sets and Weights:
 *    Modify characterSets object to adjust the probability of different character types
 *    appearing in the scramble. Weights should sum to 1.
 *    
 *    Current weights:
 *    - lowercase: 0.3 (30% chance)
 *    - uppercase: 0.1 (10% chance)
 *    - numbers: 0.1   (10% chance)
 *    - symbols: 0.5   (50% chance)
 * 
 * 2. Animation Controls:
 *    - charStates[index] < 10: Number of scramble iterations per character
 *      Higher = longer reveal time
 *      Lower = quicker reveal
 * 
 *    - Math.random() < 0.3: Chance of character updating per frame
 *      Higher = more aggressive scramble
 *      Lower = more subtle effect
 * 
 * 3. Timing Controls:
 *    - scrambleSpeed (default: 50ms): Frame delay
 *      Lower = faster animation
 *      Higher = slower animation
 *    
 *    - transitionInterval (default: 3000ms): Delay between phrases
 *      Controls how long each phrase stays visible
 */

import { useState, useRef, useEffect } from 'react'
import { useInView } from 'motion/react'

interface ScrambleOptions {
  scrambleSpeed?: number
  infinite?: boolean
  transitionInterval?: number
  revealOnView?: boolean
}

// Character sets with their weights
const characterSets = {
  lowercase: {
    chars: 'abcdefghijklmnopqrstuvwxyz',
    weight: 0.3
  },
  uppercase: {
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    weight: 0.1
  },
  numbers: {
    chars: '0123456789',
    weight: 0.1
  },
  symbols: {
    chars: '!@#$%^&*()[]{},./<>?;:\'"_-+=',
    weight: 0.5
  }
}

// Get a random character based on weighted probabilities
export function getRandomChar(): string {
  const random = Math.random()
  let probabilitySum = 0

  for (const set of Object.values(characterSets)) {
    probabilitySum += set.weight
    if (random < probabilitySum) {
      return set.chars[Math.floor(Math.random() * set.chars.length)]
    }
  }

  // Fallback to symbols if we somehow exceed probability sum
  return characterSets.symbols.chars[0]
}

export function useScramble(
  phrases: string[],
  { 
    scrambleSpeed = 50, 
    infinite = false,
    transitionInterval = 3000,
    revealOnView = false
  }: ScrambleOptions = {}
) {
  const [displayText, setDisplayText] = useState('')
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  
  const timeoutRef = useRef<NodeJS.Timeout>()
  const animationRef = useRef<number>()
  const ref = useRef<HTMLDivElement>(null)
  
  const isInView = useInView(ref, { once: true })
  const shouldShow = revealOnView ? isInView : true

  // Reset phrase index when component unmounts
  useEffect(() => {
    return () => {
      setCurrentPhraseIndex(0)
    }
  }, [])

  useEffect(() => {
    if (!shouldShow || !phrases.length) return

    const currentText = phrases[currentPhraseIndex]
    const nextText = infinite ? phrases[(currentPhraseIndex + 1) % phrases.length] : currentText
    const scrambleLength = Math.max(currentText.length, nextText.length)
    
    const charStates = new Array(scrambleLength).fill(0)
    let isAnimating = true
    
    const update = () => {
      if (!isAnimating) return

      setDisplayText(
        Array(scrambleLength)
          .fill(' ')
          .map((space, index) => {
            const char = index < currentText.length ? currentText[index] : space
            
            if (charStates[index] < 10 && Math.random() < 0.3) {
              charStates[index]++
            }
            
            return charStates[index] >= 10 
              ? char 
              : getRandomChar()
          })
          .join('')
          .trimEnd()
      )

      if (charStates.every(state => state >= 10)) {
        if (infinite) {
          timeoutRef.current = setTimeout(() => {
            setCurrentPhraseIndex(prev => (prev + 1) % phrases.length)
          }, transitionInterval)
        }
      } else {
        animationRef.current = requestAnimationFrame(update)
      }
    }

    animationRef.current = requestAnimationFrame(update)

    return () => {
      isAnimating = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentPhraseIndex, shouldShow, infinite, scrambleSpeed, transitionInterval, phrases])

  return { displayText, ref, shouldShow }
}

/**
 * useScrambleTransition Hook
 * 
 * Transitions from one text to another using scramble animation.
 * Useful for smooth transitions between different text states.
 * Only runs the transition once per fromText/toText pair.
 */
export function useScrambleTransition(
  fromText: string,
  toText: string,
  onComplete?: () => void
) {
  const [displayText, setDisplayText] = useState(fromText)
  const [isComplete, setIsComplete] = useState(false)
  const animationRef = useRef<number>()
  const transitionKeyRef = useRef<string>('')
  const onCompleteRef = useRef(onComplete)

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Create a unique key for this transition
  const currentTransitionKey = `${fromText}->${toText}`

  // Reset only when the transition key changes (new transition)
  useEffect(() => {
    if (transitionKeyRef.current !== currentTransitionKey) {
      transitionKeyRef.current = currentTransitionKey
      setDisplayText(fromText)
      setIsComplete(false)
    }
  }, [fromText, toText, currentTransitionKey])

  useEffect(() => {
    // Don't start if already complete or if transition key doesn't match
    if (isComplete || !fromText || !toText || transitionKeyRef.current !== currentTransitionKey) {
      return
    }

    const targetText = toText
    const scrambleLength = Math.max(fromText.length, targetText.length)
    const charStates = new Array(scrambleLength).fill(0)
    let isAnimating = true

    const update = () => {
      if (!isAnimating) return
      
      // Check if we're still on the same transition
      if (transitionKeyRef.current !== currentTransitionKey) {
        isAnimating = false
        return
      }

      const scrambled = Array(scrambleLength)
        .fill(' ')
        .map((space, index) => {
          const targetChar = index < targetText.length ? targetText[index] : space
          
          if (charStates[index] < 10 && Math.random() < 0.3) {
            charStates[index]++
          }
          
          return charStates[index] >= 10 ? targetChar : getRandomChar()
        })
        .join('')
        .trimEnd()

      setDisplayText(scrambled)

      if (charStates.every(state => state >= 10)) {
        setDisplayText(targetText)
        setIsComplete(true)
        isAnimating = false
        // Use ref to call onComplete to avoid dependency issues
        if (onCompleteRef.current) {
          // Call onComplete after a brief delay to ensure final render
          setTimeout(() => {
            onCompleteRef.current?.()
          }, 100)
        }
      } else {
        animationRef.current = requestAnimationFrame(update)
      }
    }

    animationRef.current = requestAnimationFrame(update)

    return () => {
      isAnimating = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [fromText, toText, isComplete, currentTransitionKey])

  return { displayText, isComplete }
}

