/**
 * Rate Limiting Utility
 * 
 * Failed-attempt-based rate limiting:
 * - No limit on successful validations
 * - Only limits after multiple consecutive failed attempts
 * - Resets on first success
 * - Fast and responsive for legitimate users
 * 
 * Configuration via environment variables:
 * - RATE_LIMIT_ENABLED=false (disable rate limiting - useful for testing)
 * - RATE_LIMIT_MAX_FAILED_ATTEMPTS=5 (number of failures before blocking)
 * - RATE_LIMIT_BLOCK_DURATION_MINUTES=5 (how long to block in minutes)
 * - RATE_LIMIT_CLEANUP_INTERVAL_MINUTES=10 (cleanup interval in minutes)
 * 
 * To disable for testing, add to your .env.local:
 *   RATE_LIMIT_ENABLED=false
 */

interface RateLimitEntry {
  failedAttempts: number
  lastAttempt: number
  blockedUntil?: number
}

// In-memory store for rate limiting (per IP)
// In production, consider using Redis for distributed systems
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration - easily adjustable via environment variables
const RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_ENABLED !== 'false' // Default: enabled (set to 'false' to disable)
const MAX_FAILED_ATTEMPTS = parseInt(process.env.RATE_LIMIT_MAX_FAILED_ATTEMPTS || '5', 10) // Default: 5
const BLOCK_DURATION = parseInt(process.env.RATE_LIMIT_BLOCK_DURATION_MINUTES || '5', 10) * 60 * 1000 // Default: 5 minutes (in ms)
const CLEANUP_INTERVAL = parseInt(process.env.RATE_LIMIT_CLEANUP_INTERVAL_MINUTES || '10', 10) * 60 * 1000 // Default: 10 minutes (in ms)

/**
 * Get client IP from request
 */
function getClientIP(request: Request): string {
  // Try various headers (for different hosting environments)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare
  
  return (
    (forwarded?.split(',')[0]?.trim()) ||
    realIP ||
    cfConnectingIP ||
    'unknown'
  )
}

/**
 * Check if request should be rate limited
 * Returns null if allowed, or error message if blocked
 */
export function checkRateLimit(
  request: Request,
  isValid: boolean
): { allowed: boolean; error?: string; retryAfter?: number } {
  // If rate limiting is disabled, always allow
  if (!RATE_LIMIT_ENABLED) {
    return { allowed: true }
  }
  
  const ip = getClientIP(request)
  const now = Date.now()
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(ip)
  
  if (!entry) {
    entry = {
      failedAttempts: 0,
      lastAttempt: now,
    }
    rateLimitStore.set(ip, entry)
  }
  
  // If currently blocked, check if block has expired
  if (entry.blockedUntil && now < entry.blockedUntil) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000) // seconds
    return {
      allowed: false,
      error: 'Too many failed attempts. Please try again later.',
      retryAfter,
    }
  }
  
  // If block expired, reset
  if (entry.blockedUntil && now >= entry.blockedUntil) {
    entry.failedAttempts = 0
    entry.blockedUntil = undefined
  }
  
  // Update based on validation result
  if (isValid) {
    // Success - reset failed attempts counter
    entry.failedAttempts = 0
    entry.blockedUntil = undefined
    entry.lastAttempt = now
    return { allowed: true }
  } else {
    // Failure - increment counter
    entry.failedAttempts++
    entry.lastAttempt = now
    
    // Block if exceeded max failed attempts
    if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      entry.blockedUntil = now + BLOCK_DURATION
      const retryAfter = Math.ceil(BLOCK_DURATION / 1000) // seconds
      return {
        allowed: false,
        error: 'Too many failed attempts. Please try again later.',
        retryAfter,
      }
    }
    
    // Still allowed, but track the failure
    return { allowed: true }
  }
}

/**
 * Clean up old entries (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  const maxAge = 30 * 60 * 1000 // 30 minutes
  
  for (const [ip, entry] of rateLimitStore.entries()) {
    // Remove entries that are old and not blocked
    if (
      now - entry.lastAttempt > maxAge &&
      (!entry.blockedUntil || now >= entry.blockedUntil)
    ) {
      rateLimitStore.delete(ip)
    }
  }
}

// Run cleanup periodically
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, CLEANUP_INTERVAL)
}

