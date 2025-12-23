/**
 * Public Command Codes (Client-Side)
 * 
 * Defines public codes that can be autosuggested in the CommandCenter.
 * These codes are visible in the client bundle and can be discovered through autocomplete.
 * 
 * For secret codes that should NOT be suggested, use secret.server.ts instead.
 */

export interface CodeConfig {
  code: string
  description: string
  action: string // Action type to execute
  keywords?: string[] // Additional keywords for search matching
  aliases?: string[] // Short aliases for the command (e.g., ['r', 'ref'] for '#refresh')
}

/**
 * All public codes that can be autosuggested
 */
export const codes: CodeConfig[] = [
  {
    code: '#refresh',
    description: 'Refresh the page',
    action: 'refresh_page',
    aliases: ['#r']
  },
  {
    code: "#contact",
    description: 'Contact me',
    action: "contact_me",
    keywords: ['contact', 'contact me'],
  },
  {
    code: "<query>",
    description: 'Search the web for <query>',
    action: 'search_web',
    keywords: ['search', 'search the web', '<query>'],
  },
  {
    code: "search: <query>",
    description: 'Search the web for <query>',
    action: 'search_web',
    keywords: ['search', 'search the web', '<query>'],
  },
  {
    code: "google: <query>",
    description: 'Search Google for <query>',
    action: 'search_google',
    keywords: ['google', 'search', '<query>'],
  },

  // Add more public codes here!
  // {
  //   code: '#anothercode',
  //   description: 'Another public code',
  //   action: 'another_action',
  //   keywords: ['another', 'public'],
  // },
]

/**
 * Get codes matching a search query
 * Matches codes that contain the query string anywhere OR match keywords OR match aliases
 * Codes with # and without # are treated as unique codes
 * Examples:
 * - Typing "t" will match both "#testcode" and "test" (if both exist)
 * - Typing "#t" will match "#testcode" but not "test"
 * - Typing "test" will match both "#testcode" and "test"
 * - Typing "remix" will match "#rem214" (via keyword matching)
 * - Typing "basic" will match "test" (via keyword matching)
 * - Typing "r" will match "#refresh" (via alias matching)
 * - Typing "ref" will match "#refresh" (via alias matching)
 */
export function getAutocompleteCodes(query: string): CodeConfig[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (!normalizedQuery) return []
  
  return codes
    .filter(code => {
      const codeLower = code.code.toLowerCase()
      
      // Match if the code contains the query string anywhere
      if (codeLower.includes(normalizedQuery)) return true
      
      // Match if any alias contains the query string
      if (code.aliases?.some(alias => 
        alias.toLowerCase().includes(normalizedQuery)
      )) return true
      
      // Also match if any keyword contains the query string
      if (code.keywords?.some(keyword => 
        keyword.toLowerCase().includes(normalizedQuery)
      )) return true
      
      return false
    })
    .sort((a, b) => {
      const aCode = a.code.toLowerCase()
      const bCode = b.code.toLowerCase()
      const aAliases = a.aliases?.map(alias => alias.toLowerCase()) || []
      const bAliases = b.aliases?.map(alias => alias.toLowerCase()) || []
      
      // Prioritize exact code matches
      const aExactMatch = aCode === normalizedQuery
      const bExactMatch = bCode === normalizedQuery
      if (aExactMatch && !bExactMatch) return -1
      if (!aExactMatch && bExactMatch) return 1
      
      // Then prioritize exact alias matches
      const aAliasMatch = aAliases.includes(normalizedQuery)
      const bAliasMatch = bAliases.includes(normalizedQuery)
      if (aAliasMatch && !bAliasMatch) return -1
      if (!aAliasMatch && bAliasMatch) return 1
      
      // Then prioritize codes that start with the query
      const aStarts = aCode.startsWith(normalizedQuery)
      const bStarts = bCode.startsWith(normalizedQuery)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      
      // Then prioritize aliases that start with the query
      const aAliasStarts = aAliases.some(alias => alias.startsWith(normalizedQuery))
      const bAliasStarts = bAliases.some(alias => alias.startsWith(normalizedQuery))
      if (aAliasStarts && !bAliasStarts) return -1
      if (!aAliasStarts && bAliasStarts) return 1
      
      // Then prioritize codes without # prefix
      const aHasHash = aCode.startsWith('#')
      const bHasHash = bCode.startsWith('#')
      if (!aHasHash && bHasHash) return -1
      if (aHasHash && !bHasHash) return 1
      
      // Finally sort alphabetically
      return aCode.localeCompare(bCode)
    })
}

/**
 * Find a code by code string or alias
 */
export function findCodeByCode(codeString: string): CodeConfig | undefined {
  const normalized = codeString.toLowerCase().trim()
  return codes.find(code => {
    // Check exact match (case-insensitive)
    if (code.code.toLowerCase() === normalized) return true
    // Check aliases
    if (code.aliases?.some(alias => alias.toLowerCase() === normalized)) return true
    return false
  })
}

/**
 * Check if a code string is a valid public code (including aliases)
 */
export function isValidPublicCode(codeString: string): boolean {
  const normalized = codeString.toLowerCase().trim()
  return codes.some(code => {
    // Check exact match (case-insensitive)
    if (code.code.toLowerCase() === normalized) return true
    // Check aliases
    if (code.aliases?.some(alias => alias.toLowerCase() === normalized)) return true
    return false
  })
}

