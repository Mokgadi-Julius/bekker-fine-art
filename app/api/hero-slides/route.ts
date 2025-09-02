import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'hero-slides.json');

const INITIAL_HERO_SLIDES = [
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

async function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function GET() {
  try {
    await ensureDataDir();
    
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      const slides = JSON.parse(data);
      return NextResponse.json(slides);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_HERO_SLIDES, null, 2));
      return NextResponse.json(INITIAL_HERO_SLIDES);
    }
  } catch (error) {
    console.error('Error reading hero slides:', error);
    return NextResponse.json(INITIAL_HERO_SLIDES);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const slides = await request.json();
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(slides, null, 2));
    
    return NextResponse.json({ success: true, slides });
  } catch (error) {
    console.error('Error saving hero slides:', error);
    return NextResponse.json({ error: 'Failed to save hero slides' }, { status: 500 });
  }
}