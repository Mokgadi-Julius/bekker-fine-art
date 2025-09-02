"use client";
import { useState, useEffect, useRef } from "react";
import { getArtworks, getArtworksFromAPI, getHeroSlides, getHeroSlidesFromAPI, saveHeroSlidesWithSync, addArtworkWithSync, updateArtworkWithSync, deleteArtworkWithSync, getContent, getContentFromAPI, saveContentWithSync, getSales, updateSale, deleteSale, recordSale, resetSalesDataWithSync, resetArtworksWithSync, getCollage, getCollageFromAPI, saveCollageWithSync, getActivities, getTimeAgo, getSettings, saveSettings, updateSetting, formatCurrency, formatDate, getContacts, markContactAsRead, deleteContactMessage, updateContactMessage, type Artwork, type HeroSlide, type Content, type Sale, type Collage, type Activity, type AppSettings, type ContactMessage } from "../../../lib/artworks";
import { 
  BarChart3, 
  Image, 
  Settings, 
  Users, 
  Mail, 
  LogOut, 
  Plus,
  Edit3,
  Trash2,
  Upload,
  Save,
  X,
  Camera,
  Palette,
  ShoppingCart,
  Moon,
  Sun,
  Monitor,
  Download,
  RefreshCw,
  Zap,
  DollarSign,
  Sliders,
  Phone,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";




type ActiveSection = "overview" | "artworks" | "sales" | "messages" | "hero" | "collage" | "content" | "users" | "settings";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("bekker-admin-auth");
    setIsAuthenticated(auth === "authenticated");
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-black">Loading...</div>
    </div>;
  }

  if (!isAuthenticated) {
    window.location.href = "/admin";
    return null;
  }

  return <>{children}</>;
}

function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: { 
  activeSection: ActiveSection; 
  onSectionChange: (section: ActiveSection) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "artworks", label: "Artworks", icon: Palette },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "hero", label: "Hero Slider", icon: Camera },
    { id: "collage", label: "Collage Gallery", icon: Image },
    { id: "content", label: "Content", icon: Edit3 },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ] as const;

  const handleLogout = () => {
    localStorage.removeItem("bekker-admin-auth");
    window.location.href = "/admin";
  };

  const handleSectionChange = (section: ActiveSection) => {
    onSectionChange(section);
    onClose(); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        w-64 bg-white border-r border-neutral-200 h-screen flex flex-col
        transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-6 border-b border-neutral-200">
        <h1 className="font-serif text-xl font-bold">Bekker Fine Art</h1>
        <p className="text-sm text-black">Admin Panel</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleSectionChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    isActive 
                      ? "bg-neutral-900 text-white" 
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-neutral-700 hover:bg-neutral-100"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
      </div>
    </>
  );
}

