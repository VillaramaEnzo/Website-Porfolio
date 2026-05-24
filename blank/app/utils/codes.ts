export interface CodeConfig {
  code: string
  description: string
  action: string
  keywords?: string[]
  aliases?: string[]
}

export const codes: CodeConfig[] = [
  {
    code: '#refresh',
    description: 'Refresh the page',
    action: 'refresh_page',
    aliases: ['#r'],
  },
  {
    code: '#portfolio',
    description: 'Open portfolio experience',
    action: 'go_portfolio',
    aliases: ['#work'],
    keywords: ['portfolio', 'work'],
  },
  {
    code: '#home',
    description: 'Go to home page',
    action: 'go_home',
    aliases: ['#start'],
    keywords: ['home', 'root'],
  },
  {
    code: '#contact',
    description: 'Contact Enzo',
    action: 'contact_me',
    keywords: ['email', 'contact'],
  },
  {
    code: 'google: <query>',
    description: 'Search Google for <query>',
    action: 'search_google',
    keywords: ['google', 'search'],
  },
]

export function getAutocompleteCodes(query: string): CodeConfig[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return []

  return codes
    .filter((code) => {
      const codeLower = code.code.toLowerCase()
      if (codeLower.includes(normalizedQuery)) return true

      if (code.aliases?.some((alias) => alias.toLowerCase().includes(normalizedQuery))) {
        return true
      }

      if (code.keywords?.some((keyword) => keyword.toLowerCase().includes(normalizedQuery))) {
        return true
      }

      return false
    })
    .sort((a, b) => {
      const aCode = a.code.toLowerCase()
      const bCode = b.code.toLowerCase()
      const aAliases = a.aliases?.map((alias) => alias.toLowerCase()) ?? []
      const bAliases = b.aliases?.map((alias) => alias.toLowerCase()) ?? []

      const aExactCode = aCode === normalizedQuery
      const bExactCode = bCode === normalizedQuery
      if (aExactCode && !bExactCode) return -1
      if (!aExactCode && bExactCode) return 1

      const aExactAlias = aAliases.includes(normalizedQuery)
      const bExactAlias = bAliases.includes(normalizedQuery)
      if (aExactAlias && !bExactAlias) return -1
      if (!aExactAlias && bExactAlias) return 1

      const aStarts = aCode.startsWith(normalizedQuery)
      const bStarts = bCode.startsWith(normalizedQuery)
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1

      return aCode.localeCompare(bCode)
    })
}

export function findCodeByCode(codeString: string): CodeConfig | undefined {
  const normalized = codeString.toLowerCase().trim()
  return codes.find((code) => {
    if (code.code.toLowerCase() === normalized) return true
    if (code.aliases?.some((alias) => alias.toLowerCase() === normalized)) return true
    return false
  })
}

export function isValidPublicCode(codeString: string): boolean {
  return Boolean(findCodeByCode(codeString))
}
