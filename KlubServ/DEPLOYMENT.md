# One4Team Deployment Guide

This guide covers deploying the One4Team sports club management platform to various environments.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 15+
- Docker (optional)
- Environment variables configured

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd One4Team

# Install dependencies
npm install

# Set up environment
cp env.example .env.local
# Edit .env.local with your configuration

# Start development servers
npm run dev
```

## 🐳 Docker Deployment

### Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build the image
docker build -t one4team .

# Run the container
docker run -p 3000:3000 -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e CLERK_SECRET_KEY="..." \
  one4team
```

## ☁️ Cloud Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Render (Backend)
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure build command: `npm run build`
4. Configure start command: `npm start`
5. Set environment variables

### Railway
1. Connect your GitHub repository to Railway
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy automatically

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Application
NODE_ENV=production
PORT=4000
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
DEBUG=true
LOG_LEVEL=debug
```

#### Staging
```bash
NODE_ENV=staging
DEBUG=false
LOG_LEVEL=info
```

#### Production
```bash
NODE_ENV=production
DEBUG=false
LOG_LEVEL=warn
```

## 📊 Database Setup

### Initial Setup
```bash
# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

### Production Database
```bash
# Create production database
createdb one4team_prod

# Run migrations
DATABASE_URL="postgresql://..." npm run db:migrate

# Seed production data
DATABASE_URL="postgresql://..." npm run db:seed
```

## 🔒 Security Configuration

### SSL/TLS
- Configure SSL certificates for production domains
- Use HTTPS for all external communications
- Enable HSTS headers

### Authentication
- Configure Clerk JWT templates
- Set up proper CORS origins
- Enable rate limiting

### Database Security
- Use connection pooling
- Enable SSL for database connections
- Configure proper firewall rules

## 📈 Monitoring & Logging

### Application Monitoring
```bash
# Health check endpoint
GET /health

# Metrics endpoint
GET /metrics
```

### Logging Configuration
```bash
# Log levels
LOG_LEVEL=info  # error, warn, info, debug

# Log format
LOG_FORMAT=json  # json, simple
```

### Performance Monitoring
- Set up Prometheus metrics
- Configure Grafana dashboards
- Enable APM (Application Performance Monitoring)

## 🔄 CI/CD Pipeline

### GitHub Actions
The project includes a comprehensive CI/CD pipeline:

1. **Lint & Type Check**: Code quality checks
2. **Unit Tests**: Automated testing
3. **Security Scan**: Vulnerability scanning
4. **Build**: Application compilation
5. **E2E Tests**: End-to-end testing
6. **Deploy**: Automatic deployment

### Manual Deployment
```bash
# Build applications
npm run build

# Run tests
npm run test:ci

# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## 🚨 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check database connectivity
npm run db:check

# Reset database
npm run db:reset
```

#### Build Failures
```bash
# Clear cache
npm run clean

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Environment Issues
```bash
# Validate environment
npm run env:validate

# Check configuration
npm run config:check
```

### Health Checks
```bash
# API health
curl https://api.one4team.com/health

# Web health
curl https://one4team.com/api/health
```

## 📞 Support

For deployment issues:
1. Check the logs: `npm run logs`
2. Review environment configuration
3. Contact the development team
4. Check the troubleshooting guide

## 🔄 Rollback Procedures

### Database Rollback
```bash
# Rollback to previous migration
npm run db:rollback

# Restore from backup
npm run db:restore
```

### Application Rollback
```bash
# Revert to previous deployment
git revert HEAD
npm run deploy:production
```

### Emergency Procedures
1. Stop the deployment
2. Rollback to last known good state
3. Investigate the issue
4. Deploy fix when ready 