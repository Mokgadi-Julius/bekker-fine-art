import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'data', 'artworks.json');

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

export async function POST() {
  try {
    const dataDir = join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(INITIAL_ARTWORKS, null, 2));
    
    return NextResponse.json({ 
      success: true, 
      message: 'Artworks reset to initial state',
      artworks: INITIAL_ARTWORKS 
    });
  } catch (error) {
    console.error('Error resetting artworks:', error);
    return NextResponse.json({ error: 'Failed to reset artworks' }, { status: 500 });
  }
}