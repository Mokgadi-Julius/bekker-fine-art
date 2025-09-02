import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'artworks.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Default artwork data
const INITIAL_ARTWORKS = [
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

// GET - Fetch all artworks
export async function GET() {
  try {
    await ensureDataDir();
    
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      const artworks = JSON.parse(data);
      return NextResponse.json(artworks);
    } catch {
      // File doesn't exist, return initial data
      await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_ARTWORKS, null, 2));
      return NextResponse.json(INITIAL_ARTWORKS);
    }
  } catch (error) {
    console.error('Error reading artworks:', error);
    return NextResponse.json(INITIAL_ARTWORKS);
  }
}

// POST - Create new artwork
export async function POST(request: NextRequest) {
  try {
    const newArtwork = await request.json();
    await ensureDataDir();
    
    let artworks = INITIAL_ARTWORKS;
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      artworks = JSON.parse(data);
    } catch {
      // File doesn't exist, use initial data
    }
    
    // Add new artwork
    artworks.push(newArtwork);
    await fs.writeFile(DATA_FILE, JSON.stringify(artworks, null, 2));
    
    return NextResponse.json({ success: true, artwork: newArtwork });
  } catch (error) {
    console.error('Error creating artwork:', error);
    return NextResponse.json({ error: 'Failed to create artwork' }, { status: 500 });
  }
}

// PUT - Update artwork
export async function PUT(request: NextRequest) {
  try {
    const updatedArtwork = await request.json();
    await ensureDataDir();
    
    let artworks = INITIAL_ARTWORKS;
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      artworks = JSON.parse(data);
    } catch {
      // File doesn't exist, use initial data
    }
    
    // Update artwork
    const index = artworks.findIndex(a => a.id === updatedArtwork.id);
    if (index !== -1) {
      artworks[index] = updatedArtwork;
      await fs.writeFile(DATA_FILE, JSON.stringify(artworks, null, 2));
      return NextResponse.json({ success: true, artwork: updatedArtwork });
    } else {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating artwork:', error);
    return NextResponse.json({ error: 'Failed to update artwork' }, { status: 500 });
  }
}

// DELETE - Delete artwork
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Artwork ID required' }, { status: 400 });
    }
    
    await ensureDataDir();
    
    let artworks = INITIAL_ARTWORKS;
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      artworks = JSON.parse(data);
    } catch {
      // File doesn't exist, use initial data
    }
    
    // Remove artwork
    artworks = artworks.filter(a => a.id !== id);
    await fs.writeFile(DATA_FILE, JSON.stringify(artworks, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting artwork:', error);
    return NextResponse.json({ error: 'Failed to delete artwork' }, { status: 500 });
  }
}