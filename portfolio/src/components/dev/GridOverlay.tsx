'use client'

import { useState, useEffect, useMemo } from 'react'

/**
 * Layout configuration type
 */
type GridLayout = {
  name: string
  enabled: boolean
  gap: string // Tailwind gap classes (e.g., 'gap-3 sm:gap-4 md:gap-6'G or 'gap-0')
  padding: string // Tailwind padding classes (e.g., 'px-3 sm:px-4 md:px-6 lg:px-8' or 'px-0')
  columns: {
    mobile: number // Number of columns on mobile (default breakpoint)
    tablet: number // Number of columns on tablet (md breakpoint)
    desktop: number // Number of columns on desktop (lg/xl breakpoint)
  }
  gridClasses?: string // Optional: override default grid-cols classes
}

/**
 * Helper function to get Tailwind grid-cols classes
 * Maps column counts to Tailwind classes (required for JIT to work)
 */
function getGridColsClasses(mobile: number, tablet: number, desktop: number): string {
  const mobileMap: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    8: 'grid-cols-8',
    12: 'grid-cols-12',
    16: 'grid-cols-16',
  }
  
  const tabletMap: Record<number, string> = {
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
    8: 'md:grid-cols-8',
    12: 'md:grid-cols-12',
    16: 'md:grid-cols-16',
  }
  
  const desktopMap: Record<number, string> = {
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
    8: 'xl:grid-cols-8',
    12: 'xl:grid-cols-12',
    // 16 columns uses arbitrary value (see layout-5 gridClasses override)
  }
  
  return `${mobileMap[mobile] || 'grid-cols-4'} ${tabletMap[tablet] || 'md:grid-cols-8'} ${desktopMap[desktop] || 'xl:grid-cols-12'}`
}

/**
 * Layout configurations
 * Easily add/remove layouts by modifying this array
 * Set enabled: false to exclude from rotation
 */
const GRID_LAYOUTS: GridLayout[] = [
  {
    name: 'Grid off',
    enabled: true,
    gap: 'gap-0',
    padding: 'px-0',
    columns: {
      mobile: 0,
      tablet: 0,
      desktop: 0,
    },
  },
  {
    name: '12-8-4 with gaps',
    enabled: true,
    gap: 'gap-3 sm:gap-4 md:gap-6',
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
    columns: {
      mobile: 4,
      tablet: 8,
      desktop: 12,
    },
  },
  {
    name: '12-8-4 no gaps',
    enabled: false,
    gap: 'gap-0',
    padding: 'px-0',
    columns: {
      mobile: 4,
      tablet: 8,
      desktop: 12,
    },
  },
  {
    name: '12-8-4 minimal gaps',
    enabled: false,
    gap: 'gap-1 sm:gap-2 md:gap-3',
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
    columns: {
      mobile: 4,
      tablet: 8,
      desktop: 12,
    },
  },
  {
    name: '12-8-4 large gaps',
    enabled: false,
    gap: 'gap-6 sm:gap-8 md:gap-12',
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
    columns: {
      mobile: 4,
      tablet: 8,
      desktop: 12,
    },
  },
  {
    name: '3-column grid',
    enabled: true,
    gap: 'gap-3 sm:gap-4 md:gap-6',
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
    columns: {
      mobile: 2,
      tablet: 3,
      desktop: 3,
    },
  },
  {
    name: '4-column grid',
    enabled: true,
    gap: 'gap-3 sm:gap-4 md:gap-6',
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
    columns: {
      mobile: 2,
      tablet: 4,
      desktop: 4,
    },
  },
  {
    name: '5-column grid',
    enabled: true,
    gap: 'gap-3 sm:gap-4 md:gap-6',
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
    columns: {
      mobile: 2,
      tablet: 4,
      desktop: 5,
    },
  },
  {
    name: '6-column grid',
    enabled: true,
    gap: 'gap-3 sm:gap-4 md:gap-6',
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
    columns: {
      mobile: 2,
      tablet: 4,
      desktop: 6,
    },
  },
  {
    name: 'Gallery Grid',
    enabled: true,
    gap: 'gap-[4px]',
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
    columns: {
      mobile: 3,
      tablet: 4,
      desktop: 8,
    },
  },
  {
    name: '16-column grid',
    enabled: false,
    gap: 'gap-3 sm:gap-4 md:gap-6',
    padding: 'px-3 sm:px-4 md:px-6 lg:px-8',
    columns: {
      mobile: 4,
      tablet: 8,
      desktop: 16,
    },
    // Use arbitrary values for 16 columns (Tailwind only supports up to 12 by default)
    gridClasses: 'grid-cols-4 md:grid-cols-8 xl:grid-cols-[repeat(16,minmax(0,1fr))]',
  },
  {
    name: '20/20/20/40',
    enabled: true,
    gap: 'gap-0',
    padding: 'px-0',
    columns: {
      mobile: 2,
      tablet: 4,
      desktop: 4,
    },
    // Custom asymmetric grid: 20% 20% 20% 40%
    gridClasses: 'grid-cols-2 md:grid-cols-4 xl:grid-cols-[20%_20%_20%_40%]',
  },
  
  {
    name: '30/70',
    enabled: true,
    gap: 'gap-0',
    padding: 'px-0',
    columns: {
      mobile: 2,
      tablet: 4,
      desktop: 4,
    },
    // Custom asymmetric grid: 20% 20% 20% 40%
    gridClasses: 'grid-cols-2 md:grid-cols-4 xl:grid-cols-[30%_70%]',
  },

  {
    name: '70/30',
    enabled: true,
    gap: 'gap-0',
    padding: 'px-0',
    columns: {
      mobile: 2,
      tablet: 4,
      desktop: 4,
    },
    // Custom asymmetric grid: 20% 20% 20% 40%
    gridClasses: 'grid-cols-2 md:grid-cols-4 xl:grid-cols-[70%_30%]',
  },
  
]

