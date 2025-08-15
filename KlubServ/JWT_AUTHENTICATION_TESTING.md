# JWT Authentication Flow Testing Guide

## Overview
This guide provides comprehensive testing procedures for the complete Clerk JWT authentication flow in the One4Team application.

## 🔐 Target Authentication Flow
```
[User logs in via Clerk ➝ Session includes JWT with roles ➝ Frontend fetch() sends JWT ➝ Express backend validates token ➝ Role-based logic applies]
```

## Prerequisites

### 1. Clerk Dashboard Configuration
Ensure the following is configured in your Clerk Dashboard:

#### JWT Template Configuration
- **Template Name**: `one4team`
- **Audience**: `one4team`
- **Custom Claims**: Include role metadata
  ```json
  {
    "aud": "one4team",
    "sub": "{{user.id}}",
    "email": "{{user.primary_email_address.email_address}}",
    "publicMetadata": {
      "roles": "{{user.public_metadata.roles}}",
      "user_role": "{{user.public_metadata.user_role}}"
    }
  }
  ```

#### Environment Variables
Ensure these are set in your `.env.local`:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_TEMPLATE_NAME=one4team
CLERK_JWT_AUDIENCE=one4team
```

## 🧪 Testing Checklist

### ✅ Test 1: Valid Token with Allowed Role
**Scenario**: User has valid JWT token with required role

**Steps**:
1. Log in as an admin user via Clerk
2. Navigate to `/dashboard/admin`
3. Check browser network tab for API requests
4. Verify requests include `Authorization: Bearer <token>` header
5. Confirm successful access to admin dashboard

**Expected Result**: ✅ Access granted, dashboard loads successfully

**API Endpoint Test**:
```bash
curl -H "Authorization: Bearer <valid-token>" \
     http://localhost:4000/api/admin/members
```
**Expected**: 200 OK with data

### ❌ Test 2: Valid Token with Wrong Role
**Scenario**: User has valid JWT token but lacks required role

**Steps**:
1. Log in as a member user (not admin)
2. Try to access `/dashboard/admin`
3. Check browser network tab for API requests
4. Verify requests include valid token

**Expected Result**: ❌ 403 Forbidden, redirect to `/403`

**API Endpoint Test**:
```bash
curl -H "Authorization: Bearer <member-token>" \
     http://localhost:4000/api/admin/members
```
**Expected**: 403 Forbidden with error message

### ❌ Test 3: Invalid Token
**Scenario**: User provides invalid or expired JWT token

**Steps**:
1. Manually modify the token in browser storage
2. Try to access any protected route
3. Check browser network tab for API requests

**Expected Result**: ❌ 401 Unauthorized

**API Endpoint Test**:
```bash
curl -H "Authorization: Bearer invalid-token" \
     http://localhost:4000/api/admin/members
```
**Expected**: 401 Unauthorized with error message

### ❌ Test 4: No Token
**Scenario**: User makes request without JWT token

**Steps**:
1. Clear browser storage (localStorage/sessionStorage)
2. Try to access any protected route
3. Check browser network tab for API requests

**Expected Result**: ❌ 401 Unauthorized

**API Endpoint Test**:
```bash
curl http://localhost:4000/api/admin/members
```
**Expected**: 401 Unauthorized with "Missing token" error

## 🔍 Detailed Testing Procedures

### Frontend Token Fetching Test

#### Test getToken() with Template
```javascript
// In browser console on any authenticated page
import { useAuth } from '@clerk/nextjs';
const { getToken } = useAuth();

// Test with template
const token = await getToken({ template: 'one4team' });
console.log('Token:', token);

// Verify token structure (decode base64)
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Token payload:', payload);
console.log('Audience:', payload.aud);
console.log('Roles:', payload.publicMetadata?.roles);
```

**Expected Result**: 
- Token is not null/undefined
- `aud` field equals `'one4team'`
- `publicMetadata.roles` contains user roles

#### Test authenticatedFetch Utility
```javascript
// Test the new authenticatedFetch utility
import { authenticatedFetch } from '@/lib/clerk-utils';

try {
  const response = await authenticatedFetch('/api/admin/members');
  const data = await response.json();
  console.log('API Response:', data);
} catch (error) {
  console.error('API Error:', error);
}
```

**Expected Result**: Successful API call with proper authentication headers

### Backend Token Validation Test

#### Test JWT Verification
```bash
# Test with valid token
curl -H "Authorization: Bearer <valid-token>" \
     -H "Content-Type: application/json" \
     http://localhost:4000/api/admin/members

# Test with invalid token
curl -H "Authorization: Bearer invalid-token" \
     -H "Content-Type: application/json" \
     http://localhost:4000/api/admin/members

