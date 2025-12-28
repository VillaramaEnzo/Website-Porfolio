/**
 * Private Routes Configuration (Server-Side Only)
 * 
 * These routes are completely separate from the public routes system (routes.ts).
 * They are NOT imported in routes.ts, so they remain hidden from client code.
 * 
 * Private routes have NO folder structure in app/ - completely hidden.
 * Components are stored in src/components/private/ to keep them separate.
 * 
 * To add a new private route:
 * 1. Add the route config here
 * 2. Add the component mapping in privateRouteComponents.ts
 * 3. Create the component in src/components/private/
 */

export interface PrivateRouteConfig {
  path: string
  name: string
}

export const privateRoutes: PrivateRouteConfig[] = [
  {
    path: '/ilovemygf',
    name: 'Private Page',
  },
  // Add more private routes here as needed
]

/**
 * Check if a path is a private route
 */
export function isPrivateRoute(path: string): boolean {
  return privateRoutes.some(route => route.path === path)
}

/**
 * Get private route config by path
 */
export function getPrivateRoute(path: string): PrivateRouteConfig | undefined {
  return privateRoutes.find(route => route.path === path)
}

