"use client"

import { motion, useMotionValue } from 'motion/react'
import { useState } from 'react'
import Image from 'next/image'

import ComingSoon from '@/components/Widgets/ComingSoon'
// import CompleteGraphAnimation from '@/components/tests/Heart Animation/CompleteGraphAnimation'


type Project = {
  id: number
  title: string
  image: string
  description?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: "Project One",
    image: "https://picsum.photos/seed/abc/2880/1800",
  },
  {
    id: 2,
    title: "Project Two",
    image: "https://picsum.photos/seed/picsum/2880/1800",
  },
  {
    id: 3,
    title: "Project Three",
    image: "https://picsum.photos/seed/project5/2880/1800",
  },
  {
    id: 4,
    title: "Project Four",
    image: "https://picsum.photos/seed/book/2880/1800",
  },
  {
    id: 5,
    title: "Project Five",
    image: "https://picsum.photos/seed/cute/2880/1800",
  },
  {
    id: 6,
    title: "Project Six",
    image: "https://picsum.photos/seed/cutiepie/2880/1800",
  }
]

/* 

To do: 

- Replicate https://camillemormal.com Project Carousel

Notes;
- I want to use the same animation as the one on the website
- I want to use the same layout as the one on the website
- I want to use the same functionality as the one on the website
- Navigation buttons for left in right will be < and > instead of "+"
- "+" in the middle when in the non expanded view will 
    then turn into a "x" and then split > and < which 
    then move to the left and right as the nav buttons 
- Looks like it uses a combination of a zoom parallax scroll and clip moving clip mask effect
- 

*/


export default function Projects() {
  
  return (
    <div className="flex border items-center justify-center w-full h-full overflow-hidden">

        <ComingSoon />
    </div>
  )
}
