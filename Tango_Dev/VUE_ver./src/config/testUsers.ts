// Test user API client - uses centralized API service
// Data is stored in src/data/testUsers.json and served via API

import type { FormType } from '../types/formTypes'
import { apiGet, apiPut } from '../services/apiClient'
import { API_CONFIG } from './api'

export interface TestUser {
  phoneNumber: string
  password: string
  firstName: string
  lastName: string
  email: string
  // Verification status
  submittedFormType?: FormType | null // null = no form submitted, otherwise the form type
  verified: boolean // true if verified, false if awaiting verification
}

interface UpdateTestUserResponse {
  success: boolean
  user: TestUser
}

/**
 * Fetch all test users from API
 */
export const fetchTestUsers = async (): Promise<TestUser[]> => {
  return apiGet<TestUser[]>(API_CONFIG.ENDPOINTS.TEST_USERS)
}

/**
 * Fetch a specific test user by phone number from API
 */
export const fetchTestUser = async (phoneNumber: string): Promise<TestUser | null> => {
  try {
    return await apiGet<TestUser>(API_CONFIG.ENDPOINTS.TEST_USER(phoneNumber))
  } catch (error: any) {
    // Handle 404 as null (user not found)
    if (error.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * Update a test user via API
 */
export const updateTestUser = async (
  phoneNumber: string,
  updates: Partial<TestUser>
): Promise<TestUser> => {
  const response = await apiPut<UpdateTestUserResponse>(
    API_CONFIG.ENDPOINTS.TEST_USER(phoneNumber),
    updates
  )
  return response.user
}

/**
 * Get test user by phone number (async - uses API)
 */
export const getTestUser = async (phoneNumber: string): Promise<TestUser | undefined> => {
  return await fetchTestUser(phoneNumber) || undefined
}

/**
 * Validate test user credentials (async - uses API)
 */
export const validateTestUser = async (
  phoneNumber: string,
  password: string
): Promise<TestUser | null> => {
  const user = await getTestUser(phoneNumber)
  if (user && user.password === password) {
    return user
  }
  return null
}

/**
 * Initialize verification status for a test user on login
 * This sets up their verification state based on their test user config
 */
export const getInitialVerificationState = (user: TestUser) => {
  return {
    submittedFormType: user.submittedFormType,
    verified: user.verified
  }
}

