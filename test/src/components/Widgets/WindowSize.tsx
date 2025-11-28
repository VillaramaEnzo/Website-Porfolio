'use client'

import { useWindowSize } from '@/hooks/useWindowSize'

export default function WindowSize() {
  const { width, height } = useWindowSize()

  return (
    <div className="text-sm select-none pointer-events-none">
      {`${width} x ${height}`}
    </div>
  )
} 