/**
 * Evaluate Extension for Command Center
 * 
 * A clean, modular evaluation system for:
 * - Math equations
 * TODO: Currency conversion
 * TODO: Metric conversion
 */

export interface EvaluateResult {
  success: boolean
  type: 'math' | 'currency' | 'metric' | null
  input: string
  result?: string
  formattedResult?: string
  error?: string
}

/**
 * Normalize natural language math expressions to standard math notation
 * Handles patterns like "2 plus 3", "10 divided by 2", etc.
 */
function normalizeNaturalLanguage(input: string): string {
  let normalized = input.trim()
  
  // Remove common question prefixes (already handled, but keep for safety)
  normalized = normalized.replace(/^(calculate|calc|what is|what's|compute|solve|evaluate|equals?|=\s*)/i, '').trim()
  
  // Handle "square root of X" -> "sqrt(X)"
  normalized = normalized.replace(/square\s+root\s+of\s+(\d+(?:\.\d+)?)/gi, 'sqrt($1)')
  
  // Handle "cube root of X" -> "cbrt(X)" (using Math.cbrt)
  normalized = normalized.replace(/cube\s+root\s+of\s+(\d+(?:\.\d+)?)/gi, 'cbrt($1)')
  
  // Handle "X plus Y" -> "X + Y"
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+plus\s+(\d+(?:\.\d+)?)\b/gi, '$1 + $2')
  
  // Handle "X minus Y" -> "X - Y"
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+minus\s+(\d+(?:\.\d+)?)\b/gi, '$1 - $2')
  
  // Handle "X times Y" or "X multiplied by Y" -> "X * Y"
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+(?:times|multiplied\s+by)\s+(\d+(?:\.\d+)?)\b/gi, '$1 * $2')
  
  // Handle "X divided by Y" -> "X / Y"
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+divided\s+by\s+(\d+(?:\.\d+)?)\b/gi, '$1 / $2')
  
  // Handle "X modulo Y" or "X mod Y" -> "X % Y"
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+(?:modulo|mod)\s+(\d+(?:\.\d+)?)\b/gi, '$1 % $2')
  
  // Handle "X percent of Y" -> "X% of Y" (already handled in evaluateMath, but normalize here too)
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+percent\s+of\s+(\d+(?:\.\d+)?)\b/gi, '$1% of $2')
  
  // Handle "X to the power of Y" or "X raised to Y" -> "X ^ Y" (we'll need to handle ^ in parser)
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+(?:to\s+the\s+power\s+of|raised\s+to|power)\s+(\d+(?:\.\d+)?)\b/gi, '$1^$2')
  
  // Handle "X squared" -> "X ^ 2"
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+squared\b/gi, '$1^2')
  
  // Handle "X cubed" -> "X ^ 3"
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s+cubed\b/gi, '$1^3')
  
  return normalized.trim()
}

/**
 * Check if input looks like a math expression (including natural language)
 */
function isMathExpression(input: string): boolean {
  const trimmed = input.trim()
  if (!trimmed) return false
  
  // Check for natural language math patterns
  const naturalLanguagePatterns = [
    /\b(plus|minus|times|multiplied|divided|modulo|mod|percent|power|squared|cubed)\b/i,
    /\b(square\s+root|cube\s+root)\b/i,
    /\b(what\s+is|what's|calculate|calc|compute|solve|evaluate)\b/i,
  ]
  
  const hasNaturalLanguage = naturalLanguagePatterns.some(pattern => pattern.test(trimmed))
  
  // Remove common prefixes and normalize
  const cleaned = normalizeNaturalLanguage(trimmed)
  
  // Check for math operators and numbers
  const hasNumbers = /\d/.test(cleaned)
  const hasOperators = /[+\-*/%^]|of|sqrt|cbrt/i.test(cleaned)
  
  return hasNumbers && (hasOperators || hasNaturalLanguage || cleaned.includes('of'))
}

/**
 * Format a number for display (remove unnecessary decimals)
 */
function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toString()
  }
  // Limit to 10 decimal places and remove trailing zeros
  return num.toFixed(10).replace(/\.?0+$/, '')
}

/**
 * Evaluate a math expression with BEDMAS order of operations
 */
