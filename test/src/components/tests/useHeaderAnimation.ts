import { useState, useEffect, useRef } from 'react'
import { useAnimate, stagger } from 'motion/react'
import { usePathname } from 'next/navigation'



export function useNav(fullName: string) {
    // Split the full name into first letter and the rest

    const [scope, animate] = useAnimate()

    const firstLetter = fullName[0]
    const restOfName = fullName.slice(1)
    const pathname = usePathname()

    const [isNavActive, setIsNavActive] = useState(false) // Keep track if nav is active or not
    const [isHovered, setIsHovered] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false) // 


    const handleMouseEnter = async () => {
        
        if (isHovered && !isAnimating) return // If hovered and not animating, do nothing
        setIsHovered(true)
        setIsAnimating(true)
        setIsNavActive(true)
        
        const nameLength = restOfName.length
        const finalPosition = `${nameLength - 2}ch`


        const navheight = scope.current?.getBoundingClientRect().height || 0

        // Wait for next frame to ensure elements are rendered
        await new Promise(resolve => requestAnimationFrame(resolve))
        try {

            
            await animate([
                // 1. Name reveal (keep this part)
                ['.slash', 
                    { 
                        rotate: [15, 195],  // Slightly past 180 to match reference
                        x: finalPosition,
                        transformOrigin: '50% 50%',  // Center for initial flip
                    }, 
                    { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
                ],
                ['.char', 
                    { y: [20, 0], opacity: [0, 1] }, 
                    { duration: 0.6, delay: stagger(0.08), at: 0.3, ease: [0.16, 1, 0.3, 1] }  
                ],
                // 2. Vertical extension with precise pivot point
                ['.slash', 
                    { 
                        transformOrigin: '50% 100%',  // Pivot from bottom center
                        
                        rotate: [195, 450],
                    }, 
                    { duration: 0.4, at: "<-0.2", ease: [0.1, 0, 0.3, 1]}  // Starts 0.3s before previous animation ends
                ],
                // 4. Slide left and fade
                ['.slash', 
                    { x: "-2em", opacity: 0 }, 
                    { duration: 1, at: ">", ease: [0.2, 0, 0.3, 1] }
                ],
                [".nav-container", 
                    { opacity: 1, alignItems: 'flex-start' }, 
                    { duration: 1, at: "<", ease: [0.2, 0, 0.3, 1] }
                ]
            ])

        } catch (error) {
            console.error(error)
        } finally {
            setIsAnimating(false)
        }
    }


    const resetAnimation = () => {
        if (!isHovered) return
        setIsHovered(false)
        setIsAnimating(false)
        setIsNavActive(false)


        // Reset animation

        scope.current?.getAnimations().forEach((animation: Animation) => animation.cancel())


        try {
            animate([
                ['.nav-container', 
                    { opacity: 0, alignItems: 'flex-end' }, 
                    { duration: 0}
                ],
                ['.char', { y: [20, 0], opacity: [0, 1] }, { duration: 0} ],
                ['.slash', { x: 0, rotate: 15, 
                    opacity: [0, 1],
                    height: "1.4em", width: "0.1em", 
                    bottom: '-0.3em', left: "0.15em",
                    
                },
                    { duration: 0}
                ],
            ])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
    
        resetAnimation()

    }, [pathname])

    return {
        scope,
        firstLetter,
        restOfName,
        isNavActive,
        isHovered,
        setIsHovered,
        handleMouseEnter,
        resetAnimation,
    }

}
