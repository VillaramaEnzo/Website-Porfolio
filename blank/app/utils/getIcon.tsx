// Centralise all imported icons here

import { IoLogoLinkedin, IoLogoGithub } from "react-icons/io5"
import { AiFillInstagram } from "react-icons/ai"

import { HiMoon } from "react-icons/hi"
import { WiMoonFull } from "react-icons/wi"
import { TbBrandLinktree } from "react-icons/tb"
import { GoArrowUpRight } from "react-icons/go";


  export default function getIcon(iconName: string, className?: string) {
      switch(iconName) {
        case 'instagram':
          return <AiFillInstagram className={className} />
        case 'linkedin':
          return <IoLogoLinkedin className={className} /> 
        case 'github':
          return <IoLogoGithub className={className} />
        case 'moon':
          return <HiMoon className={className} />
        case 'sun':
          return <WiMoonFull className={className} />
        case 'linktree':
          return <TbBrandLinktree className={className} />
        case 'arrow-up-right':
          return <GoArrowUpRight className={className} />
        default:
          return null
      }
    }
  
  