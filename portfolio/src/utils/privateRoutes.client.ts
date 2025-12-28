/**
 * Private Routes Client Helper (Minimal)
 * 
 * This file contains ONLY the paths for private routes (no descriptions, names, etc.)
 * Used by command center for route validation and navigation.
 * 
 * This is a minimal client-side file that only exposes paths.
 * Full route configs remain server-side only in privateRoutes.server.ts
 */

// Only paths - minimal exposure for command center navigation
export const privateRoutePaths: string[] = [
  '/ilovemygf',
  // Add more private route paths here as needed
  // '/another-secret',
]

/**
 * Check if a path is a private route (client-side validation)
 * Used by command center for navigation
 */
export function isPrivateRoutePath(path: string): boolean {
  return privateRoutePaths.includes(path)
}

