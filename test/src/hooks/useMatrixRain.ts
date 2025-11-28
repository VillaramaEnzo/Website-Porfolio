import { useEffect, useRef, useState } from 'react'

interface MatrixRainConfig {
  fontSize?: number
  color?: string
  chars?: string
  speed?: number
}

export const useMatrixRain = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  config: MatrixRainConfig = {}
) => {
  const animationRef = useRef<number>()
  const dropsRef = useRef<number[]>([])
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Handle resize
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const container = canvas.parentElement
      if (container) {
        setCanvasSize({
          width: container.clientWidth,
          height: container.clientHeight
        })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Matrix animation
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const {
      fontSize = 14,
      color = '#999999',
      chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789',
      speed = 33
    } = config

    const columns = Math.floor(canvas.width / fontSize)
    if (dropsRef.current.length === 0) {
      dropsRef.current = new Array(columns).fill(1)
    }

    const charArray = chars.split('')

    const draw = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = color
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < dropsRef.current.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)]
        ctx.fillText(text, i * fontSize, dropsRef.current[i] * fontSize)
        
        if (dropsRef.current[i] * fontSize > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0
        }
        dropsRef.current[i] += 1 / (speed / 33)
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [canvasRef, config, canvasSize])

  return canvasSize
} 