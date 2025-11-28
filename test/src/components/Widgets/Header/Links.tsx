import { links, HeaderLink } from '@/utils/text'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import getIcon from '@/utils/getIcon'

interface NavLinkProps extends HeaderLink {
  iconOnly?: boolean
  showSubtext?: boolean
}

const NavLink = ({ href, icon, label, subtext, iconOnly = false, showSubtext = true }: NavLinkProps) => {

  // if iconOnly is true, showSubtext is ignored: shows only the icon
  // if iconOnly is false, showSubtext is respected: shows the icon and the label according to showSubtext
  // if showSubtext is false, the subtext is hidden
  // if iconOnly is false and showSubtext is true, the subtext is shown
  
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col items-end transition-colors relative h-[24px] ${isHovered ? 'h-auto text-blue-400' : 'text-[#AAA]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > 
    
      <div className="flex items-center gap-2 text-sm">
        {getIcon(icon, 'text-xl')} 
        
        {!iconOnly && (
          <>
            {label}
          </>
        )}
      </div>
      
      {!iconOnly && showSubtext && (
        <motion.span 
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={isHovered ? 
            { opacity: 1, y: 0, height: "auto", marginTop: "0.25rem" } : 
            { opacity: 0, y: -10, height: 0, marginTop: 0 }
          }
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={`text-xs transition-colors pointer-events-none overflow-hidden ${isHovered ? 'text-blue-400' : 'text-[#AAA]'}`}
        >
          {subtext}
        </motion.span>
      )}
    </Link>
  )
}

export default function Links({...props}) { 
  
  return (
    <div className="flex flex-row gap-8">
      {links.map((link) => (
        <NavLink key={link.href} {...link} {...props}/>
      ))}
    </div>
  )
}