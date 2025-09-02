// Shared artwork data store
export const INITIAL_ARTWORKS = [
  {
    id: "w001",
    title: "The Light is Gold",
    price: 23500,
    size: "80 × 80 cm",
    medium: "Acrylic with gold leaf on canvas",
    status: "available",
    category: "Paintings",
    images: ["/images/WhatsApp Image 2025-07-15 at 13.38.43 (1).jpeg"],
  },
  {
    id: "w002",
    title: "Quiet Strength",
    price: 17000,
    size: "75 × 60 cm",
    medium: "Oil on canvas",
    status: "sold",
    category: "Paintings",
    images: ["/images/WhatsApp Image 2025-07-15 at 13.41.05.jpeg"],
    soldDate: "2024-12-15",
    soldPrice: 17000,
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    saleNotes: "Purchased with premium frame",
  },
  {
    id: "w003",
    title: "Ocean Dreams",
    price: 19500,
    size: "90 × 70 cm",
    medium: "Mixed media on canvas",
    status: "sold",
    category: "Mixed Media",
    images: ["/images/WhatsApp Image 2025-07-15 at 13.43.37.jpeg"],
    soldDate: "2024-11-28",
    soldPrice: 20500,
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@gmail.com",
    saleNotes: "Commissioned piece, includes custom frame",
  },
];

export type Artwork = typeof INITIAL_ARTWORKS[0] & {
  soldDate?: string;
  soldPrice?: number;
  customerName?: string;
  customerEmail?: string;
  saleNotes?: string;
};

// Activity tracking system
export type Activity = {
  id: string;
  type: 'artwork_added' | 'artwork_updated' | 'artwork_sold' | 'sale_added' | 'contact_received' | 'content_updated' | 'payment_initiated';
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
};

// Settings system
export type AppSettings = {
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  showDescriptions: boolean;
  activityNotifications: boolean;
  compactView: boolean;
  debugMode: boolean;
  backupReminder: boolean;
  maxImageSize: number; // in MB
  currency: 'ZAR' | 'USD' | 'EUR' | 'GBP';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
};

// Contact management system
export type ContactMessage = {
  id: string;
  type: 'general' | 'purchase_inquiry';
  name: string;
  email: string;
  phone?: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'archived';
  // Purchase inquiry specific fields
  artworkIds?: string[];
  totalAmount?: number;
  deliveryPreference?: string;
  specialRequests?: string;
};

// Local storage keys
const ARTWORKS_KEY = 'bekker-artworks';
const HERO_SLIDES_KEY = 'bekker-hero-slides';
const CONTENT_KEY = 'bekker-content';
const SALES_KEY = 'bekker-sales';
const COLLAGE_KEY = 'bekker-collage';
const ACTIVITIES_KEY = 'bekker-activities';
const SETTINGS_KEY = 'bekker-settings';
const CONTACTS_KEY = 'bekker-contacts';
const MAX_ACTIVITIES = 50;

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  autoSave: true,
  showDescriptions: true,
  activityNotifications: true,
  compactView: false,
  debugMode: false,
  backupReminder: true,
  maxImageSize: 25,
  currency: 'ZAR',
  dateFormat: 'DD/MM/YYYY'
};

// Settings management functions
export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const settings = JSON.parse(stored);
      // Merge with defaults to ensure new settings are included
      return { ...DEFAULT_SETTINGS, ...settings };
    }
  } catch (error) {
    console.error('Error loading settings from localStorage:', error);
  }
  
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    
    // Dispatch storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: SETTINGS_KEY,
      newValue: JSON.stringify(settings)
    }));
    
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('settings-updated', { detail: settings }));
    
    // Apply theme immediately
    applyTheme(settings.theme);
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
  }
}

export function updateSetting<K extends keyof AppSettings>(
  key: K, 
  value: AppSettings[K]
): void {
  const currentSettings = getSettings();
  const updatedSettings = { ...currentSettings, [key]: value };
  saveSettings(updatedSettings);
}

// Theme management
export function applyTheme(theme: AppSettings['theme']): void {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? 'dark' : 'light';
  }
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

// Initialize theme on load
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;
  
  const settings = getSettings();
  applyTheme(settings.theme);
  
  // Listen for system theme changes when using auto mode
  if (settings.theme === 'auto') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      applyTheme('auto');
    });
  }
}

