"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useScrollContext } from "@/context/ScrollProvider"
import ProgressBar from "./ProgressBar"
import { useMemo } from 'react'

const variants = {
    number: {
        initial: { 
            y: -100, 
            opacity: 0 
        },
        animate: { 
            y: 0, 
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.2 }
            }
        },
        exit: { 
            y: 100, 
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.2 }
            }
        }
    },
    text: {
        initial: { 
            y: 20, 
            opacity: 0 
        },
        animate: { 
            y: 0, 
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.2 },
            }
        },
        exit: { 
            y: -20, 
            opacity: 0,
            transition: {
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.2 }
            }
        }
    }
}

function Row1() {
    const { activeSection, sectionNames } = useScrollContext();
    
    const { currentSection, sectionNumber } = useMemo(() => ({
        currentSection: activeSection || 0,
        sectionNumber: (activeSection !== null ? activeSection + 1 : 1).toString().padStart(3, '0')
    }), [activeSection]);

    return (    
        <div className="flex mb-2">
            <div className="flex space-x-2 pl-4 overflow-hidden w-[25vw] items-baseline justify-start">
                <div className="text-2xl font-bold"> | </div>
                
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={`number-${sectionNumber}`}
                        variants={variants.number}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-2xl font-bold"
                    >
                        {sectionNumber}
                    </motion.span>
                </AnimatePresence>
                
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={`text-${currentSection}`}
                        variants={variants.text}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-lg font-bold"
                    >
                        {sectionNames[currentSection]}
                    </motion.span>
                </AnimatePresence>
            </div>  
        </div>
    );  
}

function Row2() {
    return (
        <div className="flex w-full h-[8px] overflow-hidden">
            <ProgressBar />
        </div>
    );      
}

export default function SectionIndicator() {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 1.2 }}
            className="fixed bottom-0 flex flex-col justify-end w-[100vw] h-[10vh] pointer-events-none"
        >  
            <Row1 />
            <Row2 />
        </motion.div>
    );
}