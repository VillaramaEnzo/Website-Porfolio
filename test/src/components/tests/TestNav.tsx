import Link from 'next/link'
import SlashIcon from '@/components/Header/SlashIcon'
import { motion } from 'framer-motion'

import { useTestNav } from '@/components/tests/useTestNav'

// Define navigation links for the header
const navigationLinks = [
    { href: '/projects', label: 'Projects' },
    { href: '/contact', label: 'Contact' },
    { href: '/about', label: 'About' },

    // Add Page Links here
  ]
const fullName = "Enzo Villarama"


// Could be done better, but it works for now
const fontMultiplier = 2
const fontSize = "xl"


export default function TestNav() {
    const { scope, 
            firstLetter, 
            restOfName, 
            handleMouseEnter, 
            resetAnimation, 
            isHovering,
            isIdling,
        } = useTestNav(fullName)
    
    return (
        <motion.div 
            className="inline-block"
            animate={{ width: 
                isHovering ? "auto"
                : `${fontMultiplier}em`}}
            transition={{ 
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]  // Same easing as other animations
            }}
            ref={scope}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={resetAnimation}
            
        >
                {/* Name Container */}
                <motion.div 
                    className=""
                    animate={{ 
                        width: isHovering ? "auto" : `${fontMultiplier}em`,
                        overflow: isHovering ? "visible" : "hidden"
                    }}
                    transition={{ 
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1]
                    }}
                >
                    <Link href="/" className={`text-${fontMultiplier}${fontSize} font-bold hover:text-blue-400 
                        flex items-baseline whitespace-nowrap transition-colors`}
                    > 
                        <span className="inline-block">{firstLetter}</span>
                        
                        <motion.div className="slash relative inline-block"
                            initial={{ opacity: 1, rotate: 15}}
                        >
                            <SlashIcon 
                                className="slash-icon absolute
                                        inline-block w-[0.1em] h-[1em] 
                                        bottom-[-0.1em] left-[0.1em] 
                                        rotate-0"
                                preserveAspectRatio="none" 
                            />
                        </motion.div>

                        <motion.div className="name relative inline-block"
                            initial={{ opacity: 0 }}
                        >
                            {restOfName.split('').map((char, index) => (
                                <motion.span key={index} className="char"
                                    initial={{ opacity: 0}}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>
                    </Link>   
                </motion.div>

                {/* Navigation container */}
                <motion.div 
                    className={`nav-container whitespace-nowrap gap-2
                               ${navigationLinks.length > 3 
                                 ? 'grid grid-cols-2 pointer-events-none' 
                                 : 'flex flex-col'}`}
                    initial={{ height: 0, opacity: 0, marginTop: 0, pointerEvents: "none" }}
                    transition={{
                        height: {
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1]
                        }
                    }}
                >
                    {navigationLinks.map((link) => (
                        <Link 
                            key={link.href}
                            href={link.href} 
                            className="text-sm w-fit font-regular hover:text-blue-400 transition-colors"
                        >
                            <motion.div className="nav-item" initial={{ opacity: 0, x: 20}}> {link.label} </motion.div>
                        </Link>
                    ))}
                </motion.div>
        </motion.div>
    )
}
