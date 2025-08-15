# Clerk Setup Guide for One4Team

## Current Issues
1. **Missing Secret Key**: Only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set
2. **Dummy Key**: Using placeholder instead of real Clerk keys
3. **No Components**: Clerk is configured but no auth components are used

## Step 1: Get Real Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application or select existing one
3. Go to **API Keys** section
4. Copy both:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

## Step 2: Update Environment Variables

Update your `.env.local` file with real keys:

```env
# =============================================================================
# CLERK AUTHENTICATION
# =============================================================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here

# =============================================================================
# NEXT.JS FRONTEND
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Step 3: Configure Clerk Application

In your Clerk Dashboard:
1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable the authentication methods you want
3. Go to **Paths** and set:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

## Step 4: Add Clerk Components

Create these files to add authentication UI:

### 1. Sign-In Page
Create: `app/sign-in/[[...sign-in]]/page.tsx`

### 2. Sign-Up Page  
Create: `app/sign-up/[[...sign-up]]/page.tsx`

### 3. Dashboard (Protected Route)
Create: `app/dashboard/page.tsx`

### 4. Header with User Button
Update: `app/components/Header.tsx`

## Step 5: Test the Setup

1. Restart your development server
2. Visit `http://localhost:3000/sign-in`
3. You should see Clerk's sign-in form
4. Test the authentication flow

## Common Issues

- **"Invalid API Key"**: Make sure you're using real keys, not placeholders
- **"Clerk not initialized"**: Check that both keys are set correctly
- **"Component not found"**: Make sure you've created the sign-in/sign-up pages

## Next Steps

After basic setup works:
1. Add role-based access control (RBAC)
2. Configure user profiles
3. Set up webhooks for user events
4. Add custom styling to Clerk components 