import { useEffect, useRef, useState } from 'react'
import { useAnimate, stagger } from 'motion/react'
import { usePathname } from 'next/navigation'



export function useNav(fullName: string) {
    // Split the full name into first letter and the rest

    const [scope, animate] = useAnimate()

    const firstLetter = fullName[0]
    const restOfName = fullName.slice(1)
    const pathname = usePathname()

    const [isResetting, setIsResetting] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    const handleMouseEnter = async () => {
        if (isResetting || isHovering) return
        
        setIsHovering(true)

        // Stop idle animation and reset to initial state
        try {
            // Reset to initial states first

            const nameLength = restOfName.length
            const finalX = `${nameLength - 2}ch`

            // Now start the hover animation sequence from a known state
            await animate([
                [".slash", 
                    { 
                        x: finalX,
                    }, 
                    { duration: 0.3 }
                ], 
                [".slash-icon", 
                    { 
                        rotate: [0, 180, 360]
                    }, 
                    { duration: 0.5, at: "<"}
                ],
                [".char", { opacity: 1}, { duration: 0.2, at: "<", delay: stagger(0.05)}],
                [".name", { opacity: 1}, { duration: 0.2, at: "<", delay: stagger(0.05)}]
            ])
            
            // Second and third sequences combined
            animate([
                [".slash-icon", { height: ["1em", `${nameLength / 2}em`]}, { duration: 0.3}],
                [".slash", { rotate: 450}, { duration: 0.3, at: "<"}]
            ])

            // Start nav container animation immediately after second sequence
            animate([
                [".nav-container", { 
                    opacity: [0, 1], 
                    height: ["0px", "auto"],
                    marginTop: ["0rem", "0.5rem"]
                }, { 
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1]
                }],
                [".nav-item", 
                    { 
                        opacity: [0, 1],
                        x: [20, 0],
                    },
                    { 
                        duration: 0.7, 
                        delay: stagger(0.1, { startDelay: 0.1 }),
                        ease: [0.16, 1, 0.3, 1]
                    }
                ],
                [".slash", { x: "-2em", opacity: 0}, {
                    duration: 0.5, 
                    at: "<"
                }]
            ])

            // After your existing slash animations...
            await animate([
                [".nav-container", 
                    { 
                        pointerEvents: "auto"
                    }, 
                    { 
                        duration: 0.5, 
                        ease: [0.16, 1, 0.3, 1]
                    }
                ]
            ])

        } catch (error) {
            console.error("Error animating nav: ", error)
            resetAnimation()
        } finally {
            setIsResetting(false)
        }
    }


    // Define animated elements list
    // Separated for ease of use in stopping animations
    const ANIMATED_ELEMENTS = [
        '.slash',
        '.slash-icon',
        '.nav-item',
        '.char',
        '.nav-container',
        '.name'
        
        // add animated elements here
    ]

    const resetAnimation = async() => {
        setIsResetting(true)
        setIsHovering(false)
        
        // Stop all ongoing animations
        const animatedElements = scope.current?.querySelectorAll(ANIMATED_ELEMENTS.join(', '))
        animatedElements?.forEach((element: Element) => {
            element.getAnimations().forEach((animation: Animation) => animation.cancel())
        })

        try {
            await animate([
                [".slash", { 
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: 15,
                    transformOrigin: "center"
                }, { duration: 0 }],
                [".slash-icon", { 
                    height: "1em",
                    rotate: 0,
                    scale: 1
                }, { duration: 0 }],
                [".nav-item", { opacity: 0, x: 20 }, { duration: 0 }],
                [".char", { opacity: 0 }, { duration: 0 }],
                [".name", { opacity: 0 }, { duration: 0 }],
                [".nav-container", { 
                    height: 0, 
                    opacity: 0,
                    marginTop: 0,
                    pointerEvents: "none"
                }, { duration: 0 }]
            ])
            
            await new Promise(resolve => setTimeout(resolve, 50))
            
        } catch (error) {
            console.error("Error resetting animation:", error)
        } finally {
            setIsResetting(false)
        }
    }

    useEffect(() => {
        resetAnimation()
    }, [pathname])

    return {
        scope,
        firstLetter,
        restOfName,
        handleMouseEnter,
        resetAnimation, 
        isHovering,
    }
}
