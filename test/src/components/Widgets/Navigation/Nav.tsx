import { useState } from 'react'
import { motion } from 'motion/react'
import getIcon from '@/utils/getIcon'


interface NavProps {
  toggleDrawer: () => void
}

interface NavButtonProps extends NavProps {
  icon: string
  label: string
  subtext: string
  iconOnly?: boolean
  showSubtext?: boolean
}

const NavButton = ({ 
  icon, 
  label, 
  subtext, 
  iconOnly = false, 
  showSubtext = true,
  toggleDrawer
}: NavButtonProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button 
      className={`flex flex-col items-end transition-colors relative h-[24px] ${isHovered ? 'h-auto text-blue-400' : 'text-[#AAA]'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={toggleDrawer}
    > 
      <div className="flex items-center gap-2 text-sm">
        {getIcon(icon, 'text-2xl')} 
        {!iconOnly && label}
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
    </button>
  )
}

export default function Nav({ toggleDrawer }: NavProps) {
  return (
    <>
      <NavButton 
        icon="menu"
        label="Menu"
        subtext="Open Menu"
        toggleDrawer={toggleDrawer}
      />
    </>
  )
}