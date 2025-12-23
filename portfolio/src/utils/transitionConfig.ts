import { TransitionType } from '@/components/Transitions/PageTransition'

/**
 * Route-to-transition mapping
 * Specifies which transition type to use for each route
 * slide | pixelate | fade | scale | slideUp
 */
export const routeTransitions: Record<string, TransitionType> = {
  '/play': 'slide',       // Play - pixelate transition
}

/**
 * Get transition type for a given route
 * Defaults to 'slideUp' if not specified
 */
export function getTransitionForRoute(pathname: string): TransitionType {
  return routeTransitions[pathname] || 'slideUp'
}

