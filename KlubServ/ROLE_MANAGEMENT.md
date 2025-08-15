# One4Team Role Management System

This document describes the comprehensive role management system implemented in One4Team using Clerk authentication.

## Overview

The role management system automatically assigns roles to new users upon registration and provides administrative tools to manage user roles throughout the application lifecycle.

## User Roles

### Available Roles

1. **Member** (`member`)
   - Default role for new registrations
   - Access to member app (`/app`)
   - Profile management and payments
   - Cannot access dashboard

2. **Trainer** (`trainer`)
   - Player management capabilities
   - Class scheduling and management
   - Access to dashboard (`/dashboard`)
   - Cannot access admin-only features

3. **Administrator** (`admin`)
   - Full system access
   - User management and role assignment
   - System settings and configuration
   - Access to all features

## Implementation Components

### 1. Webhook Handler (`/api/webhooks/clerk`)

**Purpose**: Automatically assigns default role to new users upon registration

**Features**:
- Listens for `user.created` events from Clerk
- Validates webhook signature for security
- Assigns default role (configurable via `CLERK_DEFAULT_ROLE`)
- Logs role assignment for audit trail

**Configuration**:
```env
CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret-here
CLERK_DEFAULT_ROLE=member
```

### 2. Enhanced Sign-up Page

**Location**: `/sign-up/[[...sign-up]]/page.tsx`

**Features**:
- Role selection dropdown during registration
- Role descriptions and permissions explanation
- Sets role in user metadata during signup process
- Fallback to webhook for default role assignment

### 3. Admin User Management Interface

**Location**: `/dashboard/admin/users`

**Features**:
- View all users with their current roles
- Change user roles with dropdown selection
- Real-time role updates
- Role-based visual indicators (icons and badges)
- Admin-only access protection

### 4. API Routes

#### GET `/api/admin/users`
- Fetches all users with their roles
- Admin-only access
- Returns user list with role information

#### PUT `/api/admin/users/[userId]/role`
- Updates user role
- Validates role input with Zod schema
- Admin-only access
- Returns success/error response

### 5. Frontend Utilities

**Location**: `/lib/clerk-utils.ts`

**Functions**:
- `setUserRoleInClerk(userId, role)`: Set user role in Clerk metadata
- `getUserRoleFromClerk(userId)`: Get user role from Clerk metadata
- `getAllUsersWithRoles()`: Get all users with their roles

## Security Features

### 1. Webhook Security
- Signature validation using Svix
- Environment variable configuration
- Error handling and logging

### 2. Role Validation
- TypeScript type safety for roles
- Zod schema validation for API inputs
- Server-side role verification

### 3. Access Control
- Role-based route protection
- Admin-only API endpoints
- Frontend role guards

## Environment Variables

```env
# Role Management
CLERK_ROLE_METADATA_KEY=user_role
CLERK_DEFAULT_ROLE=member

# Webhook Configuration
CLERK_WEBHOOK_SECRET=whsec_your-webhook-secret-here
```

## Setup Instructions

### 1. Clerk Dashboard Configuration

1. **Create Webhook Endpoint**:
   - Go to Clerk Dashboard > Webhooks
   - Create new endpoint: `https://yourdomain.com/api/webhooks/clerk`
   - Select events: `user.created`
   - Copy the webhook secret

2. **Environment Variables**:
   - Add `CLERK_WEBHOOK_SECRET` to your environment
   - Configure `CLERK_DEFAULT_ROLE` (default: `member`)

### 2. Frontend Setup

1. **Install Dependencies**:
   ```bash
   npm install svix
   ```

2. **Verify Routes**:
   - Ensure `/api/webhooks/clerk` is accessible
   - Test admin routes with proper authentication

### 3. Testing

1. **Test Registration**:
   - Register a new user
   - Verify role assignment in Clerk dashboard
   - Check webhook logs for success

2. **Test Admin Interface**:
   - Login as admin
   - Navigate to `/dashboard/admin/users`
   - Change user roles and verify updates

## Usage Examples

### Frontend Role Checking

```typescript
import { RoleGuard } from '@/app/components/auth/RoleGuard';

// Protect component based on role
<RoleGuard allowedRoles={['admin', 'trainer']}>
  <AdminOnlyComponent />
</RoleGuard>
```

### API Role Validation

```typescript
import { checkRole } from '@/middleware/authMiddleware';

// Protect API route
router.get('/admin-only', checkRole(['admin']), handler);
```

### Getting User Role

```typescript
import { useUser } from '@clerk/nextjs';

const { user } = useUser();
const userRole = user.publicMetadata?.user_role as string || 'member';
```

## Troubleshooting

### Common Issues

1. **Webhook Not Firing**:
   - Check webhook URL is accessible
   - Verify webhook secret is correct
   - Check Clerk dashboard for webhook status

2. **Role Not Assigned**:
   - Verify webhook is receiving events
   - Check server logs for errors
   - Ensure environment variables are set

3. **Admin Interface Not Working**:
   - Verify user has admin role
   - Check API routes are accessible
   - Ensure proper authentication headers

### Debugging

1. **Webhook Logs**:
   ```bash
   # Check webhook endpoint logs
   tail -f logs/webhook.log
   ```

2. **Role Verification**:
   ```typescript
   // Check user role in browser console
   console.log(user.publicMetadata?.user_role);
   ```

## Best Practices

1. **Security**:
   - Always validate webhook signatures
   - Use environment variables for secrets
   - Implement proper error handling

2. **User Experience**:
   - Provide clear role descriptions
   - Show appropriate error messages
   - Implement loading states

3. **Maintenance**:
   - Log all role changes for audit
   - Monitor webhook health
   - Regular security reviews

## Future Enhancements

1. **Role Hierarchy**:
   - Implement role inheritance
   - Add custom permissions
   - Role-based feature flags

2. **Audit Trail**:
   - Detailed role change logging
   - Admin action tracking
   - Export audit reports

3. **Bulk Operations**:
   - Bulk role assignments
   - Import/export user roles
   - Role templates

## Support

For issues or questions about the role management system:

1. Check this documentation
2. Review server logs
3. Verify Clerk dashboard configuration
4. Test with minimal setup 