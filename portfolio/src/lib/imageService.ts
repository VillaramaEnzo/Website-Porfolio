/**
 * Image Service
 * 
 * Centralized service for generating image URLs.
 * Handles switching between Picsum (dev) and API (prod) sources.
 */

import { imageConfig, isDevelopmentMode } from '@/config/imageConfig'

export interface ImageSize {
  width: number
  height: number
}

export interface ImageOptions {
  /**
   * Image ID (for API mode) or seed (for Picsum mode)
   */
  id: string | number
  
  /**
   * Image dimensions
   */
  size?: ImageSize
  
  /**
   * Aspect ratio type for Picsum images
   */
  aspectRatio?: 'square' | 'portrait' | 'landscape'
  
  /**
   * Optional size parameter for API mode (thumbnail, medium, full)
   */
  variant?: 'thumbnail' | 'medium' | 'full'
}

/**
 * Generate image URL based on current configuration
 */
export function getImageUrl(options: ImageOptions): string {
  const { id, size, aspectRatio, variant = 'medium' } = options

  if (isDevelopmentMode()) {
    // Use Picsum placeholder images
    return getPicsumUrl(id, size, aspectRatio)
  } else {
    // Use protected API route
    return getApiUrl(id, variant)
  }
}

/**
 * Generate Picsum placeholder URL
 */
function getPicsumUrl(
  id: string | number,
  size?: ImageSize,
  aspectRatio?: 'square' | 'portrait' | 'landscape'
): string {
  let width = 800
  let height = 800

  if (size) {
    width = size.width
    height = size.height
  } else if (aspectRatio) {
    // Default sizes based on aspect ratio
    switch (aspectRatio) {
      case 'square':
        width = 800
        height = 800
        break
      case 'portrait':
        width = 600
        height = 800
        break
      case 'landscape':
        width = 800
        height = 600
        break
    }
  }

  return `https://picsum.photos/${width}/${height}?random=${id}`
}

/**
 * Generate API route URL for protected images
 */
function getApiUrl(id: string | number, variant: 'thumbnail' | 'medium' | 'full'): string {
  const baseUrl = imageConfig.apiBaseUrl
  const queryParams = new URLSearchParams({ variant })
  return `${baseUrl}/${id}?${queryParams.toString()}`
}

/**
 * Generate thumbnail URL (optimized for grid view)
 */
export function getThumbnailUrl(id: string | number, aspectRatio?: 'square' | 'portrait' | 'landscape'): string {
  return getImageUrl({
    id,
    aspectRatio,
    variant: 'thumbnail',
    size: aspectRatio === 'portrait' 
      ? { width: 400, height: 533 }
      : aspectRatio === 'landscape'
      ? { width: 533, height: 400 }
      : { width: 400, height: 400 }
  })
}

/**
 * Generate full-size URL (for lightbox/modal view)
 */
export function getFullImageUrl(id: string | number): string {
  return getImageUrl({
    id,
    variant: 'full',
  })
}

