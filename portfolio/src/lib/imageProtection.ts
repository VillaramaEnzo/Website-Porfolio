/**
 * Image Protection Utilities
 * 
 * Server-side utilities for protecting image access.
 * These functions are used in API routes to validate requests.
 */

import { NextRequest } from 'next/server'
import { imageConfig, isProtectionEnabled } from '@/config/imageConfig'

export interface ProtectionResult {
  allowed: boolean
  reason?: string
}

/**
 * Check if request referrer is allowed
 */
export function checkReferrer(request: NextRequest): ProtectionResult {
  if (!isProtectionEnabled()) {
    return { allowed: true }
  }

  const referer = request.headers.get('referer')
  
  if (!referer) {
    // Allow requests without referer in development
    if (process.env.NODE_ENV === 'development') {
      return { allowed: true }
    }
    return {
      allowed: false,
      reason: 'Missing referer header',
    }
  }

  // Check if referer matches any allowed domain
  const refererUrl = new URL(referer)
  const refererHost = refererUrl.hostname

  const isAllowed = imageConfig.allowedReferrers.some((allowedDomain) => {
    // Exact match
    if (refererHost === allowedDomain) {
      return true
    }
    // Subdomain match (e.g., www.yourdomain.com matches yourdomain.com)
    if (refererHost.endsWith(`.${allowedDomain}`)) {
      return true
    }
    return false
  })

  if (!isAllowed) {
    return {
      allowed: false,
      reason: `Referer ${refererHost} not allowed`,
    }
  }

  return { allowed: true }
}

/**
 * Validate image request
 * Combines multiple protection checks
 */
export function validateImageRequest(request: NextRequest): ProtectionResult {
  // Check referrer
  const refererCheck = checkReferrer(request)
  if (!refererCheck.allowed) {
    return refererCheck
  }

  // Add more protection checks here:
  // - Rate limiting
  // - User authentication
  // - IP whitelisting
  // - etc.

  return { allowed: true }
}

/**
 * Get cache headers for image responses
 */
export function getImageCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    // Prevent caching in browser dev tools
    'Pragma': 'no-cache',
    'Expires': '0',
  }
}

