// API Configuration
// Centralized configuration for all API endpoints

export const API_CONFIG = {
  // Base URL for API endpoints
  // In development, this is handled by Vite proxy
  // In production, update this to your backend URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  
  // API endpoint paths
  ENDPOINTS: {
    TEST_USERS: '/test-users',
    TEST_USER: (phoneNumber: string) => `/test-users/${phoneNumber}`,
    // Add more endpoints here as needed
    // ONBOARDING_SUBMIT: '/onboarding/submit',
    // VERIFICATION_STATUS: '/verification/status',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
}

/**
 * Get full API URL for an endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

