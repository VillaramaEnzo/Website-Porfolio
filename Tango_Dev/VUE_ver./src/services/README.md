# API Service Documentation

This directory contains centralized API services for the application.

## Structure

- **`apiClient.ts`** - Centralized API client with standardized error handling
- **`formStorage.ts`** - Form storage service (localStorage-based, will migrate to API)

## Usage

### Basic API Calls

All API calls go through the centralized `apiClient` service:

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '../services/apiClient'
import { API_CONFIG } from '../config/api'

// GET request
const users = await apiGet<User[]>(API_CONFIG.ENDPOINTS.TEST_USERS)

// GET with parameter
const user = await apiGet<User>(API_CONFIG.ENDPOINTS.TEST_USER('123'))

// POST request
const result = await apiPost<ResponseType>(API_CONFIG.ENDPOINTS.SOME_ENDPOINT, { data: 'value' })

// PUT request
const updated = await apiPut<ResponseType>(API_CONFIG.ENDPOINTS.TEST_USER('123'), { verified: true })

// DELETE request
await apiDelete(API_CONFIG.ENDPOINTS.TEST_USER('123'))
```

### Error Handling

The API client throws `ApiClientError` for all errors:

```typescript
import { ApiClientError } from '../services/apiClient'

try {
  const user = await apiGet<User>(API_CONFIG.ENDPOINTS.TEST_USER('123'))
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('API Error:', error.message)
    console.error('Status:', error.status)
    console.error('Data:', error.data)
  }
}
```

### File Uploads

For file uploads, use `apiUpload`:

```typescript
import { apiUpload } from '../services/apiClient'

const formData = new FormData()
formData.append('file', file)
formData.append('metadata', JSON.stringify({ type: 'document' }))

const result = await apiUpload<UploadResponse>(API_CONFIG.ENDPOINTS.UPLOAD, formData)
```

## Configuration

API configuration is in `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: '/api', // Change this for production
  ENDPOINTS: {
    TEST_USERS: '/test-users',
    TEST_USER: (phoneNumber: string) => `/test-users/${phoneNumber}`,
  },
  TIMEOUT: 30000, // 30 seconds
}
```

### Environment Variables

You can set the base URL via environment variable:

```bash
# .env
VITE_API_BASE_URL=https://api.yourdomain.com
```

## Adding New Endpoints

1. **Add endpoint to config** (`src/config/api.ts`):
   ```typescript
   ENDPOINTS: {
     // ... existing endpoints
     NEW_ENDPOINT: '/new-endpoint',
     NEW_ENDPOINT_WITH_PARAM: (id: string) => `/new-endpoint/${id}`,
   }
   ```

2. **Create service function** (e.g., in `src/services/userService.ts`):
   ```typescript
   import { apiGet, apiPost } from './apiClient'
   import { API_CONFIG } from '../config/api'
   
   export const getNewData = async (): Promise<NewDataType> => {
     return apiGet<NewDataType>(API_CONFIG.ENDPOINTS.NEW_ENDPOINT)
   }
   
   export const createNewData = async (data: NewDataInput): Promise<NewDataType> => {
     return apiPost<NewDataType>(API_CONFIG.ENDPOINTS.NEW_ENDPOINT, data)
   }
   ```

3. **Use in components**:
   ```typescript
   import { getNewData, createNewData } from '../services/userService'
   
   const data = await getNewData()
   ```

## Benefits

- ✅ **Centralized**: All API calls in one place
- ✅ **Consistent**: Same error handling everywhere
- ✅ **Configurable**: Easy to change base URL
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Maintainable**: Easy to add interceptors, auth headers, etc.
- ✅ **Testable**: Easy to mock for testing

## Migration from Direct Fetch

**Before:**
```typescript
const response = await fetch('/api/test-users/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ verified: true })
})
const data = await response.json()
```

**After:**
```typescript
import { apiPut } from '../services/apiClient'
import { API_CONFIG } from '../config/api'

const data = await apiPut(API_CONFIG.ENDPOINTS.TEST_USER('123'), { verified: true })
```

