# Strongwill Sports 2.0 - Complete Platform Documentation

## Overview
Strongwill Sports 2.0 is a comprehensive custom apparel e-commerce platform built with React, Express, and PostgreSQL. The platform provides end-to-end functionality for teams, sponsors, and administrators to create, order, and manage custom athletic apparel through an advanced design tool and sponsorship marketplace.

## Core Features

### 🎨 Interactive Design Tool
- Real-time visual customization interface
- Product template integration (jerseys, shorts, polo shirts, etc.)
- Color selection, text addition, and logo upload
- Design persistence with unique IDs for guest users
- Email sharing functionality for design collaboration
- "My Designs" page for saved design management

### 🛒 E-commerce Functionality
- Complete product catalog with categories (AFL Uniforms, NRL Gear, Accessories)
- Advanced cart management with real-time updates
- Stripe payment integration for secure transactions
- Order tracking and management system
- Cross-sell recommendations during checkout
- Sale pricing with visual indicators (crossed-out original prices)

### 👥 Group Ordering System
- Team-based ordering with member management
- Minimum quantity requirements and deadline tracking
- Individual member customization options
- Group owner controls for editing and managing orders
- Shareable group links for easy participation
- Email notifications for group activities

### 🤝 Sponsorship Marketplace
- Team profile creation with anonymization options
- Sponsor profile management with detailed information
- Sponsorship agreement system with credit tracking
- Messaging system between teams and sponsors
- Sponsorship credit application to orders

### 📧 Comprehensive Email System
- Order confirmation emails (customer and admin)
- Group order notifications and invitations
- Newsletter subscription management
- Sponsorship inquiry and agreement notifications
- Design sharing via email links
- Welcome emails for newsletter subscribers

### 🌍 Internationalization & SEO
- Multi-language support (English/German)
- Currency selection (AUD/EUR/USD/CAD)
- SEO-optimized pages with meta descriptions
- Structured data implementation
- Performance optimizations

### 📊 Admin Panel
**Dashboard & Analytics:**
- Revenue tracking and order statistics
- User management with role-based access
- Product performance metrics
- Real-time platform insights

**Product Management:**
- Individual product creation and editing
- Bulk product upload via CSV
- Sale pricing controls (individual and bulk operations)
- Product recommendations system
- Inventory and category management

**Order Management:**
- Complete order lifecycle tracking
- Manual refund processing with reasons and notes
- Order status updates and notifications
- Detailed order information display

**User Management:**
- User account editing and role assignment
- Account statistics and activity tracking
- Search and filtering capabilities

**Content Management:**
- Email template customization
- Blog post creation and management
- Page content editing
- Admin settings configuration

**A/B Testing Interface:**
- Test creation with variant configuration
- Traffic splitting and goal metric tracking
- Real-time results monitoring
- Performance analytics and conversion tracking

## Technical Architecture

### Frontend (React)
- **Routing:** Wouter for client-side navigation
- **State Management:** TanStack Query for server state
- **Forms:** React Hook Form with Zod validation
- **UI Components:** shadcn/ui with Tailwind CSS
- **Styling:** Custom CSS with black/white premium aesthetic

### Backend (Express)
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** Session-based with Passport.js
- **Email:** SendGrid integration for transactional emails
- **Payments:** Stripe for secure payment processing
- **File Handling:** Asset management for designs and uploads

### Database Schema
**Core Tables:**
- Users (authentication and profiles)
- Products & Categories (catalog management)
- Orders & Order Items (transaction tracking)
- Group Orders (team ordering system)
- Designs (custom design storage)

**Advanced Features:**
- Sponsorship ecosystem (profiles, agreements, credits)
- A/B testing infrastructure (tests, participants, events)
- Content management (pages, blog posts, settings)
- Newsletter subscriptions and email templates

## Setup and Installation

### Prerequisites
```bash
- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)
- SendGrid account (for emails)
```

### Environment Variables
```env
DATABASE_URL=your_postgresql_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Installation Steps
1. Clone repository and install dependencies:
```bash
npm install
```

2. Set up database schema:
```bash
npm run db:push
```

3. Start development server:
```bash
npm run dev
```

## Admin Access
- **Username:** admin
- **Password:** admin
- **Access:** Full platform administration capabilities

## Test Accounts
- **Team Account:** team_ravens / password123
- **Sponsor Account:** sponsor_ccb / password123

## Key Features Implemented

### Phase 1: Foundation
✅ Core e-commerce functionality
✅ User authentication and profiles
✅ Product catalog and shopping cart
✅ Order processing and management

### Phase 2: Design Tool
✅ Interactive design interface
✅ Real-time product customization
✅ Design persistence and sharing
✅ Template-based design system

### Phase 3: Group Ordering
✅ Team-based ordering system
✅ Member management and customization
✅ Minimum quantity and deadline tracking
✅ Group owner administrative controls

### Phase 4: Sponsorship Platform
✅ Team and sponsor profile creation
✅ Sponsorship agreement system
✅ Credit tracking and application
✅ Messaging and communication tools

### Phase 5: CMS & Admin Panel
✅ Comprehensive admin dashboard
✅ Content management system
✅ Email template management
✅ User and order administration

### Phase 6: Final Polish
✅ Internationalization (EN/DE)
✅ SEO optimization
✅ Performance enhancements
✅ A/B testing infrastructure
✅ Sale management system
✅ Newsletter integration

## Notable Features

### Design System
- Premium black and white aesthetic
- Consistent STRONGWILL SPORTS branding
- Mobile-responsive design
- Accessibility compliance

### User Experience
- Intuitive navigation and workflows
- Real-time feedback and notifications
- Progressive enhancement for all features
- Guest user support for core functions

### Business Logic
- Flexible pricing with sale management
- Sponsorship credit system
- Group ordering with member controls
- Cross-sell recommendations

### Performance
- Optimized database queries
- Efficient client-side caching
- Image optimization and lazy loading
- Progressive loading states

## Security Features
- Session-based authentication
- Role-based access control
- Secure payment processing
- Input validation and sanitization
- SQL injection prevention

## Future Enhancements
The platform is built with extensibility in mind, supporting future additions such as:
- Advanced analytics and reporting
- Additional payment providers
- Enhanced A/B testing capabilities
- Mobile application development
- Third-party integrations

## Support and Maintenance
The platform includes comprehensive error handling, logging, and monitoring capabilities to ensure reliable operation and easy troubleshooting.

---

**Platform Status:** Production Ready
**Last Updated:** January 2025
**Version:** 2.0.0