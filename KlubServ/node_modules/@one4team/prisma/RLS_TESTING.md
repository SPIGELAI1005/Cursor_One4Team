# Row-Level Security (RLS) Testing Guide

## Overview
This document provides comprehensive testing procedures for the Row-Level Security (RLS) implementation in the One4Team multi-tenant SaaS platform.

## What Was Implemented

### 1. RLS Migration (`20250102000000_enable_rls/migration.sql`)
- ✅ Enabled RLS on all club-scoped tables
- ✅ Created "ByClub" policies for each table
- ✅ Added `set_current_tenant()` function for tenant context
- ✅ Proper permissions granted to authenticated users

### 2. Updated Seed Data (`seed.ts`)
- ✅ Created two demo clubs with proper UUIDs
- ✅ All existing data properly scoped to first club
- ✅ Added second club data for multi-tenant testing
- ✅ Proper `club_id` relationships maintained

## Tables with RLS Enabled

| Table | Policy | Description |
|-------|--------|-------------|
| `clubs` | `ByClub` | Users can only access their own club |
| `members` | `ByClub` | Users can only access members from their club |
| `trainers` | `ByClub` | Users can only access trainers from their club |
| `classes` | `ByClub` | Users can only access classes from their club |
| `class_enrollments` | `ByClub` | Users can only access enrollments for classes in their club |
| `payments` | `ByClub` | Users can only access payments from their club |
| `announcements` | `ByClub` | Users can only access announcements from their club |
| `products` | `ByClub` | Users can only access products from their club |
| `orders` | `ByClub` | Users can only access orders from their club |
| `order_items` | `ByClub` | Users can only access items for orders in their club |
| `players` | `ByClub` | Users can only access players from their club |
| `evaluations` | `ByClub` | Users can only access evaluations for players in their club |
| `notes` | `ByClub` | Users can only access notes for players in their club |
| `training_plans` | `ByClub` | Users can only access training plans from their club |
| `training_sessions` | `ByClub` | Users can only access training sessions from their club |
| `contribution_plans` | `ByClub` | Users can only access contribution plans from their club |
| `invoices` | `ByClub` | Users can only access invoices from their club |

## Manual Testing Procedures

### Prerequisites
1. PostgreSQL database running
2. Environment variables configured
3. Migration applied successfully

### Step 1: Apply Migration
```bash
cd packages/prisma
npx prisma migrate dev --name enable_rls
```

### Step 2: Seed Database
```bash
npx prisma db seed
```

### Step 3: Test RLS Policies

#### Test 1: Verify RLS is Enabled
```sql
-- Connect to database and check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('clubs', 'members', 'trainers', 'classes');
```

Expected: All tables should show `rowsecurity = true`

#### Test 2: Verify Policies Exist
```sql
-- Check that policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('clubs', 'members', 'trainers', 'classes');
```

Expected: Each table should have a "ByClub" policy

#### Test 3: Test Tenant Isolation
```sql
-- Set tenant context for first club
SELECT set_current_tenant('550e8400-e29b-41d4-a716-446655440001'::uuid);

-- Query members - should only see first club's members
SELECT id, name, club_id FROM members;

-- Switch to second club
SELECT set_current_tenant('550e8400-e29b-41d4-a716-446655440002'::uuid);

-- Query members - should only see second club's members
SELECT id, name, club_id FROM members;
```

Expected: Each query should only return data for the respective club

#### Test 4: Test Cross-Tenant Access Prevention
```sql
-- Set tenant context for first club
SELECT set_current_tenant('550e8400-e29b-41d4-a716-446655440001'::uuid);

-- Try to access second club's data directly
SELECT * FROM members WHERE club_id = '550e8400-e29b-41d4-a716-446655440002';
```

Expected: Query should return no results due to RLS policy

#### Test 5: Test Related Data Isolation
```sql
-- Set tenant context for first club
SELECT set_current_tenant('550e8400-e29b-41d4-a716-446655440001'::uuid);

-- Query class enrollments - should only see enrollments for first club's classes
SELECT ce.*, c.name as class_name, m.name as member_name
FROM class_enrollments ce
JOIN classes c ON ce.class_id = c.id
JOIN members m ON ce.member_id = m.id;
```

Expected: Only enrollments for first club's classes should be visible

## Application-Level Testing

### Test 1: API Endpoint Isolation
```bash
# Test with first club context
curl -H "Authorization: Bearer <token_with_club_1>" \
     -H "X-Club-ID: 550e8400-e29b-41d4-a716-446655440001" \
     http://localhost:4000/api/members

# Test with second club context  
curl -H "Authorization: Bearer <token_with_club_2>" \
     -H "X-Club-ID: 550e8400-e29b-41d4-a716-446655440002" \
     http://localhost:4000/api/members
```

Expected: Each request should only return data for the respective club

### Test 2: Frontend Tenant Context
```javascript
// Test that frontend components only show data for current tenant
// This will be implemented in Step 3 of the SaaS migration
```

## Expected Seed Data

### Club 1: Elite Fitness Club
- ID: `550e8400-e29b-41d4-a716-446655440001`
- 2 trainers (Sarah Johnson, Mike Chen)
- 3 members (John Smith, Emily Davis, David Wilson)
- 3 classes (Morning HIIT, Yoga Flow, Strength Training)
- Various related data (payments, announcements, etc.)

### Club 2: Community Sports Center
- ID: `550e8400-e29b-41d4-a716-446655440002`
- 1 trainer (Alex Rodriguez)
- 1 member (Maria Garcia)
- 1 class (Youth Soccer Training)

## Troubleshooting

### Common Issues

1. **Migration Fails**
   - Check database connection
   - Verify PostgreSQL version supports RLS (9.5+)
   - Check user permissions

2. **Policies Not Working**
   - Verify `current_setting('app.current_tenant')` is set
   - Check that tenant ID is valid UUID
   - Ensure user has proper permissions

3. **Data Not Visible**
   - Check if tenant context is properly set
   - Verify club_id values match expected UUIDs
   - Check for typos in policy conditions

### Debug Queries
```sql
-- Check current tenant setting
SELECT current_setting('app.current_tenant');

-- Check RLS status for specific table
SELECT rowsecurity FROM pg_tables WHERE tablename = 'members';

-- Check policy details
SELECT * FROM pg_policies WHERE tablename = 'members';
```

## Success Criteria

- [ ] RLS enabled on all club-scoped tables
- [ ] Policies created and working correctly
- [ ] Tenant isolation verified
- [ ] Cross-tenant access properly blocked
- [ ] Seed data properly scoped to clubs
- [ ] No breaking changes to existing functionality

## Next Steps

After RLS is verified working:
1. **Step 2**: Wire `club_id` through JWT → backend → Prisma
2. **Step 3**: Frontend tenant context & sub-domains
3. **Step 4**: Tenant provisioning endpoint
4. **Step 5**: Admin billing dashboard
5. **Step 6**: DevOps hardening
6. **Step 7**: Documentation & ADR 