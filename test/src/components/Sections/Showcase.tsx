import { motion, useTransform, MotionValue } from 'motion/react'
import ProjectSlider from '@/components/Widgets/ProjectSlider'

// This is the showcase section, where I display my recent projects.

export default function Showcase() {
  return (
    <motion.div 
      className="h-full z-10 flex border border-red-500 items-center bg-transparent justify-center section"
    >
      <div className="w-full h-full bg-transparent">
        <ProjectSlider />
      </div>
    </motion.div>
  )
}