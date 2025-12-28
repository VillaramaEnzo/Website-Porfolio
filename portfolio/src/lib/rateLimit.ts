/**
 * Rate Limiting Utility
 * 
 * Failed-attempt-based rate limiting:
 * - No limit on successful validations
 * - Only limits after multiple consecutive failed attempts
 * - Resets on first success
 * - Fast and responsive for legitimate users
 * 
 * Supports both in-memory (development) and Redis (production) storage:
 * - In-memory: Fast, works for single-instance deployments
 * - Redis: Persistent across serverless/edge function instances
 * 
 * Configuration via environment variables:
 * - RATE_LIMIT_ENABLED=false (disable rate limiting - useful for testing)
 * - RATE_LIMIT_MAX_FAILED_ATTEMPTS=5 (number of failures before blocking)
 * - RATE_LIMIT_BLOCK_DURATION_MINUTES=5 (how long to block in minutes)
 * - RATE_LIMIT_CLEANUP_INTERVAL_MINUTES=10 (cleanup interval in minutes)
 * - UPSTASH_REDIS_REST_URL (optional - for Redis-based rate limiting)
 * - UPSTASH_REDIS_REST_TOKEN (optional - for Redis-based rate limiting)
 * 
 * To disable for testing, add to your .env.local:
 *   RATE_LIMIT_ENABLED=false
 * 
 * For production with Redis (Upstash), add to your .env:
 *   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
 *   UPSTASH_REDIS_REST_TOKEN=your-token
 */

interface RateLimitEntry {
  failedAttempts: number
  lastAttempt: number
  blockedUntil?: number
}

// In-memory store for rate limiting (fallback when Redis not available)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Redis client (lazy-loaded if available)
let redisClient: any = null

/**
 * Initialize Redis client if credentials are available
 */
async function getRedisClient() {
  if (redisClient) return redisClient
  
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  
  if (!redisUrl || !redisToken) {
    return null // Redis not configured, use in-memory
  }
  
  try {
    // Dynamic import to avoid bundling Redis in client
    const { Redis } = await import('@upstash/redis')
    redisClient = new Redis({
      url: redisUrl,
      token: redisToken,
    })
    return redisClient
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Redis not available, falling back to in-memory rate limiting:', error)
    }
    return null
  }
}

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
 * Get rate limit entry from Redis or in-memory store
 */
async function getRateLimitEntry(ip: string): Promise<RateLimitEntry | null> {
  const redis = await getRedisClient()
  
  if (redis) {
    // Use Redis for persistent storage
    try {
      const key = `rate_limit:${ip}`
      const data = await redis.get(key)
      return data ? JSON.parse(data as string) : null
    } catch (error) {
      // Fallback to in-memory on Redis error
      if (process.env.NODE_ENV === 'development') {
        console.warn('Redis get failed, falling back to in-memory:', error)
      }
      return rateLimitStore.get(ip) || null
    }
  }
  
  // Use in-memory store
  return rateLimitStore.get(ip) || null
}

/**
 * Set rate limit entry in Redis or in-memory store
 */
async function setRateLimitEntry(ip: string, entry: RateLimitEntry): Promise<void> {
  const redis = await getRedisClient()
  
  if (redis) {
    // Use Redis for persistent storage
    try {
      const key = `rate_limit:${ip}`
      // Store with expiration (block duration + cleanup buffer)
      const ttl = entry.blockedUntil 
        ? Math.ceil((entry.blockedUntil - Date.now()) / 1000) + 60 // Add 1 minute buffer
        : CLEANUP_INTERVAL / 1000
      await redis.set(key, JSON.stringify(entry), { ex: Math.max(ttl, 60) })
      return
    } catch (error) {
      // Fallback to in-memory on Redis error
      if (process.env.NODE_ENV === 'development') {
        console.warn('Redis set failed, falling back to in-memory:', error)
      }
      rateLimitStore.set(ip, entry)
      return
    }
  }
  
  // Use in-memory store
  rateLimitStore.set(ip, entry)
}

/**
 * Check if request should be rate limited
 * Returns null if allowed, or error message if blocked
 */
export async function checkRateLimit(
  request: Request,
  isValid: boolean
): Promise<{ allowed: boolean; error?: string; retryAfter?: number }> {
  // If rate limiting is disabled, always allow
  if (!RATE_LIMIT_ENABLED) {
    return { allowed: true }
  }
  
  const ip = getClientIP(request)
  const now = Date.now()
  
  // Get or create rate limit entry
  let entry = await getRateLimitEntry(ip)
  
  if (!entry) {
    entry = {
      failedAttempts: 0,
      lastAttempt: now,
    }
    await setRateLimitEntry(ip, entry)
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
    await setRateLimitEntry(ip, entry)
    return { allowed: true }
  } else {
    // Failure - increment counter
    entry.failedAttempts++
    entry.lastAttempt = now
    
    // Block if exceeded max failed attempts
    if (entry.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      entry.blockedUntil = now + BLOCK_DURATION
      const retryAfter = Math.ceil(BLOCK_DURATION / 1000) // seconds
      await setRateLimitEntry(ip, entry)
      return {
        allowed: false,
        error: 'Too many failed attempts. Please try again later.',
        retryAfter,
      }
    }
    
    // Still allowed, but track the failure
    await setRateLimitEntry(ip, entry)
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