// Currency formatting with settings
export function formatCurrency(amount: number, currency?: AppSettings['currency']): string {
  const settings = getSettings();
  const currencyCode = currency || settings.currency;
  
  const formatOptions: { [key: string]: { style: 'currency'; currency: string; locale: string } } = {
    ZAR: { style: 'currency', currency: 'ZAR', locale: 'en-ZA' },
    USD: { style: 'currency', currency: 'USD', locale: 'en-US' },
    EUR: { style: 'currency', currency: 'EUR', locale: 'en-EU' },
    GBP: { style: 'currency', currency: 'GBP', locale: 'en-GB' }
  };
  
  const options = formatOptions[currencyCode] || formatOptions.ZAR;
  
  return new Intl.NumberFormat(options.locale, {
    style: options.style,
    currency: options.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Date formatting with settings
export function formatDate(date: string | Date, format?: AppSettings['dateFormat']): string {
  const settings = getSettings();
  const dateFormat = format || settings.dateFormat;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  switch (dateFormat) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`;
  }
}

// Contact management functions
export function getContacts(): ContactMessage[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CONTACTS_KEY);
    if (stored) {
      const contacts = JSON.parse(stored);
      // Sort by timestamp (newest first)
      return contacts.sort((a: ContactMessage, b: ContactMessage) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
  } catch (error) {
    console.error('Error loading contacts from localStorage:', error);
  }
  
  return [];
}

export function saveContacts(contacts: ContactMessage[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    
    // Dispatch storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: CONTACTS_KEY,
      newValue: JSON.stringify(contacts)
    }));
    
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('contacts-updated'));
  } catch (error) {
    console.error('Error saving contacts to localStorage:', error);
  }
}

export function addContactMessage(message: Omit<ContactMessage, 'id' | 'timestamp' | 'status'>): ContactMessage {
  const newMessage: ContactMessage = {
    ...message,
    id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    status: 'new'
  };
  
  const contacts = getContacts();
  const updatedContacts = [newMessage, ...contacts];
  saveContacts(updatedContacts);
  
  return newMessage;
}

export function updateContactMessage(id: string, updates: Partial<ContactMessage>): void {
  const contacts = getContacts();
  const updatedContacts = contacts.map(contact => 
    contact.id === id ? { ...contact, ...updates } : contact
  );
  saveContacts(updatedContacts);
}

export function deleteContactMessage(id: string): void {
  const contacts = getContacts();
  const updatedContacts = contacts.filter(contact => contact.id !== id);
  saveContacts(updatedContacts);
}

export function markContactAsRead(id: string): void {
  updateContactMessage(id, { status: 'read' });
}

// Activity helper functions
function saveActivities(activities: Activity[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Keep only the most recent activities
    const limitedActivities = activities.slice(0, MAX_ACTIVITIES);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(limitedActivities));
    
    // Dispatch storage event for real-time updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: ACTIVITIES_KEY,
      newValue: JSON.stringify(limitedActivities)
    }));
    
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('activities-updated'));
  } catch (error) {
    console.error('Error saving activities to localStorage:', error);
  }
}

// Add new activity
export function addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): void {
  const newActivity: Activity = {
    ...activity,
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };
  
  const activities = getActivities();
  const updatedActivities = [newActivity, ...activities];
  saveActivities(updatedActivities);
}

// Get activities from localStorage
export function getActivities(): Activity[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(ACTIVITIES_KEY);
    if (stored) {
      const activities = JSON.parse(stored);
      // Sort by timestamp (newest first)
      return activities.sort((a: Activity, b: Activity) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }
  } catch (error) {
    console.error('Error loading activities from localStorage:', error);
  }
  
  return [];
}

// Get formatted time ago string
export function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

// Get artworks from API or localStorage fallback
export async function getArtworksFromAPI(): Promise<Artwork[]> {
  try {
    const response = await fetch('/api/artworks');
    if (response.ok) {
      const artworks = await response.json();
      // Cache in localStorage for offline access
      if (typeof window !== 'undefined') {
        localStorage.setItem(ARTWORKS_KEY, JSON.stringify(artworks));
      }
      return artworks;
    }
  } catch (error) {
    console.error('Error fetching artworks from API:', error);
  }
  
  // Fallback to localStorage
  return getArtworks();
}

// Get artworks from localStorage or return defaults (synchronous fallback)
export function getArtworks(): Artwork[] {
  if (typeof window === 'undefined') return INITIAL_ARTWORKS;
  
  try {
    const stored = localStorage.getItem(ARTWORKS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading artworks from localStorage:', error);
  }
  
  return INITIAL_ARTWORKS;
}

// Save artworks to localStorage
export function saveArtworks(artworks: Artwork[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(ARTWORKS_KEY, JSON.stringify(artworks));
    // Trigger storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: ARTWORKS_KEY,
      newValue: JSON.stringify(artworks)
    }));
  } catch (error) {
    console.error('Error saving artworks to localStorage:', error);
  }
}

// Add new artwork (with API sync)
export async function addArtworkWithSync(artwork: Artwork): Promise<void> {
  try {
    // Save to API first
    const response = await fetch('/api/artworks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(artwork),
    });
    
    if (response.ok) {
      // Update localStorage
      const artworks = getArtworks();
      const newArtworks = [...artworks, artwork];
      saveArtworks(newArtworks);
    } else {
      throw new Error('Failed to save to API');
    }
  } catch (error) {
    console.error('Error syncing artwork:', error);
    // Fallback to localStorage only
    addArtwork(artwork);
  }
  
  // Add activity
  addActivity({
    type: 'artwork_added',
    title: 'New artwork added',
    description: `"${artwork.title}" has been added to the gallery`,
    metadata: { artworkId: artwork.id, artworkTitle: artwork.title }
  });
}

// Add new artwork (localStorage only - for backwards compatibility)
export function addArtwork(artwork: Artwork): void {
  const artworks = getArtworks();
  const newArtworks = [...artworks, artwork];
  saveArtworks(newArtworks);
  
  // Add activity
  addActivity({
    type: 'artwork_added',
    title: 'New artwork added',
    description: `"${artwork.title}" has been added to the gallery`,
    metadata: { artworkId: artwork.id, artworkTitle: artwork.title }
  });
}

// Update existing artwork (with API sync)
export async function updateArtworkWithSync(id: string, updatedArtwork: Artwork): Promise<void> {
  try {
    // Save to API first
    const response = await fetch('/api/artworks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedArtwork),
    });
    
    if (response.ok) {
      // Update localStorage
      updateArtwork(id, updatedArtwork);
    } else {
      throw new Error('Failed to update API');
    }
  } catch (error) {
    console.error('Error syncing artwork update:', error);
    // Fallback to localStorage only
    updateArtwork(id, updatedArtwork);
  }
}

// Update existing artwork (localStorage only - for backwards compatibility)
export function updateArtwork(id: string, updatedArtwork: Artwork): void {
  const artworks = getArtworks();
  const oldArtwork = artworks.find(a => a.id === id);
  const newArtworks = artworks.map(artwork => 
    artwork.id === id ? updatedArtwork : artwork
  );
  saveArtworks(newArtworks);
  
  // Add activity if status changed to sold
  if (oldArtwork && oldArtwork.status !== 'sold' && updatedArtwork.status === 'sold') {
    addActivity({
      type: 'artwork_sold',
      title: 'Artwork sold',
      description: `"${updatedArtwork.title}" has been sold`,
      metadata: { artworkId: updatedArtwork.id, artworkTitle: updatedArtwork.title, salePrice: updatedArtwork.soldPrice }
    });
  } else if (oldArtwork) {
    // General update activity
    addActivity({
      type: 'artwork_updated',
      title: 'Artwork updated',
      description: `"${updatedArtwork.title}" has been updated`,
      metadata: { artworkId: updatedArtwork.id, artworkTitle: updatedArtwork.title }
    });
  }
}

// Delete artwork
// Delete artwork (with API sync)
export async function deleteArtworkWithSync(id: string): Promise<void> {
  try {
    // Delete from API first
    const response = await fetch(`/api/artworks?id=${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      // Update localStorage
      deleteArtwork(id);
    } else {
      throw new Error('Failed to delete from API');
    }
  } catch (error) {
    console.error('Error syncing artwork deletion:', error);
    // Fallback to localStorage only
    deleteArtwork(id);
  }
}

// Delete artwork (localStorage only - for backwards compatibility)
export function deleteArtwork(id: string): void {
  const artworks = getArtworks();
  const newArtworks = artworks.filter(artwork => artwork.id !== id);
  saveArtworks(newArtworks);
}

// Reset artworks to initial state (fix corrupted data) - with API sync
export async function resetArtworksWithSync(): Promise<void> {
  try {
    // Reset via API first
    const response = await fetch('/api/artworks/reset', {
      method: 'POST',
    });
    
    if (response.ok) {
      // Clear localStorage and reload from API
      if (typeof window !== 'undefined') {
        localStorage.removeItem(ARTWORKS_KEY);
      }
      
      // Get fresh data from API
      await getArtworksFromAPI();
    } else {
      throw new Error('Failed to reset via API');
    }
  } catch (error) {
    console.error('Error resetting via API, falling back to localStorage:', error);
    // Fallback to localStorage reset
    resetArtworks();
  }
  
  addActivity({
    type: 'content_updated',
    title: 'Artworks reset',
    description: 'Artwork data has been reset to clean initial state across all browsers'
  });
}

// Reset artworks to initial state (localStorage only - for backwards compatibility)
export function resetArtworks(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(ARTWORKS_KEY);
    saveArtworks(INITIAL_ARTWORKS);
    
    addActivity({
      type: 'content_updated',
      title: 'Artworks reset',
      description: 'Artwork data has been reset to clean initial state'
    });
  } catch (error) {
    console.error('Error resetting artworks:', error);
  }
}

// Hero slides data
export const INITIAL_HERO_SLIDES = [
  {
    id: "h1",
    image: "/images/WhatsApp Image 2025-07-15 at 13.38.43 (1).jpeg",
    headline: "Bekker Fine Art",
    sub: "Contemporary abstract works & pottery — crafted with heart.",
    cta: "View Gallery",
    ctaLink: "#gallery",
  },
  {
    id: "h2",
    image: "/images/WhatsApp Image 2025-07-15 at 13.38.18.jpeg",
    headline: "Original Artwork",
    sub: "Each piece is a meditation on transformation and truth.",
    cta: "Explore Originals",
    ctaLink: "#gallery",
  },
];

export type HeroSlide = typeof INITIAL_HERO_SLIDES[0];

// Get hero slides from API or localStorage fallback
export async function getHeroSlidesFromAPI(): Promise<HeroSlide[]> {
  try {
    const response = await fetch('/api/hero-slides');
    if (response.ok) {
      const slides = await response.json();
      // Cache in localStorage for offline access
      if (typeof window !== 'undefined') {
        localStorage.setItem(HERO_SLIDES_KEY, JSON.stringify(slides));
      }
      return slides;
    }
  } catch (error) {
    console.error('Error fetching hero slides from API:', error);
  }
  
  // Fallback to localStorage
  return getHeroSlides();
}

// Get hero slides from localStorage or return defaults (synchronous fallback)
export function getHeroSlides(): HeroSlide[] {
  if (typeof window === 'undefined') return INITIAL_HERO_SLIDES;
  
  try {
    const stored = localStorage.getItem(HERO_SLIDES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading hero slides from localStorage:', error);
  }
  
  return INITIAL_HERO_SLIDES;
}

// Save hero slides with API sync
export async function saveHeroSlidesWithSync(slides: HeroSlide[]): Promise<void> {
  try {
    // Save to API first
    const response = await fetch('/api/hero-slides', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slides),
    });
    
    if (response.ok) {
      // Update localStorage
      saveHeroSlides(slides);
    } else {
      throw new Error('Failed to save to API');
    }
  } catch (error) {
    console.error('Error syncing hero slides:', error);
    // Fallback to localStorage only
    saveHeroSlides(slides);
  }
}

