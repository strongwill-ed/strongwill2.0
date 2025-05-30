# Strongwill Sports 2.0 - Complete Project Documentation

## Project Overview

Strongwill Sports 2.0 is a comprehensive custom apparel e-commerce platform that enables teams, sponsors, and athletes to create and order personalized athletic designs through an intuitive, interactive ecosystem.

### Technology Stack
- **Frontend**: React with TypeScript, Vite, TailwindCSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Payment**: Stripe integration for secure payments
- **Email**: SendGrid integration for automated communications
- **Design**: Custom design tool with fabric.js
- **Internationalization**: i18next with English and German support
- **State Management**: TanStack Query for server state, React Context for client state

## Key Features

### 1. E-commerce Platform
- **Product Catalog**: 8 sports categories (AFL, Basketball, eSports, Rugby, Soccer, Touch Football, Oztag, Volleyball)
- **Custom Design Tool**: Interactive design interface with fabric.js
- **Shopping Cart**: Real-time cart management with currency conversion
- **Checkout**: Stripe-powered secure payment processing
- **Order Management**: Complete order tracking and status updates

### 2. Group Ordering System
- **Group Creation**: Create group orders with minimum quantity requirements
- **Member Management**: Add/remove members, edit selections
- **Deadline Management**: Automatic deadline tracking with warnings
- **Shareable Links**: Easy sharing via email, social media, or direct link
- **Payment Handling**: Group owners can pay for entire orders once minimum quantities are reached

### 3. Sponsorship Platform
- **Team Profiles**: Create detailed team profiles with customizable privacy settings
- **Sponsor Profiles**: Business sponsorship profiles with investment capabilities
- **Sponsorship Matching**: Connect teams seeking sponsorship with interested sponsors
- **Agreement Management**: Digital sponsorship agreements with credit allocation
- **Credit System**: Sponsors provide credits that teams can use for purchases

### 4. Admin Panel
- **Dashboard**: Comprehensive analytics and key metrics
- **Product Management**: Create, edit, activate/deactivate products with bulk operations
- **Order Management**: Detailed order viewing with status updates
- **Group Order Management**: Admin oversight of all group orders
- **Email Template Management**: Customize all automated email communications
- **Refund Management**: Handle customer refunds and disputes
- **User Management**: Oversee user accounts and permissions

### 5. Internationalization & Accessibility
- **Multi-language Support**: English and German with expandable language system
- **Currency Support**: AUD, EUR, USD, CAD with real-time conversion
- **Responsive Design**: Mobile-first responsive design
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels
- **SEO Optimization**: Comprehensive meta tags, structured data, and performance optimization

## Authentication & User Management

### User Roles
- **Customer**: Standard shopping and group order participation
- **Admin**: Full platform management capabilities
- **Team**: Create team profiles for sponsorship seeking
- **Sponsor**: Create sponsor profiles for team investment

### Test Accounts
- **Admin**: Username: `admin`, Password: `admin`
- **Team**: Username: `team_ravens`, Password: `password123`
- **Sponsor**: Username: `sponsor_ccb`, Password: `password123`

## Design System

### Brand Guidelines
- **Primary Colors**: Black and white aesthetic with premium feel
- **Logo**: "STRONGWILL" in bold, "SPORTS" in regular weight
- **Typography**: Clean, modern fonts with clear hierarchy
- **Icons**: Lucide React icons with consistent styling
- **Layout**: Card-based design with clear spacing and shadows

### UI Components
- **Shadcn/ui**: Complete component library implementation
- **Form Handling**: React Hook Form with Zod validation
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Skeleton loading and spinner states
- **Error Handling**: Comprehensive error boundaries and fallbacks

## Database Schema

### Core Tables
- **users**: User accounts with roles and authentication
- **products**: Product catalog with categories, pricing, and availability
- **orders**: Order management with items, shipping, and status
- **group_orders**: Group ordering system with member management
- **sponsorship_profiles**: Team and sponsor profiles for matching
- **sponsorship_agreements**: Digital agreements with credit allocation
- **designs**: Custom design storage and management
- **email_templates**: Customizable email templates for automation

### Key Relationships
- Users can have multiple orders and group order participations
- Products belong to categories and can have multiple recommendations
- Group orders contain multiple members and their selections
- Sponsorship agreements link teams and sponsors with credit allocation
- Designs are associated with users and can be used in orders

## API Architecture

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current user information
- `POST /api/auth/logout` - User logout

