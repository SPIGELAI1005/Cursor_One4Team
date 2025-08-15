# One4Team – Web-Based Sports Club Management Platform

![One4Team Logo](./apps/web/public/logo.svg)

Welcome to One4Team! This project is a modern, full-stack platform for managing sports club memberships, payments, communication, and digital operations.

## 📦 Tech Stack Summary

| Layer             | Technology                      |
|------------------|----------------------------------|
| Frontend         | Next.js (App Router) + Tailwind CSS |
| Backend API      | Node.js + Express                |
| Auth             | Clerk (JWT, SSO, Invite Links)   |
| Database         | PostgreSQL                       |
| ORM              | Prisma                           |
| Monorepo Tooling | Turborepo                        |
| UI Components    | Tailwind + Shared React UI (packages/ui) |
| Deployment       | Vercel (frontend), Render/Supabase (backend) |
| Language         | TypeScript                       |
| Testing          | Vitest / Playwright / Jest       |

## 🗂️ Folder Structure (Monorepo)

```
one4team/
├── apps/
│   ├── web/ → Next.js frontend
│   └── api/ → Express backend
├── packages/
│   ├── prisma/ → Prisma schema + migrations
│   └── ui/ → Shared UI components (Tailwind + React)
├── .github/ → CI/CD workflows
├── .env → Shared environment variables
├── turbo.json → Turborepo config
├── docker-compose.yml → Local setup (optional)
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd one4team
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run lint` - Run linting across all packages
- `npm run test` - Run tests across all packages
- `npm run clean` - Clean all build outputs

### Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## 🏗️ Architecture

### Frontend (apps/web)
- **Next.js 15+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Shadcn UI** + **Radix UI** for components
- **Clerk** for authentication
- **React Server Components** for performance

### Backend (apps/api)
- **Node.js** + **Express** server
- **TypeScript** throughout
- **Clerk JWT** authentication
- **Prisma** ORM with PostgreSQL
- **Zod** for input validation
- **RBAC** with role-based access control

### Shared Packages
- **packages/prisma** - Database schema and migrations
- **packages/ui** - Reusable UI components

## 🔐 Authentication & Authorization

One4Team uses Clerk for authentication with role-based access control:

- **Members** - Basic access to personal data and club features
- **Trainers** - Access to training schedules and member management
- **Admins** - Full access to all features and club management

## 📊 Database Schema

The platform manages:

- **Clubs** - Sports club information
- **Members** - Club member profiles
- **Trainers** - Staff and trainer information
- **Classes** - Training sessions and schedules
- **Payments** - Membership fees and transactions
- **Communications** - Club announcements and messaging

## 🧪 Testing

- **Unit Tests** - Vitest for component and utility testing
- **Integration Tests** - API endpoint testing
- **E2E Tests** - Playwright for full user journey testing

## 🚀 Deployment

### Frontend (Vercel)
- Automatic deployments from main branch
- Preview deployments for pull requests
- Edge functions for API routes

### Backend (Render/Supabase)
- Containerized deployment
- Environment variable management
- Database hosting with Supabase

## 📝 Contributing

1. Follow the [coding standards](./Apps/TEST/coding-standards.md)
2. Use conventional commits
3. Write tests for new features
4. Update documentation as needed

## 📄 License

This project is licensed under the MIT License.

---

For detailed development guidelines, see [coding-standards.md](./Apps/TEST/coding-standards.md) 