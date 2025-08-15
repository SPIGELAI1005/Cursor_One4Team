# One4Team Authentication & Role-Based Access Control

This document describes the comprehensive authentication and role-based access control (RBAC) system implemented in One4Team using Clerk.

## Overview

One4Team uses Clerk for authentication and implements a custom role-based access control system with three user roles:

- **Admin**: Full system access with user management and financial control
- **Trainer**: Player and class management with limited admin features
- **Member**: Basic member access to personal profile and payments

## Architecture

### Backend (Express API)

```
apps/api/src/
├── middleware/
│   └── authMiddleware.ts          # JWT validation and role checking
├── utils/
│   └── getUserRole.ts             # Role extraction and management
├── types/
│   └── auth.ts                    # TypeScript interfaces and role configs
└── routes/protected/
    ├── admin/                     # Admin-only routes
    ├── trainer/                   # Trainer routes
    └── member/                    # Member routes
```

### Frontend (Next.js)

```
apps/web/app/
├── components/auth/
│   ├── RoleGuard.tsx              # Role-based UI protection
│   └── AuthRedirect.tsx           # Authentication redirects
├── dashboard/                     # Admin/Trainer dashboard
├── app/                          # Member app
└── forbidden/                    # 403 error page
```

## User Roles & Permissions

### Admin Role
- **Permissions**: Full system access
- **Access**: All routes and features
- **Key Features**:
  - User management (create, update, delete members)
  - Financial data access
  - System settings configuration
  - Reports and analytics
  - Role assignment

### Trainer Role
- **Permissions**: Limited admin access
- **Access**: Player and class management
- **Key Features**:
  - Player management
  - Class scheduling and management
  - Attendance tracking
  - Performance reports
  - Cannot access financial data or user management

### Member Role
- **Permissions**: Basic member access
- **Access**: Personal profile and payments
- **Key Features**:
  - Profile management
  - Payment history and methods
  - Class registration
  - Personal schedule
  - Cannot access dashboard or admin features

## Implementation Details

### Backend Authentication

#### JWT Validation
```typescript
// Middleware to verify Clerk JWT tokens
export async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.substring(7);
  const payload = await verifyToken(token, {
    jwtKey: process.env.CLERK_JWT_KEY,
    authorizedParties: [process.env.CLERK_PUBLISHABLE_KEY],
  });
  // ... user creation and role extraction
}
```

#### Role-Based Route Protection
```typescript
// Protect routes by role
router.use(authenticateUser);
router.use(requireRole(['admin'])); // Only admins can access

// Or protect by permission
router.use(requirePermission('canManageUsers'));
```

#### Role Extraction from Clerk
```typescript
// Extract role from Clerk user metadata
export async function getUserRoleFromClerk(userId: string): Promise<UserRole> {
  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata[CLERK_ROLE_METADATA_KEY] as UserRole;
  return role || DEFAULT_ROLE;
}
```

### Frontend Authentication

#### Role-Based UI Protection
```typescript
// Protect UI components by role
<RoleGuard allowedRoles={['admin', 'trainer']}>
  <AdminOnlyComponent />
</RoleGuard>

// Protect by permission
<PermissionGuard permission="canManageUsers">
  <UserManagementComponent />
</PermissionGuard>
```

#### Authentication Redirects
```typescript
// Protect entire pages with role requirements
<AuthRedirect requiredRoles={['admin', 'trainer']}>
  <DashboardContent />
</AuthRedirect>
```

## API Endpoints

### Protected Routes Structure

```
/api/admin/*          # Admin-only endpoints
├── /members          # Member management
├── /settings         # System settings
└── /reports          # Financial reports

/api/trainer/*        # Trainer endpoints
├── /players          # Player management
└── /classes          # Class management

/api/member/*         # Member endpoints (all roles)
├── /profile          # Personal profile
└── /payments         # Payment management
```

### Authentication Headers
All protected API endpoints require a valid Clerk JWT token:

```
Authorization: Bearer <clerk-jwt-token>
```

## Environment Variables

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_KEY=your-jwt-key-from-clerk-dashboard

# Role Management
CLERK_ROLE_METADATA_KEY=user_role
CLERK_DEFAULT_ROLE=member
```

## Security Features

### JWT Validation
- All API requests validate Clerk JWT tokens
- Tokens are verified against Clerk's public keys
- Automatic token expiration handling

### Role Validation
- Server-side role validation on all protected routes
- Client-side role checking for UI protection
- Fallback to default role for unassigned users

### Input Validation
- Zod schemas for all API inputs
- TypeScript interfaces for type safety
- Comprehensive error handling

### Error Handling
- Standardized error responses
- Proper HTTP status codes
- Detailed error messages for debugging

## Usage Examples

### Backend Route Protection
```typescript
// Admin-only route
router.get('/api/admin/members', 
  authenticateUser, 
  requireRole(['admin']), 
  async (req, res) => {
    // Only admins can access this
  }
);

// Permission-based protection
router.post('/api/trainer/classes',
  authenticateUser,
  requirePermission('canManageClasses'),
  async (req, res) => {
    // Only users with class management permission
  }
);
```

### Frontend Component Protection
```typescript
// Role-based component rendering
<RoleGuard allowedRoles={['admin']}>
  <UserManagementPanel />
</RoleGuard>

// Permission-based rendering
<PermissionGuard permission="canViewReports">
  <AnalyticsDashboard />
</PermissionGuard>
```

### Page-Level Protection
```typescript
// Protect entire pages
<AuthRedirect requiredRoles={['admin', 'trainer']}>
  <DashboardPage />
</AuthRedirect>
```

## Testing

### Backend Testing
```bash
# Test authentication middleware
npm run test:auth

# Test role-based access
npm run test:rbac
```

### Frontend Testing
```bash
# Test authentication flows
npm run test:e2e:auth

# Test role-based UI
npm run test:e2e:roles
```

## Troubleshooting

### Common Issues

1. **JWT Validation Errors**
   - Ensure `CLERK_JWT_KEY` is correctly set
   - Verify token format in Authorization header
   - Check token expiration

2. **Role Assignment Issues**
   - Verify user has role in Clerk metadata
   - Check `CLERK_ROLE_METADATA_KEY` setting
   - Ensure role is one of: 'admin', 'trainer', 'member'

3. **Permission Denied Errors**
   - Verify user role has required permission
   - Check permission configuration in `ROLE_CONFIGS`
   - Ensure proper role assignment

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
DEBUG=auth:*
```

## Best Practices

1. **Always validate on both client and server**
   - Client-side for UX
   - Server-side for security

2. **Use role-based protection for routes**
   - Implement at middleware level
   - Provide clear error messages

3. **Implement proper error handling**
   - Return appropriate HTTP status codes
   - Provide helpful error messages
   - Log security events

4. **Regular security audits**
   - Review role assignments
   - Test permission boundaries
   - Monitor access patterns

## Future Enhancements

- [ ] Multi-tenant support with club-specific roles
- [ ] Dynamic permission system
- [ ] Audit logging for role changes
- [ ] Role-based API rate limiting
- [ ] Advanced permission inheritance
- [ ] Real-time role synchronization 