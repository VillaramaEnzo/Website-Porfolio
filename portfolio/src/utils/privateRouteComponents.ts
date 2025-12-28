/**
 * Private Route Component Mapping
 * 
 * Maps private routes to their component locations.
 * Components are stored outside app/ to keep routes hidden.
 * 
 * Completely separate from routes.ts system.
 */

// Lazy load components to keep them hidden from static analysis
export const privateRouteComponents: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  '/ilovemygf': () => import('@/components/private/SecretPage'),
  // Add more private routes here as needed
  // '/another-private': () => import('@/components/private/AnotherPrivate'),
}

/**
 * Check if a path has a component mapped
 */
export function hasPrivateRouteComponent(path: string): boolean {
  return path in privateRouteComponents
}

