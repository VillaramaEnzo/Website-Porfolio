"use client"

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'


const BLOCK_SIZE = 60

export default function Pexel() {
    
    const transitionGridRef = useRef<HTMLDivElement>(null)
    const blockRef = useRef<HTMLDivElement[]>([])


    const createTransitionGrid = () => {
        if (!transitionGridRef.current) return

        const container = transitionGridRef.current
        container.innerHTML = ''
        blockRef.current = []

        const {innerWidth, innerHeight} = window

        const columns = Math.ceil(innerWidth / BLOCK_SIZE)
        const rows = Math.ceil(innerHeight / BLOCK_SIZE) + 1

        const offsetX = (innerWidth - columns * BLOCK_SIZE) / 2
        const offsetY = (innerHeight - rows * BLOCK_SIZE) / 2

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const block = document.createElement('div')
                block.className = 'position-absolute opacity-0'
                block.style.cssText = `
                    width: ${BLOCK_SIZE}px;
                    height: ${BLOCK_SIZE}px;
                    left: ${col * BLOCK_SIZE + offsetX}px;
                    top: ${row * BLOCK_SIZE + offsetY}px;
                `
                container.appendChild(block)
                blockRef.current.push(block)
            }
        }

        gsap.set(blockRef.current, { opacity: 0 })

    }

    useEffect(() => {
        createTransitionGrid()
        window.addEventListener('resize', createTransitionGrid)
        return () => window.removeEventListener('resize', createTransitionGrid)
    }, [])

    return (
        <div ref={transitionGridRef} className="fixed inset-0 z-[100] w-[100%] h-[100%] overflow-hidden pointer-events-none"/>
    )
}

