import { LOCATION_TIMEZONES, LocationKey } from './timezones'
import { useClock } from '@/hooks/useClock'

export interface ClockProps {
  location?: LocationKey
  use24Hour?: boolean
  showSeconds?: boolean
  className?: string
}

export interface LiveClockProps extends ClockProps {}

export default function Clock({
  location = 'Auckland, NZ',
  use24Hour = true,
  showSeconds = false,
  className = ""
}: ClockProps) {
  const timeZone = LOCATION_TIMEZONES[location]
  const { time } = useClock({ use24Hour, showSeconds, timeZone })

  return (
    <span className={className}>
      {time}
    </span>
  )
}
