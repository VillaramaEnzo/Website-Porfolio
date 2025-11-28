import { useRef } from 'react'
import { motion } from 'motion/react'
import { useMatrixRainMotion } from '@/components/tests/useMatrixRainMotion'

interface MatrixRainMotionProps {
  speed?: number
  fontSize?: number
  color?: string
  chars?: string
}

export default function MatrixRainMotion({ 
  speed = 33,
  fontSize = 14,
  color = '#999999',
  chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789'
}: MatrixRainMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { columns } = useMatrixRainMotion(containerRef, {
    speed,
    fontSize,
    color,
    chars
  })

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-full relative overflow-hidden"
    >
      {columns.map((column, columnIndex) => (
        <div 
          key={columnIndex}
          className="absolute top-0"
          style={{ left: `${columnIndex * fontSize}px` }}
        >
          {column.chars.map((char, charIndex) => (
            <motion.div
              key={`${columnIndex}-${charIndex}`}
              initial={{ opacity: 0, y: -fontSize }}
              animate={{ 
                opacity: [0, 1, 0],
                y: column.y + (charIndex * fontSize)
              }}
              transition={{
                duration: speed / 1000,
                ease: "linear",
                repeat: Infinity,
                delay: (columnIndex * 0.1) + (charIndex * 0.1)
              }}
              style={{
                color,
                fontSize: `${fontSize}px`,
                fontFamily: 'monospace',
                height: fontSize
              }}
            >
              {char}
            </motion.div>
          ))}
        </div>
      ))}
    </motion.div>
  )
} 