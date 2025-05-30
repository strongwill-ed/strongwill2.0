# Strongwill Sports 2.0 Platform Documentation

## Overview
Strongwill Sports 2.0 is a comprehensive custom apparel e-commerce platform featuring advanced design tools, group ordering capabilities, and a sponsorship marketplace. Built with React, Express, and PostgreSQL, the platform provides a premium black and white aesthetic with multilingual support.

## Core Features

### 1. Design Tool
- **Interactive Canvas**: Drag-and-drop design interface with real-time preview
- **Product Templates**: Professional apparel silhouettes (singlets, uniforms, shorts)
- **Text & Graphics**: Font customization, color controls, image uploads
- **Save & Share**: Unique design IDs, email sharing, clipboard links
- **Navigation**: Direct access to "My Designs" from design tool header

### 2. E-Commerce System
- **Product Catalog**: Organized by categories (AFL Uniforms, Training Gear, etc.)
- **Shopping Cart**: Session-based cart with product variations
- **Checkout Process**: Stripe payment integration with order confirmation
- **Order Management**: User order history and admin order tracking

### 3. Group Ordering
- **Creation Flow**: Create group orders with minimum quantity requirements
- **Member Participation**: Join via shareable links, select sizes/colors
- **Design Integration**: Link custom designs to group orders
- **Management**: Edit member selections, track progress, checkout when ready

### 4. Sponsorship Platform
- **Team Profiles**: Create seeker profiles for sponsorship requests
- **Business Profiles**: Sponsor companies can offer sponsorship deals
- **Agreement System**: Formal sponsorship agreements with credit management
- **Privacy Controls**: Anonymous team profiles with shareable links

### 5. Administrative Tools
- **Product Management**: Bulk operations, sale pricing, cross-sell recommendations
- **Order Administration**: View detailed orders, manage refunds
- **Email Templates**: Customizable email templates for various notifications
- **Group Order Management**: Admin can edit and delete group orders

## Technical Architecture

### Frontend (React)
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query for server state
- **UI Components**: Shadcn/UI with Tailwind CSS
- **Internationalization**: React-i18next for English/German support
- **Design Tools**: Canvas-based design interface

### Backend (Express)
- **Authentication**: Session-based with passport
- **Database**: PostgreSQL with Drizzle ORM
- **Email Service**: SendGrid integration for notifications
- **Payment Processing**: Stripe for secure transactions
- **API Design**: RESTful endpoints with comprehensive error handling

### Database Schema
- **Users**: Authentication and profile management
- **Products**: Catalog with categories, pricing, and inventory
- **Designs**: User-created designs with JSON element storage
- **Orders**: Complete order lifecycle management
- **Group Orders**: Collaborative ordering system
- **Sponsorship**: Seeker/sponsor profiles and agreements

## User Flows

### Design Creation
1. Access design tool from navigation or products page
2. Select product template (singlet, uniform, etc.)
3. Add design elements (text, images, graphics)
4. Save design with unique ID
5. Share via email, copy link, or view in "My Designs"

### Group Ordering
1. Create group order with product selection and minimum quantity
2. Share group order link with team members
3. Members join by selecting sizes, colors, and quantities
4. Monitor progress until minimum quantity reached
5. Group creator proceeds to checkout for entire order

### Sponsorship Process
1. Teams create seeker profiles with organization details
2. Businesses create sponsor profiles with available sponsorship
3. Browse and match based on location, sport, budget
4. Create formal sponsorship agreements
5. Manage sponsorship credits and order applications

## Configuration

### Environment Variables
```
DATABASE_URL=postgresql://...
SENDGRID_API_KEY=sg...
STRIPE_SECRET_KEY=sk_...
VITE_STRIPE_PUBLIC_KEY=pk_...
```

### Admin Access
- Username: `admin`
- Password: `admin`
- Redirects to admin dashboard on login

### Test Accounts
- Team Account: `team_ravens` / `password123`
- Sponsor Account: `sponsor_ccb` / `password123`

## Key Features Detail

### Newsletter System
- **Popup Behavior**: Shows once per session for new visitors
- **Incentive**: Free shipping offer for first-time subscribers
- **Storage**: Uses localStorage to track popup visibility

### Email Functionality
- **Order Confirmations**: Automated emails with order details
- **Newsletter Subscriptions**: Welcome emails with shipping offers
- **Design Sharing**: Direct email links to shared designs
- **Group Order Notifications**: Invitation and status emails
- **Sponsorship Communications**: Agreement and inquiry emails

### Internationalization
- **Languages**: English (default), German
- **Currency**: AUD, EUR, USD, CAD with site-level selection
- **Localization**: Headers, navigation, and key interface elements

### Performance Features
- **Sale Pricing**: FOMO-driven pricing with crossed-out original prices
- **Cross-sell Recommendations**: Admin-configurable product suggestions
- **Confetti Animation**: Order confirmation celebrations
- **Dynamic Text**: Rotating hero text for engagement

## Security Considerations
- Session-based authentication with secure cookies
- Input validation using Zod schemas
- SQL injection prevention with parameterized queries
- CSRF protection on state-changing operations

## Deployment Notes
- Built for Replit deployment with automatic scaling
- Uses PostgreSQL for persistent data storage
- Requires external service configuration (Stripe, SendGrid)
- Environment-specific configurations for development/production

## Support & Maintenance
- Comprehensive error logging and monitoring
- Admin dashboard for operational oversight
- Automated email notifications for critical events
- Database backup and recovery procedures

---

**Last Updated**: December 30, 2024
**Version**: 2.0.0
**Platform**: Replit with PostgreSQL