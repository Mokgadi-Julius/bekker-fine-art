# Bekker Fine Art Website Documentation

## Table of Contents
1. [Overview](#overview)
2. [Public Website](#public-website)
3. [Admin System](#admin-system)
4. [Data Management](#data-management)
5. [Technical Architecture](#technical-architecture)
6. [Deployment](#deployment)

## Overview

Bekker Fine Art is a modern, responsive art gallery website built with Next.js 15, featuring a sophisticated admin panel for content management. The website showcases artwork with purchasing capabilities and includes a comprehensive backend for managing inventory, sales, and customer communications.

**Live URL:** https://bekkerfineart.web.app
**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, Firebase Hosting

---

## Public Website

### Core Features

#### 1. **Home Section**
- Dynamic hero slider with customizable slides
- Call-to-action buttons for each slide
- Smooth slide transitions with navigation controls
- Mobile-responsive design

#### 2. **Gallery Section**
- Artwork grid display with category filtering
- Categories: All, Paintings, Mixed Media, Pottery
- Search functionality for finding specific pieces
- Artwork details include:
  - Title and price (in ZAR)
  - Size and medium information
  - High-quality images
  - Add-to-cart functionality

#### 3. **Shopping Cart System**
- Persistent cart across page reloads
- Framing option (+R1,000 add-on)
- Quantity management
- Total price calculation
- Inquiry form for purchases

#### 4. **Pottery Section**
- Dedicated pottery gallery
- Shuffled display for varied experience
- Same purchasing capabilities as main gallery

#### 5. **About Section**
- Artist biography and story
- Artist photo
- Contact information display

#### 6. **Contact Section**
- Contact form with validation
- Multiple contact methods (phone, email, Instagram)
- Purchase inquiry capability
- Form submission tracking

#### 7. **Collage Gallery**
- Dynamic image grid
- Masonry-style layout
- Responsive image sizing

### Navigation
- Sticky header with backdrop blur
- Mobile hamburger menu
- Smooth scroll to sections
- Shopping cart indicator with item count

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly mobile interactions
- Optimized image loading

---

## Admin System

### Authentication
**Access:** `/admin`
**Credentials:**
- Username: `admin`
- Password: `bekker2024`

The admin system uses localStorage for session management and redirects to `/admin/dashboard` upon successful login.

### Dashboard Overview (`/admin/dashboard`)

The admin dashboard is fully mobile-responsive with a collapsible sidebar and includes:

#### Main Navigation Sections:
1. **Overview** - Dashboard statistics and recent activity
2. **Artworks** - Artwork inventory management
3. **Sales** - Sales tracking and management
4. **Messages** - Customer contact form submissions
5. **Hero Slider** - Homepage slider management
6. **Collage Gallery** - Image gallery management
7. **Content** - Website content editing
8. **Users** - User management (coming soon)
9. **Settings** - Application configuration

---

### 1. Overview Section

**Purpose:** Central dashboard for monitoring website activity

**Features:**
- **Statistics Cards:**
  - Total Artworks
  - Available Artworks  
  - Sold Artworks
  - Total Sales Value (in ZAR)

- **Recent Activity Feed:**
  - Real-time activity tracking
  - Activity types: artwork_added, artwork_updated, artwork_sold, sale_added, contact_received, content_updated
  - Timestamps with relative time display
  - Activity descriptions and metadata

- **Quick Actions:**
  - Add New Artwork
  - Record Sale
  - Manage Hero Slider
  - View Messages

### 2. Artworks Management

**Purpose:** Complete artwork inventory management system

**Features:**

#### Artwork Grid Display:
- Visual grid of all artworks
- Status indicators (Available, Sold)
- Image thumbnails
- Price and size display
- Quick edit/delete actions

#### Add/Edit Artwork Modal:
- **Basic Information:**
  - Title (required)
  - Price (in ZAR)
  - Size (e.g., "80 × 80 cm")
  - Medium (e.g., "Oil on canvas")
  - Category (Paintings, Mixed Media, Pottery)
  
- **Image Management:**
  - Multiple image upload
  - Drag-and-drop interface
  - Image preview and removal
  - Support for JPG, PNG, WEBP (max 25MB each)

- **Status Management:**
  - Available/Sold status toggle
  - Sold information (date, price, customer details)

#### Artwork Actions:
- Edit existing artworks
- Delete artworks (with confirmation)
- Status change tracking
- Activity logging

### 3. Sales Management

**Purpose:** Track and manage artwork sales and customer transactions

**Features:**

#### Sales Overview:
- **Statistics Dashboard:**
  - Total Sales Value
  - Number of Sales
  - Average Sale Price
  - Visual indicators with color coding

#### Sales List:
- Tabbed interface: "All Sales" | "Sold Artworks"
- **Sale Details:**
  - Artwork information
  - Customer details (name, email, phone)
  - Sale price vs. original price
  - Payment method
  - Delivery preferences
  - Sale notes
  - Transaction date

#### Add Sale Modal:
- Artwork selection dropdown
- Customer information capture
- Pricing details (original vs. sale price)
- Payment method selection
- Delivery method options
- Notes field for additional information

#### Sold Artworks View:
- Grid display of sold artworks
- Sale information overlay
- Customer and date details
- Price comparison (original vs. sold)

### 4. Messages Management

**Purpose:** Handle customer inquiries and contact form submissions

**Features:**

#### Message List:
- Status-based filtering (New, Read, Archived)
- Message type indicators:
  - General inquiries
  - Purchase inquiries
- Contact information display
- Timestamp with relative time
- Message preview

#### Message Details:
- Full message content
- Customer contact information
- Message type and status
- Action buttons:
  - Mark as Read/Unread
  - Archive message
  - Delete message

#### Message Types:
1. **General Inquiries:**
   - Standard contact form submissions
   - Basic customer information

2. **Purchase Inquiries:**
   - Shopping cart submissions
   - Artwork IDs and details
   - Total amount calculation
   - Delivery preferences
   - Special requests

### 5. Hero Slider Management

**Purpose:** Manage homepage hero slider content

**Features:**

#### Slider Overview:
- Current slides display (max 5 slides)
- Slide counter (e.g., "3/5 slides (2 remaining)")
- Preview of active slides

#### Add/Edit Slide Modal:
- **Slide Image:**
  - Image upload with preview
  - Drag-and-drop support
  - Image replacement capability

- **Content Fields:**
  - Headline text
  - Subtitle/description
  - Call-to-action button text
  - CTA link destination

#### Slide Management:
- Edit existing slides
- Delete slides
- Reorder slides (manual arrangement)
- Preview slide appearance

### 6. Collage Gallery Management

**Purpose:** Manage the dynamic image collage display

**Features:**

#### Image Grid:
- Visual grid of current collage images
- Image removal capability
- Maximum 12 images supported

#### Image Upload:
- Bulk image upload
- Drag-and-drop interface
- Real-time preview
- File format support (JPG, PNG, WEBP)

#### Management Tools:
- Add new images
- Remove existing images
- Image limit indicators
- Upload progress tracking

### 7. Content Editor

**Purpose:** Edit website text content and information

**Features:**

#### About Section Management:
- Artist name editing
- Biography/description editing
- Artist image upload and management
- Subtitle configuration

#### Contact Section Management:
- Contact section title
- Email address configuration
- Phone number settings
- Location/address information

#### Content Preview:
- Real-time preview of changes
- Save/discard options
- Change tracking

### 8. Settings Management

**Purpose:** Configure application behavior and preferences

**Features:**

#### Appearance Settings:
- **Theme Selection:**
  - Light mode
  - Dark mode  
  - Auto (system preference)
- **View Options:**
  - Compact view toggle
  - Show descriptions toggle

#### Functionality Settings:
- **Auto-save:** Enable/disable automatic saving
- **Activity Notifications:** Toggle activity tracking
- **Debug Mode:** Enable debug information
- **Backup Reminder:** Remind about data backups

#### Data Settings:
- **Max Image Size:** Configure upload limits (MB)
- **Currency:** ZAR, USD, EUR, GBP
- **Date Format:** DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD

#### Settings Actions:
- Export settings to JSON file
- Reset to default settings
- Import settings (manual)

### 9. Mobile Responsive Admin

**Features:**
- **Mobile Header:**
  - Current section display
  - Hamburger menu toggle
  - Bekker Fine Art branding

- **Sidebar Navigation:**
  - Slides in from left on mobile
  - Dark overlay background
  - Auto-close after selection
  - Touch-friendly navigation

- **Responsive Layouts:**
  - Form layouts adapt to screen size
  - Button groups stack on mobile
  - Modal dialogs optimize for mobile
  - Grid layouts use responsive breakpoints

---

## Data Management

### Storage System
The website uses **localStorage** for data persistence with the following structure:

#### Storage Keys:
- `bekker-artworks` - Artwork inventory
- `bekker-hero-slides` - Homepage slider content
- `bekker-content` - Website text content
- `bekker-sales` - Sales transactions
- `bekker-collage` - Collage gallery images
- `bekker-activities` - Activity tracking
- `bekker-contacts` - Customer messages
- `bekker-settings` - Application settings
- `bekker-admin-auth` - Admin session

### Data Types

#### Artwork Object:
```typescript
{
  id: string;
  title: string;
  price: number;
  size: string;
  medium: string;
  status: 'available' | 'sold';
  category: 'Paintings' | 'Mixed Media' | 'Pottery';
  images: string[];
  // Sold artwork fields:
  soldDate?: string;
  soldPrice?: number;
  customerName?: string;
  customerEmail?: string;
  saleNotes?: string;
}
```

#### Hero Slide Object:
```typescript
{
  id: string;
  image: string;
  headline: string;
  sub: string;
  cta: string;
  ctaLink: string;
}
```

#### Sale Transaction:
```typescript
{
  id: string;
  artworkId: string;
  artworkTitle: string;
  originalPrice: number;
  salePrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: string;
  deliveryMethod: string;
  notes?: string;
  timestamp: string;
  status: string;
}
```

#### Contact Message:
```typescript
{
  id: string;
  type: 'general' | 'purchase_inquiry';
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'archived';
  // Purchase inquiry specific:
  artworkIds?: string[];
  totalAmount?: number;
  deliveryPreference?: string;
  specialRequests?: string;
}
```

#### Activity Log:
```typescript
{
  id: string;
  type: 'artwork_added' | 'artwork_updated' | 'artwork_sold' | 
        'sale_added' | 'contact_received' | 'content_updated';
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}
```

### Data Functions

#### Core Operations:
- `getArtworks()` - Retrieve all artworks
- `addArtwork(artwork)` - Add new artwork
- `updateArtwork(id, changes)` - Update existing artwork
- `deleteArtwork(id)` - Remove artwork
- `recordSale(saleData)` - Record new sale
- `getSales()` - Get all sales data
- `getActivities()` - Get activity log
- `addActivity(activity)` - Log new activity

#### Utility Functions:
- `formatCurrency(amount, currency?)` - Format prices
- `formatDate(date, format?)` - Format dates
- `getTimeAgo(timestamp)` - Relative time display
- `getSettings()` - Get application settings
- `saveSettings(settings)` - Update settings

---

## Technical Architecture

### Framework & Libraries
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Project Structure
```
bekker-fine-art/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx     # Admin dashboard
│   │   └── page.tsx         # Admin login
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main website
├── lib/
│   └── artworks.ts          # Data management
├── public/
│   └── images/              # Artwork images
├── components/              # Reusable components
├── firebase.json            # Firebase config
└── next.config.ts           # Next.js config
```

### Key Features
- **Server-Side Rendering (SSR)** - Fast initial page loads
- **Static Generation** - Optimized performance  
- **Client-Side Hydration** - Interactive functionality
- **Responsive Design** - Mobile-first approach
- **Image Optimization** - Next.js image handling
- **Accessibility** - WCAG compliance considerations

### Performance Optimizations
- Code splitting with Next.js
- Image optimization and lazy loading
- CSS purging with Tailwind
- Bundle size optimization
- Caching strategies

---

## Deployment

### Hosting
**Platform:** Firebase Hosting
**URL:** https://bekkerfineart.web.app
**Build Command:** `npm run build`
**Deploy Command:** `firebase deploy`

### Build Process
1. Next.js builds static files to `/out` directory
2. Static export configuration in `next.config.ts`
3. Firebase deploys static files to CDN
4. Automatic SSL certificate management

### Environment Configuration
- Production optimizations enabled
- Static file caching
- CDN distribution
- Custom domain support available

### Maintenance
- **Backup:** Export settings and data regularly
- **Images:** Store in `/public/images/` directory  
- **Updates:** Deploy new versions via Firebase CLI
- **Monitoring:** Firebase Analytics and Console

---

## Usage Guide

### For Content Managers:
1. Access admin panel at `/admin`
2. Use Overview for quick status checks
3. Manage artworks through Artworks section
4. Track sales in Sales Management
5. Respond to customer inquiries in Messages
6. Update homepage content via Hero Slider
7. Refresh gallery images in Collage Manager
8. Edit site content in Content Editor

### For Developers:
1. Clone repository
2. Run `npm install` 
3. Start development: `npm run dev`
4. Build for production: `npm run build`
5. Deploy: `firebase deploy`

### For Customers:
1. Browse artworks in Gallery section
2. Add items to cart
3. Submit inquiries through cart or contact form
4. View pottery in dedicated Pottery section
5. Contact artist through multiple channels

---

## Support & Maintenance

### Regular Tasks:
- Monitor contact messages daily
- Update artwork inventory as needed
- Back up data through Settings export
- Add new hero slides seasonally
- Update collage gallery monthly

### Technical Maintenance:
- Monitor Firebase hosting usage
- Update dependencies regularly
- Optimize images before upload
- Review and clear activity logs periodically
- Test mobile responsiveness after updates

### Troubleshooting:
- **Login Issues:** Clear browser localStorage
- **Image Upload:** Check file size (max 25MB)
- **Data Loss:** Restore from settings backup
- **Mobile Issues:** Clear browser cache
- **Performance:** Optimize image sizes

This documentation provides a complete overview of the Bekker Fine Art website functionality and administrative capabilities. The system is designed to be user-friendly while providing comprehensive management tools for running a professional art gallery website.