function evaluateMath(input: string): EvaluateResult {
  try {
    const trimmed = input.trim()
    
    // Normalize natural language to math notation first
    let cleaned = normalizeNaturalLanguage(trimmed)
    
    // Handle percentage calculations: "80% of 100" -> "80 * 100 / 100"
    // Pattern: number% of number
    const percentagePattern = /(\d+(?:\.\d+)?)\s*%\s+of\s+(\d+(?:\.\d+)?)/i
    if (percentagePattern.test(cleaned)) {
      cleaned = cleaned.replace(percentagePattern, (_, percent, value) => {
        return `${percent} * ${value} / 100`
      })
    }
    
    // Handle sqrt() -> Math.sqrt()
    cleaned = cleaned.replace(/\bsqrt\(/g, 'Math.sqrt(')
    
    // Handle cbrt() -> Math.cbrt()
    cleaned = cleaned.replace(/\bcbrt\(/g, 'Math.cbrt(')
    
    // Handle exponentiation (^) -> Math.pow()
    // Replace X^Y with Math.pow(X, Y)
    cleaned = cleaned.replace(/(\d+(?:\.\d+)?)\s*\^\s*(\d+(?:\.\d+)?)/g, 'Math.pow($1, $2)')
    
    // Normalize operators - Replace // with Math.floor division
    // Use global flag to replace all occurrences in one pass (prevents infinite loops)
    const floorDivPattern = /(\d+(?:\.\d+)?)\s*\/\/\s*(\d+(?:\.\d+)?)/g
    if (floorDivPattern.test(cleaned)) {
      cleaned = cleaned.replace(floorDivPattern, (_, a, b) => {
        return `Math.floor(${a}/${b})`
      })
    }
    
    // Validate: only allow safe characters (numbers, operators, Math functions, spaces)
    // Allow letters for Math functions, and common math characters
    const safePattern = /^[\d+\-*/().\s%a-zA-Z.,]+$/
    if (!safePattern.test(cleaned)) {
      return {
        success: false,
        type: 'math',
        input: trimmed,
        error: 'Invalid characters in expression'
      }
    }
    
    // Evaluate using a simple recursive descent parser for BEDMAS
    const result = evaluateExpression(cleaned)
    
    if (typeof result !== 'number' || !isFinite(result)) {
      return {
        success: false,
        type: 'math',
        input: trimmed,
        error: 'Invalid expression or result'
      }
    }
    
    const formatted = formatNumber(result)
    
    return {
      success: true,
      type: 'math',
      input: trimmed,
      result: result.toString(),
      formattedResult: formatted
    }
  } catch (error) {
    return {
      success: false,
      type: 'math',
      input: input.trim(),
      error: 'Could not evaluate expression'
    }
  }
}

/**
 * Simple recursive descent parser for BEDMAS
 * BEDMAS: Brackets, Exponents, Division, Multiplication, Addition, Subtraction
 * 
 * Optimized with safety checks to prevent infinite loops
 */
function evaluateExpression(expr: string): number {
  // Remove whitespace
  expr = expr.replace(/\s+/g, '')
  
  if (!expr) {
    throw new Error('Empty expression')
  }
  
  // Safety: prevent infinite loops by tracking max iterations
  const MAX_ITERATIONS = 10000
  let iterations = 0
  
  // Handle brackets first (B in BEDMAS)
  let pos = 0
  const originalLength = expr.length
  
  const parseExpression = (): number => {
    if (++iterations > MAX_ITERATIONS) {
      throw new Error('Expression too complex or infinite loop detected')
    }
    
    let result = parseTerm()
    
    while (pos < expr.length) {
      if (expr[pos] === '+') {
        pos++
        result += parseTerm()
      } else if (expr[pos] === '-') {
        pos++
        result -= parseTerm()
      } else {
        break
      }
    }
    
    return result
  }
  
  const parseTerm = (): number => {
    if (++iterations > MAX_ITERATIONS) {
      throw new Error('Expression too complex or infinite loop detected')
    }
    
    let result = parseFactor()
    
    while (pos < expr.length) {
      if (expr[pos] === '*') {
        pos++
        result *= parseFactor()
      } else if (expr[pos] === '/') {
        pos++
        const divisor = parseFactor()
        if (divisor === 0) {
          throw new Error('Division by zero')
        }
        result /= divisor
      } else if (expr[pos] === '%') {
        pos++
        result %= parseFactor()
      } else {
        break
      }
    }
    
    return result
  }
  
  const parseFactor = (): number => {
    if (++iterations > MAX_ITERATIONS) {
      throw new Error('Expression too complex or infinite loop detected')
    }
    
    if (pos >= expr.length) {
      throw new Error('Unexpected end of expression')
    }
    
    // Handle brackets
    if (expr[pos] === '(') {
      pos++ // skip '('
      const result = parseExpression()
      if (pos >= expr.length || expr[pos] !== ')') {
        throw new Error('Unmatched parenthesis')
      }
      pos++ // skip ')'
      return result
    }
    
    // Handle negative numbers
    if (expr[pos] === '-') {
      pos++
      return -parseFactor()
    }
    
    // Handle Math functions (Math.floor, Math.sqrt, Math.cbrt, Math.pow)
    const remaining = expr.substring(pos)
    
    if (remaining.startsWith('Math.floor(')) {
      pos += 11 // skip 'Math.floor('
      const result = parseExpression()
      if (pos >= expr.length || expr[pos] !== ')') {
        throw new Error('Unmatched parenthesis in Math.floor')
      }
      pos++ // skip ')'
      return Math.floor(result)
    }
    
    if (remaining.startsWith('Math.sqrt(')) {
      pos += 10 // skip 'Math.sqrt('
      const result = parseExpression()
      if (pos >= expr.length || expr[pos] !== ')') {
        throw new Error('Unmatched parenthesis in Math.sqrt')
      }
      pos++ // skip ')'
      if (result < 0) {
        throw new Error('Square root of negative number')
      }
      return Math.sqrt(result)
    }
    
    if (remaining.startsWith('Math.cbrt(')) {
      pos += 10 // skip 'Math.cbrt('
      const result = parseExpression()
      if (pos >= expr.length || expr[pos] !== ')') {
        throw new Error('Unmatched parenthesis in Math.cbrt')
      }
      pos++ // skip ')'
      return Math.cbrt(result)
    }
    
    if (remaining.startsWith('Math.pow(')) {
      pos += 9 // skip 'Math.pow('
      const base = parseExpression()
      if (pos >= expr.length || expr[pos] !== ',') {
        throw new Error('Expected comma in Math.pow')
      }
      pos++ // skip ','
      // Skip whitespace
      while (pos < expr.length && expr[pos] === ' ') pos++
      const exponent = parseExpression()
      if (pos >= expr.length || expr[pos] !== ')') {
        throw new Error('Unmatched parenthesis in Math.pow')
      }
      pos++ // skip ')'
      return Math.pow(base, exponent)
    }
    
    // Parse number
    let numStr = ''
    let hasDecimal = false
    const startPos = pos
    
    // Handle negative sign
    if (expr[pos] === '-') {
      numStr += '-'
      pos++
    }
    
    while (pos < expr.length) {
      const char = expr[pos]
      if (char >= '0' && char <= '9') {
        numStr += char
        pos++
      } else if (char === '.' && !hasDecimal) {
        numStr += char
        hasDecimal = true
        pos++
      } else {
        break
      }
    }
    
    // Safety: ensure we actually parsed something
    if (pos === startPos) {
      throw new Error(`Unexpected character at position ${pos}: ${expr[pos] || 'end of expression'}`)
    }
    
    if (numStr === '' || numStr === '-') {
      throw new Error(`Invalid number format at position ${startPos}`)
    }
    
    return parseFloat(numStr)
  }
  
  const result = parseExpression()
  
  // Safety: ensure we parsed the entire expression
  if (pos < expr.length) {
    throw new Error(`Unexpected characters remaining: ${expr.substring(pos)}`)
  }
  
  return result
}

/**
 * Main evaluate function - entry point for all evaluation types
 */
export async function evaluate(input: string): Promise<EvaluateResult> {
  const trimmed = input.trim()
  
  if (!trimmed) {
    return {
      success: false,
      type: null,
      input: '',
      error: 'Empty input'
    }
  }
  
  // Try math expression first (most general, but we'll add currency/metric later)
  if (isMathExpression(trimmed)) {
    return evaluateMath(trimmed)
  }
  
  // TODO: Add currency and metric conversion detection
  
  return {
    success: false,
    type: null,
    input: trimmed,
    error: 'Not a valid expression'
  }
}

/**
 * Check if input can be evaluated (for quick check before full evaluation)
 */
export function canEvaluate(input: string): boolean {
  const trimmed = input.trim()
  // Don't evaluate empty strings
  if (!trimmed) return false
  return isMathExpression(trimmed)
}
