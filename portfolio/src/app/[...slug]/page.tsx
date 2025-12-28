import { notFound } from 'next/navigation'
import { isPrivateRoute } from '@/utils/privateRoutes.server'
import { privateRouteComponents, hasPrivateRouteComponent } from '@/utils/privateRouteComponents'

/**
 * Catch-All Route Handler for Private Routes
 * 
 * This catch-all route handles ultra-secret private routes that have
 * NO folder structure in app/. These routes are completely hidden.
 * 
 * Route priority in Next.js:
 * 1. Specific routes (e.g., /about/page.tsx) - highest priority
 * 2. Dynamic routes (e.g., [id]/page.tsx)
 * 3. Catch-all routes (e.g., [...slug]/page.tsx) - lowest priority
 * 
 * This means existing routes like /about, /play, etc. will still work
 * because they have specific folders, and this catch-all only handles
 * routes that don't exist elsewhere.
 */
export default async function CatchAllPage({ 
  params 
}: { 
  params: Promise<{ slug?: string[] }> | { slug?: string[] }
}) {
  // Handle Next.js 15+ where params might be a Promise
  const resolvedParams = params instanceof Promise ? await params : params
  
  // Handle case where slug might be undefined or empty
  if (!resolvedParams?.slug || resolvedParams.slug.length === 0) {
    notFound()
  }
  
  const path = '/' + resolvedParams.slug.join('/')
  
  // Check if it's a private route (completely separate from routes.ts)
  if (isPrivateRoute(path) && hasPrivateRouteComponent(path)) {
    try {
      const Component = (await privateRouteComponents[path]()).default
      return <Component />
    } catch (error) {
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`Error loading private route component for ${path}:`, error)
      }
      notFound()
    }
  }
  
  // For all other routes (including non-private routes that don't exist), show 404
  notFound()
}

