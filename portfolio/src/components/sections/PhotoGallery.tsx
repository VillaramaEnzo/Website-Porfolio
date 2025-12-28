'use client'

import { useState, useEffect } from 'react'

type GalleryLayout = 'grid' | 'masonry'
type MobileColumns = 1 | 3

interface GalleryItem {
  id: number
  aspectRatio?: number // Pre-calculated or will be calculated on load
  columnSpan?: number // For masonry: 1 or 2 columns
  imageUrl?: string // Picsum image URL
}

export default function PhotoGallery() {
  const [layout, setLayout] = useState<GalleryLayout>('grid')
  const [mobileColumns, setMobileColumns] = useState<MobileColumns>(3)
  const [items, setItems] = useState<GalleryItem[]>([])
  
  const rows = 4
  const cols = 8
  const totalItems = rows * cols

  // Initialize items with realistic aspect ratios
  // Square (1:1), Portrait (1800x2400 = 0.75), Landscape (2400x1800 = 1.33)
  useEffect(() => {
    const initialItems: GalleryItem[] = Array.from({ length: totalItems }).map((_, i) => {
      // Mix of different aspect ratios
      let aspectRatio: number
      let columnSpan: number = 1
      
      // Pattern: square, portrait, landscape, square, portrait, landscape...
      const pattern = i % 3
      let imageUrl: string
      
      if (pattern === 0) {
        aspectRatio = 1.0 // Square (1:1)
        // Some squares can span 2 columns and 2 rows
        columnSpan = i % 9 === 0 ? 2 : 1
        imageUrl = `https://picsum.photos/800/800?random=${i}` // Square image
      } else if (pattern === 1) {
        aspectRatio = 0.75 // Portrait (1800x2400 = 3:4)
        columnSpan = 1
        imageUrl = `https://picsum.photos/600/800?random=${i}` // Portrait image
      } else {
        aspectRatio = 1.33 // Landscape (2400x1800 = 4:3)
        // Some landscapes can span 2 columns
        columnSpan = i % 6 === 2 ? 2 : 1
        imageUrl = `https://picsum.photos/800/600?random=${i}` // Landscape image
      }
      
      return {
        id: i,
        aspectRatio,
        columnSpan,
        imageUrl
      }
    })
    setItems(initialItems)
  }, [totalItems])

  const toggleLayout = () => {
    setLayout(prev => prev === 'grid' ? 'masonry' : 'grid')
  }

  const toggleMobileLayout = () => {
    setMobileColumns(prev => prev === 1 ? 3 : 1)
  }

  return (
    <div className="w-full h-full bg-white overflow-x-hidden overflow-y-auto relative">
      {/* Layout Toggle Button */}
      <button
        onClick={toggleLayout}
        className="fixed top-4 right-4 z-50 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-mono px-3 py-2 rounded hover:bg-gray-900 transition-colors"
        aria-label={`Switch to ${layout === 'grid' ? 'masonry' : 'grid'} layout`}
      >
        {layout === 'grid' ? 'Masonry' : 'Grid'}
      </button>

      {/* Mobile Column Toggle Button */}
      <button
        onClick={toggleMobileLayout}
        className="fixed top-16 right-4 z-50 md:hidden bg-gray-900/80 backdrop-blur-sm text-white text-xs font-mono px-3 py-2 rounded hover:bg-gray-900 transition-colors"
        aria-label={`Switch to ${mobileColumns === 1 ? '3' : '1'} column layout`}
      >
        {mobileColumns === 1 ? '1 col' : '3 cols'}
      </button>

      {/* Grid Container */}
      {layout === 'grid' ? (
        <div 
          className={`grid px-3 sm:px-4 md:px-6 lg:px-8 gap-[4px] ${
            mobileColumns === 1 ? 'grid-cols-1' : 'grid-cols-3'
          } md:grid-cols-4 xl:grid-cols-8`}
          style={{
            paddingTop: '40px',
            paddingBottom: '40px',
            boxSizing: 'border-box',
            // Remove minHeight to prevent stretching - let content determine height
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-sm cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out overflow-hidden"
            >
              <img
                src={item.imageUrl}
                alt={`Gallery image ${item.id}`}
                className="w-full h-full object-cover"
                style={{
                  aspectRatio: '1 / 1',
                  width: '100%',
                  height: '100%',
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="px-3 sm:px-4 md:px-6 lg:px-8 [column-count:2] md:[column-count:4] xl:[column-count:8]"
          style={{
            paddingTop: '40px',
            paddingBottom: '40px',
            boxSizing: 'border-box',
            minHeight: '100vh',
            columnGap: '4px',
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-sm cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out overflow-hidden mb-[4px] break-inside-avoid"
              style={{
                aspectRatio: item.aspectRatio ? `${1 / item.aspectRatio}` : undefined,
                width: '100%',
              }}
            >
              <img
                src={item.imageUrl}
                alt={`Gallery image ${item.id}`}
                className="w-full h-full object-cover"
                style={{
                  width: '100%',
                  height: '100%',
                }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
