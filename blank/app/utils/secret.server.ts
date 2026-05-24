export interface SecretCodeConfig {
  description: string
  action: string
}

export const SECRET_CODES_DATA: Record<string, SecretCodeConfig> = {
  '#portfolio': {
    description: 'Open portfolio with preloader handoff',
    action: 'go_portfolio_with_preloader',
  },
  '#ily': {
    description: 'Try opening the ILY route',
    action: 'go_ily',
  },
  '#refresh': {
    description: 'Refresh the current page',
    action: 'refresh_page',
  },
}
