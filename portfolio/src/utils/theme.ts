/**
 * Centralized Theme & Styling System
 * 
 * This file contains all theme configurations and component styling classes.
 * Use this to maintain consistency and enable easy theme switching.
 */

// ============================================================================
// THEME TYPES
// ============================================================================

export type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple'

export interface ThemeColors {
  // Backgrounds
  background: string
  surface: string
  surfaceSecondary: string
  
  // Text
  textPrimary: string
  textSecondary: string
  textMuted: string
  textInverse: string
  
  // Interactive
  accent: string
  accentHover: string
  active: string
  
  // Borders & Dividers
  border: string
  divider: string
  
  // Special
  preloaderBg: string
  preloaderText: string
  matrixRain: string
}

// ============================================================================
// THEME CONFIGURATIONS
// ============================================================================

export const themes: Record<Theme, ThemeColors> = {
  light: {
    background: 'bg-white',
    surface: 'bg-white',
    surfaceSecondary: 'bg-gray-50',
    
    textPrimary: 'text-black',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-400',
    textInverse: 'text-white',
    
    accent: 'text-blue-400',
    accentHover: 'hover:text-blue-500',
    active: 'text-blue-400',
    
    border: 'border-gray-200',
    divider: 'border-gray-200',
    
    preloaderBg: 'bg-white',
    preloaderText: 'text-black',
    matrixRain: '#999999',
  },
  
  dark: {
    background: 'bg-gray-900',
    surface: 'bg-gray-800',
    surfaceSecondary: 'bg-gray-700',
    
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-500',
    textInverse: 'text-black',
    
    accent: 'text-blue-400',
    accentHover: 'hover:text-blue-300',
    active: 'text-blue-400',
    
    border: 'border-gray-700',
    divider: 'border-gray-700',
    
    preloaderBg: 'bg-gray-900',
    preloaderText: 'text-white',
    matrixRain: '#666666',
  },
  
  blue: {
    background: 'bg-blue-50',
    surface: 'bg-white',
    surfaceSecondary: 'bg-blue-100',
    
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',
    textInverse: 'text-white',
    
    accent: 'text-blue-500',
    accentHover: 'hover:text-blue-600',
    active: 'text-blue-500',
    
    border: 'border-blue-200',
    divider: 'border-blue-200',
    
    preloaderBg: 'bg-blue-50',
    preloaderText: 'text-gray-900',
    matrixRain: '#3b82f6',
  },
  
  green: {
    background: 'bg-green-50',
    surface: 'bg-white',
    surfaceSecondary: 'bg-green-100',
    
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',
    textInverse: 'text-white',
    
    accent: 'text-green-500',
    accentHover: 'hover:text-green-600',
    active: 'text-green-500',
    
    border: 'border-green-200',
    divider: 'border-green-200',
    
    preloaderBg: 'bg-green-50',
    preloaderText: 'text-gray-900',
    matrixRain: '#10b981',
  },
  
  purple: {
    background: 'bg-purple-50',
    surface: 'bg-white',
    surfaceSecondary: 'bg-purple-100',
    
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',
    textInverse: 'text-white',
    
    accent: 'text-purple-500',
    accentHover: 'hover:text-purple-600',
    active: 'text-purple-500',
    
    border: 'border-purple-200',
    divider: 'border-purple-200',
    
    preloaderBg: 'bg-purple-50',
    preloaderText: 'text-gray-900',
    matrixRain: '#a855f7',
  },
}

// ============================================================================
// COMPONENT STYLES
// ============================================================================

export const componentStyles = {
  // Navigation
  nav: {
    container: 'fixed top-0 left-0 right-0 z-50 pt-4 backdrop-blur-sm',
    name: 'text-lg sm:text-xl font-light tracking-wider hover:opacity-70 transition-opacity whitespace-nowrap',
    link: 'relative text-sm font-light tracking-wider transition-colors whitespace-nowrap',
    linkHover: 'hover:text-gray-600',
    activeIndicator: 'absolute -bottom-1 left-0 right-0 h-0.5',
    scrambleText: 'text-xs tracking-wider',
  },
  
  // Drawer
  drawer: {
    panel: 'fixed inset-0 z-[45]',
    navLink: 'text-lg font-light tracking-wider transition-colors',
    navLinkActive: 'font-bold',
    navLinkInactive: 'hover:text-black',
    socialLink: 'flex items-center gap-4 transition-colors group',
    socialLinkText: 'text-lg font-light tracking-wider',
    socialLinkSubtext: 'text-sm',
    divider: 'border-b',
  },
  
  // Landing Text
  landingText: {
    container: 'flex flex-col w-full md:w-[80%] px-4 md:px-0',
    audienceButton: 'text-sm md:text-md py-0 transition-colors whitespace-nowrap touch-manipulation',
    audienceButtonActive: 'font-bold',
    audienceButtonInactive: 'hover:text-gray-600',
    text: 'text-lg md:text-2xl font-normal leading-relaxed md:leading-tight mb-8',
    textContainer: 'min-h-[5.5rem] md:min-h-[4rem]',
  },
  
  // Preloader
  preloader: {
    container: 'fixed inset-0 z-[100] pointer-events-none',
    text: 'mb-1 text-base md:text-lg',
    dots: 'inline-block text-xl w-6 ml-1',
  },
  
  // Hamburger Menu
  hamburger: {
    button: 'relative w-10 h-10 flex items-center justify-center focus:outline-none group',
    line: 'absolute rounded-full',
    lineSize: 'w-3.5 h-0.5',
  },
  
  // General
  link: {
    base: 'transition-colors',
    hover: 'hover:opacity-70',
  },
  
  // Typography
  typography: {
    heading: 'text-2xl font-normal',
    body: 'text-base font-light',
    small: 'text-sm font-light',
    muted: 'text-gray-500',
  },
} as const

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get theme-aware classes for a component
 */
export const getThemeClasses = (theme: Theme, component: keyof typeof componentStyles) => {
  const themeColors = themes[theme]
  const styles = componentStyles[component]
  
  return {
    ...styles,
    theme: themeColors,
  }
}

/**
 * Combine multiple class strings
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

/**
 * Get theme-specific color classes
 */
export const getThemeColor = (theme: Theme, colorKey: keyof ThemeColors): string => {
  return themes[theme][colorKey]
}

