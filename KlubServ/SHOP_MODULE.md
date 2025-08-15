# One4Team Shop Module

A complete e-commerce solution for sports clubs to sell merchandise and equipment to members and the public.

## 📁 Folder Structure

```
/apps/web/app/
├── dashboard/admin/shop/
│   ├── page.tsx              # Admin shop dashboard
│   ├── products/page.tsx     # Product management (CRUD)
│   ├── orders/page.tsx       # Order management
│   └── analytics/page.tsx    # Sales analytics
└── shop/
    ├── page.tsx              # Public shop landing page
    ├── cart/page.tsx         # Shopping cart
    └── checkout/page.tsx     # Checkout process
```

## 🗄️ Database Schema

### Product Model
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  description String
  imageUrl    String
  price       Decimal  @db.Decimal(10, 2)
  category    String
  sizes       String[] // Available sizes
  colors      String[] // Available colors
  stock       Int      @default(0)
  isActive    Boolean  @default(true)
  
  // Relations
  club        Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)
  clubId      String
  orderItems  OrderItem[]
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([clubId])
  @@index([category])
  @@index([isActive])
  @@map("products")
}
```

### Order Model
```prisma
model Order {
  id          String   @id @default(cuid())
  orderNumber String   @unique
  status      OrderStatus @default(PENDING)
  
  // Customer info
  customerName String
  customerEmail String
  customerPhone String?
  shippingAddress String?
  
  // Order details
  subtotal    Decimal  @db.Decimal(10, 2)
  tax         Decimal  @db.Decimal(10, 2) @default(0)
  shipping    Decimal  @db.Decimal(10, 2) @default(0)
  total       Decimal  @db.Decimal(10, 2)
  
  // Payment info
  paymentStatus PaymentStatus @default(PENDING)
  paymentMethod String?
  externalPaymentId String?
  
  // Relations
  club        Club     @relation(fields: [clubId], references: [id], onDelete: Cascade)
  clubId      String
  member      Member?  @relation(fields: [memberId], references: [id])
  memberId    String?
  items       OrderItem[]
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([clubId])
  @@index([memberId])
  @@index([status])
  @@index([orderNumber])
  @@map("orders")
}
```

### OrderItem Model
```prisma
model OrderItem {
  id          String   @id @default(cuid())
  quantity    Int
  price       Decimal  @db.Decimal(10, 2)
  size        String?
  color       String?
  
  // Relations
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId     String
  product     Product  @relation(fields: [productId], references: [id])
  productId   String
  
  @@index([orderId])
  @@index([productId])
  @@map("order_items")
}
```

## 🔐 Authentication & Authorization

### Admin Routes (Protected)
- `/dashboard/admin/shop/*` - Requires admin role
- Uses Clerk authentication with role-based access control
- Protected by `<SignedIn>` component and role verification

### Public Routes (Open)
- `/shop` - Public shop landing page
- `/shop/cart` - Shopping cart (guest checkout supported)
- `/shop/checkout` - Checkout process

## 🛍️ Features

### Admin Features
1. **Product Management**
   - Create, edit, delete products
   - Manage inventory (stock levels)
   - Set product categories, sizes, colors
   - Upload product images
   - Toggle product active/inactive status

2. **Order Management**
   - View all orders with filtering and search
   - Update order status (Pending → Confirmed → Processing → Shipped → Delivered)
   - Track payment status
   - View order details and customer information

3. **Analytics Dashboard**
   - Revenue tracking
   - Order statistics
   - Top-selling products
   - Customer metrics
   - Sales trends

### Public Features
1. **Shop Frontend**
   - Product catalog with filtering and search
   - Product categories and sorting
   - Product details with images, descriptions, pricing
   - Add to cart functionality

2. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Select product variants (size, color)
   - Apply coupon codes
   - Calculate totals with tax and shipping

3. **Checkout Process**
   - Customer information collection
   - Shipping address
   - Payment method selection (Credit Card, PayPal)
   - Order summary
   - Secure payment processing

## 🎨 UI Components

### Admin Components
- Product management cards with CRUD operations
- Order status management with visual indicators
- Analytics cards with metrics and charts
- Filter and search functionality

### Public Components
- Product grid with hover effects
- Shopping cart with item management
- Checkout form with validation
- Order summary with price breakdown

## 🔧 Technical Implementation

### State Management
- Uses React hooks for local state management
- Mock data for demonstration (replace with API calls)
- Form state management with controlled components

### Styling
- Tailwind CSS for responsive design
- Shadcn UI components for consistent styling
- Custom CSS classes for specific shop styling

### Payment Integration
- Placeholder for Stripe integration
- PayPal payment method support
- Secure payment processing simulation

## 🚀 Next Steps

### Backend API Development
1. Create Express.js routes for shop functionality
2. Implement Prisma queries for database operations
3. Add authentication middleware for admin routes
4. Integrate with payment providers (Stripe, PayPal)

### Frontend Enhancements
1. Replace mock data with actual API calls
2. Implement cart state management (Context/Redux)
3. Add image upload functionality
4. Implement real-time inventory updates

### Additional Features
1. Email notifications for orders
2. Order tracking system
3. Customer reviews and ratings
4. Wishlist functionality
5. Bulk order management
6. Discount and promotion system

## 📝 Environment Variables

Add these to your `.env` file:

```env
# Payment Providers
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Image Upload (optional)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🧪 Testing

The shop module includes:
- Responsive design testing
- Form validation testing
- Payment flow testing
- Admin functionality testing

Run tests with:
```bash
npm run test
```

## 📚 Dependencies

### Required Packages
- `@radix-ui/react-checkbox` - Checkbox component
- `lucide-react` - Icons
- `next/image` - Image optimization
- `@clerk/nextjs` - Authentication

### Optional Packages (for production)
- `stripe` - Payment processing
- `@paypal/checkout-server-sdk` - PayPal integration
- `cloudinary` - Image upload and management 