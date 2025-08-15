# One4Team Project Setup Guide

This guide will help you set up the One4Team sports club management platform on your local machine.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm 9+** - Comes with Node.js
- **PostgreSQL 14+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd one4team

# Install all dependencies
npm install
```

### Step 2: Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your configuration
```

**Required Environment Variables:**

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/one4team"

# Clerk Authentication (Get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 3: Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### Step 4: Start Development Servers

```bash
# Start all services (frontend + backend)
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Prisma Studio**: http://localhost:5555 (optional)

## 🏗️ Project Structure

```
one4team/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App Router pages
│   │   ├── components/     # Frontend components
│   │   └── lib/           # Frontend utilities
│   └── api/                # Express backend
│       ├── src/
│       │   ├── routes/     # API routes
│       │   ├── controllers/# Route controllers
│       │   ├── services/   # Business logic
│       │   ├── middleware/ # Express middleware
│       │   └── types/      # TypeScript types
│       └── dist/           # Compiled backend
├── packages/
│   ├── prisma/             # Database schema & migrations
│   │   ├── schema.prisma   # Database schema
│   │   ├── seed.ts         # Sample data
│   │   └── migrations/     # Database migrations
│   └── ui/                 # Shared UI components
│       ├── src/
│       │   ├── components/ # Reusable components
│       │   ├── lib/        # UI utilities
│       │   └── hooks/      # Custom React hooks
│       └── dist/           # Compiled UI package
└── docs/                   # Documentation
```

## 🔐 Authentication Setup

### 1. Create Clerk Account

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your API keys to `.env.local`

### 2. Configure Clerk

In your Clerk dashboard:
- Set up your domain (localhost:3000 for development)
- Configure sign-up/sign-in methods
- Set up user roles (member, trainer, admin)

## 💳 Payment Processing Setup (Optional)

### 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create a new account or sign in
3. Get your API keys from the Developers section

### 2. Configure Stripe Environment Variables

Add these to your `.env.local`:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Set Up Stripe Webhooks (Optional)

For production, configure webhooks in your Stripe dashboard:
- Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
- Events: `customer.subscription.*`, `invoice.payment_*`

## 📊 Database Management

### Prisma Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create new migration
npm run db:migrate

# Reset database (WARNING: deletes all data)
npm run db:reset

# Open Prisma Studio (database GUI)
npm run db:studio

# Deploy migrations to production
npm run db:deploy
```

### Database Schema

The platform includes these main entities:

- **Clubs** - Sports club information
- **Members** - Club member profiles
- **Trainers** - Staff and trainer information
- **Classes** - Training sessions and schedules
- **Payments** - Membership fees and transactions
- **Announcements** - Club communications

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Testing Structure

- **Unit Tests**: Vitest for components and utilities
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for full user journeys

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Supabase)

1. Create a new service in Render
2. Connect your GitHub repository
3. Set environment variables
4. Deploy containerized application

### Database (Supabase)

1. Create Supabase project
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npm run db:deploy`

## 🔧 Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test
npm run dev
npm run test

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### 2. Code Quality

```bash
# Lint code
npm run lint

# Type check
npm run type-check

# Format code (if using Prettier)
npm run format
```

### 3. Database Changes

```bash
# Modify schema.prisma
# Generate migration
npm run db:migrate

# Update seed data if needed
# Test with sample data
npm run db:seed
```

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Check DATABASE_URL in .env.local
# Ensure PostgreSQL is running
# Verify database exists
```

**2. Clerk Authentication Issues**
```bash
# Verify API keys in .env.local
# Check Clerk dashboard configuration
# Ensure domain is whitelisted
```

**3. Build Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Clear build cache
npm run clean
```

**4. Port Conflicts**
```bash
# Check if ports 3000/4000 are in use
# Kill processes or change ports in .env.local
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)

## 🤝 Contributing

1. Follow the [coding standards](./Apps/TEST/coding-standards.md)
2. Write tests for new features
3. Update documentation
4. Use conventional commits

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review the coding standards document
- Create an issue in the repository

---

**Happy coding! 🎉** 