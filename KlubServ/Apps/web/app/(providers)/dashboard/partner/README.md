# Partner Dashboard - One4Team

A secure, role-based Partner Dashboard for One4Team sponsors to manage their sponsorship assets, view analytics, and communicate with the club administration.

## 🎯 Overview

The Partner Dashboard provides sponsors with a comprehensive interface to:
- View sponsorship performance analytics
- Manage sponsored content and assets
- Download performance reports
- Contact club administration
- Monitor engagement metrics

## 🔐 Security & Access Control

### Role-Based Access
- **Route Protection**: `/dashboard/partner` is protected with `SignedInWithRole(['partner'])`
- **API Protection**: All partner endpoints require `role === 'partner'` validation
- **Data Isolation**: Partners can only access their own sponsorship data
- **Redirect**: Unauthorized users are redirected to `/403`

### Permissions
Partners have the following permissions:
- ✅ View their own sponsorship analytics
- ✅ Manage their sponsored assets
- ✅ Download performance reports
- ✅ Contact admin/support
- ❌ Access member data
- ❌ Access financial data
- ❌ Access trainer/class data
- ❌ Access internal club communications

## 📁 File Structure

```
/app/dashboard/partner/
├── page.tsx                    # Main partner dashboard page
├── components/
│   ├── PartnerHeader.tsx       # Welcome section with org info
│   ├── SponsorStatsChart.tsx   # Analytics visualization
│   ├── SponsorAssetList.tsx    # Asset management table
│   ├── UploadSponsorshipModal.tsx # File upload modal
│   ├── PartnerContactForm.tsx  # Contact admin form
│   └── ReportDownloadCard.tsx  # Reports download section
└── README.md                   # This documentation
```

## 🧩 Components

### PartnerHeader
- **Purpose**: Welcome section with organization information
- **Features**:
  - Displays partner name and organization
  - Shows sponsorship tier (Gold, Silver, Platinum)
  - Quick stats overview (active assets, monthly views, engagement rate)
  - Responsive design with avatar and branding

### SponsorStatsChart
- **Purpose**: Analytics visualization and KPI tracking
- **Features**:
  - KPI cards for views, clicks, CTR, impressions
  - Interactive charts with tabbed navigation
  - Month-over-month comparison
  - Trend indicators and percentage changes

### SponsorAssetList
- **Purpose**: Content management for sponsored assets
- **Features**:
  - Table view of all sponsored assets
  - Search and filter functionality
  - Asset status tracking (active/expired)
  - Performance metrics per asset
  - Upload new asset functionality

### UploadSponsorshipModal
- **Purpose**: File upload interface for new assets
- **Features**:
  - Drag-and-drop file upload
  - File type validation (images, PDFs, videos)
  - File size limits (10MB max)
  - Form validation and error handling
  - Progress indicators

### PartnerContactForm
- **Purpose**: Communication with club administration
- **Features**:
  - Priority-based contact form
  - Subject and message fields
  - Character limits and validation
  - Success/error feedback
  - Help text and guidelines

### ReportDownloadCard
- **Purpose**: Download sponsorship performance reports
- **Features**:
  - Multiple report types (PDF, CSV, Excel)
  - Generate new reports on-demand
  - Download existing reports
  - Report information and file sizes

## 🔌 API Integration

### Endpoints

#### Analytics
- `GET /api/sponsorship/analytics` - Get partner analytics data
- **Response**: Views, clicks, CTR, impressions with trend data

#### Assets
- `GET /api/sponsorship/assets` - Get partner's sponsored assets
- `POST /api/sponsorship/upload` - Upload new asset
- `DELETE /api/sponsorship/assets/:id` - Delete asset

#### Reports
- `GET /api/sponsorship/reports` - Get available reports
- `POST /api/sponsorship/reports/generate` - Generate new report
- `GET /api/sponsorship/reports/:id/download` - Download report

#### Contact
- `POST /api/support/contact` - Send message to admin
- `GET /api/support/contact/history` - Get contact history

### Authentication
All endpoints require:
- Valid Clerk JWT token
- User role === 'partner'
- Proper middleware validation

## 🎨 Design System

### Colors
- **Primary**: #1757FF (blue) - Main actions and headers
- **Accent**: #E2B93B (gold) - Sponsor-specific elements
- **Background**: Gray-50 for dashboard, white for cards

### Components
- Built with shadcn/ui components
- Tailwind CSS for styling
- Lucide icons for consistency
- Responsive design with mobile-first approach

### Typography
- Clear hierarchy with proper font weights
- Readable text sizes for all devices
- Consistent spacing and alignment

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Two column layout
- **Desktop**: > 1024px - Three column layout

### Mobile Optimizations
- Touch-friendly interface elements
- Simplified navigation
- Optimized table views
- Collapsible sections

## 🧪 Testing Scenarios

### Access Control
- ✅ Partner role can access dashboard
- ❌ Other roles redirected to /403
- ❌ Unauthenticated users redirected

### Data Isolation
- ✅ Partners see only their data
- ❌ No access to member/trainer/financial data
- ✅ Proper API validation

### Functionality
- ✅ File upload with validation
- ✅ Analytics display
- ✅ Contact form submission
- ✅ Report downloads
- ✅ Asset management

## 🚀 Deployment

### Frontend
- Next.js App Router
- Static generation where possible
- Client-side components for interactivity
- Optimized bundle size

### Backend
- Express.js API routes
- Role-based middleware
- Proper error handling
- Security validation

## 🔧 Configuration

### Environment Variables
```env
# Clerk Configuration
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# File Upload
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=image,pdf,video

# Analytics
ANALYTICS_RETENTION_DAYS=90
```

### Role Configuration
Partner role is configured in:
- `RoleGuard.tsx` - Frontend role validation
- `auth.ts` - Backend role permissions
- `clerk-utils.ts` - Role display names

## 📈 Performance

### Optimizations
- Lazy loading for non-critical components
- Optimized images and assets
- Efficient API calls with caching
- Minimal bundle size

### Monitoring
- Analytics tracking for partner engagement
- Error logging and monitoring
- Performance metrics collection

## 🔄 Future Enhancements

### Planned Features
- Real-time analytics updates
- Advanced reporting with custom date ranges
- Asset performance A/B testing
- Integration with external analytics platforms
- Automated report scheduling

### Technical Improvements
- GraphQL API for better data fetching
- Real-time notifications
- Advanced file upload with progress
- Offline capability for basic functions

## 🛠️ Development

### Setup
1. Ensure partner role is added to Clerk
2. Configure API routes in backend
3. Set up proper middleware
4. Test access control thoroughly

### Testing
```bash
# Run frontend tests
npm run test:web

# Run backend tests
npm run test:api

# Run e2e tests
npm run test:e2e
```

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Husky for pre-commit hooks

## 📞 Support

For questions or issues with the Partner Dashboard:
1. Check this documentation
2. Review the component code
3. Test the API endpoints
4. Contact the development team

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Maintainer**: One4Team Development Team 