// Save hero slides to localStorage (backwards compatibility)
export function saveHeroSlides(slides: HeroSlide[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(HERO_SLIDES_KEY, JSON.stringify(slides));
    
    // Dispatch storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: HERO_SLIDES_KEY,
      newValue: JSON.stringify(slides)
    }));
    
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('hero-slides-updated'));
    
  } catch (error) {
    console.error('Error saving hero slides to localStorage:', error);
  }
}

// Content management
export const INITIAL_CONTENT = {
  gallery: {
    title: "Gallery",
    description: "Mixed order of sold & available works as requested. Use the filters to browse."
  },
  about: {
    title: "Stefan Bekker",
    subtitle: "Meet the Artist",
    description: "Award-winning chef Stefan Bekker escapes career stress through emotional art that speaks to our internal selves.\n\nWith years of experience crafting edible art, Stefan brings the same passion and attention to detail to his abstract works. Each piece is a meditation on transformation and the courage to start again.\n\nFrom the kitchen to the canvas, every creation tells a story of resilience, beauty, and the endless pursuit of authentic expression.",
    artistImage: "/images/stefan.jpeg"
  },
  contact: {
    title: "Get in touch",
    description: "For commissions, studio visits, or purchase enquiries, send a message. We aim to respond within 24 hours.",
    phone: "+27 11 083 9898",
    email: "info@bekkerfineart.co.za",
    instagram: "@bekkerfineart"
  }
};

