import { useState, useEffect } from 'react'

interface MatrixRainMotionConfig {
  fontSize?: number
  color?: string
  chars?: string
  speed?: number
}

interface Column {
  chars: string[]
  y: number
}

export const useMatrixRainMotion = (
  containerRef: React.RefObject<HTMLDivElement>,
  config: MatrixRainMotionConfig = {}
) => {
  const [columns, setColumns] = useState<Column[]>([])
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current
      if (!container) return
      
      setContainerSize({
        width: container.clientWidth,
        height: container.clientHeight
      })
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    const {
      fontSize = 14,
      chars = '日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789'
    } = config

    const charArray = chars.split('')
    const columnCount = Math.floor(containerSize.width / fontSize)
    const charsPerColumn = Math.ceil(containerSize.height / fontSize) + 1

    const newColumns: Column[] = Array.from({ length: columnCount }, () => ({
      chars: Array.from({ length: charsPerColumn }, () => 
        charArray[Math.floor(Math.random() * charArray.length)]
      ),
      y: -fontSize
    }))

    setColumns(newColumns)
  }, [containerSize, config])

  return { columns }
} 