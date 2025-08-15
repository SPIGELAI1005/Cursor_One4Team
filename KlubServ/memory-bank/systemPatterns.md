# System Patterns - One4Team Multi-Tenant SaaS Platform

## 🔐 **JWT Authentication Flow Patterns**

### **Complete Authentication Flow Pattern**
```
[User logs in via Clerk ➝ Session includes JWT with roles ➝ Frontend fetch() sends JWT ➝ Express backend validates token ➝ Role-based logic applies]
```

### **Frontend Token Fetching Pattern**
```typescript
// Standardized authenticatedFetch utility pattern
export async function getAuthToken(): Promise<string | null> {
  const { useAuth } = await import('@clerk/nextjs');
  const { getToken } = useAuth();
  
  // Get token with one4team template for proper audience validation
  const token = await getToken({ template: 'one4team' });
  return token;
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not available');
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
}
```

### **Backend JWT Validation Pattern**
```typescript
// Enhanced authMiddleware.ts with audience validation pattern
const payload = await verifyToken(token, {
  audience: 'one4team', // Use audience validation instead of jwtKey
  authorizedParties: [process.env['CLERK_PUBLISHABLE_KEY']!],
});
```

### **Error Handling Pattern**
```typescript
// Token missing error pattern
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ 
    error: { code: 'MISSING_TOKEN', message: 'Authorization header missing or invalid' }
  });
}

// Token invalid error pattern
catch (error) {
  return res.status(401).json({ 
    error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
  });
}
```

---

## 🔐 **Role-Based Access Control Patterns**

### **Multi-Role System Pattern**
```typescript
// Extended UserRole type pattern
export type UserRole = 'admin' | 'trainer' | 'member' | 'support' | 'player' | 'official' | 'finance' | 'partner' | 'press-news';

// Multi-role support with Clerk metadata pattern
publicMetadata: {
  roles: string[]; // Primary: Multi-role array
  user_role: string; // Legacy: Single role for backward compatibility
}
```

### **Role Validation Pattern**
```typescript
// Frontend role validation pattern
<SignedInWithRole requiredRoles={['partner']} redirectTo="/403">
  {/* Partner-specific content */}
</SignedInWithRole>

// Backend role validation pattern
router.get('/analytics', checkRole(['partner']), async (req, res) => {
  // Partner-specific logic with role validation
});
```

### **Role Guard Pattern**
```typescript
// Navigation menu role guard pattern
<RoleGuard allowedRoles={['partner']}>
  <Link 
    href="/dashboard/partner" 
    className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
  >
    Partner Portal
  </Link>
</RoleGuard>
```

---

## 💳 **Stripe Integration Patterns**

### **Stripe Service Pattern**
```typescript
// Standard Stripe service implementation pattern
import Stripe from 'stripe';
import { prisma } from '../lib/prisma';

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export class StripeService {
  static async createCustomer(clubData: {
    id: string;
    name: string;
    email: string;
    adminName: string;
  }): Promise<StripeCustomer> {
    try {
      const customer = await stripe.customers.create({
        email: clubData.email,
        name: clubData.name,
        metadata: {
          clubId: clubData.id,
          clubName: clubData.name,
          adminName: clubData.adminName,
        },
        description: `Club: ${clubData.name}`,
      });

      // Update club with Stripe customer ID
      await prisma.club.update({
        where: { id: clubData.id },
        data: {
          stripeCustomerId: customer.id,
          updatedAt: new Date(),
        },
      });

      return {
        id: customer.id,
        email: customer.email!,
        name: customer.name!,
        metadata: {
          clubId: clubData.id,
          clubName: clubData.name,
        },
      };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create Stripe customer');
    }
  }
}
```

### **Package Management Pattern**
```json
// Standard package.json dependency pattern
{
  "dependencies": {
    "@clerk/backend": "^2.5.2",
    "@one4team/prisma": "*",
    "@prisma/client": "^5.7.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "express": "^4.18.0",
    "express-rate-limit": "^7.1.0",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "stripe": "^14.23.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.0",
    "zod": "^3.22.0"
  }
}
```

