"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, X, ExternalLink, Book, Code, Settings, Palette, ShoppingCart, Mail, Image } from "lucide-react";

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sections = [
    { id: "overview", title: "Overview", icon: Book },
    { id: "public-website", title: "Public Website", icon: Palette },
    { id: "admin-system", title: "Admin System", icon: Settings },
    { id: "data-management", title: "Data Management", icon: Code },
    { id: "technical", title: "Technical Architecture", icon: Code },
    { id: "deployment", title: "Deployment", icon: ExternalLink },
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-4">Bekker Fine Art Website Documentation</h1>
              <p className="text-lg text-neutral-600 mb-6">
                Complete guide to the Bekker Fine Art website system, covering both public website and admin functionality.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Live Website</h3>
              <p className="text-blue-800 mb-3">The website is currently live and accessible at:</p>
              <a 
                href="https://bekkerfineart.web.app" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                https://bekkerfineart.web.app <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Tech Stack</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg border">
                  <div className="font-medium text-neutral-900">Next.js 15</div>
                  <div className="text-neutral-600">React Framework</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="font-medium text-neutral-900">React 19</div>
                  <div className="text-neutral-600">UI Library</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="font-medium text-neutral-900">TypeScript</div>
                  <div className="text-neutral-600">Type Safety</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="font-medium text-neutral-900">Tailwind CSS</div>
                  <div className="text-neutral-600">Styling</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="font-medium text-neutral-900">Framer Motion</div>
                  <div className="text-neutral-600">Animations</div>
                </div>
                <div className="bg-white p-3 rounded-lg border">
                  <div className="font-medium text-neutral-900">Firebase</div>
                  <div className="text-neutral-600">Hosting</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <h4 className="font-semibold text-neutral-900 mb-3">Public Website</h4>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• Dynamic hero slider</li>
                    <li>• Artwork gallery with filtering</li>
                    <li>• Shopping cart system</li>
                    <li>• Contact forms</li>
                    <li>• Mobile responsive design</li>
                  </ul>
                </div>
                <div className="bg-white border border-neutral-200 rounded-xl p-6">
                  <h4 className="font-semibold text-neutral-900 mb-3">Admin Panel</h4>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• Artwork management</li>
                    <li>• Sales tracking</li>
                    <li>• Customer messages</li>
                    <li>• Content editing</li>
                    <li>• Settings configuration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "public-website":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Public Website</h1>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Palette className="h-6 w-6" />
                  Core Features
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Home Section</h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Dynamic hero slider with customizable slides</li>
                      <li>• Call-to-action buttons for each slide</li>
                      <li>• Smooth slide transitions with navigation</li>
                      <li>• Mobile-responsive design</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Gallery Section</h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Artwork grid display with category filtering</li>
                      <li>• Categories: All, Paintings, Mixed Media, Pottery</li>
                      <li>• Search functionality</li>
                      <li>• Add-to-cart functionality</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Shopping Cart System</h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Persistent cart across page reloads</li>
                      <li>• Framing option (+R1,000 add-on)</li>
                      <li>• Quantity management</li>
                      <li>• Inquiry form for purchases</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Contact System</h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Contact form with validation</li>
                      <li>• Multiple contact methods</li>
                      <li>• Purchase inquiry capability</li>
                      <li>• Form submission tracking</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Navigation</h2>
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                  <ul className="space-y-2 text-neutral-600">
                    <li>• Sticky header with backdrop blur effect</li>
                    <li>• Mobile hamburger menu with smooth animations</li>
                    <li>• Smooth scroll navigation to page sections</li>
                    <li>• Shopping cart indicator with item count</li>
                    <li>• Touch-friendly mobile interactions</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        );

      case "admin-system":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Admin System</h1>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-900 mb-2">Admin Access</h3>
              <p className="text-yellow-800 mb-3">Access the admin panel at:</p>
              <a 
                href="https://bekkerfineart.web.app/admin" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-yellow-700 hover:text-yellow-900 font-medium mb-3"
              >
                https://bekkerfineart.web.app/admin <ExternalLink className="h-4 w-4" />
              </a>
              <div className="text-sm text-yellow-800 font-mono bg-yellow-100 p-3 rounded-lg">
                <div>Username: admin</div>
                <div>Password: bekker2024</div>
              </div>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Dashboard Sections
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Book className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-neutral-900">Overview</h3>
                    </div>
                    <ul className="space-y-2 text-neutral-600 text-sm">
                      <li>• Dashboard statistics and metrics</li>
                      <li>• Recent activity feed</li>
                      <li>• Quick action buttons</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-neutral-900">Artworks</h3>
                    </div>
                    <ul className="space-y-2 text-neutral-600 text-sm">
                      <li>• Complete artwork inventory management</li>
                      <li>• Image upload and management</li>
                      <li>• Status tracking (Available/Sold)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-neutral-900">Sales</h3>
                    </div>
                    <ul className="space-y-2 text-neutral-600 text-sm">
                      <li>• Sales tracking and management</li>
                      <li>• Customer transaction details</li>
                      <li>• Revenue analytics</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="h-5 w-5 text-orange-600" />
                      <h3 className="font-semibold text-neutral-900">Messages</h3>
                    </div>
                    <ul className="space-y-2 text-neutral-600 text-sm">
                      <li>• Customer contact form submissions</li>
                      <li>• Purchase inquiry management</li>
                      <li>• Message status tracking</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Image className="h-5 w-5 text-pink-600" />
                      <h3 className="font-semibold text-neutral-900">Hero Slider</h3>
                    </div>
                    <ul className="space-y-2 text-neutral-600 text-sm">
                      <li>• Homepage slider management</li>
                      <li>• Slide content and media</li>
                      <li>• Call-to-action configuration</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Settings className="h-5 w-5 text-gray-600" />
                      <h3 className="font-semibold text-neutral-900">Settings</h3>
                    </div>
                    <ul className="space-y-2 text-neutral-600 text-sm">
                      <li>• Application configuration</li>
                      <li>• Theme and display preferences</li>
                      <li>• Data export and backup</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Mobile Responsive Admin</h2>
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                  <ul className="space-y-2 text-neutral-600">
                    <li>• Mobile header with current section display</li>
                    <li>• Collapsible sidebar with hamburger menu</li>
                    <li>• Touch-friendly navigation and interactions</li>
                    <li>• Responsive form layouts and modal dialogs</li>
                    <li>• Optimized for phones and tablets</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        );

      case "data-management":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Data Management</h1>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Storage System</h2>
                <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6">
                  <p className="text-neutral-600 mb-4">
                    The website uses <strong>localStorage</strong> for data persistence with organized storage keys:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
                    <div className="bg-white p-3 rounded border">
                      <strong>bekker-artworks</strong><br />
                      <span className="text-neutral-600">Artwork inventory</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>bekker-hero-slides</strong><br />
                      <span className="text-neutral-600">Homepage slider</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>bekker-sales</strong><br />
                      <span className="text-neutral-600">Sales transactions</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>bekker-contacts</strong><br />
                      <span className="text-neutral-600">Customer messages</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>bekker-settings</strong><br />
                      <span className="text-neutral-600">App configuration</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <strong>bekker-activities</strong><br />
                      <span className="text-neutral-600">Activity tracking</span>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Data Types</h2>
                
                <div className="space-y-6">
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Artwork Object</h3>
                    <pre className="bg-neutral-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
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
}`}
                    </pre>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Sale Transaction</h3>
                    <pre className="bg-neutral-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  id: string;
  artworkId: string;
  artworkTitle: string;
  originalPrice: number;
  salePrice: number;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  deliveryMethod: string;
  timestamp: string;
}`}
                    </pre>
                  </div>

                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Contact Message</h3>
                    <pre className="bg-neutral-100 p-4 rounded-lg text-sm overflow-x-auto">
{`{
  id: string;
  type: 'general' | 'purchase_inquiry';
  name: string;
  email: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'archived';
  // Purchase specific:
  artworkIds?: string[];
  totalAmount?: number;
}`}
                    </pre>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Key Functions</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Artwork Management</h3>
                    <ul className="space-y-1 text-sm font-mono text-neutral-600">
                      <li>• getArtworks()</li>
                      <li>• addArtwork(artwork)</li>
                      <li>• updateArtwork(id, changes)</li>
                      <li>• deleteArtwork(id)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Sales & Activity</h3>
                    <ul className="space-y-1 text-sm font-mono text-neutral-600">
                      <li>• recordSale(saleData)</li>
                      <li>• getSales()</li>
                      <li>• getActivities()</li>
                      <li>• addActivity(activity)</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case "technical":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Technical Architecture</h1>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Framework & Libraries</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">Next.js 15</div>
                    <div className="text-neutral-600">React framework with App Router</div>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">React 19</div>
                    <div className="text-neutral-600">UI library with concurrent features</div>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">TypeScript</div>
                    <div className="text-neutral-600">Type-safe JavaScript</div>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-cyan-600 mb-2">Tailwind CSS</div>
                    <div className="text-neutral-600">Utility-first CSS framework</div>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-pink-600 mb-2">Framer Motion</div>
                    <div className="text-neutral-600">Animation library</div>
                  </div>
                  <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">Lucide React</div>
                    <div className="text-neutral-600">Icon library</div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Project Structure</h2>
                <div className="bg-neutral-900 text-neutral-100 rounded-xl p-6 overflow-x-auto">
                  <pre className="text-sm">
{`bekker-fine-art/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx     # Admin dashboard
│   │   └── page.tsx         # Admin login
│   ├── docs/
│   │   └── page.tsx         # This documentation
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main website
├── lib/
│   └── artworks.ts          # Data management
├── public/
│   └── images/              # Artwork images
├── firebase.json            # Firebase config
└── next.config.ts           # Next.js config`}
                  </pre>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Key Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Performance</h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Server-Side Rendering (SSR)</li>
                      <li>• Static Generation for fast loads</li>
                      <li>• Code splitting with Next.js</li>
                      <li>• Image optimization and lazy loading</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">User Experience</h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Client-side hydration</li>
                      <li>• Responsive mobile-first design</li>
                      <li>• Accessibility considerations</li>
                      <li>• Smooth animations and transitions</li>
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      case "deployment":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Deployment</h1>
            
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Hosting Information</h2>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-orange-900 mb-2">Platform</h3>
                      <p className="text-orange-800">Firebase Hosting</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-900 mb-2">Live URL</h3>
                      <a 
                        href="https://bekkerfineart.web.app" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-700 hover:text-orange-900 font-medium"
                      >
                        https://bekkerfineart.web.app
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Build Process</h2>
                <div className="space-y-4">
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">1. Build Command</h3>
                    <pre className="bg-neutral-100 p-4 rounded-lg font-mono text-sm">npm run build</pre>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">2. Static Export</h3>
                    <p className="text-neutral-600 mb-3">Next.js builds static files to <code>/out</code> directory</p>
                    <pre className="bg-neutral-100 p-4 rounded-lg font-mono text-sm">Static export configuration in next.config.ts</pre>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">3. Deploy Command</h3>
                    <pre className="bg-neutral-100 p-4 rounded-lg font-mono text-sm">firebase deploy</pre>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Environment Features</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Production Optimizations</h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Automatic SSL certificate management</li>
                      <li>• CDN distribution worldwide</li>
                      <li>• Static file caching</li>
                      <li>• Gzip compression</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white border border-neutral-200 rounded-xl p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">Maintenance</h3>
                    <ul className="space-y-2 text-neutral-600">
                      <li>• Export settings for backup</li>
                      <li>• Images stored in /public/images/</li>
                      <li>• Deploy updates via Firebase CLI</li>
                      <li>• Monitor via Firebase Console</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Usage Guide</h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-3">For Content Managers</h3>
                    <ol className="space-y-1 text-blue-800 list-decimal list-inside">
                      <li>Access admin panel at /admin</li>
                      <li>Use Overview for quick status checks</li>
                      <li>Manage artworks through Artworks section</li>
                      <li>Track sales in Sales Management</li>
                      <li>Respond to inquiries in Messages</li>
                    </ol>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="font-semibold text-green-900 mb-3">For Developers</h3>
                    <ol className="space-y-1 text-green-800 list-decimal list-inside">
                      <li>Clone repository</li>
                      <li>Run <code>npm install</code></li>
                      <li>Start development: <code>npm run dev</code></li>
                      <li>Build for production: <code>npm run build</code></li>
                      <li>Deploy: <code>firebase deploy</code></li>
                    </ol>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="font-semibold text-purple-900 mb-3">For Customers</h3>
                    <ol className="space-y-1 text-purple-800 list-decimal list-inside">
                      <li>Browse artworks in Gallery section</li>
                      <li>Add items to cart</li>
                      <li>Submit inquiries through cart or contact form</li>
                      <li>Contact artist through multiple channels</li>
                    </ol>
                  </div>
                </div>
              </section>
            </div>
          </div>
        );

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-neutral-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="flex items-center gap-3">
                <Link 
                  href="/" 
                  className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Website
                </Link>
              </div>
            </div>
            <div className="font-serif text-2xl font-bold">
              Documentation
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between lg:justify-center">
                <h2 className="font-semibold text-neutral-900">Contents</h2>
                <button
                  className="lg:hidden p-2 rounded-xl hover:bg-neutral-100"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <li key={section.id}>
                      <button
                        onClick={() => handleSectionClick(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                          isActive 
                            ? "bg-neutral-900 text-white" 
                            : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {section.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="max-w-4xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}