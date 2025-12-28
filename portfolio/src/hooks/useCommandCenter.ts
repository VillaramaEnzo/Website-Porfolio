'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { usePreloaderContext, useRemix } from '@/context'
import { isValidRoute, getNavigationPath, getAutocompleteRoutes } from '@/utils/routes'
import { getAutocompleteCodes, findCodeByCode, isValidPublicCode } from '@/utils/codes'
import { validateSecretCode } from '@/utils/encrypt_secrets'
import { evaluate, canEvaluate, type EvaluateResult } from '@/utils/evaluate'

export function useCommandCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [secretCodeValidation, setSecretCodeValidation] = useState<{ 
    valid: boolean
    description?: string
    action?: string
    error?: string
    retryAfter?: number
  } | null>(null)
  const [evaluationResult, setEvaluationResult] = useState<EvaluateResult | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { showPreloader, isPreloaderDone } = usePreloaderContext()
  const { isRemixing, setIsRemixing } = useRemix()

  // Calculate route suggestions (when input starts with /) - memoized
  const routeSuggestions = useMemo(() => {
    const trimmed = inputValue.trim()
    return trimmed.startsWith('/') ? getAutocompleteRoutes(trimmed) : []
  }, [inputValue])

  // Calculate public code suggestions (when input doesn't start with /) - memoized
  const codeSuggestions = useMemo(() => {
    const trimmed = inputValue.trim()
    return !trimmed.startsWith('/') && trimmed
      ? getAutocompleteCodes(trimmed)
      : []
  }, [inputValue])

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0)
  }, [routeSuggestions.length, codeSuggestions.length, inputValue])

  // Check if input can be evaluated (math, currency, metric)
  useEffect(() => {
    const trimmedInput = inputValue.trim()
    
    // Only check for evaluation if:
    // 1. Input doesn't start with /
    // 2. Input has content
    // 3. There are NO public code suggestions
    // 4. It's NOT an exact match for a public code
    if (
      trimmedInput && 
      !trimmedInput.startsWith('/') && 
      codeSuggestions.length === 0 && 
      !isValidPublicCode(trimmedInput) &&
      canEvaluate(trimmedInput)
    ) {
      const timeoutId = setTimeout(async () => {
        setIsEvaluating(true)
        const result = await evaluate(trimmedInput)
        setEvaluationResult(result)
        setIsEvaluating(false)
      }, 300) // Debounce 300ms

      return () => clearTimeout(timeoutId)
    } else {
      setEvaluationResult(null)
      setIsEvaluating(false)
    }
  }, [inputValue, codeSuggestions.length])

  // Validate secret code as user types (debounced)
  // Only validate if it's NOT a public code, doesn't start with /, and is NOT evaluable
  useEffect(() => {
    const trimmedInput = inputValue.trim().toLowerCase()
    
    // Only validate secret codes if:
    // 1. Input doesn't start with /
    // 2. Input has content
    // 3. There are NO public code suggestions (meaning it's not matching a public code)
    // 4. It's NOT an exact match for a public code
    // 5. It's NOT evaluable (evaluation takes priority)
    if (
      trimmedInput && 
      !trimmedInput.startsWith('/') && 
      codeSuggestions.length === 0 && 
      !isValidPublicCode(trimmedInput) &&
      !canEvaluate(trimmedInput)
    ) {
      const timeoutId = setTimeout(async () => {
        setIsValidatingCode(true)
        const result = await validateSecretCode(trimmedInput)
        setSecretCodeValidation(result)
        setIsValidatingCode(false)
      }, 300) // Debounce 300ms

      return () => clearTimeout(timeoutId)
    } else {
      setSecretCodeValidation(null)
      setIsValidatingCode(false)
    }
  }, [inputValue, codeSuggestions.length])

  // Handle public code execution
  const handlePublicCode = (codeString: string): boolean => {
    const code = findCodeByCode(codeString)
    if (!code) return false
    
    // Switch on action type
    switch (code.action) {
      case 'test_action':
        // Handle test action
        console.log('Test code executed!', codeString)
        setIsOpen(false)
        setInputValue('')
        return true
      case 'refresh_page':
        // Handle page refresh
        window.location.reload()
        setIsOpen(false)
        setInputValue('')
        return true
      case 'enable_remix_mode':
        setIsRemixing(true)
        setIsOpen(false)
        setInputValue('')
        return true
      case 'enable_basic_mode':
        setIsRemixing(false)
        setIsOpen(false)
        setInputValue('')
        return true
      case 'contact_me':
        window.open('mailto:ienzovillarama@gmail.com')
        setIsOpen(false)
        setInputValue('')
        return true
      // Add more public code actions here
      default:
        return false
    }
  }

  // Handle secret commands (cheat codes) - now async
  // Uses action types from API (no code strings exposed in client)
  const handleSecretCommand = async (command: string): Promise<boolean> => {
    const result = await validateSecretCode(command)
    if (!result.valid || !result.action) return false
    
    // Switch on action type (not code string - codes stay server-side)
    switch (result.action) {
      case 'enable_remix_mode':
        setIsRemixing(true)
        setIsOpen(false)
        setInputValue('')
        return true
      case 'enable_basic_mode':
        setIsRemixing(false)
        setIsOpen(false)
        setInputValue('')
        return true
      case 'refresh_page':
        window.location.reload()
        setIsOpen(false)
        setInputValue('')
        return true
      default:
        return false
    }
  }

  // Helper function to extract search query from input
  // Handles both "hello" and "google: hello" formats
  const extractSearchQuery = (input: string): string | null => {
    const trimmed = input.trim()
    if (!trimmed) return null
    
    // Check if it starts with "google:" (case-insensitive)
    const googlePrefixRegex = /^google:\s*/i
    if (googlePrefixRegex.test(trimmed)) {
      // Strip the "google:" prefix and return the rest
      return trimmed.replace(googlePrefixRegex, '').trim()
    }
    
    // Otherwise, return the input as-is
    return trimmed
  }

  // Handle route navigation
  const handleNavigate = (path: string): boolean => {
    const trimmedPath = path.trim()
    
    // Only handle routes if input starts with /
    if (!trimmedPath.startsWith('/')) return false
    
    // Check if it's a valid route
    if (isValidRoute(trimmedPath)) {
      // Get the actual navigation path (handles aliases like /home -> /)
      const navPath = getNavigationPath(trimmedPath)
      router.push(navPath)
      setIsOpen(false)
      setInputValue('')
      return true
    }
    return false
  }

  // Handle keyboard shortcuts (Cmd/Ctrl + Shift + Space, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent opening on mobile (check for touch device or small screen)
      const isMobile = window.innerWidth < 768 || 'ontouchstart' in window
      
      // Prevent opening when preloader is showing
      if (showPreloader || !isPreloaderDone) return

      // Open with Cmd/Ctrl + Shift + Space
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === ' ') {
        e.preventDefault()
        if (!isMobile) {
          setIsOpen(prev => !prev)
        }
      }
      
      // Close with Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        setInputValue('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPreloader, isPreloaderDone, isOpen])

  // Handle keyboard navigation and selection
  const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Cmd+A / Ctrl+A to select all text
    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
      e.preventDefault()
      if (inputRef.current) {
        inputRef.current.select()
      }
      return
    }
    
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmedInput = inputValue.trim()
      
      // If input is empty, just close the command center
      if (!trimmedInput) {
        setIsOpen(false)
        setInputValue('')
        return
      }
      
      // Track if any handler succeeded
      let handled = false
      
      if (trimmedInput.startsWith('/')) {
        // Handle route navigation
        if (routeSuggestions.length > 0 && selectedIndex < routeSuggestions.length) {
          const selectedRoute = routeSuggestions[selectedIndex]
          handled = handleNavigate(selectedRoute.path)
        } else {
          handled = handleNavigate(trimmedInput)
        }
      } else {
        // Handle code execution (public or secret)
        // First check if a suggestion is selected
        if (codeSuggestions.length > 0 && selectedIndex < codeSuggestions.length) {
          const selectedCode = codeSuggestions[selectedIndex]
          handled = handlePublicCode(selectedCode.code)
          if (handled) return
        }
        
        // Check if it's a public code
        if (isValidPublicCode(trimmedInput)) {
          handled = handlePublicCode(trimmedInput)
          if (handled) return
        }
        
        // Otherwise, try as secret command
        if (!handled) {
          handled = await handleSecretCommand(trimmedInput)
        }
      }
      
      // If nothing was handled, try to evaluate as math/currency/metric
      if (!handled) {
        if (canEvaluate(trimmedInput)) {
          const evalResult = await evaluate(trimmedInput)
          if (evalResult.success) {
            // Evaluation succeeded - result is already in state, just close
            setIsOpen(false)
            setInputValue('')
            handled = true
          }
        }
      }
      
      // If nothing was handled, check if we should search on Google
      // Only search if input starts with alphanumeric characters (not /, #, etc.)
      if (!handled) {
        // Check if input starts with non-alphanumeric characters
        const startsWithNonAlphanumeric = /^[^a-zA-Z0-9]/.test(trimmedInput)
        
        if (startsWithNonAlphanumeric) {
          // Invalid input - don't search Google for routes or special characters
          // Just close the command center without doing anything
          setIsOpen(false)
          setInputValue('')
        } else {
          // Valid input format - proceed with Google search
          const searchQuery = extractSearchQuery(trimmedInput)
          
          if (searchQuery) {
            const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
            window.open(googleSearchUrl, '_blank', 'noopener,noreferrer')
            setIsOpen(false)
            setInputValue('')
          }
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const trimmedInput = inputValue.trim()
      const maxIndex = trimmedInput.startsWith('/')
        ? routeSuggestions.length - 1
        : codeSuggestions.length - 1
      setSelectedIndex(prev => 
        prev < maxIndex ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (path: string) => {
    handleNavigate(path)
  }

  // Reset input when modal opens/closes
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setInputValue('')
    }
  }, [isOpen])

  // Close when preloader starts showing
  useEffect(() => {
    if (showPreloader) {
      setIsOpen(false)
    }
  }, [showPreloader])

  return {
    // State
    isOpen,
    inputValue,
    selectedIndex,
    isValidatingCode,
    secretCodeValidation,
    evaluationResult,
    isEvaluating,
    
    // Refs
    inputRef,
    
    // Computed values
    routeSuggestions,
    codeSuggestions,
    
    // Handlers
    setIsOpen,
    setInputValue,
    setSelectedIndex,
    handleInputKeyDown,
    handleSuggestionClick,
    handlePublicCode,
  }
}

