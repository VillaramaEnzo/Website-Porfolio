// Todo: 
// Prevent From Opening On Mobile
// Prevent from opening when preloader is still showing
// Add Search Results

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import getIcon from '@/utils/getIcon'


export default function CommandCenter() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === ' ') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
            }

            if (e.key === 'Enter') {
                setIsOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-600 z-[100]"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    <div className="fixed inset-0 w-screen h-screen flex flex-col items-center z-[101] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ ease: [0.16, 1, 0.3, 1] }}
                            className="w-[640px] max-w-[calc(100vw-2rem)] mt-[30vh] bg-white rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
                        >
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2">
                                    {getIcon('search', 'text-xl')}
                                </span>
                                <input
                                    type="text"
                                    className="w-full p-2 pl-8 outline-none border-b text-lg"
                                    placeholder="Enter Cheat Codes..."
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto">
                                {/* Search results will go here */}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
} 