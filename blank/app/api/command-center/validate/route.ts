import { NextRequest, NextResponse } from 'next/server'
import { SECRET_CODES_DATA } from '@/app/utils/secret.server'

const MAX_BODY_SIZE = 1024

const WINDOW_MS = 60_000
const MAX_FAILED_ATTEMPTS = 8
const cooldownByIp = new Map<string, { count: number; resetAt: number }>()

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip: string): { limited: boolean; retryAfter?: number } {
  const now = Date.now()
  const record = cooldownByIp.get(ip)
  if (!record) return { limited: false }

  if (record.resetAt <= now) {
    cooldownByIp.delete(ip)
    return { limited: false }
  }

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    return { limited: true, retryAfter: Math.ceil((record.resetAt - now) / 1000) }
  }

  return { limited: false }
}

function trackAttempt(ip: string, wasValid: boolean) {
  const now = Date.now()
  const existing = cooldownByIp.get(ip)

  if (wasValid) {
    cooldownByIp.delete(ip)
    return
  }

  if (!existing || existing.resetAt <= now) {
    cooldownByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return
  }

  cooldownByIp.set(ip, { count: existing.count + 1, resetAt: existing.resetAt })
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limit = isRateLimited(ip)
    if (limit.limited) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Too many attempts. Please try again shortly.',
          retryAfter: limit.retryAfter,
        },
        {
          status: 429,
          headers: limit.retryAfter ? { 'Retry-After': String(limit.retryAfter) } : undefined,
        },
      )
    }

    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json({ valid: false, error: 'Request body too large' }, { status: 413 })
    }

    const rawBody = await request.text()
    if (rawBody.length > MAX_BODY_SIZE) {
      return NextResponse.json({ valid: false, error: 'Request body too large' }, { status: 413 })
    }

    const body = JSON.parse(rawBody) as { code?: unknown }
    const code = typeof body.code === 'string' ? body.code.trim().toLowerCase() : ''
    if (!code) {
      return NextResponse.json(
        { valid: false, error: 'Invalid request: code is required' },
        { status: 400 },
      )
    }

    const codeConfig = SECRET_CODES_DATA[code]
    const isValid = Boolean(codeConfig)
    trackAttempt(ip, isValid)

    return NextResponse.json({
      valid: isValid,
      description: codeConfig?.description,
      action: codeConfig?.action,
    })
  } catch {
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Command center validation API is running',
    endpoint: 'POST /api/command-center/validate',
  })
}
