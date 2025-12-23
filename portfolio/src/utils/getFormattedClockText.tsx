import { LOCATION_TIMEZONES } from '@/components/widgets/Clock/timezones'
import type { ClockProps } from '@/components/widgets/Clock/Clock'


export const formatClockDisplay = (location: ClockProps['location']) => 
  ``

export const getFormattedClockText = (props: ClockProps) => {
  const timeZone = LOCATION_TIMEZONES[props.location || 'Auckland, NZ']
  const formattedTime = new Date().toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit',
    second: props.showSeconds ? '2-digit' : undefined,
    hour12: !props.use24Hour,
    timeZone
  })
  
  const fullDisplay = `${formatClockDisplay(props.location)} ${formattedTime}`
  return fullDisplay
}

