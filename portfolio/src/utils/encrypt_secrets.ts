/**
 * Secret Codes Encryption/Decryption Utility
 * 
 * Client-side API client for validating secret codes.
 * Codes are validated server-side via API - never exposed to client.
 * 
 * This file handles:
 * - API communication with server-side validation endpoint
 * - Future encryption/decryption if codes are stored encrypted
 * - Caching validation results for better performance
 */

export interface SecretCode {
  code: string
  description: string
}

export interface ValidationResponse {
  valid: boolean
  description?: string
  action?: string // Action type to execute (not the code string - keeps codes secure)
  error?: string
  retryAfter?: number // Seconds until rate limit resets
}

// Cache for validation results (prevents repeated API calls for same code)
const validationCache = new Map<string, { valid: boolean; description?: string; action?: string; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Validate a secret code via server-side API
 * Codes are validated server-side - never exposed to client bundle
 */
export async function validateSecretCode(code: string): Promise<ValidationResponse> {
  const normalizedCode = code.trim().toLowerCase()

  // Check cache first
  const cached = validationCache.get(normalizedCode)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return {
      valid: cached.valid,
      description: cached.description,
      action: cached.action,
    }
  }

  try {
    const response = await fetch('/api/validate-secret-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: normalizedCode }),
    })

    if (!response.ok) {
      // Handle rate limiting (429 Too Many Requests)
      if (response.status === 429) {
        const data: ValidationResponse = await response.json()
        return data // Return rate limit error with retryAfter
      }
      throw new Error(`API error: ${response.status}`)
    }

    const data: ValidationResponse = await response.json()

    // Cache the result
    validationCache.set(normalizedCode, {
      valid: data.valid,
      description: data.description,
      action: data.action,
      timestamp: Date.now(),
    })

    return data
  } catch (error) {
    // Only log errors in development to avoid leaking info in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error validating secret code:', error)
    }
    return {
      valid: false,
      error: 'Failed to validate code',
    }
  }
}

/**
 * Check if a string matches any secret code (async - calls API)
 * Use this for real-time validation
 */
export async function isSecretCode(input: string): Promise<boolean> {
  const result = await validateSecretCode(input)
  return result.valid
}

/**
 * Get secret code by input (case-insensitive) - returns the code if valid
 * Use this to get the normalized code string
 */
export async function getSecretCode(input: string): Promise<string | null> {
  const normalizedInput = input.trim().toLowerCase()
  const result = await validateSecretCode(normalizedInput)
  return result.valid ? normalizedInput : null
}

/**
 * Get all secret codes with descriptions
 * Note: This doesn't fetch from API - codes are server-side only
 * Use this for UI display purposes only (if needed)
 */
export function getSecretCodes(): SecretCode[] {
  // Return empty array - codes are server-side only
  // If you need to display available codes, create a separate API endpoint
  return []
}

/**
 * Clear validation cache (useful for testing or forced refresh)
 */
export function clearValidationCache(): void {
  validationCache.clear()
}

/**
 * TODO: Future encryption functions
 * 
 * If codes are stored encrypted on the server:
 * - encryptSecretCodes(data: SecretCodeData): EncryptedData
 * - decryptSecretCodes(encrypted: EncryptedData): SecretCodeData
 * - validateEncryptedCode(input: string, encrypted: EncryptedData): boolean
 */
