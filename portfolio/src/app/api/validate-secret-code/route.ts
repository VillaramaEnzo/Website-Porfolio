/**
 * Secret Code Validation API
 * 
 * Server-side endpoint for validating secret codes.
 * Codes are stored server-side and never exposed to the client.
 * 
 * Rate limiting: Only limits after 5+ consecutive failed attempts
 * - No throttling for successful validations
 * - Fast and responsive for legitimate users
 * - Protects against brute force attacks
 * 
 * POST /api/validate-secret-code
 * Body: { code: string }
 * Returns: { valid: boolean, description?: string, action?: string, error?: string, retryAfter?: number }
 * 
 * Note: Returns action type instead of code string to keep codes server-side only.
 */

import { NextRequest, NextResponse } from 'next/server'
import { SECRET_CODES_DATA } from '@/utils/secret.server'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Invalid request: code is required' },
        { status: 400 }
      )
    }

    // Normalize the input code
    const normalizedCode = code.trim().toLowerCase()

    // Check if code exists in SECRET_CODES_DATA
    const isValid = normalizedCode in SECRET_CODES_DATA
    const codeConfig = isValid ? SECRET_CODES_DATA[normalizedCode] : undefined
    const description = codeConfig?.description
    const action = codeConfig?.action

    // Check rate limit (passes validation result to track failures)
    const rateLimitResult = checkRateLimit(request, isValid)
    
    // If rate limited, return error
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          valid: false,
          error: rateLimitResult.error,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429, // Too Many Requests
          headers: rateLimitResult.retryAfter
            ? {
                'Retry-After': rateLimitResult.retryAfter.toString(),
              }
            : undefined,
        }
      )
    }

    // Return validation result with action type (not the code string)
    return NextResponse.json({
      valid: isValid,
      description: description,
      action: action, // Action type for client to execute (codes stay server-side)
    })
  } catch (error) {
    console.error('Error validating secret code:', error)
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to check if API is working (without exposing codes)
export async function GET() {
  return NextResponse.json({
    message: 'Secret code validation API is running',
    endpoint: 'POST /api/validate-secret-code',
  })
}

