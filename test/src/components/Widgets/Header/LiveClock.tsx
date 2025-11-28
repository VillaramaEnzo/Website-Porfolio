import Clock from '@/components/Widgets/Clock/Clock'
import { formatClockDisplay } from '@/utils/getFormattedClockText'
import type { LiveClockProps } from '@/components/Widgets/Clock/Clock'

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