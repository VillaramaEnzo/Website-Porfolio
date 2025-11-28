
// Centralise all imported icons here

import { IoLogoInstagram, IoLogoLinkedin, IoDocumentText, IoLogoGithub, IoApps, IoGrid,
  IoLaptopOutline, IoLaptop, IoMenu, IoSearch
 } from "react-icons/io5"

import { FiPlay } from "react-icons/fi"

export default function getIcon(iconName: string, className?: string) {
    switch(iconName) {
      case 'instagram':
        return <IoLogoInstagram className={className} />
      case 'linkedin':
        return <IoLogoLinkedin className={className} />
      case 'document':
        return <IoDocumentText className={className} />
      case 'play':
        return <FiPlay className={className} />
      case 'github':
        return <IoLogoGithub className={className} />
      case 'apps':
        return <IoApps className={className} />
      case 'grid':
        return <IoGrid className={className} />
      case 'laptop':
        return <IoLaptop className={className} />
      case 'laptop-outline':
        return <IoLaptopOutline className={className} />
      case 'menu':
        return <IoMenu className={className} />
      case 'search':
        return <IoSearch className={className} />
      default:
        return null
    }
  }