export type Content = typeof INITIAL_CONTENT;

// Get content from API or localStorage fallback
export async function getContentFromAPI(): Promise<Content> {
  try {
    const response = await fetch('/api/content');
    if (response.ok) {
      const content = await response.json();
      // Cache in localStorage for offline access
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
      }
      return content;
    }
  } catch (error) {
    console.error('Error fetching content from API:', error);
  }
  
  // Fallback to localStorage
  return getContent();
}

// Get content from localStorage or return defaults (synchronous fallback)
export function getContent(): Content {
  if (typeof window === 'undefined') return INITIAL_CONTENT;
  
  try {
    const stored = localStorage.getItem(CONTENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading content from localStorage:', error);
  }
  
  return INITIAL_CONTENT;
}

// Save content with API sync
export async function saveContentWithSync(content: Content): Promise<void> {
  try {
    // Save to API first
    const response = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    
    if (response.ok) {
      // Update localStorage
      saveContent(content);
    } else {
      throw new Error('Failed to save to API');
    }
  } catch (error) {
    console.error('Error syncing content:', error);
    // Fallback to localStorage only
    saveContent(content);
  }
}

// Save content to localStorage (backwards compatibility)
export function saveContent(content: Content): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
    window.dispatchEvent(new StorageEvent('storage', {
      key: CONTENT_KEY,
      newValue: JSON.stringify(content)
    }));
  } catch (error) {
    console.error('Error saving content to localStorage:', error);
  }
}

