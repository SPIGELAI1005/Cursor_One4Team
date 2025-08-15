# One4Team Coding Standards & Conventions

## 🎯 Overview

This document defines the coding standards, conventions, and best practices for the One4Team sports club management platform. All code must follow these guidelines to ensure consistency, maintainability, and performance.

## 🛠️ Tech Stack & Architecture

### Core Technologies
- **Frontend**: Next.js 14+ (App Router) + TypeScript
- **Styling**: Tailwind CSS + Shadcn UI + Radix UI
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Clerk (JWT, SSO, Invite Links)
- **State Management**: React Server Components + nuqs for URL state
- **Testing**: Vitest (unit) + Playwright (e2e)

### Project Structure
```
one4team/
├── apps/
│   ├── web/ → Next.js frontend (App Router)
│   └── api/ → Express backend
├── packages/
│   ├── prisma/ → Database schema & migrations
│   └── ui/ → Shared UI components
```

## 📝 Code Style & Structure

### TypeScript Standards
- **Use TypeScript for ALL code** - no JavaScript files
- **Prefer interfaces over types** for object shapes
- **Avoid enums** - use const maps instead
- **Use functional components** with TypeScript interfaces
- **Strict type checking** - enable all TypeScript strict flags

### File Structure Pattern
```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types/Interfaces
interface UserProfileProps {
  userId: string
  isEditable?: boolean
}

// 3. Main exported component
export function UserProfile({ userId, isEditable = false }: UserProfileProps) {
  // Component logic
}

// 4. Subcomponents (if any)
function ProfileHeader({ name }: { name: string }) {
  return <h1>{name}</h1>
}

// 5. Helper functions
function formatUserData(data: UserData): FormattedUser {
  // Helper logic
}

// 6. Static content/constants
const PROFILE_FIELDS = ['name', 'email', 'phone'] as const
```

### Naming Conventions
- **Directories**: lowercase with dashes (`components/auth-wizard`)
- **Files**: lowercase with dashes (`user-profile.tsx`)
- **Components**: PascalCase (`UserProfile`)
- **Functions**: camelCase (`getUserData`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Variables**: camelCase with descriptive names (`isLoading`, `hasError`)

## 🎨 UI & Styling Standards

### Component Libraries
- **Primary**: Shadcn UI + Radix UI primitives
- **Styling**: Tailwind CSS (mobile-first approach)
- **Icons**: Lucide React (consistent iconography)

### Responsive Design
```typescript
// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
  <div className="p-4 md:p-6 lg:p-8">
    {/* Content */}
  </div>
</div>
```

### Component Patterns
```typescript
// Server Component (default)
export function UserList({ users }: { users: User[] }) {
  return (
    <div className="space-y-4">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

// Client Component (only when needed)
'use client'
export function InteractiveForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Client-side logic
}
```

## ⚡ Performance Optimization

### React Server Components (RSC)
- **Default to Server Components** - no 'use client' unless necessary
- **Use 'use client' only for**:
  - Web API access (localStorage, window, etc.)
  - Event handlers (onClick, onSubmit)
  - useState/useEffect hooks
  - Third-party client libraries

### Data Fetching
```typescript
// ✅ Server Component - direct database access
async function UserProfile({ userId }: { userId: string }) {
  const user = await db.user.findUnique({ where: { id: userId } })
  return <div>{user.name}</div>
}

// ✅ Server Component - API route
async function UserList() {
  const users = await fetch('/api/users').then(res => res.json())
  return <UserListComponent users={users} />
}
```

### Dynamic Imports
```typescript
// Non-critical components
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
})
```

### Image Optimization
```typescript
import Image from 'next/image'

<Image
  src="/user-avatar.webp"
  alt="User avatar"
  width={64}
  height={64}
  className="rounded-full"
  priority={false} // Only true for above-the-fold images
/>
```

## 🔄 State Management

### URL State Management
```typescript
import { useQueryState } from 'nuqs'

export function SearchFilters() {
  const [searchTerm, setSearchTerm] = useQueryState('q')
  const [category, setCategory] = useQueryState('category')
  
  return (
    <div>
      <input
        value={searchTerm || ''}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}
```

### Local State (minimize usage)
```typescript
'use client'
export function FormWithValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Only use local state for UI interactions
  const handleSubmit = async (data: FormData) => {
    // Server action or API call
  }
}
```

## 🧪 Testing Standards

### Unit Tests (Vitest)
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserProfile } from './UserProfile'

describe('UserProfile', () => {
  it('displays user name correctly', () => {
    render(<UserProfile userId="123" />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test'

test('user can complete registration flow', async ({ page }) => {
  await page.goto('/register')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

## 🔐 Backend API Standards

### Route Structure
```typescript
// apps/api/src/routes/members.ts
import { Router } from 'express'
import { auth } from '@clerk/expressjs'
import { z } from 'zod'

const router = Router()

// JWT protected route
router.get('/members', auth(), async (req, res) => {
  // Controller logic
})

export default router
```

### Validation
```typescript
const createMemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  birthdate: z.string().datetime()
})

router.post('/members', auth(), async (req, res) => {
  const validatedData = createMemberSchema.parse(req.body)
  // Process validated data
})
```

## 📊 Database & Prisma

### Schema Patterns
```prisma
model Member {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  birthdate DateTime
  status    String   @default("active")
  
  // Relations
  club      Club     @relation(fields: [clubId], references: [id])
  clubId    String
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Indexes
  @@index([email])
  @@index([clubId])
}
```

### Database Operations
```typescript
// Use Prisma for all database operations
const members = await prisma.member.findMany({
  where: { clubId: clubId },
  include: { club: true },
  orderBy: { createdAt: 'desc' }
})
```

## 🚀 Deployment & Environment

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
DATABASE_URL=postgresql://...
```

### Build Optimization
```json
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons']
  },
  images: {
    formats: ['image/webp', 'image/avif']
  }
}
```

## 📋 Code Review Checklist

Before submitting code, ensure:

- [ ] TypeScript strict mode passes
- [ ] No 'use client' unless absolutely necessary
- [ ] Mobile-first responsive design
- [ ] Proper error handling
- [ ] Loading states implemented
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Performance optimized (no unnecessary re-renders)
- [ ] Tests written and passing
- [ ] Documentation updated

## 🎯 Key Principles

1. **Server-First**: Prefer Server Components over Client Components
2. **Type Safety**: Use TypeScript strictly - no `any` types
3. **Performance**: Optimize for Core Web Vitals (LCP, CLS, FID)
4. **Accessibility**: Build for all users from the start
5. **Maintainability**: Write self-documenting, modular code
6. **Consistency**: Follow established patterns and conventions

---

*This document should be updated as the project evolves and new patterns emerge.* 