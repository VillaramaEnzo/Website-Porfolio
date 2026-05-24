export interface ValidationResponse {
  valid: boolean
  description?: string
  action?: string
  error?: string
  retryAfter?: number
}

const validationCache = new Map<
  string,
  { valid: boolean; description?: string; action?: string; timestamp: number }
>()

const CACHE_DURATION_MS = 5 * 60 * 1000

export async function validateSecretCode(code: string): Promise<ValidationResponse> {
  const normalizedCode = code.trim().toLowerCase()
  if (!normalizedCode) {
    return { valid: false, error: 'Code is required' }
  }

  const cached = validationCache.get(normalizedCode)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return {
      valid: cached.valid,
      description: cached.description,
      action: cached.action,
    }
  }

  try {
    const response = await fetch('/api/command-center/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: normalizedCode }),
    })

    const data: ValidationResponse = await response.json()
    if (!response.ok) {
      return data
    }

    validationCache.set(normalizedCode, {
      valid: data.valid,
      description: data.description,
      action: data.action,
      timestamp: Date.now(),
    })

    return data
  } catch {
    return { valid: false, error: 'Failed to validate code' }
  }
}

export function clearValidationCache() {
  validationCache.clear()
}
