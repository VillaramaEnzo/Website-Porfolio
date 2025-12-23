/**
 * Header Visibility Configuration
 * 
 * Controls which header components are visible on specific routes.
 * Allows granular control over HeaderTop and Nav visibility.
 */

export interface HeaderVisibility {
  headerTop: boolean
  nav: boolean
}

export const headerVisibilityConfig: Record<string, HeaderVisibility> = {
  // Hide entire header on play page
  
  '/': {
    headerTop: true,
    nav: true,
  },
  '/play': {
    headerTop: false,
    nav: false,
  }
  // Hide only HeaderTop on specific pages
  // '/some-page': {
  //   headerTop: false,
  //   nav: true,
  // },
  // Hide only Nav on specific pages
  // '/another-page': {
  //   headerTop: true,
  //   nav: false,
  // },
}

/**
 * Get header visibility for a given pathname
 */
export function getHeaderVisibility(pathname: string): HeaderVisibility {
  // Default: show both
  const defaultVisibility: HeaderVisibility = {
    headerTop: true,
    nav: true,
  }
  
  return headerVisibilityConfig[pathname] || defaultVisibility
}

