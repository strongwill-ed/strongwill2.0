# Strongwill Sports 2.0 - Complete Platform Documentation

## Project Overview
Strongwill Sports 2.0 is a comprehensive custom apparel e-commerce platform specializing in wrestling gear and athletic wear. The platform features an advanced 2D design tool, group ordering capabilities, sponsorship marketplace, and complete e-commerce functionality with international support.

## Architecture
- **Frontend**: React with TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **Payments**: Stripe integration for payments and refunds
- **Real-time**: WebSocket support for collaborative features

## Core Features

### 1. E-commerce Platform
- Product catalog with categories (Wrestling Singlets, Team Gear, etc.)
- Shopping cart with persistent storage
- Secure checkout with Stripe payment processing
- International shipping with zone-based pricing
- Tax calculation (10% GST/VAT)
- Order management and tracking
- Refund processing through admin panel

### 2. Design Tool
- Interactive 2D fabric.js-based design canvas
- Product template overlays for realistic design preview
- Text, shape, and image manipulation tools
- Design saving and loading functionality
- Export capabilities for production

### 3. Group Ordering System
- Create group orders with minimum quantity requirements
- Invite members via shareable links
- Individual member customization and sizing
- Group owner can edit member selections
- Automated checkout when minimum quantity reached
- Shipping deadline validation with warnings

### 4. Sponsorship Platform
- Team profile creation (seekers) with anonymization options
- Sponsor profile creation with logo upload
- Bidirectional sponsorship requests
- Sponsorship agreement management
- Credit system for sponsored purchases
- Messaging system between teams and sponsors

### 5. Admin Panel
- Product and category management
- Order monitoring and fulfillment
- Refund processing
- User management
- Content management system (CMS)
- Analytics and reporting

### 6. Internationalization
- Multi-language support (English/German)
- Multi-currency support (AUD/EUR/USD)
- Regional shipping zones and pricing
- Localized content and validation

## Database Schema

### Core Tables
- `users` - User authentication and profiles
- `product_categories` - Product categorization
- `products` - Product catalog
- `designs` - Saved user designs
- `cart_items` - Shopping cart contents
- `orders` - Order records
- `order_items` - Individual order line items
- `refunds` - Refund processing records

### Group Ordering
- `group_orders` - Group order management
- `group_order_items` - Member selections within groups

### Sponsorship System
- `seeker_profiles` - Team profiles seeking sponsorship
- `sponsor_profiles` - Business sponsor profiles
- `sponsorship_agreements` - Active partnerships
- `sponsorship_credits` - Credit allocations
- `sponsorship_messages` - Communication records

### Content Management
- `pages` - CMS pages
- `blog_posts` - Blog content
- `admin_settings` - System configuration
- `quote_requests` - Custom quote requests

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/me` - Current user info
- `POST /api/auth/logout` - User logout

### Products & Categories
- `GET /api/categories` - Product categories
- `GET /api/products` - Product listing
- `GET /api/products/:id` - Product details

### Cart & Orders
- `GET /api/cart` - User's cart items
- `POST /api/cart` - Add to cart
- `DELETE /api/cart/:id` - Remove from cart
- `POST /api/orders` - Create order
- `GET /api/orders` - User's orders

### Design System
- `POST /api/designs` - Save design
- `GET /api/designs` - User's designs
- `PUT /api/designs/:id` - Update design

### Group Orders
- `POST /api/group-orders` - Create group order
- `GET /api/group-orders` - List group orders
- `POST /api/group-orders/:id/join` - Join group order
- `PUT /api/group-orders/:id/items/:itemId` - Edit member selection

### Sponsorship
- `POST /api/seeker-profiles` - Create team profile
- `GET /api/seeker-profiles` - List team profiles
- `POST /api/sponsor-profiles` - Create sponsor profile
- `GET /api/sponsor-profiles` - List sponsor profiles
- `POST /api/sponsorship-agreements` - Create partnership

### Admin
- `GET /api/admin/orders` - All orders (admin)
- `POST /api/admin/refunds` - Process refund
- `PUT /api/admin/products/:id` - Update product

## Security Features
- Input validation and sanitization
- SQL injection prevention via parameterized queries
- XSS protection with proper escaping
- CSRF protection for forms
- Secure session management
- File upload validation
- Rate limiting on sensitive endpoints

## Performance Optimizations
- Database query optimization with proper indexing
- Lazy loading for large datasets
- Image optimization and CDN integration
- Caching strategies for frequently accessed data
- Bundle splitting and code optimization
- Progressive loading for better UX

## Deployment Configuration
- Environment-based configuration
- Docker containerization ready
- CI/CD pipeline compatible
- Health check endpoints
- Logging and monitoring integration
- Database migration management

## Business Logic

### Shipping Zones & Pricing
1. **Priority Markets** ($12 AUD): Australia, New Zealand, UK, Canada, Germany, Netherlands
2. **EU** ($18 AUD): European Union countries
3. **North America** ($15 AUD): United States, Mexico
4. **Asia Pacific** ($25 AUD): Asian countries
5. **Rest of World** ($35 AUD): All other countries

### Tax Calculation
- 10% GST/VAT applied based on shipping region
- Automatically calculated during checkout
- Included in final order total

### Group Order Logic
- Minimum quantity requirements (configurable per group)
- 14-day production time + shipping time calculations
- Deadline warnings when delivery dates at risk
- Automatic pricing adjustments based on quantity

### Sponsorship Credit System
- Credits allocated by sponsors to teams
- Applied automatically during checkout
- Tracked for reporting and reconciliation
- Expiration date management

## Testing Strategy

### Unit Tests
- Model validation and business logic
- API endpoint functionality
- Payment processing workflows
- Design tool operations

### Integration Tests  
- Database operations and migrations
- External service integrations (Stripe)
- Authentication and authorization flows
- Email and notification systems

### End-to-End Tests
- Complete user registration and purchase flows
- Group order creation and completion
- Sponsorship partnership establishment
- Admin panel operations

## Monitoring & Analytics
- Order conversion tracking
- User engagement metrics
- Performance monitoring
- Error logging and alerting
- Revenue and sponsorship analytics

## Future Enhancements
- Mobile app development
- Advanced design collaboration tools
- Inventory management integration
- Advanced analytics dashboard
- Social media integration
- Marketplace expansion to other sports

## Support & Maintenance
- Comprehensive error handling and user feedback
- Admin tools for customer support
- Database backup and recovery procedures
- System update and maintenance protocols
- User documentation and help system

## Technical Debt & Known Issues
- Legacy browser support optimization needed
- Database query performance tuning required for large datasets
- Mobile responsive design improvements pending
- Advanced search and filtering capabilities to be enhanced

---

This documentation provides a complete overview of the Strongwill Sports 2.0 platform. For specific implementation details, refer to the codebase and inline documentation.