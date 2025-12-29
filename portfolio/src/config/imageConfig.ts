/**
 * Image Configuration
 * 
 * Controls how images are served in the gallery.
 * Switch between development (Picsum) and production (API) modes.
 */

export type ImageSource = 'picsum' | 'api'

export interface ImageConfig {
  /**
   * Image source mode:
   * - 'picsum': Use Picsum placeholder images (development)
   * - 'api': Use protected API route (production)
   */
  source: ImageSource
  
  /**
   * Enable protection features (referrer checking, rate limiting, etc.)
   * Only applies when source is 'api'
   */
  enableProtection: boolean
  
  /**
   * Allowed referrer domains for image requests
   * Only checked when enableProtection is true
   */
  allowedReferrers: string[]
  
  /**
   * Base URL for API image serving
   * Only used when source is 'api'
   */
  apiBaseUrl: string
}

/**
 * Current image configuration
 * 
 * To switch to production mode:
 * 1. Set source to 'api'
 * 2. Set enableProtection to true
 * 3. Update allowedReferrers with your domain
 * 4. Ensure images are stored in private storage (not /public)
 */
export const imageConfig: ImageConfig = {
  source: 'picsum', // Change to 'api' when ready for production
  enableProtection: false, // Enable when using 'api' source
  allowedReferrers: [
    'localhost',
    '127.0.0.1',
    // Add your production domain here:
    // 'yourdomain.com',
    // 'www.yourdomain.com',
  ],
  apiBaseUrl: '/api/images', // API route base path
}

/**
 * Check if we're in development mode (using Picsum)
 */
export const isDevelopmentMode = (): boolean => {
  return imageConfig.source === 'picsum'
}

/**
 * Check if protection is enabled
 */
export const isProtectionEnabled = (): boolean => {
  return imageConfig.source === 'api' && imageConfig.enableProtection
}

