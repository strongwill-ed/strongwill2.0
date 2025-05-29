# Strongwill Sports 2.0 - Premium Custom Athletic Apparel Platform

A comprehensive e-commerce platform specializing in custom wrestling gear and athletic apparel, featuring advanced design tools, group ordering capabilities, sponsorship marketplace, and complete business management solutions.

## 🏆 Features

### Core E-commerce
- **Product Catalog**: Browse premium wrestling singlets, training gear, and custom apparel
- **Advanced Design Tool**: 2D canvas for creating custom designs with real-time preview
- **Shopping Cart**: Full cart management with quantity updates and persistent storage
- **Secure Checkout**: International shipping, multi-currency support, and Stripe integration
- **Order Management**: Complete order tracking and history

### Group Ordering System
- **Team Coordination**: Create and manage group orders with minimum quantity requirements
- **Member Management**: Add team members, track participation, and manage deadlines
- **Bulk Pricing**: Automatic discounts for orders over 10 items
- **Deadline Validation**: Smart shipping timeline calculation with delivery warnings

### Sponsorship Platform
- **Seeker Profiles**: Teams can create profiles to attract sponsors
- **Sponsor Profiles**: Businesses can showcase sponsorship opportunities
- **Agreement Management**: Handle sponsorship contracts and credit systems
- **Messaging System**: Direct communication between teams and sponsors

### Admin & CMS
- **Dashboard Analytics**: Revenue tracking, user metrics, and sponsorship statistics
- **Product Management**: Create, edit, and categorize products
- **Order Processing**: Manage orders, refunds, and customer support
- **Content Management**: Blog posts, pages, and quote request handling

### Internationalization & Accessibility
- **Multi-language Support**: English and German translations
- **Multi-currency**: AUD, EUR, USD with real-time conversion
- **WCAG 2.1 AA Compliance**: Screen reader support and keyboard navigation
- **SEO Optimized**: Meta tags, structured data, and performance optimization

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** for responsive, utility-first styling
- **Shadcn/ui** for consistent, accessible component library
- **React Query** for efficient data fetching and caching
- **Wouter** for lightweight client-side routing
- **React Hook Form** with Zod validation for forms
- **Framer Motion** for smooth animations and transitions

### Backend
- **Express.js** with TypeScript for robust API development
- **PostgreSQL** with Drizzle ORM for type-safe database operations
- **Passport.js** for secure authentication and session management
- **Stripe** for secure payment processing and subscription management

### Infrastructure
- **Replit Deployment** for seamless hosting and scaling
- **PostgreSQL Database** with automatic backups
- **Environment Variable Management** for secure configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (automatically provisioned on Replit)
- Stripe account for payment processing

### Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   The PostgreSQL database is automatically configured. Run migrations:
   ```bash
   npm run db:push
   ```

3. **Environment Configuration**
   Required environment variables (automatically set on Replit):
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

## 📋 Usage Guide

### For Customers
1. **Browse Products**: Explore the wrestling gear catalog with filtering and search
2. **Customize Design**: Use the design tool to create personalized apparel
3. **Add to Cart**: Select sizes, colors, and quantities
4. **Checkout**: Complete purchase with international shipping options

### For Teams
1. **Create Group Order**: Set up team orders with deadlines and minimum quantities
2. **Invite Members**: Share order links for team participation
3. **Track Progress**: Monitor participation and manage member details
4. **Complete Purchase**: Checkout when minimum requirements are met

### For Sponsors
1. **Create Profile**: Showcase your business and sponsorship goals
2. **Browse Teams**: Find teams seeking sponsorship opportunities
3. **Connect**: Send messages and negotiate sponsorship agreements
4. **Manage Credits**: Track sponsorship credits and team purchases

### For Administrators
1. **Dashboard**: Monitor sales, users, and platform metrics
2. **Product Management**: Add new products and manage inventory
3. **Order Processing**: Handle orders, refunds, and customer support
4. **Content Management**: Update pages, blog posts, and settings

## 🎨 Design System

### Color Scheme
- **Primary**: Black (#000000) for bold, professional appearance
- **Secondary**: White (#FFFFFF) for clean contrast
- **Accent**: Subtle grays for secondary elements
- **Status Colors**: Green for success, red for errors, yellow for warnings

### Typography
- **Headings**: Bold, clean fonts for strong visual hierarchy
- **Body Text**: Readable fonts optimized for accessibility
- **UI Elements**: Consistent sizing and spacing throughout

### Components
All UI components follow the Shadcn/ui design system for consistency and accessibility.

## 🔒 Security Features

### Data Protection
- **Input Sanitization**: All user inputs are validated and sanitized
- **XSS Prevention**: HTML escaping and content security policies
- **Rate Limiting**: Protection against abuse and automated attacks
- **Secure Storage**: Encrypted session management and secure cookies

### Payment Security
- **Stripe Integration**: PCI DSS compliant payment processing
- **Secure Checkout**: TLS encryption for all transactions
- **Fraud Prevention**: Built-in Stripe fraud detection

## 🌐 Internationalization

### Supported Languages
- **English**: Default language with comprehensive translations
- **German**: Full translation coverage for German-speaking markets

### Currency Support
- **AUD**: Australian Dollar (base currency)
- **EUR**: Euro with real-time conversion rates
- **USD**: US Dollar with automatic rate calculation

### Regional Features
- **Shipping Zones**: Optimized rates for priority markets
- **Tax Calculation**: Automatic GST/VAT based on location
- **Address Formats**: International address validation

## 📊 Performance & SEO

### Performance Optimizations
- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Image Optimization**: Responsive images with lazy loading
- **Caching Strategy**: Efficient API response caching
- **Bundle Analysis**: Optimized build output

### SEO Features
- **Meta Tags**: Dynamic title, description, and Open Graph tags
- **Structured Data**: Schema.org markup for products and organization
- **Sitemap**: Automatically generated XML sitemap
- **Clean URLs**: SEO-friendly URL structure

## 🧪 Testing

### Development Testing
```bash
# Run development server with hot reload
npm run dev

# Build production version
npm run build

# Database operations
npm run db:push    # Push schema changes
npm run db:studio  # Open database studio
```

### Manual Testing Checklist
- [ ] Product browsing and filtering
- [ ] Design tool functionality
- [ ] Cart operations (add, remove, update)
- [ ] Checkout process with different countries
- [ ] Group order creation and management
- [ ] Sponsorship profile creation
- [ ] Admin panel operations
- [ ] Mobile responsiveness
- [ ] Accessibility features

## 🚀 Deployment

### Replit Deployment
The application is configured for automatic deployment on Replit with:
- Automatic environment variable management
- PostgreSQL database provisioning
- TLS certificate management
- Health check monitoring

### Environment Setup
All necessary environment variables are automatically configured in the Replit environment.

## 🤝 Contributing

### Development Workflow
1. Follow TypeScript best practices
2. Maintain consistent code formatting
3. Add inline comments for complex logic
4. Test thoroughly before deployment
5. Follow accessibility guidelines

### Code Structure
```
client/src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
└── types/         # TypeScript type definitions

server/
├── routes.ts      # API endpoint definitions
├── storage.ts     # Database access layer
└── index.ts       # Server configuration

shared/
└── schema.ts      # Database schema and types
```

## 📞 Support

For technical support or business inquiries, please contact the development team through the Replit platform.

## 📄 License

This project is proprietary software developed for Strongwill Sports. All rights reserved.

---

**Strongwill Sports 2.0** - Empowering athletes with premium custom gear and innovative team coordination tools.