function Overview({ 
  onSectionChange, 
  onQuickAction 
}: { 
  onSectionChange: (section: ActiveSection) => void;
  onQuickAction: (action: string) => void;
}) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Load from API first, fallback to localStorage
    const loadData = async () => {
      try {
        const apiArtworks = await getArtworksFromAPI();
        setArtworks(apiArtworks);
      } catch (error) {
        setArtworks(getArtworks());
      }
    };
    
    loadData();
    setSales(getSales());
    setActivities(getActivities());
    
    // Listen for real-time updates to artworks, sales, and activities
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bekker-artworks' && e.newValue) {
        try {
          setArtworks(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating artworks from storage:', error);
        }
      }
      if (e.key === 'bekker-sales' && e.newValue) {
        try {
          setSales(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating sales from storage:', error);
        }
      }
      if (e.key === 'bekker-activities' && e.newValue) {
        try {
          setActivities(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating activities from storage:', error);
        }
      }
    };
    
    // Handle same-tab activity updates
    const handleActivityUpdate = () => {
      setActivities(getActivities());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('activities-updated', handleActivityUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activities-updated', handleActivityUpdate);
    };
  }, []);

  const totalArtworks = artworks.length;
  const soldArtworks = artworks.filter(a => a.status === "sold").length;
  const availableArtworks = artworks.filter(a => a.status === "available").length;
  const totalSalesValue = sales.reduce((sum, sale) => sum + sale.salePrice, 0);

  const stats = [
    { label: "Total Artworks", value: totalArtworks.toString(), icon: Palette, color: "bg-blue-500" },
    { label: "Available", value: availableArtworks.toString(), icon: Image, color: "bg-green-500" },
    { label: "Sold", value: soldArtworks.toString(), icon: ShoppingCart, color: "bg-orange-500" },
    { label: "Sales Value", value: `R${totalSalesValue.toLocaleString()}`, icon: Mail, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-neutral-900">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-neutral-700">
                <div className="text-sm">No recent activity</div>
                <div className="text-xs mt-1">Activities will appear here as you manage artworks, sales, and content.</div>
              </div>
            ) : (
              activities.slice(0, 5).map((activity) => {
                // Define icon and color based on activity type
                const getActivityIcon = (type: Activity['type']) => {
                  switch (type) {
                    case 'artwork_added': return { icon: Plus, bgColor: 'bg-green-100', iconColor: 'text-green-600' };
                    case 'artwork_updated': return { icon: Edit3, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
                    case 'artwork_sold': return { icon: ShoppingCart, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' };
                    case 'sale_added': return { icon: ShoppingCart, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' };
                    case 'contact_received': return { icon: Mail, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
                    case 'content_updated': return { icon: Edit3, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
                    default: return { icon: Mail, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
                  }
                };
                
                const { icon: Icon, bgColor, iconColor } = getActivityIcon(activity.type);
                
                return (
                  <div key={activity.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                    <div className={`p-2 ${bgColor} rounded-lg`}>
                      <Icon className={`h-4 w-4 ${iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-xs text-neutral-700 font-medium">{getTimeAgo(activity.timestamp)}</div>
                      {activity.description && (
                        <div className="text-xs text-neutral-700 mt-1">{activity.description}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => {
                onQuickAction("add-artwork");
                onSectionChange("artworks");
              }}
              className="w-full flex items-center gap-3 p-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
            >
              <Plus className="h-5 w-5" />
              Add New Artwork
            </button>
            <button 
              onClick={() => {
                onQuickAction("upload-images");
                onSectionChange("artworks");
              }}
              className="w-full flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50"
            >
              <Upload className="h-5 w-5" />
              Upload Images
            </button>
            <button 
              onClick={() => onSectionChange("content")}
              className="w-full flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50"
            >
              <Edit3 className="h-5 w-5" />
              Edit Content
            </button>
            <button 
              onClick={() => onSectionChange("hero")}
              className="w-full flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50"
            >
              <Camera className="h-5 w-5" />
              Manage Hero Slider
            </button>
            <button 
              onClick={() => {
                onQuickAction("record-sale");
                onSectionChange("sales");
              }}
              className="w-full flex items-center gap-3 p-3 border border-neutral-200 rounded-xl hover:bg-neutral-50"
            >
              <ShoppingCart className="h-5 w-5" />
              Record Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSliderManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    // Load from API first, fallback to localStorage
    const loadData = async () => {
      try {
        const apiSlides = await getHeroSlidesFromAPI();
        setSlides(apiSlides);
      } catch (error) {
        setSlides(getHeroSlides());
      }
    };
    
    loadData();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  const [formData, setFormData] = useState({
    image: "",
    headline: "",
    sub: "",
    cta: "",
    ctaLink: ""
  });

  const openModal = (slide?: HeroSlide) => {
    if (slide) {
      setEditingSlide(slide);
      setFormData({
        image: slide.image,
        headline: slide.headline,
        sub: slide.sub,
        cta: slide.cta,
        ctaLink: slide.ctaLink || "#gallery"
      });
    } else {
      setEditingSlide(null);
      setFormData({
        image: "",
        headline: "",
        sub: "",
        cta: "",
        ctaLink: "#gallery"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    // Check if we're adding a new slide and already have 5 slides
    if (!editingSlide && slides.length >= 5) {
      alert("Maximum of 5 slides allowed. Please delete a slide before adding a new one.");
      return;
    }

    if (!formData.headline.trim() || !formData.sub.trim() || !formData.cta.trim()) {
      alert("Please fill in all required fields (headline, subtitle, and call to action).");
      return;
    }

    const slideData = {
      id: editingSlide?.id || `h${Date.now()}`,
      image: formData.image || "/images/placeholder.jpg",
      headline: formData.headline,
      sub: formData.sub,
      cta: formData.cta,
      ctaLink: formData.ctaLink
    };

    if (editingSlide) {
      const newSlides = slides.map(s => s.id === editingSlide.id ? slideData : s);
      setSlides(newSlides);
      await saveHeroSlidesWithSync(newSlides);
    } else {
      const newSlides = [...slides, slideData];
      setSlides(newSlides);
      await saveHeroSlidesWithSync(newSlides);
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      const newSlides = slides.filter(s => s.id !== id);
      setSlides(newSlides);
      await saveHeroSlidesWithSync(newSlides);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hero Slider Management</h2>
          <p className="text-sm text-neutral-900 mt-1">
            {slides.length}/5 slides ({5 - slides.length} remaining)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const stored = localStorage.getItem('bekker-hero-slides');
              const current = getHeroSlides();
              console.log('LocalStorage raw:', stored);
              console.log('getHeroSlides() result:', current);
              alert(`Admin shows: ${slides.length} slides\nLocalStorage has: ${current.length} slides\nCheck console for details`);
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm"
          >
            Debug
          </button>
          <button
            onClick={() => openModal()}
            disabled={slides.length >= 5}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
              slides.length >= 5
                ? "bg-neutral-300 text-black cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
          >
            <Plus className="h-5 w-5" />
            {slides.length >= 5 ? "Maximum Slides (5)" : "Add Slide"}
          </button>
        </div>
      </div>

      {slides.length >= 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <div className="p-1 bg-amber-200 rounded">
              <Plus className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium text-sm">Maximum slides reached</div>
              <div className="text-xs">You can have up to 5 slides in your hero slideshow. Delete a slide to add a new one.</div>
            </div>
          </div>
        </div>
      )}

      {slides.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm ring-1 ring-black/5">
          <div className="p-4 bg-neutral-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Image className="h-8 w-8 text-black" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Hero Slides</h3>
          <p className="text-neutral-900 mb-4">Create your first hero slide to showcase your artwork.</p>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
          >
            <Plus className="h-5 w-5" />
            Create First Slide
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {slides.map((slide, index) => (
            <div key={slide.id} className="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
            <div className="relative">
              <img 
                src={slide.image} 
                alt={slide.headline}
                className="h-48 w-full object-cover"
              />
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white rounded text-xs font-semibold">
                Slide #{index + 1}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{slide.headline}</h3>
              <p className="text-sm text-neutral-900 mt-1">{slide.sub}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm bg-neutral-100 px-2 py-1 rounded">{slide.cta}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(slide)}
                    className="p-2 text-black hover:text-neutral-900"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingSlide ? "Edit Slide" : "Add New Slide"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Slide Image</label>
                  <div className="space-y-4">
                    {formData.image && (
                      <div className="relative w-full max-w-md">
                        <img 
                          src={formData.image} 
                          alt="Slide preview"
                          className="w-full h-32 object-cover rounded-xl border border-neutral-200"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {!formData.image && (
                      <ImageUpload 
                        images={[]}
                        onChange={(images) => {
                          if (images.length > 0) {
                            setFormData(prev => ({ ...prev, image: images[0] }));
                          }
                        }}
                      />
                    )}
                    {formData.image && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                          className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-sm"
                        >
                          Change Image
                        </button>
                      </div>
                    )}
                    <div className="text-sm text-black">
                      Upload an image for the hero slider. Recommended size: 1200x600px or similar landscape ratio.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Headline</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                    placeholder="Enter slide headline"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <textarea
                    value={formData.sub}
                    onChange={(e) => setFormData(prev => ({ ...prev, sub: e.target.value }))}
                    rows={3}
                    placeholder="Enter slide subtitle"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Call to Action Text</label>
                    <input
                      type="text"
                      value={formData.cta}
                      onChange={(e) => setFormData(prev => ({ ...prev, cta: e.target.value }))}
                      placeholder="View Gallery"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CTA Section</label>
                    <select
                      value={formData.ctaLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, ctaLink: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="#gallery">Gallery</option>
                      <option value="#pottery">Pottery</option>
                      <option value="#about">About</option>
                      <option value="#contact">Contact</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
                >
                  <Save className="h-5 w-5" />
                  {editingSlide ? "Update" : "Create"} Slide
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SalesManager({ quickAction }: { quickAction?: string | null }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [activeTab, setActiveTab] = useState<"sales" | "sold-artworks">("sales");
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Load initial data
  useEffect(() => {
    setSales(getSales());
    setArtworks(getArtworks());
  }, []);

  // Listen for artwork changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bekker-artworks' && e.newValue) {
        try {
          setArtworks(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating artworks from storage:', error);
        }
      }
      if (e.key === 'bekker-sales' && e.newValue) {
        try {
          setSales(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating sales from storage:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle quick actions from overview
  useEffect(() => {
    if (quickAction === "record-sale") {
      openModal();
    }
  }, [quickAction]);

  const [formData, setFormData] = useState({
    artworkId: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    salePrice: "",
    paymentMethod: "Bank Transfer",
    deliveryMethod: "Collection",
    notes: "",
    saleDate: new Date().toISOString().split('T')[0]
  });

  const availableArtworks = artworks.filter(a => a.status === "available");
  const soldArtworks = artworks.filter(a => a.status === "sold");

  const openModal = (sale?: Sale) => {
    if (sale) {
      setEditingSale(sale);
      setFormData({
        artworkId: sale.artworkId,
        customerName: sale.customerName,
        customerEmail: sale.customerEmail,
        customerPhone: sale.customerPhone,
        salePrice: sale.salePrice.toString(),
        paymentMethod: sale.paymentMethod,
        deliveryMethod: sale.deliveryMethod,
        notes: sale.notes,
        saleDate: sale.saleDate
      });
    } else {
      setEditingSale(null);
      setFormData({
        artworkId: "",
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        salePrice: "",
        paymentMethod: "Bank Transfer",
        deliveryMethod: "Collection",
        notes: "",
        saleDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const selectedArtwork = artworks.find(a => a.id === formData.artworkId);
    if (!selectedArtwork) {
      alert("Please select an artwork");
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.salePrice) {
      alert("Please fill in all required fields");
      return;
    }

    const salePrice = parseInt(formData.salePrice);
    if (isNaN(salePrice) || salePrice <= 0) {
      alert("Please enter a valid sale price");
      return;
    }

    if (editingSale) {
      // Update existing sale
      const updatedSale: Sale = {
        ...editingSale,
        artworkId: formData.artworkId,
        artworkTitle: selectedArtwork.title,
        saleDate: formData.saleDate,
        originalPrice: selectedArtwork.price,
        salePrice: salePrice,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        paymentMethod: formData.paymentMethod,
        deliveryMethod: formData.deliveryMethod,
        notes: formData.notes,
        status: "completed"
      };

      updateSale(editingSale.id, updatedSale);
      setSales(prev => prev.map(s => s.id === editingSale.id ? updatedSale : s));

      // Update artwork if needed
      const artwork = artworks.find(a => a.id === formData.artworkId);
      if (artwork) {
        const updatedArtwork: Artwork = {
          ...artwork,
          status: "sold",
          soldDate: formData.saleDate,
          soldPrice: salePrice,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          saleNotes: formData.notes
        };
        await updateArtworkWithSync(artwork.id, updatedArtwork);
        setArtworks(prev => prev.map(a => a.id === artwork.id ? updatedArtwork : a));
      }
    } else {
      // Record new sale
      const saleData = {
        artworkId: formData.artworkId,
        artworkTitle: selectedArtwork.title,
        saleDate: formData.saleDate,
        originalPrice: selectedArtwork.price,
        salePrice: salePrice,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        paymentMethod: formData.paymentMethod,
        deliveryMethod: formData.deliveryMethod,
        notes: formData.notes
      };

      const newSale = recordSale(saleData);
      setSales(prev => [...prev, newSale]);
      
      // Update local artworks state
      const updatedArtwork: Artwork = {
        ...selectedArtwork,
        status: "sold",
        soldDate: formData.saleDate,
        soldPrice: salePrice,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        saleNotes: formData.notes
      };
      setArtworks(prev => prev.map(a => a.id === selectedArtwork.id ? updatedArtwork : a));
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = (saleId: string) => {
    if (confirm("Are you sure you want to delete this sale record?")) {
      deleteSale(saleId);
      setSales(prev => prev.filter(s => s.id !== saleId));
    }
  };

  const markAsAvailable = async (artworkId: string) => {
    if (confirm("Mark this artwork as available again? This will remove the sale record.")) {
      const artwork = artworks.find(a => a.id === artworkId);
      if (artwork) {
        const updatedArtwork = { ...artwork } as Artwork;
        delete updatedArtwork.soldDate;
        delete updatedArtwork.soldPrice;
        delete updatedArtwork.customerName;
        delete updatedArtwork.customerEmail;
        delete updatedArtwork.saleNotes;
        updatedArtwork.status = "available";
        await updateArtworkWithSync(artworkId, updatedArtwork);
        setArtworks(prev => prev.map(a => a.id === artworkId ? updatedArtwork : a));
      }
      
      // Remove corresponding sale record
      const saleToRemove = sales.find(s => s.artworkId === artworkId);
      if (saleToRemove) {
        deleteSale(saleToRemove.id);
        setSales(prev => prev.filter(s => s.artworkId !== artworkId));
      }
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + sale.salePrice, 0);
  const averageSale = sales.length > 0 ? totalSales / sales.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Sales Management</h2>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              if (confirm("Reset sales data to fix duplicates? This will restore the original sample data across ALL browsers.")) {
                try {
                  await resetSalesDataWithSync();
                  setSales(getSales());
                  setArtworks(getArtworks());
                } catch (error) {
                  console.error('Error syncing sales reset:', error);
                  alert('Reset completed locally. Other browsers will sync when they refresh.');
                }
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm"
          >
            Reset Sales Data (All Browsers)
          </button>
          <button
            onClick={async () => {
              if (confirm("Reset artworks to fix corrupted images? This will restore clean artwork data across ALL browsers.")) {
                try {
                  await resetArtworksWithSync();
                  const freshArtworks = await getArtworksFromAPI();
                  setArtworks(freshArtworks);
                  // Force refresh the page to clear any cached image issues
                  window.location.reload();
                } catch (error) {
                  console.error('Error syncing reset:', error);
                  alert('Reset completed locally. Other browsers will sync when they refresh.');
                }
              }
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 text-sm"
          >
            Fix Images (All Browsers)
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
          >
            <Plus className="h-5 w-5" />
            Record Sale
          </button>
        </div>
      </div>

      {/* Sales Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-2xl font-bold text-green-600">R{totalSales.toLocaleString()}</div>
          <div className="text-sm text-neutral-900 font-medium">Total Sales Value</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-2xl font-bold text-blue-600">{sales.length}</div>
          <div className="text-sm text-neutral-900 font-medium">Total Sales</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-2xl font-bold text-purple-600">R{Math.round(averageSale).toLocaleString()}</div>
          <div className="text-sm text-neutral-900 font-medium">Average Sale</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("sales")}
          className={`px-4 py-2 font-medium ${
            activeTab === "sales" 
              ? "text-neutral-900 border-b-2 border-neutral-900" 
              : "text-black hover:text-neutral-800"
          }`}
        >
          Sales Records ({sales.length})
        </button>
        <button
          onClick={() => setActiveTab("sold-artworks")}
          className={`px-4 py-2 font-medium ${
            activeTab === "sold-artworks" 
              ? "text-neutral-900 border-b-2 border-neutral-900" 
              : "text-black hover:text-neutral-800"
          }`}
        >
          Sold Artworks ({soldArtworks.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5">
        {activeTab === "sales" && (
          <div className="p-6">
            {sales.length > 0 ? (
              <div className="space-y-4">
                {sales.map((sale) => (
                <div key={sale.id} className="border border-neutral-200 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{sale.artworkTitle}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {sale.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-900">
                        <div>
                          <strong>Customer:</strong> {sale.customerName}
                        </div>
                        <div>
                          <strong>Sale Date:</strong> {new Date(sale.saleDate).toLocaleDateString()}
                        </div>
                        <div>
                          <strong>Original Price:</strong> R{sale.originalPrice.toLocaleString()}
                        </div>
                        <div>
                          <strong>Sale Price:</strong> R{sale.salePrice.toLocaleString()}
                        </div>
                        <div>
                          <strong>Payment:</strong> {sale.paymentMethod}
                        </div>
                        <div>
                          <strong>Delivery:</strong> {sale.deliveryMethod}
                        </div>
                      </div>
                      {sale.notes && (
                        <div className="mt-2 text-sm text-neutral-900">
                          <strong>Notes:</strong> {sale.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(sale)}
                        className="p-2 text-black hover:text-neutral-900"
                        title="Edit sale"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                        title="Delete sale"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-neutral-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <ShoppingCart className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Sales Records</h3>
                <p className="text-neutral-900 mb-4">You haven&apos;t recorded any sales yet.</p>
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
                >
                  <Plus className="h-5 w-5" />
                  Record First Sale
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "sold-artworks" && (
          <div className="p-6">
            {soldArtworks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {soldArtworks.map((artwork) => (
                <div key={artwork.id} className="border border-neutral-200 rounded-xl overflow-hidden">
                  <img 
                    src={artwork.images[0]} 
                    alt={artwork.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold">{artwork.title}</h3>
                    <p className="text-sm text-neutral-900">{artwork.size}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <div><strong>Sold:</strong> {artwork.soldDate && new Date(artwork.soldDate).toLocaleDateString()}</div>
                      <div><strong>Price:</strong> R{artwork.soldPrice?.toLocaleString()}</div>
                      <div><strong>Customer:</strong> {artwork.customerName}</div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => markAsAvailable(artwork.id)}
                        className="flex-1 px-3 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-lg"
                      >
                        Mark Available
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-neutral-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Palette className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Sold Artworks</h3>
                <p className="text-neutral-900 mb-4">You haven&apos;t sold any artworks yet.</p>
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
                >
                  <Plus className="h-5 w-5" />
                  Record Sale
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sale Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingSale ? "Edit Sale" : "Record New Sale"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Artwork</label>
                    <select
                      value={formData.artworkId}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, artworkId: e.target.value }));
                        const artwork = availableArtworks.find(a => a.id === e.target.value);
                        if (artwork) {
                          setFormData(prev => ({ ...prev, salePrice: artwork.price.toString() }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                      disabled={!!editingSale}
                    >
                      <option value="">Select artwork</option>
                      {availableArtworks.map((artwork) => (
                        <option key={artwork.id} value={artwork.id}>
                          {artwork.title} - R{artwork.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sale Date</label>
                    <input
                      type="date"
                      value={formData.saleDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, saleDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Customer Name</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                      placeholder="Customer full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Customer Email</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                      placeholder="customer@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Customer Phone</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                      placeholder="+27 XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Sale Price (ZAR)</label>
                    <input
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Card Payment">Card Payment</option>
                      <option value="Cash">Cash</option>
                      <option value="PayFast">PayFast</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Method</label>
                    <select
                      value={formData.deliveryMethod}
                      onChange={(e) => setFormData(prev => ({ ...prev, deliveryMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="Collection">Collection</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Courier">Courier</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Additional notes about the sale..."
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none text-black placeholder:text-black"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
                >
                  <Save className="h-5 w-5" />
                  {editingSale ? "Update" : "Record"} Sale
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContentEditor() {
  const [content, setContent] = useState<Content>(getContent());
  const [activeTab, setActiveTab] = useState<"gallery" | "about" | "contact">("gallery");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load from API first, fallback to localStorage
    const loadData = async () => {
      try {
        const apiContent = await getContentFromAPI();
        setContent(apiContent);
      } catch (error) {
        setContent(getContent());
      }
    };
    
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await saveContentWithSync(content);
      setHasChanges(false);
      alert("Content saved successfully!");
    } catch (error) {
      console.error('Error saving content:', error);
      alert("Error saving content. Please try again.");
    }
  };

  const updateContent = (newContent: Content) => {
    setContent(newContent);
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            hasChanges 
              ? "bg-neutral-900 text-white hover:bg-neutral-800" 
              : "bg-neutral-200 text-black cursor-not-allowed"
          }`}
        >
          <Save className="h-5 w-5" />
          {hasChanges ? "Save Changes" : "No Changes"}
        </button>
      </div>

      <div className="flex gap-2 border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-4 py-2 font-medium ${
            activeTab === "gallery" 
              ? "text-neutral-900 border-b-2 border-neutral-900" 
              : "text-black hover:text-neutral-800"
          }`}
        >
          Gallery Section
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2 font-medium ${
            activeTab === "about" 
              ? "text-neutral-900 border-b-2 border-neutral-900" 
              : "text-black hover:text-neutral-800"
          }`}
        >
          About Section
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`px-4 py-2 font-medium ${
            activeTab === "contact" 
              ? "text-neutral-900 border-b-2 border-neutral-900" 
              : "text-black hover:text-neutral-800"
          }`}
        >
          Contact Section
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5">
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Gallery Section</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <input
                type="text"
                value={content.gallery.title}
                onChange={(e) => {
                  setContent(prev => ({
                    ...prev,
                    gallery: { ...prev.gallery, title: e.target.value }
                  }));
                  setHasChanges(true);
                }}
                placeholder="Gallery"
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gallery Description</label>
              <textarea
                value={content.gallery.description}
                onChange={(e) => {
                  setContent(prev => ({
                    ...prev,
                    gallery: { ...prev.gallery, description: e.target.value }
                  }));
                  setHasChanges(true);
                }}
                rows={3}
                placeholder="Mixed order of sold & available works as requested. Use the filters to browse."
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none text-black placeholder:text-black"
              />
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">About Section</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={content.about.subtitle}
                  onChange={(e) => updateContent({
                    ...content,
                    about: { ...content.about, subtitle: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) => updateContent({
                    ...content,
                    about: { ...content.about, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={content.about.description}
                onChange={(e) => updateContent({
                  ...content,
                  about: { ...content.about, description: e.target.value }
                })}
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                rows={8}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Artist Image</label>
              <div className="space-y-4">
                {content.about.artistImage && (
                  <div className="relative w-full max-w-md">
                    <img 
                      src={content.about.artistImage} 
                      alt={content.about.title}
                      className="w-full h-48 object-cover rounded-xl border border-neutral-200"
                    />
                    <button
                      onClick={() => updateContent({
                        ...content,
                        about: { ...content.about, artistImage: "" }
                      })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {!content.about.artistImage && (
                  <ImageUpload 
                    images={[]}
                    onChange={(images) => {
                      if (images.length > 0) {
                        updateContent({
                          ...content,
                          about: { ...content.about, artistImage: images[0] }
                        });
                      }
                    }}
                  />
                )}
                {content.about.artistImage && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateContent({
                        ...content,
                        about: { ...content.about, artistImage: "" }
                      })}
                      className="px-4 py-2 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-sm"
                    >
                      Change Image
                    </button>
                  </div>
                )}
                <div className="text-sm text-neutral-900">
                  Upload an image of the artist. This will appear in the About section.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Section</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={content.contact.title}
                  onChange={(e) => updateContent({
                    ...content,
                    contact: { ...content.contact, title: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="text"
                  value={content.contact.phone}
                  onChange={(e) => updateContent({
                    ...content,
                    contact: { ...content.contact, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) => updateContent({
                    ...content,
                    contact: { ...content.contact, email: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Instagram</label>
                <input
                  type="text"
                  value={content.contact.instagram}
                  onChange={(e) => updateContent({
                    ...content,
                    contact: { ...content.contact, instagram: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={content.contact.description}
                onChange={(e) => updateContent({
                  ...content,
                  contact: { ...content.contact, description: e.target.value }
                })}
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                rows={4}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ImageUpload({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const newImages: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }
      
      if (file.size > 25 * 1024 * 1024) { // 25MB limit
        alert(`${file.name} is larger than 25MB. Please optimize your image or use a smaller file.`);
        continue;
      }

      // Upload to server
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        if (result.success && result.url) {
          newImages.push(result.url);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert(`Error uploading ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    setUploading(false);
    onChange([...images, ...newImages]);
  };


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragActive 
            ? "border-neutral-900 bg-neutral-50" 
            : "border-neutral-300 hover:border-neutral-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
            <span className="ml-2">Uploading...</span>
          </div>
        ) : (
          <>
            <Upload className="h-12 w-12 text-black mx-auto mb-2" />
            <p className="text-sm text-neutral-900">
              {dragActive ? "Drop images here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-black mt-1">
              Support: JPG, PNG, WEBP (Max 25MB each)
            </p>
          </>
        )}
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img 
                src={image} 
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-neutral-200"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="text-sm text-black">
          {images.length} image{images.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
}

function ArtworksManager({ quickAction }: { quickAction?: string | null }) {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    // Load from API first, fallback to localStorage
    const loadData = async () => {
      try {
        const apiArtworks = await getArtworksFromAPI();
        setArtworks(apiArtworks);
      } catch (error) {
        setArtworks(getArtworks());
      }
    };
    
    loadData();
  }, []);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  // Handle quick actions from overview
  useEffect(() => {
    if (quickAction === "add-artwork" || quickAction === "upload-images") {
      openModal(); // Opens the add artwork modal
    }
  }, [quickAction]);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    size: "",
    medium: "",
    category: "Paintings",
    status: "available",
    images: [] as string[]
  });

  const openModal = (artwork?: Artwork) => {
    if (artwork) {
      setEditingArtwork(artwork);
      setFormData({
        title: artwork.title,
        price: artwork.price.toString(),
        size: artwork.size,
        medium: artwork.medium,
        category: artwork.category,
        status: artwork.status,
        images: artwork.images
      });
    } else {
      setEditingArtwork(null);
      setFormData({
        title: "",
        price: "",
        size: "",
        medium: "",
        category: "Paintings",
        status: "available",
        images: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const artworkData = {
      id: editingArtwork?.id || `w${Date.now()}`,
      title: formData.title,
      price: parseInt(formData.price),
      size: formData.size,
      medium: formData.medium,
      category: formData.category,
      status: formData.status,
      images: formData.images.length > 0 ? formData.images : ["/images/placeholder.jpg"]
    };

    if (editingArtwork) {
      await updateArtworkWithSync(editingArtwork.id, artworkData);
      setArtworks(prev => prev.map(a => a.id === editingArtwork.id ? artworkData : a));
    } else {
      await addArtworkWithSync(artworkData);
      setArtworks(prev => [...prev, artworkData]);
    }
    
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this artwork?")) {
      await deleteArtworkWithSync(id);
      setArtworks(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Artwork Management</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
        >
          <Plus className="h-5 w-5" />
          Add Artwork
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5">
            <div className="relative">
              <img 
                src={artwork.images[0]} 
                alt={artwork.title}
                className="h-48 w-full object-cover"
              />
              <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold ${
                artwork.status === "available" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {artwork.status.toUpperCase()}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{artwork.title}</h3>
              <p className="text-sm text-neutral-900">{artwork.size} • {artwork.medium}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-semibold">R{artwork.price.toLocaleString()}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(artwork)}
                    className="p-2 text-black hover:text-neutral-900"
                    title="Edit artwork"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  {artwork.status === "sold" && (
                    <button
                      onClick={async () => {
                        if (confirm("Mark this artwork as available again?")) {
                          const updatedArtwork = { ...artwork, status: "available" } as Artwork;
                          delete updatedArtwork.soldDate;
                          delete updatedArtwork.soldPrice;
                          delete updatedArtwork.customerName;
                          delete updatedArtwork.customerEmail;
                          delete updatedArtwork.saleNotes;
                          await updateArtworkWithSync(artwork.id, updatedArtwork);
                          setArtworks(prev => prev.map(a => a.id === artwork.id ? updatedArtwork : a));
                        }
                      }}
                      className="p-2 text-green-600 hover:text-green-800"
                      title="Mark as available"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(artwork.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Delete artwork"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">
                  {editingArtwork ? "Edit Artwork" : "Add New Artwork"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter artwork title"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price (ZAR)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Size</label>
                    <input
                      type="text"
                      value={formData.size}
                      onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                      placeholder="e.g., 80 × 80 cm"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    >
                      <option value="Paintings">Paintings</option>
                      <option value="Mixed Media">Mixed Media</option>
                      <option value="Pottery">Pottery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Medium</label>
                  <input
                    type="text"
                    value={formData.medium}
                    onChange={(e) => setFormData(prev => ({ ...prev, medium: e.target.value }))}
                    placeholder="e.g., Acrylic with gold leaf on canvas"
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <ImageUpload 
                    images={formData.images}
                    onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
                >
                  <Save className="h-5 w-5" />
                  {editingArtwork ? "Update" : "Create"} Artwork
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


function MessagesManager() {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all');

  useEffect(() => {
    setContacts(getContacts());
    
    // Listen for new contact messages
    const handleContactsChange = (e: StorageEvent) => {
      if (e.key === 'bekker-contacts' && e.newValue) {
        try {
          setContacts(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating contacts from storage:', error);
        }
      }
    };

    const handleCustomContactsChange = () => {
      setContacts(getContacts());
    };

    window.addEventListener('storage', handleContactsChange);
    window.addEventListener('contacts-updated', handleCustomContactsChange);
    
    return () => {
      window.removeEventListener('storage', handleContactsChange);
      window.removeEventListener('contacts-updated', handleCustomContactsChange);
    };
  }, []);

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  const handleSelectMessage = (contact: ContactMessage) => {
    setSelectedMessage(contact);
    if (contact.status === 'new') {
      markContactAsRead(contact.id);
      setContacts(prev => prev.map(c => 
        c.id === contact.id ? { ...c, status: 'read' as const } : c
      ));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteContactMessage(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleArchive = (id: string) => {
    updateContactMessage(id, { status: 'archived' });
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'archived' as const } : c
    ));
    if (selectedMessage?.id === id) {
      setSelectedMessage(prev => prev ? { ...prev, status: 'archived' as const } : null);
    }
  };

  const getStatusColor = (status: ContactMessage['status']) => {
    switch (status) {
      case 'new': return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'read': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'archived': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400';
    }
  };

  const getTypeIcon = (type: ContactMessage['type']) => {
    return type === 'purchase_inquiry' ? ShoppingCart : Mail;
  };

  const newMessagesCount = contacts.filter(c => c.status === 'new').length;

  return (
    <div className="flex h-full">
      {/* Messages List */}
      <div className="w-1/3 border-r border-neutral-200 dark:border-neutral-700">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Messages</h1>
            {newMessagesCount > 0 && (
              <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                {newMessagesCount} new
              </span>
            )}
          </div>
          
          <div className="flex gap-1">
            {(['all', 'new', 'read', 'archived'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filter === status
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-black dark:text-black hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {status} {status !== 'all' && `(${contacts.filter(c => c.status === status).length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-black dark:text-black">
              <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No messages found</p>
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const TypeIcon = getTypeIcon(contact.type);
              return (
                <div
                  key={contact.id}
                  onClick={() => handleSelectMessage(contact)}
                  className={`p-4 border-b border-neutral-100 dark:border-neutral-800 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 ${
                    selectedMessage?.id === contact.id ? 'bg-neutral-100 dark:bg-neutral-900' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-black" />
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    <span className="text-xs text-black">
                      {formatDate(contact.timestamp)}
                    </span>
                  </div>
                  <h3 className={`font-medium mb-1 ${contact.status === 'new' ? 'font-bold' : ''} text-neutral-900 dark:text-white`}>
                    {contact.name}
                  </h3>
                  <p className="text-sm text-black dark:text-black mb-1">{contact.email}</p>
                  <p className="text-sm text-black dark:text-black line-clamp-2">
                    {contact.message.length > 80 ? `${contact.message.substring(0, 80)}...` : contact.message}
                  </p>
                  {contact.type === 'purchase_inquiry' && contact.totalAmount && (
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                      Purchase inquiry: {formatCurrency(contact.totalAmount)}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="flex-1">
        {selectedMessage ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{selectedMessage.name}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedMessage.status)}`}>
                      {selectedMessage.status}
                    </span>
                    {selectedMessage.type === 'purchase_inquiry' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                        Purchase Inquiry
                      </span>
                    )}
                  </div>
                  <div className="text-black dark:text-black">
                    <p>{selectedMessage.email}</p>
                    {selectedMessage.phone && <p>{selectedMessage.phone}</p>}
                    <p className="text-sm">{formatDate(selectedMessage.timestamp)} at {new Date(selectedMessage.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleArchive(selectedMessage.id)}
                    className="px-3 py-1.5 rounded-lg text-sm border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="px-3 py-1.5 rounded-lg text-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Message</h3>
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4">
                  <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Purchase Inquiry Details */}
              {selectedMessage.type === 'purchase_inquiry' && (
                <div className="mb-6">
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">Purchase Details</h3>
                  <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 space-y-2">
                    {selectedMessage.totalAmount && (
                      <p><span className="font-medium">Total Amount:</span> {formatCurrency(selectedMessage.totalAmount)}</p>
                    )}
                    {selectedMessage.deliveryPreference && (
                      <p><span className="font-medium">Delivery:</span> {selectedMessage.deliveryPreference}</p>
                    )}
                    {selectedMessage.artworkIds && selectedMessage.artworkIds.length > 0 && (
                      <p><span className="font-medium">Artworks:</span> {selectedMessage.artworkIds.length} item{selectedMessage.artworkIds.length === 1 ? '' : 's'}</p>
                    )}
                    {selectedMessage.specialRequests && (
                      <p><span className="font-medium">Special Requests:</span> {selectedMessage.specialRequests}</p>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Contact Info for Email Response */}
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
              <h3 className="font-medium text-neutral-900 dark:text-white mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-black" />
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.type === 'purchase_inquiry' ? 'Purchase Inquiry' : 'Contact Form'}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-black" />
                    <a 
                      href={`tel:${selectedMessage.phone}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>
              <p className="text-xs text-black mt-3">
                Click the email or phone to respond using your default applications.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-black dark:text-black">
            <div className="text-center">
              <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CollageManager() {
  const [collage, setCollage] = useState<Collage>(getCollage());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load from API first, fallback to localStorage
    const loadData = async () => {
      try {
        const apiCollage = await getCollageFromAPI();
        setCollage(apiCollage);
      } catch (error) {
        setCollage(getCollage());
      }
    };
    
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await saveCollageWithSync(collage);
      setHasChanges(false);
      alert("Collage updated successfully!");
    } catch (error) {
      console.error('Error saving collage:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error saving collage. Please try again.";
      
      alert(errorMessage);
    }
  };

  const updateCollage = (newCollage: Collage) => {
    setCollage(newCollage);
    setHasChanges(true);
  };

  const handleImageUpload = (images: string[]) => {
    if (images.length > 0) {
      const currentCount = collage.images.length;
      const maxImages = 12; // Reasonable limit for collage
      
      if (currentCount >= maxImages) {
        alert(`Maximum of ${maxImages} images allowed in collage gallery. Please remove some images first.`);
        return;
      }
      
      const availableSlots = maxImages - currentCount;
      const imagesToAdd = images.slice(0, availableSlots);
      
      if (images.length > availableSlots) {
        alert(`Only adding first ${availableSlots} image(s). Maximum of ${maxImages} images allowed.`);
      }
      
      const newImages = [...collage.images, ...imagesToAdd];
      updateCollage({ ...collage, images: newImages });
    }
  };

  const removeImage = (index: number) => {
    const newImages = collage.images.filter((_, i) => i !== index);
    updateCollage({ ...collage, images: newImages });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Collage Gallery Management</h2>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
            hasChanges 
              ? "bg-neutral-900 text-white hover:bg-neutral-800" 
              : "bg-neutral-200 text-black cursor-not-allowed"
          }`}
        >
          <Save className="h-5 w-5" />
          {hasChanges ? "Save Changes" : "No Changes"}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-black/5 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Section Title</label>
          <input
            type="text"
            value={collage.title}
            onChange={(e) => updateCollage({ ...collage, title: e.target.value })}
            placeholder="A glance at the work"
            className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 text-black placeholder:text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={collage.description}
            onChange={(e) => updateCollage({ ...collage, description: e.target.value })}
            rows={3}
            placeholder="A mosaic of recent paintings and ceramic pieces..."
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none text-black placeholder:text-black"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Gallery Images ({collage.images.length}/12)</label>
            {collage.images.length >= 10 && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                {12 - collage.images.length} slots remaining
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {collage.images.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Collage ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-xl border border-neutral-200"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>

          {collage.images.length < 12 ? (
            <>
              <ImageUpload 
                images={[]}
                onChange={handleImageUpload}
              />
              <div className="text-sm text-black mt-2">
                Upload images for the collage gallery. Images will be displayed in a mosaic grid on the homepage.
              </div>
            </>
          ) : (
            <div className="text-center py-8 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200">
              <div className="text-black mb-2">✅ Maximum images reached (12/12)</div>
              <div className="text-sm text-black">Remove some images to add new ones</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsManager() {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setSettings(getSettings());
    
    // Listen for settings changes
    const handleSettingsChange = (e: StorageEvent) => {
      if (e.key === 'bekker-settings' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating settings from storage:', error);
        }
      }
    };

    const handleCustomSettingsChange = (e: CustomEvent<AppSettings>) => {
      setSettings(e.detail);
    };

    window.addEventListener('storage', handleSettingsChange);
    window.addEventListener('settings-updated', handleCustomSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleSettingsChange);
      window.removeEventListener('settings-updated', handleCustomSettingsChange as EventListener);
    };
  }, []);

  const handleSettingChange = async <K extends keyof AppSettings>(
    key: K, 
    value: AppSettings[K]
  ) => {
    setIsSaving(true);
    try {
      updateSetting(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (error) {
      console.error('Error saving setting:', error);
      setSaveMessage('Error saving settings');
      setTimeout(() => setSaveMessage(''), 2000);
    }
    setIsSaving(false);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
      const defaultSettings = getSettings(); // This will return defaults if no stored settings
      localStorage.removeItem('bekker-settings');
      setSettings(defaultSettings);
      saveSettings(defaultSettings);
      setSaveMessage('Settings reset to defaults');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `bekker-settings-${formatDate(new Date())}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const ThemeIcon = settings.theme === 'dark' ? Moon : settings.theme === 'light' ? Sun : Monitor;

  return (
    <div className="p-4 lg:p-6 max-w-4xl w-full">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
            <p className="text-neutral-900 dark:text-black mt-1">
              Configure your application preferences and behavior
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={exportSettings}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={resetToDefaults}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium text-red-600 dark:text-red-400 w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Reset to Defaults
            </button>
          </div>
        </div>
        
        {saveMessage && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${
            saveMessage.includes('Error') 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' 
              : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
          }`}>
            {saveMessage}
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Appearance Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Sliders className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Appearance</h2>
          </div>

          {/* Theme Setting */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Theme</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  Choose your preferred color theme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeIcon className="h-4 w-4 text-black dark:text-black" />
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value as AppSettings['theme'])}
                  className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>

            {/* Compact View */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Compact View</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  Use more condensed layouts and smaller elements
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('compactView', !settings.compactView)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                style={{
                  backgroundColor: settings.compactView ? '#3b82f6' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.compactView ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Show Descriptions */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Show Descriptions</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  Display detailed descriptions and help text
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('showDescriptions', !settings.showDescriptions)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                style={{
                  backgroundColor: settings.showDescriptions ? '#3b82f6' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showDescriptions ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Behavior Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Behavior</h2>
          </div>

          <div className="space-y-4">
            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Auto Save</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  Automatically save changes as you work
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                style={{
                  backgroundColor: settings.autoSave ? '#3b82f6' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Activity Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Activity Notifications</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  Show notifications for new activities and updates
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('activityNotifications', !settings.activityNotifications)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                style={{
                  backgroundColor: settings.activityNotifications ? '#3b82f6' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.activityNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Backup Reminder */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Backup Reminders</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  Show periodic reminders to backup your data
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('backupReminder', !settings.backupReminder)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                style={{
                  backgroundColor: settings.backupReminder ? '#3b82f6' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.backupReminder ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Debug Mode */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Debug Mode</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  Show additional debugging information in console
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('debugMode', !settings.debugMode)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
                style={{
                  backgroundColor: settings.debugMode ? '#3b82f6' : '#d1d5db'
                }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.debugMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Data & Storage Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Data & Storage</h2>
          </div>

          <div className="space-y-4">
            {/* Max Image Size */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Max Image Size</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  Maximum file size for uploaded images
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={settings.maxImageSize}
                  onChange={(e) => handleSettingChange('maxImageSize', parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm font-medium text-neutral-900 dark:text-white w-12">
                  {settings.maxImageSize}MB
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Localization Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Localization</h2>
          </div>

          <div className="space-y-4">
            {/* Currency */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Currency</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  Default currency for pricing display
                </p>
              </div>
              <select
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value as AppSettings['currency'])}
                className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
              >
                <option value="ZAR">ZAR - South African Rand</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            {/* Date Format */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-neutral-900 dark:text-white">Date Format</label>
                <p className="text-xs text-black dark:text-black mt-1">
                  How dates are displayed throughout the app
                </p>
              </div>
              <select
                value={settings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value as AppSettings['dateFormat'])}
                className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileHeader({ activeSection, onMenuToggle }: {
  activeSection: ActiveSection;
  onMenuToggle: () => void;
}) {
  const getSectionTitle = (section: ActiveSection) => {
    const titles = {
      overview: "Overview",
      artworks: "Artworks", 
      sales: "Sales",
      messages: "Messages",
      hero: "Hero Slider",
      collage: "Collage Gallery",
      content: "Content",
      users: "Users",
      settings: "Settings"
    };
    return titles[section];
  };

  return (
    <div className="lg:hidden bg-white border-b border-neutral-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-lg font-bold text-neutral-900">Bekker Fine Art</h1>
          <p className="text-sm text-neutral-900">{getSectionTitle(activeSection)}</p>
        </div>
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg hover:bg-neutral-100 text-black"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("overview");
  const [quickAction, setQuickAction] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Clear quick action after section change to prevent repeated triggering
  useEffect(() => {
    if (quickAction && activeSection !== "overview") {
      const timer = setTimeout(() => setQuickAction(null), 100);
      return () => clearTimeout(timer);
    }
  }, [activeSection, quickAction]);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <Overview 
          onSectionChange={setActiveSection} 
          onQuickAction={setQuickAction}
        />;
      case "artworks":
        return <ArtworksManager quickAction={quickAction} />;
      case "sales":
        return <SalesManager quickAction={quickAction} />;
      case "messages":
        return <MessagesManager />;
      case "hero":
        return <HeroSliderManager />;
      case "collage":
        return <CollageManager />;
      case "content":
        return <ContentEditor />;
      case "users":
        return <div className="text-center text-neutral-900 py-20">User management coming soon...</div>;
      case "settings":
        return <SettingsManager />;
      default:
        return <Overview onSectionChange={setActiveSection} onQuickAction={setQuickAction} />;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-neutral-50">
        <MobileHeader 
          activeSection={activeSection} 
          onMenuToggle={() => setIsSidebarOpen(true)} 
        />
        <div className="flex">
          <Sidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 p-4 lg:p-8 overflow-auto lg:ml-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}