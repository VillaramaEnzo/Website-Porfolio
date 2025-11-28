# API Quick Reference

Quick guide for using and modifying API endpoints in the codebase.

## File Structure

```
src/
├── config/
│   ├── api.ts              # API configuration (base URL, endpoints)
│   └── testUsers.ts        # Test user service functions
├── services/
│   ├── apiClient.ts        # Centralized API client (GET, POST, PUT, etc.)
│   └── README.md           # Detailed API service documentation
└── data/
    └── testUsers.json      # Test user data (served via API)
```

## Current Endpoints

All endpoints are configured in `src/config/api.ts`:

- `GET /api/test-users` - Get all test users
- `GET /api/test-users/:phoneNumber` - Get specific test user
- `PUT /api/test-users/:phoneNumber` - Update test user

## How to Use

### 1. Using Existing Service Functions (Recommended)

```typescript
import { fetchTestUser, updateTestUser } from '../config/testUsers'

// Get user
const user = await fetchTestUser('123')

// Update user
const updated = await updateTestUser('123', { verified: true })
```

### 2. Using API Client Directly

```typescript
import { apiGet, apiPut } from '../services/apiClient'
import { API_CONFIG } from '../config/api'

// Get all users
const users = await apiGet(API_CONFIG.ENDPOINTS.TEST_USERS)

// Update user
const result = await apiPut(API_CONFIG.ENDPOINTS.TEST_USER('123'), { verified: true })
```

## How to Add New Endpoints

### Step 1: Add to API Config

Edit `src/config/api.ts`:

```typescript
ENDPOINTS: {
  // ... existing endpoints
  NEW_ENDPOINT: '/new-endpoint',
  NEW_ENDPOINT_WITH_ID: (id: string) => `/new-endpoint/${id}`,
}
```

### Step 2: Create Service Functions (Optional but Recommended)

Create `src/services/newService.ts`:

```typescript
import { apiGet, apiPost } from './apiClient'
import { API_CONFIG } from '../config/api'

export interface NewDataType {
  id: string
  name: string
}

export const getNewData = async (): Promise<NewDataType[]> => {
  return apiGet<NewDataType[]>(API_CONFIG.ENDPOINTS.NEW_ENDPOINT)
}

export const createNewData = async (data: Partial<NewDataType>): Promise<NewDataType> => {
  return apiPost<NewDataType>(API_CONFIG.ENDPOINTS.NEW_ENDPOINT, data)
}
```

### Step 3: Use in Components

```typescript
import { getNewData, createNewData } from '../services/newService'

const data = await getNewData()
```

## Changing API Base URL

### For Development
Uses `/api` by default (handled by Vite dev server)

### For Production

**Option 1: Environment Variable**
Create `.env.production`:
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

**Option 2: Direct Config**
Edit `src/config/api.ts`:
```typescript
BASE_URL: 'https://api.yourdomain.com',
```

## Error Handling

All API calls throw `ApiClientError`:

```typescript
import { ApiClientError } from '../services/apiClient'

try {
  const user = await fetchTestUser('123')
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('Status:', error.status)
    console.error('Message:', error.message)
    console.error('Data:', error.data)
  }
}
```

## Benefits of This Structure

✅ **Easy to modify**: Change base URL in one place  
✅ **Consistent**: All API calls use same error handling  
✅ **Type-safe**: Full TypeScript support  
✅ **Maintainable**: Clear separation of concerns  
✅ **Testable**: Easy to mock for unit tests  
✅ **Scalable**: Easy to add authentication, interceptors, etc.

## Current Usage in Codebase

- ✅ `testUsers.ts` - Uses `apiGet` and `apiPut`
- ✅ `Forms.vue` - Uses `updateTestUser` service function
- ✅ `AwaitingVerification.vue` - Uses `updateTestUser` service function
- ✅ `App.vue` - Uses `validateTestUser` service function

All API calls are now centralized and easy to modify!

