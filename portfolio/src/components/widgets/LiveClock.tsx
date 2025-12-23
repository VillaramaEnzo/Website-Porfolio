'use client'

import Clock from '@/components/widgets/Clock/Clock'
import { formatClockDisplay } from '@/utils/getFormattedClockText'
import type { LiveClockProps } from '@/components/widgets/Clock/Clock'

export default function LiveClock({ 
  location = 'Auckland, NZ',
  use24Hour = true,
  showSeconds = true,
  className = ""
}: LiveClockProps) {
  return (
    <div className={className}>
      {formatClockDisplay(location)} <Clock location={location} use24Hour={use24Hour} showSeconds={showSeconds} />
    </div>
  )
}

