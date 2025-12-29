'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type Item = {
  id: number
  src: string
  aspectRatio: 'square' | 'portrait' | 'landscape'
}

type GridVariant = 'normal' | 'span'

const GAP = 4

export default function PhotoGallery() {
  const [variant, setVariant] = useState<GridVariant>('normal')

  /* ----------------------- Data ----------------------- */
  const items: Item[] = Array.from({ length: 80 }).map((_, i) => {
    // Mix of different aspect ratios
    const pattern = i % 3
    let aspectRatio: 'square' | 'portrait' | 'landscape'
    let src: string
    
    if (pattern === 0) {
      aspectRatio = 'square'
      src = `https://picsum.photos/800/800?${i}`
    } else if (pattern === 1) {
      aspectRatio = 'portrait'
      src = `https://picsum.photos/600/800?${i}`
    } else {
      aspectRatio = 'landscape'
      src = `https://picsum.photos/800/600?${i}`
    }
    
    return {
      id: i,
      src,
      aspectRatio,
    }
  })

  /* ------------------- Span Logic -------------------- */
  // Determine which items should span in span-grid variant
  // Aspect-ratio-aware: squares can be 1x1, 2x2, 3x3, 4x4
  // Portraits (3:4) can be 1x1 or 3x4 only
  // Landscapes (4:3) can be 1x1 or 4x3 only
  const getItemSpans = (index: number, variant: GridVariant, aspectRatio: 'square' | 'portrait' | 'landscape') => {
    if (variant === 'normal') {
      return { colSpan: 1, rowSpan: 1 }
    }

    // Determine span size based on index pattern
    let spanSize: 1 | 2 | 3 | 4 = 1
    
    if (index % 12 === 0) {
      spanSize = 4 // Hero items
    } else if (index % 8 === 0) {
      spanSize = 3 // Featured items
    } else if (index % 6 === 0) {
      spanSize = 2 // Large items
    } else {
      spanSize = 1 // Normal items
    }

    // Apply aspect-ratio-aware spans
    if (aspectRatio === 'square') {
      // Squares: always square spans (1x1, 2x2, 3x3, 4x4)
      return { colSpan: spanSize, rowSpan: spanSize }
    } else if (aspectRatio === 'portrait') {
      // Portraits (3:4): maintain 3x4 ratio or stay 1x1
      if (spanSize === 1) {
        return { colSpan: 1, rowSpan: 1 } // Normal size (cropped to square)
      } else {
        // For any larger span, use 3x4 to maintain ratio
        return { colSpan: 3, rowSpan: 4 }
      }
    } else {
      // Landscapes (4:3): maintain 4x3 ratio or stay 1x1
      if (spanSize === 1) {
        return { colSpan: 1, rowSpan: 1 } // Normal size (cropped to square)
      } else {
        // For any larger span, use 4x3 to maintain ratio
        return { colSpan: 4, rowSpan: 3 }
      }
    }
  }

  /* ----------------------- UI ------------------------- */
  return (
    <div className="w-full h-full bg-white overflow-x-hidden overflow-y-auto relative">
      {/* Toggle Button */}
      <button
        onClick={() => setVariant(v => v === 'normal' ? 'span' : 'normal')}
        className="fixed top-4 right-4 z-50 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-mono px-3 py-2 rounded hover:bg-gray-900 transition-colors"
        aria-label={`Switch to ${variant === 'normal' ? 'span' : 'normal'} grid`}
      >
        {variant === 'normal' ? 'Span Grid' : 'Normal Grid'}
      </button>

      <div
        className="px-3 sm:px-4 md:px-6 lg:px-8"
        style={{
          paddingTop: '40px',
          paddingBottom: '40px',
          boxSizing: 'border-box',
        }}
      >
        <motion.div
          className="grid gap-[4px] grid-cols-3 md:grid-cols-4 xl:grid-cols-8"
          layout
          transition={{
            layout: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
          }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => {
              const spans = getItemSpans(index, variant, item.aspectRatio)
              
              // Calculate aspect ratio based on item type and spans
              const getAspectRatio = () => {
                if (variant === 'normal') {
                  return '1 / 1'
                }
                
                // For span grid, use the actual aspect ratio of the item
                if (item.aspectRatio === 'square') {
                  // Squares are always 1:1 regardless of span size
                  return '1 / 1'
                } else if (item.aspectRatio === 'portrait') {
                  // Portraits maintain 3:4 ratio (or 1:1 if span is 1x1)
                  return spans.colSpan === 1 && spans.rowSpan === 1 ? '1 / 1' : '3 / 4'
                } else {
                  // Landscapes maintain 4:3 ratio (or 1:1 if span is 1x1)
                  return spans.colSpan === 1 && spans.rowSpan === 1 ? '1 / 1' : '4 / 3'
                }
              }
              
              return (
                <motion.div
                  key={item.id}
                  layoutId={`gallery-item-${item.id}`}
                  layout
                  initial={false}
                  transition={{
                    layout: { 
                      duration: 0.6, 
                      ease: [0.4, 0, 0.2, 1],
                    }
                  }}
                  style={{
                    gridColumn: `span ${spans.colSpan}`,
                    gridRow: `span ${spans.rowSpan}`,
                    aspectRatio: getAspectRatio(),
                    width: '100%',
                  }}
                  className="rounded-sm cursor-pointer hover:opacity-80 transition-opacity duration-300 ease-in-out overflow-hidden"
                >
                  <img
                    src={item.src}
                    alt={`Gallery image ${item.id}`}
                    className="w-full h-full object-cover border-2 border-gray-200"
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    loading="lazy"
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
