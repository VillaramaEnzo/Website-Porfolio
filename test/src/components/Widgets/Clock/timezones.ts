export const LOCATION_TIMEZONES: Record<string, string> = {
  'Auckland, NZ': 'Pacific/Auckland',
  'Sydney, AU': 'Australia/Sydney',
  'Tokyo, JP': 'Asia/Tokyo',
  'London, UK': 'Europe/London',
  'New York, US': 'America/New_York',
  'Los Angeles, US': 'America/Los_Angeles',
  // Add more as needed
}

export type LocationKey = keyof typeof LOCATION_TIMEZONES 