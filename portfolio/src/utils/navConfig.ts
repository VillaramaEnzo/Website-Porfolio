/**
 * Navigation Visibility Configuration
 * 
 * Controls which navigation components are visible on specific routes.
 * Allows granular control over Header, Nav, and SectionNav visibility.
 * 
 * - Header: Semantic header element with site information (top of page)
 * - Nav: Bottom navigation component
 * - SectionNav: Section navigation component (right side)
 */

export interface HeaderVisibility {
  header: boolean
  nav: boolean
  sectionNav: boolean
}

export const headerVisibilityConfig: Record<string, HeaderVisibility> = {
  // Default: show all components
  '/': {
    header: true,
    nav: true,
    sectionNav: true,
  },
  
  // Hide all navigation on secret/play pages
  '/play': {
    header: false,
    nav: false,
    sectionNav: false,
  },

  "/gallery": {
    header: false,
    nav: false,
    sectionNav: false,
  },
  // Example: Hide only SectionNav on specific pages
  // '/some-page': {
  //   headerTop: true,
  //   nav: true,
  //   sectionNav: false,
  // },
  
  // Example: Hide only Header on specific pages
  // '/another-page': {
  //   headerTop: false,
  //   nav: true,
  //   sectionNav: true,
  // },
}

/**
 * Get header visibility for a given pathname
 */
export function getHeaderVisibility(pathname: string): HeaderVisibility {
  // Default: show all components
  const defaultVisibility: HeaderVisibility = {
    header: true,
    nav: true,
    sectionNav: true,
  }
  
  return headerVisibilityConfig[pathname] || defaultVisibility
}


