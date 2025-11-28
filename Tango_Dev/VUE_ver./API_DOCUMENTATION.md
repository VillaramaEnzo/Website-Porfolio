# Test Users API Documentation

This document describes the API endpoints for managing test users data during development.

## Overview

Test users data is stored in `src/data/testUsers.json` and served via API endpoints provided by the Vite dev server. This allows you to test GET and PUT API calls similar to how you would interact with a real backend.

## Base URL

All API endpoints are available at:
- Development: `http://localhost:5173/api/test-users` (or your Vite dev server port)

## Endpoints

### GET /api/test-users

Get all test users.

**Response:**
```json
[
  {
    "phoneNumber": "1",
    "password": "123",
    "firstName": "John",
    "lastName": "Agent",
    "email": "john.agent@test.com",
    "submittedFormType": null,
    "verified": false
  },
  ...
]
```

**Example:**
```javascript
const response = await fetch('/api/test-users')
const users = await response.json()
```

---

### GET /api/test-users/:phoneNumber

Get a specific test user by phone number.

**Parameters:**
- `phoneNumber` (path parameter): The phone number of the user

**Response (200 OK):**
```json
{
  "phoneNumber": "1",
  "password": "123",
  "firstName": "John",
  "lastName": "Agent",
  "email": "john.agent@test.com",
  "submittedFormType": null,
  "verified": false
}
```

**Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

**Example:**
```javascript
const response = await fetch('/api/test-users/1')
const user = await response.json()
```

---

### PUT /api/test-users/:phoneNumber

Update a specific test user by phone number.

**Parameters:**
- `phoneNumber` (path parameter): The phone number of the user

**Request Body:**
```json
{
  "submittedFormType": "agent",
  "verified": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "phoneNumber": "1",
    "password": "123",
    "firstName": "John",
    "lastName": "Agent",
    "email": "john.agent@test.com",
    "submittedFormType": "agent",
    "verified": true
  }
}
```

**Response (404 Not Found):**
```json
{
  "error": "User not found"
}
```

**Example:**
```javascript
const response = await fetch('/api/test-users/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    submittedFormType: 'agent',
    verified: true
  })
})
const result = await response.json()
```

---

## Using the API in Code

### Recommended: Use Service Functions

The app uses centralized service functions. For test users, use `src/config/testUsers.ts`:

```typescript
import { fetchTestUsers, fetchTestUser, updateTestUser, validateTestUser } from './config/testUsers'

// Get all users
const users = await fetchTestUsers()

// Get specific user
const user = await fetchTestUser('1')

// Update user
const updatedUser = await updateTestUser('1', {
  submittedFormType: 'agent',
  verified: true
})

// Validate credentials
const user = await validateTestUser('1', '123')
```

### Direct API Client Usage

For custom endpoints, use the centralized API client:

```typescript
import { apiGet, apiPut, apiPost } from './services/apiClient'
import { API_CONFIG } from './config/api'

// Direct API calls
const users = await apiGet(API_CONFIG.ENDPOINTS.TEST_USERS)
const user = await apiGet(API_CONFIG.ENDPOINTS.TEST_USER('1'))
const updated = await apiPut(API_CONFIG.ENDPOINTS.TEST_USER('1'), { verified: true })
```

See `src/services/README.md` for full API client documentation.

---

## Data Storage

- **File Location:** `src/data/testUsers.json`
- **Format:** JSON array of user objects
- **Updates:** Changes are written directly to the JSON file
- **Viewing Data:** You can view the current state by opening `src/data/testUsers.json` or calling `GET /api/test-users`

---

## Development Server

**Important:** The API endpoints are only available when the Vite dev server is running.

- **Start dev server:** `npm run dev`
- **Default port:** Usually `http://localhost:5173`
- **API endpoints:** Available at `/api/test-users/*`

The dev server must be running for the app to function, as it depends on these API endpoints for authentication and user data.

---

## Testing API Calls

You can test the API endpoints using:

1. **Browser DevTools:**
   ```javascript
   // In browser console
   fetch('/api/test-users').then(r => r.json()).then(console.log)
   ```

2. **curl:**
   ```bash
   curl http://localhost:5173/api/test-users
   ```

3. **Postman/Insomnia:** Use the endpoints listed above

4. **View in Browser:** Navigate to `http://localhost:5173/api/test-users` to see JSON data

---

## Notes

- All endpoints are development-only and should not be used in production
- The JSON file is updated in real-time when using PUT endpoints
- Changes persist across server restarts
- The API uses the same data structure as the previous TypeScript file for compatibility