// Collage section management
export const INITIAL_COLLAGE = {
  title: "A glance at the work",
  description: "A mosaic of recent paintings and ceramic pieces. Each work tells a story — arranged as a living collage.",
  images: [
    "/images/WhatsApp Image 2025-07-15 at 13.38.18.jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.38.43 (1).jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.41.05.jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.43.37.jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.53.01.jpeg",
    "/images/WhatsApp Image 2025-07-15 at 13.53.02.jpeg"
  ]
};

export type Collage = typeof INITIAL_COLLAGE;

// Get collage from localStorage or return defaults
export function getCollage(): Collage {
  if (typeof window === 'undefined') return INITIAL_COLLAGE;
  
  try {
    const stored = localStorage.getItem(COLLAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading collage from localStorage:', error);
  }
  
  return INITIAL_COLLAGE;
}

// Get collage from API or localStorage fallback
export async function getCollageFromAPI(): Promise<Collage> {
  try {
    const response = await fetch('/api/collage');
    if (response.ok) {
      const collage = await response.json();
      // Cache in localStorage for offline access
      if (typeof window !== 'undefined') {
        localStorage.setItem(COLLAGE_KEY, JSON.stringify(collage));
      }
      return collage;
    }
  } catch (error) {
    console.error('Error fetching collage from API:', error);
  }
  
  // Fallback to localStorage
  return getCollage();
}

// Save collage with API sync
export async function saveCollageWithSync(collage: Collage): Promise<void> {
  try {
    // Save to API first
    const response = await fetch('/api/collage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collage),
    });
    
    if (response.ok) {
      // Update localStorage
      saveCollage(collage);
    } else {
      throw new Error('Failed to save to API');
    }
  } catch (error) {
    console.error('Error syncing collage:', error);
    // Fallback to localStorage only
    saveCollage(collage);
  }
}

