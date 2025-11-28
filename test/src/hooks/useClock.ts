import { useState, useEffect, useMemo } from 'react'

interface ClockOptions {
  use24Hour?: boolean
  showSeconds?: boolean
  timeZone?: string
}

export function useClock({ 
  use24Hour = true, 
  showSeconds = false,
  timeZone = 'Pacific/Auckland'
}: ClockOptions = {}) {
  const [time, setTime] = useState<string>('')

  // Create a stable configuration object
  const config = useMemo(() => ({
    use24Hour,
    showSeconds,
    timeZone
  }), [use24Hour, showSeconds, timeZone])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: config.showSeconds ? '2-digit' : undefined,
        hour12: !config.use24Hour,
        timeZone: config.timeZone
      }
      
      const timeString = now.toLocaleTimeString('en-AU', options)
      setTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, config.showSeconds ? 1000 : 60000)

    return () => clearInterval(interval)
  }, [config]) // Now we only depend on the stable config object
  
  return { time }
} 