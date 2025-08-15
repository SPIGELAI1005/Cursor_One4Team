# One4Team Project Brief

## Project Overview
One4Team is a modern, full-stack sports club management platform built with Next.js, Node.js, and PostgreSQL. The platform provides comprehensive tools for managing club memberships, payments, communications, and digital operations.

## Core Requirements
- **Authentication**: Clerk-based authentication with role-based access control (RBAC)
- **User Roles**: Members, Trainers, Admins with different permission levels
- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Node.js + Express with Prisma ORM
- **Database**: PostgreSQL with comprehensive schema for clubs, members, payments, etc.
- **UI**: Shadcn UI + Radix UI components with custom design system

## Current State
- Basic project structure established with monorepo setup
- Clerk authentication configured with middleware
- Role-based access control components created
- Database schema defined with comprehensive models
- Basic UI components available (button, card, input, etc.)
- Landing page and basic routing structure in place

## Key Features to Implement
1. **Member Area Interface** (`/app` or `/member` routes)
2. **Admin Dashboard** (existing structure)
3. **Trainer Interface** (future)
4. **Payment Integration** (Stripe)
5. **Communication System**
6. **Calendar & Booking System**

## Technical Constraints
- Must use TypeScript throughout
- Mobile-first responsive design
- Server-side rendering with Next.js App Router
- Clerk JWT authentication for API protection
- Prisma for all database operations
- Tailwind CSS for styling

## Success Criteria
- Secure role-based access control
- Responsive, accessible UI
- Type-safe implementation
- Comprehensive testing coverage
- Performance optimized
- Scalable architecture 