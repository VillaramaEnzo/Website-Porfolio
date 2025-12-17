import { motion } from "motion/react"

export default function NewSection() {
  return (
      <motion.div
        initial={{ x: '200%' }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center w-full h-full border-2 border-red-500"
      >
        <h1>New Section</h1>
      </motion.div>
    )
}

