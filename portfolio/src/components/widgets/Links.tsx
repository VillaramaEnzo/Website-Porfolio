import { links, HeaderLink } from '@/utils/text'
import LinksClient from './LinksClient'

interface NavLinkProps extends HeaderLink {
  iconOnly?: boolean
  showSubtext?: boolean
}

/**
 * Links Component (Server Component)
 * 
 * Server-rendered wrapper that passes props to client component
 * for filtering logic based on remix mode.
 */
export default function Links(props: Partial<NavLinkProps>) {
  return <LinksClient {...props} />
}

// Export the client component for direct use if needed
export { LinksClient }

