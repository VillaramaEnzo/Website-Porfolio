'use client'

import { links, HeaderLink } from '@/utils/text'
import Link from 'next/link'
import getIcon from '@/utils/getIcon'

interface NavLinkProps extends HeaderLink {
  iconOnly?: boolean
  showSubtext?: boolean
}

const NavLink = ({ href, icon, label, subtext, iconOnly, showSubtext }: NavLinkProps) => {
  // Responsive behavior: iconOnly on mobile, full on desktop (unless explicitly overridden)
  // If iconOnly prop is explicitly provided, use it; otherwise default to responsive behavior
  const isIconOnly = iconOnly !== undefined 
    ? iconOnly 
    : undefined // undefined means "use responsive classes"
  
  // If showSubtext is explicitly provided, use it; otherwise default to false
  const shouldShowSubtext = showSubtext === true
  
  return (
    <Link 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-end text-[#AAA] hover:text-blue-400 transition-colors"
      title={isIconOnly === true ? label : undefined}
    > 
      <div className="flex items-center gap-2 text-sm">
        {getIcon(icon, 'text-xl')} 
        {/* Show label: if iconOnly is explicitly false, always show; if undefined, show on md+; if true, never show */}
        <span className={
          isIconOnly === false 
            ? '' 
            : isIconOnly === true 
              ? 'hidden' 
              : 'hidden md:inline'
        }>
          {label}
        </span>
      </div>
      
      {/* Subtext - only show if not iconOnly and showSubtext is true, hidden on mobile */}
      {isIconOnly !== true && shouldShowSubtext && (
        <span className="hidden md:block text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {subtext}
        </span>
      )}
    </Link>
  )
}

export default function Links({...props}: Partial<NavLinkProps>) { 
  return (
    <div className="flex flex-row items-center gap-3 md:gap-4">
      {links.map((link) => (
        <NavLink key={link.href} {...link} {...props}/>
      ))}
    </div>
  )
}

