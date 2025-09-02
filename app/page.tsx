"use client";
import React, { useEffect, useState } from "react";
import { ShoppingCart, Menu, X, Search, Phone, Mail, Instagram, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getArtworks, getArtworksFromAPI, getHeroSlides, getHeroSlidesFromAPI, getContent, getContentFromAPI, getCollage, getCollageFromAPI, addActivity, addContactMessage, formatCurrency, type Artwork, type HeroSlide, type Content, type Collage } from "../lib/artworks";

// -------------------------------------------------------------
// Bekker Fine Art — Single-file React page for Next.js (app/page.tsx)
// TailwindCSS recommended. Drop this file's default export into app/page.tsx
// or pages/index.tsx. Replace image URLs with Stefan's real images.
// -------------------------------------------------------------

const FRAMING_PRICE = 1000; // R1000 flat add-on

const CATEGORIES = ["All", "Paintings", "Mixed Media", "Pottery"] as const;

function currency(n: number) {
  return formatCurrency(n);
}

function classNames(...xs: (string | false | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

function useShuffled<T>(items: T[]) {
  const [shuffledItems, setShuffledItems] = useState<T[]>(items);
  
  useEffect(() => {
    // Only shuffle on client side after hydration
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffledItems(copy);
  }, [items]);

  return shuffledItems;
}

function Header({ onOpenCart, cartItemCount }: { onOpenCart: () => void; cartItemCount: number }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              aria-label="Menu"
              className="lg:hidden p-2 rounded-xl hover:bg-neutral-100"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Bekker <span className="text-neutral-500">Fine</span> Art
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-sm">
            {[
              ["Home", "#home"],
              ["Gallery", "#gallery"],
              ["Pottery", "#pottery"],
              ["About", "#about"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="hover:text-neutral-900 text-neutral-600">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
            >
              <Phone className="h-4 w-4" /> Enquire
            </a>
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-xl hover:bg-neutral-100"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden pb-3"
            >
              <div className="flex flex-col gap-2 text-sm">
                {[
                  ["Home", "#home"],
                  ["Gallery", "#gallery"],
                  ["Pottery", "#pottery"],
                  ["About", "#about"],
                  ["Contact", "#contact"],
                ].map(([label, href]) => (
                  <a key={label} href={href} className="px-2 py-2 rounded-lg hover:bg-neutral-100">
                    {label}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function Slideshow() {
  const [idx, setIdx] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    // Initial load from API first, fallback to localStorage
    const loadHeroSlides = async () => {
      try {
        const apiSlides = await getHeroSlidesFromAPI();
        setHeroSlides(apiSlides);
      } catch (error) {
        setHeroSlides(getHeroSlides());
      }
    };
    loadHeroSlides();
    
    // Listen for hero slide updates from admin panel
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bekker-hero-slides' && e.newValue) {
        try {
          setHeroSlides(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating hero slides from storage:', error);
        }
      }
    };
    
    // Also listen for a custom event for same-tab updates
    const handleCustomUpdate = async () => {
      try {
        const apiSlides = await getHeroSlidesFromAPI();
        setHeroSlides(apiSlides);
      } catch (error) {
        setHeroSlides(getHeroSlides());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('hero-slides-updated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('hero-slides-updated', handleCustomUpdate);
    };
  }, []);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  if (heroSlides.length === 0) {
    return <div className="h-[72vh] bg-neutral-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <section id="home" className="relative h-[72vh] sm:h-[78vh] lg:h-[82vh] overflow-hidden">
      {heroSlides.map((s, i) => (
        <AnimatePresence key={i}>
          {i === idx && (
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              <img src={s.image} alt="slide" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-end lg:items-center">
                <div className="mx-auto max-w-7xl px-6 pb-10 lg:pb-0 w-full">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-2xl text-white"
                  >
                    <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                      {s.headline}
                    </h1>
                    <p className="mt-3 text-lg sm:text-xl text-neutral-200">{s.sub}</p>
                    <div className="mt-6 flex gap-3">
                      <a
                        href={s.ctaLink || "#gallery"}
                        className="px-4 py-2.5 rounded-xl bg-white text-neutral-900 hover:bg-neutral-200"
                      >
                        {s.cta}
                      </a>
                      <a
                        href="#pottery"
                        className="px-4 py-2.5 rounded-xl bg-black/50 backdrop-blur border border-white/20 text-white hover:bg-black/60"
                      >
                        Explore Pottery
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ))}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setIdx((idx - 1 + heroSlides.length) % heroSlides.length)}
          className="pointer-events-auto p-2 rounded-full bg-white/70 hover:bg-white shadow"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIdx((idx + 1) % heroSlides.length)}
          className="pointer-events-auto p-2 rounded-full bg-white/70 hover:bg-white shadow"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={classNames(
              "h-2.5 w-2.5 rounded-full border border-white/60",
              i === idx ? "bg-white" : "bg-transparent"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

function Collage() {
  const [collage, setCollage] = useState<Collage | null>(null);

  useEffect(() => {
    // Load collage from API first, fallback to localStorage
    const loadCollage = async () => {
      try {
        const apiCollage = await getCollageFromAPI();
        setCollage(apiCollage);
      } catch (error) {
        setCollage(getCollage());
      }
    };
    loadCollage();
    
    // Listen for collage updates from admin panel
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bekker-collage' && e.newValue) {
        try {
          setCollage(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating collage from storage:', error);
        }
      }
    };
    
    // Also listen for a custom event for same-tab updates
    const handleCustomUpdate = async () => {
      try {
        const apiCollage = await getCollageFromAPI();
        setCollage(apiCollage);
      } catch (error) {
        setCollage(getCollage());
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('collage-updated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('collage-updated', handleCustomUpdate);
    };
  }, []);

  // Show loading state or default content during hydration
  if (!collage) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">A glance at the work</h2>
          <p className="text-neutral-600 mt-2 max-w-2xl">
            A mosaic of recent paintings and ceramic pieces. Each work tells a story — arranged as a living collage.
          </p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="aspect-square bg-neutral-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="mb-8">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold">{collage.title}</h2>
        <p className="text-neutral-600 mt-2 max-w-2xl">
          {collage.description}
        </p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {collage.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`collage-${i}`}
            className="aspect-square object-cover rounded-2xl shadow-sm"
          />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ item, onOpen }: { item: Artwork; onOpen: (id: string) => void }) {
  const isSold = item.status === "sold";
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-black/5">
      <div className="relative">
        <img src={item.images[0]} alt={item.title} className="h-64 w-full object-cover" />
        {isSold && (
          <div className="absolute top-3 left-3 bg-white/90 text-neutral-900 text-xs font-semibold px-2 py-1 rounded">
            SOLD
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-medium text-neutral-900 leading-snug">{item.title}</h3>
            <p className="text-sm text-neutral-500">{item.size} • {item.medium}</p>
          </div>
          <div className="text-right">
            <div className="font-semibold">{currency(item.price)}</div>
            <div className="text-xs text-neutral-500">{item.category}</div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => onOpen(item.id)}
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50"
          >
            View
          </button>
          <button
            onClick={() => onOpen(item.id)}
            disabled={isSold}
            className={classNames(
              "flex-1 px-3 py-2 rounded-xl",
              isSold
                ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            )}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({
  item,
  onClose,
  onAdd,
}: {
  item: Artwork;
  onClose: () => void;
  onAdd: (opts: { framing: null | "Light" | "Medium" | "Dark" }) => void;
}) {
  const [active, setActive] = useState(0);
  const [framing, setFraming] = useState<null | "Light" | "Medium" | "Dark">(null);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <img
                src={item.images[active]}
                alt={item.title}
                className="h-80 sm:h-[28rem] w-full object-cover"
              />
              <button
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white"
                onClick={onClose}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 rounded-full p-1">
                {item.images.map((src: string, i: number) => (
                  <button
                    key={i}
                    className={classNames(
                      "h-12 w-12 overflow-hidden rounded-xl ring-1 ring-black/10",
                      i === active && "ring-2 ring-black"
                    )}
                    onClick={() => setActive(i)}
                  >
                    <img src={src} alt="thumb" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">{item.title}</h3>
              <div className="mt-2 text-neutral-600">{item.size} • {item.medium}</div>
              <div className="mt-4 flex items-center gap-3">
                <div className="text-2xl font-semibold">{currency(item.price)}</div>
                {item.status === "sold" && (
                  <span className="text-sm px-2 py-1 rounded bg-neutral-100 border">SOLD</span>
                )}
              </div>

              <div className="mt-6">
                <div className="font-medium">Framing (optional)</div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["Light", "Medium", "Dark"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFraming((f) => (f === opt ? null : opt))}
                      className={classNames(
                        "px-3 py-2 rounded-xl border",
                        framing === opt
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 hover:bg-neutral-50"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  Framing adds a flat {currency(FRAMING_PRICE)} to any size painting.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => onAdd({ framing })}
                  disabled={item.status === "sold"}
                  className={classNames(
                    "flex-1 px-4 py-3 rounded-xl",
                    item.status === "sold"
                      ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" /> Add to Cart
                  </span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-neutral-200 hover:bg-neutral-50"
                >
                  Close
                </button>
              </div>

              <div className="mt-8 text-sm text-neutral-600">
                <p>
                  Each artwork is one-of-a-kind. Colours may vary slightly between screen and reality.
                  Shipping quotes provided after purchase; framing lead time 5–7 business days.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Gallery({
  artworks,
  initialCategory = "All",
  onOpen,
  anchorId = "gallery",
}: {
  artworks: Artwork[];
  initialCategory?: (typeof CATEGORIES)[number];
  onOpen: (id: string) => void;
  anchorId?: string;
}) {
  const [content, setContent] = useState<Content | null>(null);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(initialCategory);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Load content from API first, fallback to localStorage
    const loadContent = async () => {
      try {
        const apiContent = await getContentFromAPI();
        setContent(apiContent);
      } catch (error) {
        setContent(getContent());
      }
    };
    loadContent();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bekker-content' && e.newValue) {
        try {
          setContent(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing content from storage:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const shuffled = useShuffled(artworks);

  const filtered = shuffled.filter((a) => {
    const inCategory = category === "All" || a.category === category;
    const matches =
      !query ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.medium.toLowerCase().includes(query.toLowerCase());
    return inCategory && matches;
  });

  return (
    <section id={anchorId} className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">{content?.gallery?.title || "Gallery"}</h2>
          <p className="text-neutral-600 mt-2 max-w-2xl">
            {content?.gallery?.description || "Mixed order of sold & available works as requested. Use the filters to browse."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or medium"
              className="w-full sm:w-80 pl-9 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-300"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={classNames(
                  "whitespace-nowrap px-3 py-2 rounded-xl border",
                  category === c
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 hover:bg-neutral-50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <ProductCard key={item.id} item={item} onOpen={onOpen} />)
        )}
      </div>
    </section>
  );
}

function About() {
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    // Load content from API first, fallback to localStorage
    const loadContent = async () => {
      try {
        const apiContent = await getContentFromAPI();
        setContent(apiContent);
      } catch (error) {
        setContent(getContent());
      }
    };
    loadContent();
    
    // Listen for content updates from admin panel
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bekker-content' && e.newValue) {
        try {
          setContent(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating content from storage:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Show loading state or default content during hydration
  if (!content) {
    return (
      <section id="about" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src="/images/stefan.jpeg" 
                alt="Stefan Bekker" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-neutral-900 rounded-full opacity-10" />
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-neutral-300 rounded-full opacity-20" />
          </div>
          
          <div className="lg:pl-8">
            <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full text-sm text-neutral-600 mb-6">
              Meet the Artist
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-6">
              Stefan Bekker
            </h2>
            <div className="space-y-4 text-lg text-neutral-700 leading-relaxed">
              <p>
                Award-winning chef Stefan Bekker escapes career stress through emotional art that speaks to our internal selves.
              </p>
              <p>
                With years of experience crafting edible art, Stefan brings the same passion and attention to detail to his abstract works. Each piece is a meditation on transformation and the courage to start again.
              </p>
              <p className="text-neutral-600">
                From the kitchen to the canvas, every creation tells a story of resilience, beauty, and the endless pursuit of authentic expression.
              </p>
            </div>
            <div className="mt-8 flex gap-4">
              <a
                href="#gallery"
                className="inline-flex items-center px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
              >
                View Artwork
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <img 
              src={content.about.artistImage || "/images/stefan.jpeg"} 
              alt={content.about.title} 
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-neutral-900 rounded-full opacity-10" />
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-neutral-300 rounded-full opacity-20" />
        </div>
        
        <div className="lg:pl-8">
          <div className="inline-block px-4 py-2 bg-neutral-100 rounded-full text-sm text-neutral-600 mb-6">
            {content.about.subtitle}
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold leading-tight mb-6">
            {content.about.title}
          </h2>
          <div className="space-y-4 text-lg text-neutral-700 leading-relaxed">
            {content.about.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className={index === content.about.description.split('\n\n').length - 1 ? "text-neutral-600" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <a
              href="#gallery"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
            >
              View Artwork
            </a>
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [content, setContent] = useState<Content | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Load content from API first, fallback to localStorage
    const loadContent = async () => {
      try {
        const apiContent = await getContentFromAPI();
        setContent(apiContent);
      } catch (error) {
        setContent(getContent());
      }
    };
    loadContent();
    
    // Listen for content updates from admin panel
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bekker-content' && e.newValue) {
        try {
          setContent(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating content from storage:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzdEjBW8cpfs8UZmWk195lcI_NX2AJSzc7EVe6T3XaxBN5VH2aXqm-Xe5tr3KVuCXE/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'BekkerfineArt',
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          timestamp: new Date().toISOString()
        })
      });
      
      // Since we're using no-cors, we can't read the response
      // We'll assume success if no error is thrown
      setSubmitStatus('success');
      
      // Save contact message to admin system
      addContactMessage({
        type: 'general',
        name: contactForm.name,
        email: contactForm.email,
        message: contactForm.message
      });
      
      // Add activity for contact form submission
      addActivity({
        type: 'contact_received',
        title: 'New inquiry received',
        description: `Contact form submitted by ${contactForm.name}`,
        metadata: { name: contactForm.name, email: contactForm.email }
      });
      
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state or default content during hydration
  if (!content) {
    return (
      <section id="contact" className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">Get in touch</h2>
            <p className="mt-3 text-neutral-600">
              For commissions, studio visits, or purchase enquiries, send a message. We aim to respond within 24 hours.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-700">
              <a href="tel:+27110839898" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-neutral-50">
                <Phone className="h-4 w-4" /> +27 11 083 9898
              </a>
              <a href="mailto:info@bekkerfineart.co.za" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-neutral-50">
                <Mail className="h-4 w-4" /> info@bekkerfineart.co.za
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-neutral-50">
                <Instagram className="h-4 w-4" /> @bekkerfineart
              </a>
            </div>
          </div>
          <form
            onSubmit={handleContactSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm ring-1 ring-black/5"
          >
            {submitStatus === 'success' && (
              <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                Thank you! Your message has been sent successfully. We&apos;ll respond within 24 hours.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                Sorry, there was an error sending your message. Please try again or contact us directly.
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-neutral-600">Name</label>
                <input 
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2" 
                  required 
                />
              </div>
              <div>
                <label className="text-sm text-neutral-600">Email</label>
                <input 
                  type="email" 
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2" 
                  required 
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-600">Message</label>
                <textarea 
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2" 
                  rows={5} 
                  required 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="mt-6 w-full px-4 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold">{content.contact.title}</h2>
          <p className="mt-3 text-neutral-600">
            {content.contact.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-700">
            <a href={`tel:${content.contact.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-neutral-50">
              <Phone className="h-4 w-4" /> {content.contact.phone}
            </a>
            <a href={`mailto:${content.contact.email}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-neutral-50">
              <Mail className="h-4 w-4" /> {content.contact.email}
            </a>
            <a href="#" className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border hover:bg-neutral-50">
              <Instagram className="h-4 w-4" /> {content.contact.instagram}
            </a>
          </div>
        </div>
        <form
          onSubmit={handleContactSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm ring-1 ring-black/5"
        >
          {submitStatus === 'success' && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              Thank you! Your message has been sent successfully. We&apos;ll respond within 24 hours.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              Sorry, there was an error sending your message. Please try again or contact us directly.
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-neutral-600">Name</label>
              <input 
                value={contactForm.name}
                onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2" 
                required 
              />
            </div>
            <div>
              <label className="text-sm text-neutral-600">Email</label>
              <input 
                type="email" 
                value={contactForm.email}
                onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2" 
                required 
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-neutral-600">Message</label>
              <textarea 
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2" 
                rows={5} 
                required 
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-6 w-full px-4 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-neutral-600">© {new Date().getFullYear()} Bekker Fine Art. All rights reserved.</div>
        <div className="flex items-center gap-3 text-sm">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="inline-flex items-center gap-2"><Instagram className="h-4 w-4"/> Instagram</a>
        </div>
      </div>
    </footer>
  );
}

export default function BekkerFineArtPage() {
  const [modalId, setModalId] = useState<string | null>(null);
  const [cart, setCart] = useState<{ id: string; framing: null | "Light" | "Medium" | "Dark"; quantity: number; dateAdded: string }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Load artworks and cart from localStorage on component mount
  useEffect(() => {
    // Load from API first, fallback to localStorage
    const loadArtworks = async () => {
      try {
        const apiArtworks = await getArtworksFromAPI();
        setArtworks(apiArtworks);
      } catch (error) {
        setArtworks(getArtworks());
      }
    };
    
    loadArtworks();
    
    const savedCart = localStorage.getItem('bekker-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Listen for artwork updates from admin panel
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bekker-artworks' && e.newValue) {
        try {
          setArtworks(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error updating artworks from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bekker-cart', JSON.stringify(cart));
  }, [cart]);
  const activeItem = artworks.find((a) => a.id === modalId);

  function addToCart(id: string, framing: null | "Light" | "Medium" | "Dark") {
    const existingItem = cart.find((item) => item.id === id && item.framing === framing);
    
    if (existingItem) {
      // Update quantity if item already exists
      setCart((c) => c.map(item => 
        item.id === id && item.framing === framing 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item
      setCart((c) => [...c, { 
        id, 
        framing, 
        quantity: 1, 
        dateAdded: new Date().toISOString() 
      }]);
    }
    
    setCartOpen(true);
    
    // Show success message
    const artwork = artworks.find(a => a.id === id);
    if (artwork) {
      // You could add a toast notification here
      console.log(`Added "${artwork.title}" to cart`);
    }
  }

  function removeFromCart(id: string, framing: null | "Light" | "Medium" | "Dark") {
    setCart((c) => c.filter((item) => !(item.id === id && item.framing === framing)));
  }

  function updateCartQuantity(id: string, framing: null | "Light" | "Medium" | "Dark", newQuantity: number) {
    if (newQuantity <= 0) {
      removeFromCart(id, framing);
      return;
    }
    
    setCart((c) => c.map(item => 
      item.id === id && item.framing === framing 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  }

  function clearCart() {
    setCart([]);
    localStorage.removeItem('bekker-cart');
  }

  const cartDetail = cart.map((c) => {
    const item = artworks.find((a) => a.id === c.id)!;
    const framingCost = c.framing ? FRAMING_PRICE : 0;
    const itemTotal = (item.price + framingCost) * c.quantity;
    return { ...c, item, subtotal: itemTotal };
  });

  const cartTotal = cartDetail.reduce((sum, x) => sum + x.subtotal, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-neutral-50 text-neutral-900">
      <Header onOpenCart={() => setCartOpen(true)} cartItemCount={cartItemCount} />
      <main>
        <Slideshow />
        <Collage />
        <Gallery artworks={artworks} onOpen={(id) => setModalId(id)} />
        <About />
        <Contact />
      </main>
      <Footer />

      <AnimatePresence>
        {activeItem && (
          <ProductModal
            item={activeItem}
            onClose={() => setModalId(null)}
            onAdd={({ framing }) => {
              addToCart(activeItem.id, framing);
              setModalId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="font-semibold">Your Cart</div>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl hover:bg-neutral-100" aria-label="Close cart">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-auto max-h-[calc(100vh-160px)]">
              {cartDetail.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <div className="text-neutral-600">Your cart is empty.</div>
                  <div className="text-sm text-neutral-500 mt-1">Browse our gallery to add artworks.</div>
                </div>
              ) : (
                cartDetail.map((line, i) => (
                  <div key={`${line.id}-${line.framing}-${i}`} className="flex gap-3 border rounded-2xl p-3">
                    <img src={line.item.images[0]} alt={line.item.title} className="h-20 w-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium leading-snug">{line.item.title}</div>
                          <div className="text-xs text-neutral-500">{line.item.size}</div>
                          {line.item.status === "sold" && (
                            <div className="text-xs text-red-500 font-medium">⚠ This item has been sold</div>
                          )}
                        </div>
                        <button
                          className="text-xs text-neutral-500 hover:text-neutral-800"
                          onClick={() => removeFromCart(line.id, line.framing)}
                        >
                          Remove
                        </button>
                      </div>
                      
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center border rounded">
                          <button
                            onClick={() => updateCartQuantity(line.id, line.framing, line.quantity - 1)}
                            className="px-2 py-1 hover:bg-neutral-100"
                          >
                            -
                          </button>
                          <span className="px-2 py-1 min-w-[40px] text-center">{line.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(line.id, line.framing, line.quantity + 1)}
                            className="px-2 py-1 hover:bg-neutral-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded border">
                          Price: {currency(line.item.price)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded border">
                          Framing: {line.framing ? `${line.framing} (+${currency(FRAMING_PRICE)})` : "None"}
                        </span>
                      </div>
                      <div className="mt-2 font-semibold">Subtotal: {currency(line.subtotal)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Total</div>
                <div className="font-semibold">{currency(cartTotal)}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => clearCart()}
                  disabled={cartDetail.length === 0}
                  className="px-4 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Cart
                </button>
                <button
                  disabled={cartDetail.length === 0}
                  onClick={() => {
                    setCartOpen(false);
                    setCheckoutOpen(true);
                  }}
                  className={classNames(
                    "flex-1 px-4 py-3 rounded-xl",
                    cartDetail.length === 0
                      ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  )}
                >
                  Proceed to Checkout ({cartItemCount} {cartItemCount === 1 ? 'item' : 'items'})
                </button>
              </div>
              <p className="text-xs text-neutral-500 text-center">
                Secure inquiry form • No payment required upfront • Custom quotes provided
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setCheckoutOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Purchase Inquiry</h3>
                  <p className="text-neutral-600">Submit your details to proceed with your order</p>
                </div>
                <button
                  onClick={() => setCheckoutOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-xl"
                  aria-label="Close checkout"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!orderSubmitted ? (
                <CheckoutForm 
                  cartDetail={cartDetail}
                  cartTotal={cartTotal}
                  onSubmit={() => {
                    setOrderSubmitted(true);
                    // Optionally clear cart after successful submission
                    // clearCart();
                  }}
                />
              ) : (
                <OrderConfirmation 
                  onClose={() => {
                    setOrderSubmitted(false);
                    setCheckoutOpen(false);
                    clearCart();
                  }}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckoutForm({ 
  cartDetail, 
  cartTotal, 
  onSubmit 
}: { 
  cartDetail: Array<{
    id: string;
    framing: null | "Light" | "Medium" | "Dark";
    quantity: number;
    dateAdded: string;
    item: Artwork;
    subtotal: number;
  }>;
  cartTotal: number;
  onSubmit: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryPreference: "collection",
    specialRequests: "",
    hearAbout: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare checkout data for Google Apps Script
      const checkoutData = {
        formType: 'BekkerfineArt',
        type: 'checkout',
        customerInfo: formData,
        items: cartDetail.map(item => ({
          artworkId: item.item.id,
          title: item.item.title,
          price: item.item.price,
          framing: item.framing,
          quantity: item.quantity,
          subtotal: item.subtotal
        })),
        total: cartTotal,
        timestamp: new Date().toISOString()
      };

      await fetch('https://script.google.com/macros/s/AKfycbzdEjBW8cpfs8UZmWk195lcI_NX2AJSzc7EVe6T3XaxBN5VH2aXqm-Xe5tr3KVuCXE/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });
      
      // Save purchase inquiry to admin system
      addContactMessage({
        type: 'purchase_inquiry',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Purchase inquiry for ${cartDetail.length} item${cartDetail.length === 1 ? '' : 's'}. ${formData.specialRequests || 'No special requests.'}`,
        artworkIds: cartDetail.map(item => item.item.id),
        totalAmount: cartTotal,
        deliveryPreference: formData.deliveryPreference,
        specialRequests: formData.specialRequests
      });
      
      // Add activity for checkout inquiry
      addActivity({
        type: 'contact_received',
        title: 'Purchase inquiry received',
        description: `Checkout inquiry from ${formData.name} for ${cartDetail.length} item${cartDetail.length === 1 ? '' : 's'}`,
        metadata: { 
          name: formData.name, 
          email: formData.email, 
          total: cartTotal,
          itemCount: cartDetail.length 
        }
      });
      
      setIsSubmitting(false);
      onSubmit();
    } catch (error) {
      console.error('Error submitting checkout form:', error);
      setIsSubmitting(false);
      // You might want to show an error message to the user here
      alert('There was an error submitting your inquiry. Please try again or contact us directly.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-neutral-50 rounded-2xl p-4">
        <h4 className="font-semibold mb-3">Order Summary</h4>
        <div className="space-y-2">
          {cartDetail.map((line, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {line.item.title} 
                {line.framing && ` (${line.framing} frame)`}
                {line.quantity > 1 && ` × ${line.quantity}`}
              </span>
              <span>{currency(line.subtotal)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>{currency(cartTotal)}</span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="space-y-4">
        <h4 className="font-semibold">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="+27 XX XXX XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Delivery Preference</label>
            <select
              value={formData.deliveryPreference}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryPreference: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="collection">Collection from studio</option>
              <option value="delivery">Delivery (quote will be provided)</option>
              <option value="courier">Courier service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delivery Address (only if delivery selected) */}
      {formData.deliveryPreference === "delivery" && (
        <div className="space-y-4">
          <h4 className="font-semibold">Delivery Address</h4>
          <div>
            <label className="block text-sm font-medium mb-2">Street Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
              placeholder="Street address"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
                placeholder="Postal code"
              />
            </div>
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Special Requests or Questions</label>
          <textarea
            value={formData.specialRequests}
            onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
            rows={4}
            placeholder="Any special requests, questions about the artwork, or preferred contact times..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">How did you hear about us?</label>
          <select
            value={formData.hearAbout}
            onChange={(e) => setFormData(prev => ({ ...prev, hearAbout: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="">Select an option</option>
            <option value="google">Google search</option>
            <option value="social">Social media</option>
            <option value="referral">Friend or family referral</option>
            <option value="gallery">Art gallery or exhibition</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <h5 className="font-semibold text-blue-900 mb-2">What happens next?</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• We&apos;ll review your inquiry and contact you within 24 hours</li>
            <li>• Discuss payment options and delivery/collection arrangements</li>
            <li>• Provide final quote including any delivery or framing costs</li>
            <li>• Arrange secure payment and artwork transfer</li>
          </ul>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isSubmitting ? "Submitting Inquiry..." : "Submit Purchase Inquiry"}
        </button>
        
        <p className="text-xs text-neutral-500 text-center mt-3">
          By submitting this form, you agree to be contacted regarding your artwork inquiry.
        </p>
      </div>
    </form>
  );
}

function OrderConfirmation({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold mb-2">Inquiry Submitted Successfully!</h3>
      <p className="text-neutral-600 mb-6 max-w-md mx-auto">
        Thank you for your interest in our artwork. We&apos;ve received your inquiry and will contact you within 24 hours to discuss your purchase.
      </p>
      
      <div className="bg-neutral-50 rounded-2xl p-4 mb-6 text-left">
        <h4 className="font-semibold mb-2">What&apos;s next:</h4>
        <ul className="text-sm text-neutral-600 space-y-1">
          <li>📧 Check your email for a confirmation</li>
          <li>📞 We&apos;ll call or email you to discuss details</li>
          <li>💳 Arrange secure payment methods</li>
          <li>🎨 Schedule collection or delivery</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800"
        >
          Continue Shopping
        </button>
        <a
          href="#contact"
          onClick={onClose}
          className="flex-1 px-6 py-3 border border-neutral-200 rounded-xl hover:bg-neutral-50 text-center"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}