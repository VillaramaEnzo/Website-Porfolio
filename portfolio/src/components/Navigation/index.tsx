'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import BackToTopButton from './BackToTopButton'
import CommandCenter from '@/components/widgets/CommandCenter'
import { getHeaderVisibility } from '@/utils/navConfig'
import SectionNav from './SectionNav'

// Export individual components
export { default as Nav } from './Nav'
export { default as Drawer } from './Drawer'
export { default as RemixDrawer } from './RemixDrawer'
export { default as HamburgerMenu } from './HamburgerMenu'
export { default as BackToTopButton } from './BackToTopButton'
export { default as Header } from './Header'
export { default as HeaderTop } from './HeaderTop'
export { default as SectionNav } from './SectionNav'

/**
 * Site Navigation Wrapper
 * 
 * Groups all navigation and utility components:
 * - Bottom navigation (Nav)
 * - Back to top button (BackToTopButton)
 * - Command center/search modal (CommandCenter)
 * 
 * Visibility for Nav is controlled per-route via headerConfig.
 * BackToTopButton and CommandCenter are always available (they handle their own visibility).
 * 
 * This component handles the actual navigation functionality,
 * separate from the semantic Header component which contains site information.
 */
export default function Navigation() {
  const pathname = usePathname()
  const visibility = getHeaderVisibility(pathname)
  
  return (
    <>
      {/* Bottom Navigation - Conditionally rendered based on route */}
      {visibility.nav && <Nav />}

      {/* Back to Top Button - Always available (handles own visibility) */}
      <BackToTopButton />

      {/* Command Center - Always available (handles own visibility) */}
      <CommandCenter key={pathname} />

      {/* Section Navigation - Conditionally rendered based on route */}
      {visibility.sectionNav && <SectionNav />}
    </>
  )
}

