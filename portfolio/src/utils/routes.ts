/**
 * Route Configuration
 * 
 * Defines all available routes in the application.
 * Used for navigation, command center, and route suggestions.
 */

export interface RouteConfig {
  path: string
  name: string
  description?: string
  isPublic: boolean // If true, can be suggested in autocomplete
  isSecret?: boolean // If true, hidden route (easter egg, test pages)
  keywords?: string[] // Additional keywords for search matching
}

/**
 * All available routes in the application
 */
export const routes: RouteConfig[] = [
  // Public Routes (shown in navigation)
  {
    path: '/home',
    name: 'Home',
    description: 'Landing page',
    isPublic: true,
    keywords: ['home', 'landing', 'main'],
  },
  {
    path: '/about',
    name: 'About',
    description: 'About page',
    isPublic: true,
    keywords: ['about', 'me', 'info'],
  },
  {
    path: '/projects',
    name: 'Projects',
    description: 'Projects showcase',
    isPublic: true,
    keywords: ['projects', 'work', 'portfolio', 'showcase'],
  },
  {
    path: '/contact',
    name: 'Contact',
    description: 'Contact page',
    isPublic: true,
    keywords: ['contact', 'reach', 'email', 'get in touch'],
  },
  
  // Secret Routes (not shown in navigation, but accessible)
  {
    path: '/play',
    name: 'Play',
    description: 'Easter egg / Play page',
    isPublic: false,
    isSecret: true,
    keywords: ['play', 'easter', 'egg', 'fun', 'game'],
  },
  {
    path: '/test-parallax',
    name: 'Test Parallax',
    description: 'Parallax test page',
    isPublic: false,
    isSecret: true,
    keywords: ['test', 'parallax', 'demo', 'experiment'],
  },
]

/**
 * Get all public routes (for autocomplete suggestions)
 */
export function getPublicRoutes(): RouteConfig[] {
  return routes.filter(route => route.isPublic)
}

/**
 * Get all secret routes
 */
export function getSecretRoutes(): RouteConfig[] {
  return routes.filter(route => route.isSecret)
}

/**
 * Find a route by path
 */
export function findRouteByPath(path: string): RouteConfig | undefined {
  return routes.find(route => route.path === path)
}

/**
 * Find routes matching a search query
 * Matches against path, name, description, and keywords
 */
export function searchRoutes(query: string, includeSecret: boolean = false): RouteConfig[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  if (!normalizedQuery) return []
  
  return routes
    .filter(route => {
      // Filter out secret routes unless explicitly included
      if (route.isSecret && !includeSecret) return false
      
      // Match against path
      if (route.path.toLowerCase().includes(normalizedQuery)) return true
      
      // Match against name
      if (route.name.toLowerCase().includes(normalizedQuery)) return true
      
      // Match against description
      if (route.description?.toLowerCase().includes(normalizedQuery)) return true
      
      // Match against keywords
      if (route.keywords?.some(keyword => keyword.toLowerCase().includes(normalizedQuery))) return true
      
      return false
    })
    .sort((a, b) => {
      // Prioritize exact path matches
      const aPathMatch = a.path.toLowerCase() === normalizedQuery
      const bPathMatch = b.path.toLowerCase() === normalizedQuery
      if (aPathMatch && !bPathMatch) return -1
      if (!aPathMatch && bPathMatch) return 1
      
      // Then prioritize path starts with query
      const aPathStarts = a.path.toLowerCase().startsWith(normalizedQuery)
      const bPathStarts = b.path.toLowerCase().startsWith(normalizedQuery)
      if (aPathStarts && !bPathStarts) return -1
      if (!aPathStarts && bPathStarts) return 1
      
      // Then prioritize name matches
      const aNameMatch = a.name.toLowerCase().includes(normalizedQuery)
      const bNameMatch = b.name.toLowerCase().includes(normalizedQuery)
      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1
      
      return 0
    })
}

/**
 * Check if a path is a valid route
 */
export function isValidRoute(path: string): boolean {
  return routes.some(route => route.path === path)
}

/**
 * Get the actual navigation path for a route
 * Handles aliases (e.g., /home -> /)
 */
export function getNavigationPath(path: string): string {
  // Map /home to / for actual navigation
  if (path === '/home') {
    return '/'
  }
  return path
}

/**
 * Get routes for autocomplete suggestions
 * Uses strict path prefix matching - only routes where the path starts with the query
 * Only returns public routes (excludes secret routes)
 */
export function getAutocompleteRoutes(query: string): RouteConfig[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  // If query is just "/", return all public routes
  if (normalizedQuery === '/') {
    return getPublicRoutes()
  }
  
  // Create a regex pattern that matches routes starting with the query
  // Escape special regex characters in the query
  const escapedQuery = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Match routes that start with the query (case-insensitive)
  const pathPattern = new RegExp(`^${escapedQuery}`, 'i')
  
  // Filter routes using strict path prefix matching
  return getPublicRoutes()
    .filter(route => {
      // Only match if the route path starts with the query (case-insensitive)
      return pathPattern.test(route.path)
    })
    .sort((a, b) => {
      const aPath = a.path.toLowerCase()
      const bPath = b.path.toLowerCase()
      
      // Prioritize exact path matches
      const aExactMatch = aPath === normalizedQuery
      const bExactMatch = bPath === normalizedQuery
      if (aExactMatch && !bExactMatch) return -1
      if (!aExactMatch && bExactMatch) return 1
      
      // Then sort alphabetically by path
      return aPath.localeCompare(bPath)
    })
}