/**
 * Development Grid Overlay Component
 * 
 * Shows a responsive grid overlay for layout debugging.
 * Only visible in development mode.
 * 
 * Features:
 * - Multiple configurable layout presets (toggleable)
 *   - Different column systems (4, 6, 8, 12, 16 columns)
 *   - Various gap sizes (none, minimal, standard, large)
 *   - Customizable padding
 * - Responsive column layouts (mobile/tablet/desktop)
 * - Full viewport width
 * - Toggleable visibility
 * - Non-intrusive (pointer-events-none)
 * - Press Shift + G to cycle through enabled layouts
 * 
 * Layouts:
 * - Layout 1: 12-8-4 with standard gaps
 * - Layout 2: 12-8-4 no gaps
 * - Layout 3: 12-8-4 minimal gaps
 * - Layout 4: 12-8-4 large gaps
 * - Layout 5: 3-column grid
 * - Layout 6: 4-column grid
 * - Layout 7: 5-column grid
 * - Layout 8: 6-column grid
 * - Layout 9: 16-column grid
 * - Layout 10: 20/20/20/40% asymmetric columns
 */

export default function GridOverlay() {
  const [currentLayoutIndex, setCurrentLayoutIndex] = useState<number | null>(0) // null = hidden
  const [lastActiveLayoutIndex, setLastActiveLayoutIndex] = useState<number>(0) // Track last active layout before hiding
  const [isMounted, setIsMounted] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipOpacity, setTooltipOpacity] = useState(0)

  // Get only enabled layouts
  const enabledLayouts = useMemo(() => {
    return GRID_LAYOUTS.filter(layout => layout.enabled)
  }, [])

  // Get current layout (null if hidden)
  const currentLayout = useMemo(() => {
    if (currentLayoutIndex === null || currentLayoutIndex >= enabledLayouts.length) {
      return null
    }
    return enabledLayouts[currentLayoutIndex]
  }, [currentLayoutIndex, enabledLayouts])

  // All hooks must be called before any conditional returns
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Show tooltip when layout changes
  useEffect(() => {
    if (currentLayoutIndex !== null && currentLayout) {
      // Show tooltip immediately
      setShowTooltip(true)
      setTooltipOpacity(1)
      
      // Start fading out after 1.5 seconds
      const fadeTimer = setTimeout(() => {
        setTooltipOpacity(0)
      }, 1500)
      
      // Hide tooltip after fade completes
      const hideTimer = setTimeout(() => {
        setShowTooltip(false)
      }, 2000) // 1.5s fade + 0.5s transition
      
      return () => {
        clearTimeout(fadeTimer)
        clearTimeout(hideTimer)
      }
    } else {
      // Hide tooltip when grid is hidden
      setShowTooltip(false)
      setTooltipOpacity(0)
    }
  }, [currentLayoutIndex, currentLayout])

  // Handle keyboard shortcuts: Shift + G (cycle) and Shift + Cmd/Ctrl + G (toggle)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if not typing in an input/textarea
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      const isShiftG = e.shiftKey && !e.metaKey && !e.ctrlKey && (e.key === 'g' || e.key === 'G')
      const isShiftCmdG = e.shiftKey && (e.metaKey || e.ctrlKey) && (e.key === 'g' || e.key === 'G')

      if (isShiftCmdG) {
        // Shift + Cmd/Ctrl + G: Toggle grid on/off
        e.preventDefault()
        setCurrentLayoutIndex(prev => {
          if (prev === null) {
            // Grid is off, turn it on with last active layout
            return lastActiveLayoutIndex
          } else {
            // Grid is on, turn it off and save current layout
            setLastActiveLayoutIndex(prev)
            return null
          }
        })
      } else if (isShiftG) {
        // Shift + G: Cycle through layouts (or restore if hidden)
        e.preventDefault()
        setCurrentLayoutIndex(prev => {
          // If hidden (null), restore last active layout
          if (prev === null) {
            return lastActiveLayoutIndex
          }
          // If at last layout, cycle back to first layout (index 0)
          if (prev >= enabledLayouts.length - 1) {
            return 0
          }
          // Otherwise, go to next layout
          return prev + 1
        })
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [enabledLayouts.length, lastActiveLayoutIndex])

  // Only render in development - check after all hooks
  if (process.env.NODE_ENV !== 'development' || !isMounted) {
    return null
  }

  // Don't render if no layout is selected (hidden) or if current layout is "Grid off"
  if (!currentLayout || currentLayout.name === 'Grid off') {
    return null
  }

  // Generate grid classes based on column configuration
  const gridClasses = currentLayout.gridClasses || 
    getGridColsClasses(
      currentLayout.columns.mobile,
      currentLayout.columns.tablet,
      currentLayout.columns.desktop
    )

  // Get the maximum number of columns to render
  const maxColumns = Math.max(
    currentLayout.columns.mobile,
    currentLayout.columns.tablet,
    currentLayout.columns.desktop
  )

  return (
    <div 
      className="fixed inset-0 z-[98] pointer-events-none"
      aria-hidden="true"
    >
      {/* Layout name tooltip - top left corner */}
      {showTooltip && currentLayout && (
        <div
          className="fixed top-4 left-4 z-[99] pointer-events-none"
          style={{
            opacity: tooltipOpacity,
            transition: 'opacity 0.5s ease-out',
          }}
        >
          <div className="bg-black/80 backdrop-blur-sm text-white text-sm font-medium px-3 py-2 rounded-lg shadow-lg">
            {currentLayout.name}
          </div>
        </div>
      )}

      {/* Full viewport grid - Responsive layout */}
      <div className={`w-full h-full grid ${gridClasses} ${currentLayout.gap} ${currentLayout.padding}`}>
        {/* Render columns - responsive visibility based on layout config */}
        {Array.from({ length: maxColumns }).map((_, index) => {
          const isFirst = index === 0
          const isLast = index === maxColumns - 1
          
          // Determine visibility classes based on column configuration
          // Mobile: show 0 to (mobile-1)
          // Tablet: show 0 to (tablet-1)
          // Desktop: show all columns
          let visibilityClass = ''
          if (index < currentLayout.columns.mobile) {
            // Visible on all breakpoints
            visibilityClass = ''
          } else if (index < currentLayout.columns.tablet) {
            // Hidden on mobile, visible on tablet+
            visibilityClass = 'hidden md:block'
          } else {
            // Hidden on mobile and tablet, visible on desktop (xl)
            visibilityClass = 'hidden xl:block'
          }
          
          return (
            <div
              key={index}
              className={`h-full bg-red-500/5 ${visibilityClass}`}
              style={{
                borderLeft: isFirst || (!isFirst && !isLast) 
                  ? '1px solid rgba(239, 68, 68, 0.3)' 
                  : 'none',
                borderRight: isLast || (!isFirst && !isLast)
                  ? '1px solid rgba(239, 68, 68, 0.3)'
                  : 'none',
              }}
            />
          ) 
        })}
      </div>
    </div>
  )
}