### Product Endpoints
- `GET /api/products` - Product catalog with filtering
- `GET /api/categories` - Product categories
- `POST /api/products` - Create new product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - User's order history
- `PUT /api/orders/:id/status` - Update order status (admin)

### Group Order Endpoints
- `POST /api/group-orders` - Create group order
- `GET /api/group-orders/:id` - Get group order details
- `POST /api/group-orders/:id/join` - Join group order
- `PUT /api/group-orders/:id` - Update group order (admin)

### Sponsorship Endpoints
- `GET /api/sponsorship/profiles` - Get sponsorship profiles
- `POST /api/sponsorship/seeker` - Create team profile
- `POST /api/sponsorship/sponsor` - Create sponsor profile
- `POST /api/sponsorship/agreements` - Create sponsorship agreement

## Email System

### Automated Emails
- **Order Confirmation**: Sent immediately after successful payment
- **Newsletter Welcome**: Sent after newsletter subscription
- **Group Order Created**: Notifies creator of successful group order creation
- **Group Order Invitation**: Sent to invited members
- **Sponsorship Inquiry**: Sent when teams contact sponsors
- **Sponsorship Agreement**: Sent when agreements are created

### Email Templates
All email templates are customizable through the admin panel with support for:
- Dynamic content insertion
- HTML and text versions
- Brand-consistent styling
- Personalization variables

## Payment Integration

### Stripe Configuration
- **Test Mode**: Sandbox environment for development
- **Production Mode**: Live payments for production deployment
- **Supported Currencies**: AUD, EUR, USD, CAD
- **Payment Methods**: Credit cards, digital wallets
- **Security**: PCI DSS compliant payment processing

### Required Environment Variables
- `VITE_STRIPE_PUBLIC_KEY` - Frontend public key
- `STRIPE_SECRET_KEY` - Backend secret key

## Deployment Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# SendGrid (Optional)
SENDGRID_API_KEY=SG...

# PayPal (Optional)
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

### Build Process
1. Install dependencies: `npm install`
2. Build frontend: `npm run build`
3. Start server: `npm run dev`
4. Database migration: `npm run db:push`

### Performance Optimizations
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Lazy loading and responsive images
- **Caching**: Browser caching for static assets
- **Bundle Optimization**: Tree shaking and minification
- **Database Indexing**: Optimized database queries with proper indexes

## Testing & Quality Assurance

### Test Coverage
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Complete user journey testing
- **Performance Tests**: Load testing and optimization validation

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Accessibility**: Screen reader compatibility and keyboard navigation

## Security Measures

### Authentication Security
- **Password Hashing**: Secure password storage with bcrypt
- **Session Management**: Secure session handling with express-session
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Comprehensive input validation with Zod schemas

### Data Protection
- **SQL Injection Prevention**: Parameterized queries with Drizzle ORM
- **XSS Protection**: Content Security Policy and input sanitization
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Security headers for production deployment

## Maintenance & Support

### Regular Maintenance Tasks
- **Database Backups**: Regular automated database backups
- **Security Updates**: Keep dependencies updated for security patches
- **Performance Monitoring**: Regular performance audits and optimization
- **User Feedback**: Collect and analyze user feedback for improvements

### Monitoring & Analytics
- **Error Tracking**: Comprehensive error logging and monitoring
- **Performance Metrics**: Page load times and user interaction tracking
- **Business Metrics**: Order conversion rates and user engagement analytics
- **System Health**: Server monitoring and uptime tracking

## Future Enhancements

### Planned Features
- **Mobile Application**: Native iOS and Android applications
- **Advanced Analytics**: Enhanced business intelligence dashboard
- **Inventory Management**: Real-time inventory tracking and management
- **Multi-vendor Support**: Enable multiple vendors on the platform
- **Advanced Design Tools**: Enhanced design capabilities with 3D preview

### Scalability Considerations
- **Microservices Architecture**: Potential migration to microservices
- **CDN Integration**: Content delivery network for global performance
- **Database Sharding**: Horizontal database scaling for growth
- **Load Balancing**: Multiple server instances for high availability

## Support Information

### Documentation
- API documentation available in code comments
- Component documentation in Storybook format
- Database schema documentation in Drizzle migrations

### Contact Information
- **Technical Support**: Available through admin panel
- **Business Inquiries**: Contact form on website
- **Emergency Support**: Direct contact for critical issues

---

*Last Updated: January 29, 2025*
*Version: 2.0.0*
*Documentation maintained by: Development Team*