// Save collage to localStorage (backwards compatibility)
export function saveCollage(collage: Collage): void {
  if (typeof window === 'undefined') return;
  
  try {
    const collageData = JSON.stringify(collage);
    
    // Check approximate size (rough estimate)
    const sizeInMB = new Blob([collageData]).size / (1024 * 1024);
    
    if (sizeInMB > 8) { // Conservative limit
      throw new Error(`Collage data is too large (${sizeInMB.toFixed(1)}MB). Please reduce image sizes or quantity.`);
    }
    
    localStorage.setItem(COLLAGE_KEY, collageData);
    
    // Dispatch storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: COLLAGE_KEY,
      newValue: collageData
    }));
    
    // Dispatch custom event for same-tab communication
    window.dispatchEvent(new CustomEvent('collage-updated'));
    
  } catch (error) {
    console.error('Error saving collage to localStorage:', error);
    
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      throw new Error('Storage quota exceeded. Please reduce the number of images or compress them to smaller sizes.');
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Failed to save collage data.');
    }
  }
}

// Sales management
export const INITIAL_SALES = [
  {
    id: "sale001",
    artworkId: "w002",
    artworkTitle: "Quiet Strength",
    saleDate: "2024-12-15",
    originalPrice: 17000,
    salePrice: 17000,
    customerName: "John Smith",
    customerEmail: "john.smith@email.com",
    customerPhone: "+27 11 123 4567",
    paymentMethod: "Bank Transfer",
    deliveryMethod: "Collection",
    notes: "Purchased with premium frame",
    status: "completed"
  },
  {
    id: "sale002",
    artworkId: "w003",
    artworkTitle: "Ocean Dreams",
    saleDate: "2024-11-28",
    originalPrice: 19500,
    salePrice: 20500,
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@gmail.com",
    customerPhone: "+27 82 987 6543",
    paymentMethod: "Card Payment",
    deliveryMethod: "Delivery",
    notes: "Commissioned piece, includes custom frame",
    status: "completed"
  }
];

export type Sale = typeof INITIAL_SALES[0];

// Get sales from localStorage or return defaults
export function getSales(): Sale[] {
  if (typeof window === 'undefined') return INITIAL_SALES;
  
  try {
    const stored = localStorage.getItem(SALES_KEY);
    if (stored) {
      const sales = JSON.parse(stored);
      // Remove duplicates based on ID
      const uniqueSales = sales.filter((sale: Sale, index: number, arr: Sale[]) => 
        arr.findIndex(s => s.id === sale.id) === index
      );
      
      // If we found duplicates, save the cleaned data
      if (uniqueSales.length !== sales.length) {
        saveSales(uniqueSales);
      }
      
      return uniqueSales;
    }
  } catch (error) {
    console.error('Error loading sales from localStorage:', error);
  }
  
  return INITIAL_SALES;
}

// Save sales to localStorage with duplicate prevention
export function saveSales(sales: Sale[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Ensure no duplicates before saving
    const uniqueSales = sales.filter((sale, index, arr) => 
      arr.findIndex(s => s.id === sale.id) === index
    );
    
    localStorage.setItem(SALES_KEY, JSON.stringify(uniqueSales));
    window.dispatchEvent(new StorageEvent('storage', {
      key: SALES_KEY,
      newValue: JSON.stringify(uniqueSales)
    }));
  } catch (error) {
    console.error('Error saving sales to localStorage:', error);
  }
}

// Reset sales data with API sync
export async function resetSalesDataWithSync(): Promise<void> {
  try {
    // Reset via API first
    const response = await fetch('/api/sales/reset', {
      method: 'POST',
    });
    
    if (response.ok) {
      // Clear localStorage and reload from API
      if (typeof window !== 'undefined') {
        localStorage.removeItem(SALES_KEY);
      }
      
      // Get fresh data from API
      const apiResponse = await fetch('/api/sales');
      if (apiResponse.ok) {
        const sales = await apiResponse.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem(SALES_KEY, JSON.stringify(sales));
          window.dispatchEvent(new StorageEvent('storage', {
            key: SALES_KEY,
            newValue: JSON.stringify(sales)
          }));
        }
      }
    } else {
      throw new Error('Failed to reset via API');
    }
  } catch (error) {
    console.error('Error resetting via API, falling back to localStorage:', error);
    // Fallback to localStorage reset
    resetSalesData();
  }
}