### **Environment Configuration Pattern**
```bash
# Standard environment variables pattern
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_JWT_TEMPLATE_NAME=one4team
CLERK_JWT_AUDIENCE=one4team
```

---

## 🏗️ **Multi-Tenant Architecture Patterns**

### **Tenant Context Pattern**
```typescript
// Tenant context implementation pattern
import { createContext, useContext, useState, useEffect } from 'react';

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTenant() {
      try {
        const subdomain = window.location.hostname.split('.')[0];
        const response = await fetch(`/api/tenants/${subdomain}`);
        const data = await response.json();
        setTenant(data);
      } catch (err) {
        setError('Failed to load tenant');
      } finally {
        setLoading(false);
      }
    }
    loadTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}
```

### **Tenant-Aware API Pattern**
```typescript
// Tenant-aware API hook pattern
export function useTenantFetch() {
  const { tenant } = useTenant();
  
  return useCallback(async (endpoint: string, options: RequestInit = {}) => {
    if (!tenant) {
      throw new Error('Tenant not available');
    }
    
    const url = `/api${endpoint}`;
    const headers = {
      'X-Tenant-ID': tenant.id,
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    return authenticatedFetch(url, {
      ...options,
      headers,
    });
  }, [tenant]);
}
```

---

## 🔧 **Technical Architecture Patterns**

### **JWT-Authenticated Component Pattern**
```typescript
// Standard component with JWT authentication pattern
'use client';

import { useState, useEffect } from 'react';
import { authenticatedFetch } from '@/lib/clerk-utils';
import { SignedInWithRole } from '@/app/components/auth/SignedInWithRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthenticatedComponent() {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await authenticatedFetch('/api/protected-endpoint');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  
  return (
    <SignedInWithRole requiredRoles={['admin']} redirectTo="/403">
      <Card>
        <CardHeader>
          <CardTitle>Protected Content</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Protected content */}
        </CardContent>
      </Card>
    </SignedInWithRole>
  );
}
```

### **Protected API Route Pattern**
```typescript
// Standard protected API route structure pattern
import { Router } from 'express';
import { checkRole } from '../../middleware/authMiddleware';

const router = Router();

// Protected endpoints with JWT validation
router.get('/data', checkRole(['admin']), async (req, res) => {
  try {
    // Access req.user with validated JWT data
    const userData = await getUserData(req.user.id);
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

export default router;
```

### **Error Handling Pattern**
```typescript
// Error boundary pattern
try {
  // Component logic
} catch (error) {
  console.error('Error in component:', error);
  return <div>Error occurred</div>;
}
```

---

## 🚨 **Error Resolution Patterns**

### **Module Import Error Resolution Pattern**
```typescript
// Pattern for resolving module import errors
// 1. Check if package is installed
npm list package-name

// 2. Install missing package
npm install package-name@version

// 3. Fix import paths
// Before: import { something } from '@/lib/something';
// After: import { something } from '../lib/something';

// 4. Verify import works
node -e "const Package = require('package-name'); console.log('Import successful');"
```

### **Dependency Management Pattern**
```bash
# Standard dependency resolution workflow
# 1. Identify missing dependency
npm run dev  # Look for "Cannot find module" errors

# 2. Add to package.json
npm install package-name@version

# 3. Update environment variables
# Add to .env.example and document in SETUP.md

# 4. Test the fix
npm run dev  # Verify error is resolved
```

### **ESLint Configuration Pattern**
```javascript
// Standard ESLint configuration pattern
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
```

---

## 🚨 **Development Environment Resolution Patterns**

