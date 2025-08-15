# Role Testing Guide - One4Team Dashboard Testing

This guide explains how to assign multiple roles to a single user account to test all dashboard functionalities.

## Overview

The One4Team application supports **9 different user roles**, each with their own dashboard and permissions. You can assign multiple roles to a single user account to test all dashboards without creating separate accounts.

## Available Roles

1. **Admin** (`admin`) - Full system access
2. **Trainer** (`trainer`) - Training and player management
3. **Finance** (`finance`) - Financial management
4. **Support** (`support`) - Customer service
5. **Official** (`official`) - Club information
6. **Partner** (`partner`) - Partnership management
7. **Press-News** (`press-news`) - Media management
8. **Player** (`player`) - Personal access only
9. **Member** (`member`) - Basic access only

## Method 1: Using Clerk Dashboard (Recommended)

### Step 1: Access Clerk Dashboard
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your One4Team application
3. Navigate to **Users** section

### Step 2: Find Your User
1. Search for your email address
2. Click on your user profile

### Step 3: Edit Public Metadata
1. Scroll down to **Public metadata** section
2. Click **Edit** button
3. Add the following JSON structure:

```json
{
  "roles": ["admin", "trainer", "finance", "support", "official", "partner", "press-news", "player", "member"]
}
```

### Step 4: Save Changes
1. Click **Save** to apply the changes
2. The roles will be immediately available

## Method 2: Using Admin Dashboard (If Available)

### Step 1: Access Admin Dashboard
1. Sign in to your account
2. Navigate to `/dashboard/admin/users`
3. Find your user in the list

### Step 2: Edit User Roles
1. Click on your user profile
2. Use the role dropdown to select multiple roles
3. Save the changes

## Method 3: Programmatic Role Assignment

### Using API Endpoint
```bash
curl -X PATCH "https://api.clerk.com/v1/users/{user_id}/metadata" \
  -H "Authorization: Bearer {your_clerk_secret_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "public_metadata": {
      "roles": ["admin", "trainer", "finance", "support", "official", "partner", "press-news", "player", "member"]
    }
  }'
```

## Testing All Dashboards

Once you have all roles assigned, you can test each dashboard:

### 1. Admin Dashboard
- **URL**: `http://localhost:3000/dashboard/admin`
- **Features**: User management, system settings, shop management
- **Sub-pages**:
  - `/dashboard/admin/users` - User management
  - `/dashboard/admin/shop` - Shop management
  - `/dashboard/admin/shop/products` - Product management
  - `/dashboard/admin/shop/orders` - Order management
  - `/dashboard/admin/shop/analytics` - Shop analytics

### 2. Trainer Dashboard
- **URL**: `http://localhost:3000/dashboard/trainer`
- **Features**: Player management, training scheduling
- **Sub-pages**:
  - `/dashboard/trainer/players` - Player management
  - `/dashboard/trainer/schedule` - Training schedule
  - `/dashboard/trainer/training` - Training management
  - `/dashboard/trainer/notes` - Training notes

### 3. Finance Dashboard
- **URL**: `http://localhost:3000/dashboard/finance`
- **Features**: Financial reporting, revenue tracking
- **Sub-pages**:
  - `/dashboard/finance/components` - Financial components

### 4. Support Dashboard
- **URL**: `http://localhost:3000/dashboard/support`
- **Features**: Customer service, ticket management

### 5. Official Dashboard
- **URL**: `http://localhost:3000/dashboard/official`
- **Features**: Club information, internal documents

### 6. Partner Dashboard
- **URL**: `http://localhost:3000/dashboard/partner`
- **Features**: Partnership management, sponsorship
- **Sub-pages**:
  - `/dashboard/partner/components` - Partner components

### 7. Press-News Dashboard
- **URL**: `http://localhost:3000/dashboard/press-news`
- **Features**: Media management, press releases
- **Sub-pages**:
  - `/dashboard/press-news/components` - Press components

### 8. Member App (Player/Member Roles)
- **URL**: `http://localhost:3000/app`
- **Features**: Personal profile, payments, bookings
- **Sub-pages**:
  - `/app/profile` - Profile management
  - `/app/player` - Player-specific features
  - `/app/payments` - Payment management
  - `/app/messages` - Messaging
  - `/app/documents` - Document management
  - `/app/calendar` - Calendar view
  - `/app/bookings` - Booking management

### 9. Shared Dashboard Pages
- **Settings**: `/dashboard/settings` - Role-appropriate settings
- **Trainings**: `/dashboard/trainings` - Training management (admin/trainer)

## Role Priority System

The application uses a priority-based role system. When you have multiple roles, the system will show the highest priority role for each context:

1. **Admin** (highest priority)
2. **Trainer**
3. **Support**
4. **Finance**
5. **Partner**
6. **Press-News**
7. **Official**
8. **Player**
9. **Member** (lowest priority)

## Testing Checklist

- [ ] Admin dashboard loads correctly
- [ ] Trainer dashboard loads correctly
- [ ] Finance dashboard loads correctly
- [ ] Support dashboard loads correctly
- [ ] Official dashboard loads correctly
- [ ] Partner dashboard loads correctly
- [ ] Press-News dashboard loads correctly
- [ ] Member app loads correctly
- [ ] Role-based navigation works
- [ ] Permission restrictions are enforced
- [ ] Role switching works properly

## Troubleshooting

### Issue: Dashboard not loading
**Solution**: Check if the role is properly assigned in Clerk metadata

### Issue: Permission denied
**Solution**: Verify the role has the required permissions for that dashboard

### Issue: Role not showing
**Solution**: Clear browser cache and sign out/in again

### Issue: Multiple roles not working
**Solution**: Ensure the roles array is properly formatted in Clerk metadata

## Security Note

⚠️ **Important**: This multi-role setup is for testing purposes only. In production, users should have only the roles they actually need for their job functions.

## Quick Test Commands

Once the server is running, test these URLs:

```bash
# Test main pages
curl -I http://localhost:3000/
curl -I http://localhost:3000/marketing
curl -I http://localhost:3000/sign-in
curl -I http://localhost:3000/sign-up

# Test dashboard pages (requires authentication)
curl -I http://localhost:3000/dashboard
curl -I http://localhost:3000/dashboard/admin
curl -I http://localhost:3000/dashboard/trainer
curl -I http://localhost:3000/dashboard/finance
curl -I http://localhost:3000/dashboard/support
curl -I http://localhost:3000/dashboard/official
curl -I http://localhost:3000/dashboard/partner
curl -I http://localhost:3000/dashboard/press-news

# Test member app
curl -I http://localhost:3000/app
```

This guide will help you test all dashboard functionalities with a single user account.