// Reset sales data (for fixing duplicate issues) - backwards compatibility
export function resetSalesData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SALES_KEY);
    localStorage.setItem(SALES_KEY, JSON.stringify(INITIAL_SALES));
    window.dispatchEvent(new StorageEvent('storage', {
      key: SALES_KEY,
      newValue: JSON.stringify(INITIAL_SALES)
    }));
  } catch (error) {
    console.error('Error resetting sales data:', error);
  }
}

// Get sales from API or localStorage fallback
export async function getSalesFromAPI(): Promise<Sale[]> {
  try {
    const response = await fetch('/api/sales');
    if (response.ok) {
      const sales = await response.json();
      // Cache in localStorage for offline access
      if (typeof window !== 'undefined') {
        localStorage.setItem(SALES_KEY, JSON.stringify(sales));
      }
      return sales;
    }
  } catch (error) {
    console.error('Error fetching sales from API:', error);
  }
  
  // Fallback to localStorage
  return getSales();
}

// Add new sale (with API sync)
export async function addSaleWithSync(sale: Sale): Promise<void> {
  try {
    // Save to API first
    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    });
    
    if (response.ok) {
      // Update localStorage
      addSale(sale);
    } else {
      throw new Error('Failed to save to API');
    }
  } catch (error) {
    console.error('Error syncing sale:', error);
    // Fallback to localStorage only
    addSale(sale);
  }
}

// Add new sale (localStorage only - backwards compatibility)
export function addSale(sale: Sale): void {
  const sales = getSales();
  const newSales = [...sales, sale];
  saveSales(newSales);
}

// Update existing sale (with API sync)
export async function updateSaleWithSync(id: string, updatedSale: Sale): Promise<void> {
  try {
    // Save to API first
    const response = await fetch('/api/sales', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSale),
    });
    
    if (response.ok) {
      // Update localStorage
      updateSale(id, updatedSale);
    } else {
      throw new Error('Failed to update API');
    }
  } catch (error) {
    console.error('Error syncing sale update:', error);
    // Fallback to localStorage only
    updateSale(id, updatedSale);
  }
}

// Update existing sale (localStorage only - backwards compatibility)
export function updateSale(id: string, updatedSale: Sale): void {
  const sales = getSales();
  const newSales = sales.map(sale => 
    sale.id === id ? updatedSale : sale
  );
  saveSales(newSales);
}

