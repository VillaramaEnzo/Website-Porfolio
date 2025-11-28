# Test User Credentials

This document lists all available test user accounts for the Tango application.

## Available Test Users

### 1. John Agent (No Form Submitted)
- **Phone:** `1234567890`
- **Password:** `test123`
- **Status:** No form submitted - can access all forms
- **Use Case:** Test form selection and submission flow

### 2. Jane Borrower (Awaiting Verification)
- **Phone:** `9876543210`
- **Password:** `test123`
- **Status:** Borrower form submitted, awaiting verification
- **Use Case:** Test awaiting verification screen

### 3. Bob Lender (Verified)
- **Phone:** `5555555555`
- **Password:** `test123`
- **Status:** Lender form submitted and verified
- **Use Case:** Test verified dashboard

### 4. Alice Agent (Awaiting Verification)
- **Phone:** `1111111111`
- **Password:** `test123`
- **Status:** Agent form submitted, awaiting verification
- **Use Case:** Test awaiting verification for agent type

## How to Modify Test Users

Edit the `testUsers` array in `src/config/testUsers.ts`:

```typescript
export const testUsers: TestUser[] = [
  {
    phoneNumber: '1234567890',
    password: 'test123',
    firstName: 'John',
    lastName: 'Agent',
    email: 'john.agent@test.com',
    submittedFormType: null, // null = no form, 'agent'|'borrower'|'lender' = submitted
    verified: false // true = verified, false = awaiting
  },
  // ... more users
]
```

## Changing Verification Status

To change a user's verification status:

1. Open `src/config/testUsers.ts`
2. Find the user you want to modify
3. Change `submittedFormType`:
   - `null` = No form submitted
   - `'agent'` = Agent form submitted
   - `'borrower'` = Borrower form submitted
   - `'lender'` = Lender form submitted
4. Change `verified`:
   - `false` = Awaiting verification
   - `true` = Verified
5. Save the file and login again with that user's credentials

## Notes

- All test users use the same password: `test123`
- Signup is disabled - only test users can login
- Verification status is initialized on login based on test user config
- Changes to test users require a new login to take effect