# Test without token
curl -H "Content-Type: application/json" \
     http://localhost:4000/api/admin/members
```

#### Test Role-Based Access
```bash
# Test admin endpoint with admin token
curl -H "Authorization: Bearer <admin-token>" \
     http://localhost:4000/api/admin/members

# Test admin endpoint with member token
curl -H "Authorization: Bearer <member-token>" \
     http://localhost:4000/api/admin/members

# Test trainer endpoint with trainer token
curl -H "Authorization: Bearer <trainer-token>" \
     http://localhost:4000/api/trainer/players
```

### Multi-Role Testing

#### Test User with Multiple Roles
1. Assign multiple roles to a user in Clerk Dashboard
2. Log in as that user
3. Test access to different role-specific areas
4. Verify user can access all areas for their assigned roles

**Expected Result**: User can access all areas corresponding to their roles

#### Test Role Hierarchy
1. Test admin access to all areas
2. Test trainer access to trainer areas but not admin areas
3. Test member access to member areas but not admin/trainer areas

## 🐛 Error Debugging

### Common Issues and Solutions

#### Issue: "Missing token" error
**Cause**: Authorization header not properly set
**Solution**: 
- Check if `getToken()` is being called correctly
- Verify template name is correct: `getToken({ template: 'one4team' })`
- Check browser network tab for Authorization header

#### Issue: "Invalid token" error
**Cause**: Token validation failed
**Solution**:
- Verify JWT template configuration in Clerk Dashboard
- Check audience matches: `aud: 'one4team'`
- Ensure token is not expired
- Verify `CLERK_PUBLISHABLE_KEY` is correct

#### Issue: "Access denied" error
**Cause**: User lacks required role
**Solution**:
- Check user roles in Clerk Dashboard
- Verify role assignment is correct
- Check role validation logic in backend

#### Issue: Frontend can't fetch token
**Cause**: Clerk session issues
**Solution**:
- Check if user is properly signed in
- Verify Clerk configuration
- Check browser console for Clerk errors

### Debug Commands

#### Check Token in Browser
```javascript
// In browser console
import { useAuth } from '@clerk/nextjs';
const { getToken } = useAuth();

// Get token
const token = await getToken({ template: 'one4team' });
console.log('Token length:', token?.length);

// Decode token (if valid)
if (token) {
  const parts = token.split('.');
  if (parts.length === 3) {
    const payload = JSON.parse(atob(parts[1]));
    console.log('Token payload:', payload);
  }
}
```

#### Check Backend Logs
```bash
# Monitor backend logs
npm run dev

# Look for authentication errors
grep -i "auth\|token\|jwt" logs/backend.log
```

## 📊 Test Results Template

| Test Case | Status | Notes |
|-----------|--------|-------|
| Valid token with allowed role | ⬜ | |
| Valid token with wrong role | ⬜ | |
| Invalid token | ⬜ | |
| No token | ⬜ | |
| Multi-role access | ⬜ | |
| Role hierarchy | ⬜ | |
| Frontend token fetching | ⬜ | |
| Backend token validation | ⬜ | |

## 🎯 Success Criteria

✅ **Complete JWT Flow Working**:
- User logs in via Clerk → Session includes JWT with roles
- Frontend fetch() sends JWT with proper template
- Express backend validates token with audience validation
- Role-based logic applies correctly
- All error scenarios handled properly

✅ **Security Requirements Met**:
- JWT tokens properly validated
- Role-based access control enforced
- Error handling prevents information leakage
- Comprehensive testing coverage

## 🔧 Manual Testing Script

```bash
#!/bin/bash
# JWT Authentication Flow Test Script

echo "🧪 Testing JWT Authentication Flow..."

# Test 1: Valid token with allowed role
echo "Test 1: Valid token with allowed role"
curl -H "Authorization: Bearer $VALID_ADMIN_TOKEN" \
     http://localhost:4000/api/admin/members

# Test 2: Valid token with wrong role
echo "Test 2: Valid token with wrong role"
curl -H "Authorization: Bearer $VALID_MEMBER_TOKEN" \
     http://localhost:4000/api/admin/members

# Test 3: Invalid token
echo "Test 3: Invalid token"
curl -H "Authorization: Bearer invalid-token" \
     http://localhost:4000/api/admin/members

# Test 4: No token
echo "Test 4: No token"
curl http://localhost:4000/api/admin/members

echo "✅ JWT Authentication Flow Testing Complete"
```

## 📝 Notes

- Always test in incognito/private browsing mode to avoid cached sessions
- Clear browser storage between tests to ensure clean state
- Monitor browser network tab for all API requests
- Check backend logs for detailed error information
- Test both development and production environments
- Verify error messages don't leak sensitive information 