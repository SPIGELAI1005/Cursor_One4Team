# JWT Club ID Setup Guide

## Overview
This document explains how to configure Clerk JWT templates to include `club_id` in the token payload for multi-tenant support.

## JWT Template Configuration

### 1. Clerk Dashboard Setup

1. Go to your Clerk Dashboard
2. Navigate to **JWT Templates**
3. Create or edit the `one4team` template
4. Configure the template as follows:

```json
{
  "aud": "one4team",
  "iss": "https://clerk.your-domain.com",
  "sub": "{{user.id}}",
  "iat": "{{iat}}",
  "exp": "{{exp}}",
  "club_id": "{{user.public_metadata.club_id}}"
}
```

### 2. Key Configuration Points

- **`aud`**: Must be `one4team` (matches our backend validation)
- **`club_id`**: Maps from `user.public_metadata.club_id`
- **Template Name**: Should be `one4team` (matches our frontend configuration)

### 3. User Metadata Setup

Users must have `club_id` set in their `publicMetadata`:

```javascript
// Example: Setting club_id for a user
await clerkClient.users.updateUser(userId, {
  publicMetadata: {
    club_id: "550e8400-e29b-41d4-a716-446655440001",
    roles: ["admin", "member"],
    user_role: "admin"
  }
});
```

## Backend Implementation

### 1. JWT Payload Structure

The JWT payload will now include:

```json
{
  "aud": "one4team",
  "iss": "https://clerk.your-domain.com",
  "sub": "user_2abc123def456",
  "iat": 1703123456,
  "exp": 1703209856,
  "club_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

### 2. Backend Extraction

The `authenticateUser` middleware extracts `club_id`:

```typescript
// Extract club_id from JWT payload and set on request
const clubId = payload.club_id as string;
if (clubId) {
  req.clubId = clubId;
}
```

### 3. Database Context Setting

The `setTenantContext` middleware sets the database context:

```typescript
// Set the current tenant context in the database
await prisma.$executeRaw`SELECT set_current_tenant(${clubId}::uuid)`;
```

## Frontend Implementation

### 1. Token Fetching

The frontend should use the `one4team` template:

```typescript
// Get token with one4team template for proper audience validation
const token = await getToken({ template: 'one4team' });
```

### 2. Club ID Header

Include club_id in API requests:

```typescript
const response = await fetch('/api/members', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Club-ID': clubId // Optional, as it's also in JWT
  }
});
```

## Testing

### 1. Verify JWT Payload

```bash
# Decode JWT to verify club_id is present
echo "your.jwt.token" | base64 -d | jq .
```

### 2. Test API Endpoints

```bash
# Test with club_id in JWT
curl -H "Authorization: Bearer <token_with_club_id>" \
     http://localhost:4000/api/members

# Verify only club-specific data is returned
```

## Troubleshooting

### Common Issues

1. **Missing club_id in JWT**
   - Check JWT template configuration
   - Verify user has `club_id` in `publicMetadata`

2. **Database RLS not working**
   - Ensure `set_current_tenant()` function exists
   - Check RLS policies are enabled

3. **Cross-tenant data access**
   - Verify Prisma middleware is working
   - Check tenant context is being set correctly

### Debug Steps

1. **Check JWT Payload**:
   ```bash
   echo $JWT_TOKEN | base64 -d | jq .
   ```

2. **Check Database Context**:
   ```sql
   SELECT current_setting('app.current_tenant');
   ```

3. **Check User Metadata**:
   ```javascript
   const user = await clerkClient.users.getUser(userId);
   console.log(user.publicMetadata);
   ```

## Security Considerations

1. **JWT Validation**: Always validate JWT audience and issuer
2. **Club ID Validation**: Verify club_id exists and user has access
3. **Database RLS**: Ensure RLS policies are properly configured
4. **Cross-Tenant Protection**: Prevent data leakage between tenants

## Environment Variables

Ensure these are set in your `.env` file:

```bash
CLERK_JWT_TEMPLATE_NAME=one4team
CLERK_JWT_AUDIENCE=one4team
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
``` 