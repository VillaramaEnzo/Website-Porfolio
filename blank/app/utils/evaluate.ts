export interface EvaluateResult {
  success: boolean
  type: 'math' | 'currency' | 'metric' | null
  input: string
  result?: string
  formattedResult?: string
  error?: string
}

function normalizeNaturalLanguage(input: string): string {
  let normalized = input.trim()
  normalized = normalized.replace(/^(calculate|calc|what is|what's|compute|solve|evaluate)\s+/i, '')

  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+plus\s+(\d+(?:\.\d+)?)\b/gi, '$1 + $2')
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+minus\s+(\d+(?:\.\d+)?)\b/gi, '$1 - $2')
  normalized = normalized.replace(
    /\b(\d+(?:\.\d+)?)\s+(?:times|multiplied\s+by)\s+(\d+(?:\.\d+)?)\b/gi,
    '$1 * $2',
  )
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+divided\s+by\s+(\d+(?:\.\d+)?)\b/gi, '$1 / $2')
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+mod(?:ulo)?\s+(\d+(?:\.\d+)?)\b/gi, '$1 % $2')
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+percent\s+of\s+(\d+(?:\.\d+)?)\b/gi, '$1% of $2')
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+squared\b/gi, '$1^2')
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+cubed\b/gi, '$1^3')
  normalized = normalized.replace(/\bsquare\s+root\s+of\s+(\d+(?:\.\d+)?)\b/gi, 'sqrt($1)')

  return normalized.trim()
}

function isMathExpression(input: string): boolean {
  const trimmed = input.trim()
  if (!trimmed) return false

  const normalized = normalizeNaturalLanguage(trimmed)
  const hasNumber = /\d/.test(normalized)
  const hasOperator = /[+\-*/%^()]|sqrt|of/i.test(normalized)
  const hasMathWords = /\b(plus|minus|times|divided|mod|calculate|evaluate|square root)\b/i.test(trimmed)

  return hasNumber && (hasOperator || hasMathWords)
}

function formatNumber(num: number): string {
  if (Number.isInteger(num)) return String(num)
  return num.toFixed(10).replace(/\.?0+$/, '')
}

function evaluateMath(input: string): EvaluateResult {
  const trimmed = input.trim()
  try {
    let expr = normalizeNaturalLanguage(trimmed)

    expr = expr.replace(/(\d+(?:\.\d+)?)\s*%\s+of\s+(\d+(?:\.\d+)?)/gi, '$1 * $2 / 100')
    expr = expr.replace(/\bsqrt\(/g, 'Math.sqrt(')
    expr = expr.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1,$2)')

    const safePattern = /^[\d+\-*/().,\s%a-zA-Z]+$/
    if (!safePattern.test(expr)) {
      return { success: false, type: 'math', input: trimmed, error: 'Invalid characters in expression' }
    }

    const result = evaluateExpression(expr)
    if (!Number.isFinite(result)) {
      return { success: false, type: 'math', input: trimmed, error: 'Invalid expression' }
    }

    return {
      success: true,
      type: 'math',
      input: trimmed,
      result: String(result),
      formattedResult: formatNumber(result),
    }
  } catch {
    return {
      success: false,
      type: 'math',
      input: trimmed,
      error: 'Could not evaluate expression',
    }
  }
}

function evaluateExpression(expr: string): number {
  const normalized = expr.replace(/\s+/g, '')
  let pos = 0

  const parseExpression = (): number => {
    let result = parseTerm()
    while (pos < normalized.length) {
      const char = normalized[pos]
      if (char === '+') {
        pos += 1
        result += parseTerm()
      } else if (char === '-') {
        pos += 1
        result -= parseTerm()
      } else {
        break
      }
    }
    return result
  }

  const parseTerm = (): number => {
    let result = parseFactor()
    while (pos < normalized.length) {
      const char = normalized[pos]
      if (char === '*') {
        pos += 1
        result *= parseFactor()
      } else if (char === '/') {
        pos += 1
        const divisor = parseFactor()
        if (divisor === 0) throw new Error('Division by zero')
        result /= divisor
      } else if (char === '%') {
        pos += 1
        result %= parseFactor()
      } else {
        break
      }
    }
    return result
  }

  const parseFactor = (): number => {
    if (pos >= normalized.length) throw new Error('Unexpected end of expression')

    if (normalized[pos] === '(') {
      pos += 1
      const value = parseExpression()
      if (normalized[pos] !== ')') throw new Error('Missing closing parenthesis')
      pos += 1
      return value
    }

    if (normalized[pos] === '-') {
      pos += 1
      return -parseFactor()
    }

    const remaining = normalized.slice(pos)
    if (remaining.startsWith('Math.sqrt(')) {
      pos += 'Math.sqrt('.length
      const value = parseExpression()
      if (normalized[pos] !== ')') throw new Error('Missing closing parenthesis')
      pos += 1
      if (value < 0) throw new Error('Invalid sqrt input')
      return Math.sqrt(value)
    }

    if (remaining.startsWith('Math.pow(')) {
      pos += 'Math.pow('.length
      const base = parseExpression()
      if (normalized[pos] !== ',') throw new Error('Missing comma in Math.pow')
      pos += 1
      const exponent = parseExpression()
      if (normalized[pos] !== ')') throw new Error('Missing closing parenthesis')
      pos += 1
      return Math.pow(base, exponent)
    }

    const start = pos
    let hasDecimal = false
    while (pos < normalized.length) {
      const char = normalized[pos]
      if (char >= '0' && char <= '9') {
        pos += 1
        continue
      }
      if (char === '.' && !hasDecimal) {
        hasDecimal = true
        pos += 1
        continue
      }
      break
    }

    const token = normalized.slice(start, pos)
    if (!token) throw new Error('Expected number')
    return Number(token)
  }

  const result = parseExpression()
  if (pos < normalized.length) {
    throw new Error('Unexpected input')
  }
  return result
}

export async function evaluate(input: string): Promise<EvaluateResult> {
  const trimmed = input.trim()
  if (!trimmed) {
    return { success: false, type: null, input: '', error: 'Empty input' }
  }

  if (isMathExpression(trimmed)) {
    return evaluateMath(trimmed)
  }

  return {
    success: false,
    type: null,
    input: trimmed,
    error: 'Not a valid expression',
  }
}

export function canEvaluate(input: string): boolean {
  return isMathExpression(input)
}