### **React Component Export Error Resolution Pattern**
```typescript
// Pattern for resolving "default export is not a React Component" errors

// 1. Ensure proper component structure
export default function ComponentName() {
  return (
    <div>
      {/* Component content */}
    </div>
  );
}

// 2. Remove unnecessary React imports (Next.js 13+ doesn't require them)
// Before: import React from 'react';
// After: No React import needed

// 3. Clear Next.js cache
// Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

// 4. Restart development server
npm run dev
```

### **Next.js Routing Conflict Resolution Pattern**
```typescript
// Pattern for resolving parallel pages routing conflicts

// 1. Identify conflicting route groups
// (marketing)/page.tsx and (providers)/page.tsx both resolve to /

// 2. Restructure routing to eliminate conflicts
// Move one page to a different route
// Move-Item "app\(providers)\page.tsx" "app\guest\page.tsx"

// 3. Update import paths after file moves
// Before: import Header from "../components/Header"
// After: import Header from "./components/Header"

// 4. Clear cache and restart
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

### **Import Path Resolution Pattern**
```typescript
// Pattern for fixing import path issues after file moves

// 1. Identify incorrect import paths
// Module not found: Can't resolve '../components/Header'

// 2. Update relative imports based on new file location
// If page.tsx moved from (marketing)/ to app/ root:
// Before: import Header from "../components/Header"
// After: import Header from "./components/Header"

// 3. Verify all components exist
// Check that all imported components are available

// 4. Test the fix
npm run dev
```

### **Server Startup Resolution Pattern**
```bash
# Pattern for resolving server startup issues

# 1. Kill all Node.js processes
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# 2. Clear Next.js cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 3. Start servers in proper sequence
# Start API server first
cd ../api && npm run dev

# Start web server second
cd ../web && npm run dev

# 4. Test both servers
curl http://localhost:3000
curl http://localhost:4000/health
```

---

## 📱 **UI/UX Patterns**

### **Dashboard Layout Pattern**
```typescript
// Standard dashboard structure with JWT authentication pattern
<div className="space-y-6">
  {/* Breadcrumb Navigation */}
  <Breadcrumb 
    items={[
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Admin', href: '/dashboard/admin' }
    ]} 
  />

  {/* Welcome Header */}
  <DashboardHeader />

  {/* Main Content Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Content with JWT-protected API calls */}
    <AuthenticatedComponent />
  </div>
</div>
```

### **Breadcrumb Navigation Pattern**
```typescript
// Breadcrumb component pattern
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      <Link href="/dashboard" className="flex items-center hover:text-gray-700">
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
```

### **Form Pattern**
```typescript
// Standard form structure
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="field">Field Label</Label>
    <Input
      id="field"
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required
    />
  </div>
  <Button type="submit" className="w-full">
    Submit
  </Button>
</form>
```

### **Card Pattern**
```typescript
// Standard card structure
<Card className="shadow-lg">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</Card>
```

---

## 🎯 **Partner Dashboard Specific Patterns**

### **Analytics Display Pattern**
```typescript
// KPI cards pattern
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
      <Eye className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">12,345</div>
      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
    </CardContent>
  </Card>
