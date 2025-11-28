// Centralized API Client
// Provides a consistent interface for all API calls
// Easy to modify for production backend integration

import { API_CONFIG, getApiUrl } from '../config/api'

export interface ApiError {
  message: string
  status?: number
  statusText?: string
  data?: any
}

export class ApiClientError extends Error {
  status?: number
  statusText?: string
  data?: any

  constructor(message: string, status?: number, statusText?: string, data?: any) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.statusText = statusText
    this.data = data
  }
}

/**
 * Centralized fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint)
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    console.log(`📡 [API] ${options.method || 'GET'} ${url}`, options.body ? { body: options.body } : '')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    console.log(`📡 [API] Response: ${response.status} ${response.statusText}`)
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    
    if (!response.ok) {
      let errorData: any = null
      try {
        errorData = isJson ? await response.json() : await response.text()
      } catch {
        errorData = response.statusText
      }
      
      console.error(`❌ [API] Error response:`, errorData)
      throw new ApiClientError(
        errorData?.error || errorData?.message || `API request failed: ${response.statusText}`,
        response.status,
        response.statusText,
        errorData
      )
    }
    
    if (isJson) {
      const data = await response.json()
      console.log(`✅ [API] Success:`, data)
      return data as T
    } else {
      const text = await response.text()
      return text as unknown as T
    }
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiClientError('Request timeout', 408, 'Request Timeout')
      }
      console.error(`❌ [API] Network error:`, error)
      throw new ApiClientError(`Network error: ${error.message}`)
    }
    
    throw new ApiClientError('Unknown error occurred')
  }
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' })
}

/**
 * POST request
 */
export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT request
 */
export async function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PATCH request
 */
export async function apiPatch<T>(endpoint: string, data?: any): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' })
}

/**
 * Upload file(s) using FormData
 */
export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const url = getApiUrl(endpoint)
  
  try {
    console.log(`📡 [API] POST (multipart) ${url}`)
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    })
    
    console.log(`📡 [API] Response: ${response.status} ${response.statusText}`)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }))
      throw new ApiClientError(
        errorData?.error || `Upload failed: ${response.statusText}`,
        response.status,
        response.statusText,
        errorData
      )
    }
    
    const data = await response.json()
    console.log(`✅ [API] Upload success:`, data)
    return data as T
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error
    }
    console.error(`❌ [API] Upload error:`, error)
    throw new ApiClientError(`Upload error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

