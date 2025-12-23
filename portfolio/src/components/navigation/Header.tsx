'use client'

import { usePathname } from 'next/navigation'
import HeaderTop from '@/components/navigation/HeaderTop'
import Nav from '@/components/navigation/Nav'
import { getHeaderVisibility } from '@/utils/headerConfig'

/**
 * Header Component
 * 
 * Contains both the top header (HeaderTop) and bottom navigation (Nav).
 * Visibility is controlled per-route via headerConfig.
 * Mounted together for SEO purposes and used across all pages.
 */
export default function Header() {
  const pathname = usePathname()
  const visibility = getHeaderVisibility(pathname)
  
  return (
    <>
      {/* Top Header - Conditionally rendered based on route */}
      {visibility.headerTop && <HeaderTop />}

      {/* Bottom Navigation - Conditionally rendered based on route */}
      {visibility.nav && <Nav />}
    </>
  )
}