// Delete sale (with API sync)
export async function deleteSaleWithSync(id: string): Promise<void> {
  try {
    // Delete from API first
    const response = await fetch(`/api/sales?id=${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      // Update localStorage
      deleteSale(id);
    } else {
      throw new Error('Failed to delete from API');
    }
  } catch (error) {
    console.error('Error syncing sale deletion:', error);
    // Fallback to localStorage only
    deleteSale(id);
  }
}

// Delete sale (localStorage only - backwards compatibility)
export function deleteSale(id: string): void {
  const sales = getSales();
  const newSales = sales.filter(sale => sale.id !== id);
  saveSales(newSales);
}

// Generate unique sale ID
function generateSaleId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `sale${timestamp}${random}`;
}

// Record a sale with API sync (combines artwork update and sale creation)
export async function recordSaleWithSync(saleData: Omit<Sale, 'id' | 'status'>): Promise<Sale> {
  const existingSales = getSales();
  let newId = generateSaleId();
  
  // Ensure ID is unique
  while (existingSales.some(s => s.id === newId)) {
    newId = generateSaleId();
  }
  
  const sale: Sale = {
    ...saleData,
    id: newId,
    status: "completed"
  };
  
  // Add to sales with sync
  await addSaleWithSync(sale);
  
  // Add activity for sale
  addActivity({
    type: 'sale_added',
    title: 'New sale recorded',
    description: `Sale of "${saleData.artworkTitle}" for ${new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(saleData.salePrice)}`,
    metadata: { saleId: sale.id, artworkTitle: saleData.artworkTitle, salePrice: saleData.salePrice }
  });
  
  // Update artwork status with sync
  const artworks = getArtworks();
  const artwork = artworks.find(a => a.id === saleData.artworkId);
  if (artwork) {
    const updatedArtwork: Artwork = {
      ...artwork,
      status: "sold",
      soldDate: saleData.saleDate,
      soldPrice: saleData.salePrice,
      customerName: saleData.customerName,
      customerEmail: saleData.customerEmail,
      saleNotes: saleData.notes
    };
    await updateArtworkWithSync(artwork.id, updatedArtwork);
  }
  
  return sale;
}

// Record a sale (combines artwork update and sale creation) - backwards compatibility
export function recordSale(saleData: Omit<Sale, 'id' | 'status'>): Sale {
  const existingSales = getSales();
  let newId = generateSaleId();
  
  // Ensure ID is unique
  while (existingSales.some(s => s.id === newId)) {
    newId = generateSaleId();
  }
  
  const sale: Sale = {
    ...saleData,
    id: newId,
    status: "completed"
  };
  
  // Add to sales
  addSale(sale);
  
  // Add activity for sale
  addActivity({
    type: 'sale_added',
    title: 'New sale recorded',
    description: `Sale of "${saleData.artworkTitle}" for ${new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(saleData.salePrice)}`,
    metadata: { saleId: sale.id, artworkTitle: saleData.artworkTitle, salePrice: saleData.salePrice }
  });
  
  // Update artwork status
  const artworks = getArtworks();
  const artwork = artworks.find(a => a.id === saleData.artworkId);
  if (artwork) {
    const updatedArtwork: Artwork = {
      ...artwork,
      status: "sold",
      soldDate: saleData.saleDate,
      soldPrice: saleData.salePrice,
      customerName: saleData.customerName,
      customerEmail: saleData.customerEmail,
      saleNotes: saleData.notes
    };
    updateArtwork(artwork.id, updatedArtwork);
  }
  
  return sale;
}

// Contacts sync functions
export async function getContactsFromAPI(): Promise<ContactMessage[]> {
  try {
    const response = await fetch('/api/contacts');
    if (response.ok) {
      const contacts = await response.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
      }
      return contacts;
    }
  } catch (error) {
    console.error('Error fetching contacts from API:', error);
  }
  
  return getContacts();
}

export async function markContactAsReadWithSync(id: string): Promise<void> {
  try {
    const contacts = getContacts();
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    
    const updatedContact = { ...contact, status: 'read' as const };
    
    const response = await fetch('/api/contacts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedContact),
    });
    
    if (response.ok) {
      markContactAsRead(id);
    } else {
      throw new Error('Failed to update API');
    }
  } catch (error) {
    console.error('Error syncing contact status:', error);
    markContactAsRead(id);
  }
}

export async function deleteContactMessageWithSync(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/contacts?id=${id}`, {
      method: 'DELETE',
    });
    
    if (response.ok) {
      deleteContactMessage(id);
    } else {
      throw new Error('Failed to delete from API');
    }
  } catch (error) {
    console.error('Error syncing contact deletion:', error);
    deleteContactMessage(id);
  }
}

// Settings sync functions  
export async function getSettingsFromAPI(): Promise<AppSettings> {
  try {
    const response = await fetch('/api/settings');
    if (response.ok) {
      const settings = await response.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      }
      return settings;
    }
  } catch (error) {
    console.error('Error fetching settings from API:', error);
  }
  
  return getSettings();
}

export async function saveSettingsWithSync(settings: AppSettings): Promise<void> {
  try {
    const response = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    
    if (response.ok) {
      saveSettings(settings);
    } else {
      throw new Error('Failed to save to API');
    }
  } catch (error) {
    console.error('Error syncing settings:', error);
    saveSettings(settings);
  }
}

export async function updateSettingWithSync<K extends keyof AppSettings>(
  key: K, 
  value: AppSettings[K]
): Promise<void> {
  const currentSettings = await getSettingsFromAPI();
  const updatedSettings = { ...currentSettings, [key]: value };
  await saveSettingsWithSync(updatedSettings);
}

// Update contact message (with API sync)
export async function updateContactMessageWithSync(id: string, updates: Partial<ContactMessage>): Promise<void> {
  try {
    const contacts = getContacts();
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    
    const updatedContact = { ...contact, ...updates };
    
    const response = await fetch('/api/contacts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedContact),
    });
    
    if (response.ok) {
      updateContactMessage(id, updates);
    } else {
      throw new Error('Failed to update API');
    }
  } catch (error) {
    console.error('Error syncing contact message update:', error);
    updateContactMessage(id, updates);
  }
}