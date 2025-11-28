import getIcon from '@/utils/getIcon'
import { motion } from 'motion/react'

export default function PlayButton() {
  return (
    <motion.button 
      className="flex items-center justify-center bg-gray-500/50 w-[10%] h-[15%] min-w-[60px] min-h-[35px]"
      onClick={() => {
        console.log('clicked')
      }}
    >
      {getIcon('play', 'text-white text-xl')}
    </motion.button>
  )
}