</div>
```

### **Asset Management Pattern**
```typescript
// Asset table pattern
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Title</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Location</TableHead>
      <TableHead>Upload Date</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {assets.map((asset) => (
      <TableRow key={asset.id}>
        <TableCell>{asset.title}</TableCell>
        <TableCell>{asset.status}</TableCell>
        <TableCell>{asset.location}</TableCell>
        <TableCell>{formatDate(asset.uploadDate)}</TableCell>
        <TableCell>
          <Button variant="outline" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### **File Upload Pattern**
```typescript
// File upload modal pattern
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Upload Sponsorship Asset</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <input
          type="file"
          accept="image/*,.pdf,.mp4"
          onChange={handleFileChange}
          className="w-full"
        />
      </div>
      <Button onClick={handleUpload} disabled={!selectedFile}>
        Upload Asset
      </Button>
    </div>
  </DialogContent>
</Dialog>
```

---

## 🎨 **Branding System Patterns**

### **One4Team Text Component Pattern**
```typescript
// Standard implementation for One4Team branding
import One4TeamText from '@/components/One4TeamText';

// Usage patterns:
<One4TeamText size="xl" variant="bold" />
<One4TeamText size="lg" variant="semibold" className="text-white" />
<One4TeamText size="md" variant="default" />
```

### **Color Scheme Pattern**
- **Primary Blue**: `#1757FF` - Used for "4" in One4Team text
- **Text Colors**: 
  - Default: Inherit from parent
  - White: `className="text-white"`
  - Blue accent: `className="text-blue-400"`
- **Consistency**: All One4Team instances use the same blue color

### **Component Integration Pattern**
```typescript
// Logo component integration
<LogoFour size={40} bgColor="#1757FF" textColor="white" />
<One4TeamText size="2xl" variant="bold" />

// Header pattern
<div className="flex items-center space-x-3">
  <LogoFour size={40} bgColor="#1757FF" textColor="white" />
  <One4TeamText size="2xl" variant="bold" />
</div>
```

---

## 🔍 **Debugging Patterns**

### **JWT Token Debugging Pattern**
```typescript
// JWT token inspection pattern
const token = await getToken({ template: 'one4team' });
console.log('Token length:', token?.length);

// Decode token (if valid)
if (token) {
  const parts = token.split('.');
  if (parts.length === 3) {
    const payload = JSON.parse(atob(parts[1]));
    console.log('Token payload:', payload);
    console.log('Audience:', payload.aud);
    console.log('Roles:', payload.publicMetadata?.roles);
  }
}
```

### **Error Investigation Pattern**
```typescript
// Error logging pattern
console.error('Error details:', {
  component: 'ComponentName',
  action: 'Action description',
  error: error.message,
  stack: error.stack
});
```

### **Component Testing Pattern**
```typescript
// Component verification
const Component = () => {
  // Test if component renders correctly
  return (
    <div>
      <AuthenticatedComponent />
      {/* Verify component renders without errors */}
    </div>
  );
};
```

### **Role Validation Testing Pattern**
```typescript
// Role validation test pattern
const testPartnerAccess = () => {
  // Test partner role access
  const user = { role: 'partner' };
  const hasAccess = user.role === 'partner';
  return hasAccess;
};
```

---

## 📋 **Development Workflow Patterns**

### **JWT Authentication Implementation Pattern**
1. **Configure Clerk Dashboard**: Set up JWT template with `aud: 'one4team'`
2. **Update Environment Variables**: Add JWT template configuration
3. **Implement Frontend Utilities**: Create authenticatedFetch and getAuthToken
4. **Update Backend Middleware**: Use audience validation instead of jwtKey
5. **Test Authentication Flow**: Verify complete JWT flow works

### **Stripe Integration Implementation Pattern**
1. **Install Stripe Package**: Add `stripe@^14.23.0` to package.json
2. **Create Stripe Service**: Implement StripeService with proper error handling
3. **Update Environment Variables**: Add Stripe configuration to .env.example
4. **Update Documentation**: Add Stripe setup to SETUP.md
5. **Test Integration**: Verify Stripe import and service work correctly

### **Dependency Resolution Pattern**
1. **Identify Missing Dependency**: Look for "Cannot find module" errors
2. **Check Package Installation**: Verify package is in package.json
3. **Install Missing Package**: Run `npm install package-name@version`
4. **Fix Import Paths**: Update relative imports if needed
5. **Test Resolution**: Verify error is resolved

### **Component Creation Pattern**
1. **Create Component**: New `.tsx` file
2. **Add Props Interface**: Define component props
3. **Implement Logic**: Add component functionality
4. **Add JWT Authentication**: Use authenticatedFetch for API calls
5. **Add Multi-Tenant Support**: Include tenant context where needed
6. **Test Integration**: Verify component works correctly

### **Protected Component Pattern**
1. **Create Component**: New component with JWT authentication
2. **Add Role Protection**: Wrap with `SignedInWithRole`
3. **Implement Functionality**: Add protected logic
4. **Add API Integration**: Connect to protected endpoints using authenticatedFetch
5. **Test Security**: Verify JWT authentication and role-based access control

### **Protected API Route Creation Pattern**
1. **Create Route File**: New route with JWT protection
2. **Add JWT Middleware**: Use `checkRole` with audience validation
3. **Implement Logic**: Add protected business logic
4. **Add Error Handling**: Implement proper error responses
5. **Test Endpoint**: Verify JWT authentication and security

### **Error Resolution Pattern**
1. **Identify Error**: Locate error source
2. **Check Dependencies**: Verify imports and dependencies
3. **Test Isolation**: Test component in isolation
4. **Apply Fix**: Implement solution
5. **Verify Fix**: Test complete functionality

### **Development Environment Setup Pattern**
1. **Start API Server**: `cd ../api && npm run dev`
2. **Start Web Server**: `cd ../web && npm run dev`
3. **Test Both Servers**: Verify both are running on correct ports
4. **Test Pages**: Verify all pages are accessible
5. **Test API Endpoints**: Verify API endpoints respond correctly

---

## 🎨 **Design System Patterns**

### **Typography Scale**
```typescript
// Text size mapping
const sizeClasses = {
  sm: 'text-sm',      // 14px
  md: 'text-base',    // 16px
  lg: 'text-lg',      // 18px
  xl: 'text-xl',      // 20px
  '2xl': 'text-2xl',  // 24px
  '3xl': 'text-3xl',  // 30px
  '4xl': 'text-4xl'   // 36px
};
```

### **Color Usage Pattern**
```typescript
// Color application pattern
// Primary colors
className="text-blue-600"     // Primary blue
className="text-green-600"    // Success green
className="text-red-600"      // Error red
className="text-yellow-600"   // Warning yellow

// Contextual colors
className="text-white"     // White text
className="text-gray-900"  // Dark text
className="text-gray-500"  // Muted text
```

### **Dashboard Color Pattern**
```typescript
// Dashboard color scheme
// Primary: #1757FF (blue)
// Success: #10B981 (green)
// Warning: #F59E0B (amber)
// Error: #EF4444 (red)
// Info: #3B82F6 (blue)
```

---

## 🔐 **Security Implementation Patterns**

### **JWT Security Pattern**
```typescript
// JWT validation pattern
const payload = await verifyToken(token, {
  audience: 'one4team',
  authorizedParties: [process.env['CLERK_PUBLISHABLE_KEY']!],
});
```

### **Role-Based Security Pattern**
```typescript
// Role validation pattern
const hasRequiredRole = user.roles.some(role => allowedRoles.includes(role));

if (!hasRequiredRole) {
  return res.status(403).json({ 
    error: { code: 'FORBIDDEN', message: 'Access denied' }
  });
}
```

### **Error Security Pattern**
```typescript
// Secure error response pattern
const error = {
  code: 'INVALID_TOKEN',
  message: 'Invalid or expired token',
  details: process.env['NODE_ENV'] === 'development' ? error : undefined,
};
```

### **Multi-Tenant Security Pattern**
```typescript
// Tenant isolation pattern
const tenantId = req.user?.clubId;
if (!tenantId) {
  return res.status(403).json({ 
    error: { code: 'TENANT_REQUIRED', message: 'Tenant context required' }
  });
}

// Ensure data belongs to tenant
const data = await prisma.model.findMany({
  where: { clubId: tenantId }
});
```

---

**Pattern Status**: Active patterns for JWT authentication flow, Stripe integration, multi-tenant architecture, dependency management, development environment resolution, and comprehensive role-based access control.

**Last Updated**: August 4, 2025 