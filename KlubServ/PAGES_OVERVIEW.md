# 📋 One4Team App - Complete Pages & URLs Overview

> **Last Updated**: August 2, 2024  
> **App Version**: 2.1.0  
> **Base URL**: `http://localhost:3001` (development)

---

## 🚀 **Quick Navigation**

- [Main Pages](#-main-pages)
- [Authentication Flow](#-authentication-flow)
- [Dashboard System](#-dashboard-system)
- [Member App](#-member-app)
- [Shop System](#-shop-system)
- [Legal & Support](#-legal--support)
- [Error Pages](#-error-pages)
- [Testing Pages](#-testing-pages)
- [URL Structure](#-url-structure)
- [Navigation Flows](#-navigation-flows)

---

## 🏠 **Main Pages**

| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/` | Landing Page | Main homepage with One4Team branding | ✅ Active |
| `/error` | Error Page | Generic error handling page | ✅ Active |
| `/loading` | Loading Page | Loading state component | ✅ Active |
| `/not-found` | 404 Page | Page not found error | ✅ Active |

---

## 🔐 **Authentication Flow**

| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/sign-up` | Sign Up | User registration form | ✅ Active |
| `/sign-in` | Sign In | User login form | ✅ Active |
| `/register/club` | Club Registration | Club-specific registration | ✅ Active |
| `/register/success` | Registration Success | Success confirmation page | ✅ Active |

### **Authentication Flow Path**
```
/ → /sign-up → /register/club → /register/success → /dashboard or /app
/ → /sign-in → /dashboard or /app
```

---

## 📊 **Dashboard System**

### **Main Dashboard**
| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/dashboard` | Main Dashboard | Central dashboard hub | ✅ Active |
| `/dashboard/settings` | Settings | User and app settings | ✅ Active |
| `/dashboard/trainings` | Trainings Overview | Training management | ✅ Active |

### **Admin Dashboard**
| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/dashboard/admin` | Admin Dashboard | Administrative control panel | ✅ Active |
| `/dashboard/admin/users` | User Management | Manage system users | ✅ Active |
| `/dashboard/admin/shop` | Shop Management | E-commerce administration | ✅ Active |
| `/dashboard/admin/shop/analytics` | Shop Analytics | Sales and performance metrics | ✅ Active |
| `/dashboard/admin/shop/orders` | Order Management | Process and track orders | ✅ Active |
| `/dashboard/admin/shop/products` | Product Management | Manage shop inventory | ✅ Active |

### **Trainer Dashboard**
| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/dashboard/trainer` | Trainer Dashboard | Trainer control panel | ✅ Active |
| `/dashboard/trainer/players` | Player Management | Manage team players | ✅ Active |
| `/dashboard/trainer/notes` | Notes Management | Training notes and observations | ✅ Active |
| `/dashboard/trainer/schedule` | Schedule Management | Training schedules | ✅ Active |
| `/dashboard/trainer/training` | Training Management | Training session planning | ✅ Active |

### **Specialized Dashboards**
| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/dashboard/finance` | Finance Dashboard | Financial management | ✅ Active |
| `/dashboard/official` | Official Dashboard | Official club management | ✅ Active |
| `/dashboard/support` | Support Dashboard | Support ticket management | ✅ Active |

---

## 📱 **Member App**

| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/app` | Member Home | Member dashboard home | ✅ Active |
| `/app/player` | Player Dashboard | Player-specific features | ✅ Active |
| `/app/documents` | Documents | Document management | ✅ Active |
| `/app/bookings` | Bookings | Booking management | ✅ Active |
| `/app/calendar` | Calendar | Event calendar | ✅ Active |
| `/app/messages` | Messages | Communication center | ✅ Active |
| `/app/payments` | Payments | Payment management | ✅ Active |
| `/app/profile` | Profile | User profile management | ✅ Active |

---

## 🛒 **Shop System**

| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/shop` | Main Shop | E-commerce main page | ✅ Active |
| `/shop/cart` | Shopping Cart | Cart management | ✅ Active |
| `/shop/checkout` | Checkout | Payment processing | ✅ Active |

### **Shop Flow**
```
/shop → /shop/cart → /shop/checkout
```

---

## 📄 **Legal & Support**

| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/terms` | Terms of Service | Legal terms and conditions | ✅ Active |
| `/privacy` | Privacy Policy | Data protection information | ✅ Active |
| `/impressum` | Legal Notice | Legal company information | ✅ Active |
| `/contact` | Contact Page | Contact information and form | ✅ Active |
| `/support` | Support Page | Support resources and help | ✅ Active |

---

## 🚫 **Error Pages**

| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/403` | Access Denied | Permission denied page | ✅ Active |
| `/forbidden` | Forbidden | Access forbidden page | ✅ Active |

---

## 🧪 **Testing Pages**

| URL | Page Name | Description | Status |
|-----|-----------|-------------|--------|
| `/test-auth` | Authentication Test | Testing authentication flow | ✅ Active |

---

## 🏗️ **URL Structure**

### **Role-Based Routing Pattern**
```
/dashboard/{role}/*
├── admin/
│   ├── users
│   └── shop/
│       ├── analytics
│       ├── orders
│       └── products
├── trainer/
│   ├── players
│   ├── notes
│   ├── schedule
│   └── training
├── finance
├── official
└── support
```

### **Feature-Based Routing Pattern**
```
/app/{feature}
├── player
├── documents
├── bookings
├── calendar
├── messages
├── payments
└── profile
```

### **Shop Routing Pattern**
```
/shop/{section}
├── cart
└── checkout
```

---

## 🧭 **Navigation Flows**

### **New User Journey**
1. **Landing** → `/`
2. **Sign Up** → `/sign-up`
3. **Club Registration** → `/register/club`
4. **Success** → `/register/success`
5. **Dashboard** → `/dashboard` or `/app`

### **Returning User Journey**
1. **Landing** → `/`
2. **Sign In** → `/sign-in`
3. **Dashboard** → `/dashboard` or `/app`

### **Admin Workflow**
1. **Dashboard** → `/dashboard/admin`
2. **User Management** → `/dashboard/admin/users`
3. **Shop Management** → `/dashboard/admin/shop`
4. **Analytics** → `/dashboard/admin/shop/analytics`

### **Trainer Workflow**
1. **Dashboard** → `/dashboard/trainer`
2. **Player Management** → `/dashboard/trainer/players`
3. **Training Planning** → `/dashboard/trainer/training`
4. **Schedule Management** → `/dashboard/trainer/schedule`

### **Member Workflow**
1. **Home** → `/app`
2. **Profile** → `/app/profile`
3. **Bookings** → `/app/bookings`
4. **Payments** → `/app/payments`

---

## 📊 **Statistics**

- **Total URLs**: 45+ unique routes
- **Dashboard URLs**: 15+ routes
- **Member App URLs**: 8 routes
- **Shop URLs**: 3 routes
- **Legal/Support URLs**: 5 routes
- **Authentication URLs**: 4 routes
- **Error Pages**: 2 routes
- **Testing Pages**: 1 route

---

## 🎨 **Branding Requirements**

All pages must display:
- **One4Team** text with the number "4" in blue (`#1757FF`)
- **LogoFour** component for the "4" square logo
- **One4TeamText** component for consistent branding
- Responsive design with Tailwind CSS

---

## 🔧 **Technical Notes**

### **Development Server**
```bash
npm run dev
# Runs on http://localhost:3001 (port 3000 if available)
```

### **File Structure**
```
apps/web/app/
├── (marketing)/          # Marketing route group
├── 403/                  # Access denied
├── api/                  # API routes
├── app/                  # Member app pages
├── contact/              # Contact page
├── dashboard/            # Dashboard pages
├── error/                # Error pages
├── forbidden/            # Forbidden page
├── impressum/            # Legal notice
├── privacy/              # Privacy policy
├── register/             # Registration pages
├── shop/                 # Shop pages
├── sign-in/              # Sign in pages
├── sign-up/              # Sign up pages
├── support/              # Support page
├── terms/                # Terms of service
├── test-auth/            # Testing pages
├── globals.css           # Global styles
├── layout.tsx            # Root layout
├── loading.tsx           # Loading component
├── not-found.tsx         # 404 page
└── page.tsx              # Landing page
```

### **Key Components**
- `LogoFour.tsx` - Reusable "4" logo component
- `One4TeamText.tsx` - Branded text component
- `DashboardLayout.tsx` - Unified dashboard layout
- `RoleGuard.tsx` - Role-based access control

---

## 📝 **Update Log**

### **Version 2.1.0** (August 2, 2024)
- ✅ Complete project renaming from KlubServ to One4Team
- ✅ Integration of LogoFour and One4TeamText components
- ✅ Custom localStorage-based authentication
- ✅ Blue "4" branding across all pages
- ✅ Comprehensive URL structure documentation

### **Planned Updates**
- [ ] API integration for real authentication
- [ ] Database connectivity
- [ ] Advanced role-based permissions
- [ ] Real-time notifications
- [ ] Mobile app development

---

## 🚨 **Known Issues**

1. **Event Handlers Error**: "Event handlers cannot be passed to Client Component props"
   - **Status**: Under investigation
   - **Impact**: Some interactive elements may not work properly

2. **API Module Error**: "Cannot find module '../../../lib/prisma'"
   - **Status**: Backend configuration issue
   - **Impact**: API routes may not function

3. **Turbo Workspace Warning**: Package graph resolution issues
   - **Status**: Non-critical warning
   - **Impact**: Build optimization may be limited

---

## 📞 **Support**

For questions about page structure or navigation:
- Check this document first
- Review the component files in `apps/web/app/`
- Test URLs directly in the browser
- Check the terminal for build errors

---

*This document is automatically maintained and should be updated whenever new pages are added to the One4Team application.* 